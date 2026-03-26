import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, FileText, AlertTriangle, Search, ClipboardCheck, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ConsultationDialog } from "@/components/consultation-dialog"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "FSVP Plan - Kế hoạch xác minh nhà cung cấp nước ngoài",
  description:
    "Lập kế hoạch xác minh nhà cung cấp nước ngoài theo 21 CFR 1 Subpart L. Hazard analysis, supplier verification, corrective actions. Tài liệu sẵn sàng cho FDA inspection.",
  keywords: [
    "FSVP Plan",
    "Foreign Supplier Verification Program",
    "hazard analysis",
    "supplier verification",
    "FSMA compliance",
    "FDA inspection",
  ],
  alternates: {
    canonical: "/services/food/fsvp-plan",
  },
}

export default function FSVPPlanPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 md:pb-24 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="inline-block bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                  Bước 6
                </span>
                <span className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium">
                  Thực phẩm
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 text-balance">
                FSVP Plan
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                FSVP Plan là tài liệu chi tiết về quy trình xác minh nhà cung cấp nước ngoài. 
                FDA có thể yêu cầu xuất trình FSVP Plan bất cứ lúc nào trong quá trình inspection.
              </p>
              <div className="flex flex-wrap gap-4">
                <ConsultationDialog
                  trigger={
                    <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                      Lập FSVP Plan <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  }
                />
                <Link href="/services/food/prior-notice">
                  <Button size="lg" variant="outline">
                    Bước tiếp: Prior Notice
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[500px]">
              <Image
                src="/fsvp-plan-development.jpg"
                alt="FSVP Plan Development"
                fill
                className="object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FSVP Plan Components */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              FSVP Plan bao gồm những gì?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Theo 21 CFR 1 Subpart L, FSVP Plan phải có các thành phần sau:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-primary">1. Hazard Analysis</h3>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>- Xác định known/reasonably foreseeable hazards</li>
                <li>- Biological hazards (pathogens, toxins)</li>
                <li>- Chemical hazards (pesticides, allergens, additives)</li>
                <li>- Physical hazards (metal, glass, foreign objects)</li>
                <li>- Đánh giá severity và likelihood</li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <ClipboardCheck className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-primary">2. Supplier Evaluation</h3>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>- Supplier food safety performance history</li>
                <li>- Applicable food safety procedures</li>
                <li>- FDA warning letters, recalls history</li>
                <li>- Third-party audit results</li>
                <li>- Compliance with importing country requirements</li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-primary">3. Verification Activities</h3>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>- On-site audits (frequency, scope)</li>
                <li>- Sampling and testing procedures</li>
                <li>- Review of supplier food safety records</li>
                <li>- Other appropriate verification activities</li>
                <li>- Documentation requirements</li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-primary">4. Corrective Actions</h3>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>- Procedures when hazards not controlled</li>
                <li>- Discontinue use of supplier</li>
                <li>- Take action to ensure compliance</li>
                <li>- Re-evaluate supplier approval</li>
                <li>- Documentation of corrective actions</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Our FSVP Plan Service */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Dịch vụ lập FSVP Plan của Vexim
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid gap-6">
              {[
                {
                  title: "Phân tích mối nguy theo FDA guidelines",
                  description: "Thực hiện hazard analysis theo FDA guidance, xác định hazards cần kiểm soát cho từng loại sản phẩm cụ thể.",
                },
                {
                  title: "Thiết kế verification activities phù hợp",
                  description: "Dựa trên hazard analysis và supplier evaluation, thiết kế các hoạt động xác minh phù hợp: audit frequency, testing requirements.",
                },
                {
                  title: "Chuẩn bị templates và SOPs",
                  description: "Cung cấp templates cho supplier questionnaire, audit checklist, corrective action forms, record keeping.",
                },
                {
                  title: "Training cho FSVP Importer",
                  description: "Training cho staff của FSVP Importer về cách thực hiện verification activities và duy trì records.",
                },
                {
                  title: "Mock FDA inspection",
                  description: "Thực hiện mock inspection để đảm bảo FSVP Plan và records sẵn sàng cho FDA.",
                },
              ].map((item, idx) => (
                <Card key={idx} className="p-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-bold text-primary mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Required Records */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              FSVP Records cần lưu trữ
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              FDA yêu cầu lưu trữ records ít nhất 2 năm. Phải sẵn sàng xuất trình trong vòng 24 giờ khi FDA yêu cầu.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              "Hazard analysis documentation",
              "Supplier evaluation records",
              "Supplier verification results",
              "Audit reports (if applicable)",
              "Testing results (if applicable)",
              "Corrective action records",
              "Re-evaluation documentation",
              "FSVP qualified individual credentials",
              "Import entry records",
            ].map((item, idx) => (
              <Card key={idx} className="p-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-muted-foreground">{item}</span>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            FSVP Plan chuẩn = FDA inspection ready
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Để chúng tôi giúp bạn lập FSVP Plan hoàn chỉnh, 
            sẵn sàng xuất trình bất cứ khi nào FDA yêu cầu.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ConsultationDialog
              trigger={
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Lập FSVP Plan ngay
                </Button>
              }
            />
            <Link href="/services/food/prior-notice">
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                Bước 7: Prior Notice
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
