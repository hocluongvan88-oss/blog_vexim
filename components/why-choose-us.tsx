import { Users, Clock, DollarSign, Headphones } from "lucide-react"

const benefits = [
  {
    icon: Users,
    title: "Chuyên sâu từng thị trường",
    description:
      "Chúng tôi không chỉ hiểu quy định, mà còn nắm rõ cách vận hành thực tế của FDA, GACC, MFDS. Theo dõi sát từng thay đổi pháp lý, cập nhật kinh nghiệm qua hàng trăm hồ sơ đã xử lý. Đội ngũ trẻ, nhiệt huyết, luôn học hỏi để đồng hành tốt nhất cùng doanh nghiệp Việt.",
  },
  {
    icon: Clock,
    title: "Quy trình minh bạch, tiến độ rõ ràng",
    description:
      "FDA Registration: 5-10 ngày làm việc. Mã GACC: 8-12 tuần. Giấy phép MFDS: 10-16 tuần tùy sản phẩm. Thời gian phụ thuộc độ đầy đủ của hồ sơ và tốc độ xử lý của cơ quan. Chúng tôi cập nhật tiến độ thường xuyên, không để bạn chờ đợi mơ hồ.",
  },
  {
    icon: DollarSign,
    title: "Báo giá rõ ràng, không phát sinh",
    description:
      "Chi phí được tính từng hạng mục cụ thể, minh bạch ngay từ đầu. Hợp đồng ghi rõ phạm vi công việc, thời gian cam kết và quyền lợi của hai bên. Không có chi phí ẩn, không phát sinh bất ngờ. Tuân thủ đầy đủ pháp luật về thương mại và bảo vệ người tiêu dùng.",
  },
  {
    icon: Headphones,
    title: "Hỗ trợ nhiệt tình, cập nhật kịp thời",
    description:
      "Quy định của FDA, GACC, MFDS thay đổi liên tục. Chúng tôi theo dõi hàng ngày để thông báo cho bạn kịp thời khi có điều chỉnh quan trọng. Luôn sẵn sàng tư vấn qua hotline, email, Zalo trong giờ làm việc. Đội ngũ nhiệt tình, giải đáp nhanh chóng.",
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
            Đồng hành tin cậy, mang lại giá trị thực cho doanh nghiệp của bạn
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