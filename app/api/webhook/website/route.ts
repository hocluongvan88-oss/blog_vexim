import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

// GET - Lấy lịch sử hội thoại
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const conversationId = searchParams.get("conversation_id")

    if (!conversationId) {
      return NextResponse.json({ error: "Missing conversation_id" }, { status: 400 })
    }

    const supabase = await createClient()

    // Lấy lịch sử tin nhắn
    const { data: messages, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("[v0] Error fetching messages:", error)
      return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
    }

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("[v0] GET /api/webhook/website error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Gửi tin nhắn mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer_id, customer_name, message_text, session_id } = body

    console.log("[v0] Received message:", { customer_id, customer_name, message_text })

    // Validate
    if (!customer_id || !message_text) {
      return NextResponse.json({ error: "Missing required fields: customer_id, message_text" }, { status: 400 })
    }

    const supabase = await createClient()

    // Tìm hoặc tạo conversation
    let { data: conversation, error: convError } = await supabase
      .from("conversations")
      .select("*")
      .eq("customer_id", customer_id)
      .eq("channel", "website")
      .single()

    if (!conversation) {
      const { data: newConv, error: createError } = await supabase
        .from("conversations")
        .insert({
          customer_id,
          customer_name: customer_name || "Khách hàng",
          channel: "website",
          status: "active",
          last_message: message_text,
        })
        .select()
        .single()

      if (createError) {
        console.error("[v0] Error creating conversation:", createError)
        return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 })
      }

      conversation = newConv
    }

    // Lưu tin nhắn của khách hàng
    const { data: customerMessage, error: msgError } = await supabase
      .from("chat_messages")
      .insert({
        conversation_id: conversation.id,
        sender_type: "customer",
        message_text,
        session_id,
      })
      .select()
      .single()

    if (msgError) {
      console.error("[v0] Error saving customer message:", msgError)
      return NextResponse.json({ error: "Failed to save message" }, { status: 500 })
    }

    // Tạo phản hồi tự động từ AI
    const aiResponse = await generateAIResponse(message_text, conversation.id)

    // Lưu phản hồi của AI
    const { data: aiMessage, error: aiError } = await supabase
      .from("chat_messages")
      .insert({
        conversation_id: conversation.id,
        sender_type: "bot",
        message_text: aiResponse,
      })
      .select()
      .single()

    if (aiError) {
      console.error("[v0] Error saving AI message:", aiError)
    }

    // Cập nhật conversation
    await supabase
      .from("conversations")
      .update({
        last_message: aiResponse,
        updated_at: new Date().toISOString(),
      })
      .eq("id", conversation.id)

    console.log("[v0] Message processed successfully")

    return NextResponse.json({
      status: "ok",
      response: {
        message_text: aiResponse,
        message_id: aiMessage?.id,
        timestamp: aiMessage?.created_at,
        conversation_id: conversation.id,
      },
    })
  } catch (error) {
    console.error("[v0] POST /api/webhook/website error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Hàm tạo phản hồi AI đơn giản
async function generateAIResponse(message: string, conversationId: string): Promise<string> {
  const lowerMessage = message.toLowerCase()

  // Câu trả lời mẫu dựa trên từ khóa
  const responses: Record<string, string> = {
    fda: "Cảm ơn bạn đã hỏi về đăng ký FDA! FDA là cơ quan quản lý thực phẩm và dược phẩm Hoa Kỳ. Chúng tôi cung cấp dịch vụ tư vấn và đăng ký FDA cho thực phẩm, mỹ phẩm, thiết bị y tế. Bạn muốn đăng ký FDA cho loại sản phẩm nào?",
    gacc: "Cảm ơn bạn quan tâm đến dịch vụ đăng ký mã GACC! GACC là Tổng cục Hải quan Trung Quốc. Chúng tôi hỗ trợ đăng ký mã GACC cho các doanh nghiệp xuất khẩu sang Trung Quốc. Bạn có muốn biết thêm về quy trình đăng ký không?",
    mfds: "MFDS (Bộ An toàn Thực phẩm và Dược phẩm Hàn Quốc) là yêu cầu bắt buộc khi xuất khẩu sang Hàn Quốc. Chúng tôi có kinh nghiệm hỗ trợ đăng ký MFDS cho nhiều doanh nghiệp. Bạn muốn đăng ký cho sản phẩm gì?",
    "xuất khẩu": "Vexim Global chuyên cung cấp giải pháp toàn diện về xuất nhập khẩu. Chúng tôi hỗ trợ đăng ký FDA (Mỹ), GACC (Trung Quốc), MFDS (Hàn Quốc), dịch vụ US Agent và truy xuất nguồn gốc. Bạn quan tâm đến thị trường nào?",
    "giá cả": "Để biết chi tiết về chi phí dịch vụ, vui lòng liên hệ với chúng tôi qua hotline hoặc để lại thông tin. Đội ngũ tư vấn sẽ báo giá cụ thể dựa trên nhu cầu của bạn.",
    "liên hệ": "Bạn có thể liên hệ với chúng tôi qua:\n📞 Hotline: [Số điện thoại]\n📧 Email: [Email]\n🏢 Địa chỉ: [Địa chỉ văn phòng]\nHoặc để lại thông tin, chúng tôi sẽ liên hệ lại sớm nhất!",
  }

  // Tìm từ khóa phù hợp
  for (const [keyword, response] of Object.entries(responses)) {
    if (lowerMessage.includes(keyword)) {
      return response
    }
  }

  // Câu trả lời chào hỏi
  if (lowerMessage.match(/^(xin chào|chào|hello|hi|hey)/)) {
    return "Xin chào! Tôi là trợ lý ảo của Vexim Global. Chúng tôi chuyên cung cấp dịch vụ tư vấn pháp lý xuất nhập khẩu quốc tế. Tôi có thể giúp gì cho bạn?"
  }

  // Câu trả lời cảm ơn
  if (lowerMessage.match(/cảm ơn|cám ơn|thank/)) {
    return "Rất vui được hỗ trợ bạn! Nếu có thắc mắc gì khác, đừng ngại liên hệ với chúng tôi nhé!"
  }

  // Câu trả lời mặc định
  return "Cảm ơn bạn đã nhắn tin! Chúng tôi chuyên cung cấp dịch vụ:\n• Đăng ký FDA (Mỹ)\n• Đăng ký GACC (Trung Quốc)\n• Đăng ký MFDS (Hàn Quốc)\n• Dịch vụ US Agent\n• Truy xuất nguồn gốc\n\nBạn quan tâm đến dịch vụ nào? Hoặc gọi hotline để được tư vấn chi tiết!"
}
