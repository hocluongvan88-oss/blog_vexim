import { SITE_URL } from "./business-profile"

/**
 * Ngôn ngữ mặc định của site là tiếng Việt: nội dung tiếng Việt nằm ở URL gốc
 * (`/`, `/privacy`), bản tiếng Anh nằm dưới tiền tố `/en` (`/en`, `/en/privacy`).
 *
 * Vì vậy `x-default` trỏ về bản tiếng Việt — khách quốc tế dùng trình duyệt
 * tiếng Anh sẽ được middleware chuyển sang `/en` (xem `middleware.ts`).
 *
 * Chỉ những cặp ngôn ngữ đã xuất bản và được biên tập kỹ mới thuộc danh sách
 * này. Thêm cặp mới sau khi bản dịch đã được duyệt; không bao giờ trỏ tới một
 * bản dịch giả.
 */
export const LOCALIZED_PATHS = {
  home: { vi: "/", en: "/en" },
  privacy: { vi: "/privacy", en: "/en/privacy" },
} as const

export type HomeLocale = "en" | "vi"
export type HomePageKind = keyof typeof LOCALIZED_PATHS

/** Ngôn ngữ mặc định khi khách không có tín hiệu gì khác. */
export const DEFAULT_LOCALE: HomeLocale = "vi"

export function homePath(locale: HomeLocale) { return LOCALIZED_PATHS.home[locale] }
export function privacyPath(locale: HomeLocale) { return LOCALIZED_PATHS.privacy[locale] }
export function languageUrls(page: HomePageKind) {
  const toUrl = (path: string) => path === "/" ? SITE_URL : `${SITE_URL}${path}`
  const vi = toUrl(LOCALIZED_PATHS[page].vi)
  return { vi, en: toUrl(LOCALIZED_PATHS[page].en), "x-default": vi }
}
