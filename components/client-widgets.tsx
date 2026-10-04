"use client"

import { usePathname } from "next/navigation"
import { ChatWidget } from "@/components/chat-widget"
import { ZaloChatButton } from "@/components/zalo-chat-button"

/**
 * Hai kênh liên hệ hiển thị trên website:
 *
 *  1. Trợ lý AI của Vexim (khung chat góc phải) — trả lời ngay 24/7 bằng kho
 *     tri thức nội bộ; khi cần thì xin liên hệ và chuyển cho chuyên viên.
 *  2. Nút Zalo OA (CSS đẩy sang góc TRÁI để không đè lên khung chat AI) —
 *     kênh khách quen dùng và là nơi admin đang theo dõi.
 *
 * Trước đây chỉ gắn ZaloChatButton, còn ChatWidget nằm im trong mã nguồn nên
 * khách vào website không thấy trợ lý AI đâu.
 *
 * Không hiển thị trong trang quản trị (/admin) để không che giao diện làm việc.
 */
export function ClientWidgets() {
  const pathname = usePathname()

  if (pathname?.startsWith("/admin")) return null

  return (
    <>
      <ChatWidget />
      <ZaloChatButton />
    </>
  )
}
