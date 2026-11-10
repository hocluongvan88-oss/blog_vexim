"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import dynamic from "next/dynamic"

// Keep the Vietnamese floating widgets out of the new homepage's JS bundle.
const ChatWidget = dynamic(() => import("@/components/chat-widget").then(mod => mod.ChatWidget), { ssr: false })
const ZaloChatButton = dynamic(() => import("@/components/zalo-chat-button").then(mod => mod.ZaloChatButton), { ssr: false })

/**
 * Bật/tắt nút Zalo OA nổi trên website.
 *
 * ĐANG BẬT: nút Zalo nằm ở góc phải dưới, phía DƯỚI khung chat AI (khung chat AI
 * được đẩy lên `bottom-24` trong chat-widget.tsx). CSS vị trí nằm trong
 * `app/globals.css` — tìm chú thích "Nút Zalo OA".
 *
 * Muốn tắt: đổi thành `false`.
 *
 * Lưu ý: tắt nút này KHÔNG ảnh hưởng đến kênh Zalo của Vexim. Khách vẫn nhắn
 * trực tiếp cho OA qua ứng dụng Zalo như bình thường, webhook `/api/webhooks/zalo`
 * và chuông thông báo cho admin vẫn hoạt động nguyên vẹn.
 */
const SHOW_ZALO_BUTTON = true
const LANDING_PATHS = new Set(["/", "/privacy", "/vi", "/vi/privacy"])

/**
 * Các kênh liên hệ hiển thị trên website (ẩn trong trang quản trị /admin).
 *
 *  1. Trợ lý AI của Vexim (khung chat góc phải) — trả lời ngay 24/7 bằng kho
 *     tri thức nội bộ; khi cần thì xin liên hệ và chuyển cho chuyên viên.
 *  2. (Đang tắt) Nút Zalo OA — xem `SHOW_ZALO_BUTTON` ở trên.
 */
export function ClientWidgets() {
  const pathname = usePathname()

  // Root layouts survive Next client-side navigation; keep the document language
  // aligned with the current page after navigation from a Vietnamese Next Link.
  useEffect(() => {
    document.documentElement.lang = pathname === "/" || pathname === "/privacy" ? "en" : "vi"
    // Root layouts persist on client navigation; match the server's public
    // landing font rule when moving between home and service/blog pages.
    document.body.classList.toggle("font-sans", !LANDING_PATHS.has(pathname))
  }, [pathname])

  // Both localized landing/privacy pairs share the audit/contact flow. Keep
  // Vietnamese chat/Zalo overlays (and their third-party SDK) on the existing
  // service/blog routes, not over either editorial homepage.
  if (LANDING_PATHS.has(pathname) || pathname?.startsWith("/admin")) return null

  return (
    <>
      <ChatWidget />
      {SHOW_ZALO_BUTTON && <ZaloChatButton />}
    </>
  )
}
