import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateAIResponse, loadAIConfig } from "@/lib/ai-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer_id, customer_name, message_text, conversation_id } = body

    console.log("[v0] Processing chatbot message:", { customer_id, message_text })

    const supabase = await createClient()
    console.log("[v0] Supabase client created successfully")

    // Tìm hoặc tạo conversation
    let convId = conversation_id
    if (!convId) {
      console.log("[v0] Looking for existing conversation for customer:", customer_id)
      const { data: existingConv, error: searchError } = await supabase
        .from("conversations")
        .select("id")
        .eq("customer_id", customer_id)
        .eq("channel", "website")
        .eq("status", "active")
        .single()

      if (searchError && searchError.code !== "PGRST116") {
        console.error("[v0] Error searching conversation:", searchError)
      }

      if (existingConv) {
        convId = existingConv.id
        console.log("[v0] Found existing conversation:", convId)
      } else {
        console.log("[v0] Creating new conversation for customer:", customer_id)
        const { data: newConv, error: convError } = await supabase
          .from("conversations")
          .insert({
            customer_id,
            customer_name: customer_name || "Khách hàng",
            channel: "website",
            status: "active",
            last_message: message_text,
          })
          .select("id")
          .single()

        if (convError) {
          console.error("[v0] Error creating conversation:", convError)
          throw convError
        }
        convId = newConv.id
        console.log("[v0] Created new conversation:", convId)
      }
    }

    // Lưu tin nhắn của customer
    const { error: msgError } = await supabase.from("chat_messages").insert({
      conversation_id: convId,
      sender_type: "customer",
      message_text,
    })

    if (msgError) {
      console.error("[v0] Error saving customer message:", msgError)
      throw msgError
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
      .single()

    const ragEnabled = ragConfig?.value === true

    console.log("[v0] Generating AI response with config:", { model: aiConfig.model, ragEnabled })

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

    if (botMsgError) {
      console.error("[v0] Error saving bot message:", botMsgError)
      throw botMsgError
    }

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

    console.log("[v0] Successfully processed chatbot message")

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
    console.error("[v0] Error in chatbot:", error)
    return NextResponse.json(
      {
        status: "error",
        error: "Failed to process message",
        response: {
          message_text:
            "Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau hoặc liên hệ hotline: 0123-456-789 để được hỗ trợ trực tiếp.",
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    )
  }
}
