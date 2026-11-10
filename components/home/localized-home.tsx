import { AuditProvider } from "./audit-dialog"
import { HomeHeader } from "./home-header"
import { ComplianceUtilities, CoreSolutions, ExportTiers, HomeFooter, HomeHero, VerificationGap } from "./home-sections"
import { JsonLd } from "@/components/json-ld"
import { buildHomePageSchema, buildVietnameseHomePageSchema } from "@/lib/schema"
import type { HomeLocale } from "@/lib/locale-routes"
import styles from "./home.module.css"

/** SSR copy per URL, not a client-side overlay or machine translation. */
export function LocalizedHome({ locale }: { locale: HomeLocale }) {
  return <>
    <JsonLd id="home-page-schema" data={locale === "en" ? buildHomePageSchema() : buildVietnameseHomePageSchema()} />
    <div className={styles.home} lang={locale} data-vexim-homepage>
      <AuditProvider locale={locale}>
        <HomeHeader locale={locale} page="home" />
        <main lang={locale}>
          <HomeHero locale={locale} />
          <CoreSolutions locale={locale} />
          <VerificationGap locale={locale} />
          <ExportTiers locale={locale} />
          <ComplianceUtilities locale={locale} />
        </main>
        <HomeFooter locale={locale} />
      </AuditProvider>
    </div>
  </>
}
