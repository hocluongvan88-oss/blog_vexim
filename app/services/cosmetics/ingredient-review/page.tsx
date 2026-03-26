import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, AlertTriangle, Search, Ban, Shield, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ConsultationDialog } from "@/components/consultation-dialog"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kiểm tra thành phần mỹ phẩm - FDA Cosmetic Ingredient Review",
  description:
    "Review ingredients theo 21 CFR 700-740. Kiểm tra color additives, prohibited ingredients, restricted substances. Đánh giá safety data theo MoCRA requirements.",
  keywords: [
    "kiểm tra thành phần mỹ phẩm",
    "cosmetic ingredient review",
    "21 CFR 700",
    "MoCRA",
    "FDA cosmetics",
    "prohibited ingredients",
  ],
  alternates: {
    canonical: "/services/cosmetics/ingredient-review",
  },
}

export default function CosmeticIngredientReviewPage() {
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
                <span className="inline-block bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-medium">
                  Mỹ phẩm
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 text-balance">
                Kiểm tra thành phần mỹ phẩm
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                FDA nghiêm cấm nhiều thành phần trong mỹ phẩm mà Việt Nam hoặc EU cho phép. 
                Kiểm tra trước để tránh bị FDA seizure và recall.
              </p>
              <div className="flex flex-wrap gap-4">
                <ConsultationDialog
                  trigger={
                    <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                      Gửi danh sách thành phần <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  }
                />
                <Link href="/services/cosmetics/label-compliance">
                  <Button size="lg" variant="outline">
                    Bước tiếp: Sửa nhãn
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[500px]">
              <Image
                src="/cosmetic-ingredient-safety-review.jpg"
                alt="Cosmetic Ingredient Review"
                fill
                className="object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Prohibited Ingredients */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Thành phần bị cấm trong mỹ phẩm tại Mỹ
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Theo 21 CFR 700.11-700.35, các thành phần sau bị cấm hoàn toàn:
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                ingredient: "Bithionol",
                reason: "Gây photosensitivity",
                ref: "21 CFR 700.11",
              },
              {
                ingredient: "Mercury compounds",
                reason: "Độc tính, tích lũy sinh học",
                ref: "21 CFR 700.13",
              },
              {
                ingredient: "Vinyl chloride",
                reason: "Carcinogen",
                ref: "21 CFR 700.14",
              },
              {
                ingredient: "Halogenated salicylanilides",
                reason: "Gây photosensitivity",
                ref: "21 CFR 700.15",
              },
              {
                ingredient: "Chloroform",
                reason: "Carcinogen",
                ref: "21 CFR 700.18",
              },
              {
                ingredient: "Methylene chloride",
                reason: "Carcinogen",
                ref: "21 CFR 700.19",
              },
              {
                ingredient: "Cattle material (BSE risk)",
                reason: "BSE/TSE risk",
                ref: "21 CFR 700.27",
              },
              {
                ingredient: "Chlorofluorocarbon propellants",
                reason: "Ozone depleting",
                ref: "21 CFR 700.23",
              },
              {
                ingredient: "Hexachlorophene (>0.1%)",
                reason: "Neurotoxic",
                ref: "21 CFR 250.250",
              },
            ].map((item, idx) => (
              <Card key={idx} className="p-4 border-l-4 border-l-destructive">
                <div className="flex items-start gap-3">
                  <Ban className="w-5 h-5 text-destructive flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-primary">{item.ingredient}</h3>
                    <p className="text-sm text-muted-foreground">{item.reason}</p>
                    <p className="text-xs text-destructive mt-1">{item.ref}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Color Additives */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Color Additives cho mỹ phẩm (21 CFR 73, 74, 82)
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-accent" />
                Được phép sử dụng
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>- FD&C colors (certified batch)</li>
                <li>- D&C colors (for drugs & cosmetics)</li>
                <li>- External D&C colors</li>
                <li>- Colors exempt from certification (natural)</li>
                <li>- Lakes (insoluble forms)</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
                Cần lưu ý
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>- Coal tar hair dyes: cần warning label</li>
                <li>- D&C Red No. 8, 9, 19: không cho lip products</li>
                <li>- D&C Orange No. 17: không cho lip, eye area</li>
                <li>- Phải có batch certification number</li>
                <li>- EU-approved colors chưa chắc FDA approved</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* MoCRA New Requirements */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Yêu cầu mới theo MoCRA 2022
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Modernization of Cosmetics Regulation Act bổ sung thêm nhiều yêu cầu về thành phần:
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {[
              {
                title: "Fragrance Allergen Disclosure",
                description: "Phải khai báo các fragrance allergens gây dị ứng phổ biến trên nhãn (tương tự EU).",
              },
              {
                title: "Substantiation of Safety",
                description: "Phải có adequate substantiation rằng sản phẩm an toàn. FDA có thể yêu cầu safety data.",
              },
              {
                title: "Adverse Event Records",
                description: "Phải lưu trữ records về serious adverse events. Báo cáo FDA trong vòng 15 ngày.",
              },
              {
                title: "PFAS Ban (sắp tới)",
                description: "FDA đang xem xét ban PFAS (forever chemicals) trong mỹ phẩm. Chuẩn bị từ bây giờ.",
              },
              {
                title: "Talc/Asbestos Testing",
                description: "Talc phải được test asbestos-free. Nhiều brands đã chuyển sang alternatives.",
              },
            ].map((item, idx) => (
              <Card key={idx} className="p-6">
                <div className="flex items-start gap-4">
                  <Shield className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
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
              Dịch vụ kiểm tra thành phần của Vexim
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-6">
              <Search className="w-10 h-10 text-accent mb-4" />
              <h3 className="text-xl font-bold text-primary mb-4">Ingredient Review</h3>
              <ul className="space-y-3">
                {[
                  "Review từng ingredient theo 21 CFR 700-740",
                  "Kiểm tra color additives status",
                  "Đánh giá INCI names có đúng không",
                  "Kiểm tra concentration limits",
                  "So sánh với EU/ASEAN regulations",
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
              <h3 className="text-xl font-bold text-primary mb-4">Safety Substantiation</h3>
              <ul className="space-y-3">
                {[
                  "Đánh giá safety data hiện có",
                  "Tư vấn cần thêm testing nào",
                  "Review CIR (Cosmetic Ingredient Review) status",
                  "Chuẩn bị safety substantiation file",
                  "Sẵn sàng cho FDA request",
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
            Check thành phần trước khi bị FDA reject
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Gửi ingredient list để được review. Nhận báo cáo trong 2-3 ngày làm việc.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ConsultationDialog
              trigger={
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Gửi danh sách thành phần
                </Button>
              }
            />
            <Link href="/services/cosmetics/label-compliance">
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                Bước 2: Sửa nhãn mỹ phẩm
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
