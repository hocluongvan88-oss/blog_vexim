import type React from "react"
import type { Metadata } from "next"
import { Be_Vietnam_Pro } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ClientWidgets } from "@/components/client-widgets"
import { Toaster } from "@/components/ui/sonner"

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-be-vietnam-pro",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://www.veximglobal.com"),
  title: {
    default: "Vexim Global - Giải Pháp Xuất Nhập Khẩu Toàn Cầu",
    template: "%s | Vexim Global",
  },
  description:
    "Chuyên gia tư vấn pháp lý xuất nhập khẩu hàng đầu Việt Nam. Dịch vụ đăng ký FDA, GACC, MFDS, CE và giấy phép xuất khẩu quốc tế.",
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
    url: "https://www.veximglobal.com",
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
  alternates: {
    canonical: "https://www.veximglobal.com",
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
  manifest: "/manifest.json",
  generator: 'v0.app'
}

/**
 * Đồ thị thực thể toàn site (Organization + WebSite).
 *
 * Đặt ở layout để MỌI trang — kể cả bài blog — đều có node Organization với @id cố định.
 * Nhờ đó BlogPosting.publisher trỏ "@id": ".../#organization" sẽ phân giải được,
 * và Google có tín hiệu E-E-A-T cấp tổ chức (logo, địa chỉ, kênh chính thức) ở mọi URL.
 */
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.veximglobal.com/#organization",
  name: "Vexim Global",
  alternateName: "Vexim",
  url: "https://www.veximglobal.com",
  logo: {
    "@type": "ImageObject",
    "@id": "https://www.veximglobal.com/#logo",
    url: "https://www.veximglobal.com/logo.png",
    width: 512,
    height: 512,
  },
  description:
    "Chuyên gia tư vấn pháp lý xuất nhập khẩu hàng đầu Việt Nam. Dịch vụ đăng ký FDA, GACC, MFDS, CE và giấy phép xuất khẩu quốc tế.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Hồ Chí Minh",
    addressCountry: "VN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Service",
    availableLanguage: ["Vietnamese", "English"],
  },
  sameAs: [
    "https://www.facebook.com/veximglobal",
    "https://www.linkedin.com/company/veximglobal",
    "https://zalo.me/veximglobal",
  ],
}

/**
 * WebSite node CHỈ để định danh website.
 * Đã bỏ "potentialAction": SearchAction — Google khai tử sitelinks search box từ 2024
 * và site không có endpoint tìm kiếm dạng ?search=.
 */
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.veximglobal.com/#website",
  name: "Vexim Global",
  url: "https://www.veximglobal.com",
  inLanguage: "vi-VN",
  publisher: { "@id": "https://www.veximglobal.com/#organization" },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className={`${beVietnamPro.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        {children}
        <ClientWidgets />
        {/* Toaster của sonner: trước đây không được mount nên mọi toast() đều bị "câm" */}
        <Toaster richColors closeButton position="top-right" />
        <Analytics />
      </body>
    </html>
  )
}
