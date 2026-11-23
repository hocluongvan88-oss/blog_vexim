"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

/**
 * Nút Zalo OA — kênh liên hệ nổi DUY NHẤT trên website (khung chat AI đang ẩn,
 * xem `SHOW_AI_CHAT` trong `components/client-widgets.tsx`).
 *
 * Vì sao trì hoãn: SDK `sp.zalo.me` kéo theo một khung iframe (page.widget.zalo.me)
 * tự tải hai font `fa-light-300.woff2` + `fa-regular-400.woff2`. Lighthouse xếp
 * cả cụm này vào "Hiển thị phông chữ" (~220 ms) và cộng thêm thời gian tải JS
 * bên thứ ba vào lúc trang cần CPU nhất — trong khi khách chưa hề bấm chat.
 *
 * Nay widget chỉ được nạp khi khách có dấu hiệu tương tác đầu tiên (chạm, cuộn,
 * gõ phím) hoặc sau `FALLBACK_MS` giây kể từ khi trang tải xong — nên nút Zalo
 * vẫn luôn xuất hiện, chỉ là không tranh băng thông với nội dung chính.
 *
 * Vị trí (góc phải dưới, 24px / 16px trên mobile, z-index 40) nằm trong
 * `app/globals.css` và `app/landing.css` — tìm chú thích "Nút Zalo OA".
 */
const FALLBACK_MS = 4000;

export function ZaloChatButton() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const events = ["pointerdown", "touchstart", "keydown", "scroll"] as const;

    const start = () => {
      if (timer) clearTimeout(timer);
      setReady(true);
    };
    // Nạp sớm khi khách tương tác; nếu không, nạp sau khi trang rảnh.
    events.forEach((name) =>
      window.addEventListener(name, start, { once: true, passive: true }),
    );

    const schedule = () => {
      timer = setTimeout(start, FALLBACK_MS);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      if (timer) clearTimeout(timer);
      events.forEach((name) => window.removeEventListener(name, start));
      window.removeEventListener("load", schedule);
    };
  }, []);

  if (!ready) return null;

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
  );
}
