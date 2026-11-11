"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUpRight, ChevronDown, Globe2, Menu, X } from "lucide-react"
import { HOME_CLIENT_MESSAGES } from "@/lib/home-client-i18n"
import { LOCALIZED_PATHS, homePath, type HomeLocale } from "@/lib/locale-routes"
import { AuditButton } from "./audit-dialog"
import styles from "./landing.module.css"

function LanguageMenu({ locale, mobile = false }: { locale: HomeLocale; mobile?: boolean }) {
  const details = useRef<HTMLDetailsElement>(null)
  const label = HOME_CLIENT_MESSAGES[locale].language

  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !details.current?.contains(event.target)) details.current?.removeAttribute("open")
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && details.current?.open) {
        details.current.open = false
        details.current.querySelector("summary")?.focus()
      }
    }
    document.addEventListener("pointerdown", outside)
    document.addEventListener("keydown", escape)
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape) }
  }, [])

  return <details ref={details} className={`${styles.languageMenu} ${mobile ? styles.mobileLanguage : styles.desktopLanguage}`} data-language-switcher>
    <summary aria-label={label.choose}><Globe2 size={16} aria-hidden="true" /><span>{locale.toUpperCase()}</span><ChevronDown size={13} aria-hidden="true" /></summary>
    <div className={styles.languageOptions} aria-label={label.choose}>
      <a href={LOCALIZED_PATHS.home.en} lang="en" aria-current={locale === "en" ? "page" : undefined}>{label.english}<span>EN</span></a>
      <a href={LOCALIZED_PATHS.home.vi} lang="vi" aria-current={locale === "vi" ? "page" : undefined}>{label.vietnamese}<span>VI</span></a>
    </div>
  </details>
}

export function LandingHeader({ locale }: { locale: HomeLocale }) {
  const [expanded, setExpanded] = useState(false)
  const text = HOME_CLIENT_MESSAGES[locale]
  const base = homePath(locale)
  const navigation = [
    { href: `${base}#solutions`, label: text.nav.solutions },
    { href: `${base}#the-gap`, label: text.nav.why },
    { href: `${base}#services`, label: text.nav.engagements },
  ]
  return <header className={styles.header}>
    <div className={`${styles.container} ${styles.headerInner}`}>
      <a className={styles.brand} href={base} aria-label="Vexim Global">
        <img src="/trade/logo.svg" alt="" width={42} height={42} />
        <span>VEXIM<span>GLOBAL</span><small>{text.brandTagline}</small></span>
      </a>
      <nav className={styles.desktopNav} aria-label={text.nav.main}>
        {navigation.map(item => <a href={item.href} key={item.href}>{item.label}</a>)}
        <a href="https://veximtrade.com" target="_blank" rel="noopener noreferrer">{text.nav.trade}<ArrowUpRight size={14} aria-hidden="true" /></a>
      </nav>
      <div className={styles.headerActions}>
        <LanguageMenu locale={locale} />
        <AuditButton className={styles.headerCta}>{text.nav.audit}<ArrowUpRight size={16} aria-hidden="true" /></AuditButton>
        <button className={styles.menuToggle} type="button" aria-label={expanded ? text.nav.close : text.nav.open} aria-expanded={expanded} aria-controls="landing-mobile-nav" onClick={() => setExpanded(!expanded)}>{expanded ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
    </div>
    <nav id="landing-mobile-nav" className={styles.mobileNav} aria-label={text.nav.mobile} hidden={!expanded}>
      {navigation.map((item, index) => <a href={item.href} key={item.href} onClick={() => setExpanded(false)}><span>0{index + 1}</span>{item.label}<ArrowUpRight size={17} aria-hidden="true" /></a>)}
      <a href="https://veximtrade.com" target="_blank" rel="noopener noreferrer" onClick={() => setExpanded(false)}><span>04</span>{text.nav.tradeEcosystem}<ArrowUpRight size={17} aria-hidden="true" /></a>
      <div className={styles.mobileNavBottom}><LanguageMenu locale={locale} mobile /><AuditButton className={styles.mobileCta}>{text.nav.audit}<ArrowUpRight size={16} aria-hidden="true" /></AuditButton></div>
    </nav>
  </header>
}
