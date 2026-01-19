import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const services = [
  {
    image: "/fda-food-safety-inspection-laboratory-professional.jpg",
    title: "Đăng ký FDA Registration",
    description:
      "Theo 21 CFR Part 1, thực phẩm và mỹ phẩm nhập khẩu Mỹ bắt buộc FDA Food Facility Registration. Thiếu registration dẫn đến Import Alert, tạm giữ tại cảng. Chúng tôi xử lý hồ sơ tuân thủ FDA cMajor và Minor Violations, đảm bảo compliance với FSMA, FSVP.",
    link: "/services/fda",
  },
  {
    image: "/china-customs-port-container-shipping-trade.jpg",
    title: "Tư vấn Mã GACC (Registration Code)",
    description:
      "GACC Decree 248/249 (2021) quy định bắt buộc mã đăng ký cho xuất khẩu nông sản, thủy sản sang Trung Quốc. Thiếu GACC Code, container bị từ chối nhập cảng. Chúng tôi hỗ trợ registration với GACC và e-CIQ system theo yêu cầu mới nhất.",
    link: "/services/gacc",
  },
  {
    image: "/korean-cosmetics-health-products-laboratory-qualit.jpg",
    title: "Giấy phép MFDS Korea",
    description:
      "Food Sanitation Act và Cosmetics Act (Hàn Quốc) yêu cầu Import Notification cho thực phẩm, CPNP registration cho mỹ phẩm. Chúng tôi tư vấn đầy đủ hồ sơ tuân thủ Ministry of Food and Drug Safety (MFDS), bao gồm labeling standards và safety assessment.",
    link: "/services/mfds",
  },
  {
    image: "/us-customs-broker-agent-import-export-documentatio.jpg",
    title: "US Agent Services (FDA Compliance)",
    description:
      "FDA 21 CFR 1.33 bắt buộc foreign facilities phải có US Agent làm đại diện pháp lý tại Mỹ. US Agent là communication liaison nhận FDA Warning Letters, Import Alerts. Chúng tôi cung cấp registered US Agent service với full regulatory support.",
    link: "/services/us-agent",
  },
  {
    image: "/ai-technology-blockchain-supply-chain-digital-trac.jpg",
    title: "Traceability Platform (FSMA 204 Compliance)",
    description:
      "FDA FSMA Rule 204 (hiệu lực 1/2026) yêu cầu traceability records cho high-risk foods. Nền tảng blockchain-based của chúng tôi giúp doanh nghiệp comply với FDA traceability requirements, EU Regulation 178/2002, và China Food Safety Law. Đảm bảo data integrity và audit trail.",
    link: "/services/ai-traceability",
    badge: "FSMA 204 Ready",
  },
  {
    image: "/international-trade-export-logistics-cargo-shippin.jpg",
    title: "Ủy thác xuất khẩu (Export Agency)",
    description:
      "Nghị định 69/2018/NĐ-CP cho phép doanh nghiệp không có giấy phép xuất nhập khẩu ủy thác cho đơn vị được cấp phép. Vexim Global đảm bảo tuân thủ Customs Law, VAT regulations, và export documentation requirements theo quy định Hải quan Việt Nam.",
    link: "/services/export-delegation",
  },
]

export function ServicesGrid() {
  return (
    <section id="services" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 text-balance">
            Dịch vụ Regulatory Affairs & Compliance
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Giải pháp tuân thủ pháp lý toàn diện cho doanh nghiệp xuất khẩu Việt Nam
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
