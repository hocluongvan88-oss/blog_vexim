import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * Lịch sử chat của khách — đọc từ chính CSDL của Vexim.
 *
 * Trước đây route này KHÔNG đọc CSDL mà chuyển tiếp sang một server chatbot cũ
 * (`chatbot-six-wheat.vercel.app`). Server đó là phiên bản trước, không biết gì
 * về `chat_messages` hiện tại → khách mở lại khung chat là trắng trơn, và trả lời
 * của chuyên viên trong trang quản trị thì khách không bao giờ thấy.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const conversationId = searchParams.get("conversation_id")
    const customerId = searchParams.get("customer_id")

    if (!conversationId && !customerId) {
      return NextResponse.json(
        { error: "Thiếu tham số: cần conversation_id hoặc customer_id" },
        { status: 400 },
      )
    }

    const supabase = await createClient()
    let convId = conversationId

    // Khách quay lại: tìm lại hội thoại gần nhất của khách này trên website
    if (!convId && customerId) {
      const { data: conversation } = await supabase
        .from("conversations")
        .select("id")
        .eq("customer_id", customerId)
        .eq("channel", "website")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      convId = conversation?.id || null
    }

    if (!convId) {
      // Khách mới, chưa có hội thoại nào
      return NextResponse.json({ status: "ok", messages: [], conversation_id: null })
    }

    const { data: messages, error } = await supabase
      .from("chat_messages")
      .select("id, sender_type, message_text, created_at")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true })
      .limit(200)

    if (error) {
      console.error("[v0] Lỗi đọc lịch sử chat:", error)
      return NextResponse.json({ status: "ok", messages: [], conversation_id: convId })
    }

    return NextResponse.json({
      status: "ok",
      conversation_id: convId,
      messages: messages || [],
    })
  } catch (error) {
    console.error("[v0] GET /api/chatbot/history error:", error)
    return NextResponse.json({ status: "ok", messages: [] })
  }
}
