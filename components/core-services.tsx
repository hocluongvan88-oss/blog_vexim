import { Card } from "@/components/ui/card"
import { CheckCircle2, Users, Microscope } from "lucide-react"

const serviceCategories = [
  {
    title: "FDA Food",
    icon: CheckCircle2,
    color: "bg-blue-50 text-blue-600",
    services: [
      "Đăng ký cơ sở sản xuất",
      "Hỗ trợ US Agent",
      "Prior Notice",
    ],
  },
  {
    title: "MoCRA Cosmetics",
    icon: Users,
    color: "bg-purple-50 text-purple-600",
    services: [
      "Responsible Person (RP)",
      "Product Listing",
      "Facility Registration",
    ],
  },
  {
    title: "Label & Ingredients",
    icon: Microscope,
    color: "bg-green-50 text-green-600",
    services: [
      "Review thành phần",
      "Nutrition Facts",
      "Claims verification",
    ],
  },
]

export function CoreServices() {
  return (
    <section id="core-services" className="py-16 md:py-24 bg-gradient-to-b from-white to-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 text-balance">
            Dịch vụ cốt lõi
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Ba lĩnh vực chính giúp doanh nghiệp xuất khẩu thực phẩm, mỹ phẩm sang Mỹ
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {serviceCategories.map((category, index) => {
            const IconComponent = category.icon
            return (
              <Card key={index} className="p-8 hover:shadow-lg transition-all duration-300 border border-border/50 hover:border-accent/50">
                <div className={`w-16 h-16 rounded-lg flex items-center justify-center mb-6 ${category.color}`}>
                  <IconComponent className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-6">{category.title}</h3>
                <ul className="space-y-4">
                  {category.services.map((service, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{service}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
