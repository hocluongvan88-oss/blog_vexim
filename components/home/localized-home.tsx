import { LocalizedHub } from "./localized-hub"
import type { HomeLocale } from "@/lib/locale-routes"

/** Giữ tên export cũ cho /page.tsx và /en/page.tsx; nội dung là trang tổng quan. */
export function LocalizedHome({ locale }: { locale: HomeLocale }) {
  return <LocalizedHub locale={locale} />
}
