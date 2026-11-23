"use client";

import type React from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { ClientWidgets } from "@/components/client-widgets";

/*
 * Phần "vỏ" phía client của layout gốc: Toaster (sonner) và các widget nổi.
 *
 * Vì sao tách khỏi app/layout.tsx: Toaster từng được mount ở MỌI trang, kéo
 * theo thư viện `sonner` (~33 KB JS) và `next-themes` vào gói tải về của cả
 * trang chủ — nơi không có toast nào. Giờ nó chỉ được nạp ở những khu vực thật
 * sự gọi `toast()` (admin, cổng khách hàng), còn trang công khai thì không.
 *
 * `HomeWidgets` cũng tách khỏi `client-widgets.tsx` vì tệp đó có
 * `usePathname()`: nếu dùng ở root layout thì MỌI trang (kể cả `/`, `/en`,
 * `/privacy`) buộc phải render động theo từng request. Bản ở đây không gọi
 * `usePathname()`, nhờ vậy 4 trang landing quay lại được chế độ static.
 */

const LANDING_PATHS = new Set(["/", "/privacy", "/en", "/en/privacy"]);
const STAFF_PATHS = ["/admin", "/client-portal"];

/**
 * Toaster nạp theo nhu cầu: `sonner` + `next-themes` chỉ tải khi thật sự cần,
 * nên trang admin/cổng khách hàng không bị trả giá ở lần vẽ đầu.
 */
const Toaster = dynamic(
  () => import("@/components/ui/sonner").then((mod) => mod.Toaster),
  { ssr: false },
);

/** Widget nổi cho trang công khai: chỉ Zalo OA (xem components/client-widgets.tsx). */
const PublicWidgets = dynamic(
  () =>
    import("@/components/zalo-chat-button").then((mod) => mod.ZaloChatButton),
  { ssr: false },
);

export function RootShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const isLanding = LANDING_PATHS.has(pathname);
  const isStaff = STAFF_PATHS.some((prefix) => pathname.startsWith(prefix));

  return (
    <>
      {children}
      {isStaff ? <ClientWidgets /> : <PublicWidgets />}
      {/* sonner chỉ cần ở nơi có gọi toast(): admin và cổng khách hàng. */}
      {isStaff && <Toaster richColors closeButton position="top-right" />}
    </>
  );
}
