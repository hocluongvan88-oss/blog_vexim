import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Hủy đăng ký cảnh báo FDA",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
}

export default function UnsubscribeLayout({ children }: { children: ReactNode }) {
  return children
}
