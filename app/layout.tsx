import type React from "react"
import type { Metadata } from "next"
import { Be_Vietnam_Pro } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ClientWidgets } from "@/components/client-widgets"
import { Toaster } from "@/components/ui/sonner"
import { JsonLd } from "@/components/json-ld"
import { buildSiteSchema } from "@/lib/schema"
import {
  OG_IMAGE,
  OG_IMAGE_ALT,
  ORGANIZATION_NAME,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
  SITE_URL_WITH_SLASH,
} from "@/lib/business-profile"

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-be-vietnam-pro",
})

/**
 * Metadata gốc.
 *
 * Hai thay đổi có chủ đích:
 *  1. `title.default` / `description` nay dùng chung hằng số trong
 *     `lib/business-profile.ts` với `app/page.tsx`, nên meta description,
 *     og:description và twitter:description KHÔNG THỂ lệch nhau nữa. Bản cũ
 *     liệt kê GACC/MFDS/CE trong meta description — những dịch vụ trang chủ
 *     không hề đề cập (GACC/MFDS có trang riêng, nhưng không nằm trong 6 dịch
 *     vụ ở trang chủ), tức là hứa với người tìm kiếm thứ trang không có.
 *  2. Bỏ `alternates.canonical` cấp layout. Canonical trong layout được Next
 *     kế thừa xuống MỌI trang con không tự khai, nên một trang như
 *     /services/fda-label-check đang bị gắn canonical về trang chủ. Mỗi trang
 *     phải tự khai canonical của chính nó.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL_WITH_SLASH),
  title: {
    default: SITE_TITLE,
    template: "%s | Vexim Global",
  },
  description: SITE_DESCRIPTION,
  authors: [{ name: ORGANIZATION_NAME }],
  creator: ORGANIZATION_NAME,
  publisher: ORGANIZATION_NAME,
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
    // Có "/" ở cuối, khớp với canonical trang chủ và với đích của redirect 301.
    url: SITE_URL_WITH_SLASH,
    siteName: ORGANIZATION_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE.url,
        width: OG_IMAGE.width,
        height: OG_IMAGE.height,
        alt: OG_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
  icons: {
    icon: [
      {
        url: "/favicon.png",
        type: "image/png",
        sizes: "500x500",
      },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
  generator: 'v0.app'
}

/**
 * Đồ thị thực thể toàn site (Organization + Logo + WebSite) — xem `lib/schema.ts`.
 *
 * Đặt ở layout để MỌI trang — kể cả bài blog — đều có node Organization với @id cố định.
 * Nhờ đó BlogPosting.publisher trỏ "@id": ".../#organization" sẽ phân giải được,
 * và Google có tín hiệu E-E-A-T cấp tổ chức (logo, địa chỉ, kênh chính thức) ở mọi URL.
 *
 * Ba chỗ sai sự thật đã sửa so với bản viết tay trước đây:
 *  - address khai "Hồ Chí Minh" trong khi footer ghi địa chỉ ở Hà Nội;
 *  - logo khai 512x512 trong khi public/logo.png là 824x543;
 *  - contactPoint chỉ có contactType, không có số điện thoại/email nào để liên hệ.
 * Cả ba nay lấy từ `lib/business-profile.ts` — cùng nguồn với footer.
 */
const siteSchema = buildSiteSchema()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className={`${beVietnamPro.variable} font-sans antialiased`}>
        {/* Một khối @graph duy nhất: Organization, Logo và WebSite tham chiếu nhau được */}
        <JsonLd id="site-schema" data={siteSchema} />
        {children}
        <ClientWidgets />
        {/* Toaster của sonner: trước đây không được mount nên mọi toast() đều bị "câm" */}
        <Toaster richColors closeButton position="top-right" />
        <Analytics />
      </body>
    </html>
  )
}
