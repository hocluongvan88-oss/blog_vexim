import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateAIResponse, loadAIConfig } from "@/lib/ai-service"
import { evaluateRules, getContactRequestMessage, type MessageContext } from "@/lib/rule-engine"
import { notifyAdminNewHandover } from "@/lib/notification-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer_id, customer_name, message_text, conversation_id } = body

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

    // Evaluate rules first to determine action
    const ruleContext: MessageContext = {
      message: message_text,
      conversationHistory: conversationHistory.map(m => m.content),
      hasFile: false, // TODO: Add file detection
      customerInfo: {
        companyName: customer_name,
      }
    }

    const ruleResult = evaluateRules(ruleContext)
    console.log("[v0] Rule evaluation result:", ruleResult)

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
        .update({
          handover_mode: "manual",
          metadata: {
            service_tag: ruleResult.tags.service_tag,
            reason: ruleResult.tags.reason,
            urgency: ruleResult.tags.urgency,
            rule_id: ruleResult.ruleId,
          }
        })
        .eq("id", convId)

      // Save bot message explaining handover
      const handoverMessage = "Cảm ơn anh/chị. Để tư vấn chính xác nhất, em đang chuyển cho chuyên viên của Vexim xử lý. Chuyên viên sẽ phản hồi trong thời gian sớm nhất ạ."
      
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
      await supabase
        .from("conversations")
        .update({
          metadata: {
            service_tag: ruleResult.tags.service_tag,
            reason: ruleResult.tags.reason,
            urgency: ruleResult.tags.urgency,
            rule_id: ruleResult.ruleId,
            ask_contact: true,
          }
        })
        .eq("id", convId)

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
    const aiResponse = await generateAIResponse(
      message_text,
      conversationHistory,
      aiConfig,
      supabase,
      ragEnabled
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
        .update({
          handover_mode: "manual",
          metadata: {
            service_tag: ruleResult.tags.service_tag,
            reason: "data",
            urgency: "medium",
            rule_id: "AI-01",
          }
        })
        .eq("id", convId)
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
            "Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau hoặc liên hệ hotline: 0123-456-789",
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    )
  }
}
