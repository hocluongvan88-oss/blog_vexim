import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, AlertTriangle, Tag, FileText, Scale, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ConsultationDialog } from "@/components/consultation-dialog"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sửa nhãn mỹ phẩm FDA - Cosmetic Labeling Compliance",
  description:
    "Chỉnh sửa nhãn theo FDA cosmetic labeling guidelines. Principal display panel, ingredient declaration, warning statements, net quantity. Tuân thủ Fair Packaging and Labeling Act.",
  keywords: [
    "sửa nhãn mỹ phẩm",
    "cosmetic labeling",
    "FDA cosmetic label",
    "FPLA",
    "ingredient declaration",
    "warning statements",
  ],
  alternates: {
    canonical: "/services/cosmetics/label-compliance",
  },
}

export default function CosmeticLabelCompliancePage() {
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
                <span className="inline-block bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-medium">
                  Mỹ phẩm
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 text-balance">
                Sửa nhãn mỹ phẩm FDA
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                Nhãn mỹ phẩm phải tuân thủ Fair Packaging and Labeling Act (FPLA) và FDA cosmetic labeling regulations. 
                Nhãn sai = FDA warning letter + recall.
              </p>
              <div className="flex flex-wrap gap-4">
                <ConsultationDialog
                  trigger={
                    <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                      Gửi mẫu nhãn kiểm tra <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  }
                />
                <Link href="/services/cosmetics/mocra-registration">
                  <Button size="lg" variant="outline">
                    Bước tiếp: Đăng ký MoCRA
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[500px]">
              <Image
                src="/cosmetic-label-compliance-fda.jpg"
                alt="Cosmetic Label Compliance"
                fill
                className="object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Label Requirements */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Các yếu tố bắt buộc trên nhãn mỹ phẩm
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="p-6">
              <Tag className="w-10 h-10 text-accent mb-4" />
              <h3 className="text-xl font-bold text-primary mb-3">Statement of Identity</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>- Tên sản phẩm (common name)</li>
                <li>- Mô tả sản phẩm nếu tên không rõ</li>
                <li>- Font size theo quy định PDP</li>
                <li>- Vị trí prominent trên PDP</li>
              </ul>
            </Card>

            <Card className="p-6">
              <Scale className="w-10 h-10 text-accent mb-4" />
              <h3 className="text-xl font-bold text-primary mb-3">Net Quantity</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>- Đơn vị US (oz, fl oz) + metric</li>
                <li>- Font size theo area of PDP</li>
                <li>- Vị trí: lower 30% of PDP</li>
                <li>- Parallel với base</li>
              </ul>
            </Card>

            <Card className="p-6">
              <FileText className="w-10 h-10 text-accent mb-4" />
              <h3 className="text-xl font-bold text-primary mb-3">Ingredient Declaration</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>- INCI names hoặc common names</li>
                <li>- Thứ tự giảm dần theo concentration</li>
                <li>- Dưới 1%: any order sau đó</li>
                <li>- Color additives: cuối list</li>
              </ul>
            </Card>

            <Card className="p-6">
              <FileText className="w-10 h-10 text-accent mb-4" />
              <h3 className="text-xl font-bold text-primary mb-3">Name & Address</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>- Manufacturer, packer, or distributor</li>
                <li>- Street address, city, state, ZIP</li>
                <li>- Nếu không phải manufacturer: Distributed by hoặc Manufactured for</li>
                <li>- Country of origin</li>
              </ul>
            </Card>

            <Card className="p-6">
              <AlertTriangle className="w-10 h-10 text-amber-500 mb-4" />
              <h3 className="text-xl font-bold text-primary mb-3">Warning Statements</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>- Coal tar hair dyes: Caution statement + patch test</li>
                <li>- Feminine deodorant sprays: warning</li>
                <li>- Aerosol products: flammability warnings</li>
                <li>- Sunscreens: drug facts panel</li>
              </ul>
            </Card>

            <Card className="p-6">
              <FileText className="w-10 h-10 text-accent mb-4" />
              <h3 className="text-xl font-bold text-primary mb-3">Directions & Cautions</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>- Directions for safe use</li>
                <li>- Precautionary statements</li>
                <li>- Keep out of reach of children (nếu cần)</li>
                <li>- Specific instructions</li>
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
              Lỗi nhãn mỹ phẩm thường gặp
            </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {[
              {
                error: "Sử dụng drug claims",
                detail: "Ghi treats acne, anti-aging, reduces wrinkles khiến sản phẩm bị coi là drug",
                fix: "Dùng cosmetic claims: cleanses, moisturizes, helps improve appearance of...",
              },
              {
                error: "Ingredient names không đúng",
                detail: "Dùng tên thương mại, tên tiếng Việt, hoặc INCI names sai",
                fix: "Sử dụng INCI names chuẩn từ PCPC International Cosmetic Ingredient Dictionary",
              },
              {
                error: "Net quantity sai format",
                detail: "Chỉ ghi metric (50ml) mà không có US customary (1.7 fl oz)",
                fix: "Phải có cả 2: 1.7 FL OZ (50 mL) hoặc 50 mL (1.7 FL OZ)",
              },
              {
                error: "Thiếu warning cho products cần warning",
                detail: "Aerosol spray thiếu flammability warning, self-tanner thiếu sun protection warning",
                fix: "Thêm required warnings theo product type",
              },
              {
                error: "Country of origin không rõ",
                detail: "Ghi Made in VN hoặc không ghi gì",
                fix: "Ghi rõ: Made in Vietnam hoặc Product of Vietnam bằng tiếng Anh",
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

      {/* Cosmetic vs Drug Claims */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Cosmetic Claims vs Drug Claims
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Ranh giới mỏng manh nhưng cực kỳ quan trọng. Drug claims khiến sản phẩm cần FDA drug approval.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-6 border-2 border-accent/30">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-6 h-6 text-accent" />
                <h3 className="text-xl font-bold text-accent">Cosmetic Claims (OK)</h3>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>- Cleanses skin</li>
                <li>- Moisturizes</li>
                <li>- Improves appearance of fine lines</li>
                <li>- Makes skin look younger</li>
                <li>- Gives skin a healthy glow</li>
                <li>- Softens skin</li>
                <li>- Conditions hair</li>
                <li>- Adds shine to hair</li>
              </ul>
            </Card>

            <Card className="p-6 border-2 border-destructive/30">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-6 h-6 text-destructive" />
                <h3 className="text-xl font-bold text-destructive">Drug Claims (TRÁNH)</h3>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>- Treats acne</li>
                <li>- Anti-aging</li>
                <li>- Reduces wrinkles</li>
                <li>- Heals skin</li>
                <li>- Stimulates cell regeneration</li>
                <li>- Prevents hair loss</li>
                <li>- Antibacterial / antimicrobial</li>
                <li>- Relieves eczema</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Service */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Dịch vụ sửa nhãn mỹ phẩm
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-4">Label Review</h3>
              <ul className="space-y-3">
                {[
                  "Review toàn bộ label theo FPLA & FDA",
                  "Kiểm tra ingredient declaration format",
                  "Đánh giá claims: cosmetic vs drug",
                  "Kiểm tra warnings bắt buộc",
                  "Báo cáo chi tiết từng lỗi + fix",
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
                  "Viết lại ingredient list chuẩn INCI",
                  "Chỉnh sửa claims cho FDA compliant",
                  "Format net quantity đúng quy định",
                  "Thêm required warnings",
                  "Cung cấp artwork-ready files",
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
            Nhãn chuẩn FDA = Tự tin bán tại Mỹ
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Gửi mẫu nhãn hiện tại để được review miễn phí. Nhận báo cáo trong 2 ngày làm việc.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ConsultationDialog
              trigger={
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Gửi mẫu nhãn ngay
                </Button>
              }
            />
            <Link href="/services/cosmetics/mocra-registration">
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                Bước 3: Đăng ký MoCRA
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
