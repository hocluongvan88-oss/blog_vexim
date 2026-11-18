"use client"

import { useEffect, useRef, useState } from "react"
import { Menu, X } from "lucide-react"
import { HOME_CLIENT_MESSAGES } from "@/lib/home-client-i18n"
import { LOCALIZED_PATHS, homePath, type HomeLocale, type HomePageKind } from "@/lib/locale-routes"
import { VEXIM_PHONE_DISPLAY, VEXIM_PHONE_TEL_URL } from "@/lib/contact-info"
import { TRADE_MARK } from "@/lib/vexim-trade-assets"
import styles from "./home.module.css"

export function HomeHeader({ locale, page }: { locale: HomeLocale; page: HomePageKind }) {
  const [expanded, setExpanded] = useState(false)
  const header = useRef<HTMLElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  const text = HOME_CLIENT_MESSAGES[locale]
  const base = homePath(locale)
  const nav = [
    ["trade", text.nav.trade],
    ["seo", text.nav.seo],
    ["website", text.nav.website],
    ["services", text.nav.other],
    ["news", text.nav.news],
    ["contact", text.nav.contact],
  ]
  useEffect(() => {
    if (!expanded) return
    const outside = (e: PointerEvent) => {
      if (!header.current?.contains(e.target as Node)) setExpanded(false)
    }
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setExpanded(false)
        toggle.current?.focus()
      }
    }
    document.addEventListener("pointerdown", outside)
    document.addEventListener("keydown", escape)
    return () => {
      document.removeEventListener("pointerdown", outside)
      document.removeEventListener("keydown", escape)
    }
  }, [expanded])
  return (
    <>
      <a className={styles.skip} href="#main-content">
        {text.nav.skip}
      </a>
      <div className={styles.topbar}>
        <div className={`${styles.container} ${styles.utility}`}>
          <span>{text.top}</span>
          <a href={VEXIM_PHONE_TEL_URL}>
            Hotline/Zalo: <b>{VEXIM_PHONE_DISPLAY}</b>
          </a>
          <a className={styles.platformLink} href="https://veximtrade.com" target="_blank" rel="noopener noreferrer">
            {text.platform} ↗
          </a>
          <nav aria-label={text.language} className={styles.languages} data-language-switcher>
            {(["vi", "en"] as const).map((lang) => (
              <a
                key={lang}
                href={`${LOCALIZED_PATHS[page][lang]}?lang=${lang}`}
                lang={lang}
                aria-label={lang === "vi" ? "Tiếng Việt" : "English"}
                aria-current={locale === lang ? "page" : undefined}
              >
                {lang.toUpperCase()}
              </a>
            ))}
          </nav>
        </div>
      </div>
      <header ref={header} className={styles.header}>
        <div className={`${styles.container} ${styles.headerInner}`}>
          <a className={styles.brand} href={base}>
            <span className={styles.brandMark}>
              <img src={TRADE_MARK} alt="" width={26} height={23} />
            </span>
            <span>
              VEXIM GLOBAL<small>B2B FOOD EXPORT</small>
            </span>
          </a>
          <nav className={styles.desktopNav} aria-label={text.nav.main}>
            {nav.map(([id, title]) => (
              <a key={id} href={`${base}#${id}`}>
                {title}
              </a>
            ))}
          </nav>
          <a
            className={`${styles.button} ${styles.headerCta}`}
            href={`${base}#contact`}
            aria-label={text.nav.consult}
          >
            <span>{text.nav.consult}</span>
            <span className={styles.shortCta}>{locale === "vi" ? "Tư vấn" : "Contact"}</span>
          </a>
          <button
            ref={toggle}
            type="button"
            className={styles.menuToggle}
            aria-label={expanded ? text.nav.close : text.nav.open}
            aria-expanded={expanded}
            aria-controls="home-mobile-nav"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        <nav id="home-mobile-nav" hidden={!expanded} className={styles.mobileNav} aria-label={text.nav.mobile}>
          {nav.map(([id, title]) => (
            <a key={id} href={`${base}#${id}`} onClick={() => setExpanded(false)}>
              {title}
              <span aria-hidden="true">→</span>
            </a>
          ))}
        </nav>
      </header>
    </>
  )
}
