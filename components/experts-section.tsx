"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Award, Shield, CheckCircle2 } from "lucide-react"

const experts = [
  {
    name: "Theresa",
    title: "Regulatory Consultant",
    image: "/experts/theresa.svg",
    specialties: ["Registration", "Documentation", "Compliance"],
    description:
      "Chuyên gia tư vấn pháp lý chuyên sâu, hỗ trợ doanh nghiệp trong quy trình đăng ký, hồ sơ và tuân thủ. Đảm bảo mọi hồ sơ đáp ứng tiêu chuẩn pháp lý và chuyên môn cao nhất.",
  },
  {
    name: "Helcio",
    title: "US FDA Consultant",
    image: "/experts/helcio.svg",
    specialties: ["FDA Compliance", "Label Audit", "Amazon FBA"],
    description:
      "10+ năm kinh nghiệm hỗ trợ thực phẩm, thực phẩm chức năng và mỹ phẩm vào thị trường Mỹ. Chuyên về Nutrition Facts, FDA Label Audits, Structure/Health Claims và Amazon Listings.",
  },
  {
    name: "Althea Norvane",
    title: "FDA Labelling Consultant",
    image: "/experts/althea.svg",
    specialties: ["FDA Labelling", "Food Compliance", "Label Audit"],
    description:
      "Chuyên gia đánh giá nhãn FDA chuyên nghiệp, đảm bảo sản phẩm thực phẩm tuân thủ quy định Mỹ. Hỗ trợ thương hiệu, nhà sản xuất và nhà nhập khẩu về tiêu chuẩn ghi nhãn.",
  },
  {
    name: "Jeff",
    title: "PhD Chemist & Regulatory Specialist",
    image: "/experts/jeff.svg",
    specialties: ["Pharma", "MOCRA", "Dietary Supplements"],
    description:
      "Tiến sĩ Hóa học với 9+ năm kinh nghiệm pháp lý. Chuyên về quy định dược phẩm và mỹ phẩm, MOCRA Registration, FSVP, đánh giá nhãn và CMC SOPs. Tỷ lệ thành công 100%.",
  },
]

export function ExpertsSection() {
  return (
    <section id="experts" className="py-16 md:py-24 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Award className="w-8 h-8 text-accent" />
            <Badge variant="secondary" className="text-sm font-medium">
              Đội ngũ chuyên gia
            </Badge>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 text-balance">
            Chuyên gia FDA hàng đầu của Vexim
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Đội ngũ chuyên gia quốc tế với nhiều năm kinh nghiệm trong lĩnh vực pháp lý FDA Hoa Kỳ. 
            Cam kết đồng hành cùng doanh nghiệp Việt chinh phục thị trường Mỹ.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {experts.map((expert, index) => (
            <div 
              key={index} 
              className="group overflow-hidden rounded-lg border-2 border-input hover:border-accent/50 hover:shadow-xl transition-all duration-300 bg-white"
            >
              {/* Image Container - No padding */}
              <div className="relative aspect-square bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden w-full m-0 p-0">
                <Image
                  src={expert.image}
                  alt={`${expert.name} - ${expert.title}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  priority
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Verified badge */}
                <div className="absolute top-3 right-3">
                  <div className="bg-accent text-white p-1.5 rounded-full shadow-lg">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-accent" />
                  <span className="text-xs font-medium text-accent uppercase tracking-wide">
                    Verified Expert
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-primary mb-1">{expert.name}</h3>
                <p className="text-sm font-medium text-accent mb-3">{expert.title}</p>
                
                {/* Specialties */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {expert.specialties.map((specialty, idx) => (
                    <Badge 
                      key={idx} 
                      variant="outline" 
                      className="text-xs bg-primary/5 border-primary/20 text-primary"
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div>
                
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                  {expert.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Banner */}
        <div className="mt-12 md:mt-16">
          <Card className="p-6 md:p-8 bg-gradient-to-r from-primary to-primary/90 text-white border-0">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                  <Award className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold mb-1">100+ Doanh nghiệp tin tưởng</h3>
                  <p className="text-white/80 text-sm md:text-base">
                    Đội ngũ chuyên gia đã hỗ trợ hàng trăm doanh nghiệp Việt Nam xuất khẩu thành công
                  </p>
                </div>
              </div>
              <div className="flex gap-8 text-center">
                <div>
                  <div className="text-3xl md:text-4xl font-bold">10+</div>
                  <div className="text-white/70 text-sm">Năm kinh nghiệm</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold">100%</div>
                  <div className="text-white/70 text-sm">Tỷ lệ thành công</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold">24/7</div>
                  <div className="text-white/70 text-sm">Hỗ trợ tận tâm</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
