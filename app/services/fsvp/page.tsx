import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Users, FileText, AlertTriangle, Clock, ArrowRight, Shield, Building2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ConsultationDialog } from "@/components/consultation-dialog"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "FSVP Compliance - Foreign Supplier Verification Program | Vexim Global",
  description:
    "Dịch vụ tuân thủ FSVP theo FSMA cho thực phẩm nhập khẩu vào Hoa Kỳ. FSVP Importer, FSVP Plan, Hazard Analysis, Supplier Verification.",
  keywords: [
    "FSVP",
    "Foreign Supplier Verification Program",
    "FSMA",
    "FSVP Importer",
    "FSVP Plan",
    "FDA importer",
    "food import USA",
  ],
  alternates: {
    canonical: "/services/fsvp",
  },
  openGraph: {
    title: "FSVP Compliance - Foreign Supplier Verification Program | Vexim Global",
    description:
      "Dịch vụ tuân thủ FSVP theo FSMA cho thực phẩm nhập khẩu vào Hoa Kỳ.",
    url: "/services/fsvp",
    type: "website",
  },
}

export default function FSVPMainPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 md:pb-24 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
                Thực phẩm - Food Safety
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 text-balance">
                FSVP Importer & Plan
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                Foreign Supplier Verification Program (FSVP) là yêu cầu bắt buộc theo FSMA cho mọi lô hàng thực phẩm 
                nhập khẩu vào Hoa Kỳ. Vexim hỗ trợ doanh nghiệp Việt Nam đáp ứng đầy đủ yêu cầu FSVP từ chỉ định 
                Importer đến lập FSVP Plan hoàn chỉnh.
              </p>
              <div className="flex flex-wrap gap-4">
                <ConsultationDialog
                  trigger={
                    <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                      Tư vấn FSVP <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  }
                />
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[500px]">
              <Image
                src="/fsvp-compliance-food-import.jpg"
                alt="FSVP Compliance"
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
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-balance">
              FSVP là gì?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Foreign Supplier Verification Program (21 CFR 1 Subpart L) là quy định theo FSMA yêu cầu 
              nhà nhập khẩu Hoa Kỳ xác minh rằng thực phẩm từ nhà cung cấp nước ngoài được sản xuất 
              theo tiêu chuẩn an toàn thực phẩm của FDA.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">FSVP Importer</h3>
              <p className="text-muted-foreground leading-relaxed">
                Đơn vị nhập khẩu tại Hoa Kỳ chịu trách nhiệm thực hiện và duy trì FSVP cho từng nhà cung cấp nước ngoài.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Hazard Analysis</h3>
              <p className="text-muted-foreground leading-relaxed">
                Phân tích mối nguy (biological, chemical, physical) cho từng loại thực phẩm nhập khẩu.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Supplier Verification</h3>
              <p className="text-muted-foreground leading-relaxed">
                Hoạt động xác minh nhà cung cấp: on-site audits, testing, review food safety records.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Record Keeping</h3>
              <p className="text-muted-foreground leading-relaxed">
                Lưu trữ records ít nhất 2 năm, sẵn sàng xuất trình trong vòng 24 giờ khi FDA yêu cầu.
              </p>
            </Card>
          </div>

          <div className="mt-12 max-w-4xl mx-auto">
            <Card className="p-6 bg-amber-50 border border-amber-200">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-amber-800 mb-2">Không có FSVP = Hàng bị từ chối nhập khẩu</h3>
                  <p className="text-amber-700">
                    FDA có quyền từ chối nhập khẩu nếu không có FSVP Importer hợp lệ hoặc FSVP Plan không đầy đủ. 
                    Phạt vi phạm FSVP có thể lên đến $10,000/vi phạm và hàng bị giữ tại cảng.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Two Main Services */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-balance">
              Dịch vụ FSVP của Vexim
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Chúng tôi hỗ trợ toàn bộ quy trình FSVP từ tìm Importer đến lập Plan hoàn chỉnh
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="p-8 hover:shadow-xl transition-all hover:-translate-y-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-primary rounded-lg flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary">FSVP Importer</h3>
                  <p className="text-muted-foreground">Chỉ định đơn vị nhập khẩu</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Tìm và chỉ định đơn vị nhập khẩu đủ điều kiện FSVP tại Hoa Kỳ. Nếu bạn chưa có importer, 
                chúng tôi kết nối với US importers/distributors uy tín. Nếu đã có, chúng tôi đánh giá 
                FSVP readiness của họ.
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  "Giới thiệu US importers uy tín",
                  "Đánh giá FSVP capability của importer",
                  "Hỗ trợ đàm phán hợp đồng",
                  "Training FSVP requirements",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/services/food/fsvp-importer">
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Tìm hiểu FSVP Importer <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-all hover:-translate-y-2 border-2 border-accent">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-accent rounded-lg flex items-center justify-center">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary">FSVP Plan</h3>
                  <p className="text-muted-foreground">Lập kế hoạch xác minh</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Lập FSVP Plan hoàn chỉnh theo 21 CFR 1 Subpart L. Bao gồm Hazard Analysis, Supplier Evaluation, 
                Verification Activities, Corrective Actions. Sẵn sàng xuất trình khi FDA inspection.
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  "Hazard Analysis theo FDA guidelines",
                  "Thiết kế Verification Activities",
                  "Chuẩn bị templates và SOPs",
                  "Mock FDA inspection",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/services/food/fsvp-plan">
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  Tìm hiểu FSVP Plan <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Who Needs FSVP */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-balance">
              Ai cần tuân thủ FSVP?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-primary mb-3">Bắt buộc FSVP</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>Tất cả thực phẩm nhập khẩu vào Mỹ</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>Thực phẩm chức năng (dietary supplements)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>Thực phẩm đóng gói sẵn</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>Nguyên liệu thực phẩm</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold text-primary mb-3">Miễn trừ FSVP</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span>Juice theo 21 CFR 120</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span>Seafood theo 21 CFR 123</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span>LACF theo 21 CFR 113</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span>Thực phẩm cho nghiên cứu</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold text-primary mb-3">Modified FSVP</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>Very small importers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>Từ qualified facilities</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span>Từ certain small suppliers</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-balance">
              Thời gian triển khai FSVP
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="grid gap-4">
              <Card className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-primary">FSVP Importer Setup</h3>
                  <p className="text-muted-foreground text-sm">2-4 tuần (nếu đã có importer) | 4-8 tuần (tìm importer mới)</p>
                </div>
              </Card>

              <Card className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-primary">FSVP Plan Development</h3>
                  <p className="text-muted-foreground text-sm">2-4 tuần (tùy số lượng sản phẩm và độ phức tạp)</p>
                </div>
              </Card>

              <Card className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-primary">Mock Inspection & Training</h3>
                  <p className="text-muted-foreground text-sm">1-2 tuần</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
            Sẵn sàng tuân thủ FSVP?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Liên hệ ngay để được tư vấn chi tiết về FSVP Importer và FSVP Plan. 
            Vexim đảm bảo doanh nghiệp bạn sẵn sàng cho FDA inspection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ConsultationDialog
              trigger={
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Đăng ký tư vấn FSVP
                </Button>
              }
            />
            <Link href="/services/llc-ein">
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                Thành lập LLC & EIN
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
