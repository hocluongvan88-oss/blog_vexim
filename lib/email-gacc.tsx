import { SITE_URL } from "./business-profile"
import { emailButton, emailDetails, emailParagraph as p, escapeEmailHtml as e, renderEmail } from "./email-layout"

export interface GACCSubmissionParams {
  companyName: string
  productName: string
  hsCode: string
  submissionId: string
  submittedAt: string
  email?: string
  phone?: string
  taxCode?: string
}

function details(params: GACCSubmissionParams, admin = false): string {
  const rows: Array<[string, unknown]> = [
    ["Mã hồ sơ", `#${params.submissionId.slice(0, 8).toUpperCase()}`], ["Doanh nghiệp", params.companyName],
    ["Sản phẩm", params.productName], ["Mã HS", params.hsCode], ["Thời gian gửi", params.submittedAt],
  ]
  if (admin) rows.push(["Mã số thuế", params.taxCode], ["Số điện thoại", params.phone], ["Email", params.email])
  return emailDetails(rows)
}

export function getGACCUserConfirmationHTML(params: GACCSubmissionParams): string {
  return renderEmail({
    title: "Đã nhận hồ sơ đánh giá GACC",
    preheader: "Vexim Global đã tiếp nhận hồ sơ. Chuyên viên sẽ xem xét trong 1–2 ngày làm việc.",
    body: p(`Kính gửi ${e(params.companyName)},`) +
      p("Vexim Global đã tiếp nhận yêu cầu đánh giá khả năng đăng ký GACC của quý công ty. Đây là xác nhận tiếp nhận, <strong>không phải thông báo chấp thuận đăng ký GACC</strong>.") +
      details(params) +
      p("<strong>Các bước tiếp theo</strong><br>1. Chuyên viên xem xét hồ sơ trong 1–2 ngày làm việc.<br>2. Chúng tôi gửi đánh giá sơ bộ qua email hoặc liên hệ để làm rõ thông tin.<br>3. Nếu cần bổ sung tài liệu, chuyên viên sẽ hướng dẫn trực tiếp.") +
      p("Vui lòng lưu mã hồ sơ để thuận tiện trao đổi. Bạn có thể trả lời email này nếu cần cập nhật thông tin.") +
      p("Trân trọng,<br><strong>Đội ngũ Vexim Global</strong>"),
  })
}

export function getGACCAdminNotificationHTML(params: GACCSubmissionParams): string {
  return renderEmail({
    title: "Hồ sơ đánh giá GACC mới",
    preheader: "Có hồ sơ mới cần xem xét trong 1–2 ngày làm việc.",
    body: p("Có yêu cầu đánh giá GACC mới từ website. Vui lòng kiểm tra hồ sơ và phản hồi trong 1–2 ngày làm việc.") +
      details(params, true) + emailButton("Xem chi tiết hồ sơ", `${SITE_URL}/admin/gacc-submissions/${encodeURIComponent(params.submissionId)}`),
  })
}
