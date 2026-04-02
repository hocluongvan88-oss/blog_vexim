"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Utensils, Sparkles } from "lucide-react"

// Dịch vụ cho Thực phẩm (Food)
const foodServices = [
  {
    image: "/fda-ingredient-review-food-safety.jpg",
    title: "Kiểm tra thành phần (Ingredient Review)",
    description:
      "Đánh giá thành phần sản phẩm có hợp lệ FDA không. Kiểm tra GRAS status, food additives, color additives theo 21 CFR. Phát hiện sớm ingredients bị cấm hoặc hạn chế tại Mỹ.",
    link: "/services/food/ingredient-review",
    step: 1,
  },
  {
    image: "/fda-label-compliance-food-nutrition.jpg",
    title: "Sửa nhãn FDA (Label Compliance)",
    description:
      "Kiểm tra và chỉnh sửa nhãn theo 21 CFR 101. Nutrition Facts panel, ingredient list, allergen declaration, net weight, country of origin. Đảm bảo thông quan 100%.",
    link: "/services/food/label-compliance",
    step: 2,
  },
  {
    image: "/fda-food-facility-registration.jpg",
    title: "Đăng ký FDA Food Facility",
    description:
      "Đăng ký cơ sở sản xuất thực phẩm theo FSMA. Hoàn tất FDA Form 3537a trên hệ thống FURLS. Nhận FDA Registration Number trong 3-5 ngày làm việc.",
    link: "/services/food/fda-registration",
    step: 3,
  },
  {
    image: "/us-agent-fda-representative.jpg",
    title: "Dịch vụ US Agent",
    description:
      "Đại diện pháp lý tại Mỹ - bắt buộc theo FDA. Văn phòng thật tại Houston, TX. Nhận và xử lý liên lạc từ FDA 24/7. Hỗ trợ trả lời warning letters.",
    link: "/services/food/us-agent",
    step: 4,
  },
  {
    image: "/fsvp-importer-compliance.jpg",
    title: "FSVP Importer",
    description:
      "Tìm và chỉ định đơn vị nhập khẩu đủ điều kiện FSVP (Foreign Supplier Verification Program). Bắt buộc theo FSMA cho mọi lô hàng thực phẩm vào Mỹ.",
    link: "/services/food/fsvp-importer",
    step: 5,
    badge: "Quan trọng",
  },
  {
    image: "/fsvp-plan-development.jpg",
    title: "FSVP Plan",
    description:
      "Lập kế hoạch xác minh nhà cung cấp nước ngoài theo 21 CFR 1 Subpart L. Hazard analysis, supplier verification, corrective actions. Tài liệu sẵn sàng cho FDA inspection.",
    link: "/services/food/fsvp-plan",
    step: 6,
  },
  {
    image: "/prior-notice-fda-shipment.jpg",
    title: "Prior Notice",
    description:
      "Khai báo trước khi hàng đến cảng Mỹ theo BTA 2002. Nộp Prior Notice qua PNSI ít nhất 15 ngày trước khi hàng cập cảng. Tránh bị detention tại customs.",
    link: "/services/food/prior-notice",
    step: 7,
  },
  {
    image: "/fda-renewal-biennial.jpg",
    title: "Gia hạn FDA hàng năm",
    description:
      "FDA Food Facility phải gia hạn trong tháng 10 năm chẵn (2024, 2026...). Chúng tôi nhắc nhở và hỗ trợ gia hạn đúng hạn, tránh bị hủy registration.",
    link: "/services/food/fda-renewal",
    step: 8,
  },
]

// Dịch vụ cho Mỹ phẩm (Cosmetics - MoCRA)
const cosmeticsServices = [
  {
    image: "/cosmetic-ingredient-safety-review.jpg",
    title: "Kiểm tra thành phần mỹ phẩm",
    description:
      "Review ingredients theo 21 CFR 700-740. Kiểm tra color additives, prohibited ingredients, restricted substances. Đánh giá safety data theo MoCRA requirements.",
    link: "/services/cosmetics/ingredient-review",
    step: 1,
  },
  {
    image: "/cosmetic-label-compliance-fda.jpg",
    title: "Sửa nhãn mỹ phẩm",
    description:
      "Chỉnh sửa nhãn theo FDA cosmetic labeling guidelines. Principal display panel, ingredient declaration, warning statements, net quantity. Tuân thủ Fair Packaging and Labeling Act.",
    link: "/services/cosmetics/label-compliance",
    step: 2,
  },
  {
    image: "/mocra-fda-cosmetic-registration.jpg",
    title: "Đăng ký FDA MoCRA",
    description:
      "Facility Registration + Product Listing theo Modernization of Cosmetics Regulation Act 2022. Bắt buộc từ 07/2024. Nộp qua hệ thống Cosmetics Direct.",
    link: "/services/cosmetics/mocra-registration",
    step: 3,
    badge: "MoCRA 2022",
  },
  {
    image: "/responsible-person-cosmetics.jpg",
    title: "Responsible Person (RP)",
    description:
      "Chỉ định người chịu trách nhiệm tại Mỹ theo MoCRA. Tương tự US Agent nhưng cho mỹ phẩm. Nhận adverse event reports, liên lạc FDA, đảm bảo compliance.",
    link: "/services/cosmetics/responsible-person",
    step: 4,
  },
  {
    image: "/cosmetic-product-listing-update.jpg",
    title: "Khai báo sản phẩm mới",
    description:
      "Product Listing Update khi ra sản phẩm mới. Nộp trong vòng 120 ngày sau khi đưa sản phẩm vào thị trường Mỹ. Cập nhật ingredients, categories, labeling images.",
    link: "/services/cosmetics/product-listing",
    step: 5,
  },
  {
    image: "/mocra-annual-renewal.jpg",
    title: "Gia hạn MoCRA hàng năm",
    description:
      "Cập nhật Facility Registration và Product Listing hàng năm theo MoCRA. Review & confirm thông tin, cập nhật thay đổi. Deadline: mỗi năm vào tháng sinh nhật đăng ký.",
    link: "/services/cosmetics/mocra-renewal",
    step: 6,
  },
]

export function ServicesGrid() {
  const [activeTab, setActiveTab] = useState("food")

  return (
    <section id="services" className="py-16 md:py-24 bg-secondary/30">
      <div className="w-full px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 text-balance">
            Dịch vụ FDA xuất khẩu Hoa Kỳ
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            Hành trình xuất khẩu từ A-Z: Từ kiểm tra sản phẩm đến thông quan thành công tại Mỹ.
            Chọn loại sản phẩm để xem quy trình phù hợp.
          </p>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-md mx-auto">
            <TabsList className="grid w-full grid-cols-2 h-14">
              <TabsTrigger value="food" className="flex items-center gap-2 text-base h-12">
                <Utensils className="w-5 h-5" />
                Thực phẩm
              </TabsTrigger>
              <TabsTrigger value="cosmetics" className="flex items-center gap-2 text-base h-12">
                <Sparkles className="w-5 h-5" />
                Mỹ phẩm
              </TabsTrigger>
            </TabsList>

            <TabsContent value="food" className="mt-8">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                  {foodServices.map((service, index) => (
                    <ServiceCard key={index} service={service} />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="cosmetics" className="mt-8">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                  {cosmeticsServices.map((service, index) => (
                    <ServiceCard key={index} service={service} />
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Journey indicator */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            {activeTab === "food" ? (
              <>Quy trình 8 bước cho Thực phẩm xuất khẩu Mỹ</>
            ) : (
              <>Quy trình 6 bước cho Mỹ phẩm xuất khẩu Mỹ (MoCRA 2022)</>
            )}
          </p>
        </div>
      </div>
    </section>
  )
}

interface ServiceCardProps {
  service: {
    image: string
    title: string
    description: string
    link: string
    step: number
    badge?: string
  }
}

function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link href={service.link} className="group">
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-accent/50 p-0 cursor-pointer hover:-translate-y-2 h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={service.image || "/placeholder.svg"}
            alt={service.title}
            fill
            className="object-cover w-full group-hover:scale-110 transition-transform duration-500 rounded-t-lg"
          />
          {/* Step indicator */}
          <div className="absolute top-3 left-3 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
            {service.step}
          </div>
          {service.badge && (
            <Badge className="absolute top-3 right-3 bg-accent text-white shadow-lg">
              {service.badge}
            </Badge>
          )}
        </div>
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-primary mb-3 group-hover:text-accent transition-colors line-clamp-2">
            {service.title}
          </h3>
          <p className="text-muted-foreground mb-4 leading-relaxed text-sm flex-1 line-clamp-4">
            {service.description}
          </p>
          <div className="text-accent font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all text-sm">
            Tìm hiểu thêm
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Card>
    </Link>
  )
}
