import { NextRequest, NextResponse } from "next/server"

const CHATBOT_URL = "https://chatbot-six-wheat.vercel.app"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log("[v0] Forwarding message to chatbot:", body)

    // Forward request đến chatbot server
    const response = await fetch(`${CHATBOT_URL}/api/webhook/website`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer_id: body.customer_id,
        customer_name: body.customer_name || "Khách hàng",
        message_text: body.message_text,
        channel: "website",
        website_url: "https://www.veximglobal.com",
      }),
    })

    if (!response.ok) {
      console.error("[v0] Chatbot server error:", response.status, response.statusText)
      throw new Error(`Chatbot server responded with ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Chatbot response:", data)

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error forwarding to chatbot:", error)
    return NextResponse.json(
      {
        status: "error",
        error: "Failed to connect to chatbot service",
        response: {
          message_text:
            "Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau hoặc liên hệ hotline: 0123-456-789 để được hỗ trợ trực tiếp.",
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 } // Return 200 to avoid breaking the UI
    )
  }
}
