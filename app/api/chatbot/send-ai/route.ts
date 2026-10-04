import { VEXIM_PHONE_DISPLAY } from "@/lib/contact-info"
import {
  HANDOFF_CONNECT_QUESTION,
  extractLeadProfileFromMessages,
  shouldSummarizeAndInvite,
  summarizeLead,
  type LeadProfile,
} from "@/lib/lead-profile"
import { NextRequest, NextResponse, after } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateAIResponse, loadAIConfig } from "@/lib/ai-service"
import {
  evaluateRules,
  getContactRequestMessage,
  shouldAlertAdminOnAiReply,
  type MessageContext,
} from "@/lib/rule-engine"
import {
  notifyAdmin,
  notifyAdminNewHandover,
  sendLeadSummaryEmail,
} from "@/lib/notification-service"
import { shouldEmailLeadSummary } from "@/lib/lead-summary-email"

/**
 * Gộp thêm dữ liệu vào metadata của hội thoại.
 * Ghi kiểu `update({ metadata: {...} })` là GHI ĐÈ — sẽ xoá mất hồ sơ khách,
 * service_tag… do các nhánh khác đã lưu trước đó.
 */
/** Chống spam: mỗi hội thoại chỉ báo admin thêm tối đa 1 lần / 30 phút. */
const HOT_LEAD_ALERT_COOLDOWN_MS = 30 * 60 * 1000

async function mergeConversationMetadata(supabase: any, conversationId: string, patch: Record<string, any>) {
  const { data } = await supabase
    .from("conversations")
    .select("metadata")
    .eq("id", conversationId)
    .single()

  await supabase
    .from("conversations")
    .update({ metadata: { ...(data?.metadata || {}), ...patch } })
    .eq("id", conversationId)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer_id, customer_name, message_text, conversation_id, lead_profile, has_file, attachment_url, attachment_name } = body

    console.log("[v0] Processing AI message:", { customer_id, message_text })

    const supabase = await createClient()

    // Tìm hoặc tạo conversation
    let convId = conversation_id
    if (!convId) {
      const { data: existingConv, error: searchError } = await supabase
        .from("conversations")
        .select("id")
        .eq("customer_id", customer_id)
        .eq("channel", "website")
        .eq("status", "active")
        .maybeSingle()

      if (searchError) {
        console.error("[v0] Error searching conversation:", searchError)
      }

      if (existingConv) {
        convId = existingConv.id
      } else {
        const { data: newConv, error: convError } = await supabase
          .from("conversations")
          .insert({
            customer_id,
            customer_name,
            channel: "website",
            status: "active",
            last_message: message_text,
          })
          .select("id")
          .single()

        if (convError) throw convError
        convId = newConv.id
      }
    }

    // Check if conversation is handed over to agent
    const { data: activeHandover } = await supabase
      .from("conversation_handovers")
      .select("id, agent_name")
      .eq("conversation_id", convId)
      .eq("status", "active")
      .maybeSingle()

    // Lưu tin nhắn của customer
    const { error: msgError } = await supabase.from("chat_messages").insert({
      conversation_id: convId,
      sender_type: "customer",
      message_text,
    })

    if (msgError) throw msgError

    // If handed over, don't generate AI response
    if (activeHandover) {
      console.log("[v0] Conversation handed over to agent:", activeHandover.agent_name)
      return NextResponse.json({
        status: "handed_over",
        message: `Cuộc trò chuyện này đang được xử lý bởi ${activeHandover.agent_name}. Vui lòng đợi phản hồi.`,
        response: {
          conversation_id: convId,
          message_text: `Cuộc trò chuyện này đang được xử lý bởi chuyên viên. Chúng tôi sẽ phản hồi bạn sớm nhất có thể.`,
          timestamp: new Date().toISOString(),
          handed_over: true,
        },
      })
    }

    // Metadata hội thoại (để chống spam thông báo lead nóng)
    const { data: convRow } = await supabase
      .from("conversations")
      .select("metadata")
      .eq("id", convId)
      .maybeSingle()
    const convMetadata: Record<string, any> = (convRow?.metadata || {}) as Record<string, any>

    // Load conversation history (last 10 messages)
    const { data: historyData } = await supabase
      .from("chat_messages")
      .select("sender_type, message_text")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: false })
      .limit(10)

    const conversationHistory =
      historyData
        ?.reverse()
        .map((msg) => ({
          role: msg.sender_type === "customer" ? "user" : "assistant",
          content: msg.message_text,
        })) || []

    // Load AI config
    const aiConfig = await loadAIConfig(supabase)

    // Load RAG setting
    const { data: ragConfig } = await supabase
      .from("ai_config")
      .select("value")
      .eq("key", "rag_enabled")
      .maybeSingle()

    const ragEnabled = ragConfig?.value === true

    // Hồ sơ khách: gộp thông tin khung chat gửi lên với thông tin trích được từ
    // chính hội thoại (khách đổi máy/thiết bị vẫn giữ được dữ liệu đã nói).
    const leadProfile: LeadProfile = {
      ...extractLeadProfileFromMessages([
        ...(historyData || [])
          .filter((m: any) => m.sender_type === "customer")
          .map((m: any) => m.message_text),
        message_text,
      ]),
      ...(lead_profile && typeof lead_profile === "object" ? lead_profile : {}),
    }
    console.log("[v0] Hồ sơ khách:", summarizeLead(leadProfile).join(" | ") || "(chưa thu thập được gì)")

    // Evaluate rules first to determine action
    // Khách vừa gửi file (nhãn sản phẩm, danh mục…) -> rule LQ-04 chuyển chuyên viên,
    // vì file cần người thật xem chứ AI không tự đoán được.
    const messageForRules = attachment_url
      ? `${message_text} [Đã gửi file: ${attachment_name || "tệp đính kèm"}]`
      : message_text

    const ruleContext: MessageContext = {
      message: messageForRules,
      conversationHistory: conversationHistory.map(m => m.content),
      hasFile: has_file === true,
      // KHÔNG truyền customer_name vào companyName: khung chat luôn gửi tên mặc
      // định "Khách hàng", mà rule LQ-01 coi đó là tên công ty -> mọi tin nhắn
      // (kể cả "xin chào") đều bị chuyển thành xin số điện thoại.
      customerInfo: {},
    }

    const ruleResult = evaluateRules(ruleContext)
    console.log("[v0] Rule evaluation result:", ruleResult)

    // Lưu hồ sơ khách vào hội thoại để chuyên viên đọc được ngay, không phải hỏi lại
    await mergeConversationMetadata(supabase, convId, {
      lead_profile: leadProfile,
      lead_summary: summarizeLead(leadProfile),
    })

    // Trợ lý vừa TỔNG HỢP xong thông tin (đủ 4 thông tin bắt buộc, hoặc khách hỏi
    // giá) -> gửi hồ sơ khách về email admin. Chủ doanh nghiệp chốt: thông báo phải
    // ra ngoài, không để chuyên viên chỉ thấy khi mở trang quản trị.
    //
    // Dùng after() của Next 15: email được gửi SAU khi trả lời khách, nên khách
    // không phải chờ thêm 1–3 giây cho mỗi lượt chat.
    // Lượt này có gửi email HỒ SƠ KHÁCH không? (dùng để không gửi thêm email thông
    // báo thứ hai cho cùng một thời điểm — push và trang quản trị vẫn báo bình thường)
    const summaryEmailGoingOut =
      shouldSummarizeAndInvite(leadProfile, message_text) &&
      shouldEmailLeadSummary(leadProfile, convMetadata)

    if (summaryEmailGoingOut) {
      const messagesForEmail = (historyData || []).map((row: any) => ({
        sender_type: row.sender_type,
        message_text: row.message_text,
      }))
      after(async () => {
        const result = await sendLeadSummaryEmail({
          conversationId: convId,
          profile: leadProfile,
          messages: messagesForEmail,
          supabase,
        })
        console.log("[v0] Email hồ sơ khách hàng:", result)
      })
    }

    // Handle HANDOFF_TO_ADMIN action
    if (ruleResult.action === "HANDOFF_TO_ADMIN") {
      // Create handover immediately
      await supabase.from("conversation_handovers").insert({
        conversation_id: convId,
        from_type: "bot",
        to_type: "agent",
        reason: ruleResult.reason,
        status: "active",
      })

      // Update conversation with tags
      await supabase
        .from("conversations")
        .update({ handover_mode: "manual" })
        .eq("id", convId)

      await mergeConversationMetadata(supabase, convId, {
        service_tag: ruleResult.tags.service_tag,
        reason: ruleResult.tags.reason,
        urgency: ruleResult.tags.urgency,
        rule_id: ruleResult.ruleId,
        ask_connect: true,
      })

      // Save bot message explaining handover.
      // Nếu khách VỪA ĐỒNG Ý (SI-02) thì không hỏi lại "có muốn kết nối không" —
      // hỏi lại ngay sau khi khách vừa nói "có" là máy móc. Các trường hợp còn lại
      // vẫn kết thúc bằng câu chốt bắt buộc của Vexim.
      const handoverMessage =
        ruleResult.ruleId === "SI-02-IMMEDIATE"
          ? "Dạ em đã ghi nhận ạ. Em chuyển thông tin cho chuyên viên Vexim, chuyên viên sẽ liên hệ anh/chị trong giờ làm việc ạ."
          : "Cảm ơn anh/chị. Để tư vấn chính xác nhất, em đang chuyển cho chuyên viên của Vexim xử lý. " +
            HANDOFF_CONNECT_QUESTION
      
      const { data: botMessage } = await supabase
        .from("chat_messages")
        .insert({
          conversation_id: convId,
          sender_type: "bot",
          message_text: handoverMessage,
          ai_model: aiConfig.model,
          ai_confidence: 1.0,
        })
        .select("id, created_at")
        .single()

      // Send notification to admin
      await notifyAdminNewHandover({
        conversationId: convId,
        customerName: customer_name,
        message: message_text,
        urgency: ruleResult.tags.urgency as "high" | "medium" | "low",
        serviceTag: ruleResult.tags.service_tag,
        reason: ruleResult.tags.reason,
        skipEmail: summaryEmailGoingOut,
      })

      return NextResponse.json({
        status: "handoff",
        action: "HANDOFF_TO_ADMIN",
        response: {
          conversation_id: convId,
          message_id: botMessage?.id,
          message_text: handoverMessage,
          timestamp: botMessage?.created_at || new Date().toISOString(),
          handoff: true,
          tags: ruleResult.tags,
        },
      })
    }

    // Handle ASK_CONTACT action
    if (ruleResult.action === "ASK_CONTACT") {
      const contactMessage = getContactRequestMessage(ruleResult.ruleId)
      
      const { data: botMessage } = await supabase
        .from("chat_messages")
        .insert({
          conversation_id: convId,
          sender_type: "bot",
          message_text: contactMessage,
          ai_model: aiConfig.model,
          ai_confidence: 0.9,
        })
        .select("id, created_at")
        .single()

      // Update conversation with tags
      await mergeConversationMetadata(supabase, convId, {
        service_tag: ruleResult.tags.service_tag,
        reason: ruleResult.tags.reason,
        urgency: ruleResult.tags.urgency,
        rule_id: ruleResult.ruleId,
        ask_contact: true,
      })

      // Thông báo admin NGAY khi khách được mời để lại liên hệ.
      // Trước đây nhánh này không thông báo gì → lead nóng bị bỏ quên trên trang quản trị.
      await notifyAdmin({
        conversationId: convId,
        customerName: customer_name,
        message: message_text,
        urgency: (ruleResult.tags.urgency as "high" | "medium" | "low") || "medium",
        serviceTag: ruleResult.tags.service_tag,
        reason: ruleResult.tags.reason,
        type: "new_lead",
        skipEmail: summaryEmailGoingOut,
      })

      return NextResponse.json({
        status: "ask_contact",
        action: "ASK_CONTACT",
        response: {
          conversation_id: convId,
          message_id: botMessage?.id,
          message_text: contactMessage,
          timestamp: botMessage?.created_at || new Date().toISOString(),
          show_contact_form: true,
          tags: ruleResult.tags,
        },
      })
    }

    // Default: AI_CONTINUE - Generate AI response với RAG
    //
    // b2: câu hỏi giá do AI trả lời trước (tóm tắt thông tin đã biết + mời kết nối
    // chuyên viên), sau đó khách đồng ý mới chuyển. Nhưng đây vẫn là lead nóng nhất
    // nên phải báo admin ngay, không để chuyên viên chỉ thấy trên trang quản trị.
    if (shouldAlertAdminOnAiReply(ruleResult)) {
      const lastAlert = convMetadata.last_lead_alert_at ? Date.parse(convMetadata.last_lead_alert_at) : 0
      const shouldAlert = Date.now() - (Number.isFinite(lastAlert) ? lastAlert : 0) > HOT_LEAD_ALERT_COOLDOWN_MS
      if (shouldAlert) {
        await notifyAdmin({
          conversationId: convId,
          customerName: customer_name,
          message: message_text,
          urgency: "high",
          serviceTag: ruleResult.tags.service_tag,
          reason: ruleResult.reason,
          type: "new_lead",
          skipEmail: summaryEmailGoingOut,
        })
        await mergeConversationMetadata(supabase, convId, {
          last_lead_alert_at: new Date().toISOString(),
        })
      }
    }

    const aiResponse = await generateAIResponse(
      message_text,
      conversationHistory,
      aiConfig,
      supabase,
      ragEnabled,
      leadProfile,
      aiConfig.salesPlaybook,
    )

    // Update AI confidence in rule context and re-evaluate if needed
    ruleContext.aiConfidence = aiResponse.confidence
    const confidenceCheck = evaluateRules(ruleContext)
    
    // If confidence is too low after generation, handoff
    if (confidenceCheck.action === "HANDOFF_TO_ADMIN") {
      await supabase.from("conversation_handovers").insert({
        conversation_id: convId,
        from_type: "bot",
        to_type: "agent",
        reason: "AI confidence too low after generation",
        status: "active",
      })

      await supabase
        .from("conversations")
        .update({ handover_mode: "manual" })
        .eq("id", convId)

      await mergeConversationMetadata(supabase, convId, {
        service_tag: ruleResult.tags.service_tag,
        reason: "data",
        urgency: "medium",
        rule_id: "AI-01",
      })
    }

    // Lưu tin nhắn từ AI
    const { data: botMessage, error: botMsgError } = await supabase
      .from("chat_messages")
      .insert({
        conversation_id: convId,
        sender_type: "bot",
        message_text: aiResponse.message,
        ai_model: aiConfig.model,
        ai_confidence: aiResponse.confidence,
        sources_used: aiResponse.sources,
      })
      .select("id, created_at")
      .single()

    if (botMsgError) throw botMsgError

    // Cập nhật conversation
    await supabase
      .from("conversations")
      .update({
        last_message: aiResponse.message,
        updated_at: new Date().toISOString(),
        ai_confidence: aiResponse.confidence,
        handover_mode: aiResponse.shouldHandover ? "ai_suggested" : "auto",
      })
      .eq("id", convId)

    // Nếu AI suggest handover, tạo record
    if (aiResponse.shouldHandover) {
      await supabase.from("conversation_handovers").insert({
        conversation_id: convId,
        from_type: "bot",
        to_type: "agent",
        reason: aiResponse.handoverReason,
      })
    }

    return NextResponse.json({
      status: "ok",
      response: {
        conversation_id: convId,
        message_id: botMessage.id,
        message_text: aiResponse.message,
        timestamp: botMessage.created_at,
        confidence: aiResponse.confidence,
        sources: aiResponse.sources,
        suggest_handover: aiResponse.shouldHandover,
      },
    })
  } catch (error) {
    console.error("[v0] Error in AI chatbot:", error)
    return NextResponse.json(
      {
        status: "error",
        error: "Internal server error",
        response: {
          message_text:
            "Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau hoặc liên hệ hotline: " + VEXIM_PHONE_DISPLAY,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    )
  }
}
