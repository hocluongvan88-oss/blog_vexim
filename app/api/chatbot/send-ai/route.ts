import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateAIResponse, loadAIConfig } from "@/lib/ai-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer_id, customer_name, message_text, conversation_id } = body

    console.log("[v0] Processing AI message:", { customer_id, message_text })

    const supabase = await createClient()

    // Tìm hoặc tạo conversation
    let convId = conversation_id
    if (!convId) {
      const { data: existingConv } = await supabase
        .from("conversations")
        .select("id")
        .eq("customer_id", customer_id)
        .eq("channel", "website")
        .eq("status", "active")
        .single()

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

    // Lưu tin nhắn của customer
    const { error: msgError } = await supabase.from("chat_messages").insert({
      conversation_id: convId,
      sender_type: "customer",
      message_text,
    })

    if (msgError) throw msgError

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
      .single()

    const ragEnabled = ragConfig?.value === true

    // Generate AI response với RAG
    const aiResponse = await generateAIResponse(
      message_text,
      conversationHistory,
      aiConfig,
      supabase,
      ragEnabled
    )

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
