import type { ReactNode } from "react"
import localFont from "next/font/local"

// Route-scoped font for the Vietnamese landing pages. Optional display avoids
// a late font swap/CLS on slow connections; without eager font preloads, the
// hero image and critical CSS retain network priority. Service/blog fonts are
// still configured by the root layout.
const homeVietnamese = localFont({
  src: [
    { path: "../fonts/BeVietnamPro-Regular.woff2", weight: "400" },
    { path: "../fonts/BeVietnamPro-SemiBold.woff2", weight: "600" },
  ],
  display: "optional",
  preload: false,
  variable: "--font-vexim-home-vi",
})

export default function VietnameseLayout({ children }: { children: ReactNode }) {
  return <div className={homeVietnamese.variable}>{children}</div>
}
