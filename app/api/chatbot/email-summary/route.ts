/**
 * "Gửi bản tóm tắt cuộc trao đổi cho tôi qua email".
 *
 * Vì sao cần: người đi mua dịch vụ tư vấn thường không tự quyết — họ cần gửi
 * lại nội dung cho sếp/bộ phận. Trước đây khách chỉ có cách chụp màn hình hoặc
 * copy tay; nay chỉ cần để lại email, nhận được bản tóm tắt kèm thông tin liên
 * hệ Vexim. Đây cũng là cách thu email khách B2B một cách tự nhiên (khách chủ
 * động yêu cầu, không bị xin số điện thoại).
 */
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { emailService } from "@/lib/email-service-zoho"
import { summarizeLead, extractLeadProfileFromMessages, type LeadProfile } from "@/lib/lead-profile"
import { VEXIM_PHONE_DISPLAY, VEXIM_ZALO_URL, VEXIM_PHONE_TEL_URL } from "@/lib/contact-info"

const MAX_MESSAGES = 40
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

/** Đổi markdown đơn giản sang HTML để email dễ đọc (đã escape trước khi chèn thẻ). */
function toEmailHtml(text: string): string {
  const escaped = escapeHtml(text)
  return escaped
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br />")
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { conversation_id, email, lead_profile } = body || {}

    if (!conversation_id || typeof conversation_id !== "string") {
      return NextResponse.json({ status: "error", error: "Thiếu conversation_id" }, { status: 400 })
    }
    if (!email || typeof email !== "string" || !EMAIL_PATTERN.test(email.trim())) {
      return NextResponse.json(
        { status: "error", error: "Email chưa đúng định dạng. Anh/chị kiểm tra lại giúp em nhé." },
        { status: 400 },
      )
    }

    const supabase = await createClient()

    const { data: conversation } = await supabase
      .from("conversations")
      .select("id, metadata")
      .eq("id", conversation_id)
      .single()

    if (!conversation) {
      return NextResponse.json({ status: "error", error: "Không tìm thấy hội thoại" }, { status: 404 })
    }

    const { data: messages } = await supabase
      .from("chat_messages")
      .select("sender_type, message_text, created_at")
      .eq("conversation_id", conversation_id)
      .order("created_at", { ascending: true })
      .limit(MAX_MESSAGES)

    const rows = (messages || []).filter((row: any) => (row.message_text || "").trim().length > 0)

    // Hồ sơ khách: ưu tiên bản khung chat gửi lên, nếu không có thì trích lại từ hội thoại
    const profile: LeadProfile =
      lead_profile && typeof lead_profile === "object"
        ? (lead_profile as LeadProfile)
        : extractLeadProfileFromMessages(rows.map((row: any) => row.message_text))

    const summaryLines = summarizeLead(profile)

    const transcriptHtml = rows
      .map((row: any) => {
        const who =
          row.sender_type === "customer"
            ? "Anh/chị"
            : row.sender_type === "agent"
              ? "Chuyên viên Vexim"
              : "Trợ lý AI Vexim"
        const color = row.sender_type === "customer" ? "#0f172a" : "#0c4a6e"
        return `<div style="margin:0 0 12px 0">
          <div style="font-size:12px;color:#64748b">${who}</div>
          <div style="color:${color};line-height:1.5">${toEmailHtml(row.message_text)}</div>
        </div>`
      })
      .join("")

    const summaryHtml =
      summaryLines.length > 0
        ? `<h3 style="margin:20px 0 8px;font-size:15px;color:#0f172a">Thông tin Vexim đã ghi nhận</h3>
           <ul style="margin:0;padding-left:20px;color:#334155;line-height:1.6">
             ${summaryLines.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}
           </ul>`
        : ""

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;padding:24px">
        <h2 style="margin:0 0 4px;color:#0c4a6e;font-size:20px">Bản tóm tắt trao đổi với Vexim Global</h2>
        <p style="margin:0 0 20px;color:#64748b;font-size:13px">
          Nội dung anh/chị đã trao đổi với trợ lý AI của Vexim. Cần trao đổi thêm, anh/chị liên hệ trực tiếp:
        </p>

        <div style="border:1px solid #e2e8f0;border-radius:8px;padding:14px;margin-bottom:20px;background:#f8fafc">
          <div style="font-size:13px;color:#334155;line-height:1.8">
            📞 Điện thoại / Zalo: <strong>${VEXIM_PHONE_DISPLAY}</strong><br />
            💬 Zalo: <a href="${VEXIM_ZALO_URL}" style="color:#0068ff">${VEXIM_ZALO_URL}</a><br />
            ☎️ Gọi ngay: <a href="${VEXIM_PHONE_TEL_URL}" style="color:#0068ff">${VEXIM_PHONE_DISPLAY}</a>
          </div>
        </div>

        ${summaryHtml}

        <h3 style="margin:20px 0 8px;font-size:15px;color:#0f172a">Nội dung trao đổi</h3>
        ${transcriptHtml || "<p style='color:#64748b'>Chưa có nội dung.</p>"}

        <p style="margin:24px 0 0;color:#94a3b8;font-size:12px">
          Email này do hệ thống Vexim Global tự động gửi theo yêu cầu của anh/chị.
        </p>
      </div>
    `

    const sent = await emailService.sendEmail({
      to: email.trim(),
      subject: "Vexim Global — Bản tóm tắt nội dung trao đổi",
      html,
    })

    if (!sent) {
      return NextResponse.json(
        { status: "error", error: "Chưa gửi được email. Anh/chị thử lại giúp em nhé." },
        { status: 502 },
      )
    }

    // Ghi lại việc khách để email để chuyên viên biết (không cần khách khai lại)
    await supabase
      .from("conversations")
      .update({
        metadata: {
          ...(conversation.metadata || {}),
          guest_email: email.trim(),
          summary_emailed_at: new Date().toISOString(),
        },
      })
      .eq("id", conversation_id)

    return NextResponse.json({ status: "ok", message: `Đã gửi bản tóm tắt tới ${email.trim()} ạ.` })
  } catch (error) {
    console.error("[v0] Lỗi gửi email tóm tắt:", error)
    return NextResponse.json({ status: "error", error: "Internal server error" }, { status: 500 })
  }
}
