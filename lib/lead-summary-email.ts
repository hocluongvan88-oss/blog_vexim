/**
 * Email "HỒ SƠ KHÁCH HÀNG TIỀM NĂNG" gửi cho admin.
 *
 * Vì sao có: sau khi trợ lý AI tổng hợp xong thông tin của khách (đủ 4 thông tin
 * bắt buộc, hoặc khách hỏi giá) thì việc tiếp theo là gọi lại cho khách. Nếu thông
 * tin chỉ nằm trong trang quản trị thì chuyên viên phải mở máy tính mới thấy —
 * chủ doanh nghiệp đã chốt nguyên tắc "phải báo ra ngoài, không ngồi canh web".
 *
 * Email này là bản tóm tắt đọc được trên điện thoại, có số điện thoại/Zalo bấm gọi
 * ngay, kèm nội dung khách đã trao đổi.
 *
 * Tệp này CHỈ chứa hàm thuần (không gọi mạng, không SMTP) để kiểm thử được; phần
 * gửi email nằm ở lib/notification-service.tsx.
 */
import { HANDOFF_CONNECT_QUESTION, estimateTimeline, summarizeLead, type LeadProfile } from "@/lib/lead-profile"

/**
 * Địa chỉ nhận hồ sơ khách — chủ doanh nghiệp đưa.
 * Đổi bằng biến môi trường `ADMIN_LEAD_SUMMARY_EMAIL` mà không cần sửa code.
 */
export const DEFAULT_LEAD_SUMMARY_EMAIL = "hocluongvan88@gmail.com"

/**
 * Danh sách người nhận hồ sơ khách.
 *
 * Luôn gồm địa chỉ của chủ doanh nghiệp, cộng thêm các email đã cấu hình trong
 * Admin → Cài đặt → Thông báo (để chuyên viên cũng nhận được). Trùng địa chỉ thì
 * chỉ gửi một lần.
 */
export function leadSummaryRecipients(configured: string[] = []): string[] {
  const primary = (process.env.ADMIN_LEAD_SUMMARY_EMAIL || DEFAULT_LEAD_SUMMARY_EMAIL).trim()
  const all = [primary, ...configured]
  return Array.from(
    new Set(all.map((email) => String(email || "").trim()).filter((email) => email.includes("@"))),
  )
}

/** Chống chèn HTML qua dữ liệu khách nhập (tên công ty, nội dung chat…). */
export function escapeHtml(value: string): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

/**
 * Khoá so sánh "hồ sơ đã đổi chưa" — dùng để chống gửi trùng.
 *
 * Trả về chuỗi rỗng khi chưa có thông tin gì đáng gửi (khách mới chỉ chào hỏi),
 * nhờ vậy email chỉ được gửi khi thật sự có hồ sơ.
 */
export function leadSummaryKey(profile: LeadProfile = {}): string {
  const parts = [
    profile.market || "",
    profile.productGroup || "",
    profile.hasDuns === true ? "duns:yes" : profile.hasDuns === false ? "duns:no" : "",
    profile.phone || "",
    profile.companyName || "",
  ]
  const meaningful = parts.filter((part) => part !== "")
  if (meaningful.length === 0) return ""
  return parts.join("|")
}

/**
 * Có nên gửi email hồ sơ cho hội thoại này không?
 *  - Hồ sơ chưa có gì (khách mới chỉ chào hỏi) -> không gửi.
 *  - Hồ sơ không có gì MỚI so với lần gửi trước -> không gửi (chống dội email).
 */
export function shouldEmailLeadSummary(
  profile: LeadProfile = {},
  metadata: Record<string, any> = {},
): boolean {
  const key = leadSummaryKey(profile)
  if (!key) return false
  return metadata?.lead_summary_email_key !== key
}

const MARKET_LABELS: Record<string, string> = {
  FDA: "FDA (Mỹ)",
  GACC: "GACC (Trung Quốc)",
  MFDS: "MFDS (Hàn Quốc)",
}

const PRODUCT_LABELS: Record<string, string> = {
  processed: "Sản phẩm chế biến",
  raw: "Nguyên liệu thô",
  cosmetics: "Mỹ phẩm",
  medical: "Thiết bị y tế",
  supplement: "Thực phẩm chức năng",
}

export interface LeadSummaryEmailInput {
  profile: LeadProfile
  /** Tin nhắn gần nhất của hội thoại (cũ → mới). Chỉ lấy tối đa 8 tin cuối. */
  messages?: Array<{ sender_type?: string; message_text?: string }>
  conversationId?: string
  siteUrl?: string
}

/**
 * Dựng tiêu đề + nội dung email hồ sơ khách.
 * Hàm thuần: không gọi mạng, không đọc CSDL.
 */
export function buildLeadSummaryEmail({
  profile,
  messages = [],
  conversationId,
  siteUrl = "https://www.veximglobal.com",
}: LeadSummaryEmailInput): { subject: string; html: string } {
  const phone = profile.phone || ""
  const marketLabel = profile.market ? MARKET_LABELS[profile.market] || profile.market : "Chưa rõ"
  const productLabel = profile.productGroup
    ? PRODUCT_LABELS[profile.productGroup] || profile.productGroup
    : "Chưa rõ"
  const dunsLabel =
    profile.hasDuns === true
      ? "Đã có mã DUNS đúng địa chỉ nhà máy"
      : profile.hasDuns === false
        ? "Chưa có mã DUNS (phải đăng ký mã mới trước)"
        : "Chưa rõ"

  const timeline = estimateTimeline(profile)
  const summaryLines = summarizeLead(profile)

  const subject = `📋 Hồ sơ khách hàng tiềm năng: ${phone || profile.companyName || "khách từ website"} — ${marketLabel}`

  const rows: Array<[string, string]> = [
    ["Số điện thoại / Zalo", phone ? `<a href="tel:${escapeHtml(phone)}" style="color:#0c4a6e;font-weight:bold">${escapeHtml(phone)}</a>` : "Chưa có"],
    ["Tên công ty / nhà máy", escapeHtml(profile.companyName || "Chưa rõ")],
    ["Thị trường cần đăng ký", escapeHtml(marketLabel)],
    ["Nhóm sản phẩm", escapeHtml(productLabel)],
    ["Mã DUNS", escapeHtml(dunsLabel)],
  ]
  if (timeline) rows.push(["Thời gian dự kiến", escapeHtml(timeline)])

  const transcript = messages
    .filter((message) => (message.message_text || "").trim().length > 0)
    .slice(-8)
    .map((message) => {
      const who =
        message.sender_type === "customer"
          ? "Anh/chị"
          : message.sender_type === "agent"
            ? "Chuyên viên Vexim"
            : "Trợ lý AI Vexim"
      const color = message.sender_type === "customer" ? "#0f172a" : "#0c4a6e"
      return `<div style="margin:0 0 10px 0">
        <div style="font-size:12px;color:#64748b">${who}</div>
        <div style="color:${color};line-height:1.5">${escapeHtml(message.message_text || "").replace(/\n/g, "<br />")}</div>
      </div>`
    })
    .join("")

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;padding:24px">
      <h2 style="margin:0 0 4px;color:#0c4a6e;font-size:20px">📋 Hồ sơ khách hàng tiềm năng</h2>
      <p style="margin:0 0 18px;color:#475569;font-size:13px;line-height:1.6">
        Trợ lý AI vừa tổng hợp thông tin của khách và đã mời kết nối chuyên viên. Việc tiếp theo là
        <strong>gọi lại cho khách trong giờ làm việc</strong> — hồ sơ càng để lâu càng nguội.
      </p>

      <table role="presentation" style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden">
        ${rows
          .map(
            ([label, value], index) => `<tr style="background:${index % 2 === 0 ? "#f8fafc" : "#ffffff"}">
              <td style="padding:10px 14px;font-size:13px;color:#64748b;width:42%;border-bottom:1px solid #e2e8f0">${label}</td>
              <td style="padding:10px 14px;font-size:14px;color:#0f172a;border-bottom:1px solid #e2e8f0">${value}</td>
            </tr>`,
          )
          .join("")}
      </table>

      <p style="margin:16px 0 0;font-size:13px;color:#334155;line-height:1.6">
        Câu hỏi chốt đã gửi khách: <em>“${escapeHtml(HANDOFF_CONNECT_QUESTION)}”</em>
      </p>

      ${
        summaryLines.length > 0
          ? `<h3 style="margin:20px 0 8px;font-size:15px;color:#0f172a">Thông tin đã ghi nhận</h3>
             <ul style="margin:0;padding-left:20px;color:#334155;line-height:1.6;font-size:14px">
               ${summaryLines.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}
             </ul>`
          : ""
      }

      <h3 style="margin:20px 0 8px;font-size:15px;color:#0f172a">Nội dung khách đã trao đổi</h3>
      ${transcript || `<p style="color:#64748b;font-size:14px">Chưa có nội dung.</p>`}

      <div style="margin:24px 0 0;padding:14px;background:#f1f5f9;border-radius:8px;font-size:13px;color:#334155;line-height:1.7">
        Xem chi tiết hội thoại trong trang quản trị:<br />
        <a href="${escapeHtml(siteUrl)}/admin/conversations" style="color:#0068ff">${escapeHtml(siteUrl)}/admin/conversations</a>
        ${conversationId ? `<br /><span style="color:#64748b">Mã hội thoại: ${escapeHtml(String(conversationId).slice(0, 8))}</span>` : ""}
      </div>

      <p style="margin:20px 0 0;color:#94a3b8;font-size:12px">
        Email tự động từ trợ lý AI của Vexim Global. Chỉ gửi khi hồ sơ khách thay đổi.
      </p>
    </div>
  `

  return { subject, html }
}
