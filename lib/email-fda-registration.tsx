import { SITE_URL } from "./business-profile"
import { emailButton, emailDetails, emailParagraph as p, escapeEmailHtml as e, renderEmail } from "./email-layout"

export interface FdaRenewalReminderParams {
  companyName: string
  contactName: string
  registrationType: string
  registrationNumber?: string
  expirationDate: string
  monthsBefore: number
}

export interface AgentRenewalReminderParams {
  companyName: string
  contactName: string
  agentCompanyName?: string
  agentName?: string
  contractEndDate: string
  contractYears?: number
}

export function getFdaRenewalReminderHTML(params: FdaRenewalReminderParams): string {
  return renderEmail({
    title: "Nhắc lịch gia hạn đăng ký FDA",
    preheader: `Vui lòng kiểm tra lịch gia hạn FDA của ${params.companyName}.`,
    body: p(`Kính gửi ${e(params.contactName)},`) +
      p(`Theo lịch đang lưu trong hệ thống, đăng ký FDA của <strong>${e(params.companyName)}</strong> còn ${e(params.monthsBefore)} tháng đến ngày hết hạn. Vui lòng kiểm tra thông tin và chuẩn bị gia hạn nếu áp dụng.`) +
      emailDetails([["Doanh nghiệp", params.companyName], ["Loại đăng ký", params.registrationType],
        ["Số đăng ký FDA", params.registrationNumber || "Chưa có"], ["Ngày hết hạn đang lưu", params.expirationDate]]) +
      p("Nếu thông tin đã thay đổi hoặc đã hoàn tất gia hạn, vui lòng thông báo cho chuyên viên để cập nhật hồ sơ.") +
      emailButton("Trao đổi về gia hạn FDA", `${SITE_URL}/services/fda`) +
      p("Trân trọng,<br><strong>Đội ngũ Vexim Global</strong>"),
  })
}

export function getAgentRenewalReminderHTML(params: AgentRenewalReminderParams): string {
  return renderEmail({
    title: "Nhắc lịch gia hạn US Agent",
    preheader: `Hợp đồng US Agent của ${params.companyName} sắp đến hạn.`,
    body: p(`Kính gửi ${e(params.contactName)},`) +
      p(`Hợp đồng US Agent của <strong>${e(params.companyName)}</strong> đang được lưu với ngày hết hạn bên dưới. Vui lòng kiểm tra và trao đổi kế hoạch gia hạn để tránh gián đoạn dịch vụ.`) +
      emailDetails([["Doanh nghiệp", params.companyName], ["Đơn vị US Agent", params.agentCompanyName],
        ["Người liên hệ Agent", params.agentName], ["Ngày hết hạn hợp đồng", params.contractEndDate],
        ["Thời hạn hợp đồng", params.contractYears ? `${params.contractYears} năm` : undefined]]) +
      p("Nếu đã gia hạn hoặc thay đổi đơn vị đại diện, vui lòng phản hồi để chúng tôi cập nhật thông tin.") +
      emailButton("Trao đổi về gia hạn US Agent", `${SITE_URL}/services/us-agent`) +
      p("Trân trọng,<br><strong>Đội ngũ Vexim Global</strong>"),
  })
}
