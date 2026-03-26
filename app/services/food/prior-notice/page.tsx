import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Clock, Ship, Plane, AlertTriangle, FileText, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ConsultationDialog } from "@/components/consultation-dialog"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Prior Notice - Khai báo trước khi hàng đến Mỹ",
  description:
    "Khai báo trước khi hàng đến cảng Mỹ theo BTA 2002. Nộp Prior Notice qua PNSI ít nhất 15 ngày trước khi hàng cập cảng. Tránh bị detention tại customs.",
  keywords: [
    "Prior Notice",
    "FDA Prior Notice",
    "PNSI",
    "BTA 2002",
    "khai báo FDA",
    "xuất khẩu thực phẩm Mỹ",
    "customs clearance",
  ],
  alternates: {
    canonical: "/services/food/prior-notice",
  },
}

export default function PriorNoticePage() {
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
                  Bước 7
                </span>
                <span className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium">
                  Thực phẩm
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 text-balance">
                Prior Notice
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                Theo Bioterrorism Act 2002, mọi lô hàng thực phẩm phải được khai báo trước (Prior Notice) 
                với FDA trước khi đến cảng Mỹ. Thiếu Prior Notice = Hàng bị từ chối nhập khẩu.
              </p>
              <div className="flex flex-wrap gap-4">
                <ConsultationDialog
                  trigger={
                    <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                      Hỗ trợ khai Prior Notice <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  }
                />
                <Link href="/services/food/fda-renewal">
                  <Button size="lg" variant="outline">
                    Bước tiếp: Gia hạn FDA
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[500px]">
              <Image
                src="/prior-notice-fda-shipment.jpg"
                alt="FDA Prior Notice"
                fill
                className="object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Requirements */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Thời gian nộp Prior Notice
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Prior Notice phải được nộp trước khi hàng đến cảng/sân bay Mỹ. 
              Thời gian tối thiểu phụ thuộc vào phương thức vận chuyển:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="p-6 text-center border-2 border-primary/20">
              <Ship className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-primary mb-2">Đường biển</h3>
              <div className="text-4xl font-bold text-accent mb-2">8 giờ</div>
              <p className="text-muted-foreground text-sm">
                Trước khi tàu đến cảng Mỹ (không trước khi tàu rời cảng gửi quá 15 ngày)
              </p>
            </Card>

            <Card className="p-6 text-center border-2 border-primary/20">
              <Plane className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-primary mb-2">Đường hàng không</h3>
              <div className="text-4xl font-bold text-accent mb-2">4 giờ</div>
              <p className="text-muted-foreground text-sm">
                Trước khi máy bay đến sân bay Mỹ (không trước khi máy bay cất cánh quá 15 ngày)
              </p>
            </Card>

            <Card className="p-6 text-center border-2 border-primary/20">
              <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-primary mb-2">Đường bộ/Rail</h3>
              <div className="text-4xl font-bold text-accent mb-2">2 giờ</div>
              <p className="text-muted-foreground text-sm">
                Trước khi xe/tàu đến cửa khẩu Mỹ (áp dụng cho Canada/Mexico)
              </p>
            </Card>
          </div>

          <div className="mt-8 max-w-3xl mx-auto">
            <Card className="p-6 bg-amber-50 border-amber-200">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-amber-800 mb-2">Lưu ý quan trọng</h3>
                  <p className="text-amber-700">
                    Prior Notice không được nộp quá 15 ngày trước khi hàng đến. 
                    Nếu có thay đổi (số container, ngày đến), phải cập nhật Prior Notice.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Information Required */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Thông tin cần khai trong Prior Notice
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-4">Thông tin sản phẩm</h3>
              <ul className="space-y-3">
                {[
                  "Mô tả sản phẩm (FDA Product Code)",
                  "Số lượng, đơn vị (cases, kg, etc.)",
                  "Brand name / Manufacturer name",
                  "FDA Registration Number của facility",
                  "Country of production",
                  "Lot/batch number (nếu có)",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-4">Thông tin vận chuyển</h3>
              <ul className="space-y-3">
                {[
                  "Phương thức vận chuyển (sea/air/land)",
                  "Ngày dự kiến đến (Anticipated arrival date)",
                  "Cảng/sân bay đến (Port of arrival)",
                  "Carrier name / Vessel name",
                  "Bill of Lading / Airway Bill number",
                  "Container number (nếu có)",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-4">Thông tin đơn vị</h3>
              <ul className="space-y-3">
                {[
                  "Shipper/Exporter (tên, địa chỉ)",
                  "Manufacturer (nếu khác shipper)",
                  "Grower (cho agricultural products)",
                  "FSVP Importer (tên, địa chỉ)",
                  "Consignee/US Owner",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-4">Submitter Information</h3>
              <ul className="space-y-3">
                {[
                  "Tên người nộp (Submitter name)",
                  "Email và phone number",
                  "Mối quan hệ với shipment",
                  "PNSI account (nếu nộp qua PNSI)",
                  "Confirmation number (sau khi nộp)",
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

      {/* How to Submit */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Cách nộp Prior Notice
            </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="p-6 border-l-4 border-l-accent">
              <div className="flex items-start gap-4">
                <FileText className="w-8 h-8 text-accent flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-primary mb-2">1. FDA PNSI (Prior Notice System Interface)</h3>
                  <p className="text-muted-foreground mb-2">
                    Truy cập FDA PNSI tại https://www.access.fda.gov. Đăng ký tài khoản, điền thông tin và submit. 
                    Nhận confirmation number ngay sau khi nộp.
                  </p>
                  <p className="text-sm text-accent">Miễn phí, FDA recommend</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-primary">
              <div className="flex items-start gap-4">
                <FileText className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-primary mb-2">2. ABI/ACE (qua Customs Broker)</h3>
                  <p className="text-muted-foreground mb-2">
                    Prior Notice có thể nộp qua hệ thống ABI/ACE của Customs. 
                    Thường do customs broker thực hiện cùng với entry filing.
                  </p>
                  <p className="text-sm text-accent">Phổ biến cho large importers</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Service */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Dịch vụ hỗ trợ Prior Notice của Vexim
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-4">Gói hỗ trợ</h3>
              <ul className="space-y-3">
                {[
                  "Hướng dẫn chuẩn bị thông tin",
                  "Review Prior Notice trước khi nộp",
                  "Nộp Prior Notice qua PNSI",
                  "Theo dõi status và confirmation",
                  "Cập nhật khi có thay đổi",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-4">Lưu ý</h3>
              <ul className="space-y-3">
                {[
                  "Prior Notice cần nộp cho MỖI lô hàng",
                  "Phải có FDA Registration Number",
                  "Thông tin phải chính xác với B/L",
                  "Cập nhật nếu thay đổi ETA",
                  "Lưu confirmation number",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
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
            Prior Notice đúng = Thông quan nhanh
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Để chúng tôi hỗ trợ bạn khai báo Prior Notice chính xác, 
            đảm bảo lô hàng thông quan suôn sẻ.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ConsultationDialog
              trigger={
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Hỗ trợ Prior Notice
                </Button>
              }
            />
            <Link href="/services/food/fda-renewal">
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                Bước 8: Gia hạn FDA
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
