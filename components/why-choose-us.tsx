import { Globe, Clock, DollarSign, FileCheck2 } from "lucide-react"

const benefits = [
  {
    icon: Globe,
    title: "Chuyên sâu thị trường Hoa Kỳ",
    description:
      "Am hiểu quy định FDA và cách hồ sơ được vận hành thực tế tại thị trường Hoa Kỳ. Kinh nghiệm từ nhiều hồ sơ thực tế, kết hợp phân tích hồ sơ và cập nhật quy định để đưa ra hướng xử lý phù hợp cho từng doanh nghiệp.",
  },
  {
    icon: Clock,
    title: "Quy trình rõ ràng",
    description:
      "Mỗi hồ sơ đều có phạm vi công việc, các bước xử lý và mốc tiến độ rõ ràng. Thời gian thực tế phụ thuộc vào loại hồ sơ, mức độ đầy đủ của thông tin và phản hồi từ cơ quan quản lý. Vexim cập nhật tiến độ để doanh nghiệp luôn biết hồ sơ đang ở đâu.",
  },
  {
    icon: DollarSign,
    title: "Chi phí minh bạch",
    description:
      "Báo giá theo từng hạng mục và phạm vi công việc cụ thể. Hợp đồng thể hiện rõ trách nhiệm, quyền lợi và các khoản chi phí liên quan ngay từ đầu, hạn chế tối đa những khoản phát sinh ngoài dự kiến.",
  },
  {
    icon: FileCheck2,
    title: "Bám sát tiến độ",
    description:
      "Không chỉ tư vấn tại thời điểm đăng ký. Vexim theo dõi hồ sơ trong quá trình xử lý, cập nhật những thay đổi có liên quan và hỗ trợ doanh nghiệp khi phát sinh vấn đề cần xử lý.",
  },
]

export function WhyChooseUs() {
  return (
    <section id="about" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 text-balance">
            Tại sao chọn chúng tôi
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
