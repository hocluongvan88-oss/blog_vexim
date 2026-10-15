import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Clock, ExternalLink, FileCheck, Shield } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ConsultationDialog } from "@/components/consultation-dialog"
import { JsonLd } from "@/components/json-ld"
import { SITE_URL } from "@/lib/business-profile"
import { VEXIM_CREDENTIALS_URL, VEXIM_PHONE_DISPLAY, VEXIM_PHONE_TEL_URL } from "@/lib/contact-info"
import { FDA_FAQS, FDA_LIBRA_CASE, FDA_PAGE, FDA_PROCESS, FDA_PRODUCT_GROUPS, FDA_REQUIREMENTS, FDA_SOURCES } from "@/lib/fda-page-content"
import { buildFdaPageSchema } from "@/lib/fda-page-schema"

const pageUrl = `${SITE_URL}${FDA_PAGE.path}`
const shareImage = {
  url: `${SITE_URL}${FDA_PAGE.image}`,
  width: 1200,
  height: 630,
  alt: FDA_PAGE.imageAlt,
}

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

const benefits = [
  { icon: Shield, title: "Xác định đúng nghĩa vụ đăng ký FDA", description: "Cơ sở sản xuất, chế biến, đóng gói hoặc lưu giữ thực phẩm cho thị trường Mỹ cần xem xét nghĩa vụ đăng ký, trừ trường hợp được miễn. Phạm vi áp dụng phải được xác định theo hoạt động thực tế." },
  { icon: FileCheck, title: "Chuẩn bị hồ sơ phục vụ nhập khẩu", description: "Đối chiếu thông tin cơ sở và các yêu cầu liên quan trước khi xuất hàng. Đăng ký FDA là một phần của tuân thủ, không thay thế Prior Notice, FSVP hoặc các yêu cầu khác và không tự bảo đảm thông quan." },
  { icon: CheckCircle2, title: "Thông tin đăng ký rõ ràng", description: "Thông tin cơ sở nhất quán giúp doanh nghiệp trao đổi với US Agent, nhà nhập khẩu và đối tác. Số đăng ký không phải chứng nhận chất lượng hay sự phê duyệt của FDA đối với sản phẩm." },
  { icon: Clock, title: "Hạn chế sai sót trong hồ sơ FDA", description: "Rà soát dữ liệu và xác định các bước cần làm ngay từ đầu. Kế hoạch xử lý được thống nhất theo tình trạng hồ sơ, thay vì áp dụng một thời gian hoàn thành cho mọi sản phẩm." },
]

export default function FDAPage() {
  return (
    <>
      <JsonLd id="fda-page-schema" data={buildFdaPageSchema()} />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main id="main-content">
          {/* Keep the existing hero, two-column layout and H1. */}
          <section className="pt-24 md:pt-32 pb-16 md:pb-24 bg-gradient-to-br from-primary/5 via-background to-accent/5">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <nav aria-label="Đường dẫn trang" className="mb-5 text-sm text-muted-foreground">
                    <ol className="flex flex-wrap items-center gap-2">
                      <li><Link href="/" className="hover:underline">Trang chủ</Link></li>
                      <li aria-hidden="true">/</li>
                      <li aria-current="page">Đăng ký FDA</li>
                    </ol>
                  </nav>
                  <div className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">Thị trường Hoa Kỳ</div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 text-balance">Đăng ký FDA</h1>
                  <p className="text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed">
                    Vexim Global hỗ trợ doanh nghiệp rà soát yêu cầu đăng ký cơ sở thực phẩm FDA, DUNS và US Agent trước khi xuất khẩu sang Mỹ. Với mỹ phẩm và các nhóm sản phẩm khác, thủ tục được xác định theo phân loại và phạm vi áp dụng riêng.
                  </p>
                  <p className="text-sm text-muted-foreground mb-8 leading-relaxed">Tư vấn miễn phí ban đầu. Phạm vi dịch vụ, chi phí và thời gian dự kiến được xác nhận sau khi đánh giá hồ sơ.</p>
                  <ConsultationDialog defaultService="fda" trackingSource="fda_hero" trigger={
                    <Button size="lg" className="min-h-12 h-auto whitespace-normal bg-accent text-accent-foreground hover:bg-accent/90">
                      Nhận tư vấn đăng ký FDA <ArrowRight className="ml-2 w-5 h-5" aria-hidden="true" />
                    </Button>
                  } />
                </div>
                <div className="relative h-[400px] lg:h-[500px]">
                  <Image src="/fda-food-safety-inspection-laboratory-professional.jpg" alt="Minh họa kiểm tra an toàn thực phẩm trong phòng thí nghiệm" fill priority sizes="(max-width: 1023px) 100vw, 50vw" className="object-cover rounded-2xl shadow-2xl" />
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-balance">Tại sao cần đăng ký FDA?</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">FDA quản lý nhiều nhóm sản phẩm với yêu cầu khác nhau. Xác định đúng nghĩa vụ giúp doanh nghiệp chuẩn bị hồ sơ và kế hoạch xuất khẩu phù hợp, tránh nhầm đăng ký với phê duyệt sản phẩm.</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {benefits.map(({ icon: Icon, title, description }) => (
                  <Card key={title} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4"><Icon className="w-6 h-6 text-accent" aria-hidden="true" /></div>
                    <h3 className="text-xl font-bold text-primary mb-3">{title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{description}</p>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 md:py-24 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-balance">Các nhóm sản phẩm cần rà soát yêu cầu FDA</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">Không có một thủ tục đăng ký chung cho mọi sản phẩm. Các nhóm dưới đây cần được phân loại và xác định nghĩa vụ trước khi chốt dịch vụ.</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {FDA_PRODUCT_GROUPS.map((category) => (
                  <Card key={category.title} className="p-6 hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-bold text-primary mb-4">{category.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">{category.description}</p>
                    <ul className="space-y-2">
                      {category.items.map((item) => <li key={item} className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" aria-hidden="true" /><span className="text-muted-foreground">{item}</span></li>)}
                    </ul>
                    {"path" in category && <Link href={category.path} className="mt-5 inline-block font-semibold text-accent underline underline-offset-4">{category.anchor}</Link>}
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-balance">Quy trình đăng ký FDA cùng Vexim Global</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">5 bước theo dõi hồ sơ. Thời gian cụ thể được xác nhận sau đánh giá, không phải thời hạn FDA phê duyệt chung cho mọi nhóm sản phẩm.</p>
              </div>
              <div className="max-w-4xl mx-auto space-y-6">
                {FDA_PROCESS.map((process, index) => (
                  <Card key={process.title} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-shrink-0"><div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center"><span className="text-2xl font-bold text-white">{String(index + 1).padStart(2, "0")}</span></div></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3"><h3 className="text-xl font-bold text-primary">{process.title}</h3><span className="text-sm text-accent font-medium">{process.duration}</span></div>
                        <p className="text-muted-foreground leading-relaxed">{process.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section id="chi-phi-thoi-gian" className="py-16 md:py-24 bg-secondary/30 scroll-mt-28">
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-balance">Chi phí, thời gian và hồ sơ đăng ký FDA</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">Chi phí tùy sản phẩm và phạm vi công việc. Liên hệ để nhận báo giá riêng, trong đó làm rõ dịch vụ đăng ký, DUNS, US Agent và các hạng mục bổ sung nếu có.</p>
              </div>
              <p id="fda-table-help" className="text-sm text-muted-foreground mb-3">Trên điện thoại, vuốt ngang để xem đủ bảng.</p>
              <div role="region" aria-label="Bảng hồ sơ, thời gian và US Agent" aria-describedby="fda-table-help" tabIndex={0} className="overflow-x-auto rounded-xl border border-border bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <caption className="sr-only">Yêu cầu cần đối chiếu trước khi xác nhận chi phí và thời gian dịch vụ FDA</caption>
                  <thead className="bg-primary/5 text-primary"><tr>{["Nhóm hồ sơ", "Tài liệu cần chuẩn bị", "US Agent", "Thời gian dự kiến"].map((label) => <th key={label} scope="col" className="p-4 font-semibold">{label}</th>)}</tr></thead>
                  <tbody>{FDA_REQUIREMENTS.map((row) => <tr key={row.type} className="border-t border-border"><th scope="row" className="p-4 align-top font-semibold text-primary">{row.type}</th><td className="p-4 align-top leading-relaxed">{row.documents}</td><td className="p-4 align-top leading-relaxed">{row.agent}</td><td className="p-4 align-top leading-relaxed">{row.timing}</td></tr>)}</tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground mt-5 leading-relaxed">FDA không thu phí đăng ký hoặc gia hạn cơ sở thực phẩm. Phí dịch vụ của đơn vị tư vấn và US Agent là các khoản riêng; không áp dụng kết luận này cho mọi lĩnh vực FDA quản lý. Báo giá cần làm rõ các khoản đã bao gồm, khoản phát sinh và thuế áp dụng.</p>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3"><Link className="font-semibold text-accent underline underline-offset-4" href="/services/us-agent">Tìm hiểu dịch vụ US Agent</Link><Link className="font-semibold text-accent underline underline-offset-4" href="/services/fsvp">Phân biệt nghĩa vụ FSVP</Link><Link className="font-semibold text-accent underline underline-offset-4" href="/services/food/fda-renewal">Gia hạn cơ sở thực phẩm FDA</Link></div>
            </div>
          </section>

          <section className="py-16 md:py-24 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12"><h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-balance">Tại sao chọn Vexim Global?</h2></div>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { label: "Rà soát", title: "Chuẩn bị hồ sơ FDA có đối chiếu", description: "Kiểm tra thông tin cơ sở và sản phẩm trước khi xử lý. Phạm vi đăng ký, tài liệu cần bổ sung và trách nhiệm tuân thủ được giải thích rõ để doanh nghiệp chủ động phối hợp." },
                  { label: "Thực tế", title: "Tham khảo hồ sơ và trường hợp khách hàng", description: "Doanh nghiệp có thể xem trường hợp đã được Vexim công bố trong hồ sơ năng lực. Mỗi kết quả cần được hiểu theo đúng thủ tục và phạm vi công việc đã thực hiện." },
                  { label: "Rõ ràng", title: "Hỗ trợ FDA theo phạm vi thống nhất", description: "Trao đổi đầu mối liên hệ, lịch xử lý và các hạng mục hỗ trợ ngay từ đầu. Các yêu cầu ngoài phạm vi được làm rõ trước khi thực hiện." },
                ].map((item) => <Card key={item.title} className="p-6 text-center hover:shadow-lg transition-shadow"><div className="text-3xl font-bold text-accent mb-2">{item.label}</div><h3 className="text-xl font-bold text-primary mb-3">{item.title}</h3><p className="text-muted-foreground leading-relaxed">{item.description}</p></Card>)}
              </div>
              <article id="case-libra" aria-labelledby="libra-title" className="mt-12 rounded-2xl border border-border bg-white p-6 md:p-10 scroll-mt-28">
                <p className="text-sm font-semibold text-accent mb-3">Trường hợp thực tế được Vexim công bố</p>
                <h3 id="libra-title" className="text-2xl font-bold text-primary mb-4">Đăng ký cơ sở thực phẩm cho {FDA_LIBRA_CASE.company}</h3>
                <p className="font-semibold mb-4">{FDA_LIBRA_CASE.product}</p>
                <p className="text-muted-foreground leading-relaxed mb-4">{FDA_LIBRA_CASE.summary}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">{FDA_LIBRA_CASE.note}</p>
                {/* Owner will upload case images. Do not reuse N&P documents or add fictional URLs. */}
                <a href={VEXIM_CREDENTIALS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold text-accent underline underline-offset-4">Xem hồ sơ năng lực và trường hợp Libra <ExternalLink className="h-4 w-4" aria-hidden="true" /></a>
              </article>
            </div>
          </section>

          <section id="faq" className="py-16 md:py-24 bg-background scroll-mt-28">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="text-center mb-10"><h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-balance">Câu hỏi thường gặp về đăng ký FDA</h2><p className="text-muted-foreground leading-relaxed">Giải đáp về hồ sơ, chi phí, thời gian và những điểm dễ nhầm trước khi đăng ký.</p></div>
              <div className="space-y-4">
                {FDA_FAQS.map((faq) => <details key={faq.question} className="group rounded-xl border border-border p-5"><summary className="cursor-pointer font-semibold text-primary leading-relaxed focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">{faq.question}</summary><p className="mt-4 leading-relaxed text-muted-foreground">{faq.answer}</p></details>)}
              </div>
              <aside aria-labelledby="fda-sources-title" className="mt-10 rounded-xl bg-secondary/40 p-6">
                <h3 id="fda-sources-title" className="font-bold text-primary mb-4">Nguồn quy định chính thức từ FDA</h3>
                <ul className="space-y-3">{FDA_SOURCES.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-4">{source.title}</a></li>)}</ul>
                <p className="mt-5 text-sm text-muted-foreground leading-relaxed">Nội dung là hướng dẫn tham khảo, không thay thế quy định hoặc tư vấn theo hồ sơ cụ thể. Cần đối chiếu nguồn chính thức trước khi thực hiện.</p>
              </aside>
            </div>
          </section>

          <section id="tu-van-fda" className="py-16 md:py-24 bg-primary text-white scroll-mt-28">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">Sẵn sàng đưa sản phẩm vào thị trường Mỹ?</h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">Gửi thông tin doanh nghiệp và loại sản phẩm để được tư vấn miễn phí ban đầu. Vexim tiếp nhận và liên hệ trong vòng 24 giờ; báo giá và lịch xử lý được xác nhận sau khi làm rõ phạm vi.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <ConsultationDialog defaultService="fda" trackingSource="fda_final_cta" trigger={<Button size="lg" className="min-h-12 h-auto whitespace-normal bg-accent text-accent-foreground hover:bg-accent/90">Nhận tư vấn và báo giá FDA</Button>} />
                <Button asChild size="lg" variant="outline" className="min-h-12 h-auto whitespace-normal bg-transparent text-white border-white hover:bg-white/10"><a href={FDA_SOURCES[0].url} target="_blank" rel="noopener noreferrer">Xem hướng dẫn FDA chính thức <ExternalLink className="h-4 w-4" aria-hidden="true" /></a></Button>
              </div>
              <a href={VEXIM_PHONE_TEL_URL} className="mt-6 inline-block text-white/90 underline underline-offset-4">Gọi Vexim: {VEXIM_PHONE_DISPLAY}</a>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  )
}
