import { Card } from "@/components/ui/card"
import { Building2, FileText, RotateCcw } from "lucide-react"

const dunServices = [
  {
    icon: FileText,
    title: "DUNS Registration",
    description: "Lấy mã DUNS - Định danh doanh nghiệp Mỹ (Unique Identifier, UII). Bắt buộc cho FDA, FSVP, US Agent.",
  },
  {
    icon: Building2,
    title: "LLC Formation",
    description: "Thành lập công ty LLC tại Mỹ, lấy EIN (Tax ID), mở tài khoản ngân hàng, hỗ trợ pháp lý.",
  },
  {
    icon: RotateCcw,
    title: "Duy Trì & Gia Hạn",
    description: "Gia hạn định kỳ DUNS, LLC, EIN, giấy phép. Cập nhật thông tin với các cơ quan quản lý.",
  },
]

export function USPresenceDUNS() {
  return (
    <section id="us-presence" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 text-balance">
            Có mặt tại Mỹ - Điều kiện thành công
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Mã DUNS và thành lập LLC tại Mỹ là yêu cầu bắt buộc để vận hành suôn sẻ toàn bộ quy trình xuất khẩu
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {dunServices.map((service, index) => {
            const IconComponent = service.icon
            return (
              <Card
                key={index}
                className="p-8 text-center hover:shadow-lg transition-all duration-300 border border-border/50 hover:border-accent/50 group"
              >
                <div className="w-16 h-16 rounded-lg bg-accent/10 flex items-center justify-center mb-6 mx-auto group-hover:bg-accent/20 transition-colors">
                  <IconComponent className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-4">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </Card>
            )
          })}
        </div>

        <div className="mt-12 p-8 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <p className="text-blue-900">
            <span className="font-bold">Lợi ích của Vexim:</span> Chúng tôi sở hữu DUNS chính thức tại Mỹ và có đội ngũ pháp lý
            tại New Jersey. Khi bạn hợp tác với chúng tôi, thông tin DUNS của bạn sẽ khớp với đơn đăng ký FDA, đảm bảo
            tính nhất quán và giảm rủi ro rejection.
          </p>
        </div>
      </div>
    </section>
  )
}
