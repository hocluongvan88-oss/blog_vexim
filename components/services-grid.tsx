import { getService } from "@/lib/business-profile"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"

/**
 * Ảnh dịch vụ đều là ảnh vuông 1024x1024, chủ thể (người) nằm lệch phía trên.
 * `focus` = object-position để khung 4:3 không cắt mất đầu/chủ thể.
 *
 * Danh sách dịch vụ lấy từ `SERVICE_CATALOG` (lib/business-profile.ts) — cùng nguồn
 * với `hasOfferCatalog` trong schema trang chủ, nên card trên trang và node Service
 * trong JSON-LD không bao giờ lệch nhau. File này chỉ giữ phần TRÌNH BÀY
 * (ảnh, vị trí cắt ảnh, gạch đầu dòng).
 */
const PRESENTATION: Record<string, { image: string; focus: string; fit?: "contain"; items: string[] }> = {
  "fda-registration": {
    image: "/fda-food-safety-inspection-laboratory-professional.jpg",
    focus: "50% 20%",
    items: ["Đăng ký mã DUNS miễn phí", "Food Facility Registration", "Gia hạn FDA định kỳ"],
  },
  mocra: {
    image: "/mocra-cosmetics-fda-registration.jpg",
    focus: "50% 30%",
    items: ["Cosmetic Product Listing", "Đăng ký cơ sở mỹ phẩm", "Tư vấn Adverse Event"],
  },
  "us-agent": {
    image: "/us-customs-broker-agent-import-export-documentatio.jpg",
    focus: "50% 25%",
    items: ["Đại diện liên lạc 24/7", "Phản hồi thông báo từ FDA", "Hỗ trợ thanh tra cơ sở"],
  },
  "export-sales": {
    image: "/landing/audience-team.jpg",
    focus: "50% 35%",
    items: ["Tiếp cận buyer Mỹ phù hợp ngành hàng", "Hỗ trợ tuân thủ & đàm phán", "Tối ưu nguồn lực vận hành"],
  },
  "export-digital": {
    image: "/images/og-export-digital.png",
    focus: "50% 50%",
    fit: "contain",
    items: ["Website & câu chuyện xuất khẩu", "Bổ trợ gian hàng B2B", "Báo cáo miễn phí trong 2 ngày làm việc"],
  },
  "llc-ein": {
    image: "/llc-formation-usa-business.jpg",
    focus: "50% 30%",
    items: ["Đăng ký công ty LLC", "Xin mã số thuế EIN", "Mở tài khoản ngân hàng Mỹ"],
  },
}

/** Giữ vị trí các card; Export Digital thay cho FSVP. */
const CARD_ORDER = ["fda-registration", "mocra", "us-agent", "export-sales", "export-digital", "llc-ein"]

const services = CARD_ORDER.map((key) => {
  const service = getService(key)
  const presentation = PRESENTATION[key]
  if (!service || !presentation) return null
  return { ...service, ...presentation }
}).filter((service): service is NonNullable<typeof service> => service !== null)

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
          {services.map((service) => (
            /*
              Card là <div>, không bọc ngoài bằng <Link>: nếu bọc thì anchor
              "xem chi tiết" bên trong sẽ nằm TRONG một <a> khác — HTML không hợp lệ
              (nested <a>), trình duyệt tự phá cấu trúc và cả hai link đều hỏng.
              Link thật nằm ở tiêu đề (H3) và ở anchor chứa từ khóa phía dưới.
            */
            <div key={service.key} className="group h-full">
              <Card className="overflow-hidden rounded-xl border-border/80 shadow-sm hover:shadow-xl hover:border-sky-200 transition-all duration-300 p-0 hover:-translate-y-1.5 h-full flex flex-col">
                {/* Khung ảnh 4:3 + vị trí cắt riêng từng ảnh để không cắt đầu chủ thể */}
                <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={`${service.name} — Vexim Global`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    style={{ objectPosition: service.focus }}
                    className={`${service.fit === "contain" ? "object-contain" : "object-cover"} w-full group-hover:scale-105 transition-transform duration-500`}
                  />
                  {/* Viền chuyển nhẹ đáy ảnh */}
                  <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-navy-950/25 to-transparent" aria-hidden="true" />
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-navy-900 mb-3 group-hover:text-accent transition-colors">
                    <Link
                      href={service.path}
                      className="hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                    >
                      {service.name}
                    </Link>
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
                  {/*
                    Anchor có chứa từ khóa thay cho "Tìm hiểu thêm" chung chung:
                    anchor text là tín hiệu ngữ cảnh mạnh nhất mà trang chủ truyền
                    cho landing page, và "Tìm hiểu thêm" thì không nói lên trang đích
                    là trang gì. Mỗi dịch vụ trỏ tới landing page riêng của nó.
                  */}
                  <div className="mt-auto pt-1">
                    <Link
                      href={service.path}
                      className="text-accent font-semibold inline-flex items-center gap-2 hover:gap-3 transition-all text-sm underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                    >
                      {service.anchor}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
