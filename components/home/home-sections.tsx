import { ArrowDown, ArrowRight, ArrowUpRight, Check, CircleHelp, Globe2, Rocket, Search, ShieldCheck } from "lucide-react"
import { ADDRESS, ORGANIZATION_NAME, PHONE_DISPLAY, PUBLIC_EMAIL, SAME_AS } from "@/lib/business-profile"
import { VEXIM_PHONE_TEL_URL } from "@/lib/contact-info"
import { EXPORT_PILLARS, EXPORT_TIERS, HOME_POSITIONING } from "@/lib/homepage-content"
import { AuditButton } from "./audit-dialog"
import styles from "./home.module.css"

const tradeLink = { href: HOME_POSITIONING.tradeUrl, target: "_blank", rel: "noopener noreferrer" } as const

function Eyebrow({ step, children }: { step: string; children: React.ReactNode }) {
  return <p className={styles.sectionEyebrow}><span>{step}</span><span className={styles.eyebrowLine} />{children}</p>
}

export function HomeHero() {
  return <section className={styles.hero} aria-labelledby="hero-title">
    <div className={styles.heroGlow} aria-hidden="true" />
    <div className={`${styles.container} ${styles.heroInner}`}>
      <div className={styles.heroCopy}>
        <p className={styles.heroBadge}><Rocket size={16} aria-hidden="true" /><span>The Next-Gen Export Acceleration Engine</span><ArrowUpRight size={15} aria-hidden="true" /></p>
        <h1 id="hero-title">Global B2B Digital <span>Infrastructure</span> &amp; Export Acceleration</h1>
        <p className={styles.heroDescription}>{HOME_POSITIONING.description}</p>
        <div className={styles.heroActions}>
          <AuditButton className={styles.heroPrimary}>Request Digital Audit <ArrowUpRight size={18} aria-hidden="true" /></AuditButton>
          <a className={styles.heroSecondary} {...tradeLink}>Explore Vexim Trade Platform <ArrowUpRight size={17} aria-hidden="true" /></a>
        </div>
        <p className={styles.heroFootnote}><span className={styles.statusDot} /> Built for Vietnamese manufacturers. Designed for international buyers.</p>
      </div>
      <figure className={styles.heroStage}>
        <span className={styles.stageTagStart} aria-hidden="true"><span className={styles.stageTagIcon}><Globe2 size={16} /></span><span>Built in Vietnam<small>Official supplier presence</small></span></span>
        <img className={styles.heroScene} src="/home/export-network.svg" width="1160" height="540" alt="Isometric illustration connecting a Vietnamese factory and product catalog with buyers in North America and Europe" fetchPriority="high" />
        <span className={styles.stageTagEnd} aria-hidden="true"><span className={styles.stageTagIcon}><ArrowUpRight size={16} /></span><span>Ready for global discovery<small>North America · Europe</small></span></span>
        <figcaption>Concept illustration · no live buyer or ranking data</figcaption>
      </figure>
      <div className={styles.heroPathway} aria-label="The connected export system"><span>Owned foundation</span><ArrowRight size={16} aria-hidden="true" /><span>Buyer-intent discovery</span><ArrowRight size={16} aria-hidden="true" /><span>Trade connection</span></div>
    </div>
    <a className={styles.heroScroll} href="#solutions">Explore the system <ArrowDown size={16} aria-hidden="true" /></a>
  </section>
}

const artwork = [
  { src: "/home/cloud-architecture.svg", width: 700, height: 410, alt: "Isometric cloud server cluster beside a structured product catalog" },
  { src: "/home/buyer-intent.svg", width: 700, height: 410, alt: "Isometric search lens highlighting buyer destinations on a globe" },
  { src: "/home/trade-connect.svg", width: 800, height: 450, alt: "Isometric shipping containers connected to an illustrative buyer profile" },
] as const

export function CoreSolutions() {
  return <section id="solutions" className={styles.solutionsSection} aria-labelledby="solutions-title"><div className={styles.container}>
    <Eyebrow step="01 / THE SOLUTION">One connected export system</Eyebrow>
    <div className={styles.sectionIntro}>
      <h2 id="solutions-title">Everything you need<br />to be <span>found and trusted.</span></h2>
      <p>From your own website to the moment a buyer reaches out, each part of the export journey should work together.</p>
    </div>
    <div className={styles.bentoGrid}>{EXPORT_PILLARS.map((pillar, index) => <article key={pillar.id} className={`${styles.bentoCard} ${index === 0 ? styles.bentoInfrastructure : index === 1 ? styles.bentoSearch : styles.bentoTrade}`}>
      <div className={styles.bentoCopy}>
        <div className={styles.cardTop}><span>{pillar.number} / 03</span><span>{pillar.label}</span></div>
        <h3>{pillar.title}</h3>
        <p className={styles.bentoDescription}>{pillar.description}</p>
        <ul className={styles.bentoFeatures}>{pillar.features.map(feature => <li key={feature}><Check size={15} aria-hidden="true" />{feature}</li>)}</ul>
        {index === 1 && <div className={styles.queryChips} aria-label="Illustrative buyer-intent searches"><span>bulk supplier</span><span>OEM factory Vietnam</span><span>FOB Ho Chi Minh City</span></div>}
        {index === 2 && <a className={styles.bentoLink} {...tradeLink}>Explore Vexim Trade <ArrowUpRight size={17} aria-hidden="true" /></a>}
      </div>
      <img className={styles.bentoArtwork} src={artwork[index].src} width={artwork[index].width} height={artwork[index].height} alt={artwork[index].alt} loading="lazy" />
    </article>)}</div>
    <p className={styles.bentoNote}><CircleHelp size={15} aria-hidden="true" /> Search positions, listing access and buyer inquiries depend on market conditions, platform eligibility and the agreed scope.</p>
  </div></section>
}

export function VerificationGap() {
  return <section id="the-gap" className={styles.gapSection} aria-labelledby="gap-title"><div className={styles.container}>
    <Eyebrow step="02 / THE VERIFICATION GAP">Make the first impression count</Eyebrow>
    <div className={styles.sectionIntro}>
      <h2 id="gap-title">A listing gets noticed.<br /><span>A foundation gets checked.</span></h2>
      <p>After an introduction, buyers often look for an official website to understand the supplier, its products and how to start a direct conversation.</p>
    </div>
    <div className={styles.gapGrid}>
      <article className={`${styles.gapCard} ${styles.gapTraditional}`}>
        <div className={styles.gapCardHeader}><span className={styles.gapIcon}><Search size={20} aria-hidden="true" /></span><span>THE TRADITIONAL GAP</span></div>
        <h3>When the search ends at a thin page.</h3>
        <p>A marketplace introduction can open a door. But if your own website is difficult to find or lacks product depth, buyers have less information to assess your business independently.</p>
        <ul><li><span>01</span> Product details are scattered or missing.</li><li><span>02</span> Factory information is hard to verify.</li><li><span>03</span> The direct inquiry route is unclear.</li></ul>
        <div className={styles.gapCardTail}>A missed opportunity to build trust <ArrowUpRight size={17} aria-hidden="true" /></div>
      </article>
      <article className={`${styles.gapCard} ${styles.gapVexim}`}>
        <div className={styles.gapCardHeader}><span className={styles.gapIcon}><ShieldCheck size={20} aria-hidden="true" /></span><span>THE VEXIM STANDARD</span></div>
        <h3>Make every next step easier to verify.</h3>
        <p>An owned, structured export presence brings product information, supplier credentials and direct inquiry pathways together—so buyers can evaluate you on your terms.</p>
        <ul><li><Check size={16} aria-hidden="true" /> Searchable product and category pages.</li><li><Check size={16} aria-hidden="true" /> Credentials backed by owner-supplied evidence.</li><li><Check size={16} aria-hidden="true" /> Clear handoff to your sales conversation.</li></ul>
        <div className={styles.gapCardTail}>Discovery → verification → conversation <ArrowUpRight size={17} aria-hidden="true" /></div>
      </article>
    </div>
    <p className={styles.gapDisclaimer}>This is a service framework, not a quantified claim about factories or a promise of search rankings, contracts or lead volume. Publish results only with approved, dated evidence.</p>
  </div></section>
}

export function ExportTiers() {
  return <section id="services" className={styles.tierSection} aria-labelledby="tier-title"><div className={styles.container}>
    <Eyebrow step="03 / THE ENGAGEMENT">Scope, not a cheap website package</Eyebrow>
    <div className={styles.sectionIntro}>
      <h2 id="tier-title">Built around your<br /><span>product lines.</span></h2>
      <p>Choose the operational depth that fits your catalog and markets. Final deliverables, timelines and marketplace terms are agreed together.</p>
    </div>
    <div className={styles.tierGrid}>{EXPORT_TIERS.map((tier, index) => <article key={tier.id} className={`${styles.tierCard} ${index === 1 ? styles.featuredTier : ""}`}>
      <div className={styles.tierTop}><span>0{index + 1} / 03</span>{index === 1 && <span className={styles.tierFeaturedTag}>FOR MULTI-CATEGORY TEAMS</span>}</div>
      <div className={styles.tierIcon} aria-hidden="true"><span>{index === 0 ? "↗" : index === 1 ? "✧" : "◎"}</span></div>
      <p className={styles.tierLabel}>{tier.label}</p>
      <h3>{tier.name}</h3><p className={styles.tierAudience}>{tier.audience}</p>
      <p className={styles.tierDescription}>{tier.description}</p>
      <div className={styles.tierIncludes}>WHAT WE CAN BUILD TOGETHER</div>
      <ul>{tier.features.map(feature => <li key={feature}><Check size={16} aria-hidden="true" />{feature}</li>)}</ul>
      <AuditButton className={index === 1 ? styles.tierButtonFeatured : styles.tierButton} scope={tier.name}>Discuss this scope <ArrowUpRight size={17} aria-hidden="true" /></AuditButton>
    </article>)}</div>
    <p className={styles.tierNote}>Marketplace access and verification require platform eligibility and an agreed term. No rankings, lead volumes or contract outcomes are guaranteed.</p>
  </div></section>
}

export function ComplianceUtilities() {
  return <section className={styles.complianceSection} aria-label="Compliance resources"><div className={`${styles.container} ${styles.complianceInner}`}>
    <div className={styles.complianceLead}><ShieldCheck size={23} strokeWidth={1.6} aria-hidden="true" /><div><strong>Looking for compliance support?</strong><p>FDA, GACC, MoCRA and US Agent services remain available as separate pathways.</p></div></div>
    <div className={styles.complianceLinks}><a href="/services/fda">FDA <ArrowUpRight size={13} aria-hidden="true" /></a><a href="/services/gacc">GACC <ArrowUpRight size={13} aria-hidden="true" /></a><a href="/services/cosmetics/mocra-registration">MoCRA <ArrowUpRight size={13} aria-hidden="true" /></a><a href="/services/us-agent">US Agent <ArrowUpRight size={13} aria-hidden="true" /></a></div>
  </div></section>
}

export function HomeFooter() {
  return <footer id="contact" className={styles.homeFooter}><div className={styles.container}>
    <div className={styles.footerCallout}><div><span className={styles.footerEyebrow}>LET'S BUILD WHAT COMES NEXT</span><h2>Your products deserve<br /><em>to be discoverable.</em></h2><p>Start with a conversation about your product lines and target markets.</p></div><AuditButton className={styles.footerCta}>Request Digital Audit <ArrowUpRight size={18} aria-hidden="true" /></AuditButton></div>
    <div className={styles.footerColumns}>
      <div className={styles.footerBrand}><img src="/trade/logo.svg" width={43} height={43} alt="" /><strong>VEXIM GLOBAL</strong><p>Digital export foundations for Vietnamese manufacturers. Built for discovery, designed for direct buyer conversations.</p></div>
      <div><p className={styles.footerColumnTitle}>EXPLORE</p><a href="/#solutions">Our solutions</a><a href="/#the-gap">The verification gap</a><a href="/#services">Engagement scopes</a><a {...tradeLink}>Vexim Trade ↗</a></div>
      <div><p className={styles.footerColumnTitle}>RESOURCES</p><a href="/blog">Insights &amp; articles</a><a href="/privacy">Privacy &amp; data requests</a><a href="/client-portal">Client portal</a><a href="/services/fda">FDA resources</a><a href="/services/gacc">GACC resources</a><a href="/services/cosmetics/mocra-registration">MoCRA resources</a><a href="/services/us-agent">US Agent services</a></div>
      <div><p className={styles.footerColumnTitle}>CONTACT</p><a href={`mailto:${PUBLIC_EMAIL}`}>{PUBLIC_EMAIL}</a><a href={VEXIM_PHONE_TEL_URL}>{PHONE_DISPLAY}</a><address>{ADDRESS.streetAddress}<br />{ADDRESS.addressLocality}, Vietnam</address></div>
    </div>
    <div className={styles.footerBottom}><span>© {new Date().getFullYear()} {ORGANIZATION_NAME}. All rights reserved.</span><span>Vietnam → Global</span><div>{SAME_AS.slice(0, 2).map((url, index) => <a href={url} key={url} target="_blank" rel="noopener noreferrer">{index === 0 ? "Facebook" : "LinkedIn"} ↗</a>)}</div></div>
  </div></footer>
}
