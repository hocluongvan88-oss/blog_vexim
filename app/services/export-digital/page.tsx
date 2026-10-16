import type { Metadata } from "next"
import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowDown,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  Check,
  CheckCheck,
  CircleCheck,
  ClipboardCheck,
  FileSearch,
  FileText,
  Globe2,
  Leaf,
  MessageCircle,
  PackageCheck,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Waypoints,
} from "lucide-react"
import { JsonLd } from "@/components/json-ld"
import {
  AssessmentForm,
  MobileReportBar,
  PainChecklist,
  ReportLink,
  ZaloLink,
} from "@/components/export-digital/interactions"
import { ADDRESS, PUBLIC_EMAIL, SITE_URL } from "@/lib/business-profile"
import { VEXIM_PHONE_DISPLAY, VEXIM_PHONE_TEL_URL } from "@/lib/contact-info"
import {
  BUYER_CRITERIA,
  EXPORT_COMPARISON,
  EXPORT_DIGITAL,
  EXPORT_FAQS,
  EXPORT_STEPS,
} from "@/lib/export-digital-content"
import { buildExportDigitalSchema } from "@/lib/export-digital-schema"
import "./export-digital.css"

const canonical = `${SITE_URL}${EXPORT_DIGITAL.path}`
export const metadata: Metadata = {
  title: { absolute: EXPORT_DIGITAL.title },
  description: EXPORT_DIGITAL.description,
  alternates: { canonical },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: canonical,
    siteName: "Vexim Global",
    title: EXPORT_DIGITAL.title,
    description: EXPORT_DIGITAL.description,
    images: [
      {
        url: EXPORT_DIGITAL.image,
        width: 1200,
        height: 630,
        alt: "Vexim Export Digital — Buyer và AI nhìn thấy gì về bạn",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: EXPORT_DIGITAL.title,
    description: EXPORT_DIGITAL.description,
    images: [EXPORT_DIGITAL.image],
  },
}

function Heading({
  eyebrow,
  title,
  children,
  light = false,
}: {
  eyebrow: string
  title: ReactNode
  children?: ReactNode
  light?: boolean
}) {
  return (
    <div className={`ed-heading ${light ? "ed-heading-light" : ""}`}>
      <p className="ed-eyebrow">
        <span />
        {eyebrow}
      </p>
      <h2>{title}</h2>
      {children && <div className="ed-heading-description">{children}</div>}
    </div>
  )
}
function Reassurance() {
  return (
    <p className="ed-reassurance">
      <ShieldCheck size={15} aria-hidden="true" />
      Miễn phí <span>·</span> 2 ngày làm việc <span>·</span> Không cam kết mua
    </p>
  )
}
function BuyerSearchIllustration() {
  return (
    <div
      className="ed-visual"
      role="img"
      aria-label="Minh họa buyer tìm nhà cung cấp trên Google và kiểm tra qua AI. Tất cả tên nhà cung cấp là giả định, không phải kết quả tìm kiếm thực tế."
    >
      <div className="ed-visual-top">
        <span className="ed-live-dot" />
        GÓC NHÌN TỪ PHÍA BUYER<span>01 / 03</span>
      </div>
      <div className="ed-search-window">
        <div className="ed-window-chrome">
          <i />
          <i />
          <i />
          <span>Tìm nhà cung cấp đáng tin</span>
          <Globe2 size={14} />
        </div>
        <div className="ed-search-body">
          <div className="ed-search-brand">
            Google<span>Minh họa</span>
          </div>
          <div className="ed-search-query">
            <Search size={17} />
            <span>Vietnam cashew supplier</span>
          </div>
          <div className="ed-fake-result">
            <span>supplier-a.example</span>
            <b className="ed-blur">Nhà cung cấp A · Vietnam</b>
            <p>
              Nguồn gốc rõ ràng. Quy cách đầy đủ. <br />
              Có thông tin để buyer kiểm chứng.
            </p>
            <div className="ed-result-tags">
              <span>Nhà máy</span>
              <span>Quy cách</span>
              <span>Liên hệ</span>
            </div>
          </div>
          <div className="ed-fake-result ed-fake-result-muted">
            <span>supplier-b.example</span>
            <b className="ed-blur">Nhà cung cấp B · Vietnam</b>
            <div className="ed-skeleton" />
            <div className="ed-skeleton short" />
          </div>
        </div>
      </div>
      <div className="ed-ai-window">
        <div className="ed-ai-title">
          <div>
            <Sparkles size={17} />
          </div>
          <span>Hỏi thêm một trợ lý AI</span>
          <span className="ed-mini-label">Minh họa</span>
        </div>
        <p className="ed-ai-prompt">“Nhà cung cấp nào phù hợp để liên hệ?”</p>
        <div className="ed-ai-answer">
          <p>Tôi sẽ đối chiếu thông tin công khai về:</p>
          {["Nhà cung cấp A", "Nhà cung cấp B", "Nhà cung cấp C"].map((name, index) => (
            <div key={name}>
              <span>0{index + 1}</span>
              <b className="ed-blur">{name}</b>
              <CircleCheck size={15} />
            </div>
          ))}
        </div>
        <small>Tên giả định. Không phải kết quả từ một công cụ AI thực tế.</small>
      </div>
      <div className="ed-visual-note">
        <span>
          <Search size={18} />
        </span>
        <p>
          Buyer đã tìm thấy bạn.<strong>Họ có đủ lý do để chọn bạn?</strong>
        </p>
        <ArrowUpRight size={21} />
      </div>
    </div>
  )
}

export default function ExportDigitalPage() {
  const icons = [Leaf, Users, Waypoints, BadgeCheck, PackageCheck, MessageCircle]
  return (
    <div className="ed-page">
      <JsonLd id="export-digital-schema" data={buildExportDigitalSchema()} />
      <a href="#export-main" className="ed-skip">
        Đi đến nội dung
      </a>
      <header className="ed-header">
        <div className="ed-shell ed-header-inner">
          <Link href="/" className="ed-brand" aria-label="Vexim Global — về trang chủ">
            <Image src="/logo.png" alt="" width={53} height={35} />
            <span>
              VEXIM<span className="ed-brand-sub">EXPORT DIGITAL</span>
            </span>
          </Link>
          <nav aria-label="Điều hướng Export Digital">
            <a href="#dau-hieu">Vấn đề của bạn</a>
            <a href="#cach-lam">Cách Vexim làm</a>
            <a href="#goi-dich-vu">Giải pháp</a>
          </nav>
          <ReportLink source="header">Nhận báo cáo miễn phí</ReportLink>
        </div>
      </header>
      <main id="export-main">
        <section id="export-hero" className="ed-hero">
          <div className="ed-shell ed-hero-grid">
            <div className="ed-hero-copy">
              <p className="ed-eyebrow">
                <span />
                DÀNH CHO DOANH NGHIỆP XUẤT KHẨU VIỆT NAM
              </p>
              <h1>
                Sản phẩm tốt, <br />
                nhưng buyer <br />
                <span>chỉ hỏi giá?</span>
              </h1>
              <p className="ed-hero-description">
                Sàn B2B giúp buyer tìm thấy bạn. Nhưng trước khi đặt hàng, họ có thể Google tên công ty — hoặc hỏi AI.
                Vexim giúp họ thấy <strong>một nhà cung cấp đáng tin, không chỉ một mức giá.</strong>
              </p>
              <div className="ed-hero-actions">
                <ReportLink source="hero">Xem buyer đang thấy gì về tôi</ReportLink>
                <ZaloLink source="hero" />
              </div>
              <Reassurance />
              <div className="ed-hero-origin">
                <div className="ed-origin-icon">
                  <ShieldCheck size={21} />
                </div>
                <p>
                  Không bắt đầu từ một bản thiết kế. <br />
                  <strong>Xuất phát từ tư vấn tuân thủ FDA, GACC.</strong>
                </p>
              </div>
            </div>
            <BuyerSearchIllustration />
          </div>
          <div className="ed-shell ed-hero-bottom">
            <p>
              Đưa hàng Việt ra thế giới, <br />
              <strong>từ giấy phép đến đơn hàng.</strong>
            </p>
            <div>
              <span>THỰC PHẨM & ĐỒ UỐNG</span>
              <span>MỸ PHẨM / OEM</span>
              <span>THỰC PHẨM CHỨC NĂNG</span>
            </div>
            <a href="#dau-hieu" className="ed-scroll-hint" aria-label="Khám phá các dấu hiệu">
              <ArrowDown size={18} />
            </a>
          </div>
        </section>

        <section id="dau-hieu" className="ed-section ed-signals-section">
          <div className="ed-shell ed-split">
            <div>
              <Heading
                eyebrow="01 — NHẬN RA VẤN ĐỀ"
                title={
                  <>
                    Bạn có đang gặp <br />
                    những điều này?
                  </>
                }
              >
                <p>Chứng nhận đã có. Sản phẩm đã tốt. Nhưng cuộc trò chuyện với buyer vẫn thường dừng ở bảng giá.</p>
              </Heading>
              <div className="ed-side-note">
                <span>
                  Không phải lúc nào <br />
                  <strong>giá thấp hơn cũng là lối ra.</strong>
                </span>
                <ArrowUpRight size={28} />
              </div>
            </div>
            <PainChecklist />
          </div>
        </section>

        <section id="hanh-trinh-buyer" className="ed-section ed-journey-section">
          <div className="ed-shell">
            <Heading
              eyebrow="ĐIỂM CHẠM QUYẾT ĐỊNH"
              title={
                <>
                  Buyer tìm thấy bạn trên sàn. <br />
                  Nhưng họ chọn bạn ở nơi khác.
                </>
              }
            >
              <p>Mỗi kênh làm tốt một việc. Website giúp nối liền bước “biết đến” với bước “đủ tin để hỏi thêm”.</p>
            </Heading>
            <ol className="ed-buyer-journey">
              {[
                {
                  title: "Tìm thấy",
                  text: "Trên sàn B2B, tại hội chợ hoặc qua lời giới thiệu.",
                  icon: Search,
                  label: "BẠN ĐÃ ĐƯỢC NHÌN THẤY",
                },
                {
                  title: "Kiểm tra",
                  text: "Google tên công ty, vào website, xem LinkedIn hoặc hỏi AI.",
                  icon: FileSearch,
                  label: "ĐÂY LÀ LÚC XÂY DỰNG NIỀM TIN",
                },
                {
                  title: "Chọn",
                  text: "Đưa vào danh sách rút gọn, trao đổi quy cách, xin mẫu và cân nhắc đặt hàng.",
                  icon: CheckCheck,
                  label: "CÓ CƠ SỞ ĐỂ TIẾN XA HƠN",
                },
              ].map(({ title, text, icon: Icon, label }, index) => (
                <li key={title} className={index === 1 ? "is-highlighted" : ""}>
                  <div className="ed-card-top">
                    <span>0{index + 1}</span>
                    <Icon size={24} />
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <small>{label}</small>
                </li>
              ))}
            </ol>
            <div className="ed-ai-context">
              <Sparkles size={24} aria-hidden="true" />
              <div>
                <h3>Và người kiểm tra không chỉ là con người.</h3>
                <p>
                  Buyer có thể hỏi ChatGPT, Gemini hoặc Perplexity về nhà cung cấp phù hợp. Thông tin công khai, rõ ràng
                  và nhất quán giúp các hệ thống có thêm cơ sở hiểu doanh nghiệp. Không có website không có nghĩa bạn vô
                  hình; nhưng bạn đang thiếu một nguồn thông tin gốc do chính mình kiểm soát.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="cai-gia" className="ed-section">
          <div className="ed-shell">
            <Heading
              eyebrow="02 — CÁI GIÁ CỦA VIỆC IM LẶNG"
              title={
                <>
                  Khi mọi gian hàng cùng một khuôn, <br />
                  giá dễ thành điểm so sánh.
                </>
              }
            >
              <p>Không cần rời bỏ sàn. Hãy cho buyer thêm một nơi để hiểu điều bảng giá chưa nói hết.</p>
            </Heading>
            <div className="ed-comparison">
              <div className="ed-compare-head">
                <span>Khi chỉ có gian hàng trên sàn</span>
                <span>
                  <Globe2 size={18} />
                  Khi có thêm website kể đúng câu chuyện
                </span>
              </div>
              {EXPORT_COMPARISON.map(([before, after]) => (
                <div className="ed-compare-row" key={before}>
                  <p>
                    <span className="ed-dash">—</span>
                    {before}
                  </p>
                  <p>
                    <Check size={18} />
                    {after}
                  </p>
                </div>
              ))}
            </div>
            <div className="ed-comparison-end">
              <p>
                Sàn B2B giúp bạn được nhìn thấy. <br />
                <strong>Website giúp bạn được chọn.</strong>
              </p>
              <ReportLink source="comparison">Xem buyer đang thấy gì về tôi</ReportLink>
            </div>
          </div>
        </section>

        <section id="hanh-trinh-vexim" className="ed-section ed-dark-section">
          <div className="ed-shell">
            <Heading
              light
              eyebrow="03 — THẤY MỘT LỐI RA"
              title={
                <>
                  Vexim đồng hành <br />
                  trọn hành trình xuất khẩu.
                </>
              }
            >
              <p>
                Chúng tôi bắt đầu từ tư vấn tuân thủ FDA và GACC. Website là bước tiếp nối: thể hiện đúng điều doanh
                nghiệp đã làm được, bằng thông tin buyer có thể kiểm tra.
              </p>
            </Heading>
            <div className="ed-vexim-journey">
              {[
                {
                  num: "01",
                  title: "Được phép bán",
                  question: "Hàng của tôi đủ điều kiện vào thị trường chưa?",
                  text: "Rà soát FDA, MoCRA, GACC, nhãn và hồ sơ theo từng nhóm sản phẩm, thị trường.",
                  icon: ShieldCheck,
                },
                {
                  num: "02",
                  title: "Được tìm thấy & tin tưởng",
                  question: "Buyer và AI tìm tôi thì thấy gì?",
                  text: "Website xuất khẩu, câu chuyện sản phẩm có bằng chứng, nội dung và cấu trúc dễ hiểu.",
                  icon: Globe2,
                },
                {
                  num: "03",
                  title: "Tiến tới đơn hàng",
                  question: "Ai là buyer phù hợp để tiếp cận?",
                  text: "Nghiên cứu buyer, nội dung tiếp cận và theo dõi yêu cầu báo giá; không bảo đảm đơn hàng.",
                  icon: Users,
                },
              ].map(({ num, title, question, text, icon: Icon }, index) => (
                <article key={num} className={index === 1 ? "is-highlighted" : ""}>
                  <div className="ed-card-top">
                    <span>{num}</span>
                    <Icon size={25} />
                  </div>
                  {index === 1 && <span className="ed-stage-label">VEXIM EXPORT DIGITAL</span>}
                  <h3>{title}</h3>
                  <p className="ed-stage-question">{question}</p>
                  <p>{text}</p>
                </article>
              ))}
            </div>
            <div className="ed-market-note">
              <Globe2 size={17} />
              <p>
                <strong>Riêng thị trường Trung Quốc:</strong> tư vấn kênh phù hợp như Baidu, WeChat, 1688 — không áp
                dụng một lời hứa SEO Google cho mọi thị trường.
              </p>
            </div>
            <p className="ed-dark-footnote">
              Đăng ký FDA không đồng nghĩa FDA phê duyệt hay chứng nhận chất lượng sản phẩm. Nghĩa vụ tuân thủ cần được
              xác định riêng.
            </p>
          </div>
        </section>

        <section id="sau-yeu-to" className="ed-section">
          <div className="ed-shell">
            <Heading
              eyebrow="CÂU CHUYỆN PHẢI CÓ BẰNG CHỨNG"
              title={
                <>
                  Website của bạn đang <br />
                  trả lời được mấy điều?
                </>
              }
            >
              <p>Không phải kể nhiều hơn. Là trả lời đúng sáu điều buyer cần biết trước khi bắt đầu hợp tác.</p>
            </Heading>
            <div className="ed-criteria-grid">
              {BUYER_CRITERIA.map((criterion, index) => {
                const Icon = icons[index]
                return (
                  <article key={criterion.title}>
                    <div className="ed-criterion-top">
                      <span className="ed-criterion-icon">
                        <Icon size={24} />
                      </span>
                      <span>0{index + 1}</span>
                    </div>
                    <p className="ed-criterion-label">{criterion.title}</p>
                    <h3>{criterion.question}</h3>
                    <p>{criterion.evidence}</p>
                  </article>
                )
              })}
            </div>
            <div className="ed-criteria-end">
              <ClipboardCheck size={20} />
              <p>
                Báo cáo miễn phí sẽ đánh giá website của bạn theo đúng <strong>6 yếu tố này.</strong>
              </p>
            </div>
          </div>
        </section>

        <section id="truoc-va-sau" className="ed-section ed-before-after-section">
          <div className="ed-shell">
            <Heading
              eyebrow="ĐỔI CÁCH KỂ, KHÔNG ĐỔI SỰ THẬT"
              title={
                <>
                  Cùng một sản phẩm. <br />
                  Hai cách kể.
                </>
              }
            />
            <div className="ed-example-label">
              <span />
              VÍ DỤ GIẢ ĐỊNH — KHÔNG PHẢI CASE KHÁCH HÀNG
            </div>
            <div className="ed-story-grid">
              <article className="ed-story-before">
                <div className="ed-story-label">
                  <span>TRƯỚC</span>
                  <FileText size={18} />
                </div>
                <blockquote>
                  “Hạt điều W320 <br />
                  chất lượng cao, <br />
                  giá cạnh tranh.”
                </blockquote>
                <p>Bất kỳ nhà cung cấp nào cũng có thể nói như vậy.</p>
              </article>
              <article className="ed-story-after">
                <div className="ed-story-label">
                  <span>SAU</span>
                  <BadgeCheck size={18} />
                </div>
                <blockquote>
                  “Hạt điều từ Bình Phước. <br />
                  Quy cách W320, quy trình phân loại rõ ràng. Hồ sơ nhà máy và kiểm nghiệm sẵn sàng để đối chiếu. Trao
                  đổi nhu cầu để nhận mẫu phù hợp.”
                </blockquote>
                <p>Chỉ sử dụng những chi tiết doanh nghiệp thực sự chứng minh được.</p>
              </article>
            </div>
            <p className="ed-story-conclusion">
              Không cần bắt đầu bằng giá.<strong> Hãy bắt đầu bằng một lý do để buyer muốn hỏi thêm.</strong>
            </p>
          </div>
        </section>

        <section id="cach-lam" className="ed-section">
          <div className="ed-shell">
            <Heading
              eyebrow="MỘT BƯỚC NHỎ ĐỂ BẮT ĐẦU"
              title={
                <>
                  Bắt đầu từ một báo cáo, <br />
                  không phải một hợp đồng.
                </>
              }
            />
            <ol className="ed-process-grid">
              {EXPORT_STEPS.map((step, index) => (
                <li key={step.title}>
                  <div className="ed-process-number">
                    0{index + 1}
                    <span />
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                  <small>{step.note}</small>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="goi-dich-vu" className="ed-section ed-packages-section">
          <div className="ed-shell">
            <Heading eyebrow="KHÔNG CẦN LÀM TẤT CẢ CÙNG LÚC" title="Chọn bước phù hợp với bạn.">
              <p>Báo cáo trước. Hiểu đúng khoảng trống. Sau đó mới quyết định phạm vi cần làm.</p>
            </Heading>
            <div className="ed-packages-grid">
              {[
                {
                  num: "01",
                  title: "Hồ sơ xuất khẩu",
                  text: "Cần ngay tài liệu đủ tin cậy để gửi cùng báo giá trên sàn.",
                  features: [
                    "Trang Giới thiệu & Chứng nhận tiếng Anh",
                    "Company profile PDF",
                    "Câu chuyện và bằng chứng nhất quán",
                  ],
                  label: "Nhận tư vấn từ báo cáo",
                },
                {
                  num: "02",
                  title: "Website xuất khẩu",
                  text: "Muốn buyer và AI có thêm cơ sở tìm thấy, hiểu đúng và tin tưởng.",
                  features: [
                    "Website song ngữ theo ngành hàng",
                    "Trang sản phẩm đủ thông tin quy cách",
                    "Rà soát claims theo thị trường",
                    "Cấu trúc nội dung & schema rõ ràng",
                  ],
                  label: "Nhận báo cáo miễn phí",
                },
                {
                  num: "03",
                  title: "Tăng trưởng hằng tháng",
                  text: "Đã có website, cần cải thiện nội dung và tiếp cận buyer phù hợp.",
                  features: [
                    "SEO & nội dung theo câu hỏi buyer",
                    "Danh sách buyer và nội dung tiếp cận",
                    "Theo dõi yêu cầu báo giá hằng tháng",
                  ],
                  label: "Nhận tư vấn từ báo cáo",
                },
              ].map((plan, index) => (
                <article key={plan.num} className={index === 1 ? "is-highlighted" : ""}>
                  <div className="ed-package-kicker">
                    <span>GIẢI PHÁP {plan.num}</span>
                    {index === 1 && <span>TRỌNG TÂM</span>}
                  </div>
                  <h3>{plan.title}</h3>
                  <p>{plan.text}</p>
                  <ul>
                    {plan.features.map((feature) => (
                      <li key={feature}>
                        <Check size={16} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <p className="ed-price-note">Báo giá theo quy mô doanh nghiệp</p>
                  <ReportLink source="packages" className={index !== 1 ? "ed-button-outline" : ""}>
                    {plan.label}
                  </ReportLink>
                </article>
              ))}
            </div>
            <p className="ed-combo-note">
              Đã là khách hàng tuân thủ FDA/GACC của Vexim? Hỏi chuyên viên về phương án kết hợp phù hợp.
            </p>
          </div>
        </section>

        {/* Block 10 intentionally omitted: no authorized Export Digital outcomes/testimonials yet. */}
        <section id="cau-hoi" className="ed-section">
          <div className="ed-shell ed-faq-split">
            <Heading
              eyebrow="04 — SẴN SÀNG BẮT ĐẦU"
              title={
                <>
                  Có thể bạn <br />
                  đang băn khoăn.
                </>
              }
            >
              <p>Không cần hiểu hết về website hay SEO. Chỉ cần bắt đầu từ điều buyer đang thấy.</p>
              <ZaloLink source="report">Hỏi thêm qua Zalo</ZaloLink>
            </Heading>
            <div className="ed-faq-list">
              {EXPORT_FAQS.map((faq, index) => (
                <details key={faq.question} open={index === 0}>
                  <summary>
                    <span className="ed-faq-index">0{index + 1}</span>
                    <span>{faq.question}</span>
                    <span className="ed-faq-plus" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="nhan-bao-cao" className="ed-section ed-report-section">
          <div className="ed-shell ed-report-grid">
            <div>
              <Heading
                eyebrow="BƯỚC TIẾP THEO CỦA BẠN"
                title={
                  <>
                    Buyer đang thấy gì <br />
                    khi tìm bạn?
                  </>
                }
              >
                <p>
                  Nhận báo cáo miễn phí trong 2 ngày làm việc: website đang kể được mấy điều buyer cần biết, Google và
                  AI có thể tìm thấy gì về bạn, đối thủ nào xuất hiện trong truy vấn đã chọn — và 3 việc có thể làm
                  ngay.
                </p>
              </Heading>
              <div className="ed-report-outline">
                <div className="ed-report-outline-head">
                  <FileSearch size={24} />
                  <div>
                    <span>VEXIM EXPORT DIGITAL</span>
                    <h3>Buyer và AI nhìn thấy gì về bạn</h3>
                  </div>
                </div>
                <p className="ed-fine-print">Cấu trúc báo cáo dự kiến — không phải ảnh báo cáo khách hàng.</p>
                <ul>
                  {[
                    "Nền tảng website & khả năng tiếp cận",
                    "Thông tin tìm được trên Google và AI",
                    "Đánh giá 6 yếu tố câu chuyện",
                    "Đối thủ trong truy vấn đã ghi nhận",
                    "3 việc ưu tiên theo nguồn lực",
                  ].map((line, index) => (
                    <li key={line}>
                      <span>0{index + 1}</span>
                      {line}
                      <Check size={15} />
                    </li>
                  ))}
                </ul>
                <div className="ed-report-outline-bottom">
                  <span>CHUYÊN VIÊN THỰC HIỆN</span>
                  <span>PDF / 2 NGÀY LÀM VIỆC</span>
                </div>
              </div>
              <p className="ed-report-no-site">
                <Building2 size={19} />
                <span>
                  Chưa có website? Chọn ô tương ứng trong form. Chúng tôi bắt đầu từ tên doanh nghiệp và kênh bạn đang
                  có.
                </span>
              </p>
              <p className="ed-call-note">
                Muốn trao đổi trước? <ZaloLink source="report">Hẹn cuộc gọi 20 phút qua Zalo</ZaloLink>
              </p>
            </div>
            <div className="ed-form-card">
              <div className="ed-form-card-heading">
                <span className="ed-free-label">MIỄN PHÍ</span>
                <h3>Để Vexim nhìn từ phía buyer.</h3>
                <p>Điền thông tin doanh nghiệp. Không cần gửi mật khẩu, hồ sơ mật hoặc cam kết mua dịch vụ.</p>
              </div>
              <AssessmentForm />
            </div>
          </div>
        </section>
      </main>
      <footer className="ed-footer">
        <div className="ed-shell">
          <div className="ed-footer-top">
            <div>
              <p className="ed-footer-brand">
                VEXIM <span>EXPORT DIGITAL</span>
              </p>
              <p>Đưa hàng Việt ra thế giới, từ giấy phép đến đơn hàng.</p>
            </div>
            <ZaloLink source="footer">Trao đổi cùng Vexim</ZaloLink>
          </div>
          <div className="ed-footer-details">
            <p>
              {ADDRESS.streetAddress}, {ADDRESS.addressLocality}
            </p>
            <a href={`mailto:${PUBLIC_EMAIL}`}>{PUBLIC_EMAIL}</a>
            <a href={VEXIM_PHONE_TEL_URL}>{VEXIM_PHONE_DISPLAY}</a>
            <Link href="/">
              Về website Vexim Global <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="ed-footer-bottom">
            <span>© {new Date().getFullYear()} Vexim Global</span>
            <span>Rõ câu chuyện. Đúng bằng chứng. Bền niềm tin.</span>
          </div>
        </div>
      </footer>
      <MobileReportBar />
    </div>
  )
}
