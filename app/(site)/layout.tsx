import type React from "react";
import "../globals.css";

/**
 * Layout cho khu vực dùng Tailwind toàn site: admin, blog, 23 trang dịch vụ và
 * cổng khách hàng. `globals.css` vẫn là nguồn duy nhất của theme/utility cho
 * các trang này; các trang landing công khai dùng `app/(landing)/landing.css`.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
