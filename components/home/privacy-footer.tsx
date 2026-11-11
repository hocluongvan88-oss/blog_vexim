import { ArrowUpRight } from "lucide-react"
import { ADDRESS, ORGANIZATION_NAME, PHONE_DISPLAY, PUBLIC_EMAIL, SAME_AS } from "@/lib/business-profile"
import { VEXIM_PHONE_TEL_URL } from "@/lib/contact-info"
import { HOME_MESSAGES } from "@/lib/home-i18n"
import { homePath, privacyPath, type HomeLocale } from "@/lib/locale-routes"
import { HOME_POSITIONING } from "@/lib/homepage-content"
import { AuditButton } from "./audit-dialog"
import styles from "./home.module.css"

const tradeLink = { href: HOME_POSITIONING.tradeUrl, target: "_blank", rel: "noopener noreferrer" } as const

/** Keep the approved privacy notice's existing footer untouched by the new homepage. */
export function HomeFooter({ locale }: { locale: HomeLocale }) {
  const text = HOME_MESSAGES[locale].footer
  const base = homePath(locale)
  return <footer id="contact" className={styles.homeFooter}><div className={styles.container}>
    <div className={styles.footerCallout}><div><span className={styles.footerEyebrow}>{text.eyebrow}</span><h2>{text.titleBefore}<br /><em>{text.titleAccent}</em></h2><p>{text.description}</p></div><AuditButton className={styles.footerCta}>{HOME_MESSAGES[locale].hero.audit} <ArrowUpRight size={18} aria-hidden="true" /></AuditButton></div>
    <div className={styles.footerColumns}>
      <div className={styles.footerBrand}><img src="/trade/logo.svg" width={43} height={43} alt="" /><strong>VEXIM GLOBAL</strong><p>{text.brand}</p></div>
      <div><p className={styles.footerColumnTitle}>{text.explore}</p><a href={`${base}#solutions`}>{text.solutions}</a><a href={`${base}#the-gap`}>{text.gap}</a><a href={`${base}#services`}>{text.tiers}</a><a {...tradeLink}>Vexim Trade ↗</a></div>
      <div><p className={styles.footerColumnTitle}>{text.resources}</p><a href="/blog">{text.blog}</a><a href={privacyPath(locale)}>{text.privacy}</a><a href="/client-portal">{text.portal}</a><a href="/services/fda">{text.fda}</a><a href="/services/gacc">{text.gacc}</a><a href="/services/cosmetics/mocra-registration">{text.mocra}</a><a href="/services/us-agent">{text.usAgent}</a></div>
      <div><p className={styles.footerColumnTitle}>{text.contact}</p><a href={`mailto:${PUBLIC_EMAIL}`}>{PUBLIC_EMAIL}</a><a href={VEXIM_PHONE_TEL_URL}>{PHONE_DISPLAY}</a><address>{ADDRESS.streetAddress}<br />{ADDRESS.addressLocality}, {text.country}</address></div>
    </div>
    <div className={styles.footerBottom}><span>© {new Date().getFullYear()} {ORGANIZATION_NAME}. {text.rights}</span><span>{text.tagline}</span><div>{SAME_AS.slice(0, 2).map((url, index) => <a href={url} key={url} target="_blank" rel="noopener noreferrer">{index === 0 ? "Facebook" : "LinkedIn"} ↗</a>)}</div></div>
  </div></footer>
}
