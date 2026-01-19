import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ServicesGrid } from "@/components/services-grid"
import { WhyChooseUs } from "@/components/why-choose-us"
import { WorkflowSection } from "@/components/workflow-section"
import { Statistics } from "@/components/statistics"
import { FAQSection } from "@/components/faq-section"
import { NewsPreview } from "@/components/news-preview"
import { LegalDisclaimer } from "@/components/legal-disclaimer"
import { Footer } from "@/components/footer"
import { BackToTop } from "@/components/back-to-top"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <ServicesGrid />
      <WhyChooseUs />
      <WorkflowSection />
      <Statistics />
      <FAQSection />
      <NewsPreview />
      <LegalDisclaimer />
      <Footer />
      <BackToTop />
    </main>
  )
}
