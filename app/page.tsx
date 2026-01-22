import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ServicesGrid } from "@/components/services-grid"
import { WhyChooseUs } from "@/components/why-choose-us"
import { WorkflowSection } from "@/components/workflow-section"
import { Statistics } from "@/components/statistics"
import { FAQSection } from "@/components/faq-section"
import { NewsPreview } from "@/components/news-preview"
import { Footer } from "@/components/footer"
import { BackToTop } from "@/components/back-to-top"
import { FDAAlertBadge } from "@/components/fda/fda-alert-badge"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Vexim Global - Giải Pháp Xuất Nhập Khẩu Toàn Cầu",
  description:
    "Chuyên gia tư vấn pháp lý xuất nhập khẩu hàng đầu Việt Nam. Dịch vụ đăng ký FDA, GACC, MFDS, CE và giấy phép xuất khẩu quốc tế.",
  alternates: {
    canonical: "/",
  },
}

export default function Home() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Vexim Global",
    alternateName: "Vexim",
    url: "https://vexim.vn",
    logo: "https://vexim.vn/logo.png",
    description:
      "Chuyên gia tư vấn pháp lý xuất nhập khẩu hàng đầu Việt Nam. Dịch vụ đăng ký FDA, GACC, MFDS, CE và giấy phép xuất khẩu quốc tế.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Hồ Chí Minh",
      addressCountry: "VN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      availableLanguage: ["Vietnamese", "English"],
    },
    sameAs: [
      "https://www.facebook.com/veximglobal",
      "https://www.linkedin.com/company/veximglobal",
      "https://zalo.me/veximglobal",
    ],
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Vexim Global",
    url: "https://vexim.vn",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://vexim.vn/blog?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  }

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Vexim Global",
    image: "https://vexim.vn/logo.png",
    "@id": "https://vexim.vn",
    url: "https://vexim.vn",
    telephone: "+84-xxx-xxx-xxx",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Hồ Chí Minh",
      addressCountry: "VN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 10.8231,
      longitude: 106.6297,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:00",
    },
    sameAs: [
      "https://www.facebook.com/veximglobal",
      "https://www.linkedin.com/company/veximglobal",
      "https://zalo.me/veximglobal",
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <main className="min-h-screen">
        <Header />
        <HeroSection />
        <ServicesGrid />
        <WhyChooseUs />
        <WorkflowSection />
        <Statistics />
        <FAQSection />
        <NewsPreview />
        <Footer />
        <BackToTop />
        <FDAAlertBadge />
      </main>
    </>
  )
}
