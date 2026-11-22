"use client";

import { SiteHeader } from "@/components/site-header";
import type { HomeLocale, HomePageKind } from "@/lib/locale-routes";

/**
 * Trang chủ dùng chung `SiteHeader` với mọi trang khác — chỉ khác là có thêm
 * bộ chuyển ngữ VI/EN vì trang chủ là trang duy nhất có bản dịch đầy đủ.
 * Giữ tên export để các component landing hiện có không phải đổi import.
 */
export function HomeHeader({
  locale,
  page,
}: {
  locale: HomeLocale;
  page: HomePageKind;
}) {
  return <SiteHeader locale={locale} page={page} />;
}
