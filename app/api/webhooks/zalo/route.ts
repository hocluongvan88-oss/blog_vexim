import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateAIResponse, loadAIConfig } from "@/lib/ai-service"

// Zalo Webhook Handler
// Docs: https://developers.zalo.me/docs/official-account/api

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Verify Zalo signature (add when you have app secret)
    // const signature = request.headers.get("X-Zalo-Signature")
    // if (!verifySignature(signature, body)) {
    //   return NextResponse.json({ error: "Invalid signature" }, { status: 403 })
    // }

    console.log("[v0] Zalo webhook received:", body)

    // Parse Zalo message format
    const { event_name, recipient, message, sender } = body

    if (event_name === "user_send_text") {
      // User sent a text message
      const userMessage = message?.text || ""
      const userId = sender?.id || ""

      // Get or create conversation
      const supabase = await createClient()
      let conversation = await getOrCreateConversation(userId, "zalo", supabase)

      // Check if conversation is handed over to agent
      const { data: handover } = await supabase
        .from("conversation_handovers")
        .select("*")
        .eq("conversation_id", conversation.id)
        .eq("status", "active")
        .single()

      if (handover) {
        // Forward to agent (store message, agent will respond via admin panel)
        await supabase.from("chat_messages").insert({
          conversation_id: conversation.id,
          sender_type: "customer",
          message_text: userMessage,
        })

        // Notify agent (can use websocket or push notification here)
        return NextResponse.json({ success: true, mode: "agent" })
      }

      // Load conversation history
      const { data: historyData } = await supabase
        .from("chat_messages")
        .select("sender_type, message_text")
        .eq("conversation_id", conversation.id)
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

      // Generate AI response
      const aiResponse = await generateAIResponse(
        userMessage,
        conversationHistory,
        aiConfig,
        supabase,
        true
      )

      // Send response back to Zalo
      await sendZaloMessage(userId, aiResponse.message)

      // Store messages
      await supabase.from("chat_messages").insert([
        {
          conversation_id: conversation.id,
          sender_type: "customer",
          message_text: userMessage,
        },
        {
          conversation_id: conversation.id,
          sender_type: "bot",
          message_text: aiResponse.message,
          ai_model: aiConfig.model,
          ai_confidence: aiResponse.confidence,
        },
      ])

      return NextResponse.json({ success: true, mode: "ai" })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Zalo webhook error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Verification endpoint for Zalo webhook setup
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const challenge = searchParams.get("challenge")

  if (challenge) {
    return new NextResponse(challenge)
  }

  return NextResponse.json({ status: "Zalo webhook endpoint ready" })
}

async function getOrCreateConversation(
  userId: string,
  platform: string,
  supabase: any
) {
  // Check existing conversation
  const { data: existing } = await supabase
    .from("conversations")
    .select("*")
    .eq("user_identifier", userId)
    .eq("platform", platform)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (existing) {
    return existing
  }

  // Create new conversation
  const { data: newConv } = await supabase
    .from("conversations")
    .insert({
      user_identifier: userId,
      platform,
      metadata: { source: "zalo" },
    })
    .select()
    .single()

  return newConv
}

async function sendZaloMessage(userId: string, message: string) {
  // TODO: Implement Zalo Send API
  // Docs: https://developers.zalo.me/docs/api/official-account-api/api/gui-tin-nhan-post-4302

  const ZALO_ACCESS_TOKEN = process.env.ZALO_ACCESS_TOKEN
  const ZALO_OA_ID = process.env.ZALO_OA_ID

  if (!ZALO_ACCESS_TOKEN || !ZALO_OA_ID) {
    console.warn("Zalo credentials not configured")
    return
  }

  try {
    const response = await fetch("https://openapi.zalo.me/v2.0/oa/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access_token: ZALO_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        recipient: {
          user_id: userId,
        },
        message: {
          text: message,
        },
      }),
    })

    const data = await response.json()
    console.log("[v0] Zalo send response:", data)
  } catch (error) {
    console.error("Error sending Zalo message:", error)
  }
}
