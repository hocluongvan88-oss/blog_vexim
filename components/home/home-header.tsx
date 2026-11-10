"use client"

import { useState } from "react"
import { Menu, X, ArrowUpRight } from "lucide-react"
import { AuditButton } from "./audit-dialog"
import styles from "./home.module.css"

export function HomeHeader() {
  const [expanded, setExpanded] = useState(false)
  return <header className={styles.header}>
    <div className={`${styles.container} ${styles.headerInner}`}>
      <a className={styles.brand} href="/">
        <img src="/trade/logo.svg" alt="" width={38} height={38} />
        <span>VEXIM<span className={styles.brandLight}> GLOBAL</span><small>DIGITAL EXPORT INFRASTRUCTURE</small></span>
      </a>
      <nav className={styles.desktopNav} aria-label="Main navigation">
        <a href="/#solutions">Solutions</a><a href="/#the-gap">Why Vexim</a><a href="/#services">Engagements</a>
        <a href="https://veximtrade.com" target="_blank" rel="noopener noreferrer">Vexim Trade <ArrowUpRight size={13} aria-hidden="true" /></a>
      </nav>
      <AuditButton className={styles.headerAudit}>Request an audit <ArrowUpRight size={16} aria-hidden="true" /></AuditButton>
      <button className={styles.menuToggle} type="button" aria-label={expanded ? "Close navigation" : "Open navigation"} aria-expanded={expanded} aria-controls="home-mobile-nav" onClick={() => setExpanded(!expanded)}>{expanded ? <X /> : <Menu />}</button>
    </div>
    <nav id="home-mobile-nav" aria-label="Mobile navigation" hidden={!expanded} className={styles.mobileNav}>
      {[["/#solutions", "Solutions"], ["/#the-gap", "Why Vexim"], ["/#services", "Engagements"], ["/#contact", "Contact"]].map(([href, label]) => <a key={href} href={href} onClick={() => setExpanded(false)}>{label} <span aria-hidden="true">↗</span></a>)}
      <a href="https://veximtrade.com" target="_blank" rel="noopener noreferrer" onClick={() => setExpanded(false)}>Vexim Trade ecosystem ↗</a>
      <AuditButton />
    </nav>
  </header>
}
