import { OPENING_HOURS_LABELS, SITE_URL } from "./business-profile"
import { emailButton, emailDetails, emailParagraph as p, escapeEmailHtml as e, renderEmail } from "./email-layout"

export interface ConsultationParams {
  name: string
  phone: string
  email: string
  serviceName: string
  product?: string
  description?: string
}

function details(params: ConsultationParams): string {
  return emailDetails([
    ["Họ tên", params.name], ["Số điện thoại", params.phone], ["Email", params.email],
    ["Dịch vụ quan tâm", params.serviceName], ["Sản phẩm", params.product], ["Nội dung yêu cầu", params.description],
  ])
}

export function getConsultationCustomerHTML(params: ConsultationParams): string {
  return renderEmail({
    title: "Đã nhận yêu cầu tư vấn của bạn",
    preheader: "Vexim Global đã nhận thông tin và sẽ liên hệ với bạn trong vòng 24 giờ.",
    body: p(`Xin chào ${e(params.name)},`) +
      p("Cảm ơn bạn đã liên hệ Vexim Global. Chúng tôi đã nhận được yêu cầu tư vấn với các thông tin dưới đây:") +
      details(params) +
      p("<strong>Chuyên viên Vexim Global sẽ liên hệ trong vòng 24 giờ</strong> để trao đổi về nhu cầu và hướng xử lý phù hợp.") +
      p(`Giờ làm việc: ${OPENING_HOURS_LABELS.map(e).join("; ")}.`) +
      emailButton("Xem các dịch vụ của Vexim", SITE_URL) +
      p("Nếu cần điều chỉnh thông tin, bạn có thể trả lời email này hoặc liên hệ theo thông tin cuối thư.") +
      p("Trân trọng,<br><strong>Đội ngũ Vexim Global</strong>"),
  })
}

export function getConsultationAdminHTML(params: ConsultationParams): string {
  return renderEmail({
    title: "Yêu cầu tư vấn mới từ website",
    preheader: "Có khách hàng mới cần liên hệ trong vòng 24 giờ.",
    body: p("Vui lòng kiểm tra thông tin và liên hệ khách hàng trong vòng <strong>24 giờ</strong>.") +
      details(params) + emailDetails([["Thời gian nhận", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })]]),
  })
}
