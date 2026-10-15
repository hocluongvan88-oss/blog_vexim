import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ExternalLink,
  FileCheck2,
  FileText,
  Globe2,
  Handshake,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  ShieldCheck,
  Wallet,
  X,
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { FdaLeadForm } from "@/components/fda/lead-form"
import { JsonLd } from "@/components/json-ld"
import { ADDRESS, PUBLIC_EMAIL, SITE_URL } from "@/lib/business-profile"
import { VEXIM_CREDENTIALS_URL, VEXIM_PHONE_DISPLAY, VEXIM_PHONE_TEL_URL } from "@/lib/contact-info"
import {
  FDA_COMPARISON,
  FDA_FAQS,
  FDA_HERO_IMAGE,
  FDA_LANDING_MEDIA,
  FDA_LANDING_PROCESS,
  FDA_LIBRA_CASE,
  FDA_LIBRA_STEPS,
  FDA_PAGE,
  FDA_PARTNERS,
  FDA_PROBLEMS,
  FDA_SOURCES,
} from "@/lib/fda-page-content"
import { buildFdaPageSchema } from "@/lib/fda-page-schema"

const pageUrl = `${SITE_URL}${FDA_PAGE.path}`
const shareImage = { url: `${SITE_URL}${FDA_PAGE.image}`, width: 1200, height: 630, alt: FDA_PAGE.imageAlt }

export const metadata: Metadata = {
  title: { absolute: FDA_PAGE.title },
  description: FDA_PAGE.description,
  alternates: { canonical: pageUrl },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Vexim Global",
    url: pageUrl,
    title: FDA_PAGE.title,
    description: FDA_PAGE.description,
    images: [shareImage],
  },
  twitter: {
    card: "summary_large_image",
    title: FDA_PAGE.title,
    description: FDA_PAGE.description,
    images: [{ url: shareImage.url, alt: FDA_PAGE.imageAlt }],
  },
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
      <h2 className="text-balance text-3xl font-bold leading-tight text-primary md:text-4xl">{title}</h2>
      {description && (
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          {description}
        </p>
      )}
    </div>
  )
}

/** Never substitute another client's documents when approved case images are absent. */
function MediaPanel({
  mediaKey,
  label,
  alt,
  className = "",
}: {
  mediaKey: string
  label: string
  alt: string
  className?: string
}) {
  const src = FDA_LANDING_MEDIA[mediaKey]
  return (
    <div
      className={`relative flex min-h-64 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 ${className}`}
    >
      {src ? (
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0"
          aria-label={`Xem ảnh đầy đủ: ${label}`}
        >
          <Image src={src} alt={alt} fill sizes="(max-width: 767px) 100vw, 560px" className="object-contain p-4" />
        </a>
      ) : (
        <div className="max-w-xs px-6 py-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white text-accent shadow-sm">
            <FileCheck2 className="h-8 w-8" aria-hidden="true" />
          </div>
          <p className="font-semibold text-primary">{label}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Ảnh sẽ được bổ sung từ hồ sơ được phép công bố.
          </p>
        </div>
      )}
    </div>
  )
}

export default function FDAPage() {
  return (
    <>
      <JsonLd id="fda-page-schema" data={buildFdaPageSchema()} />
      <Header />
      <main id="main-content">
        {/* Rebuilt to match the reference: photographic hero + directly usable lead form. */}
        <section id="fda-hero" className="relative isolate overflow-hidden pb-14 pt-28 md:pb-20 md:pt-36">
          <Image
            src={FDA_HERO_IMAGE}
            alt="Minh họa cảng container và hoạt động xuất khẩu hàng hóa"
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover object-center"
          />
          <div className="absolute inset-0 -z-10 bg-black/35" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/75 via-black/35 to-black/5" />
          <div className="container mx-auto px-4">
            <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_0.85fr] lg:gap-16">
              <div className="py-3 text-white md:py-8">
                <nav aria-label="Đường dẫn trang" className="mb-7 text-sm text-white/80">
                  <ol className="flex items-center gap-2">
                    <li>
                      <Link href="/" className="hover:text-white hover:underline">
                        Trang chủ
                      </Link>
                    </li>
                    <li aria-hidden="true">
                      <ChevronRight className="h-3 w-3" />
                    </li>
                    <li aria-current="page">Đăng ký FDA</li>
                  </ol>
                </nav>
                <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/15 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                  <Globe2 className="h-4 w-4 text-amber-300" aria-hidden="true" />
                  Đồng hành cùng doanh nghiệp xuất khẩu Mỹ
                </p>
                <h1 className="text-balance text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">
                  Dịch vụ đăng ký FDA <span className="mt-3 block text-amber-300">Vững bước vào thị trường Mỹ</span>
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/90">
                  Vexim Global đồng hành từ tư vấn, chuẩn bị hồ sơ đến đăng ký và hỗ trợ sau đăng ký. Làm rõ yêu cầu
                  FDA, DUNS và US Agent để doanh nghiệp chủ động kế hoạch xuất khẩu.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild variant="cta" size="lg" className="min-h-12 h-auto px-6 py-3 text-base">
                    <a href="#fda-contact">
                      Nhận tư vấn đăng ký FDA <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="min-h-12 border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                  >
                    <a href="#case-studies">
                      Xem case study Libra <ArrowDown className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </Button>
                </div>
                <div className="mt-10 grid grid-cols-3 gap-3 border-t border-white/25 pt-6">
                  {[
                    { value: "FDA & DUNS", label: "Hồ sơ rõ ràng" },
                    { value: "US Agent", label: "Đầu mối tại Mỹ" },
                    { value: "24 giờ", label: "Phản hồi tư vấn" },
                  ].map((item) => (
                    <div key={item.value}>
                      <p className="text-lg font-bold md:text-xl">{item.value}</p>
                      <p className="mt-1 text-xs text-white/75 sm:text-sm">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-white/60 bg-white p-5 shadow-2xl sm:p-7 lg:ml-auto lg:w-full lg:max-w-md">
                <div className="mb-6 border-b border-border pb-5">
                  <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">
                    Bắt đầu từ nhu cầu của bạn
                  </p>
                  <h2 className="text-2xl font-bold text-primary">Nhận tư vấn miễn phí</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Điền thông tin, chúng tôi liên hệ trong vòng 24 giờ.
                  </p>
                </div>
                <FdaLeadForm compact />
              </div>
            </div>
          </div>
        </section>

        <section id="problems" className="bg-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <SectionHeading
              eyebrow="Thấu hiểu doanh nghiệp"
              title="Bạn gặp phải những vấn đề này khi đăng ký FDA?"
              description="Chúng tôi hiểu những thách thức khi đưa sản phẩm Việt Nam vào thị trường Hoa Kỳ và cùng doanh nghiệp xác định hướng xử lý phù hợp."
            />
            <div className="grid gap-4 md:grid-cols-2 lg:gap-6">
              {FDA_PROBLEMS.map((item, index) => (
                <article
                  key={item.problem}
                  className="rounded-xl border border-border p-5 transition-shadow hover:shadow-md md:p-6"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-bold tracking-widest text-slate-400">0{index + 1}</span>
                    <MessageSquareText className="h-5 w-5 text-slate-300" aria-hidden="true" />
                  </div>
                  <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                    Vấn đề
                  </p>
                  <h3 className="text-lg font-semibold text-primary">{item.problem}</h3>
                  <div className="mt-5 rounded-lg bg-secondary/60 p-4">
                    <p className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-accent">
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                      Giải pháp
                    </p>
                    <p className="text-sm font-medium leading-relaxed text-primary">{item.solution}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="why-vexim" className="bg-slate-50 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <SectionHeading
              eyebrow="Giá trị Vexim mang lại"
              title="Tại sao chọn Vexim Global?"
              description="Một đầu mối đồng hành, phạm vi công việc rõ ràng và kế hoạch phù hợp với từng doanh nghiệp."
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Clock3,
                  title: "Nhanh chóng",
                  text: "Rà soát thông tin từ đầu, xác định thứ tự công việc để hạn chế việc phải bổ sung nhiều lần.",
                },
                {
                  icon: Wallet,
                  title: "Tiết kiệm",
                  text: "Làm rõ từng hạng mục trong báo giá, chủ động ngân sách trước khi bắt đầu thực hiện.",
                },
                {
                  icon: ShieldCheck,
                  title: "An tâm",
                  text: "Trao đổi trực tiếp về hồ sơ, đầu mối US Agent và những nghĩa vụ cần theo dõi sau đăng ký.",
                },
                {
                  icon: Handshake,
                  title: "Uy tín",
                  text: "Có hồ sơ năng lực và trường hợp khách hàng công khai để doanh nghiệp tự tham khảo.",
                },
              ].map(({ icon: Icon, title, text }) => (
                <article key={title} className="rounded-xl border border-border bg-white p-6 text-center">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-accent">
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-primary">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </article>
              ))}
            </div>
            <div className="mt-8 rounded-xl border border-border bg-white px-6 py-7 text-center md:px-10">
              <h3 className="text-xl font-bold text-primary">Dịch vụ FDA theo từng nhóm sản phẩm</h3>
              <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Thực phẩm, mỹ phẩm và các lĩnh vực khác có yêu cầu riêng. Phân loại sản phẩm trước khi xác nhận thủ tục,
                không áp dụng một quy trình chung cho mọi ngành hàng.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {[
                  { label: "Thực phẩm", href: "/services/food/fda-registration" },
                  { label: "Mỹ phẩm / MoCRA", href: "/services/cosmetics/mocra-registration" },
                  { label: "US Agent", href: "/services/us-agent" },
                  { label: "FSVP", href: "/services/fsvp" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="rounded-full bg-secondary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-accent hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
                {["Thiết bị y tế", "Thực phẩm chức năng", "Dược phẩm"].map((label) => (
                  <a
                    key={label}
                    href="#fda-contact"
                    className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground hover:border-accent hover:text-primary"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="comparison" className="bg-white py-16 md:py-24">
          <div className="container mx-auto max-w-6xl px-4">
            <SectionHeading
              eyebrow="Lựa chọn có cơ sở"
              title="Những ưu điểm của Vexim Global"
              description="Đối chiếu các tiêu chí quan trọng trước khi lựa chọn dịch vụ FDA, thay vì chỉ so sánh một mức giá hoặc thời gian quảng cáo."
            />
            <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
              <div
                className="overflow-x-auto"
                role="region"
                aria-label="So sánh các tiêu chí lựa chọn dịch vụ FDA"
                tabIndex={0}
              >
                <table className="w-full min-w-[660px] text-left">
                  <caption className="sr-only">
                    Phạm vi của Vexim và các điểm doanh nghiệp nên kiểm tra khi so sánh dịch vụ
                  </caption>
                  <thead>
                    <tr className="bg-slate-50 text-primary">
                      <th scope="col" className="p-5 text-sm font-semibold">
                        Tiêu chí
                      </th>
                      <th scope="col" className="bg-primary p-5 text-sm font-bold text-white">
                        <span className="inline-flex items-center gap-2">
                          <BadgeCheck className="h-5 w-5 text-amber-300" aria-hidden="true" />
                          Vexim Global
                        </span>
                      </th>
                      <th scope="col" className="p-5 text-sm font-semibold">
                        Khi so sánh dịch vụ
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {FDA_COMPARISON.map((item) => (
                      <tr key={item.label} className="border-t border-border">
                        <th scope="row" className="p-5 text-sm font-semibold text-primary">
                          {item.label}
                        </th>
                        <td className="bg-secondary/40 p-5">
                          <div className="flex items-start gap-2">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                            <span className="text-sm leading-relaxed text-primary">{item.vexim}</span>
                          </div>
                        </td>
                        <td className="p-5 text-sm leading-relaxed text-muted-foreground">{item.check}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Vuốt ngang để xem đủ bảng trên điện thoại. Phạm vi cụ thể được xác nhận trong báo giá.
            </p>
            <div className="mt-8 text-center">
              <Button asChild variant="cta" size="lg" className="min-h-12 h-auto whitespace-normal py-3">
                <a href="#fda-contact">
                  So sánh nhu cầu và nhận tư vấn <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section id="process" className="bg-slate-50 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <SectionHeading
              eyebrow="Rõ từng bước, sát tiến độ"
              title="Quy trình đăng ký FDA tại Vexim Global"
              description="5 bước đồng hành cùng doanh nghiệp từ xác định yêu cầu đến bàn giao và hỗ trợ sau đăng ký."
            />
            <ol className="relative grid gap-5 md:grid-cols-5">
              {FDA_LANDING_PROCESS.map((step, index) => (
                <li key={step.title} className="relative rounded-xl border border-border bg-white p-5 text-center">
                  <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
                    {index + 1}
                  </div>
                  <h3 className="min-h-12 text-base font-bold text-primary">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                  <p className="mt-5 rounded-full bg-secondary px-2 py-2 text-xs font-semibold text-accent">
                    {step.note}
                  </p>
                </li>
              ))}
            </ol>
            <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-relaxed text-muted-foreground">
              Thời gian dự kiến được thống nhất khi đã rà soát đủ hồ sơ. Đăng ký không đồng nghĩa FDA phê duyệt sản
              phẩm; cơ sở thực phẩm thuộc diện áp dụng gia hạn từ 01/10 đến 31/12 năm chẵn.
            </p>
          </div>
        </section>

        <section id="documents" className="bg-white py-16 md:py-24">
          <div className="container mx-auto max-w-6xl px-4">
            <SectionHeading
              eyebrow="Uy tín được kiểm chứng"
              title="Hồ sơ & Xác nhận đăng ký thực tế"
              description="Phân biệt hồ sơ đăng ký trên hệ thống FDA với giấy xác nhận do đơn vị dịch vụ phát hành. Tham khảo tư liệu được Vexim công bố trong hồ sơ năng lực."
            />
            <div className="grid gap-7 md:grid-cols-2">
              {[
                {
                  key: "registration",
                  title: "Form FDA 3537",
                  subtitle: "Thông tin đăng ký cơ sở thực phẩm",
                  note: "Biểu mẫu đăng ký cơ sở cần được hiểu theo đúng phạm vi Food Facility Registration; không phải chứng nhận chất lượng sản phẩm.",
                },
                {
                  key: "certificate",
                  title: "Xác nhận đăng ký từ Vexim",
                  subtitle: "Thông tin bàn giao từ đơn vị dịch vụ",
                  note: "Giấy xác nhận do Vexim phát hành không phải chứng nhận của FDA. FDA không cấp chứng nhận đăng ký cơ sở thực phẩm.",
                },
              ].map((doc) => (
                <article key={doc.key} className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
                  <div className="flex items-start gap-3 border-b border-border p-6">
                    <div className="rounded-lg bg-secondary p-2.5 text-accent">
                      <FileText className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-primary">{doc.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{doc.subtitle}</p>
                    </div>
                  </div>
                  <div className="p-5">
                    <MediaPanel mediaKey={doc.key} label={doc.title} alt={doc.subtitle} className="min-h-80" />
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{doc.note}</p>
                    <a
                      href={VEXIM_CREDENTIALS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent hover:underline"
                    >
                      Xem hồ sơ được công bố <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="case-studies" className="bg-slate-50 py-16 md:py-24">
          <div id="case-libra" className="container mx-auto max-w-6xl px-4">
            <SectionHeading
              eyebrow="Case study"
              title="Hành trình thành công của Libra"
              description={`Vexim Global đồng hành cùng ${FDA_LIBRA_CASE.company} chuẩn bị hồ sơ phục vụ xuất khẩu bánh kẹo sang thị trường Mỹ.`}
            />
            <div className="space-y-6 md:space-y-10">
              {FDA_LIBRA_STEPS.map((step, index) => (
                <article
                  key={step.media}
                  className="grid overflow-hidden rounded-2xl border border-border bg-white md:grid-cols-2"
                >
                  <div className={`p-5 md:p-7 ${index % 2 ? "md:order-2" : ""}`}>
                    <MediaPanel
                      mediaKey={step.media}
                      label={step.mediaLabel}
                      alt={`${step.mediaLabel} của ${FDA_LIBRA_CASE.company}`}
                      className="h-full min-h-64 md:min-h-72"
                    />
                  </div>
                  <div className={`flex flex-col justify-center px-6 pb-8 md:p-10 ${index % 2 ? "md:order-1" : ""}`}>
                    <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-accent">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      Bước {index + 1}
                    </span>
                    <h3 className="text-2xl font-bold text-primary">{step.title}</h3>
                    <p className="mt-3 text-sm font-semibold text-primary">{step.subtitle}</p>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                      {step.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
            <p className="mx-auto mt-7 max-w-3xl text-center text-xs leading-relaxed text-muted-foreground">
              {FDA_LIBRA_CASE.note}
            </p>
            <div className="mt-8 text-center">
              <p className="mb-4 text-lg font-semibold text-primary">
                Bạn đã sẵn sàng cho hành trình xuất khẩu của mình?
              </p>
              <Button asChild variant="cta" size="lg" className="min-h-12">
                <a href="#fda-contact">
                  Liên hệ tư vấn miễn phí <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section id="partners" className="border-y border-border bg-white py-10 md:py-14">
          <div className="container mx-auto px-4">
            <h2 className="text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Đối tác đồng hành cùng Vexim Global
            </h2>
            <div className="mx-auto mt-7 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {FDA_PARTNERS.map((partner) => (
                <div
                  key={partner.name}
                  className="relative flex h-24 items-center justify-center rounded-xl border border-border px-4"
                >
                  {FDA_LANDING_MEDIA[partner.media] ? (
                    <Image
                      src={FDA_LANDING_MEDIA[partner.media]!}
                      alt={`Logo ${partner.name}`}
                      fill
                      sizes="200px"
                      className="object-contain p-5"
                    />
                  ) : (
                    <span className="text-center text-lg font-bold tracking-wide text-primary/70">{partner.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="fda-contact" className="scroll-mt-24 bg-secondary/40 py-16 md:py-24">
          <div className="container mx-auto max-w-6xl px-4">
            <SectionHeading
              eyebrow="Kết nối với Vexim"
              title="Bắt đầu hành trình của bạn ngay hôm nay"
              description="Để lại thông tin, chúng tôi sẽ liên hệ tư vấn miễn phí trong vòng 24 giờ."
            />
            <div className="grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
              <div>
                <h3 className="text-2xl font-bold text-primary">Thông tin liên hệ</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Liên hệ trực tiếp với chúng tôi qua các kênh sau.
                </p>
                <div className="mt-7 space-y-4">
                  <div className="flex gap-4 rounded-xl border border-border bg-white p-5">
                    <Building2 className="mt-1 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-bold text-primary">VEXIM GLOBAL COMPANY LIMITED</p>
                      <p className="mt-2 text-sm text-muted-foreground">MST: 0111040294</p>
                    </div>
                  </div>
                  <div className="flex gap-4 rounded-xl border border-border bg-white p-5">
                    <MapPin className="mt-1 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-semibold text-primary">Văn phòng Việt Nam</p>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {ADDRESS.streetAddress}, {ADDRESS.addressLocality}, Việt Nam
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 rounded-xl border border-border bg-white p-5">
                    <Globe2 className="mt-1 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-semibold text-primary">U.S. Agent (Mỹ)</p>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        Vexim Global LLC
                        <br />
                        1207 Delaware Ave
                        <br />
                        Wilmington, DE 19806, United States
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">EIN: 35-2957758</p>
                    </div>
                  </div>
                  <div className="flex gap-4 rounded-xl border border-border bg-white p-5">
                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Email</p>
                      <a
                        href={`mailto:${PUBLIC_EMAIL}`}
                        className="mt-1 inline-block break-all text-sm font-semibold text-primary hover:text-accent"
                      >
                        {PUBLIC_EMAIL}
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-4 rounded-xl border border-border bg-white p-5">
                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                    <div>
                      <p className="text-xs text-muted-foreground">Hotline</p>
                      <a
                        href={VEXIM_PHONE_TEL_URL}
                        className="mt-1 inline-block text-lg font-bold text-primary hover:text-accent"
                      >
                        {VEXIM_PHONE_DISPLAY}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-white p-5 shadow-lg shadow-primary/5 sm:p-8">
                <div className="mb-6 flex items-start gap-3 border-b border-border pb-5">
                  <div className="rounded-xl bg-secondary p-3 text-accent">
                    <MessageSquareText className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary">Trao đổi nhu cầu đăng ký FDA</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Thông tin rõ ràng để tư vấn đúng nhu cầu.</p>
                  </div>
                </div>
                <FdaLeadForm />
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="bg-white py-16 md:py-24">
          <div className="container mx-auto max-w-4xl px-4">
            <SectionHeading
              eyebrow="Câu hỏi thường gặp"
              title="Giải đáp mọi thắc mắc về đăng ký FDA"
              description="Những câu hỏi phổ biến về thủ tục, chi phí và phạm vi hỗ trợ trước khi bắt đầu."
            />
            <div className="space-y-3">
              {FDA_FAQS.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-xl border border-border bg-white open:bg-secondary/20"
                >
                  <summary className="cursor-pointer px-5 py-5 text-base font-semibold leading-relaxed text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">
                    {faq.question}
                  </summary>
                  <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground md:text-base">{faq.answer}</p>
                </details>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Không tìm thấy câu trả lời bạn cần?{" "}
              <a href="#fda-contact" className="font-semibold text-accent underline underline-offset-4">
                Liên hệ với chúng tôi
              </a>
            </p>
            <aside aria-label="Nguồn quy định chính thức FDA" className="mt-10 border-t border-border pt-6">
              <h3 className="mb-4 text-sm font-bold text-primary">Tham khảo nguồn chính thức từ FDA</h3>
              <ul className="grid gap-3 text-xs sm:grid-cols-2">
                {FDA_SOURCES.map((source) => (
                  <li key={source.url}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-start gap-2 leading-relaxed text-muted-foreground hover:text-accent"
                    >
                      <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      {source.title}
                    </a>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
