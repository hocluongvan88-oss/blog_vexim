import { Users, Clock, DollarSign, Headphones } from "lucide-react"

const benefits = [
  {
    icon: Users,
    title: "Đội ngũ hiểu rõ quy định từng thị trường",
    description:
      "Chúng tôi chuyên nghiên cứu luật xuất nhập khẩu Mỹ, Trung Quốc, Hàn Quốc. Theo dõi sát những thay đổi mới nhất của FDA, GACC, MFDS để tư vấn chính xác cho doanh nghiệp Việt. Đội ngũ trẻ, nhiệt huyết, sẵn sàng học hỏi để phục vụ tốt nhất.",
  },
  {
    icon: Clock,
    title: "Cam kết thời gian và quy trình rõ ràng",
    description:
      "FDA Registration: 5-10 ngày làm việc. GACC Code: 8-12 tuần. MFDS: 10-16 tuần (tùy sản phẩm). Thời gian phụ thuộc vào độ đầy đủ hồ sơ của bạn và tốc độ xử lý của cơ quan. Chúng tôi theo dõi sát từng bước, báo cáo tiến độ thường xuyên.",
  },
  {
    icon: DollarSign,
    title: "Minh bạch chi phí ngay từ đầu",
    description:
      "Báo giá chi tiết từng hạng mục, không phát sinh thêm. Hợp đồng ghi rõ công việc cụ thể, thời gian hoàn thành, và quyền lợi của hai bên. Tuân thủ đầy đủ Luật Thương mại và Luật Bảo vệ Quyền lợi Người tiêu dùng.",
  },
  {
    icon: Headphones,
    title: "Cập nhật liên tục, hỗ trợ tận tâm",
    description:
      "Luật của FDA, GACC, MFDS thay đổi thường xuyên. Chúng tôi theo dõi cập nhật mỗi ngày để thông báo cho khách hàng kịp thời. Hỗ trợ tư vấn qua hotline, email, Zalo trong giờ hành chính. Đội ngũ luôn sẵn sàng giải đáp thắc mắc.",
  },
]

export function WhyChooseUs() {
  return (
    <section id="about" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 text-balance">
            Tại sao chọn Vexim Global?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Chúng tôi cam kết mang đến giá trị vượt trội cho mọi khách hàng
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
