/**
 * Shared schema builders. Business facts come from business-profile.ts.
 * JSON-LD blocks on the same page can link through matching absolute @ids;
 * they do not need to be in the same <script>. Never duplicate business entities.
 */
import {
  ADDRESS,
  AREA_SERVED,
  AVAILABLE_LANGUAGES,
  BRAND_SLOGAN,
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
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
  WEBSITE_ID,
  serviceId,
  type ServiceCatalogItem,
} from "./business-profile"

import { TRADE, TRADE_CATEGORIES, buildTradeOrganization } from "./vexim-trade-content"

const HOME_PAGE_ID = `${SITE_URL}/#webpage`
const HOME_IMAGE_ID = `${SITE_URL}/#primaryimage`

export const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: ADDRESS.streetAddress,
  addressLocality: ADDRESS.addressLocality,
  addressCountry: ADDRESS.addressCountry,
} as const

export const logoImage = {
  "@type": "ImageObject",
  "@id": LOGO_ID,
  url: LOGO.url,
  contentUrl: LOGO.url,
  width: LOGO.width,
  height: LOGO.height,
  caption: ORGANIZATION_NAME,
} as const

const servedCountries = () => AREA_SERVED.map((code) => ({
  "@type": "Country",
  name: code === "VN" ? "Việt Nam" : "Hoa Kỳ",
  identifier: code,
}))

export const openingHoursSpecification = OPENING_HOURS.map((slot) => ({
  "@type": "OpeningHoursSpecification",
  dayOfWeek: slot.days.map((day) => `https://schema.org/${day}`),
  opens: slot.opens,
  closes: slot.closes,
}))

export const contactPoint = [{
  "@type": "ContactPoint",
  contactType: "customer support",
  telephone: PHONE_E164,
  email: PUBLIC_EMAIL,
  areaServed: [...AREA_SERVED],
  availableLanguage: [...AVAILABLE_LANGUAGES],
}]

/**
 * One business entity, not separate Organization and business nodes.
 * LocalBusiness is a subtype of Organization and Place, so opening hours are valid.
 * Do not use deprecated ProfessionalService or invent a price range/coordinates.
 */
export function buildSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LocalBusiness"],
        "@id": ORGANIZATION_ID,
        name: ORGANIZATION_NAME,
        alternateName: "Vexim",
        url: SITE_URL,
        slogan: BRAND_SLOGAN,
        logo: { "@id": LOGO_ID },
        image: { "@id": LOGO_ID },
        description: ORGANIZATION_DESCRIPTION,
        telephone: PHONE_E164,
        email: PUBLIC_EMAIL,
        address: postalAddress,
        openingHoursSpecification,
        contactPoint,
        areaServed: servedCountries(),
        sameAs: SAME_AS,
      },
      logoImage,
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

/** Umbrella service of the homepage, not the business that provides it. */
export function buildHomeServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": HOME_SERVICE_ID,
    name: "Dịch vụ đăng ký FDA & tư vấn pháp lý xuất khẩu sang Mỹ",
    serviceType: "Regulatory Compliance & Market Access",
    description: "Tư vấn và hỗ trợ doanh nghiệp Việt Nam về FDA, DUNS, MoCRA, US Agent, FSVP, thành lập LLC & EIN và hồ sơ nhà cung cấp nông sản trên Vexim Trade.",
    url: SITE_URL,
    provider: { "@id": ORGANIZATION_ID },
    mainEntityOfPage: { "@id": HOME_PAGE_ID },
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Doanh nghiệp Việt Nam xuất khẩu sang Mỹ",
    },
    areaServed: servedCountries(),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      "@id": `${SITE_URL}/#offer-catalog`,
      name: "Dịch vụ của Vexim Global",
      itemListElement: SERVICE_CATALOG.map((service) => ({
        "@type": "Offer",
        url: `${SITE_URL}${service.path}`,
        itemOffered: buildServiceNode(service),
      })),
    },
  }
}

/** Same service identity in the homepage catalog and its landing page. */
export function buildServiceNode(service: ServiceCatalogItem) {
  return {
    "@type": "Service",
    "@id": serviceId(service.key),
    name: service.name,
    serviceType: service.serviceType,
    description: service.description,
    url: `${SITE_URL}${service.path}`,
    provider: service.key === "export-sales" ? { "@id": TRADE.organizationId } : { "@id": ORGANIZATION_ID },
    areaServed: service.key === "export-sales" ? "VN" : servedCountries(),
    ...(service.key === "export-sales" ? {
      audience: { "@type": "BusinessAudience", audienceType: "Doanh nghiệp sản xuất, xuất khẩu nông sản Việt Nam" },
      hasOfferCatalog: { "@type": "OfferCatalog", name: "Danh mục đang mở", itemListElement: TRADE_CATEGORIES.map(category => ({ "@type": "OfferCatalog", name: category.name })) },
      potentialAction: { "@type": "RegisterAction", target: TRADE.register, name: "Đăng ký nhà cung cấp" },
    } : {}),
  }
}

/** A standalone JSON-LD script must declare its own context. */
export function buildServiceSchema(service: ServiceCatalogItem) {
  return { "@context": "https://schema.org", ...buildServiceNode(service) }
}

/** Page-only graph; Organization/Logo/WebSite are emitted once by the root layout. */
export function buildHomePageSchema() {
  const { "@context": _context, ...service } = buildHomeServiceSchema()
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        ...buildWebPageSchema({ path: "/", name: SITE_TITLE, description: SITE_DESCRIPTION }),
        "@context": undefined,
        "@id": HOME_PAGE_ID,
        mainEntity: { "@id": HOME_SERVICE_ID },
        primaryImageOfPage: { "@id": HOME_IMAGE_ID },
      },
      {
        "@type": "ImageObject",
        "@id": HOME_IMAGE_ID,
        url: OG_IMAGE.url,
        contentUrl: OG_IMAGE.url,
        width: OG_IMAGE.width,
        height: OG_IMAGE.height,
      },
      buildTradeOrganization(ORGANIZATION_ID),
      service,
    ],
  }
}

/** Standalone export of exactly the two graphs emitted on the homepage. */
export function buildCompleteHomeSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [...buildSiteSchema()["@graph"], ...buildHomePageSchema()["@graph"]],
  }
}

export function buildWebPageSchema(options: {
  path: string
  name: string
  description?: string
  inLanguage?: string
}) {
  const url = options.path === "/" ? SITE_URL : `${SITE_URL}${options.path}`
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": url === SITE_URL ? HOME_PAGE_ID : `${url}#webpage`,
    url,
    name: options.name,
    description: options.description,
    inLanguage: options.inLanguage ?? "vi-VN",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
  }
}

export function buildBreadcrumbSchema(items: Array<{ name: string; path: string }>): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path === "/" ? SITE_URL : `${SITE_URL}${item.path}`,
    })),
  }
}

export const ogImage = OG_IMAGE
