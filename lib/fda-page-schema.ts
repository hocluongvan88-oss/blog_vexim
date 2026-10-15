import { getService, SITE_URL, serviceId } from "./business-profile"
import { buildBreadcrumbSchema, buildServiceNode, buildWebPageSchema } from "./schema"
import { FDA_FAQS, FDA_PAGE } from "./fda-page-content"

/** Page-only graph. The shared Organization/LocalBusiness is emitted by layout. */
export function buildFdaPageSchema() {
  const url = `${SITE_URL}${FDA_PAGE.path}`
  const service = getService("fda-registration")
  if (!service) throw new Error("FDA service is missing from SERVICE_CATALOG")
  const { "@context": _pageContext, ...page } = buildWebPageSchema({
    path: FDA_PAGE.path,
    name: FDA_PAGE.title,
    description: FDA_PAGE.description,
  })
  const { "@context": _breadcrumbContext, ...breadcrumb } = buildBreadcrumbSchema([
    { name: "Trang chủ", path: "/" },
    { name: "Đăng ký FDA", path: FDA_PAGE.path },
  ])
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        ...page,
        about: { "@id": serviceId(service.key) },
        mainEntity: { "@id": serviceId(service.key) },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        primaryImageOfPage: { "@id": `${url}#primaryimage` },
      },
      buildServiceNode(service),
      { ...breadcrumb, "@id": `${url}#breadcrumb` },
      {
        "@type": "ImageObject",
        "@id": `${url}#primaryimage`,
        url: `${SITE_URL}${FDA_PAGE.image}`,
        contentUrl: `${SITE_URL}${FDA_PAGE.image}`,
        width: 1200,
        height: 630,
        caption: FDA_PAGE.imageAlt,
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        url: `${url}#faq`,
        inLanguage: "vi-VN",
        isPartOf: { "@id": `${url}#webpage` },
        about: { "@id": serviceId(service.key) },
        // Exactly the same questions/answers as the visible server-rendered FAQ.
        mainEntity: FDA_FAQS.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  }
}
