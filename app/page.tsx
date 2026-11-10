import type { Metadata } from "next"
import { AuditProvider } from "@/components/home/audit-dialog"
import { HomeHeader } from "@/components/home/home-header"
import { ComplianceUtilities, CoreSolutions, ExportTiers, HomeFooter, HomeHero, VerificationGap } from "@/components/home/home-sections"
import { JsonLd } from "@/components/json-ld"
import { buildHomePageSchema } from "@/lib/schema"
import { OG_IMAGE, OG_IMAGE_ALT, SITE_DESCRIPTION, SITE_TITLE, SITE_URL_WITH_SLASH } from "@/lib/business-profile"
import styles from "@/components/home/home.module.css"

/** English homepage, independently positioned from the Vietnamese service/blog pages. */
export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: ["B2B export website", "digital export infrastructure", "buyer intent SEO", "Vietnam manufacturer", "Vexim Trade"],
  manifest: null, // The root manifest is for the separate admin dashboard.
  alternates: { canonical: SITE_URL_WITH_SLASH },
  openGraph: {
    type: "website", locale: "en_US", url: SITE_URL_WITH_SLASH, siteName: "Vexim Global",
    title: SITE_TITLE, description: SITE_DESCRIPTION,
    images: [{ url: OG_IMAGE.url, width: OG_IMAGE.width, height: OG_IMAGE.height, alt: OG_IMAGE_ALT }],
  },
  twitter: { card: "summary_large_image", title: SITE_TITLE, description: SITE_DESCRIPTION, images: [OG_IMAGE.url] },
}

export default function Home() {
  return <>
    {/* Organization/Logo/WebSite are emitted once in the root layout. */}
    <JsonLd id="home-page-schema" data={buildHomePageSchema()} />
    <div className={styles.home} lang="en" data-vexim-homepage>
      <AuditProvider>
        <HomeHeader />
        <main lang="en">
          <HomeHero />
          <CoreSolutions />
          <VerificationGap />
          <ExportTiers />
          <ComplianceUtilities />
        </main>
        <HomeFooter />
      </AuditProvider>
    </div>
  </>
}
