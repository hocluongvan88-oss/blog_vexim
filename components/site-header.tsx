"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { ConsultationDialog } from "@/components/consultation-dialog";
import { HOME_CLIENT_MESSAGES } from "@/lib/home-client-i18n";
import {
  LOCALIZED_PATHS,
  homePath,
  type HomeLocale,
  type HomePageKind,
} from "@/lib/locale-routes";
import { VEXIM_PHONE_DISPLAY, VEXIM_PHONE_TEL_URL } from "@/lib/contact-info";
import { TRADE_MARK } from "@/lib/vexim-trade-assets";
import styles from "./site-header.module.css";

/**
 * Header duy nhất của toàn site — lấy đúng thiết kế của landing page
 * (dải tiện ích xanh đậm + thanh điều hướng trắng dính trên cùng).
 *
 * Trước đây mỗi nhóm trang dùng một header riêng (`components/header.tsx` cho
 * dịch vụ/blog, `HomeHeader` cho landing), nên khách thấy hai giao diện khác
 * nhau chỉ bằng một cú nhấp. Nay mọi trang dùng chung component này.
 *
 * - `locale`/`page`: chỉ truyền ở những trang thật sự có bản dịch (trang chủ,
 *   privacy). Trang dịch vụ và blog chưa có bản tiếng Anh nên không hiển thị
 *   bộ chuyển ngữ — không dẫn khách tới một bản dịch không tồn tại.
 * - Liên kết điều hướng trỏ về đúng mục của landing page, riêng "Tin tức" là
 *   một route thật (`/blog`).
 */
export function SiteHeader({
  locale,
  page,
}: {
  locale?: HomeLocale;
  page?: HomePageKind;
} = {}) {
  const [expanded, setExpanded] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const text = HOME_CLIENT_MESSAGES[locale ?? "vi"];
  const base = homePath(locale ?? "vi");
  const nav = [
    ["/services/export-sales", text.nav.trade],
    [`${base}#seo`, text.nav.seo],
    [`${base}#website`, text.nav.website],
    [`${base}#services`, text.nav.other],
    ["/blog", text.nav.news],
    [`${base}#contact`, text.nav.contact],
  ] as const;

  useEffect(() => {
    if (!expanded) return;
    const outside = (e: PointerEvent) => {
      if (!header.current?.contains(e.target as Node)) setExpanded(false);
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setExpanded(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [expanded]);

  // Đóng menu khi chuyển trang bằng điều hướng phía client.
  useEffect(() => {
    const close = () => setExpanded(false);
    window.addEventListener("popstate", close);
    return () => window.removeEventListener("popstate", close);
  }, []);

  return (
    <div className={styles.shell} data-site-header>
      <a className={styles.skip} href="#main-content">
        {text.nav.skip}
      </a>
      <div className={styles.topbar}>
        <div className={`${styles.container} ${styles.utility}`}>
          <span>{text.top}</span>
          <a href={VEXIM_PHONE_TEL_URL}>
            Hotline/Zalo: <b>{VEXIM_PHONE_DISPLAY}</b>
          </a>
          <a
            className={styles.platformLink}
            href="https://veximtrade.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            {text.platform} ↗
          </a>
          {locale && page && (
            <nav
              aria-label={text.language}
              className={styles.languages}
              data-language-switcher
            >
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
          )}
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
            {nav.map(([href, title]) => (
              <a key={href} href={href}>
                {title}
              </a>
            ))}
          </nav>
          <button
            type="button"
            className={`${styles.button} ${styles.headerCta}`}
            onClick={() => setDialogOpen(true)}
            aria-label={text.nav.consult}
            aria-haspopup="dialog"
          >
            <span>{text.nav.consult}</span>
            <span className={styles.shortCta}>
              {locale === "en" ? "Contact" : "Tư vấn"}
            </span>
          </button>
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
        <nav
          id="home-mobile-nav"
          hidden={!expanded}
          className={styles.mobileNav}
          aria-label={text.nav.mobile}
        >
          {nav.map(([href, title]) => (
            <a key={href} href={href} onClick={() => setExpanded(false)}>
              {title}
              <span aria-hidden="true">→</span>
            </a>
          ))}
        </nav>
      </header>
      <ConsultationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        trackingSource="site_header"
      />
    </div>
  );
}

export default SiteHeader;
