/**
 * Quyết định KHI NÀO khung chat mời khách tư vấn sâu hơn qua Zalo/hotline.
 *
 * Trước đây chỉ hiện khi hệ thống chuyển chuyên viên (handoff). Thực tế rất nhiều
 * trường hợp khách cần người thật nhưng hệ thống không nhận ra: hỏi báo giá,
 * hỏi hồ sơ riêng của công ty, hỏi câu không có trong tài liệu, hoặc AI tự thấy
 * không đủ tự tin. Tách logic ra đây để kiểm thử được (khung chat cần trình duyệt).
 */
import { shouldSummarizeAndInvite, type LeadProfile } from "@/lib/lead-profile"

export type ConsultationReason =
  /** Hệ thống chuyển thẳng cho chuyên viên (rule engine) */
  | "handoff"
  /** Hệ thống đang xin thông tin liên hệ của khách */
  | "ask_contact"
  /** Hội thoại đã ở chế độ chuyên viên xử lý */
  | "handed_over"
  /** AI tự thấy cần người thật (shouldHandover) */
  | "ai_suggested"
  /** Không tìm thấy tài liệu nào phù hợp -> AI chỉ trả lời được ở mức chung */
  | "no_documents"
  /** Khách hỏi việc cần tư vấn sâu: báo giá, hợp đồng, hồ sơ riêng, khiếu nại… */
  | "deep_request"
  /** Đã thu đủ thông tin cơ bản (hoặc khách hỏi giá) -> tổng hợp và mời kết nối chuyên viên */
  | "ready_for_handoff"
  /** Lỗi kết nối, không trả lời được */
  | "error"

export interface ConsultationSignals {
  /** Trạng thái API trả về: ok | handed_over | handoff | ask_contact | error */
  status?: string
  /** AI đề nghị chuyển chuyên viên */
  suggestHandover?: boolean
  /** Số tài liệu nội bộ đã dùng để trả lời (0 = không có tài liệu nào khớp) */
  sourcesCount?: number
  /** Câu khách vừa gửi */
  customerMessage?: string
  /** Hồ sơ khách đã thu thập được (thị trường, nhóm sản phẩm, DUNS, số điện thoại) */
  leadProfile?: LeadProfile
}

export interface ConsultationDecision {
  offer: boolean
  reason: ConsultationReason | null
}

/** Việc khách hỏi mà chỉ chuyên viên mới trả lời chính xác được. */
const DEEP_REQUEST_PATTERNS: RegExp[] = [
  /\bbáo giá\b/i,
  /\bgiá\b/i,
  /\bchi phí\b/i,
  /\bbáo phí\b/i,
  /\bphí (dịch vụ|trọn gói|tổng)\b/i,
  /\bhợp đồng\b/i,
  /\bbáo giá|bảng giá\b/i,
  /\bgặp (người|chuyên viên|nhân viên|tư vấn)\b/i,
  /\btư vấn (viên|sâu|trực tiếp|riêng)\b/i,
  // Không dùng \b ở cuối: "số liên hệ" kết thúc bằng chữ có dấu nên JS không
  // tính là ký tự chữ -> \b sẽ không bao giờ khớp.
  /(số điện thoại|sđt|số zalo|số liên hệ|hotline|liên hệ em|gọi cho em)/i,
  /\bhotline\b/i,
  /\bgọi (điện|lại|cho)\b/i,
  /\bzalo\b/i,
  /\bkhiếu nại\b/i,
  /\bhồ sơ (của|công ty|bên em|bên tôi)\b/i,
  /\btrường hợp (riêng|cụ thể|của)\b/i,
  /\blàm việc (trực tiếp|với chuyên viên)\b/i,
]

const QUESTION_WORDS =
  /^(có|khi nào|bao giờ|bao lâu|bao nhiêu|làm sao|thế nào|như thế nào|tại sao|vì sao|ở đâu|ai|gì|sao)\b/i

/** Câu hỏi thật sự (không phải "ok", "cảm ơn", "xin chào"). */
export function isSubstantiveQuestion(message: string): boolean {
  const text = String(message || "").trim()
  if (text.length < 12) return false

  const wordCount = text.split(/\s+/).filter(Boolean).length
  if (wordCount < 4) return false

  return text.includes("?") || QUESTION_WORDS.test(text)
}

/** Khách đang hỏi việc cần tư vấn sâu (giá, hợp đồng, hồ sơ riêng, khiếu nại…). */
export function isDeepConsultationRequest(message: string): boolean {
  return DEEP_REQUEST_PATTERNS.some((pattern) => pattern.test(String(message || "")))
}

/**
 * Quyết định có mời khách liên hệ Zalo/hotline hay không.
 * Trả về LÝ DO để khung chat nói đúng ngữ cảnh, không lặp lại một câu máy móc.
 */
export function shouldOfferConsultation(signals: ConsultationSignals): ConsultationDecision {
  const { status, suggestHandover, sourcesCount, customerMessage = "" } = signals

  if (status === "error") return { offer: true, reason: "error" }
  if (status === "handoff") return { offer: true, reason: "handoff" }
  if (status === "ask_contact") return { offer: true, reason: "ask_contact" }
  if (status === "handed_over") return { offer: true, reason: "handed_over" }
  if (suggestHandover) return { offer: true, reason: "ai_suggested" }

  if (isDeepConsultationRequest(customerMessage)) return { offer: true, reason: "deep_request" }

  // Đủ thông tin cơ bản hoặc khách hỏi giá -> tổng hợp và mời kết nối chuyên viên
  if (signals.leadProfile && shouldSummarizeAndInvite(signals.leadProfile, customerMessage)) {
    return { offer: true, reason: "ready_for_handoff" }
  }

  // Không có tài liệu nào khớp + khách đang hỏi thật -> câu trả lời chỉ ở mức chung
  if (sourcesCount === 0 && isSubstantiveQuestion(customerMessage)) {
    return { offer: true, reason: "no_documents" }
  }

  return { offer: false, reason: null }
}
