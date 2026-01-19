import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const services = [
  {
    image: "/fda-food-safety-inspection-laboratory-professional.jpg",
    title: "Đăng ký FDA",
    description:
      "Hàng hóa thực phẩm, mỹ phẩm nhập khẩu Mỹ bắt buộc phải có FDA Registration. Thiếu FDA có thể bị tạm giữ hoặc trả hàng. Chúng tôi xử lý hồ sơ đúng quy chuẩn FDA trong 5-10 ngày.",
    link: "/services/fda",
  },
  {
    image: "/china-customs-port-container-shipping-trade.jpg",
    title: "Tư vấn Mã GACC",
    description:
      "Xuất khẩu nông sản, thủy sản sang Trung Quốc bắt buộc phải có Mã GACC theo quy định của Tổng cục Hải quan Trung Quốc. Không có GACC, lô hàng chắc chắn bị từ chối nhập khẩu.",
    link: "/services/gacc",
  },
  {
    image: "/korean-cosmetics-health-products-laboratory-qualit.jpg",
    title: "Giấy phép MFDS - Hàn Quốc",
    description:
      "Theo Luật An toàn Thực phẩm và Y tế Hàn Quốc, mỹ phẩm và thực phẩm chức năng cần Giấy phép MFDS. Chúng tôi hỗ trợ hồ sơ đúng quy định Bộ Y tế Hàn Quốc.",
    link: "/services/mfds",
  },
  {
    image: "/us-customs-broker-agent-import-export-documentatio.jpg",
    title: "Dịch vụ Agent Hoa Kỳ",
    description:
      "FDA yêu cầu mọi doanh nghiệp nước ngoài phải có US Agent tại Mỹ để nhận thông báo pháp lý. Chúng tôi đóng vai trò đại diện hợp pháp của bạn theo quy định FDA 21 CFR.",
    link: "/services/us-agent",
  },
  {
    image: "/ai-technology-blockchain-supply-chain-digital-trac.jpg",
    title: "Nền tảng truy xuất nguồn gốc AI",
    description:
      "Hệ thống truy xuất nguồn gốc giúp doanh nghiệp tuân thủ yêu cầu ghi nhãn và minh bạch nguồn gốc theo quy định EU, Mỹ, Trung Quốc. Tích hợp blockchain bảo vệ dữ liệu không thể thay đổi.",
    link: "/services/ai-traceability",
    badge: "Giải pháp công nghệ",
  },
  {
    image: "/international-trade-export-logistics-cargo-shippin.jpg",
    title: "Ủy thác xuất khẩu",
    description:
      "Theo Nghị định 69/2018/NĐ-CP, doanh nghiệp có thể ủy thác xuất khẩu cho đơn vị có Giấy phép kinh doanh xuất nhập khẩu. Vexim Global đảm bảo tuân thủ đầy đủ quy trình pháp lý.",
    link: "/services/export-delegation",
  },
]

export function ServicesGrid() {
  return (
    <section id="services" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 text-balance">
            Chúng tôi giải quyết vấn đề gì cho bạn?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Không chỉ làm giấy tờ - chúng tôi giúp bạn tránh rủi ro và tăng cơ hội thành công
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <Link key={index} href={service.link} className="group">
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-accent/50 p-0 cursor-pointer hover:-translate-y-2">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    fill
                    className="object-cover w-full group-hover:scale-110 transition-transform duration-500 rounded-t-lg"
                  />
                  {service.badge && (
                    <div className="absolute top-3 right-3 bg-accent text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                      {service.badge}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{service.description}</p>
                  <div className="text-accent font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                    Tìm hiểu thêm
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
