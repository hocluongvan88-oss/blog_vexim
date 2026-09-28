import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ServicesGrid } from "@/components/services-grid"
import { WhyChooseUs } from "@/components/why-choose-us"
import { WorkflowSection } from "@/components/workflow-section"
import { Statistics } from "@/components/statistics"
import { NewsPreview } from "@/components/news-preview"
import { Footer } from "@/components/footer"
import { BackToTop } from "@/components/back-to-top"
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
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Vexim Global",
    image: "https://www.veximglobal.com/logo.png",
    "@id": "https://www.veximglobal.com/#service",
    provider: { "@id": "https://www.veximglobal.com/#organization" },
    url: "https://www.veximglobal.com",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <main className="min-h-screen">
        <Header />
        <HeroSection />
        <ServicesGrid />
        <WhyChooseUs />
        <WorkflowSection />
        <Statistics />
        <NewsPreview />
        <Footer />
        <BackToTop />
        {/* Nút "FDA Alert" nổi màu đỏ (góc dưới bên trái) đã được gỡ khỏi trang chủ.
            Component vẫn còn ở components/fda/fda-alert-badge.tsx nếu muốn dùng lại ở trang khác. */}
      </main>
    </>
  )
}
