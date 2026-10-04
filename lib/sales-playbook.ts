/**
 * "Cẩm nang bán hàng" nhúng vào prompt của AI.
 *
 * ── VÌ SAO ĐẶT Ở ĐÂY MÀ KHÔNG CHỈ ĐỂ TRONG KHO TRI THỨC ──────────────
 * Tách theo BẢN CHẤT nội dung:
 *
 * 1. QUY TẮC HÀNH VI (thu thập thông tin, khi nào tổng hợp, câu hỏi kết nối
 *    chuyên viên, cách xưng hô) -> BẮT BUỘC là luật cứng, nhúng thẳng vào prompt.
 *    Lý do: kho tri thức là tìm kiếm theo ngữ nghĩa, có lúc không khớp thì AI
 *    không thấy luật nữa. Hành vi phải đúng 100% mọi lượt chat.
 *
 * 2. SỐ LIỆU / ĐIỀU KIỆN (1–2 ngày, 5–8 ngày, GACC 15–30 ngày, chỉ nhận nhóm
 *    chế biến) -> vừa nằm trong KHO TRI THỨC (admin tự sửa, không cần deploy)
 *    vừa có bảng tra nhanh ở đây. Lý do: con số sẽ thay đổi theo thời gian, mà
 *    RAG có thể không tìm ra đoạn ngắn -> AI phải luôn biết để trả lời đúng.
 *
 * Admin sửa được nội dung này KHÔNG cần deploy: đặt khoá `sales_playbook`
 * trong bảng ai_config (xem scripts/040_them_cam_nang_ban_hang.sql).
 */
import {
  HANDOFF_CONNECT_QUESTION,
  VEXIM_TIMELINES,
  isLeadReady,
  missingLeadFields,
  summarizeLead,
  type LeadProfile,
} from "@/lib/lead-profile"

export { HANDOFF_CONNECT_QUESTION }

export const DEFAULT_SALES_PLAYBOOK = `🎯 CÁCH TƯ VẤN NHƯ NHÂN VIÊN KINH DOANH CỦA VEXIM
- Trả lời câu hỏi của khách TRƯỚC, rồi mới hỏi thêm thông tin để tư vấn sát hơn — giống một sale đang tư vấn, KHÔNG hỏi dồn một loạt.
- Câu hỏi kỹ thuật thì trả lời ĐẦY ĐỦ và có cấu trúc (gạch đầu dòng hoặc bảng ngắn) — khách doanh nghiệp đánh giá năng lực qua câu trả lời đầu tiên. Trả lời mỏng rồi xin số điện thoại sẽ bị coi là máy thu lead.
- Mỗi lượt chỉ hỏi 1–2 thông tin quan trọng nhất còn thiếu.
- Những thông tin cần nắm trước khi chuyển chuyên viên:
  1) Thị trường cần đăng ký (FDA Mỹ / GACC Trung Quốc / MFDS Hàn Quốc…)
  2) Nhóm sản phẩm (thực phẩm đóng hộp, sản phẩm chế biến, nguyên liệu thô…)
  3) Đã có mã DUNS đúng với địa chỉ nhà máy sản xuất chưa
  4) Số điện thoại/Zalo để chuyên viên liên hệ lại
  (nên biết thêm: tên công ty/nhà máy)
- Khi khách HỎI GIÁ hoặc khi đã đủ 4 thông tin trên: tổng hợp lại những gì đã biết trong 3–5 dòng gạch đầu dòng, rồi LUÔN kết thúc bằng câu: "${HANDOFF_CONNECT_QUESTION}"
- Khi khách cần tư vấn sâu (báo giá, hồ sơ riêng của công ty, hợp đồng, khiếu nại, hoặc câu hỏi ngoài tài liệu): nói rõ cần chuyên viên kiểm tra kỹ hơn, rồi LUÔN kết thúc bằng câu: "${HANDOFF_CONNECT_QUESTION}"
- Khách đã đồng ý (nói "có", "đồng ý", "ok") thì xác nhận ngắn gọn rằng em đã ghi nhận và chuyên viên sẽ liên hệ trong giờ làm việc.
- TUYỆT ĐỐI không tự bịa giá, thời hạn hay cam kết ngoài SỐ LIỆU CHUẨN bên dưới và tài liệu nội bộ.`

export const SALES_FACTS = `📌 SỐ LIỆU CHUẨN DO VEXIM CUNG CẤP (dùng đúng con số, không suy diễn):
- Đăng ký FDA (Mỹ): khoảng ${VEXIM_TIMELINES.fdaWithDuns} nếu khách ĐÃ có mã DUNS đúng với địa chỉ thực tế của nhà máy; khoảng ${VEXIM_TIMELINES.fdaWithoutDuns} nếu CHƯA có mã DUNS.
- Đăng ký GACC (Trung Quốc): Vexim chỉ nhận đăng ký ${VEXIM_TIMELINES.gaccNote.toLowerCase()}; thời gian khoảng ${VEXIM_TIMELINES.gacc}.
- Đây là mốc tham khảo — nói rõ với khách là thời gian thực tế phụ thuộc hồ sơ, và mời chuyên viên xác nhận khi khách cần con số chính xác.`

/**
 * Dựng khối cẩm nang để nhúng vào system prompt.
 * Khi đã có hồ sơ khách: nói rõ ĐÃ NẮM gì và CÒN THIẾU gì để AI hỏi đúng chỗ,
 * không hỏi lại thứ khách đã trả lời.
 */
export function buildSalesPlaybook(
  profile: LeadProfile = {},
  options: { adminPlaybook?: string } = {},
): string {
  const body = (options.adminPlaybook || DEFAULT_SALES_PLAYBOOK).trim()

  const known = summarizeLead(profile)
  const missing = missingLeadFields(profile)

  const status: string[] = []
  if (known.length > 0) {
    status.push(`✅ ĐÃ NẮM ĐƯỢC THÔNG TIN CỦA KHÁCH (không hỏi lại):\n${known.map((line) => `   - ${line}`).join("\n")}`)
  }
  if (missing.length > 0) {
    status.push(
      `❓ CÒN THIẾU (hỏi tự nhiên 1–2 câu mỗi lượt, ưu tiên theo thứ tự):\n${missing
        .map((field) => `   - ${field.question}`)
        .join("\n")}`,
    )
  } else if (isLeadReady(profile)) {
    status.push(
      `🎉 ĐÃ ĐỦ THÔNG TIN: hãy tổng hợp ngắn gọn và hỏi "${HANDOFF_CONNECT_QUESTION}" nếu chưa hỏi.`,
    )
  }

  return `\n\n${body}\n\n${SALES_FACTS}${status.length > 0 ? "\n\n" + status.join("\n\n") : ""}`
}
