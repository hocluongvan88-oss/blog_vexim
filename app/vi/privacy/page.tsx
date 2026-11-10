import type { Metadata } from "next"
import { LocalizedPrivacy } from "@/components/home/localized-privacy"
import { SITE_URL } from "@/lib/business-profile"
import { languageUrls } from "@/lib/locale-routes"
import { VI_PRIVACY_META } from "@/lib/home-i18n"

const url = `${SITE_URL}/vi/privacy`

export const metadata: Metadata = {
  title: { absolute: VI_PRIVACY_META.title },
  description: VI_PRIVACY_META.description,
  manifest: null,
  alternates: { canonical: url, languages: languageUrls("privacy") },
  openGraph: { locale: "vi_VN", url, title: VI_PRIVACY_META.title, description: VI_PRIVACY_META.description },
}

export default function VietnamesePrivacy() {
  return <LocalizedPrivacy locale="vi" />
}
