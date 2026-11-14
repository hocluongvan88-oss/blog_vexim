import { ArrowDown, ArrowRight, ArrowUpRight, Check, CircleHelp, Globe2, Search, ShieldCheck, Truck } from "lucide-react"
import { ADDRESS, ORGANIZATION_NAME, PHONE_DISPLAY, PUBLIC_EMAIL, SAME_AS } from "@/lib/business-profile"
import { VEXIM_PHONE_TEL_URL } from "@/lib/contact-info"
import { HOME_MESSAGES } from "@/lib/home-i18n"
import { homePath, privacyPath, type HomeLocale } from "@/lib/locale-routes"
import { EXPORT_PILLARS, EXPORT_PILLARS_VI, EXPORT_TIERS, EXPORT_TIERS_VI, HOME_POSITIONING, HOME_POSITIONING_VI } from "@/lib/homepage-content"
import { AuditButton } from "./audit-dialog"
import styles from "./home.module.css"

const tradeLink = { href: HOME_POSITIONING.tradeUrl, target: "_blank", rel: "noopener noreferrer" } as const

/** Photographic layer: real-world production and logistics beside the worked technical SVGs. */
const PHOTO = {
  origin: { src: "/home/origin-ingredients.webp", srcSet: "/home/origin-ingredients-800.webp 800w, /home/origin-ingredients.webp 1200w", width: 1200, height: 654 },
  factory: { src: "/home/factory-floor.webp", srcSet: "/home/factory-floor-800.webp 800w, /home/factory-floor.webp 1200w", width: 1200, height: 654 },
  buyer: { src: "/home/buyer-meeting.webp", srcSet: "/home/buyer-meeting-800.webp 800w, /home/buyer-meeting.webp 1200w", width: 1200, height: 654 },
  port: { src: "/home/port-logistics.webp", srcSet: "/home/port-logistics-800.webp 800w, /home/port-logistics.webp 1200w", width: 1200, height: 654 },
  catalog: { src: "/home/catalog-device.webp", srcSet: "/home/catalog-device-800.webp 800w, /home/catalog-device.webp 1200w", width: 1200, height: 654 },
  lab: { src: "/home/quality-lab.webp", srcSet: "/home/quality-lab-800.webp 800w, /home/quality-lab.webp 1200w", width: 1200, height: 654 },
  warehouse: { src: "/home/warehouse-loading.webp", srcSet: "/home/warehouse-loading-800.webp 800w, /home/warehouse-loading.webp 1200w", width: 1200, height: 654 },
  exterior: { src: "/home/vietnam-factory-exterior.webp", srcSet: "/home/vietnam-factory-exterior-800.webp 800w, /home/vietnam-factory-exterior.webp 1200w", width: 1200, height: 654 },
  workspace: { src: "/home/global-buyer.webp", srcSet: "/home/global-buyer-800.webp 800w, /home/global-buyer.webp 1200w", width: 1200, height: 654 },
  harbor: { src: "/home/hanoi-harbor.webp", srcSet: "/home/hanoi-harbor-800.webp 800w, /home/hanoi-harbor.webp 1200w", width: 1200, height: 654 },
  documents: { src: "/home/export-documentation.webp", srcSet: "/home/export-documentation-800.webp 800w, /home/export-documentation.webp 1200w", width: 1200, height: 823 },
  trucking: { src: "/home/trucking.webp", srcSet: "/home/trucking-800.webp 800w, /home/trucking.webp 1200w", width: 1200, height: 509 },
  operations: { src: "/home/content-operations.webp", srcSet: "/home/content-operations-800.webp 800w, /home/content-operations.webp 1200w", width: 1200, height: 655 },
} as const

/** Bốn trụ cột xếp thành lưới bento: hai thẻ đôi ở hàng đầu, hai thẻ rộng phía dưới.
 * Thẻ cuối dùng bố cục ngang (ảnh bên phải) như trước. */
const BENTO_TONE = [styles.bentoLead, styles.bentoPair, styles.bentoWide, styles.bentoWideAlt] as const

const heroPhotos = [PHOTO.origin, PHOTO.factory, PHOTO.buyer, PHOTO.port] as const
const solutionPhotos = [PHOTO.catalog, PHOTO.workspace, PHOTO.warehouse, PHOTO.operations] as const
const footerPhoto = PHOTO.documents
const gapFigurePhoto = PHOTO.trucking

function Eyebrow({ step, children }: { step: string; children: React.ReactNode }) {
  return <p className={styles.sectionEyebrow}><span>{step}</span><span className={styles.eyebrowLine} />{children}</p>
}

/** 2×2 photo mosaic: a real Vietnamese export scene beside the illustrated route map. */
export function HomeHero({ locale }: { locale: HomeLocale }) {
  const text = HOME_MESSAGES[locale].hero
  const positioning = locale === "vi" ? HOME_POSITIONING_VI : HOME_POSITIONING
  return <section className={styles.hero} aria-labelledby="hero-title">
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
          <div className={styles.heroMosaic}>
            <div className={`${styles.heroShot} ${styles.heroShot1}`}>
              <img src={heroPhotos[0].src} srcSet={heroPhotos[0].srcSet} sizes="(max-width: 960px) 46vw, 250px" width={heroPhotos[0].width} height={heroPhotos[0].height} alt={text.proof[0].alt} loading="eager" fetchPriority="high" decoding="sync" />
              <span className={styles.heroShotLabel}><strong>{text.proof[0].title}</strong><span>{text.proof[0].detail}</span></span>
            </div>
            <div className={`${styles.heroShot} ${styles.heroShot2}`}>
              <img src={heroPhotos[1].src} srcSet={heroPhotos[1].srcSet} sizes="(max-width: 960px) 44vw, 210px" width={heroPhotos[1].width} height={heroPhotos[1].height} alt={text.proof[1].alt} loading="lazy" decoding="async" />
              <span className={styles.heroShotLabel}><strong>{text.proof[1].title}</strong><span>{text.proof[1].detail}</span></span>
            </div>
            <div className={`${styles.heroShot} ${styles.heroShot3}`}>
              <img src={heroPhotos[2].src} srcSet={heroPhotos[2].srcSet} sizes="(max-width: 960px) 44vw, 210px" width={heroPhotos[2].width} height={heroPhotos[2].height} alt={text.proof[2].alt} loading="lazy" decoding="async" />
              <span className={styles.heroShotLabel}><strong>{text.proof[2].title}</strong><span>{text.proof[2].detail}</span></span>
            </div>
            <div className={`${styles.heroShot} ${styles.heroShot4}`}>
              <img src={heroPhotos[3].src} srcSet={heroPhotos[3].srcSet} sizes="(max-width: 960px) 46vw, 250px" width={heroPhotos[3].width} height={heroPhotos[3].height} alt={text.proof[3].alt} loading="lazy" decoding="async" />
              <span className={styles.heroShotLabel}><strong>{text.proof[3].title}</strong><span>{text.proof[3].detail}</span></span>
            </div>
            <div className={`${styles.heroShot} ${styles.heroMap}`}>
              <img className={styles.heroScene} src="/home/export-network.svg" width="1160" height="540" alt={text.imageAlt} loading="eager" decoding="async" />
              <div className={styles.heroMapHead}>
                <span>{text.from} <ArrowRight size={11} aria-hidden="true" /> {text.to}</span>
                <ul>{text.pathway.map(step => <li key={step}>{step}</li>)}</ul>
              </div>
            </div>
          </div>
          <figcaption>{text.proofNote}</figcaption>
        </figure>
      </div>
      <div className={styles.heroPathway} aria-label={text.pathwayLabel}><span>{text.pathway[0]}</span><ArrowRight size={16} aria-hidden="true" /><span>{text.pathway[1]}</span><ArrowRight size={16} aria-hidden="true" /><span>{text.pathway[2]}</span></div>
      <a className={styles.heroScroll} href="#solutions">{text.scroll} <ArrowDown size={16} aria-hidden="true" /></a>
    </div>
    <div className={styles.heroRibbon} aria-hidden="true"><div className={styles.heroRibbonTrack}>{[0, 1].map(pass => <span key={pass}>{["Cà phê", "Hạt điều", "Gia vị", "Hoa hồi", "Quế", "Tiêu đen", "Trà", "Gạo", "Thủy sản", "Đồ thủ công"].map(word => <span key={word}>{word}<Globe2 size={13} /></span>)}</span>)}</div></div>
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
    <div className={styles.bentoGrid}>{pillars.map((pillar, index) => <article key={pillar.id} className={`${styles.bentoCard} ${BENTO_TONE[index]}`}>
      <div className={styles.bentoCopy}>
        <div className={styles.cardTop}><span>{pillar.number} / 04</span><span>{pillar.label}</span></div>
        <h3>{pillar.title}</h3>
        <p className={styles.bentoDescription}>{pillar.description}</p>
        <ul className={styles.bentoFeatures}>{pillar.features.map(feature => <li key={feature}><Check size={15} aria-hidden="true" />{feature}</li>)}</ul>
        {index === 1 && <div className={styles.queryChips} aria-label={text.searches}><span>bulk supplier</span><span>OEM factory Vietnam</span><span>FOB Ho Chi Minh City</span></div>}
        {index === 3 && <a className={styles.bentoLink} {...tradeLink}>{text.trade} <ArrowUpRight size={17} aria-hidden="true" /></a>}
      </div>
      <figure className={`${styles.bentoMedia} ${index === 3 ? styles.bentoMediaWide : ""}`}>
        <img className={styles.bentoPhoto} src={solutionPhotos[index].src} srcSet={solutionPhotos[index].srcSet} sizes="(max-width: 720px) 92vw, 560px" width={solutionPhotos[index].width} height={solutionPhotos[index].height} alt={text.photos[index].alt} loading="lazy" decoding="async" />
        <figcaption><strong>{text.photos[index].title}</strong><span>{text.photos[index].caption}</span></figcaption>
      </figure>
    </article>)}</div>
    <p className={styles.bentoNote}><CircleHelp size={15} aria-hidden="true" /> {text.disclaimer}</p>
  </div></section>
}

/** A wide photographic band between the solution grid and the verification comparison. */
export function PhotoJourney({ locale }: { locale: HomeLocale }) {
  const text = HOME_MESSAGES[locale].solutions
  return <section className={styles.photoBand} aria-labelledby="photo-band-title"><div className={styles.container}>
    <div className={styles.photoBandHead}>
      <h2 id="photo-band-title">{text.photosTitle}</h2>
      <p>{text.journey.map(item => item.label).join(" · ")}</p>
    </div>
    <div className={styles.photoBandGrid}>
      <figure className={`${styles.photoBandFigure} ${styles.photoBandTall}`}><img src={PHOTO.harbor.src} srcSet={PHOTO.harbor.srcSet} sizes="(max-width: 960px) 92vw, 700px" width={PHOTO.harbor.width} height={PHOTO.harbor.height} alt={text.journey[0].alt} loading="lazy" decoding="async" /><figcaption><span>{text.journey[0].label}</span>{text.journey[0].title}</figcaption></figure>
      <figure className={styles.photoBandFigure}><img src={PHOTO.lab.src} srcSet={PHOTO.lab.srcSet} sizes="(max-width: 960px) 46vw, 420px" width={PHOTO.lab.width} height={PHOTO.lab.height} alt={text.journey[1].alt} loading="lazy" decoding="async" /><figcaption><span>{text.journey[1].label}</span>{text.journey[1].title}</figcaption></figure>
      <figure className={styles.photoBandFigure}><img src={PHOTO.workspace.src} srcSet={PHOTO.workspace.srcSet} sizes="(max-width: 960px) 46vw, 420px" width={PHOTO.workspace.width} height={PHOTO.workspace.height} alt={text.journey[2].alt} loading="lazy" decoding="async" /><figcaption><span>{text.journey[2].label}</span>{text.journey[2].title}</figcaption></figure>
      <figure className={styles.photoBandFigure}><img src={PHOTO.exterior.src} srcSet={PHOTO.exterior.srcSet} sizes="(max-width: 960px) 46vw, 420px" width={PHOTO.exterior.width} height={PHOTO.exterior.height} alt={text.journey[3].alt} loading="lazy" decoding="async" /><figcaption><span>{text.journey[3].label}</span>{text.journey[3].title}</figcaption></figure>
    </div>
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
    <figure className={styles.gapFigure}>
      <img src={gapFigurePhoto.src} srcSet={gapFigurePhoto.srcSet} sizes="(max-width: 900px) 92vw, 1120px" width={gapFigurePhoto.width} height={gapFigurePhoto.height} alt={HOME_MESSAGES[locale].hero.truckImageAlt} loading="lazy" decoding="async" />
      <figcaption><span className={styles.gapFigureTag}><Truck size={14} aria-hidden="true" /> {text.figureCaption}</span><span>{text.standardTail}</span></figcaption>
    </figure>
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
    <div className={styles.footerCallout}>
      <div className={`${styles.container} ${styles.footerCalloutInner}`}>
      <div className={styles.footerCalloutCopy}><span className={styles.footerEyebrow}>{text.eyebrow}</span><h2>{text.titleBefore}<br /><em>{text.titleAccent}</em></h2><p>{text.description}</p><AuditButton className={styles.footerCta}>{HOME_MESSAGES[locale].hero.audit} <ArrowUpRight size={18} aria-hidden="true" /></AuditButton></div>
      <figure className={styles.footerFigure}><img src={footerPhoto.src} srcSet={footerPhoto.srcSet} sizes="(max-width: 880px) 92vw, 470px" width={footerPhoto.width} height={footerPhoto.height} alt={HOME_MESSAGES[locale].hero.handoffImageAlt} loading="lazy" decoding="async" /></figure>
      </div>
    </div>
    <div className={styles.footerColumns}>
      <div className={styles.footerBrand}><img src="/trade/logo.svg" width={43} height={43} alt="" /><strong>VEXIM GLOBAL</strong><p>{text.brand}</p></div>
      <div><p className={styles.footerColumnTitle}>{text.explore}</p><a href={`${base}#solutions`}>{text.solutions}</a><a href={`${base}#the-gap`}>{text.gap}</a><a href={`${base}#services`}>{text.tiers}</a><a {...tradeLink}>Vexim Trade ↗</a></div>
      <div><p className={styles.footerColumnTitle}>{text.resources}</p><a href="/blog">{text.blog}</a><a href={privacyPath(locale)}>{text.privacy}</a><a href="/client-portal">{text.portal}</a><a href="/services/fda">{text.fda}</a><a href="/services/gacc">{text.gacc}</a><a href="/services/cosmetics/mocra-registration">{text.mocra}</a><a href="/services/us-agent">{text.usAgent}</a></div>
      <div><p className={styles.footerColumnTitle}>{text.contact}</p><a href={`mailto:${PUBLIC_EMAIL}`}>{PUBLIC_EMAIL}</a><a href={VEXIM_PHONE_TEL_URL}>{PHONE_DISPLAY}</a><address>{ADDRESS.streetAddress}<br />{ADDRESS.addressLocality}, {text.country}</address></div>
    </div>
    <div className={styles.footerBottom}><span>© {new Date().getFullYear()} {ORGANIZATION_NAME}. {text.rights}</span><span>{text.tagline}</span><div>{SAME_AS.slice(0, 2).map((url, index) => <a href={url} key={url} target="_blank" rel="noopener noreferrer">{index === 0 ? "Facebook" : "LinkedIn"} ↗</a>)}</div></div>
  </div></footer>
}
