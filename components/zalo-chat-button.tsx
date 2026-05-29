"use client"

import Script from "next/script"

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
