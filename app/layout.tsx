import type React from "react"
import type { Metadata } from "next"
import { Be_Vietnam_Pro } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ClientWidgets } from "@/components/client-widgets"
import { ChatWidget } from "@/components/chat-widget" // Declare the ChatWidget variable

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-be-vietnam-pro",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://vexim.vn"),
  title: {
    default: "Vexim Global - Giải Pháp Xuất Nhập Khẩu Toàn Cầu",
    template: "%s | Vexim Global",
  },
  description:
    "Chuyên gia tư vấn pháp lý xuất nhập khẩu hàng đầu Việt Nam. Dịch vụ đăng ký FDA, GACC, MFDS, CE và giấy phép xuất khẩu quốc tế.",
  keywords: [
    "xuất nhập khẩu",
    "FDA",
    "GACC",
    "MFDS",
    "tư vấn xuất khẩu",
    "đăng ký xuất khẩu",
    "giấy phép xuất khẩu",
    "xuất khẩu thực phẩm",
    "US Agent",
    "truy xuất nguồn gốc",
  ],
  authors: [{ name: "Vexim Global" }],
  creator: "Vexim Global",
  publisher: "Vexim Global",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://vexim.vn",
    siteName: "Vexim Global",
    title: "Vexim Global - Giải Pháp Xuất Nhập Khẩu Toàn Cầu",
    description:
      "Chuyên gia tư vấn pháp lý xuất nhập khẩu hàng đầu Việt Nam. Dịch vụ đăng ký FDA, GACC, MFDS, CE và giấy phép xuất khẩu quốc tế.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Vexim Global",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vexim Global - Giải Pháp Xuất Nhập Khẩu Toàn Cầu",
    description:
      "Chuyên gia tư vấn pháp lý xuất nhập khẩu hàng đầu Việt Nam. Dịch vụ đăng ký FDA, GACC, MFDS, CE và giấy phép xuất khẩu quốc tế.",
    images: ["/og-image.jpg"],
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://vexim.vn",
  },
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
  generator: 'v0.app'
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
        <ClientWidgets />
        <Analytics />
      </body>
    </html>
  )
}
