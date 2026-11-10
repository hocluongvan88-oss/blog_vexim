import type { Metadata } from "next"
import { LocalizedPrivacy } from "@/components/home/localized-privacy"
import { SITE_URL } from "@/lib/business-profile"
import { languageUrls } from "@/lib/locale-routes"

export const metadata: Metadata = {
  title: { absolute: "Privacy & Data Requests | Vexim Global" },
  description: "How Vexim Global handles information submitted through the digital export audit request form, and how to contact us about your data.",
  manifest: null,
  alternates: { canonical: `${SITE_URL}/privacy`, languages: languageUrls("privacy") },
  openGraph: { locale: "en_US", url: `${SITE_URL}/privacy`, title: "Privacy & Data Requests | Vexim Global", description: "Information about digital audit requests and data contact at Vexim Global." },
}

/** Factual notice for this form, not a fabricated site-wide legal policy. */
export default function PrivacyPage() {
  return <LocalizedPrivacy locale="en" />
}
