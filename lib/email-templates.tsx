import { SITE_URL } from "./business-profile"
import { emailButton, emailDetails, emailParagraph as p, emailUrl, escapeEmailHtml as e, renderEmail } from "./email-layout"

export interface FDAEmailAlert {
  title: string
  criticalInfo?: string
  aiSummary?: string
  date?: string
  manufacturer?: string
  classification?: string
  distributionPattern?: string
}

export interface EmailTemplateParams {
  email: string
  verificationLink?: string
  unsubscribeLink?: string
  alerts?: FDAEmailAlert[]
  alertCount?: number
}

function unsubscribe(link?: string): string {
  return link ? `<p style="margin:12px 0 0;"><a href="${emailUrl(link)}" style="color:#17365d;">Hủy đăng ký cảnh báo FDA</a></p>` : ""
}

export function getVerificationEmailHTML(params: EmailTemplateParams): string {
  if (!params.verificationLink) throw new Error("Verification email requires a verification link")
  return renderEmail({
    title: "Xác nhận đăng ký FDA Tracker",
    preheader: "Xác nhận địa chỉ email để bắt đầu nhận cảnh báo FDA. Liên kết có hiệu lực trong 24 giờ.",
    body: p("Xin chào bạn,") +
      p("Bạn vừa đăng ký nhận cảnh báo FDA từ Vexim Global. Vui lòng xác nhận địa chỉ email để hoàn tất đăng ký:") +
      emailDetails([["Email đăng ký", params.email]]) +
      emailButton("Xác nhận email của tôi", params.verificationLink) +
      p("<strong>Liên kết có hiệu lực trong 24 giờ.</strong> Sau khi xác nhận, bạn sẽ nhận thông báo theo nhóm sản phẩm và tần suất đã chọn.") +
      p("FDA Tracker tổng hợp cảnh báo và thông tin thu hồi từ FDA, kèm tóm tắt tiếng Việt khi có. Nội dung hỗ trợ tham khảo, không thay thế thông báo gốc của FDA.") +
      p(`Nếu nút không mở được, hãy sao chép liên kết này vào trình duyệt:<br><a href="${emailUrl(params.verificationLink)}" style="color:#17365d;word-break:break-all;">${e(params.verificationLink)}</a>`) +
      p("Nếu bạn không thực hiện đăng ký này, hãy bỏ qua email. Đăng ký chưa được kích hoạt cho đến khi xác nhận."),
    footerLinks: unsubscribe(params.unsubscribeLink),
  })
}

function alertContent(alert: FDAEmailAlert): string {
  return `<h2 style="font-size:20px;line-height:28px;margin:26px 0 14px;">${e(alert.title)}</h2>` +
    (alert.criticalInfo ? p(`<strong>Thông tin cần lưu ý:</strong> ${e(alert.criticalInfo)}`) : "") +
    (alert.aiSummary ? p(`<strong>Tóm tắt AI (tham khảo):</strong> ${e(alert.aiSummary)}`) : "") +
    emailDetails([
      ["Ngày thông báo", alert.date ? formatDate(alert.date) : undefined],
      ["Nhà sản xuất", alert.manufacturer], ["Phân loại FDA", alert.classification], ["Phân phối", alert.distributionPattern],
    ])
}

function formatDate(date: string): string {
  const parsed = new Date(date)
  return Number.isNaN(parsed.getTime()) ? date : parsed.toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })
}

/** Match Class I, not Class II/III. */
export function isHighRiskAlert(alert: FDAEmailAlert): boolean {
  return /^(?:class\s+)?I(?:\b|$)/i.test((alert.classification ?? "").trim())
}

export function getAlertEmailHTML(params: EmailTemplateParams & { frequency: "daily" | "weekly" }): string {
  const alerts = params.alerts ?? []
  const count = params.alertCount ?? alerts.length
  const title = params.frequency === "daily" ? "Bản tin cảnh báo FDA hôm nay" : "Bản tin cảnh báo FDA tuần này"
  return renderEmail({
    title,
    preheader: `${count} cảnh báo trong bản tin FDA của bạn.`,
    body: p(`Xin chào bạn, dưới đây là bản tin dành cho <strong>${e(params.email)}</strong>.`) +
      emailDetails([["Tổng cảnh báo", count], ["Hiển thị trong email", Math.min(alerts.length, 5)], ["Class I trong danh sách nhận được", alerts.filter(isHighRiskAlert).length]]) +
      (alerts.length ? alerts.slice(0, 5).map(alertContent).join("") : p("Chưa có cảnh báo trong danh sách này.")) +
      (count > 5 ? p(`Còn ${count - 5} cảnh báo khác. Xem danh sách đầy đủ trên website.`) : "") +
      emailButton("Xem FDA Tracker", `${SITE_URL}/fda-tracker`) +
      p("Đối chiếu sản phẩm, số lô và phạm vi phân phối với thông báo gốc của FDA trước khi đưa ra quyết định. Tóm tắt AI có thể chưa đầy đủ."),
    footerLinks: unsubscribe(params.unsubscribeLink),
  })
}

export function getImmediateAlertEmailHTML(params: EmailTemplateParams & { alert: FDAEmailAlert }): string {
  return renderEmail({
    title: "Thông báo cảnh báo FDA mới",
    preheader: params.alert.title,
    body: p("Có cảnh báo FDA mới thuộc nhóm sản phẩm bạn đang theo dõi. Vui lòng kiểm tra thông tin bên dưới:") +
      alertContent(params.alert) + emailButton("Kiểm tra cảnh báo trên website", `${SITE_URL}/fda-tracker`) +
      p("Nếu sản phẩm của bạn có liên quan, hãy đối chiếu thông báo gốc của FDA và trao đổi với chuyên viên phụ trách. Tóm tắt AI chỉ mang tính tham khảo."),
    footerLinks: unsubscribe(params.unsubscribeLink),
  })
}

export function getUnsubscribeEmailHTML(params: EmailTemplateParams): string {
  return renderEmail({
    title: "Đã hủy đăng ký cảnh báo FDA",
    preheader: "Bạn sẽ không còn nhận bản tin cảnh báo FDA từ Vexim Global.",
    body: p(`Đăng ký cảnh báo FDA của <strong>${e(params.email)}</strong> đã được hủy.`) +
      p("Bạn sẽ không còn nhận các email cảnh báo theo đăng ký này. Cảm ơn bạn đã sử dụng FDA Tracker của Vexim Global.") +
      p("Nếu muốn tiếp tục theo dõi, bạn có thể đăng ký lại trên website.") +
      emailButton("Quay lại FDA Tracker", `${SITE_URL}/fda-tracker`),
  })
}
