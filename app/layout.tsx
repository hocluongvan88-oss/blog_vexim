import type React from "react"
import type { Metadata } from "next"
import localFont from "next/font/local"
import { headers } from "next/headers"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ClientWidgets } from "@/components/client-widgets"
import { Toaster } from "@/components/ui/sonner"
import { JsonLd } from "@/components/json-ld"
import { buildSiteSchema } from "@/lib/schema"
import { SITE_ICONS } from "@/lib/site-icons"
import {
  OG_IMAGE,
  OG_IMAGE_ALT,
  ORGANIZATION_NAME,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
  SITE_URL_WITH_SLASH,
} from "@/lib/business-profile"

// Same Be Vietnam Pro typeface, now self-hosted (OFL) so builds do not depend on
// Google Fonts being reachable. No eager preload on the English/Inter homepage.
const beVietnamPro = localFont({
  src: [
    { path: "./fonts/BeVietnamPro-Light.woff2", weight: "300" },
    { path: "./fonts/BeVietnamPro-Regular.woff2", weight: "400" },
    { path: "./fonts/BeVietnamPro-Medium.woff2", weight: "500" },
    { path: "./fonts/BeVietnamPro-SemiBold.woff2", weight: "600" },
    { path: "./fonts/BeVietnamPro-Bold.woff2", weight: "700" },
  ],
  display: "swap",
  variable: "--font-be-vietnam-pro",
  preload: false,
})

/** Site defaults; each localized service/blog page supplies its own metadata.
 * Do not put a homepage canonical here: other routes must not inherit it. */
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
  icons: SITE_ICONS,
  manifest: "/manifest.json", // Retained for the admin PWA; public pages opt out.
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const englishPage = (await headers()).get("x-vexim-english-page") === "1"
  return (
    <html lang={englishPage ? "en" : "vi"}>
      <head>
        {englishPage && <link rel="preload" href="/fonts/inter-home-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />}
      </head>
      <body className={`${beVietnamPro.variable} font-sans antialiased`}>
        {/* Một khối @graph duy nhất: Organization, Logo và WebSite tham chiếu nhau được */}
        <JsonLd id="site-schema" data={siteSchema} />
        {children}
        <ClientWidgets />
        {/* Toaster của sonner: trước đây không được mount nên mọi toast() đều bị "câm" */}
        <Toaster richColors closeButton position="top-right" />
        {process.env.VERCEL === "1" && <Analytics />}
      </body>
    </html>
  )
}
