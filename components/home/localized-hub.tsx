import { AuditProvider } from "./audit-dialog"
import { HomeHeader } from "./home-header"
import { HomeFooter } from "./home-sections"
import { HubSections } from "./hub-sections"
import { JsonLd } from "@/components/json-ld"
import { buildHomePageSchema, buildVietnameseHomePageSchema } from "@/lib/schema"
import type { HomeLocale } from "@/lib/locale-routes"
import styles from "./home.module.css"

/**
 * Trang tổng quan. Dùng header/footer/audit sẵn có, chỉ thay phần <main>.
 * Việc này giữ nguyên điều hướng, chuyển ngôn ngữ, hreflang và schema.
 */
export function LocalizedHub({ locale }: { locale: HomeLocale }) {
  return <>
    <JsonLd id="home-page-schema" data={locale === "en" ? buildHomePageSchema() : buildVietnameseHomePageSchema()} />
    <div className={styles.home} lang={locale} data-vexim-homepage data-vexim-hub>
      <AuditProvider locale={locale}>
        <HomeHeader locale={locale} page="home" />
        <HubSections locale={locale} />
        <HomeFooter locale={locale} />
      </AuditProvider>
    </div>
  </>
}
