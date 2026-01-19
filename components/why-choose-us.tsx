import { Users, Clock, DollarSign, Headphones } from "lucide-react"

const benefits = [
  {
    icon: Users,
    title: "Chuyên gia Regulatory Affairs đạt chuẩn quốc tế",
    description:
      "Đội ngũ tư vấn có chứng chỉ chuyên ngành (RAPS, Trade Compliance), kinh nghiệm 10+ năm với FDA, GACC, MFDS. Thành viên đã xử lý 500+ hồ sơ compliance cho doanh nghiệp Việt Nam xuất khẩu thực phẩm, mỹ phẩm, thiết bị y tế sang thị trường khó tính.",
  },
  {
    icon: Clock,
    title: "Quy trình chuẩn với timeline minh bạch",
    description:
      "FDA Registration: 5-10 ngày làm việc. GACC Code: 8-12 tuần. MFDS Notification: 10-16 tuần (tùy loại sản phẩm). Timeline phụ thuộc vào độ đầy đủ hồ sơ, sự hợp tác khách hàng, và thời gian xử lý của cơ quan quản lý. Chúng tôi commit theo dõi sát tiến độ.",
  },
  {
    icon: DollarSign,
    title: "Báo giá rõ ràng, hợp đồng bảo vệ quyền lợi",
    description:
      "Fee schedule minh bạch từng service. Hợp đồng dịch vụ ghi rõ scope of work, deliverables, timeline, và limitation of liability. Tuân thủ Commercial Law và Consumer Protection Law Việt Nam. Không có hidden costs.",
  },
  {
    icon: Headphones,
    title: "Compliance support và regulatory monitoring",
    description:
      "Hotline tư vấn trong giờ hành chính. Email support response trong 24h. Cung cấp regulatory updates khi FDA, GACC, MFDS thay đổi quy định. Hỗ trợ xử lý FDA Warning Letters, Import Alerts, và các vấn đề compliance phát sinh.",
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
