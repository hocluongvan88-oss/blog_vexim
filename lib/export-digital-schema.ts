import { getService, serviceId, SITE_URL } from "./business-profile"
import { buildBreadcrumbSchema, buildServiceNode, buildWebPageSchema } from "./schema"
import { EXPORT_DIGITAL, EXPORT_FAQS } from "./export-digital-content"

export function buildExportDigitalSchema() {
  const url = `${SITE_URL}${EXPORT_DIGITAL.path}`
  const service = buildServiceNode(getService("export-digital")!)
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
        mainEntity: { "@id": serviceId("export-digital") },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        hasPart: { "@id": `${url}#faq` },
      },
      service,
      { ...breadcrumb, "@id": `${url}#breadcrumb` },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        url: `${url}#cau-hoi`,
        inLanguage: "vi-VN",
        isPartOf: { "@id": `${url}#webpage` },
        about: { "@id": serviceId("export-digital") },
        mainEntity: EXPORT_FAQS.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  }
}
