/**
 * Thông tin liên hệ chính thức của Vexim Global — NGUỒN DUY NHẤT.
 *
 * Trước đây số hotline bị chép tay ở nhiều nơi (FAQ, email, trang dịch vụ, khung
 * chat…) nên rất dễ lệch nhau mỗi khi đổi số. Từ nay sửa một chỗ là toàn hệ
 * thống dùng theo.
 *
 * Số này vừa là hotline vừa là Zalo: khách bấm gọi thì gọi điện, bấm Zalo thì
 * mở đúng cuộc trò chuyện Zalo với số đó.
 */

/** Số ở dạng máy đọc (dùng cho link tel: và zalo.me). */
export const VEXIM_PHONE = "0373685634"

/** Số ở dạng hiển thị cho khách đọc. */
export const VEXIM_PHONE_DISPLAY = "0373 685 634"

/** Bấm là gọi điện luôn (trên điện thoại). */
export const VEXIM_PHONE_TEL_URL = `tel:${VEXIM_PHONE}`

/** Bấm là mở Zalo ở đúng số này (khách nhắn tin ngay, không cần lưu số). */
export const VEXIM_ZALO_URL = `https://zalo.me/${VEXIM_PHONE}`

/**
 * Trang hồ sơ năng lực chính thức (bằng chứng thực tế: chứng nhận FDA đã cấp,
 * case study, quy trình 5 bước, so sánh thị trường). Dùng khi khách hỏi Vexim có
 * uy tín không / đã làm cho ai chưa — người đi mua dịch vụ tư vấn luôn cần
 * kiểm chứng được, chứ không chỉ tin lời trợ lý ảo.
 */
export const VEXIM_CREDENTIALS_URL = "https://fda.veximglobal.com"

/** "0373685634" -> "0373 685 634" (giữ nguyên nếu không phải số 10 chữ số). */
export function formatVnPhone(phone: string = VEXIM_PHONE): string {
  const digits = String(phone).replace(/\D/g, "")
  if (digits.length !== 10) return phone
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`
}

/** Câu mời liên hệ dùng lại ở nhiều chỗ cho thống nhất giọng văn. */
export function contactInvite(): string {
  return `Nhắn Zalo hoặc gọi ${VEXIM_PHONE_DISPLAY} để chuyên viên Vexim tư vấn trực tiếp ạ.`
}
