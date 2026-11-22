"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import dynamic from "next/dynamic"

// Keep the floating widgets out of the new homepage's JS bundle.
const ChatWidget = dynamic(() => import("@/components/chat-widget").then(mod => mod.ChatWidget), { ssr: false })
const ZaloChatButton = dynamic(() => import("@/components/zalo-chat-button").then(mod => mod.ZaloChatButton), { ssr: false })

/**
 * Kênh liên hệ nổi trên website (ẩn trong trang quản trị /admin).
 *
 * Hiện chỉ còn MỘT kênh: nút Zalo OA ở góc phải dưới, mở cửa sổ chat Zalo
 * ngay trên trang. Khung chat AI (`components/chat-widget.tsx`) được GIỮ LẠI
 * trong mã nguồn nhưng không còn render — xem `SHOW_AI_CHAT` bên dưới.
 *
 * Lưu ý: ẩn khung chat AI KHÔNG ảnh hưởng đến webhook `/api/webhooks/zalo`,
 * hộp thư `/admin/conversations` hay kênh Zalo OA của Vexim. Khách vẫn nhắn
 * trực tiếp cho OA qua ứng dụng Zalo như bình thường.
 */
const SHOW_ZALO_BUTTON = true
const SHOW_AI_CHAT = false
const LANDING_PATHS = new Set(["/", "/privacy", "/en", "/en/privacy"])

export function ClientWidgets() {
  const pathname = usePathname()

  // Root layouts survive Next client-side navigation; keep the document language
  // aligned with the current page after navigation from a Vietnamese Next Link.
  useEffect(() => {
    document.documentElement.lang = pathname === "/en" || pathname === "/en/privacy" ? "en" : "vi"
    // Root layouts persist on client navigation; match the server's public
    // landing font rule when moving between home and service/blog pages.
    document.body.classList.toggle("font-sans", !LANDING_PATHS.has(pathname))
  }, [pathname])

  // Zalo là kênh liên hệ duy nhất nên hiện trên MỌI trang công khai, kể cả
  // landing page và /privacy. Chỉ ẩn trong trang quản trị /admin.
  if (pathname?.startsWith("/admin")) return null

  return (
    <>
      {SHOW_AI_CHAT && <ChatWidget />}
      {SHOW_ZALO_BUTTON && <ZaloChatButton />}
    </>
  )
}
