import { ArrowRight, ArrowUpRight } from "lucide-react"
import { EN_HUB } from "@/lib/hub-content-en"
import { VI_HUB } from "@/lib/hub-content-vi"
import type { HomeLocale } from "@/lib/locale-routes"
import { AuditButton } from "./audit-dialog"
import { HomeFooter } from "./home-sections"
import styles from "./hub.module.css"

const content = { vi: VI_HUB, en: EN_HUB } as const

/**
 * Trang tổng quan (hub). Mỗi khối là một cửa vào landing page con.
 *
 * Không ảnh, không mosaic, không kể chuyện. Người đọc quét bốn giây là biết
 * Vexim làm bốn việc gì và bấm vào đâu. Chi tiết nằm ở trang con.
 */
export function HubSections({ locale }: { locale: HomeLocale }) {
  const text = content[locale]
  const isExternal = (card: { external?: boolean }) => Boolean(card.external)

  return <main lang={locale}>
    {/* HERO — chữ trái, mục lục phải. */}
    <section className={styles.hero} aria-labelledby="hub-title">
      <div className={`${styles.container} ${styles.heroInner}`}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{text.hero.eyebrow}</p>
          <h1 id="hub-title" className={styles.heroTitle}>{text.hero.titleBefore}<span>{text.hero.titleAccent}</span></h1>
          <p className={styles.heroLine}>{text.hero.line}</p>
          <div className={styles.heroActions}>
            <AuditButton className={styles.btnPrimary}>{text.hero.primary} <ArrowUpRight size={17} aria-hidden="true" /></AuditButton>
            <a className={styles.btnGhost} href={text.hero.secondaryHref}>{text.hero.secondary} <ArrowRight size={16} aria-hidden="true" /></a>
          </div>
        </div>

        <nav className={styles.heroIndex} aria-label={text.hero.indexLabel}>
          {text.hero.index.map(item => <li key={item.href}>
            <a href={item.href}><b>{item.number}</b><span>{item.label}</span><ArrowRight size={16} aria-hidden="true" /></a>
          </li>)}
        </nav>
      </div>
    </section>

    <div className={styles.marquee} aria-hidden="true">
      <div className={styles.marqueeTrack}>
        {[0, 1].map(pass => <span key={pass}>{text.marquee.map(word => <span key={word} style={{ display: "inline-flex", alignItems: "center", gap: 24 }}><em>{word}</em><i /></span>)}</span>)}
      </div>
    </div>

    {/* 01 — BỐN VIỆC, BỐN CỬA. */}
    <section id="works" className={styles.section} aria-labelledby="works-title">
      <div className={styles.container}>
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.eyebrow}>{text.worksLabel}</p>
            <h2 id="works-title" className={styles.sectionTitle}>{text.worksTitle}</h2>
          </div>
          <p className={styles.sectionNote}>{text.worksHint}</p>
        </div>
        <div className={styles.workGrid}>
          {text.works.map(card => <a key={card.number} className={styles.workCard} href={card.href} {...(isExternal(card) ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            <div className={styles.workTop}><span className={styles.workNum}>{card.number}</span><span className={styles.workLabel}>{card.label}</span></div>
            <h3 className={styles.workTitle}>{card.title}</h3>
            <p className={styles.workLine}>{card.line}</p>
            <div className={styles.workFoot}><span className={styles.workCta}>{card.cta}</span><ArrowUpRight size={17} aria-hidden="true" /></div>
          </a>)}
        </div>
      </div>
    </section>

    {/* 02 — PHẠM VI. Mỗi thẻ mở form trao đổi với phạm vi đã chọn sẵn. */}
    <section id="scope" className={`${styles.section} ${styles.sectionAlt}`} aria-labelledby="scope-title">
      <div className={styles.container}>
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.eyebrow}>{text.scopeLabel}</p>
            <h2 id="scope-title" className={styles.sectionTitle}>{text.scopeTitle}</h2>
          </div>
          <p className={styles.sectionNote}>{text.scopeLine}</p>
        </div>
        <div className={styles.scopeGrid}>
          {text.scope.map(item => <AuditButton key={item.id} className={styles.scopeCard} scope={item.name}>
            <span className={styles.scopeName}>{item.name}</span>
            <span className={styles.scopeFor}>{item.for}</span>
          </AuditButton>)}
        </div>
      </div>
    </section>

    {/* 03 — TUÂN THỦ. Bốn lối vào, một đường kẻ, không kể lể. */}
    <section id="compliance" className={styles.section} aria-labelledby="compliance-title">
      <div className={styles.container}>
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.eyebrow}>{text.complianceLabel}</p>
            <h2 id="compliance-title" className={styles.sectionTitle}>{text.complianceTitle}</h2>
          </div>
          <p className={styles.sectionNote}>{text.complianceLine}</p>
        </div>
        <div className={styles.complianceGrid}>
          {text.complianceLinks.map(link => <a key={link.name} className={styles.complianceCard} href={link.href}>
            <span className={styles.complianceName}>{link.name} <ArrowUpRight size={15} aria-hidden="true" /></span>
            <span className={styles.complianceNote}>{link.note}</span>
          </a>)}
        </div>
      </div>
    </section>

  </main>
}

export { HomeFooter as HubFooter }
