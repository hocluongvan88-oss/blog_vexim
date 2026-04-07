import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const services = [
  {
    image: "/fda-food-safety-inspection-laboratory-professional.jpg",
    title: "Đăng ký FDA & DUNS",
    description:
      "Xuất khẩu thực phẩm sang Mỹ bắt buộc phải có FDA Registration và DUNS lâm định danh (UFI). Vexim hỗ trợ trong gói từ đăng ký mã DUNS đến hoàn tất hồ sơ FDA.",
    items: [
      "Đăng ký mã DUNS chuẩn xác",
      "Food Facility Registration",
      "Gia hạn FDA định kỳ"
    ],
    link: "/services/fda",
  },
  {
    image: "/mocra-cosmetics-fda-registration.jpg",
    title: "Tuân thủ MoCRA",
    description:
      "Đáp ứng Đạo luật hiện đại hóa Mỹ phẩm (MoCRA) năm 2022. Thực hiện đăng ký cơ sở sản xuất và Listing sản phẩm bắt buộc lên hệ thống FDA Mỹ.",
    items: [
      "Cosmetic Product Listing",
      "Đăng ký cơ sở Mỹ phẩm",
      "Tư vấn Adverse Event"
    ],
    link: "/services/cosmetics/mocra-registration",
  },
  {
    image: "/us-customs-broker-agent-import-export-documentatio.jpg",
    title: "US Agent & RP",
    description:
      "Cung cấp đại diện pháp lý tại Mỹ cho thực phẩm (US Agent) và người chịu trách nhiệm cho mỹ phẩm (Responsible Person) theo đúng quy định liên bang.",
    items: [
      "Đại diện liên lạc 24/7",
      "Phản hồi thông báo từ FDA",
      "Hỗ trợ thanh tra cơ sở"
    ],
    link: "/services/us-agent",
  },
  {
    image: "/korean-cosmetics-health-products-laboratory-qualit.jpg",
    title: "Kiểm tra Nhãn & Thành phần",
    description:
      "Rà soát bảng thành phần (Ingredients) và thiết kế nhãn (Nutrition Facts) theo chuẩn 21 CFR. Tránh rủi ro hàng sẽ bị giữ lại tại cảng do lỗi trình bày.",
    items: [
      "Review Ingredients chuyên sâu",
      "Sửa nhãn chuẩn 21 CFR",
      "Kiểm soát Health Claims"
    ],
    link: "/services/fda-label-check",
  },
  {
    image: "/fsvp-compliance-food-import.jpg",
    title: "FSVP Importer & Plan",
    description:
      "Đóng vai trò là đơn vị nhập khẩu FSVP tại Mỹ, xây dựng kế hoạch kiểm soát nhà cung cấp nước ngoài đáp ứng quy định khắt khe của FSMA.",
    items: [
      "Chỉ định FSVP Importer",
      "Thiết lập FSVP Plan",
      "Đánh giá nhà cung cấp"
    ],
    link: "/services/fsvp",
  },
  {
    image: "/llc-formation-usa-business.jpg",
    title: "Thành lập LLC & EIN",
    description:
      "Hỗ trợ thành lập công ty LLC tại Mỹ, xin mã số thuế EIN để doanh nghiệp tự đứng tên nhập khẩu và vận hành chuyên nghiệp, thời gian nhanh chóng.",
    items: [
      "Đăng ký công ty LLC",
      "Xin mã số thuế EIN",
      "Mở tài khoản ngân hàng Mỹ"
    ],
    link: "/services/llc-ein",
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
                  <p className="text-muted-foreground mb-4 leading-relaxed text-sm">{service.description}</p>
                  <ul className="space-y-2 mb-4">
                    {service.items.map((item, idx) => (
                      <li key={idx} className="text-sm text-primary hover:text-accent transition-colors">
                        <span className="inline-block mr-2">•</span>{item}
                      </li>
                    ))}
                  </ul>
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
