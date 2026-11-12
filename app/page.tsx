import type { Metadata } from "next"
import { LocalizedHome } from "@/components/home/localized-home"
import { SITE_URL } from "@/lib/business-profile"
import { languageUrls } from "@/lib/locale-routes"
import { VI_HOME_META } from "@/lib/home-i18n"
import VietnameseLayout from "@/components/home/vietnamese-font"

/**
 * Trang chủ — tiếng Việt, ở URL gốc. Đây là ngôn ngữ mặc định của site, nên
 * `/` cũng là `x-default` trong hreflang. Bản tiếng Anh nằm ở `/en`.
 */
const image = `${SITE_URL}/og-image-vi.jpg`

export const metadata: Metadata = {
  title: { absolute: VI_HOME_META.title },
  description: VI_HOME_META.description,
  keywords: ["website B2B xuất khẩu", "hạ tầng số xuất khẩu", "SEO theo nhu cầu người mua", "nhà sản xuất Việt Nam", "Vexim Trade"],
  manifest: null, // The root manifest is for the separate admin dashboard.
  alternates: { canonical: SITE_URL, languages: languageUrls("home") },
  openGraph: {
    type: "website", locale: "vi_VN", url: SITE_URL, siteName: "Vexim Global",
    title: VI_HOME_META.title, description: VI_HOME_META.description,
    images: [{ url: image, width: 1200, height: 630, alt: VI_HOME_META.ogAlt }],
  },
  twitter: { card: "summary_large_image", title: VI_HOME_META.title, description: VI_HOME_META.description, images: [image] },
}

export default function Home() {
  return (
    <VietnameseLayout>
      <LocalizedHome locale="vi" />
    </VietnameseLayout>
  )
}
