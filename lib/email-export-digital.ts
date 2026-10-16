import { type ExportDigitalLead } from "./export-digital-lead"
import { emailDetails, emailParagraph, renderEmail } from "./email-layout"

export function getExportDigitalAdminEmail(lead: ExportDigitalLead, requestId: string): string {
  return renderEmail({
    title: "Yêu cầu báo cáo Export Digital mới",
    preheader: "Cần gửi báo cáo Buyer và AI nhìn thấy gì về bạn trong 2 ngày làm việc.",
    body:
      emailParagraph(
        "Khách hàng đã đăng ký báo cáo miễn phí <strong>Buyer và AI nhìn thấy gì về bạn</strong>. Vui lòng phân công chuyên viên và gửi báo cáo trong <strong>2 ngày làm việc</strong> qua điện thoại/Zalo hoặc email nếu có.",
      ) +
      emailDetails([
        ["Mã yêu cầu", requestId],
        ["Website", lead.noWebsite ? "Chưa có website" : lead.website],
        ["Doanh nghiệp", lead.company],
        ["Sản phẩm", lead.product],
        ["Thị trường", lead.markets.join(", ")],
        ["Người liên hệ", lead.name],
        ["Điện thoại/Zalo", lead.phone],
        ["Email", lead.email || "Không cung cấp — liên hệ qua điện thoại/Zalo"],
        ["Kênh bán hiện tại", lead.channels.join(", ") || "Chưa cung cấp"],
        ["Nguồn", "/services/export-digital"],
        ["Thời gian", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })],
      ]) +
      emailParagraph(
        "Đây là yêu cầu nhận báo cáo, không phải đồng ý mua dịch vụ. Chưa tự động tạo dự án Vexim Growth; nhân viên tiếp nhận từ email này và theo dõi xử lý nội bộ. Không đưa thông tin khách vào công cụ AI bên ngoài nếu chưa có cơ sở phù hợp.",
      ),
  })
}
