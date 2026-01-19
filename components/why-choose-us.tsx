import { Users, Clock, DollarSign, Headphones } from "lucide-react"

const benefits = [
  {
    icon: Users,
    title: "Đội ngũ chuyên gia pháp lý xuất nhập khẩu",
    description:
      "Đội ngũ tư vấn viên được đào tạo chuyên sâu về luật thương mại quốc tế, với kinh nghiệm xử lý hồ sơ cho nhiều doanh nghiệp xuất khẩu nông sản, thủy sản, mỹ phẩm.",
  },
  {
    icon: Clock,
    title: "Cam kết thời gian xử lý hồ sơ",
    description:
      "FDA 5-10 ngày, GACC 20-30 ngày, MFDS 30-45 ngày làm việc. Cam kết hoàn phí nếu chậm tiến độ do lỗi của chúng tôi, theo điều khoản hợp đồng.",
  },
  {
    icon: DollarSign,
    title: "Minh bạch chi phí và hợp đồng rõ ràng",
    description:
      "Báo giá chi tiết từng hạng mục. Hợp đồng dịch vụ ghi rõ quyền lợi và nghĩa vụ của hai bên. Cam kết không phát sinh chi phí ngoài thỏa thuận ban đầu.",
  },
  {
    icon: Headphones,
    title: "Hỗ trợ tư vấn pháp lý 24/7",
    description:
      "Đội ngũ tư vấn luôn sẵn sàng giải đáp thắc mắc về quy định pháp luật, hồ sơ chứng từ, và xử lý các tình huống phát sinh trong quá trình xuất nhập khẩu.",
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
