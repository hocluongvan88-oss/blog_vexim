import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"

/**
 * Ảnh dịch vụ đều là ảnh vuông 1024x1024, chủ thể (người) nằm lệch phía trên.
 * `focus` = object-position để khung 4:3 không cắt mất đầu/chủ thể.
 */
const services = [
  {
    image: "/fda-food-safety-inspection-laboratory-professional.jpg",
    focus: "50% 20%",
    title: "Đăng ký FDA & DUNS",
    description:
      "Xuất khẩu thực phẩm sang Mỹ bắt buộc phải có FDA Registration và DUNS lâm định danh (UFI). Vexim hỗ trợ trong gói từ đăng ký mã DUNS đến hoàn tất hồ sơ FDA.",
    items: ["Đăng ký mã DUNS miễn phí", "Food Facility Registration", "Gia hạn FDA định kỳ"],
    link: "/services/fda",
  },
  {
    image: "/mocra-cosmetics-fda-registration.jpg",
    focus: "50% 30%",
    title: "Tuân thủ MoCRA",
    description:
      "Đáp ứng Đạo luật hiện đại hóa Mỹ phẩm (MoCRA) năm 2022. Thực hiện đăng ký cơ sở sản xuất và Listing sản phẩm bắt buộc lên hệ thống FDA Mỹ.",
    items: ["Cosmetic Product Listing", "Đăng ký cơ sở Mỹ phẩm", "Tư vấn Adverse Event"],
    link: "/services/cosmetics/mocra-registration",
  },
  {
    image: "/us-customs-broker-agent-import-export-documentatio.jpg",
    focus: "50% 25%",
    title: "US Agent & RP",
    description:
      "Cung cấp đại diện pháp lý tại Mỹ cho thực phẩm (US Agent) và người chịu trách nhiệm cho mỹ phẩm (Responsible Person) theo đúng quy định liên bang.",
    items: ["Đại diện liên lạc 24/7", "Phản hồi thông báo từ FDA", "Hỗ trợ thanh tra cơ sở"],
    link: "/services/us-agent",
  },
  {
    image: "/landing/audience-team.jpg",
    focus: "50% 35%",
    title: "Phòng Sale Xuất Khẩu",
    description:
      "Phòng kinh doanh xuất khẩu thuê ngoài trọn gói cho nhà máy Việt sang Mỹ. Tìm buyer thẩm định, đàm phán thương mại và hỗ trợ tuân thủ.",
    items: ["Tiếp cận buyer Mỹ phù hợp ngành hàng", "Hỗ trợ tuân thủ & đàm phán", "Tối ưu nguồn lực vận hành"],
    link: "/services/export-sales",
  },
  {
    image: "/fsvp-compliance-food-import.jpg",
    focus: "50% 10%",
    title: "FSVP Importer & Plan",
    description:
      "Đóng vai trò là đơn vị nhập khẩu FSVP tại Mỹ, xây dựng kế hoạch kiểm soát nhà cung cấp nước ngoài đáp ứng quy định khắt khe của FSMA.",
    items: ["Chỉ định FSVP Importer", "Thiết lập FSVP Plan", "Đánh giá nhà cung cấp"],
    link: "/services/fsvp",
  },
  {
    image: "/llc-formation-usa-business.jpg",
    focus: "50% 30%",
    title: "Thành lập LLC & EIN",
    description:
      "Hỗ trợ thành lập công ty LLC tại Mỹ, xin mã số thuế EIN để doanh nghiệp tự đứng tên nhập khẩu và vận hành chuyên nghiệp, thời gian nhanh chóng.",
    items: ["Đăng ký công ty LLC", "Xin mã số thuế EIN", "Mở tài khoản ngân hàng Mỹ"],
    link: "/services/llc-ein",
  },
]

export function ServicesGrid() {
  return (
    <section id="services" className="py-16 md:py-24 bg-secondary/40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-accent-soft px-4 py-1.5 text-sm font-medium text-accent mb-4">
            Dịch vụ của chúng tôi
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900 mb-4 text-balance">
            Giải pháp xuất khẩu toàn diện
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Đồng hành cùng doanh nghiệp Việt xuất khẩu an toàn, tuân thủ đầy đủ quy định quốc tế
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <Link key={index} href={service.link} className="group h-full">
              <Card className="overflow-hidden rounded-xl border-border/80 shadow-sm hover:shadow-xl hover:border-sky-200 transition-all duration-300 p-0 cursor-pointer hover:-translate-y-1.5 h-full flex flex-col">
                {/* Khung ảnh 4:3 + vị trí cắt riêng từng ảnh để không cắt đầu chủ thể */}
                <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    style={{ objectPosition: service.focus }}
                    className="object-cover w-full group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Viền chuyển nhẹ đáy ảnh */}
                  <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-navy-950/25 to-transparent" aria-hidden="true" />
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-navy-900 mb-3 group-hover:text-accent transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed text-sm">{service.description}</p>
                  <ul className="space-y-2 mb-5">
                    {service.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto text-accent font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all text-sm">
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
