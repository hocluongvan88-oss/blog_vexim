import { NextRequest, NextResponse } from "next/server"

const CHATBOT_URL = "https://chatbot-six-wheat.vercel.app"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const conversationId = searchParams.get("conversation_id")
    const customerId = searchParams.get("customer_id")

    if (!conversationId && !customerId) {
      return NextResponse.json(
        { error: "Missing required parameter: conversation_id or customer_id" },
        { status: 400 }
      )
    }

    console.log("[v0] Fetching chat history:", { conversationId, customerId })

    // Forward request đến chatbot server
    const url = new URL(`${CHATBOT_URL}/api/webhook/website`)
    if (conversationId) url.searchParams.set("conversation_id", conversationId)
    if (customerId) url.searchParams.set("customer_id", customerId)

    const response = await fetch(url.toString())

    if (!response.ok) {
      console.error("[v0] Chatbot server error:", response.status, response.statusText)
      throw new Error(`Chatbot server responded with ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Chat history loaded:", data)

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error fetching chat history:", error)
    return NextResponse.json(
      {
        status: "ok",
        messages: [],
      },
      { status: 200 }
    )
  }
}
