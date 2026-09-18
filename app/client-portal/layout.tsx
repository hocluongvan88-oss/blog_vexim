import type { Metadata } from "next"
import type React from "react"

/**
 * Khu vực đăng nhập của khách hàng: không có nội dung hữu ích cho search engine
 * (toàn bộ giao diện nằm sau lớp xác thực). Trước đây trang này không chặn index
 * nên có thể xuất hiện trong kết quả tìm kiếm dưới dạng trang gần như trống.
 */
export const metadata: Metadata = {
  title: "Cổng thông tin khách hàng | Vexim Global",
  robots: {
    index: false,
    follow: false,
  },
}

export default function ClientPortalLayout({ children }: { children: React.ReactNode }) {
  return children
}
