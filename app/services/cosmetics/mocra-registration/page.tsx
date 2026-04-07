import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Building2, Package, AlertTriangle, Clock, FileText, ArrowRight, Shield } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ConsultationDialog } from "@/components/consultation-dialog"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Đăng ký MoCRA - Tuân thủ Đạo luật Hiện đại hóa Mỹ phẩm | Vexim Global",
  description:
    "Dịch vụ đăng ký MoCRA với FDA theo Modernization of Cosmetics Regulation Act 2022. Facility Registration, Product Listing, Responsible Person cho mỹ phẩm xuất khẩu Hoa Kỳ.",
  keywords: [
    "MoCRA",
    "Modernization of Cosmetics Regulation Act",
    "FDA cosmetics",
    "Cosmetic Facility Registration",
    "Cosmetic Product Listing",
    "Cosmetics Direct",
    "Responsible Person",
    "mỹ phẩm xuất khẩu Mỹ",
  ],
  alternates: {
    canonical: "/services/cosmetics/mocra-registration",
  },
  openGraph: {
    title: "Đăng ký MoCRA - Tuân thủ Đạo luật Hiện đại hóa Mỹ phẩm | Vexim Global",
    description:
      "Dịch vụ đăng ký MoCRA với FDA theo Modernization of Cosmetics Regulation Act 2022 cho mỹ phẩm xuất khẩu Hoa Kỳ.",
    url: "/services/cosmetics/mocra-registration",
    type: "website",
  },
}

export default function MoCRARegistrationPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 md:pb-24 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
                Mỹ phẩm - Cosmetics
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 text-balance">
                Tuân thủ MoCRA
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                Đạo luật MoCRA (Modernization of Cosmetics Regulation Act) năm 2022 đánh dấu bước ngoặt trong 
                quản lý mỹ phẩm tại Hoa Kỳ. Tất cả cơ sở sản xuất và sản phẩm mỹ phẩm bắt buộc phải đăng ký 
                với FDA thông qua hệ thống Cosmetics Direct.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 text-accent" />
                  <span>Thời gian xử lý: 3-5 ngày</span>
                </div>
              </div>
              <ConsultationDialog
                trigger={
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    Đăng ký MoCRA ngay <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                }
              />
            </div>
            <div className="relative h-[400px] lg:h-[500px]">
              <Image
                src="/mocra-cosmetics-fda-registration.jpg"
                alt="MoCRA FDA Registration"
                fill
                className="object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What is MoCRA */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-balance">
              MoCRA là gì?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Đạo luật Hiện đại hóa Quy định Mỹ phẩm - được ký ngày 29/12/2022, là bản cập nhật lớn nhất 
              về quy định mỹ phẩm tại Hoa Kỳ kể từ năm 1938.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="p-8 border-l-4 border-accent bg-accent/5">
              <h3 className="text-xl font-bold text-primary mb-4">Các yêu cầu chính của MoCRA:</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      <strong>Facility Registration:</strong> Đăng ký cơ sở sản xuất/đóng gói với FDA
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      <strong>Product Listing:</strong> Khai báo danh sách tất cả sản phẩm mỹ phẩm
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      <strong>Responsible Person:</strong> Chỉ định người chịu trách nhiệm tại Hoa Kỳ
                    </span>
                  </li>
                </ul>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      <strong>Adverse Event Reporting:</strong> Báo cáo sự cố nghiêm trọng trong 15 ngày
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      <strong>Safety Substantiation:</strong> Chứng minh an toàn sản phẩm
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      <strong>GMP Compliance:</strong> Tuân thủ quy trình sản xuất tốt
                    </span>
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* MoCRA Components */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-balance">
              Ba trụ cột của MoCRA Compliance
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-primary rounded-lg flex items-center justify-center mb-4">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Facility Registration</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Mọi cơ sở sản xuất, đóng gói mỹ phẩm phải đăng ký với FDA thông qua Cosmetics Direct. 
                Bao gồm cả nhà máy tại Việt Nam xuất khẩu sang Mỹ.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Đăng ký qua Cosmetics Direct</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Gia hạn 2 năm/lần</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Cập nhật khi có thay đổi</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-2 border-accent">
              <div className="w-14 h-14 bg-accent rounded-lg flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Product Listing</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Responsible Person phải khai báo từng sản phẩm mỹ phẩm được marketing tại Hoa Kỳ, 
                bao gồm thành phần theo định dạng INCI.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Listing trong 120 ngày kể từ khi marketing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Cập nhật hàng năm</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Danh sách thành phần INCI</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-primary rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Responsible Person</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Bắt buộc phải có Responsible Person với địa chỉ tại Hoa Kỳ. Đây là người/công ty 
                chịu trách nhiệm pháp lý về sản phẩm.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Địa chỉ tại Hoa Kỳ</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Nhận thông báo từ FDA</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Báo cáo Adverse Events</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-balance">
              Quy trình đăng ký MoCRA cùng Vexim
            </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                step: "01",
                title: "Đánh giá sản phẩm & Phân loại",
                description:
                  "Xác định sản phẩm là Cosmetic hay OTC Drug (thuốc không kê đơn). Sản phẩm có drug claims như sunscreen, anti-dandruff, anti-acne được phân loại là OTC Drug, không phải Cosmetic thuần túy.",
                duration: "1-2 ngày",
              },
              {
                step: "02",
                title: "Chuẩn bị hồ sơ Facility",
                description:
                  "Thu thập thông tin cơ sở sản xuất: địa chỉ, loại hoạt động (manufacturing, packing, labeling), danh sách sản phẩm được sản xuất tại facility.",
                duration: "2-3 ngày",
              },
              {
                step: "03",
                title: "Chuẩn bị Product Listing",
                description:
                  "Lập danh sách chi tiết từng sản phẩm: tên sản phẩm (tiếng Anh), product category, danh sách thành phần theo INCI nomenclature, thông tin Responsible Person.",
                duration: "3-5 ngày",
              },
              {
                step: "04",
                title: "Đăng ký qua Cosmetics Direct",
                description:
                  "Nộp hồ sơ Facility Registration và Product Listing qua hệ thống Cosmetics Direct của FDA. Theo dõi trạng thái xử lý, phản hồi yêu cầu bổ sung.",
                duration: "1-2 tuần",
              },
              {
                step: "05",
                title: "Xác nhận & Duy trì Compliance",
                description:
                  "Nhận xác nhận đăng ký từ FDA. Hướng dẫn cập nhật khi có sản phẩm mới, gia hạn định kỳ, và quy trình báo cáo Adverse Events.",
                duration: "Trong suốt hợp tác",
              },
            ].map((process, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">{process.step}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                      <h3 className="text-xl font-bold text-primary">{process.title}</h3>
                      <span className="text-sm text-accent font-medium mt-2 md:mt-0">{process.duration}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{process.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 border-l-4 border-yellow-500 bg-yellow-50/50">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-yellow-600 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-primary mb-4">Lưu ý quan trọng về MoCRA</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-yellow-600">1.</span>
                      <span>
                        <strong>Cosmetic vs OTC Drug:</strong> Sản phẩm có therapeutic claims (chống nắng, trị mụn, 
                        chống gàu) được FDA xếp loại OTC Drug, yêu cầu NDC và Drug Listing thay vì MoCRA.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-yellow-600">2.</span>
                      <span>
                        <strong>Deadline quan trọng:</strong> Facility Registration phải gia hạn 2 năm/lần (tháng 7). 
                        Product Listing phải cập nhật hàng năm và khi ra sản phẩm mới.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-yellow-600">3.</span>
                      <span>
                        <strong>Adverse Event Reporting:</strong> Serious adverse events phải báo cáo FDA trong 15 
                        business days. Responsible Person chịu trách nhiệm này.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-yellow-600">4.</span>
                      <span>
                        <strong>Small Business Exemption:</strong> Doanh nghiệp nhỏ (dưới $1M doanh thu hàng năm) 
                        được miễn một số yêu cầu, nhưng vẫn phải đăng ký Facility và Listing.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Required Documents */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-balance">
              Tài liệu cần chuẩn bị
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-6 h-6 text-accent" />
                <h3 className="text-xl font-bold text-primary">Facility Registration</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Tên và địa chỉ cơ sở sản xuất",
                  "Loại hoạt động (manufacturing, packing, labeling)",
                  "Thông tin liên hệ (email, điện thoại)",
                  "Danh sách product categories sản xuất",
                  "DUNS Number (nếu có)",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-accent" />
                <h3 className="text-xl font-bold text-primary">Product Listing</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Tên sản phẩm (brand name, tiếng Anh)",
                  "Product category theo FDA classification",
                  "Danh sách thành phần theo INCI nomenclature",
                  "Thông tin Responsible Person tại Mỹ",
                  "UPC/Barcode (nếu có)",
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

      {/* Related Services */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-balance">
              Dịch vụ MoCRA liên quan
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Link href="/services/cosmetics/responsible-person">
              <Card className="p-6 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full">
                <h3 className="text-lg font-bold text-primary mb-2">Responsible Person</h3>
                <p className="text-sm text-muted-foreground">
                  Dịch vụ Responsible Person tại Mỹ cho doanh nghiệp mỹ phẩm Việt Nam
                </p>
              </Card>
            </Link>
            <Link href="/services/cosmetics/product-listing">
              <Card className="p-6 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full">
                <h3 className="text-lg font-bold text-primary mb-2">Product Listing</h3>
                <p className="text-sm text-muted-foreground">
                  Khai báo và cập nhật Product Listing cho sản phẩm mỹ phẩm
                </p>
              </Card>
            </Link>
            <Link href="/services/cosmetics/label-compliance">
              <Card className="p-6 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full">
                <h3 className="text-lg font-bold text-primary mb-2">Label Compliance</h3>
                <p className="text-sm text-muted-foreground">
                  Kiểm tra nhãn mỹ phẩm theo quy định FDA và FTC
                </p>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
            Sẵn sàng tuân thủ MoCRA?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Liên hệ ngay để được tư vấn chi tiết về đăng ký MoCRA. Vexim hỗ trợ toàn bộ quy trình từ 
            Facility Registration đến Product Listing và Responsible Person.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ConsultationDialog
              trigger={
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Đăng ký tư vấn MoCRA
                </Button>
              }
            />
            <Link href="/services/cosmetics/responsible-person">
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                Tìm hiểu Responsible Person
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
