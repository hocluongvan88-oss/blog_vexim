import type React from "react";
import type { Metadata } from "next";
import "../landing.css";

/**
 * Layout cho 4 trang landing công khai: `/`, `/en`, `/privacy`, `/en/privacy`.
 *
 * Các trang này KHÔNG dùng chung `app/globals.css` (Tailwind quét toàn site,
 * ~181 KB CSS) mà dùng `landing.css` chỉ quét component landing + `components/ui`
 * dùng cho hộp thoại tư vấn. Xem chú thích đầu tệp `landing.css` để biết số đo.
 *
 * `metadata` ở đây chỉ là mặc định cho nhóm route; mỗi trang vẫn khai báo
 * canonical/OG riêng như trước.
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://www.veximglobal.com/"),
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
