import { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { GACCAssessmentForm } from "@/components/gacc-assessment-form"
import { BackToTop } from "@/components/back-to-top"
import { CheckCircle2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Đánh giá hồ sơ GACC - Vexim Global",
  description:
    "Form đánh giá hồ sơ đăng ký GACC cho sản phẩm thực phẩm xuất khẩu sang Trung Quốc. Đánh giá miễn phí bởi chuyên gia Vexim Global.",
  alternates: {
    canonical: "https://vexim.vn/services/gacc/assessment",
  },
}

export default function GACCAssessmentPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 pt-20">
        {/* Hero Section */}
        <section className="py-16 px-4 bg-primary text-primary-foreground">
          <div className="container max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Form đánh giá hồ sơ GACC</h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-6 text-pretty">
              Đánh giá miễn phí khả năng đăng ký GACC cho sản phẩm thực phẩm của bạn
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>Chuyên gia tư vấn</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>Đánh giá miễn phí</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>Phản hồi trong 24h</span>
              </div>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <GACCAssessmentForm />
          </div>
        </section>

        {/* Information Section */}
        <section className="py-12 px-4 bg-muted/30">
          <div className="container max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-primary mb-4">Về đánh giá GACC</h2>
              <p className="text-muted-foreground leading-relaxed">
                GACC (General Administration of Customs of China) là Tổng cục Hải quan Trung Quốc, cơ quan quản lý việc xuất nhập
                khẩu hàng hóa vào Trung Quốc. Để xuất khẩu thực phẩm sang Trung Quốc, doanh nghiệp cần đăng ký và được GACC chấp
                thuận.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Form đánh giá này giúp bạn tự kiểm tra khả năng đáp ứng các yêu cầu của GACC. Chuyên gia của Vexim Global sẽ đánh
                giá và tư vấn chi tiết về những điểm cần cải thiện để hồ sơ của bạn có cơ hội thành công cao nhất.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
