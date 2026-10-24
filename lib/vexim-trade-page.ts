import { getService, ORGANIZATION_ID, SITE_URL, WEBSITE_ID, serviceId } from "./business-profile"
import { buildServiceNode } from "./schema"
import {
  TRADE,
  TRADE_CATEGORIES,
  TRADE_PROBLEMS,
  TRADE_FEATURES,
  TRADE_VERIFICATION,
  TRADE_COMMITMENTS,
  TRADE_STEPS,
  buildTradeOrganization,
  tradeCategorySummary,
  tradeCategoryHeading,
  tradeOgDescription,
} from "./vexim-trade-content"
import { TRADE_CSS } from "./vexim-trade-styles"
import { TRADE_FONT_CSS, TRADE_PRELOAD_FONT, TRADE_SCRIPT, TRADE_IMAGES, TRADE_MARK } from "./vexim-trade-assets"

export const tradeCanonical = `${SITE_URL}${TRADE.path}`
const escape = (value: unknown) =>
  String(value).replace(
    /[&<>"']/g,
    (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]!,
  )
const paths: Record<string, string> = {
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  specs: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h2m4 0h2M8 12h2m4 0h2M8 16h8"/>',
  shield: '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z"/><path d="m8 12 3 3 5-6"/>',
  compare: '<path d="M4 4h6v16H4zM14 4h6v16h-6zM7 8v8m10-8v8"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z"/>',
  direct: '<path d="m3 3 18 8-8 3-3 7-7-18Zm0 0 10 11"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
}
function icon(name: string, size = 22) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.check}</svg>`
}
export function tradeMark() {
  return `<img class="brand-mark" src="${TRADE_MARK}" width="34" height="29" alt="" aria-hidden="true" decoding="async">`
}
const brand = () =>
  `<a class="brand" href="#top" aria-label="Vexim Trade — về đầu trang">${tradeMark()}<span>Vexim <span class="trade-word">Trade</span></span></a>`
function registration(position: "header" | "hero" | "footer_cta", href: string, extraClass = "") {
  return `<a class="button ${extraClass}" href="${escape(href)}" data-register data-position="${position}">Đăng ký nhà cung cấp${icon("arrow", 17)}</a>`
}
function categoryArt(key: string) {
  const photo = TRADE_IMAGES[key as "cashew" | "pepper" | "spices"]
  if (!photo)
    return `<svg viewBox="0 0 400 260" aria-hidden="true"><path d="M160 185c-13-65 12-105 75-115 2 65-23 103-75 115Z" fill="var(--primary)"/></svg>`
  return `<img src="${photo.src}" srcset="${photo.srcset}" sizes="(max-width: 639px) calc(100vw - 48px), (max-width: 1023px) 45vw, 380px" width="${photo.width}" height="${photo.height}" alt="${escape(photo.alt)}" loading="lazy" decoding="async">`
}
export function buildTradePageSchema() {
  const pageId = `${tradeCanonical}#webpage`
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": ORGANIZATION_ID, name: TRADE.legalName, url: SITE_URL },
      buildTradeOrganization(ORGANIZATION_ID),
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: `${SITE_URL}/`,
        name: "Vexim Global",
        inLanguage: "vi",
        publisher: { "@id": ORGANIZATION_ID },
      },
      {
        "@type": "WebPage",
        "@id": pageId,
        url: tradeCanonical,
        name: TRADE.title,
        description: TRADE.description,
        inLanguage: "vi",
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": serviceId("export-sales") },
        breadcrumb: { "@id": `${tradeCanonical}#breadcrumb` },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${SITE_URL}/trade/og-nha-cung-cap.png`,
          width: 1200,
          height: 630,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${tradeCanonical}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Vexim Global", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Đăng ký nhà cung cấp", item: tradeCanonical },
        ],
      },
      buildServiceNode(getService("export-sales")!),
    ],
  }
}
/** Only allow HTTPS public category links; do not invent category routes. */
function categoryLink(href: string | undefined) {
  if (!href) return undefined
  try {
    const url = new URL(href, TRADE.platform)
    if (url.protocol !== "https:" || url.origin !== TRADE.platform || url.username || url.password)
      return undefined
    return url.href
  } catch {
    return undefined
  }
}
export function tradeRegistrationUrl(params = new URLSearchParams()) {
  const url = new URL(TRADE.register)
  for (const [key, value] of params)
    if (/^utm_[a-z0-9_]{1,40}$/i.test(key) && value.length <= 500) url.searchParams.set(key, value)
  return url.href
}
export function renderTradePage({
  params = new URLSearchParams(),
  noindex = false,
  analytics = false,
}: { params?: URLSearchParams; noindex?: boolean; analytics?: boolean } = {}) {
  const register = tradeRegistrationUrl(params)
  const nav =
    '<a href="#cach-hoat-dong">Cách hoạt động</a><a href="#xac-minh">Xác minh</a><a href="#danh-muc">Danh mục</a><a href="#dang-ky">Đăng ký</a>'
  const schema = JSON.stringify(buildTradePageSchema()).replace(/</g, "\\u003c")
  return `<!DOCTYPE html>
<html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(TRADE.title)}</title>
<meta name="description" content="${escape(TRADE.description)}"><link rel="canonical" href="${tradeCanonical}"><meta name="robots" content="${noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large"}"><meta name="theme-color" content="#1E5A3A">
<meta property="og:type" content="website"><meta property="og:site_name" content="Vexim Trade"><meta property="og:locale" content="vi_VN"><meta property="og:url" content="${tradeCanonical}"><meta property="og:title" content="${escape(TRADE.title)}"><meta property="og:description" content="${escape(tradeOgDescription())}"><meta property="og:image" content="${SITE_URL}/trade/og-nha-cung-cap.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Vexim Trade, danh bạ nhà cung cấp nông sản Việt Nam"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/trade/logo.svg?v=vexim" type="image/svg+xml"><link rel="apple-touch-icon" href="/trade/apple-touch-icon.png?v=vexim"><link rel="preload" href="${TRADE_PRELOAD_FONT}" as="font" type="font/woff2" crossorigin>
<style>${TRADE_FONT_CSS}\n${TRADE_CSS}</style><script type="application/ld+json">${schema}</script><script src="${TRADE_SCRIPT}" data-vercel-analytics="${analytics}" defer></script></head>
<body><a href="#noi-dung-chinh" class="skip">Bỏ qua đến nội dung chính</a>
<header class="site-header"><div class="wrap header-inner">${brand()}<nav class="desktop-nav" aria-label="Điều hướng chính">${nav}</nav>${registration("header", register, "header-register")}<details class="mobile-menu" id="mobile-menu"><summary class="menu-summary" aria-label="Mở menu điều hướng" aria-controls="mobile-nav">${icon("menu")}</summary><nav id="mobile-nav" aria-label="Điều hướng trên điện thoại">${nav}</nav></details></div></header>
<main id="noi-dung-chinh" tabindex="-1">
<section class="hero soft" id="top"><div class="wrap"><div class="hero-grid"><div class="hero-copy"><p class="eyebrow">Danh bạ nhà cung cấp nông sản Việt Nam</p><h1><span class="hero-intro-line">Người mua đang tìm hàng Việt Nam.</span> <br><span class="hero-accent">Hãy để họ tìm thấy doanh nghiệp bạn.</span></h1><p class="hero-description">${TRADE.hero
    .split(/(?<=ngoài,) |(?<=sánh:) /)
    .map((line) => `<span class="hero-copy-line">${escape(line)}</span>`)
    .join(
      " ",
    )}</p><div class="actions">${registration("hero", register)}<a href="#cach-hoat-dong" class="button outline" data-learn>Xem cách hoạt động${icon("arrow", 17)}</a></div><p class="hero-note">${icon("globe", 16)}<span>${escape(tradeCategorySummary())}</span></p></div>
<figure class="hero-aside"><div class="hero-stage"><div class="stage-media"><img class="stage-photo" src="${TRADE_IMAGES.hero.src}" srcset="${TRADE_IMAGES.hero.srcset}" sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1279px) calc(100vw - 48px), 1200px" width="${TRADE_IMAGES.hero.width}" height="${TRADE_IMAGES.hero.height}" alt="${escape(TRADE_IMAGES.hero.alt)}" loading="lazy" decoding="async"></div><p class="stage-caption" aria-hidden="true">Từ sản phẩm tốt.<br>Đến hồ sơ rõ ràng.</p><div class="profile"><div class="profile-top"><span class="brand">${tradeMark()}<span>Vexim Trade</span></span><span class="sample-pill">HỒ SƠ NHÀ CUNG CẤP</span></div><div class="product-art"><span class="product-label">HẠT ĐIỀU NHÂN · VIỆT NAM</span>${categoryArt("cashew")}</div><div class="profile-body"><p class="origin">${icon("globe", 13)}Nhà cung cấp Việt Nam</p><p class="profile-title">Hạt điều nhân trắng</p><p class="company">Doanh nghiệp minh họa · Không phải hồ sơ thật</p><dl class="specs"><div><dt>Phân hạng ví dụ</dt><dd>WW320</dd></div><div><dt>Đóng gói</dt><dd>Theo yêu cầu</dd></div></dl><p class="sample-check">${icon("shield", 15)}Trạng thái xác minh được hiển thị riêng</p><span class="illustrated-rfq">Gửi yêu cầu báo giá${icon("arrow", 15)}</span></div></div></div><figcaption>Hồ sơ minh họa</figcaption><p class="image-disclosure">Ảnh sản phẩm minh họa do AI tạo, không đại diện nhà cung cấp cụ thể.</p></figure></div><div class="hero-bottom"><span>${icon("specs", 16)}Thông tin cụ thể, dễ đối chiếu</span><span>${icon("shield", 16)}Xác minh nhà cung cấp từng bước</span><span>${icon("direct", 16)}Kết nối thẳng với doanh nghiệp</span></div></div></section>
<section aria-labelledby="van-de-title"><div class="wrap"><div class="section-head"><p class="eyebrow">Từ góc nhìn người mua</p><h2 id="van-de-title">Hàng tốt chưa đủ, người mua cần đọc được hồ sơ</h2></div><div class="grid-3">${TRADE_PROBLEMS.map((item, i) => `<article class="problem"><span class="index" aria-hidden="true">0${i + 1} /</span><h3>${escape(item.title)}</h3><p>${escape(item.text)}</p></article>`).join("")}</div></div></section>
<section class="soft" id="cach-hoat-dong" aria-labelledby="hoat-dong-title"><div class="wrap"><div class="section-head"><p class="eyebrow">Một hồ sơ. Một ngôn ngữ chung.</p><h2 id="hoat-dong-title">Hồ sơ trình bày theo cách người mua đọc và so sánh</h2></div><div class="feature-grid">${TRADE_FEATURES.map((item) => `<article class="feature"><div class="icon-box">${icon(item.icon, 24)}</div><h3>${escape(item.title)}</h3><p>${escape(item.text)}</p></article>`).join("")}</div><p class="feature-note">${icon("direct", 18)}<span>Để tìm người mua nước ngoài, hãy bắt đầu bằng thông tin họ cần. Yêu cầu báo giá được gửi trực tiếp đến doanh nghiệp bạn.</span></p></div></section>
<section id="xac-minh" aria-labelledby="xac-minh-title"><div class="wrap verification-layout"><div class="section-head"><p class="eyebrow">Xác minh có phạm vi rõ ràng</p><h2 id="xac-minh-title">Ba bước, mỗi bước duyệt riêng</h2><p>Không gộp mọi thông tin vào một dấu xác nhận chung. Từng bước cho biết nhà cung cấp đã cung cấp loại bằng chứng nào.</p><p class="disclaimer">Vexim Trade xác minh nhà cung cấp, không chứng nhận chất lượng sản phẩm.</p></div><ol class="verification-list">${TRADE_VERIFICATION.map((item) => `<li><div><h3>${escape(item.title)}</h3><p>${escape(item.text)}</p></div></li>`).join("")}</ol></div></section>
<section class="dark" aria-labelledby="cam-ket-title"><div class="wrap commitment-layout"><div class="section-head"><p class="eyebrow">Rõ vai trò, rõ kỳ vọng</p><h2 id="cam-ket-title">Cuộc trao đổi bắt đầu từ chỗ khác</h2><p>Từ quy cách, năng lực cung ứng và thông tin có thể đối chiếu. Để hai doanh nghiệp có cơ sở bắt đầu một cuộc trao đổi thực chất.</p></div><div><p class="commitment-title" id="khong-lam-title">Những việc Vexim Trade không làm</p><ul class="commitments" aria-labelledby="khong-lam-title">${TRADE_COMMITMENTS.map((item) => `<li>${icon("close", 20)}<div><h3>${escape(item.title)}</h3><p>${escape(item.text)}</p></div></li>`).join("")}</ul></div></div></section>
<section id="danh-muc" aria-labelledby="danh-muc-title"><div class="wrap"><div class="section-head"><p class="eyebrow">Bắt đầu từ thế mạnh Việt Nam</p><h2 id="danh-muc-title">${escape(tradeCategoryHeading())}</h2><p>Giai đoạn đầu tập trung vào ${TRADE_CATEGORIES.length === 3 ? "ba" : TRADE_CATEGORIES.length} nhóm nông sản, để thông tin từng ngành được chuẩn bị rõ ràng ngay từ đầu.</p></div><div class="grid-3">${TRADE_CATEGORIES.map(
    (category) => {
      const href = categoryLink(category.href)
      return `<article class="category"><div class="category-art">${categoryArt(category.key)}</div><div class="category-body"><h3><span class="category-kicker">${escape(category.exportTitle)}</span>${href ? `<a href="${escape(href)}" data-category="${escape(category.key)}">${escape(category.name)}</a>` : escape(category.name)}</h3><p class="description">${escape(category.text)}</p><p class="category-specs">${escape(category.specs)}</p></div></article>`
    },
  ).join(
    "",
  )}</div><p class="category-footnote">Nếu doanh nghiệp thuộc các danh mục đang mở, bạn có thể gửi đăng ký để Vexim Trade xem xét hồ sơ. Không có cam kết về đơn hàng hoặc thứ hạng tìm kiếm.</p></div></section>
<section class="soft" id="dang-ky" aria-labelledby="dang-ky-title"><div class="wrap"><div class="section-head"><p class="eyebrow">Đến lượt doanh nghiệp bạn</p><h2 id="dang-ky-title">Bắt đầu trong bốn bước</h2></div><ol class="steps">${TRADE_STEPS.map((item, i) => `<li><span class="step-number" aria-hidden="true">0${i + 1}</span><h3>${escape(item.title)}</h3><p>${escape(item.text)}</p></li>`).join("")}</ol><div class="closing"><div><p class="closing-title">Để người mua bắt đầu từ một hồ sơ rõ ràng.</p><p class="small">Giới thiệu doanh nghiệp bạn trên Vexim Trade.</p></div>${registration("footer_cta", register)}</div></div></section>
</main><footer class="site-footer"><div class="wrap"><div class="footer-grid"><div>${brand()}<p class="footer-brand-note">Danh bạ nhà cung cấp nông sản Việt Nam dành cho người mua nước ngoài.</p></div><address><strong>${escape(TRADE.legalName)}</strong>${escape(TRADE.address.streetAddress)}, ${escape(TRADE.address.addressLocality)}, ${escape(TRADE.address.addressRegion)}<br><a href="tel:${TRADE.phone}">${TRADE.phone}</a><br><a href="mailto:${TRADE.email}">${TRADE.email}</a></address><nav class="footer-links" aria-label="Liên kết pháp lý"><a href="${SITE_URL}">veximglobal.com${icon("arrow", 14)}</a>${TRADE.privacy ? `<a href="${escape(TRADE.privacy)}">Chính sách bảo mật</a>` : '<span title="Chờ đường dẫn công khai được xác nhận">Chính sách bảo mật</span>'}${TRADE.terms ? `<a href="${escape(TRADE.terms)}">Điều khoản sử dụng</a>` : '<span title="Chờ đường dẫn công khai được xác nhận">Điều khoản sử dụng</span>'}</nav></div><div class="footer-bottom"><span>© 2026 Vexim Trade · Thuộc Vexim Global</span><span>Thông tin rõ ràng. Kết nối trực tiếp.</span></div></div></footer></body></html>`
}
