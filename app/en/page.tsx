import type { Metadata } from "next"
import { LocalizedHome } from "@/components/home/localized-home"
import { OG_IMAGE, OG_IMAGE_ALT, SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "@/lib/business-profile"
import { languageUrls } from "@/lib/locale-routes"

/**
 * English homepage at `/en`. Vietnamese is the site default and lives at `/`;
 * this page is the reviewed English counterpart, not a machine translation.
 */
const url = `${SITE_URL}/en`

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: ["B2B marketplace Vietnam", "export product website", "export sales channel", "Vietnam manufacturer", "Vexim Trade"],
  manifest: null, // The root manifest is for the separate admin dashboard.
  alternates: { canonical: url, languages: languageUrls("home") },
  openGraph: {
    type: "website", locale: "en_US", url, siteName: "Vexim Global",
    title: SITE_TITLE, description: SITE_DESCRIPTION,
    images: [{ url: OG_IMAGE.url, width: OG_IMAGE.width, height: OG_IMAGE.height, alt: OG_IMAGE_ALT }],
  },
  twitter: { card: "summary_large_image", title: SITE_TITLE, description: SITE_DESCRIPTION, images: [OG_IMAGE.url] },
}

export default function Home() {
  return <LocalizedHome locale="en" />
}
