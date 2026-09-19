import Header from "@/components/header"
import Footer from "@/components/footer"
import { BackToTop } from "@/components/back-to-top"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Search,
  ArrowRight,
  CheckCircle2,
  XCircle,
  BarChart3,
  Building2,
  TrendingUp,
  FileCheck2,
  ShieldCheck,
  Calendar,
  Briefcase,
  Layers,
  Send,
  MessageSquare,
  PackageCheck,
  Video,
  PlaneTakeoff,
  Award,
  Sparkles,
  PhoneCall,
  Clock,
  ChevronRight,
  Target,
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
  title: "Dịch Vụ Phòng Sale Xuất Khẩu Thuê Ngoài Sang Mỹ | Vexim Global",
  description:
    "Vexim trở thành phòng sale xuất khẩu thuê ngoài, đại diện cho Supplier tiếp cận và kết nối trực tiếp với buyer tại thị trường Mỹ dựa trên dữ liệu hải quan thực tế và chuyên gia tuân thủ tại Hoa Kỳ.",
  keywords: [
    "dịch vụ phòng sale xuất khẩu",
    "phòng sale xuất khẩu",
    "phòng kinh doanh xuất khẩu thuê ngoài",
    "kết nối buyer mỹ",
    "xuất khẩu sang hoa kỳ",
    "vexim trade",
    "tìm buyer quốc tế",
    "b2b xuất khẩu mỹ",
  ],
  alternates: {
    canonical: "/services/export-sales",
  },
  openGraph: {
    title: "Dịch Vụ Phòng Sale Xuất Khẩu Thuê Ngoài Sang Mỹ | Vexim Global",
    description:
      "Có sản phẩm tốt nhưng chưa có một đội ngũ sale đủ mạnh để tiếp cận buyer quốc tế? Vexim đại diện cho Supplier kết nối trực tiếp với buyer Mỹ dựa trên phân tích dữ liệu chuyên sâu.",
    url: "https://www.veximglobal.com/services/export-sales",
    siteName: "Vexim Global",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Vexim Global - Dịch vụ Phòng Sale Xuất Khẩu & Compliance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dịch Vụ Phòng Sale Xuất Khẩu Thuê Ngoài Sang Mỹ | Vexim Global",
    description:
      "Có sản phẩm tốt nhưng chưa có một đội ngũ sale đủ mạnh để tiếp cận buyer quốc tế? Vexim đại diện cho Supplier kết nối trực tiếp với buyer Mỹ dựa trên phân tích dữ liệu chuyên sâu.",
    images: ["/og-image.jpg"],
  },
}

// 6 Nỗi đau của Supplier
const SUPPLIER_PROBLEMS = [
  {
    num: "01",
    title: "Không biết cách tiếp cận đúng buyer",
    desc: "Có sản phẩm và năng lực sản xuất tốt nhưng thiếu kênh liên hệ trực tiếp với người ra quyết định mua hàng tại các chuỗi bán lẻ, nhà nhập khẩu quốc tế.",
  },
  {
    num: "02",
    title: "Mua data nhưng không khai thác được",
    desc: "Mua danh sách buyer trôi nổi nhưng không biết cách phân tích dữ liệu, không xác minh được lịch sử nhập khẩu và nhu cầu thực tế của đối tác.",
  },
  {
    num: "03",
    title: "Chi phí hội chợ, triển lãm quá đắt đỏ",
    desc: "Tốn hàng trăm triệu đến cả tỷ đồng cho các gian hàng triển lãm quốc tế nhưng khó đo lường hiệu quả thực chất và tỷ lệ chuyển đổi đơn hàng.",
  },
  {
    num: "04",
    title: "Bị động trên các sàn B2B trực tuyến",
    desc: "Đăng sản phẩm lên các sàn thương mại điện tử B2B và phải ngồi chờ buyer tìm đến một cách may rủi giữa hàng triệu đối thủ cạnh tranh.",
  },
  {
    num: "05",
    title: "Thường xuyên bị buyer ép giá",
    desc: "Chưa nắm bắt được giá thị trường và tâm lý thương thảo quốc tế, dễ rơi vào thế bị ép giá khiến biên lợi nhuận ngày càng mỏng.",
  },
  {
    num: "06",
    title: "Gánh nặng xây phòng sales nội bộ",
    desc: "Tự xây dựng phòng sale xuất khẩu riêng đòi hỏi chi phí tuyển dụng, trả lương ngoại tệ, đào tạo chuyên sâu và quản lý vận hành vô cùng tốn kém.",
  },
]

// 7 Tiêu chí phân tích buyer của Vexim
const BUYER_CRITERIA = [
  {
    title: "Lịch sử xuất nhập khẩu thực tế",
    desc: "Đối soát trực tiếp dữ liệu Bill of Lading (vận đơn hải quan) để xác thực buyer có đang nhập hàng từ Việt Nam hay châu Á hay không.",
    icon: BarChart3,
  },
  {
    title: "Sản phẩm & nhóm có nhu cầu cao",
    desc: "Xác định rõ nhóm SKU, quy cách bao bì, dung tích và phân khúc giá mà buyer đang tìm nguồn cung cấp thay thế.",
    icon: PackageCheck,
  },
  {
    title: "Nhà cung cấp hiện tại & đối thủ",
    desc: "Phân tích nhà cung cấp hiện tại của buyer để tìm ra lợi thế cạnh tranh về chất lượng, công suất hoặc giá của Supplier.",
    icon: Target,
  },
  {
    title: "Xu hướng & tốc độ tăng trưởng",
    desc: "Đo lường tần suất nhập khẩu tăng hay giảm trong 12–24 tháng gần nhất để nhắm vào buyer đang có đà tăng trưởng mạnh.",
    icon: TrendingUp,
  },
  {
    title: "Thời điểm nhập khẩu nhiều nhất",
    desc: "Nắm bắt chu kỳ mua hàng (mùa vụ, lễ tết tại Mỹ) để chào hàng đúng thời điểm buyer chuẩn bị ký hợp đồng cho mùa mới.",
    icon: Calendar,
  },
  {
    title: "Khả năng mở rộng sản phẩm",
    desc: "Đánh giá quy mô phân phối và năng lực mở rộng dải sản phẩm mới của buyer vào các kênh bán lẻ, siêu thị hoặc online.",
    icon: Briefcase,
  },
  {
    title: "Mức độ phù hợp với Supplier",
    desc: "Khảo sát sự tương thích tuyệt đối giữa dung sai sản xuất, MOQ, chứng chỉ nhà máy và định hướng phát triển của Supplier.",
    icon: ShieldCheck,
  },
]

// 8 Bước quy trình vận hành
const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Phân tích & lựa chọn buyer",
    desc: "Xác định nhóm buyer phù hợp dựa trên dữ liệu nhập khẩu thực tế và tiềm năng phát triển.",
    icon: Search,
  },
  {
    step: "02",
    title: "Chuẩn bị hồ sơ & sản phẩm",
    desc: "Hoàn thiện thông tin doanh nghiệp, thông số kỹ thuật sản phẩm, năng lực cung ứng và hồ sơ pháp lý cần thiết.",
    icon: FileCheck2,
  },
  {
    step: "03",
    title: "Xây dựng Profile chuyên nghiệp",
    desc: "Đưa Supplier và sản phẩm lên hệ thống Vexim Trade theo chuẩn phục vụ hoạt động giao thương B2B quốc tế.",
    icon: Building2,
  },
  {
    step: "04",
    title: "Tiếp cận & chào hàng",
    desc: "Vexim thực hiện outreach chuyên nghiệp, giới thiệu năng lực sản phẩm và kết nối trực tiếp với người phụ trách mua hàng.",
    icon: Send,
  },
  {
    step: "05",
    title: "Giao tiếp & phát triển cơ hội",
    desc: "Theo dõi phản hồi, trao đổi chi tiết nhu cầu, báo giá mục tiêu, điều kiện thương mại Incoterms và yêu cầu kỹ thuật của buyer.",
    icon: MessageSquare,
  },
  {
    step: "06",
    title: "Mẫu & đánh giá sản phẩm",
    desc: "Phối hợp cùng Supplier đóng gói chuẩn hóa, gửi mẫu sang Mỹ và hỗ trợ quy trình đánh giá chất lượng từ phía buyer.",
    icon: PackageCheck,
  },
  {
    step: "07",
    title: "Meeting & đàm phán",
    desc: "Kết nối trực tiếp Supplier với buyer trong các buổi meeting đàm phán hợp đồng, bảo vệ quyền lợi và giá bán của nhà máy.",
    icon: Video,
  },
  {
    step: "08",
    title: "Hỗ trợ đón buyer",
    desc: "Phối hợp đồng hành cùng Supplier trong trường hợp buyer quốc tế có nhu cầu sang Việt Nam tham quan, thẩm định nhà máy.",
    icon: PlaneTakeoff,
  },
]

// 6 Cơ hội dành cho Supplier
const SUPPLIER_OPPORTUNITIES = [
  {
    title: "Tiếp cận trực tiếp với nhà nhập khẩu Mỹ",
    desc: "Thông qua một đội ngũ sale chuyên nghiệp, am hiểu văn hóa kinh doanh và thói quen thu mua của doanh nghiệp Mỹ.",
    icon: Users,
  },
  {
    title: "Không phải tự xây và quản lý bộ máy từ đầu",
    desc: "Bỏ qua áp lực tuyển dụng, chi trả lương cứng ngoại tệ, đào tạo nghiệp vụ và nguy cơ nhân viên nghỉ mang theo khách hàng.",
    icon: ShieldCheck,
  },
  {
    title: "Tập trung tối đa vào sản phẩm & giá bán",
    desc: "Dành toàn bộ nguồn lực quý báu vào việc nâng cấp chất lượng sản phẩm, tối ưu chi phí nguyên liệu và mở rộng công suất sản xuất.",
    icon: Target,
  },
  {
    title: "Mở rộng mạng lưới buyer quốc tế",
    desc: "Liên tục tạo thêm các cơ hội xuất khẩu mới, không bị phụ thuộc vào một vài khách hàng truyền thống hay đầu mối trung gian.",
    icon: TrendingUp,
  },
  {
    title: "Tăng mức độ nhận diện thương hiệu quốc tế",
    desc: "Hình ảnh và năng lực sản xuất của nhà máy được giới thiệu bài bản, chính quy tới cộng đồng doanh nghiệp nhập khẩu Hoa Kỳ.",
    icon: Award,
  },
  {
    title: "Định vị nhà cung cấp chuyên nghiệp, uy tín",
    desc: "Từng bước đưa doanh nghiệp trở thành đối tác chiến lược dài hạn, có đầy đủ năng lực đáp ứng các đơn hàng định kỳ lớn.",
    icon: Building2,
  },
]

export default function ExportSalesServicePage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Dịch Vụ Phòng Sale Xuất Khẩu Thuê Ngoài (Outsourced Export Sales)",
    provider: {
      "@type": "ProfessionalService",
      name: "Vexim Global",
      url: "https://www.veximglobal.com",
      telephone: "+84-373-685-634",
    },
    areaServed: ["VN", "US"],
    description:
      "Vexim trở thành phòng sale xuất khẩu thuê ngoài, đại diện cho Supplier tiếp cận và kết nối trực tiếp với buyer tại thị trường Mỹ dựa trên phân tích dữ liệu chuyên sâu.",
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <Header />

      <main className="min-h-screen bg-background w-full max-w-full overflow-x-hidden">
        {/* ========================================================= */}
        {/* 1. HEADER / HERO SECTION — NỀN SÁNG, TƯƠNG PHẢN RÕ RÀNG */}
        {/* ========================================================= */}
        <section className="pt-20 sm:pt-28 md:pt-36 pb-12 sm:pb-16 md:pb-20 bg-gradient-to-b from-slate-50 via-white to-background border-b border-border/70 overflow-hidden">
          <div className="container mx-auto px-4 max-w-6xl">
            {/* Breadcrumb / Category Tag */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-muted-foreground mb-3 sm:mb-4">
              <Link href="/" className="hover:text-primary transition-colors">
                Trang chủ
              </Link>
              <span>/</span>
              <Link href="/#services" className="hover:text-primary transition-colors">
                Dịch vụ
              </Link>
              <span>/</span>
              <span className="text-foreground font-semibold">Phòng sale xuất khẩu</span>
            </div>

            {/* VÙNG TIÊU ĐỀ RIÊNG BIỆT — TƯƠNG PHẢN CAO, KHÔNG PHỦ BANNER XANH */}
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-sky-100 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800 text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-wider mb-4 sm:mb-6">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-600 dark:text-sky-400" />
                DỊCH VỤ PHÒNG SALE XUẤT KHẨU
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight leading-snug sm:leading-tight mb-4 sm:mb-6 text-balance">
                Có sản phẩm tốt nhưng chưa có một đội ngũ sale đủ mạnh để tiếp cận buyer quốc tế?
              </h1>

              <p className="text-sm sm:text-base md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed font-medium mb-6 sm:mb-8 max-w-3xl mx-auto text-balance">
                <strong className="text-sky-700 dark:text-sky-400 font-bold">
                  Vexim trở thành phòng sale xuất khẩu thuê ngoài
                </strong>
                , đại diện cho Supplier tiếp cận và kết nối trực tiếp với buyer tại thị trường Mỹ dựa trên dữ liệu hải quan thực tế và đội ngũ chuyên gia tại Hoa Kỳ.
              </p>

              {/* Highlight callout box */}
              <div className="max-w-2xl mx-auto p-3.5 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 sm:border-2 sm:border-amber-400 text-amber-950 dark:text-amber-200 text-xs sm:text-sm md:text-base font-semibold shadow-xs mb-6 sm:mb-8 flex items-start sm:items-center justify-center gap-2.5 sm:gap-3 text-left sm:text-center">
                <span className="text-xl sm:text-2xl shrink-0">💡</span>
                <span>
                  Chi phí vận hành chỉ tương đương một nhân sự văn phòng — nhưng Supplier có cả một hệ thống phía sau.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full max-w-md sm:max-w-none mx-auto">
                <ExportSalesBookingButton
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-amber-400 to-orange-500 text-navy-950 hover:from-amber-500 hover:to-orange-600 shadow-md shadow-orange-500/25 text-sm sm:text-base px-5 sm:px-8 py-3 sm:py-4 h-auto font-bold whitespace-normal leading-snug text-center"
                >
                  <span>Đăng ký tư vấn Phòng Sale Xuất khẩu</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 shrink-0" />
                </ExportSalesBookingButton>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-slate-300 hover:bg-slate-100 text-slate-800 dark:text-slate-200 dark:border-slate-700 text-sm sm:text-base px-5 sm:px-8 py-3 sm:py-4 h-auto whitespace-normal font-semibold text-center"
                >
                  <a href="#quy-trinh">Xem 8 bước quy trình</a>
                </Button>
              </div>

              {/* Quick trust metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-200 dark:border-slate-800 text-left">
                <div className="p-2.5 sm:p-3 rounded-xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                  <div className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100">100%</div>
                  <div className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 leading-tight">Dữ liệu hải quan Bill of Lading thực</div>
                </div>
                <div className="p-2.5 sm:p-3 rounded-xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                  <div className="text-xl sm:text-2xl md:text-3xl font-black text-sky-600">7 Tiêu chí</div>
                  <div className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 leading-tight">Sàng lọc buyer trước khi tiếp cận</div>
                </div>
                <div className="p-2.5 sm:p-3 rounded-xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                  <div className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100">Hàng tuần</div>
                  <div className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 leading-tight">Báo cáo tiến độ tập trung minh bạch</div>
                </div>
                <div className="p-2.5 sm:p-3 rounded-xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                  <div className="text-xl sm:text-2xl md:text-3xl font-black text-amber-600">Hoa Kỳ</div>
                  <div className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 leading-tight">Chuyên gia tuân thủ nhập khẩu tại Mỹ</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 2. VẤN ĐỀ CỦA SUPPLIER (PAIN POINTS) */}
        {/* ========================================================= */}
        <section className="py-12 sm:py-16 md:py-24 bg-slate-50/60 dark:bg-slate-900/40 border-b border-border/70 overflow-hidden">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12 md:mb-16">
              <Badge variant="outline" className="mb-2.5 sm:mb-3 text-red-600 border-red-300 bg-red-50/60 font-semibold px-2.5 sm:px-3 py-1 text-xs sm:text-sm">
                Thực trạng doanh nghiệp
              </Badge>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-snug">
                Vấn đề của Supplier khi tìm đường xuất khẩu
              </h2>
              <p className="text-muted-foreground mt-2.5 sm:mt-3 text-sm sm:text-base md:text-lg leading-relaxed">
                Những nút thắt lớn nhất khiến nhà sản xuất Việt Nam dù có hàng tốt vẫn loay hoay chưa thể bước chân vào thị trường quốc tế.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
              {SUPPLIER_PROBLEMS.map((prob) => (
                <Card
                  key={prob.num}
                  className="border border-border/80 bg-card hover:border-red-300 hover:shadow-md transition-all duration-200"
                >
                  <CardContent className="p-4 sm:p-6 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xs sm:text-sm">
                          {prob.num}
                        </span>
                        <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                      </div>
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-slate-100 mb-1.5 sm:mb-2 leading-snug">
                        {prob.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {prob.desc}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 3. GIẢI PHÁP CỦA VEXIM & 7 TIÊU CHÍ PHÂN TÍCH BUYER */}
        {/* ========================================================= */}
        <section className="py-12 sm:py-16 md:py-24 bg-white dark:bg-background border-b border-border/70 overflow-hidden">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12 md:mb-16">
              <Badge variant="outline" className="mb-2.5 sm:mb-3 text-sky-700 border-sky-300 bg-sky-50/60 font-semibold px-2.5 sm:px-3 py-1 text-xs sm:text-sm">
                Giải pháp toàn diện
              </Badge>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-snug">
                Giải pháp của Vexim Global
              </h2>
              <p className="text-slate-700 dark:text-slate-300 mt-2.5 sm:mt-3 text-sm sm:text-base md:text-lg font-medium leading-relaxed">
                Vexim trở thành <strong className="text-sky-700 dark:text-sky-400">phòng sale xuất khẩu thuê ngoài</strong>, 
                đại diện cho Supplier tiếp cận và kết nối trực tiếp với buyer tại thị trường Mỹ.
              </p>
            </div>

            {/* Core Methodology Highlight */}
            <div className="rounded-xl sm:rounded-2xl border border-sky-200 sm:border-2 dark:border-sky-800 bg-sky-50/50 dark:bg-sky-950/20 p-4 sm:p-6 md:p-8 mb-8 sm:mb-12">
              <div className="max-w-3xl mx-auto text-center">
                <h3 className="text-base sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2 sm:mb-3 leading-snug">
                  Không đơn thuần cung cấp danh sách buyer — Vexim phân tích và chọn lọc trước khi tiếp cận
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                  Thay vì gửi hàng loạt email spam vào những địa chỉ vô giá trị, Vexim phân tích sâu từng buyer dựa trên 7 tiêu chí cốt lõi:
                </p>
              </div>
            </div>

            {/* 7 Tiêu chí phân tích buyer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 mb-8 sm:mb-16">
              {BUYER_CRITERIA.map((crit, idx) => {
                const Icon = crit.icon
                return (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-xl border border-border bg-card shadow-xs hover:border-sky-400 transition-colors"
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-400 flex items-center justify-center mb-2.5 sm:mb-3">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mb-1 leading-snug">
                      {crit.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {crit.desc}
                    </p>
                  </div>
                )
              })}

              {/* Card thứ 8: Tổng kết chi phí & sức mạnh */}
              <div className="p-4 sm:p-5 rounded-xl border border-sky-300/60 sm:border-2 bg-gradient-to-br from-navy-800 to-navy-950 text-white flex flex-col justify-between shadow-md">
                <div>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/20 text-white flex items-center justify-center mb-2.5 sm:mb-3">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h4 className="text-sm sm:text-base font-bold mb-1 leading-snug">Hệ thống phía sau Supplier</h4>
                  <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                    Chi phí vận hành chỉ tương đương một nhân sự văn phòng — nhưng bạn sở hữu cả một bộ máy dữ liệu và mạng lưới buyer chuyên nghiệp.
                  </p>
                </div>
                <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-white/20 text-[11px] sm:text-xs font-bold text-sky-200">
                  Hiệu quả tối ưu · Rủi ro tối thiểu
                </div>
              </div>
            </div>

            {/* 2 Trụ cột hỗ trợ: Quản lý tập trung & Chuyên gia tuân thủ tại Mỹ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
              <div className="p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border border-border bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 flex items-center justify-center font-bold shrink-0">
                    <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      Hệ thống quản lý & báo cáo tập trung
                    </h4>
                    <p className="text-[11px] sm:text-xs text-muted-foreground">Định kỳ cập nhật tiến độ hàng tuần</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Đội ngũ vận hành của Vexim có kinh nghiệm thực chiến trong hoạt động sale xuất khẩu quốc tế.
                  Mọi hoạt động tiếp cận, phản hồi của buyer, báo giá và tiến độ deal đều được cập nhật minh bạch trên hệ thống để Supplier luôn nắm rõ bức tranh thực tế.
                </p>
              </div>

              <div className="p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border border-border bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 flex items-center justify-center font-bold shrink-0">
                    <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      Đội ngũ chuyên gia tuân thủ tại Hoa Kỳ
                    </h4>
                    <p className="text-[11px] sm:text-xs text-muted-foreground">Pháp lý FDA, MoCRA & Tiêu chuẩn Mỹ</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Kết hợp cùng các chuyên gia tư vấn pháp lý xuất nhập khẩu bản địa tại Mỹ, giúp Supplier chuẩn bị hồ sơ tuân thủ, kiểm soát nhãn mác và giải trình kỹ thuật một cách bài bản, đáp ứng khắt khe các yêu cầu của thị trường.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. QUY TRÌNH VẬN HÀNH 8 BƯỚC */}
        {/* ========================================================= */}
        <section id="quy-trinh" className="py-12 sm:py-16 md:py-24 bg-slate-50/60 dark:bg-slate-900/40 border-b border-border/70 scroll-mt-20 overflow-hidden">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12 md:mb-16">
              <Badge variant="outline" className="mb-2.5 sm:mb-3 text-blue-700 border-blue-300 bg-blue-50/60 font-semibold px-2.5 sm:px-3 py-1 text-xs sm:text-sm">
                Lộ trình bài bản
              </Badge>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-snug">
                Quy trình vận hành 8 bước
              </h2>
              <p className="text-muted-foreground mt-2.5 sm:mt-3 text-sm sm:text-base md:text-lg leading-relaxed">
                Các bước triển khai chặt chẽ từ khâu phân tích dữ liệu đến khi đón tiếp và ký kết hợp đồng cùng buyer.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
              {WORKFLOW_STEPS.map((step) => {
                const Icon = step.icon
                return (
                  <div
                    key={step.step}
                    className="p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-border bg-card shadow-xs hover:border-sky-400 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <span className="text-xl sm:text-2xl font-black text-sky-600 font-mono">
                          {step.step}
                        </span>
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                          <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mb-1.5 leading-snug">
                        {step.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 5. CƠ HỘI DÀNH CHO SUPPLIER */}
        {/* ========================================================= */}
        <section className="py-12 sm:py-16 md:py-24 bg-white dark:bg-background border-b border-border/70 overflow-hidden">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12 md:mb-16">
              <Badge variant="outline" className="mb-2.5 sm:mb-3 text-sky-700 border-sky-300 bg-sky-50/60 font-semibold px-2.5 sm:px-3 py-1 text-xs sm:text-sm">
                Lợi thế bền vững
              </Badge>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-snug">
                Cơ hội dành cho Supplier
              </h2>
              <p className="text-slate-700 dark:text-slate-300 mt-2.5 sm:mt-3 text-sm sm:text-base md:text-lg font-semibold leading-relaxed">
                Không cần tự xây dựng cả một phòng sale xuất khẩu.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
              {SUPPLIER_OPPORTUNITIES.map((opp, idx) => {
                const Icon = opp.icon
                return (
                  <div
                    key={idx}
                    className="p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-border bg-card shadow-xs hover:border-sky-300 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-400 flex items-center justify-center mb-3 sm:mb-4">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-slate-100 mb-1.5 sm:mb-2 leading-snug">
                        {opp.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {opp.desc}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 6. FAQ (CÂU HỎI THƯỜNG GẶP) */}
        {/* ========================================================= */}
        <section className="py-12 sm:py-16 md:py-20 bg-slate-50/60 dark:bg-slate-900/40 border-b border-border/70 overflow-hidden">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-8 sm:mb-12">
              <Badge variant="outline" className="mb-2.5 sm:mb-3 text-slate-700 border-slate-300 font-semibold px-2.5 sm:px-3 py-1 text-xs sm:text-sm">
                Giải đáp thắc mắc
              </Badge>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-snug">
                Câu hỏi thường gặp về dịch vụ phòng sale xuất khẩu
              </h2>
            </div>

            <ExportSalesFaq />
          </div>
        </section>

        {/* ========================================================= */}
        {/* 7. CTA & FORM ĐĂNG KÝ TƯ VẤN (CALL TO ACTION) */}
        {/* ========================================================= */}
        <section id="dang-ky" className="py-12 sm:py-16 md:py-24 bg-white dark:bg-background overflow-hidden">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="rounded-2xl sm:rounded-3xl border border-sky-200 sm:border-2 sm:border-sky-300 dark:border-sky-800 bg-gradient-to-br from-sky-50/40 via-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-4 sm:p-6 md:p-10 shadow-lg sm:shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
                {/* Left: Message & Contact */}
                <div className="lg:col-span-5 flex flex-col gap-3.5 sm:gap-5">
                  <Badge className="bg-sky-600 text-white font-bold w-fit text-xs px-2.5 sm:px-3 py-1">
                    KẾT NỐI NGAY HÔM NAY
                  </Badge>

                  <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-snug">
                    Bạn có sản phẩm tốt.
                    <span className="block text-sky-700 dark:text-sky-400 mt-1">
                      Vexim giúp bạn xây dựng hệ thống để đưa sản phẩm đó đến đúng buyer.
                    </span>
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Hãy chia sẻ thông tin sản phẩm và năng lực cung ứng của nhà máy bạn. Đội ngũ chuyên gia Vexim Global sẽ phân tích dữ liệu thị trường và liên hệ tư vấn 1:1 trong 2–4 giờ làm việc.
                  </p>

                  <div className="pt-2 sm:pt-3 space-y-2.5 sm:space-y-3 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex items-center justify-center shrink-0">
                        <PhoneCall className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[11px] sm:text-xs text-muted-foreground">Hotline tư vấn xuất khẩu 24/7</div>
                        <a href="tel:0373685634" className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-sky-600">
                          0373 685 634
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[11px] sm:text-xs text-muted-foreground">Thời gian phản hồi</div>
                        <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">
                          Trong 2–4 giờ làm việc (Thứ 2 – Thứ 7)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Inline Form */}
                <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm sm:shadow-md">
                  <div className="mb-3.5 pb-2.5 sm:mb-5 sm:pb-3 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      Đăng ký tư vấn Phòng Sale Xuất khẩu Vexim
                    </h3>
                    <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
                      Vui lòng để lại thông tin để nhận đánh giá sơ bộ độ phù hợp với buyer Mỹ
                    </p>
                  </div>
                  <ExportSalesInlineForm />
                </div>
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
