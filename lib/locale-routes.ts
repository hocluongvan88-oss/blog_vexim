import { SITE_URL } from "./business-profile"

/** Only published, editorially reviewed locale pairs belong here. Add a service
 * pair after its English copy is reviewed; never link to a fake translation. */
export const LOCALIZED_PATHS = {
  home: { en: "/", vi: "/vi" },
  privacy: { en: "/privacy", vi: "/vi/privacy" },
} as const

export type HomeLocale = "en" | "vi"
export type HomePageKind = keyof typeof LOCALIZED_PATHS

export function homePath(locale: HomeLocale) { return LOCALIZED_PATHS.home[locale] }
export function privacyPath(locale: HomeLocale) { return LOCALIZED_PATHS.privacy[locale] }
export function languageUrls(page: HomePageKind) {
  const toUrl = (path: string) => path === "/" ? SITE_URL : `${SITE_URL}${path}`
  const en = toUrl(LOCALIZED_PATHS[page].en)
  return { en, vi: toUrl(LOCALIZED_PATHS[page].vi), "x-default": en }
}
