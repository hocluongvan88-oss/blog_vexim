import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, AlertTriangle, FileText, Scale, Tag, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ConsultationDialog } from "@/components/consultation-dialog"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sửa nhãn FDA (Label Compliance) - 21 CFR 101",
  description:
    "Kiểm tra và chỉnh sửa nhãn thực phẩm theo chuẩn FDA 21 CFR 101. Nutrition Facts, ingredient list, allergen declaration, net weight. Đảm bảo thông quan 100%.",
  keywords: [
    "sửa nhãn FDA",
    "label compliance",
    "21 CFR 101",
    "nutrition facts",
    "FDA labeling",
    "food label requirements",
    "xuất khẩu thực phẩm Mỹ",
  ],
  alternates: {
    canonical: "/services/food/label-compliance",
  },
}

export default function LabelCompliancePage() {
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
                  Bước 2
                </span>
                <span className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium">
                  Thực phẩm
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 text-balance">
                Sửa nhãn FDA theo chuẩn 21 CFR
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                Nhãn mác là lý do hàng đầu khiến thực phẩm bị FDA từ chối. 
                Chúng tôi kiểm tra và chỉnh sửa nhãn theo đúng chuẩn 21 CFR 101 để đảm bảo thông quan.
              </p>
              <div className="flex flex-wrap gap-4">
                <ConsultationDialog
                  trigger={
                    <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                      Gửi mẫu nhãn để kiểm tra <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  }
                />
                <Link href="/services/food/fda-registration">
                  <Button size="lg" variant="outline">
                    Bước tiếp: Đăng ký FDA
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[500px]">
              <Image
                src="/fda-label-compliance-food-nutrition.jpg"
                alt="FDA Label Compliance"
                fill
                className="object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-12 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">70%</div>
              <div className="text-white/80">Hàng bị từ chối do lỗi nhãn</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">15+</div>
              <div className="text-white/80">Thông tin bắt buộc trên nhãn</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">99.5%</div>
              <div className="text-white/80">Tỷ lệ thông quan sau sửa</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">2 ngày</div>
              <div className="text-white/80">Thời gian review nhãn</div>
            </div>
          </div>
        </div>
      </section>

      {/* Label Requirements */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-balance">
              Các yếu tố bắt buộc trên nhãn FDA
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Theo 21 CFR 101, nhãn thực phẩm phải có đầy đủ các thông tin sau:
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <FileText className="w-10 h-10 text-accent mb-4" />
              <h3 className="text-xl font-bold text-primary mb-3">Nutrition Facts Panel</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>- Serving size (theo RACC)</li>
                <li>- Calories, Total Fat, Saturated Fat, Trans Fat</li>
                <li>- Cholesterol, Sodium, Total Carbs</li>
                <li>- Dietary Fiber, Total Sugars, Added Sugars</li>
                <li>- Protein, Vitamin D, Calcium, Iron, Potassium</li>
              </ul>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Tag className="w-10 h-10 text-accent mb-4" />
              <h3 className="text-xl font-bold text-primary mb-3">Statement of Identity</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>- Common/usual name of food</li>
                <li>- Appropriately descriptive term</li>
                <li>- Standard of identity (nếu có)</li>
                <li>- Font size requirements</li>
                <li>- Placement on PDP</li>
              </ul>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Scale className="w-10 h-10 text-accent mb-4" />
              <h3 className="text-xl font-bold text-primary mb-3">Net Quantity</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>- Dual declaration (metric + US)</li>
                <li>- Minimum type size requirements</li>
                <li>- Placement on lower 30% of PDP</li>
                <li>- Parallel with base</li>
                <li>- Prominent and conspicuous</li>
              </ul>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <AlertTriangle className="w-10 h-10 text-amber-500 mb-4" />
              <h3 className="text-xl font-bold text-primary mb-3">Allergen Declaration</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>- 9 major allergens (FALCPA + Sesame)</li>
                <li>- Contains statement OR in ingredients</li>
                <li>- Bold or parentheses format</li>
                <li>- Cross-contact warnings</li>
                <li>- May contain statements</li>
              </ul>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CheckCircle2 className="w-10 h-10 text-accent mb-4" />
              <h3 className="text-xl font-bold text-primary mb-3">Ingredient List</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>- Descending order by weight</li>
                <li>- Common/usual names</li>
                <li>- Sub-ingredients declaration</li>
                <li>- Color additives listing</li>
                <li>- Spices, flavors, colors grouping</li>
              </ul>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <FileText className="w-10 h-10 text-accent mb-4" />
              <h3 className="text-xl font-bold text-primary mb-3">Name & Address</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>- Manufacturer, packer or distributor</li>
                <li>- Street address, city, state, ZIP</li>
                <li>- Country of origin (Vietnam)</li>
                <li>- Distributed by / Imported by</li>
                <li>- US Agent contact (optional)</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Common Mistakes */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Lỗi nhãn thường gặp với sản phẩm Việt Nam
            </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {[
              {
                error: "Nutrition Facts sai format",
                detail: "Dùng format cũ (pre-2016), thiếu Added Sugars, sai font size, không đúng RACC serving",
                fix: "Cập nhật theo format mới 21 CFR 101.9, tính toán lại serving size theo FDA RACC",
              },
              {
                error: "Ingredient list không đúng thứ tự",
                detail: "Không sắp xếp theo thứ tự giảm dần weight, dùng tên không phải common name",
                fix: "Sắp xếp lại theo weight, sử dụng common/usual name theo FDA guidelines",
              },
              {
                error: "Thiếu allergen declaration",
                detail: "Không khai báo hoặc khai báo không đúng format các major allergens",
                fix: "Thêm Contains statement hoặc bold trong ingredient list, bao gồm Sesame (2023)",
              },
              {
                error: "Country of origin không rõ",
                detail: "Ghi Made in Vietnam bằng tiếng Việt hoặc font quá nhỏ",
                fix: "Ghi Product of Vietnam bằng tiếng Anh, font conspicuous",
              },
              {
                error: "Health claims không được phép",
                detail: "Ghi các health claims chưa được FDA approve",
                fix: "Chỉ sử dụng authorized health claims hoặc qualified health claims với disclaimer",
              },
            ].map((item, idx) => (
              <Card key={idx} className="p-6 border-l-4 border-l-destructive">
                <h3 className="text-lg font-bold text-destructive mb-2">{item.error}</h3>
                <p className="text-sm text-muted-foreground mb-2">{item.detail}</p>
                <p className="text-sm text-accent font-medium">Cách sửa: {item.fix}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Service Include */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Dịch vụ sửa nhãn FDA bao gồm
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-4">Label Review</h3>
              <ul className="space-y-3">
                {[
                  "Kiểm tra toàn bộ label theo 21 CFR 101",
                  "So sánh với FDA Warning Letters database",
                  "Phát hiện lỗi format Nutrition Facts",
                  "Kiểm tra allergen declaration compliance",
                  "Review ingredient list order & naming",
                  "Báo cáo chi tiết từng lỗi + reference",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-4">Label Revision</h3>
              <ul className="space-y-3">
                {[
                  "Thiết kế lại Nutrition Facts panel",
                  "Tính toán serving size theo RACC",
                  "Viết lại ingredient list chuẩn FDA",
                  "Thêm allergen statements đúng format",
                  "Cung cấp file artwork sẵn sàng in",
                  "Hỗ trợ revision đến khi hoàn chỉnh",
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
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
            Nhãn chuẩn FDA = Thông quan nhanh
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Gửi mẫu nhãn hiện tại để được kiểm tra miễn phí. 
            Nhận báo cáo chi tiết trong 2 ngày làm việc.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ConsultationDialog
              trigger={
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Gửi mẫu nhãn ngay
                </Button>
              }
            />
            <Link href="/services/food/fda-registration">
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                Bước 3: Đăng ký FDA
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
