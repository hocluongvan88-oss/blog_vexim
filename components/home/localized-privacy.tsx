import { PUBLIC_EMAIL } from "@/lib/business-profile"
import { HOME_MESSAGES } from "@/lib/home-i18n"
import { homePath, type HomeLocale } from "@/lib/locale-routes"
import { AuditProvider } from "./audit-dialog"
import { HomeHeader } from "./home-header"
import { HomeFooter } from "./privacy-footer"
import styles from "./home.module.css"

/** Notice limited to the digital-audit form. Other services have separate flows. */
export function LocalizedPrivacy({ locale }: { locale: HomeLocale }) {
  const text = HOME_MESSAGES[locale].privacy
  return <div lang={locale} className={styles.home}>
    <AuditProvider locale={locale}>
      <HomeHeader locale={locale} page="privacy" />
      <main lang={locale} className={styles.privacyPage}>
        <div className={styles.container}>
          <p className={styles.sectionLabel}>{text.eyebrow}</p>
          <h1>{text.title}</h1>
          <p className={styles.privacyLead}>{text.lead}</p>
          <section><h2>{text.providedTitle}</h2><p>{text.providedText}</p></section>
          <section><h2>{text.processTitle}</h2><p>{text.processText}</p></section>
          <section><h2>{text.questionsTitle}</h2><p>{text.questionsBefore} <a href={`mailto:${PUBLIC_EMAIL}?subject=${encodeURIComponent(text.mailSubject)}`}>{PUBLIC_EMAIL}</a>. {text.questionsAfter}</p></section>
          <a className={styles.privacyBack} href={homePath(locale)}>{text.back}</a>
        </div>
      </main>
      <HomeFooter locale={locale} />
    </AuditProvider>
  </div>
}
