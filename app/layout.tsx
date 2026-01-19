import type React from "react"
import type { Metadata } from "next"
import { Be_Vietnam_Pro } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ZaloChatButton } from "@/components/zalo-chat-button"

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-be-vietnam-pro",
})

export const metadata: Metadata = {
  title: "Vexim Global - Giải Pháp Xuất Nhập Khẩu Toàn Cầu",
  description:
    "Chuyên gia tư vấn pháp lý xuất nhập khẩu hàng đầu Việt Nam. Dịch vụ đăng ký FDA, GACC, MFDS, CE và giấy phép xuất khẩu quốc tế.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className={`${beVietnamPro.variable} font-sans antialiased`}>
        {children}
        <ZaloChatButton />
        <Analytics />
      </body>
    </html>
  )
}
