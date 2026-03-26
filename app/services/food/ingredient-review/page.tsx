import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, AlertTriangle, Search, FileWarning, Shield, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ConsultationDialog } from "@/components/consultation-dialog"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kiểm tra thành phần thực phẩm (Ingredient Review) - FDA Compliance",
  description:
    "Đánh giá thành phần sản phẩm thực phẩm có hợp lệ FDA không. Kiểm tra GRAS status, food additives, color additives theo 21 CFR. Phát hiện sớm ingredients bị cấm tại Mỹ.",
  keywords: [
    "kiểm tra thành phần FDA",
    "ingredient review",
    "GRAS status",
    "food additives",
    "21 CFR",
    "FDA compliance",
    "xuất khẩu thực phẩm Mỹ",
  ],
  alternates: {
    canonical: "/services/food/ingredient-review",
  },
}

export default function IngredientReviewPage() {
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
                  Bước 1
                </span>
                <span className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium">
                  Thực phẩm
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 text-balance">
                Kiểm tra thành phần thực phẩm
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                Trước khi xuất khẩu, bạn cần biết sản phẩm có ingredients nào bị FDA cấm hoặc hạn chế. 
                Chúng tôi review từng thành phần theo 21 CFR, GRAS list và FDA Import Alerts.
              </p>
              <div className="flex flex-wrap gap-4">
                <ConsultationDialog
                  trigger={
                    <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                      Gửi danh sách thành phần <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  }
                />
                <Link href="/services/food/label-compliance">
                  <Button size="lg" variant="outline">
                    Bước tiếp theo: Sửa nhãn
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[500px]">
              <Image
                src="/fda-ingredient-review-food-safety.jpg"
                alt="FDA Ingredient Review"
                fill
                className="object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Important */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-balance">
              Tại sao phải kiểm tra thành phần trước?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              FDA có danh sách dài các chất bị cấm, hạn chế hoặc yêu cầu khai báo đặc biệt. 
              Nhiều ingredients hợp pháp tại Việt Nam lại bị cấm tại Mỹ.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-destructive">
              <AlertTriangle className="w-10 h-10 text-destructive mb-4" />
              <h3 className="text-xl font-bold text-primary mb-3">Tránh bị FDA Detention</h3>
              <p className="text-muted-foreground leading-relaxed">
                Hàng chứa ingredients bị cấm sẽ bị giữ tại cảng, không được phép nhập khẩu. 
                Chi phí lưu kho, phá hủy có thể lên đến hàng chục nghìn USD.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-amber-500">
              <FileWarning className="w-10 h-10 text-amber-500 mb-4" />
              <h3 className="text-xl font-bold text-primary mb-3">Import Alert 99-33</h3>
              <p className="text-muted-foreground leading-relaxed">
                FDA có Import Alert tự động detention cho nhiều loại thực phẩm Việt Nam. 
                Ingredients không rõ ràng sẽ kích hoạt kiểm tra gắt gao.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-primary">
              <Search className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold text-primary mb-3">GRAS Status Check</h3>
              <p className="text-muted-foreground leading-relaxed">
                Chỉ ingredients có GRAS (Generally Recognized As Safe) status hoặc approved food additives 
                mới được phép sử dụng trong thực phẩm tại Mỹ.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-accent">
              <Shield className="w-10 h-10 text-accent mb-4" />
              <h3 className="text-xl font-bold text-primary mb-3">Tiết kiệm thời gian</h3>
              <p className="text-muted-foreground leading-relaxed">
                Phát hiện vấn đề sớm giúp bạn điều chỉnh công thức hoặc thay đổi nhà cung cấp 
                trước khi sản xuất hàng loạt.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* What We Check */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-balance">
              Chúng tôi kiểm tra những gì?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-4">Food Additives (21 CFR 170-189)</h3>
              <ul className="space-y-3">
                {[
                  "Direct food additives (21 CFR 172)",
                  "Indirect food additives - packaging (21 CFR 175-178)",
                  "GRAS substances (21 CFR 182, 184)",
                  "Prior sanctioned substances (21 CFR 181)",
                  "Food contact substances (FCN)",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-4">Color Additives (21 CFR 70-82)</h3>
              <ul className="space-y-3">
                {[
                  "Certified color additives (FD&C colors)",
                  "Colors exempt from certification",
                  "Lakes and other color preparations",
                  "Prohibited colors (21 CFR 81)",
                  "Color additive petitions status",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-4">Prohibited & Restricted Substances</h3>
              <ul className="space-y-3">
                {[
                  "Banned substances (21 CFR 189)",
                  "Carcinogenic substances",
                  "Substances in Import Alerts",
                  "Unapproved new dietary ingredients",
                  "Substances requiring pre-market approval",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-4">Allergen & Special Ingredients</h3>
              <ul className="space-y-3">
                {[
                  "Major food allergens (FALCPA)",
                  "Sesame (new allergen 2023)",
                  "Sulfites declaration requirements",
                  "MSG and hydrolyzed proteins",
                  "Caffeine and stimulants",
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

      {/* Common Issues */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-balance">
              Các vấn đề thường gặp với thực phẩm Việt Nam
            </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {[
              {
                issue: "Phẩm màu không được phép",
                example: "Rhodamine B, Sudan dyes, Tartrazine không certified",
                solution: "Thay bằng certified FD&C colors hoặc natural colors exempt từ certification",
              },
              {
                issue: "Chất bảo quản vượt giới hạn",
                example: "Benzoic acid > 0.1%, Sulfites > 10 ppm (không khai báo)",
                solution: "Giảm hàm lượng hoặc chuyển sang preservatives khác theo 21 CFR 182",
              },
              {
                issue: "Herbs chưa có GRAS",
                example: "Một số thảo dược Việt Nam chưa có trong GRAS list",
                solution: "Nộp GRAS notification hoặc thay bằng ingredients đã approved",
              },
              {
                issue: "Contaminants từ nguyên liệu",
                example: "Lead, Cadmium, Aflatoxins vượt FDA limits",
                solution: "Yêu cầu COA từ nhà cung cấp, kiểm tra source materials",
              },
            ].map((item, idx) => (
              <Card key={idx} className="p-6 border-l-4 border-l-amber-500">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-primary mb-2">{item.issue}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Ví dụ:</strong> {item.example}
                    </p>
                    <p className="text-sm text-accent">
                      <strong>Giải pháp:</strong> {item.solution}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Quy trình kiểm tra thành phần
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                step: "01",
                title: "Gửi danh sách thành phần",
                description: "Bạn gửi ingredient list đầy đủ: tên INCI/common name, hàm lượng %, nguồn gốc (tự nhiên/tổng hợp), nhà cung cấp.",
              },
              {
                step: "02",
                title: "Review theo FDA regulations",
                description: "Chuyên gia đối chiếu từng ingredient với 21 CFR, GRAS list, Import Alerts, EAFUS database. Xác định status: Allowed / Restricted / Prohibited.",
              },
              {
                step: "03",
                title: "Báo cáo chi tiết",
                description: "Nhận báo cáo với: danh sách ingredients OK, ingredients cần thay đổi, giải pháp cụ thể cho từng vấn đề, references đến quy định FDA.",
              },
              {
                step: "04",
                title: "Tư vấn điều chỉnh",
                description: "Hỗ trợ liên hệ nhà cung cấp ingredients thay thế, tư vấn reformulation nếu cần. Chuẩn bị cho bước tiếp theo: Label Compliance.",
              },
            ].map((process, idx) => (
              <Card key={idx} className="p-6">
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-accent rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-white">{process.step}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-2">{process.title}</h3>
                    <p className="text-muted-foreground">{process.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
            Kiểm tra thành phần trước khi quá muộn
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Gửi ingredient list ngay hôm nay. Nhận báo cáo trong 2-3 ngày làm việc.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ConsultationDialog
              trigger={
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Gửi danh sách thành phần
                </Button>
              }
            />
            <Link href="/services/food/label-compliance">
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                Bước 2: Sửa nhãn FDA
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
