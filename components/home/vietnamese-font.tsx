import type { ReactNode } from "react"
import localFont from "next/font/local"

// The new hero is a lightweight inline SVG. Load the local headline and body
// faces early so Vietnamese line breaks match the design on a cold visit.
const homeVietnamese = localFont({
  src: [
    { path: "../../app/fonts/BeVietnamPro-Regular.woff2", weight: "400" },
    { path: "../../app/fonts/BeVietnamPro-SemiBold.woff2", weight: "600" },
    { path: "../../app/fonts/BeVietnamPro-Bold.woff2", weight: "700" },
  ],
  display: "swap",
  preload: true,
  variable: "--font-vexim-home-vi",
})

/**
 * Bọc font tiếng Việt cho các trang tiếng Việt của landing page. Khi tiếng Việt
 * chuyển về URL gốc, cả `/` và `/privacy` đều cần lớp này; `/en` thì không.
 */
export default function VietnameseLayout({ children }: { children: ReactNode }) {
  return <div className={homeVietnamese.variable}>{children}</div>
}
