import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, AlertTriangle, Users, FileSearch, Shield, ArrowRight, Scale } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ConsultationDialog } from "@/components/consultation-dialog"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "FSVP Importer - Foreign Supplier Verification Program",
  description:
    "Tìm và chỉ định đơn vị nhập khẩu đủ điều kiện FSVP (Foreign Supplier Verification Program). Bắt buộc theo FSMA cho mọi lô hàng thực phẩm vào Mỹ.",
  keywords: [
    "FSVP Importer",
    "Foreign Supplier Verification Program",
    "FSMA",
    "importer of record",
    "FDA importer",
    "xuất khẩu thực phẩm Mỹ",
  ],
  alternates: {
    canonical: "/services/food/fsvp-importer",
  },
}

export default function FSVPImporterPage() {
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
                  Bước 5
                </span>
                <span className="inline-block bg-destructive/10 text-destructive px-4 py-2 rounded-full text-sm font-medium">
                  Quan trọng
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 text-balance">
                FSVP Importer
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                Theo FSMA, mọi lô hàng thực phẩm nhập khẩu vào Mỹ phải có FSVP Importer - 
                đơn vị nhập khẩu chịu trách nhiệm xác minh nhà cung cấp nước ngoài đáp ứng 
                tiêu chuẩn an toàn thực phẩm của FDA.
              </p>
              <div className="flex flex-wrap gap-4">
                <ConsultationDialog
                  trigger={
                    <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                      Tìm FSVP Importer <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  }
                />
                <Link href="/services/food/fsvp-plan">
                  <Button size="lg" variant="outline">
                    Bước tiếp: FSVP Plan
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[500px]">
              <Image
                src="/fsvp-importer-compliance.jpg"
                alt="FSVP Importer"
                fill
                className="object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What is FSVP */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                FSVP Importer là gì?
              </h2>
            </div>

            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="leading-relaxed mb-6">
                <strong>FSVP (Foreign Supplier Verification Program)</strong> là quy định theo FSMA (21 CFR 1 Subpart L) 
                yêu cầu nhà nhập khẩu Mỹ phải xác minh rằng thực phẩm nhập khẩu được sản xuất theo cách 
                đáp ứng các yêu cầu an toàn thực phẩm của Hoa Kỳ.
              </p>
              <p className="leading-relaxed mb-6">
                <strong>FSVP Importer</strong> là đơn vị nhập khẩu (Importer of Record) chịu trách nhiệm 
                thực hiện các hoạt động xác minh nhà cung cấp nước ngoài, bao gồm: hazard analysis, 
                supplier verification, corrective actions.
              </p>
            </div>

            <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-amber-800 mb-2">Không có FSVP Importer = Hàng bị giữ</h3>
                  <p className="text-amber-700">
                    FDA có thể từ chối nhập khẩu nếu không có FSVP Importer được chỉ định hợp lệ. 
                    Phạt vi phạm FSVP có thể lên đến $10,000/vi phạm.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who is FSVP Importer */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Ai có thể làm FSVP Importer?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="p-6 border-2 border-accent/30">
              <Users className="w-10 h-10 text-accent mb-4" />
              <h3 className="text-xl font-bold text-primary mb-3">US Importer of Record</h3>
              <p className="text-muted-foreground mb-4">
                Công ty Mỹ đứng tên trên customs entry. Đây là lựa chọn phổ biến nhất.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Có facility tại Mỹ</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Có FSVP qualified individual</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Duy trì FSVP records</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <Scale className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold text-primary mb-3">US Agent (nếu owner là nước ngoài)</h3>
              <p className="text-muted-foreground mb-4">
                Nếu owner của hàng tại thời điểm nhập là công ty nước ngoài, US Agent có thể làm FSVP Importer.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Có trụ sở tại Mỹ</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Được ủy quyền bằng văn bản</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <FileSearch className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold text-primary mb-3">Third-party FSVP Agent</h3>
              <p className="text-muted-foreground mb-4">
                Đơn vị thứ 3 chuyên cung cấp dịch vụ FSVP compliance cho nhiều nhà xuất khẩu.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Chuyên môn FSVP</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Có PCQI certified</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Sẵn sàng FDA inspection</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* FSVP Importer Responsibilities */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Trách nhiệm của FSVP Importer
            </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {[
              {
                title: "Hazard Analysis",
                description: "Phân tích mối nguy (biological, chemical, physical) cho từng loại thực phẩm nhập khẩu.",
              },
              {
                title: "Supplier Evaluation",
                description: "Đánh giá nhà cung cấp nước ngoài dựa trên performance, procedures, compliance history.",
              },
              {
                title: "Supplier Verification Activities",
                description: "Thực hiện các hoạt động xác minh: on-site audits, sampling & testing, review supplier food safety records.",
              },
              {
                title: "Corrective Actions",
                description: "Thực hiện hành động khắc phục khi phát hiện vấn đề với nhà cung cấp hoặc sản phẩm.",
              },
              {
                title: "Record Keeping",
                description: "Lưu trữ FSVP records ít nhất 2 năm. Sẵn sàng xuất trình khi FDA inspection.",
              },
              {
                title: "Re-evaluation",
                description: "Đánh giá lại nhà cung cấp ít nhất 3 năm/lần hoặc khi có thay đổi đáng kể.",
              },
            ].map((item, idx) => (
              <Card key={idx} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                    <span className="text-accent font-bold">{idx + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Service */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Vexim hỗ trợ tìm FSVP Importer
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-4">Nếu bạn chưa có Importer tại Mỹ</h3>
              <ul className="space-y-3">
                {[
                  "Giới thiệu US importers/distributors uy tín",
                  "Kết nối với broker networks",
                  "Hỗ trợ đàm phán hợp đồng",
                  "Đảm bảo importer có FSVP capability",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-4">Nếu bạn đã có Importer</h3>
              <ul className="space-y-3">
                {[
                  "Đánh giá FSVP readiness của importer",
                  "Hỗ trợ importer lập FSVP Plan",
                  "Cung cấp supplier documentation",
                  "Training FSVP requirements",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Cần tìm FSVP Importer?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Chúng tôi kết nối bạn với importers uy tín tại Mỹ, 
            có đầy đủ năng lực thực hiện FSVP compliance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ConsultationDialog
              trigger={
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Tư vấn FSVP Importer
                </Button>
              }
            />
            <Link href="/services/food/fsvp-plan">
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                Bước 6: FSVP Plan
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
