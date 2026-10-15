import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ServicesGrid } from "@/components/services-grid"
import { WhyChooseUs } from "@/components/why-choose-us"
import { WorkflowSection } from "@/components/workflow-section"
import { Statistics } from "@/components/statistics"
import { TrustSources } from "@/components/trust-sources"
import { NewsPreview } from "@/components/news-preview"
import { Footer } from "@/components/footer"
import { BackToTop } from "@/components/back-to-top"
import { JsonLd } from "@/components/json-ld"
import { buildHomePageSchema } from "@/lib/schema"
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL_WITH_SLASH } from "@/lib/business-profile"
import type { Metadata } from "next"

/**
 * Metadata trang chủ.
 *
 * Title/description lấy từ `lib/business-profile.ts` — cùng chuỗi với `app/layout.tsx`
 * (title.default, og:description, twitter:description) nên không thể lệch nhau.
 *
 * Hai thay đổi so với bản cũ:
 *  1. Title/description cũ ("Giải Pháp Xuất Nhập Khẩu Toàn Cầu", liệt kê GACC/MFDS/CE)
 *     không chứa từ khóa nào mà trang thực sự phục vụ, và nhắc dịch vụ trang chủ
 *     không có. Nay nhắm đúng cụm có nhu cầu tìm kiếm: đăng ký FDA, US Agent,
 *     xuất khẩu sang Mỹ.
 *  2. Canonical và og:url dùng domain www; Next chuẩn hóa URL trang chủ về
 *     origin không có dấu "/" cuối, khớp sitemap.xml.
 */
export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: [
    "đăng ký FDA",
    "dịch vụ đăng ký FDA",
    "US Agent FDA",
    "FSVP",
    "MoCRA",
    "xuất khẩu sang Mỹ",
    "tư vấn xuất khẩu Mỹ",
    "thành lập LLC tại Mỹ",
  ],
  alternates: {
    canonical: SITE_URL_WITH_SLASH,
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL_WITH_SLASH,
  },
  twitter: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
}

export default function Home() {
  return (
    <>
      {/* Site-wide business graph is emitted once by the root layout. */}
      <JsonLd id="home-page-schema" data={buildHomePageSchema()} />
      <main className="min-h-screen">
        <Header />
        <HeroSection />
        <ServicesGrid />
        <WhyChooseUs />
        <WorkflowSection />
        <Statistics />
        {/* Căn cứ pháp lý (link ra fda.gov) — trang chủ trước đây có 0 link ra ngoài */}
        <TrustSources />
        <NewsPreview />
        <Footer />
        <BackToTop />
        {/* Nút "FDA Alert" nổi màu đỏ (góc dưới bên trái) đã được gỡ khỏi trang chủ.
            Component vẫn còn ở components/fda/fda-alert-badge.tsx nếu muốn dùng lại ở trang khác. */}
      </main>
    </>
  )
}
