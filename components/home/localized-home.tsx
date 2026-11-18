import { JsonLd } from "@/components/json-ld"
import { buildHomePageSchema, buildVietnameseHomePageSchema } from "@/lib/schema"
import type { HomeLocale } from "@/lib/locale-routes"
import { ConsultationProvider } from "./consultation-form"
import { HomeHeader } from "./home-header"
import {
  CoreSolutions,
  Delivery,
  ExportWebsite,
  FAQAndContact,
  HomeFooter,
  HomeHero,
  InternationalSEO,
  Marketplace,
  Partners,
  ProjectsAndNews,
} from "./home-sections"
import styles from "./home.module.css"

/** Both published URLs render the same responsive layout in their own language. */
export function LocalizedHome({ locale }: { locale: HomeLocale }) {
  return (
    <>
      <JsonLd
        id="home-page-schema"
        data={locale === "en" ? buildHomePageSchema() : buildVietnameseHomePageSchema()}
      />
      <div className={styles.home} lang={locale} data-vexim-homepage>
        <HomeHeader locale={locale} page="home" />
        <ConsultationProvider>
          <main id="main-content" lang={locale}>
            <HomeHero locale={locale} />
            <Partners locale={locale} />
            <CoreSolutions locale={locale} />
            <Marketplace locale={locale} />
            <InternationalSEO locale={locale} />
            <ExportWebsite locale={locale} />
            <Delivery locale={locale} />
            <ProjectsAndNews locale={locale} />
            <FAQAndContact locale={locale} />
          </main>
        </ConsultationProvider>
        <HomeFooter locale={locale} />
      </div>
    </>
  )
}
