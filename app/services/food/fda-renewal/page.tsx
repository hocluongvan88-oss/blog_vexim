import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Calendar, AlertTriangle, Bell, RefreshCw, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ConsultationDialog } from "@/components/consultation-dialog"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Gia hạn FDA hàng năm - Biennial Registration Renewal",
  description:
    "FDA Food Facility phải gia hạn trong tháng 10 năm chẵn (2024, 2026...). Chúng tôi nhắc nhở và hỗ trợ gia hạn đúng hạn, tránh bị hủy registration.",
  keywords: [
    "gia hạn FDA",
    "FDA renewal",
    "biennial registration",
    "FDA Food Facility renewal",
    "FURLS renewal",
    "xuất khẩu thực phẩm Mỹ",
  ],
  alternates: {
    canonical: "/services/food/fda-renewal",
  },
}

export default function FDARenewalPage() {
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
                  Bước 8
                </span>
                <span className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium">
                  Thực phẩm
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 text-balance">
                Gia hạn FDA hàng năm
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                FDA Food Facility Registration phải được gia hạn (renew) mỗi 2 năm một lần trong tháng 10 
                của năm chẵn. Không gia hạn đúng hạn = Registration bị hủy = Không thể xuất khẩu.
              </p>
              <div className="flex flex-wrap gap-4">
                <ConsultationDialog
                  trigger={
                    <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                      Đăng ký nhắc nhở gia hạn <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  }
                />
                <Link href="/services">
                  <Button size="lg" variant="outline">
                    Quay lại danh sách dịch vụ
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[500px]">
              <Image
                src="/fda-renewal-biennial.jpg"
                alt="FDA Biennial Renewal"
                fill
                className="object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Important Dates */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Thời hạn gia hạn FDA
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="p-8 border-2 border-accent/30 bg-accent/5">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <Calendar className="w-20 h-20 text-accent" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-4">
                    Gia hạn trong tháng 10 năm chẵn
                  </h3>
                  <div className="space-y-2 text-muted-foreground">
                    <p>- Năm 2024: 1/10/2024 - 31/12/2024</p>
                    <p>- Năm 2026: 1/10/2026 - 31/12/2026</p>
                    <p>- Năm 2028: 1/10/2028 - 31/12/2028</p>
                  </div>
                  <p className="mt-4 text-accent font-medium">
                    Gia hạn qua hệ thống FDA FURLS - MIỄN PHÍ
                  </p>
                </div>
              </div>
            </Card>

            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <Card className="p-6 border-l-4 border-l-destructive">
                <AlertTriangle className="w-10 h-10 text-destructive mb-4" />
                <h3 className="text-lg font-bold text-primary mb-2">Nếu không gia hạn đúng hạn</h3>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li>- FDA Registration bị hủy tự động</li>
                  <li>- Phải đăng ký lại từ đầu</li>
                  <li>- Hàng hóa bị từ chối nhập khẩu</li>
                  <li>- Prior Notice bị reject</li>
                </ul>
              </Card>

              <Card className="p-6 border-l-4 border-l-accent">
                <Bell className="w-10 h-10 text-accent mb-4" />
                <h3 className="text-lg font-bold text-primary mb-2">Dịch vụ nhắc nhở của Vexim</h3>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li>- Nhắc nhở 30 ngày trước deadline</li>
                  <li>- Hỗ trợ gia hạn online</li>
                  <li>- Kiểm tra thông tin cập nhật</li>
                  <li>- Xác nhận gia hạn thành công</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Renewal Process */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Quy trình gia hạn FDA
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                step: "01",
                title: "Đăng nhập FDA FURLS",
                description: "Truy cập https://www.access.fda.gov, đăng nhập bằng tài khoản đã đăng ký.",
              },
              {
                step: "02",
                title: "Xác nhận/Cập nhật thông tin",
                description: "Review thông tin facility: địa chỉ, owner/operator, US Agent. Cập nhật nếu có thay đổi.",
              },
              {
                step: "03",
                title: "Submit Renewal",
                description: "Click Renew Registration. Hệ thống confirm ngay lập tức nếu không có lỗi.",
              },
              {
                step: "04",
                title: "Lưu confirmation",
                description: "Lưu lại confirmation email/screenshot. Registration Number giữ nguyên.",
              },
            ].map((process, idx) => (
              <Card key={idx} className="p-6">
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-white">{process.step}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-2">{process.title}</h3>
                    <p className="text-muted-foreground">{process.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What to Update */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Thông tin cần kiểm tra khi gia hạn
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                title: "Facility Information",
                items: ["Tên facility", "Địa chỉ nhà máy", "Phone/Email", "D-U-N-S Number"],
              },
              {
                title: "Owner/Operator",
                items: ["Tên owner/operator", "Địa chỉ", "Contact information", "Role (owner/operator/both)"],
              },
              {
                title: "US Agent",
                items: ["Tên US Agent", "Địa chỉ tại Mỹ", "Phone Mỹ", "Email"],
              },
              {
                title: "Product Categories",
                items: ["Thêm category mới", "Bỏ category không còn sản xuất", "Cập nhật mô tả"],
              },
              {
                title: "Additional Info",
                items: ["Seasonal facility status", "Trade names", "Parent company info"],
              },
              {
                title: "Emergency Contact",
                items: ["24-hour emergency contact", "Phone number", "Email address"],
              },
            ].map((section, idx) => (
              <Card key={idx} className="p-6">
                <RefreshCw className="w-8 h-8 text-accent mb-4" />
                <h3 className="text-lg font-bold text-primary mb-3">{section.title}</h3>
                <ul className="space-y-2">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Service Package */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="p-8 border-2 border-primary/20">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-primary mb-4">
                  Gói dịch vụ Gia hạn FDA của Vexim
                </h3>
                <p className="text-muted-foreground">
                  Đăng ký một lần, yên tâm xuất khẩu suốt đời
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-primary mb-3">Bao gồm:</h4>
                  <ul className="space-y-2">
                    {[
                      "Nhắc nhở 30 ngày trước deadline",
                      "Kiểm tra thông tin cần cập nhật",
                      "Thực hiện gia hạn online",
                      "Xác nhận gia hạn thành công",
                      "Lưu trữ records",
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-primary mb-3">Bonus:</h4>
                  <ul className="space-y-2">
                    {[
                      "Cập nhật US Agent nếu cần",
                      "Tư vấn thay đổi regulations",
                      "Priority support",
                      "Miễn phí cho khách hàng US Agent",
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 text-center">
                <ConsultationDialog
                  trigger={
                    <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                      Đăng ký dịch vụ gia hạn
                    </Button>
                  }
                />
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Hoàn tất quy trình FDA!
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Bạn đã hoàn thành tất cả 8 bước để xuất khẩu thực phẩm sang Mỹ. 
            Liên hệ chúng tôi để được hỗ trợ toàn diện.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ConsultationDialog
              trigger={
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Tư vấn trọn gói
                </Button>
              }
            />
            <Link href="/services">
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                Xem tất cả dịch vụ
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
