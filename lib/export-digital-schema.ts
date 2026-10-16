import { ORGANIZATION_ID, SITE_URL } from "./business-profile"
import { buildBreadcrumbSchema, buildWebPageSchema } from "./schema"
import { EXPORT_DIGITAL, EXPORT_FAQS } from "./export-digital-content"

export function buildExportDigitalSchema() {
  const url = `${SITE_URL}${EXPORT_DIGITAL.path}`
  const { "@context": _context, ...page } = buildWebPageSchema({
    path: EXPORT_DIGITAL.path,
    name: EXPORT_DIGITAL.title,
    description: EXPORT_DIGITAL.description,
  })
  const { "@context": _breadcrumbContext, ...breadcrumb } = buildBreadcrumbSchema([
    { name: "Trang chủ", path: "/" },
    { name: "Vexim Export Digital", path: EXPORT_DIGITAL.path },
  ])
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        ...page,
        mainEntity: { "@id": `${url}#service` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        hasPart: { "@id": `${url}#faq` },
      },
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: "Vexim Export Digital",
        serviceType: "Website xuất khẩu và hiện diện số cho doanh nghiệp Việt Nam",
        description: EXPORT_DIGITAL.description,
        url,
        provider: { "@id": ORGANIZATION_ID },
        audience: { "@type": "BusinessAudience", audienceType: "Doanh nghiệp Việt Nam đang hoặc sắp xuất khẩu" },
        areaServed: { "@type": "Country", name: "Việt Nam", identifier: "VN" },
      },
      { ...breadcrumb, "@id": `${url}#breadcrumb` },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        url: `${url}#cau-hoi`,
        inLanguage: "vi-VN",
        isPartOf: { "@id": `${url}#webpage` },
        about: { "@id": `${url}#service` },
        mainEntity: EXPORT_FAQS.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  }
}
