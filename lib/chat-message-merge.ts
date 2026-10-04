/**
 * Gộp tin nhắn mới vào khung chat của khách.
 *
 * Tách riêng khỏi component để kiểm thử được (component cần trình duyệt).
 *
 * Ba tình huống thực tế phải xử lý đúng:
 *  1. Máy khách gửi tin -> hiện ngay với id tạm. Khi nạp lại lịch sử, DB trả về
 *     chính tin đó với id thật -> nếu không lọc, mỗi nhịp polling lại nhân đôi
 *     tin của khách.
 *  2. Chuyên viên trả lời trong trang quản trị (sender_type = "agent") -> phải
 *     hiện trong khung chat và tính là tin chưa đọc khi khung đang đóng.
 *  3. Polling chạy lặp lại -> không được thêm trùng tin đã có.
 */

export interface MergeableMessage {
  id: string | number
  sender_type: string
  message_text: string
  created_at?: string
}

export interface MergeResult<T extends MergeableMessage> {
  /** Tin nhắn mới cần thêm vào giao diện (rỗng nếu không có gì mới). */
  added: T[]
  /** Số tin chưa đọc tăng thêm (chỉ tính bot/chuyên viên, không tính khách). */
  unread: number
}

export function mergeIncomingMessages<T extends MergeableMessage>(
  incoming: T[] | null | undefined,
  knownIds: Set<string>,
  localCustomerTexts: Set<string>,
  options: { countUnread?: boolean } = {},
): MergeResult<T> {
  if (!incoming || incoming.length === 0) return { added: [], unread: 0 }

  const added: T[] = []

  for (const message of incoming) {
    const id = String(message.id)
    if (knownIds.has(id)) continue

    // Tin của chính khách đã gửi ở máy này (id trong DB khác id tạm)
    if (message.sender_type === "customer" && localCustomerTexts.has(String(message.message_text || "").trim())) {
      knownIds.add(id)
      continue
    }

    knownIds.add(id)
    added.push(message)
  }

  const unread = options.countUnread
    ? added.filter((message) => message.sender_type === "bot" || message.sender_type === "agent").length
    : 0

  return { added, unread }
}
