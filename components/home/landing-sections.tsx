import { ArrowDown, ArrowRight, ArrowUpRight, Check, Globe2, Search, ShieldCheck } from "lucide-react"
import { ADDRESS, ORGANIZATION_NAME, PHONE_DISPLAY, PUBLIC_EMAIL, SAME_AS } from "@/lib/business-profile"
import { VEXIM_PHONE_TEL_URL } from "@/lib/contact-info"
import { HOME_MESSAGES } from "@/lib/home-i18n"
import { LANDING_COPY } from "@/lib/landing-copy"
import { homePath, privacyPath, type HomeLocale } from "@/lib/locale-routes"
import { EXPORT_PILLARS, EXPORT_PILLARS_VI, EXPORT_TIERS, EXPORT_TIERS_VI, HOME_POSITIONING, HOME_POSITIONING_VI } from "@/lib/homepage-content"
import { AuditButton } from "./audit-dialog"
import styles from "./landing.module.css"

const tradeLink = { href: HOME_POSITIONING.tradeUrl, target: "_blank", rel: "noopener noreferrer" } as const
const serviceIcons = [Globe2, Search, ArrowUpRight] as const

export function LandingHero({ locale }: { locale: HomeLocale }) {
  const text = HOME_MESSAGES[locale].hero
  const copy = LANDING_COPY[locale]
  const positioning = locale === "vi" ? HOME_POSITIONING_VI : HOME_POSITIONING
  return <section className={styles.hero} aria-labelledby="hero-title">
    <div className={`${styles.container} ${styles.heroGrid}`}>
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}><span className={styles.eyebrowMark} />{copy.heroEyebrow}</p>
        <h1 id="hero-title">{text.titleBefore}<span>{text.titleAccent}</span>{text.titleAfter}</h1>
        <p className={styles.heroDescription}>{positioning.description}</p>
        <div className={styles.heroActions}>
          <AuditButton className={styles.primaryButton}>{text.audit}<ArrowUpRight size={18} aria-hidden="true" /></AuditButton>
          <a className={styles.textLink} {...tradeLink}>{text.trade}<ArrowUpRight size={17} aria-hidden="true" /></a>
        </div>
        <div className={styles.heroFootnote}><span aria-hidden="true" />{text.footnote}</div>
      </div>
      <div className={styles.heroVisual}>
        <span className={styles.visualTop}>{copy.heroVisualOrigin}<ArrowRight size={13} aria-hidden="true" />{copy.heroVisualDestination}</span>
        <img className={styles.heroArtwork} src="/home/export-atelier.svg" width="920" height="770" alt={locale === "vi" ? "Minh họa ý tưởng về nhà máy Việt Nam, địa cầu và các tuyến kết nối thương mại" : "Concept illustration of a Vietnamese manufacturer, a globe and connected export routes"} fetchPriority="high" decoding="async" />
        <div className={styles.visualCaption}><span className={styles.captionIcon}><ArrowUpRight size={19} aria-hidden="true" /></span><div><strong>{copy.heroVisualBottom}</strong><small>{text.from} · {text.to}</small></div></div>
        <p className={styles.visualDisclaimer}>{copy.heroNote}</p>
      </div>
    </div>
    <div className={`${styles.container} ${styles.heroEnd}`}><span>{copy.heroIndex}</span><a href="#solutions">{text.scroll}<ArrowDown size={16} aria-hidden="true" /></a></div>
  </section>
}

export function LandingPathway({ locale }: { locale: HomeLocale }) {
  const text = HOME_MESSAGES[locale].hero
  const copy = LANDING_COPY[locale]
  return <section className={styles.pathway} aria-label={text.pathwayLabel}><div className={`${styles.container} ${styles.pathwayInner}`}>
    <div className={styles.pathwayIntro}><span className={styles.pathwayEyebrow}>{copy.sectionNumber}</span><strong>{copy.pathwayHeading}</strong><p>{copy.pathwaySub}</p></div>
    <ol>{text.pathway.map((step, index) => <li key={step}><span>0{index + 1}</span><strong>{step}</strong>{index < text.pathway.length - 1 && <ArrowRight size={18} aria-hidden="true" />}</li>)}</ol>
  </div></section>
}

export function LandingSolutions({ locale }: { locale: HomeLocale }) {
  const text = HOME_MESSAGES[locale].solutions
  const copy = LANDING_COPY[locale]
  const pillars = locale === "vi" ? EXPORT_PILLARS_VI : EXPORT_PILLARS
  return <section id="solutions" className={styles.solutions} aria-labelledby="solutions-title"><div className={styles.container}>
    <div className={styles.sectionHeading}><div><p className={styles.sectionEyebrow}>{copy.systemEyebrow}</p><h2 id="solutions-title">{text.titleBefore} <span>{text.titleAfter}{text.titleAccent}</span></h2></div><div className={styles.sectionAside}><span>{copy.systemSmall}</span><p>{text.description}</p></div></div>
    <div className={styles.serviceGrid}>{pillars.map((pillar, index) => {
      const Icon = serviceIcons[index]
      return <article className={styles.service} key={pillar.id}>
        <div className={styles.serviceTop}><span>{pillar.number} / 03</span><Icon size={25} strokeWidth={1.5} aria-hidden="true" /></div>
        <span className={styles.serviceLabel}>{pillar.label}</span><h3>{pillar.title}</h3><p>{pillar.description}</p>
        <ul>{pillar.features.map(feature => <li key={feature}><Check size={15} aria-hidden="true" />{feature}</li>)}</ul>
        {index === 2 && <a className={styles.serviceLink} {...tradeLink}>{copy.systemLink}<ArrowUpRight size={18} aria-hidden="true" /></a>}
      </article>
    })}</div>
    <p className={styles.sectionNote}><ShieldCheck size={17} aria-hidden="true" />{text.disclaimer}</p>
  </div></section>
}

export function LandingInsight({ locale }: { locale: HomeLocale }) {
  const text = HOME_MESSAGES[locale].gap
  const copy = LANDING_COPY[locale]
  return <section id="the-gap" className={styles.insight} aria-labelledby="gap-title"><div className={styles.container}>
    <p className={styles.sectionEyebrow}>{copy.aboutEyebrow}</p>
    <div className={styles.insightHeading}><h2 id="gap-title">{copy.aboutBefore}<br /><em>{copy.aboutAfter}</em></h2><p>{text.description}</p></div>
    <div className={styles.insightColumns}>
      <article><span className={styles.insightLabel}><span>01</span>{copy.aboutAside}</span><h3>{text.traditionalTitle}</h3><p>{text.traditionalText}</p><ul>{text.traditionalPoints.map(point => <li key={point}>{point}</li>)}</ul></article>
      <article><span className={styles.insightLabel}><span>02</span>{copy.aboutStandard}</span><h3>{text.standardTitle}</h3><p>{text.standardText}</p><ul>{text.standardPoints.map(point => <li key={point}>{point}</li>)}</ul></article>
    </div>
    <p className={styles.insightNote}>{copy.aboutFoot} {text.disclaimer}</p>
  </div></section>
}

export function LandingMethod({ locale }: { locale: HomeLocale }) {
  const copy = LANDING_COPY[locale]
  return <section className={styles.method} aria-labelledby="method-title"><div className={styles.container}>
    <p className={styles.sectionEyebrow}>{copy.journeyEyebrow}</p><h2 id="method-title">{copy.journeyTitle}</h2>
    <ol>{copy.journeySteps.map((step, index) => <li key={step.title}><span className={styles.methodNumber}>0{index + 1}</span><span className={styles.methodLine} aria-hidden="true" /><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol>
  </div></section>
}

export function LandingScopes({ locale }: { locale: HomeLocale }) {
  const text = HOME_MESSAGES[locale].tiers
  const copy = LANDING_COPY[locale]
  const tiers = locale === "vi" ? EXPORT_TIERS_VI : EXPORT_TIERS
  return <section id="services" className={styles.scopes} aria-labelledby="services-title"><div className={styles.container}>
    <div className={styles.sectionHeading}><div><p className={styles.sectionEyebrow}>{copy.tiersEyebrow}</p><h2 id="services-title">{text.titleBefore}<br /><span>{text.titleAccent}</span></h2></div><div className={styles.sectionAside}><p>{copy.tiersAside}</p></div></div>
    <div className={styles.scopeList}>{tiers.map((tier, index) => <article key={tier.id} className={styles.scopeRow}>
      <div className={styles.scopeIdentity}><span className={styles.scopeNumber}>0{index + 1} / 03</span><span className={styles.scopeLabel}>{tier.label}</span><h3>{tier.name}</h3><p>{tier.audience}</p></div>
      <div className={styles.scopeDetails}><p>{tier.description}</p><span>{copy.tierDetails}</span><ul>{tier.features.map(feature => <li key={feature}><Check size={15} aria-hidden="true" />{feature}</li>)}</ul></div>
      <AuditButton className={styles.scopeButton} scope={tier.name}>{copy.tierCta}<ArrowUpRight size={18} aria-hidden="true" /></AuditButton>
    </article>)}</div>
    <p className={styles.sectionNote}><ShieldCheck size={17} aria-hidden="true" />{text.note}</p>
  </div></section>
}

export function LandingResources({ locale }: { locale: HomeLocale }) {
  const text = HOME_MESSAGES[locale].compliance
  const copy = LANDING_COPY[locale]
  const links = [
    { href: "/services/fda", label: "FDA" },
    { href: "/services/gacc", label: "GACC" },
    { href: "/services/cosmetics/mocra-registration", label: "MoCRA" },
    { href: "/services/us-agent", label: "US Agent" },
  ]
  return <section className={styles.resources} aria-label={text.label}><div className={`${styles.container} ${styles.resourceInner}`}>
    <div><p className={styles.sectionEyebrow}>{copy.resourceEyebrow}</p><h2>{text.title}</h2><p>{copy.resourceLead}</p><small>{text.languageNote}</small></div>
    <div className={styles.resourceLinks}>{links.map(link => <a href={link.href} key={link.href}>{link.label}<ArrowUpRight size={17} aria-hidden="true" /></a>)}</div>
  </div></section>
}

export function LandingFooter({ locale }: { locale: HomeLocale }) {
  const text = HOME_MESSAGES[locale].footer
  const copy = LANDING_COPY[locale]
  const base = homePath(locale)
  return <footer id="contact" className={styles.footer}><div className={styles.container}>
    <div className={styles.footerLead}><div><p className={styles.sectionEyebrow}>{copy.footerEyebrow}</p><h2>{copy.footerTitle}</h2><p>{copy.footerBody}</p></div><AuditButton className={styles.footerCta}>{copy.footerAction}<ArrowUpRight size={19} aria-hidden="true" /></AuditButton></div>
    <div className={styles.footerColumns}>
      <div className={styles.footerBrand}><a href={base} aria-label="Vexim Global"><img src="/trade/logo.svg" width={51} height={51} alt="" /><strong>VEXIM<span>GLOBAL</span></strong></a><p>{text.brand}</p></div>
      <div><h3>{text.explore}</h3><a href={`${base}#solutions`}>{text.solutions}</a><a href={`${base}#the-gap`}>{text.gap}</a><a href={`${base}#services`}>{text.tiers}</a><a {...tradeLink}>Vexim Trade ↗</a></div>
      <div><h3>{text.resources}</h3><a href="/blog">{text.blog}</a><a href={privacyPath(locale)}>{text.privacy}</a><a href="/client-portal">{text.portal}</a><a href="/services/fda">{text.fda}</a><a href="/services/gacc">{text.gacc}</a><a href="/services/cosmetics/mocra-registration">{text.mocra}</a><a href="/services/us-agent">{text.usAgent}</a></div>
      <div><h3>{text.contact}</h3><a href={`mailto:${PUBLIC_EMAIL}`}>{PUBLIC_EMAIL}</a><a href={VEXIM_PHONE_TEL_URL}>{PHONE_DISPLAY}</a><address>{ADDRESS.streetAddress}<br />{ADDRESS.addressLocality}, {text.country}</address></div>
    </div>
    <div className={styles.footerBottom}><span>© {new Date().getFullYear()} {ORGANIZATION_NAME}. {text.rights}</span><div>{SAME_AS.slice(0, 2).map((url, index) => <a href={url} key={url} target="_blank" rel="noopener noreferrer">{index === 0 ? "Facebook" : "LinkedIn"} ↗</a>)}</div><a href="#hero-title">{copy.footerBack} ↑</a></div>
  </div></footer>
}
