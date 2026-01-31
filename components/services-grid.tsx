import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const services = [
  {
    image: "/fda-food-safety-inspection-laboratory-professional.jpg",
    title: "Đăng ký FDA 24h",
    description:
      "Xuất khẩu thực phẩm, mỹ phẩm sang Mỹ bắt buộc phải đăng ký FDA (21 CFR Part 1). Không có FDA Registration, hàng sẽ bị giữ l���i tại cảng Mỹ ngay. Chúng tôi hiểu rõ quy trình FDA, hướng dẫn chuẩn bị hồ sơ đầy đủ, đăng ký đúng cách, tránh bị từ chối.",
    link: "/services/fda",
  },
  {
    image: "/china-customs-port-container-shipping-trade.jpg",
    title: "Tư vãn Mã GACC",
    description:
      "Từ năm 2021, xuất khẩu nông sản, thủy sản sang Trung Quốc bắt buộc phải có Mã GACC (Decree 248/249). Thiếu mã này, container sẽ bị từ chối nhập cảng. Chúng tôi hỗ trợ toàn bộ thủ tục đăng ký mã GACC, theo dõi tiến độ, cập nhật yêu cầu mới của Hải quan TQ.",
    link: "/services/gacc",
  },
  {
    image: "/korean-cosmetics-health-products-laboratory-qualit.jpg",
    title: "Giấy phép MFDS - Hàn Quốc",
    description:
      "Xuất khẩu mỹ phẩm, thực phẩm chức năng sang Hàn Quốc cần giấy phép từ MFDS. Hồ sơ phức tạp, yêu cầu nghiêm ngặt về thành phần, nhãn mác. Chúng tôi hướng dẫn chuẩn bị hồ sơ, kiểm tra kỹ trước khi nộp, giúp tăng cơ hội được chấp thuận.",
    link: "/services/mfds",
  },
  {
    image: "/us-customs-broker-agent-import-export-documentatio.jpg",
    title: "Dịch vụ US Agent",
    description:
      "FDA quy định các cơ sở sản xuất thực phẩm nước ngoài phải có US Agent (21 CFR 1.33) - người đại diện pháp lý tại Mỹ. US Agent nhận thông báo từ FDA khi có vấn đề. Chúng tôi cung cấp dịch vụ US Agent đầy đủ, hỗ trợ xử lý nếu có phát sinh.",
    link: "/services/us-agent",
  },
  {
    image: "/ai-technology-blockchain-supply-chain-digital-trac.jpg",
    title: "Nền tảng truy xuất nguồn gốc",
    description:
      "FDA yêu cầu truy xuất nguồn gốc từ 01/2026 (FSMA Rule 204). Hệ thống của chúng tôi giúp doanh nghiệp ghi nhận đầy đủ thông tin từ nguyên liệu đến thành phẩm, sử dụng công nghệ blockchain bảo mật. Tuân thủ quy định FDA, EU, Trung Quốc về traceability.",
    link: "/services/ai-traceability",
    badge: "Công nghệ mới",
  },
  {
    image: "/international-trade-export-logistics-cargo-shippin.jpg",
    title: "Ủy thác xuất khẩu",
    description:
      "Doanh nghiệp chưa có giấy phép xuất nhập khẩu vẫn có thể xuất hàng thông qua hình thức ủy thác (Nghị định 69/2018/NĐ-CP). Vexim Global có đầy đủ giấy phép, đảm bảo tuân thủ quy định Hải quan, thuế VAT, giúp bạn xuất khẩu hợp pháp và an toàn.",
    link: "/services/export-delegation",
  },
]

export function ServicesGrid() {
  return (
    <section id="services" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 text-balance">
            Dịch vụ tư vấn pháp lý xuất nhập khẩu
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Giúp doanh nghiệp Việt Nam xuất khẩu đúng luật, tránh rủi ro bị giữ hàng
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
