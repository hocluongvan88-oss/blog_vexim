import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronRight, CircleHelp, Database, Layers3, Link2, MoveUpRight, Radio, Search, ShieldCheck, Waypoints } from "lucide-react"
import { ADDRESS, ORGANIZATION_NAME, PHONE_DISPLAY, PUBLIC_EMAIL, SAME_AS } from "@/lib/business-profile"
import { VEXIM_PHONE_TEL_URL } from "@/lib/contact-info"
import { EXPORT_PILLARS, EXPORT_TIERS, HOME_POSITIONING } from "@/lib/homepage-content"
import { AuditButton } from "./audit-dialog"
import { PerformanceShowcase } from "./performance-showcase"
import styles from "./home.module.css"

const tradeLink = { href: HOME_POSITIONING.tradeUrl, target: "_blank", rel: "noopener noreferrer" } as const

function SectionLabel({ index, children, light = false }: { index: string; children: React.ReactNode; light?: boolean }) {
  return <p className={`${styles.sectionLabel} ${light ? styles.sectionLabelLight : ""}`}><span>{index}</span><span className={styles.labelRule} />{children}</p>
}

export function HomeHero() {
  return <section className={styles.hero} aria-labelledby="hero-title">
    <div className={styles.heroGrid} aria-hidden="true" />
    <div className={`${styles.container} ${styles.heroInner}`}>
      <div className={styles.heroCopy}>
        <div className={styles.heroKicker}><span className={styles.statusDot} /> THE INFRASTRUCTURE BEHIND GLOBAL EXPORT GROWTH <span className={styles.kickerIndex}>/ 01—03</span></div>
        <h1 id="hero-title">Global B2B Digital Infrastructure &amp; <span>Export Acceleration Engine</span></h1>
        <p className={styles.heroDescription}>{HOME_POSITIONING.description}</p>
        <div className={styles.heroActions}>
          <AuditButton className={styles.heroPrimary}>Request Free Digital Audit <ArrowUpRight size={18} aria-hidden="true" /></AuditButton>
          <a className={styles.heroSecondary} {...tradeLink}>Explore Vexim Trade Ecosystem <ArrowUpRight size={16} aria-hidden="true" /></a>
        </div>
        <div className={styles.heroFootnote}><span className={styles.smallDiamond} /> Built for Vietnamese manufacturers. Designed for global buyers.</div>
      </div>
      <HeroDashboard />
    </div>
    <a className={styles.heroScroll} href="#the-gap"><ArrowDown size={15} aria-hidden="true" /> EXPLORE THE SYSTEM</a>
  </section>
}

function HeroDashboard() {
  return <div className={styles.dashboardShell} role="img" aria-label="Illustrative export intelligence dashboard; no live rankings or buyer data">
    <div className={styles.dashboardTop}><span className={styles.dashboardDots} aria-hidden="true"><i /><i /><i /></span><span>VEXIM / EXPORT INTELLIGENCE</span><span className={styles.dashboardVersion}>SYSTEM VIEW / 01</span></div>
    <div className={styles.dashboardBody}>
      <div className={styles.dashboardEyebrow}><span className={styles.statusDot} /> FRAMEWORK PREVIEW <span>NOT LIVE PERFORMANCE DATA</span></div>
      <div className={styles.dashboardTitle}>From factory floor<br /><em>to global discovery.</em></div>
      <div className={styles.diagram} aria-hidden="true">
        <div className={styles.diagramLine} />
        <div className={styles.diagramNode}><span>01</span><Layers3 size={19} /><small>OWNED<br />PRESENCE</small></div>
        <div className={styles.diagramNode}><span>02</span><Search size={19} /><small>SEARCH<br />DISCOVERY</small></div>
        <div className={styles.diagramNode}><span>03</span><Waypoints size={19} /><small>TRADE<br />DISTRIBUTION</small></div>
      </div>
      <div className={styles.dashboardRows}>
        <div><span><i className={styles.rowIcon}>A</i><strong>Structured B2B catalog</strong></span><span>Product data <ArrowUpRight size={13} /></span></div>
        <div><span><i className={styles.rowIcon}>B</i><strong>Buyer-intent search</strong></span><span>Market discovery <ArrowUpRight size={13} /></span></div>
        <div><span><i className={styles.rowIcon}>C</i><strong>Vexim Trade ecosystem</strong></span><span>Inquiry pathway <ArrowUpRight size={13} /></span></div>
      </div>
      <div className={styles.dashboardBottom}><span>ENGINE STATUS</span><strong><span className={styles.statusDot} /> STRATEGY FRAMEWORK</strong></div>
    </div>
  </div>
}

export function SystemsStrip() {
  return <div className={styles.systemStrip}><div className={`${styles.container} ${styles.systemStripInner}`}><span className={styles.stripIntro}>ONE CONNECTED EXPORT SYSTEM</span><div><span>OWN THE FOUNDATION</span><ArrowRight size={17} aria-hidden="true" /><span>CAPTURE BUYER INTENT</span><ArrowRight size={17} aria-hidden="true" /><span>CONNECT THE MARKETPLACE</span></div></div></div>
}

const gapCards = [
  { number: "01", title: "The ghost website trap", icon: Search, text: "A site that global buyers cannot find is a site they cannot verify. Weak indexability and thin product pages create a gap between a marketplace introduction and supplier due diligence.", signal: "DISCOVERY GAP" },
  { number: "02", title: "Marketplace dependency", icon: Link2, text: "A marketplace listing can introduce a supplier, but your own domain should establish identity, product depth and a direct relationship beyond the platform.", signal: "OWNERSHIP GAP" },
  { number: "03", title: "Zero organic pipeline", icon: Database, text: "Without searchable MOQ, Incoterms, specifications and product structures, an official website gives procurement teams—and search engines—little to work with.", signal: "DATA GAP" },
] as const

export function DigitalGap() {
  return <section id="the-gap" className={styles.gapSection} aria-labelledby="gap-title"><div className={styles.container}>
    <SectionLabel index="01 / THE MARKET REALITY">The B2B digital gap</SectionLabel>
    <div className={styles.sectionHeadingRow}><h2 id="gap-title">The buyer is searching.<br /><span>Is your business findable?</span></h2><p>Buyers validate a manufacturer before they make contact. A marketplace presence alone is not an owned, searchable export foundation.</p></div>
    <div className={styles.gapGrid}>{gapCards.map(({ number, title, text, icon: Icon, signal }) => <article className={styles.gapCard} key={number}>
      <div className={styles.gapCardTop}><span>{number} / 03</span><Icon size={22} strokeWidth={1.5} aria-hidden="true" /></div>
      <h3>{title}</h3><p>{text}</p><div className={styles.gapCardBottom}><span>{signal}</span><MoveUpRight size={18} aria-hidden="true" /></div>
    </article>)}</div>
    <p className={styles.gapDisclaimer}><CircleHelp size={15} aria-hidden="true" /> These are common infrastructure risks, not a quantified claim about all factories.</p>
  </div></section>
}

export function DualEngine() {
  return <section id="solutions" className={styles.solutionSection} aria-labelledby="solution-title"><div className={styles.solutionGridBg} aria-hidden="true" /><div className={styles.container}>
    <SectionLabel index="02 / OUR APPROACH" light>The Vexim dual-engine solution</SectionLabel>
    <div className={styles.solutionIntro}><div><h2 id="solution-title">The infrastructure.<br /><span>The intent.</span><br />The connection.</h2></div><div className={styles.solutionSide}><p>Two engines, one connected system: your owned export foundation and the Vexim Trade ecosystem. Built to turn product information into clearer paths for international buyers.</p><a href="#services">Explore engagement scopes <ArrowUpRight size={16} aria-hidden="true" /></a></div></div>
    <div className={styles.pillarGrid}>{EXPORT_PILLARS.map(pillar => <article key={pillar.id} className={styles.pillarCard}>
      <div className={styles.pillarNumber}><span>{pillar.number}</span><span aria-hidden="true">↗</span></div>
      <span className={styles.pillarLabel}>{pillar.label}</span>
      <h3>{pillar.title}</h3><p className={styles.pillarDescription}>{pillar.description}</p>
      <ul>{pillar.features.map(feature => <li key={feature}><Check size={15} aria-hidden="true" />{feature}</li>)}</ul>
      <div className={styles.pillarOutput}>{pillar.output}</div>
    </article>)}</div>
    <div className={styles.solutionClosing}><span><Radio size={16} aria-hidden="true" /> ONE CONNECTED OPERATION</span><p>Owned website <ChevronRight size={13} /> Buyer-intent discovery <ChevronRight size={13} /> Marketplace distribution <ChevronRight size={13} /> Qualified conversation</p></div>
  </div></section>
}

export function ProofOfPerformance() {
  return <section id="performance" className={styles.proofSection} aria-labelledby="proof-title"><div className={`${styles.container} ${styles.proofLayout}`}>
    <div className={styles.proofCopy}><SectionLabel index="03 / MEASURE WHAT MATTERS">Proof of performance</SectionLabel>
      <h2 id="proof-title">Show the work.<br /><span>Verify the outcome.</span></h2>
      <p>Visibility should be evidenced, not promised. Our reporting framework is designed to link search discovery, target markets and qualified buyer inquiries to their sources.</p>
      <div className={styles.proofPrinciple}><ShieldCheck size={22} strokeWidth={1.5} aria-hidden="true" /><div><strong>Evidence before claims.</strong><span>Client URLs, rankings and conversion figures appear only after the owner approves verifiable data with a date, source and market context.</span></div></div>
      <AuditButton className={styles.proofCta}>Discuss a measurement plan <ArrowUpRight size={16} aria-hidden="true" /></AuditButton>
    </div>
    <PerformanceShowcase />
  </div></section>
}

export function ExportTiers() {
  return <section id="services" className={styles.tierSection} aria-labelledby="tier-title"><div className={styles.container}>
    <SectionLabel index="04 / ENGAGEMENT SCOPES">Export acceleration tiers</SectionLabel>
    <div className={styles.tierIntro}><h2 id="tier-title">Built around your<br /><span>product lines.</span></h2><div><p>No cheap website packages. No unverified rank guarantees. Choose the depth of infrastructure and ongoing operations that fits your export model.</p><span>SCOPES FOR DISCUSSION · FINAL DELIVERABLES BY AGREEMENT</span></div></div>
    <div className={styles.tierGrid}>{EXPORT_TIERS.map((tier, i) => <article className={`${styles.tierCard} ${i === 1 ? styles.featuredTier : ""}`} key={tier.id}>
      <div className={styles.tierTop}><span>0{i + 1} / 03</span>{i === 1 && <span className={styles.tierFeaturedTag}>MULTI-CATEGORY</span>}</div>
      <p className={styles.tierLabel}>{tier.label}</p><h3>{tier.name}</h3><p className={styles.tierAudience}>{tier.audience}</p><p className={styles.tierDescription}>{tier.description}</p>
      <div className={styles.tierIncludes}>ENGAGEMENT INCLUDES</div><ul>{tier.features.map(feature => <li key={feature}><Check size={15} aria-hidden="true" />{feature}</li>)}</ul>
      <AuditButton className={i === 1 ? styles.tierButtonFeatured : styles.tierButton} scope={tier.name}>Discuss this scope <ArrowUpRight size={16} aria-hidden="true" /></AuditButton>
    </article>)}</div>
    <p className={styles.tierNote}>* Listing verification and marketplace access are subject to platform eligibility and the agreed scope. Results, rankings and lead volumes are not guaranteed.</p>
  </div></section>
}

export function ComplianceUtilities() {
  return <section className={styles.complianceSection} aria-label="Compliance resources"><div className={`${styles.container} ${styles.complianceInner}`}>
    <div className={styles.complianceLead}><ShieldCheck size={22} strokeWidth={1.5} aria-hidden="true" /><div><strong>Need a compliance resource?</strong><p>FDA, GACC, MoCRA and US Agent services remain available as separate support pathways.</p></div></div>
    <div className={styles.complianceLinks}><a href="/services/fda">FDA <ArrowUpRight size={13} /></a><a href="/services/gacc">GACC <ArrowUpRight size={13} /></a><a href="/services/cosmetics/mocra-registration">MoCRA <ArrowUpRight size={13} /></a><a href="/services/us-agent">US Agent <ArrowUpRight size={13} /></a></div>
  </div></section>
}

export function HomeFooter() {
  return <footer id="contact" className={styles.homeFooter}><div className={styles.container}>
    <div className={styles.footerTop}><div><span className={styles.footerEyebrow}>THE NEXT EXPORT CHAPTER STARTS HERE</span><h2>Build a presence<br /><em>the world can find.</em></h2></div><AuditButton className={styles.footerCta}>Request Free Digital Audit <ArrowUpRight size={18} aria-hidden="true" /></AuditButton></div>
    <div className={styles.footerColumns}>
      <div className={styles.footerBrand}><img src="/trade/logo.svg" width={42} height={42} alt="" /><strong>VEXIM GLOBAL</strong><p>Digital export foundations for Vietnamese manufacturers. Built for discovery, designed for direct buyer conversations.</p></div>
      <div><p className={styles.footerColumnTitle}>EXPLORE</p><a href="#solutions">Our engines</a><a href="#performance">Performance framework</a><a href="#services">Engagement scopes</a><a {...tradeLink}>Vexim Trade ↗</a></div>
      <div><p className={styles.footerColumnTitle}>RESOURCES</p><a href="/blog">Insights & articles</a><a href="/privacy">Privacy & data requests</a><a href="/client-portal">Client portal</a><a href="/services/fda">FDA resources</a><a href="/services/gacc">GACC resources</a><a href="/services/cosmetics/mocra-registration">MoCRA resources</a><a href="/services/us-agent">US Agent services</a></div>
      <div><p className={styles.footerColumnTitle}>CONTACT</p><a href={`mailto:${PUBLIC_EMAIL}`}>{PUBLIC_EMAIL}</a><a href={VEXIM_PHONE_TEL_URL}>{PHONE_DISPLAY}</a><address>{ADDRESS.streetAddress}<br />{ADDRESS.addressLocality}, Vietnam</address></div>
    </div>
    <div className={styles.footerBottom}><span>© {new Date().getFullYear()} {ORGANIZATION_NAME}. All rights reserved.</span><span>Vietnam → Global</span><div>{SAME_AS.slice(0, 2).map((url, i) => <a href={url} key={url} target="_blank" rel="noopener noreferrer">{i === 0 ? "Facebook" : "LinkedIn"} ↗</a>)}</div></div>
  </div></footer>
}
