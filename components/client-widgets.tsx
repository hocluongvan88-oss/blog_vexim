"use client"

import { usePathname } from "next/navigation"
import { ChatWidget } from "@/components/chat-widget"
import { ZaloChatButton } from "@/components/zalo-chat-button"

/**
 * Bật/tắt nút Zalo OA nổi trên website.
 *
 * ĐANG TẮT theo yêu cầu: khách chỉ thấy trợ lý AI của Vexim, không còn hai nút
 * chat chồng nhau ở góc màn hình.
 *
 * Muốn bật lại: đổi thành `true`. (Nhớ thêm lại đoạn CSS đẩy nút Zalo sang góc
 * trái trong `app/globals.css` — tìm chú thích "Nút Zalo OA" — nếu không nút Zalo
 * sẽ nằm đè lên khung chat AI.)
 *
 * Lưu ý: tắt nút này KHÔNG ảnh hưởng đến kênh Zalo của Vexim. Khách vẫn nhắn
 * trực tiếp cho OA qua ứng dụng Zalo như bình thường, webhook `/api/webhooks/zalo`
 * và chuông thông báo cho admin vẫn hoạt động nguyên vẹn.
 */
const SHOW_ZALO_BUTTON = false

/**
 * Các kênh liên hệ hiển thị trên website (ẩn trong trang quản trị /admin).
 *
 *  1. Trợ lý AI của Vexim (khung chat góc phải) — trả lời ngay 24/7 bằng kho
 *     tri thức nội bộ; khi cần thì xin liên hệ và chuyển cho chuyên viên.
 *  2. (Đang tắt) Nút Zalo OA — xem `SHOW_ZALO_BUTTON` ở trên.
 */
export function ClientWidgets() {
  const pathname = usePathname()

  if (pathname?.startsWith("/admin")) return null

  return (
    <>
      <ChatWidget />
      {SHOW_ZALO_BUTTON && <ZaloChatButton />}
    </>
  )
}
