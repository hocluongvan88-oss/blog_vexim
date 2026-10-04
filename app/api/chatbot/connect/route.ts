/**
 * Khách bấm "Có, kết nối em với chuyên viên" trong khung chat.
 *
 * Vì sao cần endpoint riêng: `/api/chatbot/handover` chỉ dành cho ADMIN (yêu cầu
 * đăng nhập). Khách trên website không có tài khoản, nên cần một cửa công khai
 * để: tạo bản ghi chuyển chuyên viên, lưu hồ sơ khách đã thu thập được, và
 * QUAN TRỌNG NHẤT — báo cho admin ngay (email + thông báo nổi + chuông trong
 * trang quản trị) kèm toàn bộ thông tin khách đã cung cấp.
 *
 * Không cần đăng nhập, nhưng chỉ ghi được vào đúng hội thoại đã tồn tại
 * (kiểm tra conversation_id có thật trong CSDL).
 */
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { notifyAdmin } from "@/lib/notification-service"
import { summarizeLead, type LeadProfile } from "@/lib/lead-profile"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { conversation_id, lead_profile } = body || {}

    if (!conversation_id || typeof conversation_id !== "string") {
      return NextResponse.json({ status: "error", error: "Thiếu conversation_id" }, { status: 400 })
    }

    const supabase = await createClient()

    // 1. Hội thoại phải tồn tại (chặn việc gửi bừa id lạ)
    const { data: conversation, error: conversationError } = await supabase
      .from("conversations")
      .select("id, customer_name, metadata")
      .eq("id", conversation_id)
      .single()

    if (conversationError || !conversation) {
      return NextResponse.json({ status: "error", error: "Không tìm thấy hội thoại" }, { status: 404 })
    }

    const leadProfile: LeadProfile = (lead_profile && typeof lead_profile === "object" ? lead_profile : {}) as LeadProfile
    const summaryLines = summarizeLead(leadProfile)
    const summaryText = summaryLines.length > 0 ? summaryLines.join("\n") : "(khách chưa cung cấp thông tin chi tiết)"

    // 2. Khách đã đồng ý -> chuyển hẳn sang chuyên viên
    const { error: handoverError } = await supabase.from("conversation_handovers").insert({
      conversation_id,
      from_type: "bot",
      to_type: "agent",
      reason: "Khách đồng ý kết nối với chuyên viên (bấm nút trong khung chat)",
      status: "active",
    })

    if (handoverError) {
      console.error("[v0] Lỗi tạo handover:", handoverError)
      return NextResponse.json({ status: "error", error: "Không tạo được yêu cầu kết nối" }, { status: 500 })
    }

    // 3. Lưu hồ sơ + trạng thái (gộp metadata, không ghi đè dữ liệu cũ)
    const { error: updateError } = await supabase
      .from("conversations")
      .update({
        handover_mode: "manual",
        metadata: {
          ...(conversation.metadata || {}),
          handed_over: true,
          connect_requested_at: new Date().toISOString(),
          lead_profile: leadProfile,
          lead_summary: summaryLines,
        },
      })
      .eq("id", conversation_id)

    if (updateError) {
      console.error("[v0] Lỗi cập nhật hội thoại:", updateError)
    }

    // 4. Tin nhắn xác nhận cho khách (lưu vào hội thoại để admin đọc được mạch chat)
    const messageText =
      "Dạ em đã ghi nhận và chuyển thông tin tới chuyên viên Vexim ạ. " +
      "Chuyên viên sẽ liên hệ anh/chị trong giờ làm việc. " +
      "Nếu cần gấp, anh/chị nhắn Zalo hoặc gọi trực tiếp cho em nhé."

    const { data: botMessage } = await supabase
      .from("chat_messages")
      .insert({
        conversation_id,
        sender_type: "bot",
        message_text: messageText,
        ai_model: "system",
        ai_confidence: 1.0,
      })
      .select("id, created_at")
      .single()

    // 5. Báo admin NGAY, kèm toàn bộ hồ sơ khách — đây là kênh ngoài trang quản trị
    //    (email + thông báo nổi), không phải "ngồi chờ xem dashboard".
    await notifyAdmin({
      conversationId: conversation_id,
      customerName: conversation.customer_name || "Khách website",
      message: `Khách ĐỒNG Ý kết nối với chuyên viên.\n\nThông tin khách đã cung cấp:\n${summaryText}`,
      urgency: "high",
      serviceTag: leadProfile.market,
      reason: "Khách bấm nút kết nối chuyên viên",
      type: "handover",
      channel: "website",
    })

    return NextResponse.json({
      status: "ok",
      message_text: messageText,
      timestamp: botMessage?.created_at || new Date().toISOString(),
      lead_summary: summaryLines,
    })
  } catch (error) {
    console.error("[v0] Lỗi API kết nối chuyên viên:", error)
    return NextResponse.json({ status: "error", error: "Internal server error" }, { status: 500 })
  }
}
