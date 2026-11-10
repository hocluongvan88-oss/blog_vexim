import type { Metadata } from "next"
import { LocalizedHome } from "@/components/home/localized-home"
import { SITE_URL } from "@/lib/business-profile"
import { languageUrls } from "@/lib/locale-routes"
import { VI_HOME_META } from "@/lib/home-i18n"

const url = `${SITE_URL}/vi`
const image = `${SITE_URL}/og-image-vi.jpg`

export const metadata: Metadata = {
  title: { absolute: VI_HOME_META.title },
  description: VI_HOME_META.description,
  keywords: ["website B2B xuất khẩu", "hạ tầng số xuất khẩu", "SEO theo nhu cầu người mua", "nhà sản xuất Việt Nam", "Vexim Trade"],
  manifest: null,
  alternates: { canonical: url, languages: languageUrls("home") },
  openGraph: {
    type: "website", locale: "vi_VN", url, siteName: "Vexim Global",
    title: VI_HOME_META.title, description: VI_HOME_META.description,
    images: [{ url: image, width: 1200, height: 630, alt: VI_HOME_META.ogAlt }],
  },
  twitter: { card: "summary_large_image", title: VI_HOME_META.title, description: VI_HOME_META.description, images: [image] },
}

export default function VietnameseHome() {
  return <LocalizedHome locale="vi" />
}
