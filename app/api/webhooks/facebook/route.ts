import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { AIService } from "@/lib/ai-service"

// Facebook Messenger Webhook Handler
// Docs: https://developers.facebook.com/docs/messenger-platform/webhooks

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("[v0] Facebook webhook received:", body)

    // Verify webhook (production)
    const signature = request.headers.get("x-hub-signature-256")
    // TODO: Verify signature with app secret

    // Process each entry
    for (const entry of body.entry || []) {
      for (const messagingEvent of entry.messaging || []) {
        if (messagingEvent.message) {
          await handleMessage(messagingEvent)
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Facebook webhook error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Verification endpoint for Facebook webhook setup
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get("hub.mode")
  const token = searchParams.get("hub.verify_token")
  const challenge = searchParams.get("hub.challenge")

  const VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN || "vexim_verify_token"

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("[v0] Facebook webhook verified")
    return new NextResponse(challenge)
  }

  return NextResponse.json({ error: "Verification failed" }, { status: 403 })
}

async function handleMessage(event: any) {
  const senderId = event.sender.id
  const message = event.message.text

  if (!message) return

  const supabase = await createServerClient()

  // Get or create conversation
  let conversation = await getOrCreateConversation(senderId, "facebook", supabase)

  // Check if handed over to agent
  const { data: handover } = await supabase
    .from("conversation_handovers")
    .select("*")
    .eq("conversation_id", conversation.id)
    .eq("status", "active")
    .single()

  if (handover) {
    // Store message for agent
    await supabase.from("messages").insert({
      conversation_id: conversation.id,
      sender_type: "user",
      message,
      platform: "facebook",
    })
    return
  }

  // AI handles message
  const aiService = new AIService()
  const aiResponse = await aiService.generateResponse(message, conversation.id)

  // Send response to Facebook
  await sendFacebookMessage(senderId, aiResponse)

  // Store messages
  await supabase.from("messages").insert([
    {
      conversation_id: conversation.id,
      sender_type: "user",
      message,
      platform: "facebook",
    },
    {
      conversation_id: conversation.id,
      sender_type: "bot",
      message: aiResponse,
      platform: "facebook",
    },
  ])
}

async function getOrCreateConversation(
  userId: string,
  platform: string,
  supabase: any
) {
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

  const { data: newConv } = await supabase
    .from("conversations")
    .insert({
      user_identifier: userId,
      platform,
      metadata: { source: "facebook" },
    })
    .select()
    .single()

  return newConv
}

async function sendFacebookMessage(recipientId: string, message: string) {
  // TODO: Implement Facebook Send API
  // Docs: https://developers.facebook.com/docs/messenger-platform/send-messages

  const FB_PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN

  if (!FB_PAGE_ACCESS_TOKEN) {
    console.warn("Facebook credentials not configured")
    return
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/me/messages?access_token=${FB_PAGE_ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipient: { id: recipientId },
          message: { text: message },
        }),
      }
    )

    const data = await response.json()
    console.log("[v0] Facebook send response:", data)
  } catch (error) {
    console.error("Error sending Facebook message:", error)
  }
}
