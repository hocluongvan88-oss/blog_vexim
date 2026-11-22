"use client"

import Script from "next/script"

/**
 * Nút Zalo OA — kênh liên hệ nổi DUY NHẤT trên website sau khi khung chat AI
 * được ẩn (xem `SHOW_AI_CHAT` trong `components/client-widgets.tsx`).
 *
 * Vị trí (góc phải dưới, 24px / 16px trên mobile, z-index 40) nằm trong
 * `app/globals.css` — tìm chú thích "Nút Zalo OA".
 */
export function ZaloChatButton() {
  return (
    <>
      <div
        className="zalo-chat-widget"
        data-oaid="2933050463560569889"
        data-welcome-message="Chào bạn, Vexim Global có thể hỗ trợ được gì cho bạn?"
        data-autopopup="0"
        data-width="300"
        data-height="420"
      />
      <Script src="https://sp.zalo.me/plugins/sdk.js" strategy="lazyOnload" />
    </>
  )
}
