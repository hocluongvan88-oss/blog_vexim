import { ArrowUpRight } from "lucide-react"
import { AuditProvider } from "./audit-dialog"
import { LandingHeader } from "./landing-header"
import { LandingFooter, LandingHero, LandingInsight, LandingMethod, LandingPathway, LandingResources, LandingScopes, LandingSolutions } from "./landing-sections"
import { JsonLd } from "@/components/json-ld"
import { buildHomePageSchema, buildVietnameseHomePageSchema } from "@/lib/schema"
import { LANDING_COPY } from "@/lib/landing-copy"
import type { HomeLocale } from "@/lib/locale-routes"
import styles from "./landing.module.css"

/** The home experience is independent from the unchanged privacy/service UI. */
export function LocalizedHome({ locale }: { locale: HomeLocale }) {
  const copy = LANDING_COPY[locale]
  return <>
    <JsonLd id="home-page-schema" data={locale === "en" ? buildHomePageSchema() : buildVietnameseHomePageSchema()} />
    <div className={styles.landing} lang={locale} data-vexim-homepage>
      <AuditProvider locale={locale}>
        <div className={styles.masthead}><div className={`${styles.container} ${styles.mastheadInner}`}><span>{copy.masthead}</span><a href="#contact">{copy.mastheadLink}<ArrowUpRight size={12} aria-hidden="true" /></a></div></div>
        <LandingHeader locale={locale} />
        <main lang={locale}>
          <LandingHero locale={locale} />
          <LandingPathway locale={locale} />
          <LandingSolutions locale={locale} />
          <LandingInsight locale={locale} />
          <LandingMethod locale={locale} />
          <LandingScopes locale={locale} />
          <LandingResources locale={locale} />
        </main>
        <LandingFooter locale={locale} />
      </AuditProvider>
    </div>
  </>
}
