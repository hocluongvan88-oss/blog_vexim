"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUpRight, ChevronDown, Globe2, Menu, X } from "lucide-react"
import { HOME_CLIENT_MESSAGES } from "@/lib/home-client-i18n"
import { LOCALIZED_PATHS, homePath, type HomeLocale, type HomePageKind } from "@/lib/locale-routes"
import { AuditButton } from "./audit-dialog"
import styles from "./home.module.css"

function LanguageDropdown({ locale, page, mobile = false }: { locale: HomeLocale; page: HomePageKind; mobile?: boolean }) {
  const details = useRef<HTMLDetailsElement>(null)
  const label = HOME_CLIENT_MESSAGES[locale].language
  const paths = LOCALIZED_PATHS[page]

  // Gắn ?lang= để middleware ghi cookie lựa chọn của khách — nhờ vậy lần sau
  // không bị chuyển hướng theo ngôn ngữ trình duyệt nữa.
  const choose = (target: string, value: HomeLocale) => `${target}?lang=${value}`

  useEffect(() => {
    const dismiss = (event: PointerEvent) => {
      if (event.target instanceof Node && !details.current?.contains(event.target)) details.current?.removeAttribute("open")
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && details.current?.open) {
        details.current.open = false
        details.current.querySelector("summary")?.focus()
      }
    }
    document.addEventListener("pointerdown", dismiss)
    document.addEventListener("keydown", escape)
    return () => { document.removeEventListener("pointerdown", dismiss); document.removeEventListener("keydown", escape) }
  }, [])

  return <details ref={details} className={`${styles.languageMenu} ${mobile ? styles.mobileLanguage : styles.desktopLanguage}`} data-language-switcher>
    <summary aria-label={label.choose}><Globe2 size={16} aria-hidden="true" /><span>{locale.toUpperCase()}</span><ChevronDown size={14} aria-hidden="true" /></summary>
    <div className={styles.languageOptions} aria-label={label.choose}>
      <a href={choose(paths.en, "en")} lang="en" aria-current={locale === "en" ? "page" : undefined}>{label.english}<span>EN</span></a>
      <a href={choose(paths.vi, "vi")} lang="vi" aria-current={locale === "vi" ? "page" : undefined}>{label.vietnamese}<span>VI</span></a>
    </div>
  </details>
}

export function HomeHeader({ locale, page }: { locale: HomeLocale; page: HomePageKind }) {
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
      <a className={styles.brand} href={base}>
        <img src="/trade/logo.svg" alt="" width={38} height={38} />
        <span>VEXIM<span className={styles.brandLight}> GLOBAL</span><small>{text.brandTagline}</small></span>
      </a>
      <nav className={styles.desktopNav} aria-label={text.nav.main}>
        {navigation.map(item => <a href={item.href} key={item.href}>{item.label}</a>)}
        <a href="https://veximtrade.com" target="_blank" rel="noopener noreferrer">{text.nav.trade} <ArrowUpRight size={13} aria-hidden="true" /></a>
      </nav>
      <LanguageDropdown locale={locale} page={page} />
      <AuditButton className={styles.headerAudit}>{text.nav.audit} <ArrowUpRight size={16} aria-hidden="true" /></AuditButton>
      <button className={styles.menuToggle} type="button" aria-label={expanded ? text.nav.close : text.nav.open} aria-expanded={expanded} aria-controls="home-mobile-nav" onClick={() => setExpanded(!expanded)}>{expanded ? <X /> : <Menu />}</button>
    </div>
    <nav id="home-mobile-nav" aria-label={text.nav.mobile} hidden={!expanded} className={styles.mobileNav}>
      {[...navigation, { href: `${base}#contact`, label: text.nav.contact }].map(item => <a key={item.href} href={item.href} onClick={() => setExpanded(false)}>{item.label} <span aria-hidden="true">↗</span></a>)}
      <a href="https://veximtrade.com" target="_blank" rel="noopener noreferrer" onClick={() => setExpanded(false)}>{text.nav.tradeEcosystem} ↗</a>
      <LanguageDropdown locale={locale} page={page} mobile />
      <AuditButton>{text.nav.audit}</AuditButton>
    </nav>
  </header>
}
