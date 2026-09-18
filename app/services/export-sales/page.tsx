import Header from "@/components/header"
import Footer from "@/components/footer"
import { BackToTop } from "@/components/back-to-top"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  ShieldCheck,
  Building2,
  TrendingUp,
  FileCheck2,
  Search,
  DollarSign,
  Clock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Globe2,
  BarChart3,
  Coffee,
  Sparkles,
  Pill,
  Lock,
  Headphones,
  Check,
  X,
  PhoneCall,
  CalendarCheck,
  Layers,
  FileSpreadsheet,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { ExportSalesFaq } from "@/components/export-sales/export-sales-faq"
import {
  ExportSalesBookingButton,
  ExportSalesInlineForm,
} from "@/components/export-sales/export-sales-consultation"

export const metadata: Metadata = {
  title: "Phòng Sale Xuất Khẩu Sang Mỹ Thuê Ngoài Trọn Gói | Vexim Global",
  description:
    "Dịch vụ phòng kinh doanh xuất khẩu thuê ngoài cho nhà máy Việt Nam sang thị trường Mỹ. Chuyên sâu thực phẩm, mỹ phẩm MoCRA, TPCN: tìm buyer thẩm định, đàm phán hợp đồng, hoàn thiện FDA và quản trị thanh toán SWIFT an toàn.",
  keywords: [
    "phòng sale xuất khẩu",
    "phòng kinh doanh xuất khẩu thuê ngoài",
    "xuất khẩu sang mỹ",
    "tìm buyer mỹ",
    "xuất khẩu thực phẩm sang hoa kỳ",
    "xuất khẩu mỹ phẩm mocra",
    "dịch vụ fda trọn gói",
    "xác thực swift xuất khẩu",
    "vexim global export sales",
  ],
  alternates: {
    canonical: "/services/export-sales",
  },
  openGraph: {
    title: "Phòng Sale Xuất Khẩu Sang Mỹ Thuê Ngoài Trọn Gói | Vexim Global",
    description:
      "Vexim Global là đội sales xuất khẩu chuyên trách của nhà máy bạn sang Mỹ. Tiếp cận 50+ buyer Mỹ/tháng, xử lý FDA, đàm phán thương mại và bảo đảm dòng tiền USD.",
    url: "https://www.veximglobal.com/services/export-sales",
    siteName: "Vexim Global",
    locale: "vi_VN",
    type: "website",
  },
}

const GAPS = [
  {
    icon: Search,
    title: "Không có mạng lưới buyer Mỹ",
    detail: "Tự tìm kiếm mất 1–2 năm mò mẫm qua hội chợ tốn kém hàng trăm triệu nhưng không có dữ liệu thẩm định.",
    loss: "Mất 1–2 năm cơ hội",
    color: "text-amber-600 bg-amber-500/10",
  },
  {
    icon: FileCheck2,
    title: "Hồ sơ FDA & nhãn mác thiếu sót",
    detail: "Bị buyer từ chối ngay từ vòng gửi xe hoặc lô hàng bị FDA giữ tại cảng Mỹ vì vi phạm 21 CFR.",
    loss: "Thiệt hại $5K–$15K/lần phạt",
    color: "text-red-600 bg-red-500/10",
  },
  {
    icon: Globe2,
    title: "Rào cản đàm phán tiếng Anh thương mại",
    detail: "Email vụng về, không nắm vững Incoterms (FOB/CIF) và tâm lý thương trường Mỹ khiến buyer im lặng sau báo giá.",
    loss: "Tuột mất deal $30K–$200K",
    color: "text-blue-600 bg-blue-500/10",
  },
  {
    icon: Lock,
    title: "Rủi ro lừa đảo thanh toán quốc tế",
    detail: "Không có nghiệp vụ thẩm định điện chuyển tiền SWIFT / LC giả, dẫn đến nguy cơ mất trắng cả container hàng.",
    loss: "Mất trắng cả lô hàng",
    color: "text-purple-600 bg-purple-500/10",
  },
]

const SELF_SETUP = [
  "Mất 6–9 tháng tuyển 2–3 nhân sự sales biết tiếng Anh thương mại & nghiệp vụ XNK",
  "Chi phí quỹ lương, BHXH, văn phòng từ 400M – 800 triệu VNĐ/năm đầu tiên",
  "Tự mày mò đăng ký FDA, quy định MoCRA, DSHEA mất thêm 3–6 tháng",
  "Xây dựng danh sách buyer từ con số 0 — không có dữ liệu hải quan thực tế",
  "Không có quy trình kiểm soát thanh toán quốc tế độc lập, dễ gặp rủi ro gian lận",
  "Khi nhân sự nghỉ việc, toàn bộ mối quan hệ buyer và kinh nghiệm đi theo họ",
]

const VEXIM_WAY = [
  "Đội ngũ sales chuyên trách sẵn có, vận hành ngay từ tuần đầu tiên — không cần đào tạo",
  "Chuyên gia pháp lý FDA hoàn thiện trọn gói hồ sơ cơ sở, U.S. Agent và nhãn mác trong 24–48h",
  "Tiếp cận ngay mạng lưới 420+ buyer Mỹ đã được thẩm định lịch sử nhập khẩu qua Bill of Lading",
  "Đàm phán tiếng Anh thương mại chuẩn mực, bảo vệ tối đa biên lợi nhuận của nhà máy",
  "Quy trình xác thực chuyển tiền SWIFT 2 lớp độc lập (Separation of Duties) — an toàn tuyệt đối",
  "Toàn bộ dữ liệu buyer, lịch sử deal và chứng từ ngoại thương lưu giữ vĩnh viễn trên hệ thống",
]

const BENTO_FEATURES = [
  {
    icon: Users,
    title: "Đội Sales Chuyên Trách 1:1",
    metric: "50+",
    metricLabel: "buyer Mỹ / tháng",
    desc: "Chủ động sàng lọc dữ liệu hải quan, gửi email chào hàng cá nhân hóa và bám sát deal mà bạn không cần tuyển dụng hay quản lý nhân sự.",
    accent: "border-blue-200 bg-blue-50/50 dark:border-blue-900/30 dark:bg-blue-950/20",
    metricColor: "text-blue-600",
  },
  {
    icon: ShieldCheck,
    title: "FDA & MoCRA Trọn Gói",
    metric: "94%",
    metricLabel: "đạt chuẩn / 30 ngày",
    desc: "Xử lý Food Facility Registration, Cosmetic Listing MoCRA, U.S. Agent và rà soát nhãn 21 CFR. Đảm bảo thông quan hàng hóa thuận lợi.",
    accent: "border-teal-200 bg-teal-50/50 dark:border-teal-900/30 dark:bg-teal-950/20",
    metricColor: "text-teal-600",
  },
  {
    icon: Lock,
    title: "Xác Thực SWIFT 2 Lớp Độc Lập",
    metric: "0",
    metricLabel: "rủi ro thanh toán giả",
    desc: "Áp dụng nguyên tắc Separation of Duties của ngành tài chính: nhân sự sales không tự xác nhận tiền; đối soát ngân hàng thật mới giao hàng.",
    accent: "border-purple-200 bg-purple-50/50 dark:border-purple-900/30 dark:bg-purple-950/20",
    metricColor: "text-purple-600",
  },
  {
    icon: BarChart3,
    title: "Quản Trị Pipeline Real-time",
    metric: "24/7",
    metricLabel: "theo dõi tiến độ deal",
    desc: "Bạn nắm rõ chính xác deal nào đang ở bước gửi mẫu, báo giá hay ký hợp đồng. Mọi email đàm phán được lưu trữ minh bạch.",
    accent: "border-amber-200 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-950/20",
    metricColor: "text-amber-600",
  },
  {
    icon: Globe2,
    title: "Đàm Phán Tiếng Anh Thương Mại",
    metric: "100%",
    metricLabel: "chuẩn Incoterms & Mỹ",
    desc: "Đàm phán giá mục tiêu, FOB/CIF, tiến độ giao hàng và dung sai hợp đồng. Tối ưu hóa điều khoản thương mại cho nhà máy Việt.",
    accent: "border-rose-200 bg-rose-50/50 dark:border-rose-900/30 dark:bg-rose-950/20",
    metricColor: "text-rose-600",
  },
  {
    icon: FileSpreadsheet,
    title: "Tài Sản Dữ Liệu Bất Biến",
    metric: "100%",
    metricLabel: "thuộc về nhà máy bạn",
    desc: "Toàn bộ danh bạ buyer, lịch sử đàm phán và hồ sơ pháp lý thuộc sở hữu của doanh nghiệp bạn. Không lo mất khách khi biến động nhân sự.",
    accent: "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/30 dark:bg-emerald-950/20",
    metricColor: "text-emerald-600",
  },
]

const WORKFLOW_STEPS = [
  {
    step: "01",
    time: "Tuần 1–2",
    title: "Onboarding & Chuẩn Hóa FDA",
    subtitle: "Vexim chuẩn bị toàn bộ nền tảng pháp lý & sales kit",
    points: [
      "Thẩm định năng lực sản xuất, quy mô và chất lượng sản phẩm nhà máy",
      "Hoàn thiện hồ sơ cơ sở FDA, chỉ định U.S. Agent hoặc MoCRA trong 24–48h",
      "Xây dựng Sales Kit, Company Profile và Catalog bằng tiếng Anh chuẩn buyer Mỹ",
    ],
    youDo: "Cung cấp mẫu kiểm nghiệm & giấy tờ sẵn có (ISO, HACCP...)",
    badgeColor: "bg-blue-600 text-white",
  },
  {
    step: "02",
    time: "Tuần 3–8",
    title: "Sàng Lọc & Tiếp Cận 50+ Buyer/tháng",
    subtitle: "Khai thác dữ liệu hải quan thực tế Bill of Lading",
    points: [
      "Lọc danh sách buyer Mỹ có lịch sử nhập khẩu cùng ngành hàng qua Bill of Lading",
      "Gửi email chào hàng cá nhân hóa tới đúng người ra quyết định mua hàng (Purchasing Manager)",
      "Đàm phán giá FOB/CIF, dung sai và điều phối gửi mẫu sản phẩm (Sampling)",
    ],
    youDo: "Chuẩn bị mẫu sản phẩm theo tiêu chuẩn đóng gói quốc tế",
    badgeColor: "bg-amber-600 text-white",
  },
  {
    step: "03",
    time: "Tuần 8–12",
    title: "Chốt Hợp Đồng Ngoại Thương & Tiền Về",
    subtitle: "Dòng tiền USD vào tài khoản ngân hàng nhà máy",
    points: [
      "Rà soát Purchase Order (PO) và hợp đồng thương mại quốc tế chặt chẽ",
      "Phối hợp logistics, chứng từ xuất khẩu (B/L, C/O, Phytosanitary, Prior Notice)",
      "Kiểm tra điện chuyển tiền SWIFT 2 lớp độc lập trước khi giao hàng",
    ],
    youDo: "Tập trung sản xuất, xuất xưởng và nhận tiền thanh toán USD",
    badgeColor: "bg-emerald-600 text-white",
  },
]

const INDUSTRIES = [
  {
    icon: Coffee,
    badge: "Nông sản & Thực phẩm (F&B)",
    title: "Cà phê, hạt điều, tiêu, gia vị, trái cây sấy, bún miến, đồ hộp",
    points: [
      "Hỗ trợ đăng ký FDA Food Facility và khai báo Prior Notice từng chuyến hàng",
      "Kết nối mạng lưới nhà nhập khẩu, chuỗi siêu thị Á - Âu và đại lý bán sỉ tại Mỹ",
      "Rà soát bảng Nutrition Facts chuẩn 21 CFR Part 101, kiểm soát hồ sơ HACCP & CoA",
    ],
  },
  {
    icon: Sparkles,
    badge: "Mỹ phẩm & Chăm sóc cá nhân",
    title: "Serum, kem dưỡng, dầu gội, xà phòng thảo mộc, tinh dầu",
    points: [
      "Tuân thủ bắt buộc Đạo luật Hiện đại hóa Mỹ phẩm MoCRA (Cosmetic Product Listing & Facility)",
      "Cung cấp đại diện pháp lý U.S. Responsible Person (RP) theo quy định liên bang",
      "Tiếp cận các chuỗi phân phối mỹ phẩm thiên nhiên, wellness store, spa & salon tại Mỹ",
    ],
  },
  {
    icon: Pill,
    badge: "Thực phẩm chức năng (DSHEA)",
    title: "Viên uống thảo dược, collagen, vitamin, thực phẩm bổ sung dinh dưỡng",
    points: [
      "Hồ sơ tuân thủ DSHEA và thiết kế nhãn Supplement Facts chuẩn 21 CFR 101.36",
      "Rà soát kỹ lưỡng Structure/Function Claims tránh bị FDA cảnh báo Warning Letters",
      "Kết nối các chuỗi bán lẻ chăm sóc sức khỏe, hiệu thuốc và kênh Amazon FBA tại Mỹ",
    ],
  },
]

const CASE_STUDIES = [
  {
    before: "8 tháng tự tìm buyer · 0 đơn vì nhãn FDA sai quy định",
    after: "$180,000",
    afterLabel: "Kim ngạch xuất khẩu sau 3 tháng hợp tác",
    quote:
      "Vexim sửa lại toàn bộ nhãn theo chuẩn FDA trong 1 tuần, sau đó kết nối lại với đúng buyer từng từ chối chúng tôi. Đơn hàng đầu tiên được chốt ngay trong tháng thứ 2.",
    name: "Nguyễn Văn T.",
    role: "Giám đốc xưởng chế biến nông sản",
    location: "Tây Nguyên · 45 công nhân",
    industry: "Cà phê & Nông sản khô",
  },
  {
    before: "Không có nhân sự đàm phán tiếng Anh · Hỏng 2 deal liên tiếp",
    after: "3/3",
    afterLabel: "Đợt thanh toán USD đúng hạn, không phát sinh tranh chấp",
    quote:
      "Buyer Mỹ yêu cầu sửa hợp đồng và thanh toán nhiều đợt. Trước đây chúng tôi lúng túng rồi để mất deal. Đội Vexim đứng ra đàm phán từng điều khoản, giao dịch hoàn thành mỹ mãn.",
    name: "Trần Thanh H.",
    role: "Phó Tổng Giám đốc",
    location: "TP. Hồ Chí Minh · 120 nhân sự",
    industry: "Thực phẩm chế biến",
  },
  {
    before: "Xưởng quy mô 25 người · Lo ngại không đủ lớn để vào Mỹ",
    after: "40%",
    afterLabel: "Tỷ trọng doanh thu đến từ thị trường Mỹ sau 12 tháng",
    quote:
      "Tôi từng nghĩ chỉ tập đoàn lớn mới xuất khẩu được sang Mỹ. Đúng 11 tuần sau khi ký với Vexim, chúng tôi đã có đơn mẫu đầu tiên gửi tới chuỗi wellness store tại California.",
    name: "Lê Hoàng D.",
    role: "Sáng lập thương hiệu thảo mộc",
    location: "Bình Dương · 25 nhân sự",
    industry: "Mỹ phẩm & Thảo dược",
  },
]

export default function ExportSalesServicePage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Phòng kinh doanh xuất khẩu thuê ngoài (Outsourced Export Sales)",
    provider: {
      "@type": "ProfessionalService",
      name: "Vexim Global",
      url: "https://www.veximglobal.com",
      telephone: "+84-373-685-634",
      priceRange: "$$",
    },
    areaServed: ["VN", "US"],
    description:
      "Dịch vụ phòng sale xuất khẩu thuê ngoài cho nhà máy Việt sang Mỹ. Tìm buyer thẩm định, đàm phán hợp đồng, hoàn thiện FDA và quản trị thanh toán SWIFT an toàn.",
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <Header />
      <main className="min-h-screen bg-background">
        {/* HERO SECTION */}
        <section className="relative pt-32 md:pt-40 pb-20 md:pb-28 overflow-hidden bg-gradient-to-b from-primary via-primary/95 to-primary text-white">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-12 gap-12 items-center max-w-7xl mx-auto">
              {/* Left Column */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs md:text-sm font-semibold text-white backdrop-blur-xs">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                  </span>
                  180+ nhà máy Việt Nam đã có đơn hàng USD sang Mỹ
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                  Nhà máy của bạn xứng đáng có{" "}
                  <span className="text-accent underline decoration-accent/40 decoration-wavy">
                    đơn hàng từ Mỹ
                  </span>{" "}
                  — không phải chờ thêm 2 năm.
                </h1>

                <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl">
                  Vexim Global là phòng kinh doanh xuất khẩu chuyên trách của nhà máy bạn.
                  Chúng tôi chủ động tìm buyer Mỹ được thẩm định, đàm phán hợp đồng, xử lý
                  trọn gói FDA và quản trị thanh toán — bạn chỉ cần lo sản xuất và nhận tiền USD.
                </p>

                {/* Key bullets */}
                <ul className="space-y-3 pt-2">
                  {[
                    "Đơn mẫu đầu tiên trong 8–12 tuần từ khi ký hợp đồng",
                    "Tiếp cận 50+ buyer Mỹ đã qua thẩm định hải quan mỗi tháng",
                    "Hoa hồng thành công chỉ thu khi tiền USD thực tế vào tài khoản ngân hàng bạn",
                  ].map((point, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm sm:text-base text-white/90">
                      <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <ExportSalesBookingButton
                    size="lg"
                    className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-xl text-base px-8 py-6 font-semibold"
                  >
                    Đặt lịch tư vấn phòng sales (Miễn phí)
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </ExportSalesBookingButton>

                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-white/30 bg-white/10 text-white hover:bg-white/20 text-base py-6"
                  >
                    <a href="#so-sanh">So sánh vs tự lập phòng sales</a>
                  </Button>
                </div>

                <p className="text-xs text-white/70">
                  Phản hồi trong 2–4h làm việc · Cam kết bảo mật thông tin nhà máy · Không phát sinh chi phí ẩn
                </p>
              </div>

              {/* Right Column: Visual Mockup & Metrics */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-3 shadow-2xl overflow-hidden">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-2.5 px-3">
                    <span className="w-3 h-3 rounded-full bg-red-400" />
                    <span className="w-3 h-3 rounded-full bg-yellow-400" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="text-xs text-white/70 ml-2 font-mono">
                      Vexim Global · Export Sales Pipeline
                    </span>
                  </div>
                  <div className="relative aspect-video rounded-xl overflow-hidden mt-2 bg-slate-900">
                    <Image
                      src="/landing/hero-dashboard.png"
                      alt="Hệ thống quản lý pipeline xuất khẩu sang Mỹ của Vexim Global"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>

                {/* Mini Stat Strip */}
                <div className="grid grid-cols-3 divide-x divide-white/20 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md p-4 text-center">
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-accent">8–12</div>
                    <div className="text-xs text-white/80 mt-1">Tuần ra đơn mẫu</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-white">50+</div>
                    <div className="text-xs text-white/80 mt-1">Buyer Mỹ/tháng</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-emerald-400">100%</div>
                    <div className="text-xs text-white/80 mt-1">Tiền về mới thu phí</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: THE PROBLEM */}
        <section className="py-20 border-b border-border/60 bg-muted/20">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 flex flex-col gap-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-semibold uppercase tracking-wider w-fit">
                  Rào cản thực tế khi xuất khẩu Mỹ
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground text-balance">
                  Sản phẩm tốt thôi là chưa đủ để có đơn hàng từ Mỹ
                </h2>
                <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                  Hầu hết nhà máy sản xuất Việt Nam gặp khó khăn không phải vì chất lượng hàng hóa kém, 
                  mà vì thiếu 4 mảnh ghép cốt lõi này. Mỗi tháng chậm trễ đồng nghĩa với việc doanh thu USD 
                  rơi vào tay đối thủ cùng ngành.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  {GAPS.map((gap, idx) => {
                    const Icon = gap.icon
                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-border bg-card shadow-xs flex flex-col justify-between"
                      >
                        <div>
                          <div className={`w-10 h-10 rounded-lg ${gap.color} flex items-center justify-center mb-3`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <h3 className="font-semibold text-foreground text-sm mb-1">{gap.title}</h3>
                          <p className="text-xs text-muted-foreground leading-relaxed">{gap.detail}</p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-border/50 text-xs font-semibold text-destructive">
                          {gap.loss}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Visual Flow: VN -> Vexim -> USA */}
              <div className="lg:col-span-6">
                <div className="rounded-2xl border border-border/80 bg-card p-6 md:p-8 shadow-lg">
                  <p className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-6">
                    Luồng vận hành xuất khẩu chuẩn hóa qua Vexim Global
                  </p>

                  <div className="flex flex-col items-center gap-3">
                    {/* Node 1: Nhà máy */}
                    <div className="w-full max-w-sm rounded-xl border-2 border-primary/30 bg-primary/5 p-4 text-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2 font-bold text-lg">
                        🏭
                      </div>
                      <h4 className="font-bold text-foreground">Nhà máy Việt Nam</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Tập trung sản xuất, kiểm soát chất lượng & chuẩn bị mẫu
                      </p>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="w-0.5 h-6 bg-primary/40" />
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>

                    {/* Node 2: Vexim Global (Hub) */}
                    <div className="w-full max-w-sm rounded-xl border-2 border-accent bg-accent/10 p-5 text-center shadow-md ring-2 ring-accent/20">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-bold mb-2">
                        ⚡ VEXIM GLOBAL · PHÒNG SALE XUẤT KHẨU
                      </div>
                      <p className="text-xs text-foreground font-medium mb-3">
                        Đảm nhận toàn bộ chu trình đưa hàng vào thị trường Mỹ
                      </p>
                      <div className="flex flex-wrap justify-center gap-1.5">
                        {["Tìm 50+ buyer/tháng", "Hoàn thiện FDA", "Đàm phán tiếng Anh", "Xác thực SWIFT 2 lớp"].map(
                          (tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-[11px] font-semibold text-primary border border-primary/20"
                            >
                              {tag}
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="w-0.5 h-6 bg-emerald-500/50" />
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>

                    {/* Node 3: Buyer Mỹ */}
                    <div className="w-full max-w-sm rounded-xl border-2 border-emerald-500/40 bg-emerald-500/5 p-4 text-center">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-2 font-bold text-lg">
                        🇺🇸
                      </div>
                      <h4 className="font-bold text-foreground">Buyer Nhập Khẩu Mỹ</h4>
                      <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium mt-0.5">
                        Thanh toán USD an toàn · Đơn hàng định kỳ · Không rủi ro
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: COMPARISON */}
        <section id="so-sanh" className="py-20 border-b border-border/60 bg-background scroll-mt-20">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <Badge variant="outline" className="mb-4 text-accent border-accent/30 font-semibold px-3 py-1">
                Bảng so sánh thực tế
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground text-balance">
                Tự lập phòng sales xuất khẩu hay thuê Vexim Global?
              </h2>
              <p className="text-muted-foreground mt-4 text-base md:text-lg leading-relaxed">
                Nhiều doanh nghiệp nghĩ rằng tự tuyển nhân sự sẽ tiết kiệm hơn. Nhưng khi cộng dồn toàn bộ
                chi phí ẩn — quỹ lương, thời gian đào tạo pháp lý FDA, rủi ro rớt deal và sai sót thanh toán — 
                bài toán thực tế hoàn toàn nghiêng về giải pháp thuê ngoài chuyên nghiệp.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Option 1: Tự làm */}
              <Card className="border-2 border-destructive/30 bg-destructive/5 flex flex-col justify-between">
                <CardContent className="p-6 md:p-8 flex flex-col gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-destructive/15 text-destructive flex items-center justify-center shrink-0">
                      <X className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Tự Lập Phòng Sales Nội Bộ</h3>
                      <p className="text-sm text-muted-foreground">Khởi động từ con số không, tốn kém & nhiều rủi ro</p>
                    </div>
                  </div>

                  <ul className="space-y-3.5 pt-2 flex-1">
                    {SELF_SETUP.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                        <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 p-4 rounded-xl border border-destructive/30 bg-card">
                    <div className="text-xs text-muted-foreground uppercase font-semibold">Ước tính chi phí năm đầu:</div>
                    <div className="text-2xl md:text-3xl font-extrabold text-destructive mt-1">
                      500M – 1 Tỷ VNĐ
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Chưa tính rủi ro hàng bị giữ tại cảng và không có bất kỳ cam kết đơn hàng nào.
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Option 2: Thuê Vexim */}
              <Card className="border-2 border-accent bg-card shadow-xl flex flex-col justify-between relative ring-2 ring-accent/20">
                <div className="absolute -top-3 right-6 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                  Giải pháp tối ưu
                </div>
                <CardContent className="p-6 md:p-8 flex flex-col gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-accent text-accent-foreground flex items-center justify-center shrink-0 shadow-md">
                      <Check className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Thuê Phòng Sales Vexim Global</h3>
                      <p className="text-sm text-accent font-medium">Vận hành ngay tuần đầu, đội ngũ chuyên sâu</p>
                    </div>
                  </div>

                  <ul className="space-y-3.5 pt-2 flex-1">
                    {VEXIM_WAY.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-foreground font-medium leading-relaxed">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 p-4 rounded-xl border border-accent/40 bg-accent/10">
                    <div className="text-xs text-foreground uppercase font-bold">Hoa hồng thành công chỉ tính khi:</div>
                    <div className="text-2xl md:text-3xl font-extrabold text-accent mt-1">
                      Tiền USD Đã Vào Tài Khoản Bạn
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Vexim đồng hành chịu trách nhiệm; không thu hoa hồng nếu đơn hàng không được thanh toán thành công.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* SECTION 4: 6 BENTO FEATURES */}
        <section className="py-20 border-b border-border/60 bg-muted/20">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <Badge variant="outline" className="mb-4 text-primary border-primary/30 font-semibold px-3 py-1">
                Hạ tầng & Đội ngũ sẵn sàng
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground text-balance">
                6 giá trị doanh nghiệp nhận được ngay từ tháng đầu tiên
              </h2>
              <p className="text-muted-foreground mt-4 text-base md:text-lg leading-relaxed">
                Không chỉ là phần mềm — đây là đội ngũ chuyên trách, hạ tầng dữ liệu và quy trình pháp lý
                quốc tế hoàn chỉnh được thiết lập riêng cho nhà máy của bạn.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {BENTO_FEATURES.map((item, idx) => {
                const Icon = item.icon
                return (
                  <Card
                    key={idx}
                    className={`border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${item.accent}`}
                  >
                    <CardContent className="p-6 flex flex-col justify-between h-full gap-4">
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-border flex items-center justify-center shadow-xs">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl md:text-3xl font-bold ${item.metricColor}`}>
                            {item.metric}
                          </div>
                          <div className="text-[11px] text-muted-foreground font-medium">{item.metricLabel}</div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* SECTION 5: WORKFLOW */}
        <section className="py-20 border-b border-border/60 bg-background">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <Badge variant="outline" className="mb-4 text-emerald-600 border-emerald-500/30 font-semibold px-3 py-1">
                Lộ trình 8–12 tuần
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground text-balance">
                Bạn tập trung sản xuất. Chúng tôi lo toàn bộ đầu ra.
              </h2>
              <p className="text-muted-foreground mt-4 text-base md:text-lg leading-relaxed">
                Quy trình 3 giai đoạn tinh gọn, đã kiểm chứng qua 180+ thương vụ thành công sang thị trường Mỹ.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {WORKFLOW_STEPS.map((step, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-border bg-card p-6 md:p-8 flex flex-col justify-between shadow-xs hover:border-primary/40 transition-colors relative"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${step.badgeColor}`}>
                      {step.time}
                    </span>
                    <span className="text-3xl font-black text-muted-foreground/30 font-mono">
                      {step.step}
                    </span>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                    <p className="text-xs text-muted-foreground mb-4 font-medium">{step.subtitle}</p>

                    <ul className="space-y-3 mb-6">
                      {step.points.map((pt, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-border bg-muted/30 -mx-6 -mb-6 md:-mx-8 md:-mb-8 p-4 rounded-b-2xl">
                    <div className="text-xs font-semibold text-primary uppercase">Trách nhiệm của bạn:</div>
                    <div className="text-xs text-foreground font-medium mt-1">{step.youDo}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6: INDUSTRIES */}
        <section className="py-20 border-b border-border/60 bg-muted/20">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <Badge variant="outline" className="mb-4 text-primary border-primary/30 font-semibold px-3 py-1">
                Ngành hàng chủ lực
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground text-balance">
                Chuyên sâu 3 lĩnh vực xuất khẩu hàng đầu sang Mỹ
              </h2>
              <p className="text-muted-foreground mt-4 text-base md:text-lg leading-relaxed">
                Mỗi ngành hàng có rào cản kỹ thuật và hệ thống phân phối riêng. Đội ngũ chuyên gia của Vexim
                am hiểu tường tận tiêu chuẩn của từng nhóm sản phẩm theo luật liên bang Hoa Kỳ.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {INDUSTRIES.map((ind, idx) => {
                const Icon = ind.icon
                return (
                  <Card key={idx} className="border-2 hover:border-primary/50 transition-all duration-300 shadow-sm">
                    <CardContent className="p-6 md:p-8 flex flex-col justify-between h-full">
                      <div>
                        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                          <Icon className="w-6 h-6" />
                        </div>
                        <Badge variant="secondary" className="mb-3 text-xs font-bold text-primary">
                          {ind.badge}
                        </Badge>
                        <h3 className="text-lg font-bold text-foreground mb-4 leading-snug">{ind.title}</h3>
                        <ul className="space-y-3">
                          {ind.points.map((pt, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed">
                              <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="max-w-2xl mx-auto text-center mt-12 p-4 rounded-xl border border-border bg-card text-xs text-muted-foreground">
              * Vexim còn hỗ trợ xuất khẩu ngành <strong>Thiết bị y tế (FDA 510(k), Establishment Registration)</strong> và 
              hàng thủ công mỹ nghệ / đồ gỗ theo từng hồ sơ cụ thể.
            </div>
          </div>
        </section>

        {/* SECTION 7: PRICING PROMISE */}
        <section className="py-20 border-b border-border/60 bg-background">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <Badge variant="outline" className="mb-4 text-accent border-accent/30 font-semibold px-3 py-1">
                Mô hình hợp tác minh bạch
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground text-balance">
                Lợi ích của Vexim gắn liền với dòng tiền USD thực tế của bạn
              </h2>
              <p className="text-muted-foreground mt-4 text-base md:text-lg leading-relaxed">
                Không chi phí ẩn. Ba cấu phần rõ ràng — mỗi khoản đều tương ứng với kết quả công việc đo lường được.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <Card className="border p-6 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Bước 1 · Một lần duy nhất
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Phí Khởi Tạo (Setup Fee)</h3>
                  <div className="text-sm font-semibold text-primary mb-4">
                    Tiết kiệm 3–6 tháng tự mày mò pháp lý FDA
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Thẩm định năng lực nhà máy, đăng ký hoàn thiện hồ sơ FDA, xây dựng Sales Kit & Company Profile
                    tiêu chuẩn buyer Mỹ, thiết lập chiến lược thâm nhập thị trường riêng biệt trước khi bắt đầu tiếp cận.
                  </p>
                </div>
              </Card>

              <Card className="border-2 border-primary/40 p-6 flex flex-col justify-between bg-primary/5">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
                    Bước 2 · Hàng tháng
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Phí Duy Trì Đội Sales</h3>
                  <div className="text-sm font-semibold text-accent mb-4">
                    Chỉ bằng 1/4 lương 1 nhân sự — nhưng có cả đội ngũ
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Duy trì Account Executive, chuyên viên FDA, nhân sự đàm phán quốc tế và nền tảng quản trị.
                    Đặc biệt: <strong>50% phí duy trì được khấu trừ vào hoa hồng đơn hàng đầu tiên</strong>.
                  </p>
                </div>
              </Card>

              <Card className="border-2 border-emerald-500/40 p-6 flex flex-col justify-between bg-emerald-500/5">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-2">
                    Bước 3 · Khi có tiền về
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Hoa Hồng Thành Công</h3>
                  <div className="text-sm font-semibold text-emerald-600 mb-4">
                    Vexim chỉ nhận tiền khi nhà máy nhận tiền
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Tỷ lệ % tính trên giá trị hợp đồng đã thanh toán thành công bằng USD vào tài khoản ngân hàng nhà máy.
                    Nếu buyer không thanh toán, Vexim không thu đồng hoa hồng nào.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* SECTION 8: CASE STUDIES */}
        <section className="py-20 border-b border-border/60 bg-muted/20">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <Badge variant="outline" className="mb-4 text-primary border-primary/30 font-semibold px-3 py-1">
                Kết quả thực tế
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground text-balance">
                Từ con số 0 đến đơn hàng USD đầu tiên sang Mỹ
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {CASE_STUDIES.map((story, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col justify-between shadow-xs"
                >
                  <div className="grid grid-cols-2 divide-x divide-border border-b border-border text-center">
                    <div className="p-3 bg-muted/50">
                      <div className="text-[10px] uppercase font-bold text-muted-foreground">Trước</div>
                      <div className="text-xs text-muted-foreground font-medium mt-1 leading-snug">
                        {story.before}
                      </div>
                    </div>
                    <div className="p-3 bg-emerald-500/10">
                      <div className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">Sau Vexim</div>
                      <div className="text-xl font-black text-emerald-600 mt-0.5">{story.after}</div>
                      <div className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                        {story.afterLabel}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col justify-between flex-1 gap-6">
                    <blockquote className="text-sm italic text-muted-foreground leading-relaxed">
                      "{story.quote}"
                    </blockquote>

                    <div className="pt-4 border-t border-border flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                        {story.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-foreground">{story.name}</div>
                        <div className="text-xs text-muted-foreground">{story.role}</div>
                        <div className="text-[11px] text-accent font-medium">{story.location} · {story.industry}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 9: FAQ */}
        <section className="py-20 border-b border-border/60 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4 text-primary border-primary/30 font-semibold px-3 py-1">
                Giải đáp thắc mắc
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground text-balance">
                Câu hỏi thường gặp về phòng sales xuất khẩu
              </h2>
            </div>

            <ExportSalesFaq />
          </div>
        </section>

        {/* SECTION 10: LEAD CAPTURE FORM */}
        <section id="dang-ky" className="py-20 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid lg:grid-cols-12 gap-12 items-center rounded-3xl border-2 border-primary/20 bg-card p-8 md:p-12 shadow-2xl">
              <div className="lg:col-span-5 flex flex-col gap-6">
                <Badge className="bg-accent text-accent-foreground font-bold w-fit">
                  Đăng ký thẩm định năng lực
                </Badge>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
                  Sẵn sàng đưa sản phẩm của bạn vào hệ thống bán lẻ Hoa Kỳ?
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Để lại thông tin về sản phẩm và năng lực sản xuất của nhà máy. Chuyên gia thương mại quốc tế 
                  của Vexim Global sẽ phân tích dữ liệu thị trường và liên hệ tư vấn 1:1 trong 2–4 giờ làm việc.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Hotline tư vấn xuất khẩu 24/7</div>
                      <a href="tel:0373685634" className="text-base font-bold text-foreground hover:text-accent">
                        0373 685 634
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <CalendarCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Thời gian phản hồi</div>
                      <div className="text-sm font-semibold text-foreground">
                        Trong 2–4 giờ làm việc (Thứ 2 – Thứ 7)
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 bg-muted/40 p-6 md:p-8 rounded-2xl border border-border">
                <ExportSalesInlineForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
