import type { Metadata } from "next"
import { LocalizedPrivacy } from "@/components/home/localized-privacy"
import { SITE_URL } from "@/lib/business-profile"
import { languageUrls } from "@/lib/locale-routes"

const url = `${SITE_URL}/en/privacy`

export const metadata: Metadata = {
  title: { absolute: "Privacy & Data Requests | Vexim Global" },
  description: "How Vexim Global handles information submitted through the contact request form, and how to contact us about your data.",
  manifest: null,
  alternates: { canonical: url, languages: languageUrls("privacy") },
  openGraph: { locale: "en_US", url, title: "Privacy & Data Requests | Vexim Global", description: "How Vexim Global handles information sent through the contact request form, and how to reach us about your data." },
}

/** Factual notice for this form, not a fabricated site-wide legal policy. */
export default function PrivacyPage() {
  return <LocalizedPrivacy locale="en" />
}
