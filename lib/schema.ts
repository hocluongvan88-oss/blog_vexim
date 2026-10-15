/**
 * Bộ sinh JSON-LD dùng chung — NGUỒN DUY NHẤT cho structured data của site.
 *
 * Vì sao cần: trước đây mỗi trang tự viết schema bằng tay, dẫn tới ba nhóm lỗi:
 *
 *  1. Khai SAI sự thật — telephone "+84-xxx-xxx-xxx", địa chỉ "Hồ Chí Minh" cho
 *     một doanh nghiệp ở Hà Nội, logo 512x512 trong khi file là 824x543.
 *  2. Đồ thị đứt gãy — trang chủ phát node ProfessionalService với
 *     `provider: { "@id": ".../#organization" }`, nhưng node Organization ở layout
 *     không có `@graph` nên reference không được nối trong cùng một document.
 *  3. Trùng lặp thực thể — `hasOfferCatalog` ở trang chủ liệt kê dịch vụ, còn
 *     landing page lại phát một node Service KHÔNG có `@id`, nên Google không biết
 *     hai node đó là một.
 *
 * Nguyên tắc áp dụng ở đây:
 *  - Mọi node có tên đều có `@id` cố định → tham chiếu được giữa các trang.
 *  - Dữ liệu NAP lấy từ `lib/business-profile.ts`, không chép tay.
 *  - Một `JsonLd` component duy nhất để render, tránh mỗi nơi một kiểu.
 */

import {
  ADDRESS,
  AREA_SERVED,
  AVAILABLE_LANGUAGES,
  HOME_SERVICE_ID,
  LOGO,
  LOGO_ID,
  OG_IMAGE,
  OPENING_HOURS,
  ORGANIZATION_DESCRIPTION,
  ORGANIZATION_ID,
  ORGANIZATION_NAME,
  PHONE_E164,
  PUBLIC_EMAIL,
  SAME_AS,
  SERVICE_CATALOG,
  SITE_URL,
  WEBSITE_ID,
  serviceId,
  type ServiceCatalogItem,
} from "./business-profile"

/* ------------------------------------------------------------------ */
/* Các khối dùng lại                                                   */
/* ------------------------------------------------------------------ */

/** Địa chỉ dạng schema.org PostalAddress. */
export const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: ADDRESS.streetAddress,
  addressLocality: ADDRESS.addressLocality,
  addressCountry: ADDRESS.addressCountry,
} as const

/** Logo dạng ImageObject với kích thước THẬT của file (đo từ public/logo.png). */
export const logoImage = {
  "@type": "ImageObject",
  "@id": LOGO_ID,
  url: LOGO.url,
  width: LOGO.width,
  height: LOGO.height,
  caption: ORGANIZATION_NAME,
} as const

/**
 * Giờ mở cửa. Trả về MẢNG nhiều khoảng (T2–T6 và Thứ 7 có giờ khác nhau).
 *
 * Bản cũ chỉ khai một khoảng T2–T6 08:00–17:00 — vừa sai giờ đóng (footer ghi 18:00)
 * vừa thiếu Thứ 7, nên Google Maps/hiểu biết về doanh nghiệp bị lệch.
 */
export const openingHoursSpecification = OPENING_HOURS.map((slot) => ({
  "@type": "OpeningHoursSpecification",
  dayOfWeek: [...slot.days],
  opens: slot.opens,
  closes: slot.closes,
}))

/** Điểm liên hệ — bản cũ chỉ có contactType mà không có số/email nào để liên hệ. */
export const contactPoint = [
  {
    "@type": "ContactPoint",
    contactType: "customer service",
    telephone: PHONE_E164,
    email: PUBLIC_EMAIL,
    areaServed: [...AREA_SERVED],
    availableLanguage: [...AVAILABLE_LANGUAGES],
  },
  {
    "@type": "ContactPoint",
    contactType: "sales",
    telephone: PHONE_E164,
    email: PUBLIC_EMAIL,
    areaServed: [...AREA_SERVED],
    availableLanguage: [...AVAILABLE_LANGUAGES],
  },
]

/* ------------------------------------------------------------------ */
/* Node cấp site (đặt ở app/layout.tsx — có mặt trên MỌI trang)        */
/* ------------------------------------------------------------------ */

/**
 * Node Organization duy nhất của toàn site.
 *
 * `@graph` được dùng để node WebSite và node Logo sống CÙNG một document với
 * Organization — nhờ vậy các tham chiếu `{"@id": ".../#organization"}` từ
 * BlogPosting.publisher hay ProfessionalService.provider phân giải được thật.
 */
export function buildSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: ORGANIZATION_NAME,
        alternateName: "Vexim",
        url: SITE_URL,
        logo: { "@id": LOGO_ID },
        image: { "@id": LOGO_ID },
        description: ORGANIZATION_DESCRIPTION,
        address: postalAddress,
        contactPoint,
        areaServed: AREA_SERVED.map((code) => ({ "@type": "Country", name: code })),
        sameAs: SAME_AS,
      },
      {
        "@type": "ImageObject",
        "@id": LOGO_ID,
        url: LOGO.url,
        width: LOGO.width,
        height: LOGO.height,
        contentUrl: LOGO.url,
        caption: ORGANIZATION_NAME,
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: ORGANIZATION_NAME,
        url: SITE_URL,
        inLanguage: "vi-VN",
        publisher: { "@id": ORGANIZATION_ID },
      },
    ],
  }
}

/* ------------------------------------------------------------------ */
/* Node cấp trang                                                      */
/* ------------------------------------------------------------------ */

/**
 * Node ProfessionalService cho TRANG CHỦ, kèm `hasOfferCatalog` liệt kê 6 dịch vụ.
 *
 * Mỗi Service trong catalog mang `@id` ổn định — landing page của dịch vụ đó phát
 * ra node cùng `@id` nên Google gộp thành một thực thể.
 */
export function buildHomeServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": HOME_SERVICE_ID,
    name: ORGANIZATION_NAME,
    description: ORGANIZATION_DESCRIPTION,
    url: SITE_URL,
    image: { "@id": LOGO_ID },
    logo: { "@id": LOGO_ID },
    provider: { "@id": ORGANIZATION_ID },
    // `telephone` dạng E.164. Bản cũ là "+84-xxx-xxx-xxx" — placeholder lộ ra production.
    telephone: PHONE_E164,
    email: PUBLIC_EMAIL,
    address: postalAddress,
    areaServed: AREA_SERVED.map((code) => ({ "@type": "Country", name: code })),
    openingHoursSpecification,
    priceRange: "$$",
    sameAs: SAME_AS,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Dịch vụ xuất khẩu sang thị trường Hoa Kỳ",
      itemListElement: SERVICE_CATALOG.map((service) => ({
        "@type": "Offer",
        itemOffered: buildServiceNode(service),
      })),
    },
  }
}

/**
 * Node `Service` cho MỘT dịch vụ.
 * Dùng ở hai nơi với cùng `@id`: catalog trang chủ và landing page của dịch vụ.
 */
export function buildServiceNode(service: ServiceCatalogItem) {
  return {
    "@type": "Service",
    "@id": serviceId(service.key),
    name: service.name,
    serviceType: service.serviceType,
    description: service.description,
    url: `${SITE_URL}${service.path}`,
    provider: { "@id": ORGANIZATION_ID },
    areaServed: AREA_SERVED.map((code) => ({ "@type": "Country", name: code })),
    availableLanguage: [...AVAILABLE_LANGUAGES],
  }
}

/** Node `WebPage` — khai `isPartOf`/`about` để trang con nối về node WebSite. */
export function buildWebPageSchema(options: {
  path: string
  name: string
  description?: string
  inLanguage?: string
}) {
  const url = `${SITE_URL}${options.path}`
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": url,
    url,
    name: options.name,
    description: options.description,
    inLanguage: options.inLanguage ?? "vi-VN",
    isPartOf: { "@id": WEBSITE_ID },
    publisher: { "@id": ORGANIZATION_ID },
    primaryImageOfPage: { "@id": LOGO_ID },
  }
}

/**
 * BreadcrumbList.
 * `items` nhận cặp `[tên, path]`; mục cuối là trang hiện tại.
 * URL được sinh tuyệt đối vì Google yêu cầu `item` là URL đầy đủ.
 */
export function buildBreadcrumbSchema(
  items: Array<{ name: string; path: string }>,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}

/** Ảnh OG dùng chung. */
export const ogImage = OG_IMAGE
