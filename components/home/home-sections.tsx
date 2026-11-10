import { ArrowDown, ArrowRight, ArrowUpRight, Check, CircleHelp, Globe2, Search, ShieldCheck } from "lucide-react"
import { ADDRESS, ORGANIZATION_NAME, PHONE_DISPLAY, PUBLIC_EMAIL, SAME_AS } from "@/lib/business-profile"
import { VEXIM_PHONE_TEL_URL } from "@/lib/contact-info"
import { HOME_MESSAGES } from "@/lib/home-i18n"
import { homePath, privacyPath, type HomeLocale } from "@/lib/locale-routes"
import { EXPORT_PILLARS, EXPORT_PILLARS_VI, EXPORT_TIERS, EXPORT_TIERS_VI, HOME_POSITIONING, HOME_POSITIONING_VI } from "@/lib/homepage-content"
import { AuditButton } from "./audit-dialog"
import styles from "./home.module.css"

const tradeLink = { href: HOME_POSITIONING.tradeUrl, target: "_blank", rel: "noopener noreferrer" } as const
const artwork = [
  { src: "/home/cloud-architecture.svg", width: 700, height: 410 },
  { src: "/home/buyer-intent.svg", width: 700, height: 410 },
  { src: "/home/trade-connect.svg", width: 800, height: 450 },
] as const

function Eyebrow({ step, children }: { step: string; children: React.ReactNode }) {
  return <p className={styles.sectionEyebrow}><span>{step}</span><span className={styles.eyebrowLine} />{children}</p>
}

export function HomeHero({ locale }: { locale: HomeLocale }) {
  const text = HOME_MESSAGES[locale].hero
  const positioning = locale === "vi" ? HOME_POSITIONING_VI : HOME_POSITIONING
  return <section className={styles.hero} aria-labelledby="hero-title">
    <div className={styles.heroGlow} aria-hidden="true" />
    <div className={`${styles.container} ${styles.heroInner}`}>
      <div className={styles.heroLead}>
        <div className={styles.heroCopy}>
          <p className={styles.heroBadge}>{text.badge}</p>
          <h1 id="hero-title">{text.titleBefore}<span>{text.titleAccent}</span>{text.titleAfter}</h1>
          <p className={styles.heroDescription}>{positioning.description}</p>
          <div className={styles.heroActions}>
            <AuditButton className={styles.heroPrimary}>{text.audit} <ArrowUpRight size={18} aria-hidden="true" /></AuditButton>
            <a className={styles.heroSecondary} {...tradeLink}>{text.trade} <ArrowUpRight size={17} aria-hidden="true" /></a>
          </div>
          <p className={styles.heroFootnote}><span className={styles.statusDot} /> {text.footnote}</p>
        </div>
        <figure className={styles.heroStage}>
          <span className={styles.stageTagStart} aria-hidden="true"><span className={styles.stageTagIcon}><Globe2 size={16} /></span><span>{text.from}<small>{text.fromDetail}</small></span></span>
          <img className={styles.heroScene} src="/home/export-network.svg" width="1160" height="540" alt={text.imageAlt} fetchPriority="high" decoding="sync" />
          <span className={styles.stageTagEnd} aria-hidden="true"><span className={styles.stageTagIcon}><ArrowUpRight size={16} /></span><span>{text.to}<small>{text.toDetail}</small></span></span>
          <figcaption>{text.illustrationNote}</figcaption>
        </figure>
      </div>
      <div className={styles.heroPathway} aria-label={text.pathwayLabel}><span>{text.pathway[0]}</span><ArrowRight size={16} aria-hidden="true" /><span>{text.pathway[1]}</span><ArrowRight size={16} aria-hidden="true" /><span>{text.pathway[2]}</span></div>
      <a className={styles.heroScroll} href="#solutions">{text.scroll} <ArrowDown size={16} aria-hidden="true" /></a>
    </div>
  </section>
}

export function CoreSolutions({ locale }: { locale: HomeLocale }) {
  const text = HOME_MESSAGES[locale].solutions
  const pillars = locale === "vi" ? EXPORT_PILLARS_VI : EXPORT_PILLARS
  return <section id="solutions" className={styles.solutionsSection} aria-labelledby="solutions-title"><div className={styles.container}>
    <Eyebrow step={text.eyebrow}>{text.label}</Eyebrow>
    <div className={styles.sectionIntro}>
      <h2 id="solutions-title">{text.titleBefore}<br />{text.titleAfter}<span>{text.titleAccent}</span></h2>
      <p>{text.description}</p>
    </div>
    <div className={styles.bentoGrid}>{pillars.map((pillar, index) => <article key={pillar.id} className={`${styles.bentoCard} ${index === 0 ? styles.bentoInfrastructure : index === 1 ? styles.bentoSearch : styles.bentoTrade}`}>
      <div className={styles.bentoCopy}>
        <div className={styles.cardTop}><span>{pillar.number} / 03</span><span>{pillar.label}</span></div>
        <h3>{pillar.title}</h3>
        <p className={styles.bentoDescription}>{pillar.description}</p>
        <ul className={styles.bentoFeatures}>{pillar.features.map(feature => <li key={feature}><Check size={15} aria-hidden="true" />{feature}</li>)}</ul>
        {index === 1 && <div className={styles.queryChips} aria-label={text.searches}><span>bulk supplier</span><span>OEM factory Vietnam</span><span>FOB Ho Chi Minh City</span></div>}
        {index === 2 && <a className={styles.bentoLink} {...tradeLink}>{text.trade} <ArrowUpRight size={17} aria-hidden="true" /></a>}
      </div>
      <img className={styles.bentoArtwork} src={artwork[index].src} width={artwork[index].width} height={artwork[index].height} alt={text.artworkAlt[index]} loading="lazy" />
    </article>)}</div>
    <p className={styles.bentoNote}><CircleHelp size={15} aria-hidden="true" /> {text.disclaimer}</p>
  </div></section>
}

export function VerificationGap({ locale }: { locale: HomeLocale }) {
  const text = HOME_MESSAGES[locale].gap
  return <section id="the-gap" className={styles.gapSection} aria-labelledby="gap-title"><div className={styles.container}>
    <Eyebrow step={text.eyebrow}>{text.label}</Eyebrow>
    <div className={styles.sectionIntro}>
      <h2 id="gap-title">{text.titleBefore}<br /><span>{text.titleAccent}</span></h2>
      <p>{text.description}</p>
    </div>
    <div className={styles.gapGrid}>
      <article className={`${styles.gapCard} ${styles.gapTraditional}`}>
        <div className={styles.gapCardHeader}><span className={styles.gapIcon}><Search size={20} aria-hidden="true" /></span><span>{text.traditionalLabel}</span></div>
        <h3>{text.traditionalTitle}</h3>
        <p>{text.traditionalText}</p>
        <ul>{text.traditionalPoints.map((point, index) => <li key={point}><span>0{index + 1}</span> {point}</li>)}</ul>
        <div className={styles.gapCardTail}>{text.traditionalTail} <ArrowUpRight size={17} aria-hidden="true" /></div>
      </article>
      <article className={`${styles.gapCard} ${styles.gapVexim}`}>
        <div className={styles.gapCardHeader}><span className={styles.gapIcon}><ShieldCheck size={20} aria-hidden="true" /></span><span>{text.standardLabel}</span></div>
        <h3>{text.standardTitle}</h3>
        <p>{text.standardText}</p>
        <ul>{text.standardPoints.map(point => <li key={point}><Check size={16} aria-hidden="true" /> {point}</li>)}</ul>
        <div className={styles.gapCardTail}>{text.standardTail} <ArrowUpRight size={17} aria-hidden="true" /></div>
      </article>
    </div>
    <p className={styles.gapDisclaimer}>{text.disclaimer}</p>
  </div></section>
}

export function ExportTiers({ locale }: { locale: HomeLocale }) {
  const text = HOME_MESSAGES[locale].tiers
  const tiers = locale === "vi" ? EXPORT_TIERS_VI : EXPORT_TIERS
  return <section id="services" className={styles.tierSection} aria-labelledby="tier-title"><div className={styles.container}>
    <Eyebrow step={text.eyebrow}>{text.label}</Eyebrow>
    <div className={styles.sectionIntro}>
      <h2 id="tier-title">{text.titleBefore}<br /><span>{text.titleAccent}</span></h2>
      <p>{text.description}</p>
    </div>
    <div className={styles.tierGrid}>{tiers.map((tier, index) => <article key={tier.id} className={`${styles.tierCard} ${index === 1 ? styles.featuredTier : ""}`}>
      <div className={styles.tierTop}><span>0{index + 1} / 03</span>{index === 1 && <span className={styles.tierFeaturedTag}>{text.featured}</span>}</div>
      <div className={styles.tierIcon} aria-hidden="true"><span>{index === 0 ? "↗" : index === 1 ? "✧" : "◎"}</span></div>
      <p className={styles.tierLabel}>{tier.label}</p>
      <h3>{tier.name}</h3><p className={styles.tierAudience}>{tier.audience}</p>
      <p className={styles.tierDescription}>{tier.description}</p>
      <div className={styles.tierIncludes}>{text.includes}</div>
      <ul>{tier.features.map(feature => <li key={feature}><Check size={16} aria-hidden="true" />{feature}</li>)}</ul>
      <AuditButton className={index === 1 ? styles.tierButtonFeatured : styles.tierButton} scope={tier.name}>{text.discuss} <ArrowUpRight size={17} aria-hidden="true" /></AuditButton>
    </article>)}</div>
    <p className={styles.tierNote}>{text.note}</p>
  </div></section>
}

export function ComplianceUtilities({ locale }: { locale: HomeLocale }) {
  const text = HOME_MESSAGES[locale].compliance
  return <section className={styles.complianceSection} aria-label={text.label}><div className={`${styles.container} ${styles.complianceInner}`}>
    <div className={styles.complianceLead}><ShieldCheck size={23} strokeWidth={1.6} aria-hidden="true" /><div><strong>{text.title}</strong><p>{text.description}</p><small>{text.languageNote}</small></div></div>
    <div className={styles.complianceLinks}><a href="/services/fda">FDA <ArrowUpRight size={13} aria-hidden="true" /></a><a href="/services/gacc">GACC <ArrowUpRight size={13} aria-hidden="true" /></a><a href="/services/cosmetics/mocra-registration">MoCRA <ArrowUpRight size={13} aria-hidden="true" /></a><a href="/services/us-agent">US Agent <ArrowUpRight size={13} aria-hidden="true" /></a></div>
  </div></section>
}

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
