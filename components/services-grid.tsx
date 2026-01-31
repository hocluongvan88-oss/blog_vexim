import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const services = [
  {
    image: "/fda-food-safety-inspection-laboratory-professional.jpg",
    title: "Đăng ký FDA nhanh",
    description:
      "Xuất khẩu thực phẩm, mỹ phẩm sang Mỹ bắt buộc phải có FDA Registration. Thiếu giấy tờ này, hàng hóa sẽ bị giữ lại ngay tại cảng. Chúng tôi hỗ trợ toàn bộ quy trình từ chuẩn bị hồ sơ đến đăng ký thành công, giúp doanh nghiệp yên tâm xuất khẩu.",
    link: "/services/fda",
  },
  {
    image: "/china-customs-port-container-shipping-trade.jpg",
    title: "Tư vấn Mã GACC",
    description:
      "Từ 2021, xuất khẩu nông sản, thủy sản sang Trung Quốc bắt buộc phải có mã GACC. Không có mã này, container sẽ bị từ chối nhập cảng. Chúng tôi đồng hành cùng bạn trong toàn bộ quy trình đăng ký, cập nhật kịp thời các yêu cầu mới của Hải quan Trung Quốc.",
    link: "/services/gacc",
  },
  {
    image: "/korean-cosmetics-health-products-laboratory-qualit.jpg",
    title: "Tư vấn Giấy phép MFDS",
    description:
      "Xuất khẩu mỹ phẩm, thực phẩm chức năng sang Hàn Quốc cần giấy phép MFDS với yêu cầu rất nghiêm ngặt. Hồ sơ phức tạp, dễ bị từ chối nếu thiếu kinh nghiệm. Chúng tôi kiểm tra kỹ từng chi tiết, đảm bảo hồ sơ đạt chuẩn trước khi nộp.",
    link: "/services/mfds",
  },
  {
    image: "/us-customs-broker-agent-import-export-documentatio.jpg",
    title: "Dịch vụ US Agent",
    description:
      "FDA yêu cầu các nhà sản xuất nước ngoài phải có đại diện pháp lý tại Mỹ (US Agent). Đây là người liên hệ chính khi FDA có thông báo hoặc thanh tra. Chúng tôi cung cấp dịch vụ US Agent chuyên nghiệp, sẵn sàng hỗ trợ 24/7 khi cần thiết.",
    link: "/services/us-agent",
  },
  {
    image: "/ai-technology-blockchain-supply-chain-digital-trac.jpg",
    title: "Hệ thống Truy xuất nguồn gốc",
    description:
      "FDA yêu cầu truy xuất nguồn gốc từ 01/2026 theo quy định FSMA 204. Hệ thống của chúng tôi sử dụng công nghệ blockchain, giúp ghi nhận đầy đủ hành trình từ nguyên liệu đến thành phẩm. Tuân thủ quy định của FDA, EU và Trung Quốc về traceability.",
    link: "/services/ai-traceability",
    badge: "Công nghệ mới",
  },
  {
    image: "/international-trade-export-logistics-cargo-shippin.jpg",
    title: "Dịch vụ Ủy thác xuất khẩu",
    description:
      "Doanh nghiệp chưa có giấy phép xuất nhập khẩu vẫn có thể xuất hàng hợp pháp qua hình thức ủy thác. Vexim Global có đầy đủ giấy phép và kinh nghiệm, đảm bảo tuân thủ quy định Hải quan, xử lý đúng thuế VAT, giúp bạn xuất khẩu an toàn.",
    link: "/services/export-delegation",
  },
]

export function ServicesGrid() {
  return (
    <section id="services" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 text-balance">
            Giải pháp xuất khẩu toàn diện
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Đồng hành cùng doanh nghiệp Việt xuất khẩu an toàn, tuân thủ đầy đủ quy định quốc tế
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