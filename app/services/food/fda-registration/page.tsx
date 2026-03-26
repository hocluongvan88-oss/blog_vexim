import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Building2, FileText, Clock, Shield, ArrowRight, AlertTriangle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ConsultationDialog } from "@/components/consultation-dialog"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Đăng ký FDA Food Facility - FSMA Compliance",
  description:
    "Đăng ký cơ sở sản xuất thực phẩm theo FSMA. Hoàn tất FDA Form 3537a trên hệ thống FURLS. Nhận FDA Registration Number trong 3-5 ngày làm việc.",
  keywords: [
    "đăng ký FDA",
    "FDA Food Facility",
    "FDA registration",
    "Form 3537a",
    "FURLS",
    "FSMA",
    "xuất khẩu thực phẩm Mỹ",
  ],
  alternates: {
    canonical: "/services/food/fda-registration",
  },
}

export default function FDARegistrationPage() {
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
                  Bước 3
                </span>
                <span className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium">
                  Thực phẩm
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 text-balance">
                Đăng ký FDA Food Facility
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                Theo FSMA, mọi cơ sở sản xuất, chế biến, đóng gói thực phẩm phải đăng ký FDA 
                trước khi xuất khẩu sang Mỹ. Thiếu FDA Registration Number = Hàng bị giữ tại cảng.
              </p>
              <div className="flex flex-wrap gap-4">
                <ConsultationDialog
                  trigger={
                    <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                      Đăng ký FDA ngay <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  }
                />
                <Link href="/services/food/us-agent">
                  <Button size="lg" variant="outline">
                    Bước tiếp: US Agent
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[500px]">
              <Image
                src="/fda-food-facility-registration.jpg"
                alt="FDA Food Facility Registration"
                fill
                className="object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What is FDA Registration */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                FDA Food Facility Registration là gì?
              </h2>
            </div>

            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="leading-relaxed mb-6">
                Theo Bioterrorism Act 2002 và Food Safety Modernization Act (FSMA), tất cả cơ sở 
                sản xuất, chế biến, đóng gói, hoặc lưu trữ thực phẩm để tiêu thụ tại Hoa Kỳ 
                phải đăng ký với FDA thông qua hệ thống <strong>FDA FURLS (FDA Unified Registration and Listing System)</strong>.
              </p>
              <p className="leading-relaxed mb-6">
                Sau khi đăng ký thành công, cơ sở sẽ nhận được <strong>FDA Registration Number</strong> duy nhất. 
                Số này phải được sử dụng trong mọi lô hàng xuất khẩu sang Mỹ, 
                đặc biệt khi khai báo Prior Notice.
              </p>
            </div>

            <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-amber-800 mb-2">Lưu ý quan trọng</h3>
                  <p className="text-amber-700">
                    FDA Registration phải được gia hạn mỗi 2 năm một lần (trong tháng 10 của năm chẵn: 2024, 2026...). 
                    Nếu không gia hạn đúng hạn, Registration sẽ bị hủy và hàng hóa sẽ bị từ chối nhập khẩu.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Needs */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Ai cần đăng ký FDA Food Facility?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                title: "Nhà máy sản xuất thực phẩm",
                items: ["Thực phẩm chế biến", "Đồ uống", "Đồ hộp", "Thực phẩm đông lạnh"],
                required: true,
              },
              {
                title: "Cơ sở chế biến nông sản",
                items: ["Rau củ quả sấy khô", "Gia vị", "Hạt rang", "Trái cây sấy"],
                required: true,
              },
              {
                title: "Nhà sản xuất thủy sản",
                items: ["Cá đông lạnh", "Tôm chế biến", "Surimi", "Đồ hộp thủy sản"],
                required: true,
              },
              {
                title: "Cơ sở đóng gói",
                items: ["Đóng gói thực phẩm", "Repackaging", "Labeling", "Warehousing"],
                required: true,
              },
              {
                title: "Nhà sản xuất phụ gia",
                items: ["Food additives", "Color additives", "Enzymes", "Preservatives"],
                required: true,
              },
              {
                title: "Thực phẩm chức năng",
                items: ["Dietary supplements", "Vitamins", "Minerals", "Herbal products"],
                required: true,
              },
            ].map((item, idx) => (
              <Card key={idx} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Building2 className="w-8 h-8 text-primary" />
                  {item.required && (
                    <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded">
                      Bắt buộc
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-primary mb-3">{item.title}</h3>
                <ul className="space-y-2">
                  {item.items.map((i, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                      {i}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Quy trình đăng ký FDA Food Facility
            </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                step: "01",
                title: "Thu thập thông tin cơ sở",
                description: "Tên pháp lý công ty, địa chỉ nhà máy, loại sản phẩm, quy trình sản xuất. Thông tin người liên hệ và US Agent.",
                time: "1 ngày",
              },
              {
                step: "02",
                title: "Chuẩn bị FDA Form 3537a",
                description: "Điền đầy đủ thông tin vào FDA Form 3537a: Facility information, Owner/Operator, Product categories, US Agent details.",
                time: "1-2 ngày",
              },
              {
                step: "03",
                title: "Nộp qua hệ thống FURLS",
                description: "Đăng nhập FDA Industry Systems, nộp registration qua FURLS. Hệ thống xác nhận ngay lập tức nếu không có lỗi.",
                time: "1 ngày",
              },
              {
                step: "04",
                title: "Nhận FDA Registration Number",
                description: "FDA cấp Registration Number (11 số). Số này phải được sử dụng trong Prior Notice và có thể verify trên FDA website.",
                time: "Ngay sau nộp",
              },
              {
                step: "05",
                title: "Hướng dẫn sử dụng",
                description: "Hướng dẫn sử dụng Registration Number trong Prior Notice, labeling. Lưu ý deadline gia hạn (tháng 10 năm chẵn).",
                time: "1 ngày",
              },
            ].map((process, idx) => (
              <Card key={idx} className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">{process.step}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                      <h3 className="text-xl font-bold text-primary">{process.title}</h3>
                      <span className="text-sm text-accent font-medium mt-2 md:mt-0 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {process.time}
                      </span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{process.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-lg font-medium text-primary">
              Tổng thời gian: 3-5 ngày làm việc
            </p>
          </div>
        </div>
      </section>

      {/* Documents Needed */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Hồ sơ cần chuẩn bị
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-6">
              <FileText className="w-10 h-10 text-accent mb-4" />
              <h3 className="text-xl font-bold text-primary mb-4">Thông tin cơ sở</h3>
              <ul className="space-y-3">
                {[
                  "Tên pháp lý công ty (tiếng Anh)",
                  "Địa chỉ nhà máy sản xuất",
                  "Số điện thoại & email",
                  "Tên Owner/Operator",
                  "D-U-N-S Number (nếu có)",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6">
              <Shield className="w-10 h-10 text-accent mb-4" />
              <h3 className="text-xl font-bold text-primary mb-4">Thông tin sản phẩm</h3>
              <ul className="space-y-3">
                {[
                  "Danh mục sản phẩm (FDA Product Categories)",
                  "Mô tả quy trình sản xuất",
                  "Thông tin US Agent",
                  "Letter of Authorization (LOA)",
                  "Giấy phép kinh doanh (để xác minh)",
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

      {/* Pricing */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="p-8 border-2 border-accent/20 bg-accent/5">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary mb-4">Chi phí đăng ký FDA Food Facility</h3>
                <p className="text-muted-foreground mb-6">
                  Phí FDA Registration: <strong>Miễn phí</strong> (FDA không thu phí đăng ký)
                  <br />
                  Phí dịch vụ Vexim: Theo báo giá (bao gồm tư vấn, chuẩn bị hồ sơ, nộp đơn, theo dõi)
                </p>
                <ConsultationDialog
                  trigger={
                    <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                      Nhận báo giá chi tiết
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
            Đăng ký FDA Food Facility ngay hôm nay
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Nhận FDA Registration Number trong 3-5 ngày làm việc. 
            Sẵn sàng xuất khẩu sang thị trường Mỹ.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ConsultationDialog
              trigger={
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Bắt đầu đăng ký
                </Button>
              }
            />
            <Link href="/services/food/us-agent">
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                Bước 4: US Agent
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
