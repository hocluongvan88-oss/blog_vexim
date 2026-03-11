import Header from "@/components/header"
import Footer from "@/components/footer"
import { BackToTop } from "@/components/back-to-top"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Shield,
  Upload,
  Search,
  FileCheck,
  Users,
  Award,
  Database,
  Brain,
  Zap,
  ArrowRight,
  BarChart3,
  XCircle,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Ship,
  PackageX,
  TrendingDown,
} from "lucide-react"
import ConsultationDialog from "@/components/consultation-dialog"
import Image from "next/image"
import Link from "next/link"

const targetAudiences = [
  {
    title: '"Tôi đang chuẩn bị xuất lô hàng đầu tiên sang Mỹ"',
    problem: "Không biết nhãn sản phẩm đã đạt chuẩn FDA chưa. Sợ hàng đến cảng bị giữ lại mà không rõ lý do.",
    solution: "AI của Vexim sẽ quét nhãn trong 2 phút, chỉ ra chính xác điểm nào cần sửa trước khi xuất hàng.",
  },
  {
    title: '"Lô hàng của tôi vừa bị FDA detention"',
    problem: "Đang bị giữ hàng tại cảng, chi phí lưu container tăng mỗi ngày. Cần biết ngay lỗi gì để sửa.",
    solution:
      "Chuyên gia của Vexim phân tích nguyên nhân vi phạm, cung cấp hướng dẫn khắc phục và hồ sơ để nộp cho FDA.",
  },
  {
    title: '"Buyer Mỹ yêu cầu Compliance Certificate"',
    problem: "Đối tác nhập khẩu yêu cầu chứng nhận tuân thủ FDA trước khi ký hợp đồng. Không biết lấy ở đâu.",
    solution: "Vexim cấp Certification Letter khi nhãn đạt chuẩn - có giá trị để trình cho buyer và importer.",
  },
  {
    title: '"Tôi cần kiểm tra lại nhãn trước khi in ấn số lượng lớn"',
    problem: "Đã thiết kế xong nhãn nhưng không chắc chắn đã tuân thủ đầy đủ quy định. In sai thì phải hủy toàn bộ.",
    solution: "Tải nhãn lên kiểm tra trước khi đặt in. Sửa sớm - tiết kiệm chi phí in lại hàng chục nghìn USD.",
  },
]

const industries = [
  {
    title: "Thực phẩm",
    regulation: "21 CFR Part 101",
    description: "Nutrition Facts, Allergens, Net Weight, Ingredient List theo chuẩn FDA mới nhất 2016 Label Format.",
    warningLetters: "1.247 Warning Letters",
    icon: "food",
  },
  {
    title: "Mỹ phẩm",
    regulation: "21 CFR Part 701",
    description:
      'Ranh giới giữa "cosmetic" và "drug" rất mong manh. Chỉ một từ sai trên nhãn cũng có thể khiến sản phẩm bị xếp loại thuốc.',
    warningLetters: "312 Warning Letters",
    icon: "cosmetics",
  },
  {
    title: "Thực phẩm chức năng",
    regulation: "21 CFR Part 111 + DSHEA",
    description:
      "Structure/Function Claims, Supplement Facts Panel, CGMP - lĩnh vực có tỷ lệ Warning Letter cao nhất.",
    warningLetters: "589 Warning Letters",
    icon: "supplement",
  },
  {
    title: "Thiết bị y tế (OTC)",
    regulation: "21 CFR Part 801",
    description:
      "Device Labeling, Intended Use, Directions for Use. Yêu cầu ghi nhãn đặc thù khác biệt hoàn toàn so với thực phẩm.",
    warningLetters: "198 Warning Letters",
    icon: "medical",
  },
]

const violationExamples = [
  {
    date: "03/2025",
    product: "Instant Noodles — Mixed Vegetable",
    company: "Landa Foods Co.",
    violation: "Không khai báo chất gây dị ứng WHEAT (lúa mì) trong Ingredient List",
    cfr: "21 CFR 101.4",
    classification: "Class I",
  },
  {
    date: "01/2025",
    product: "Herbal Tea Supplement",
    company: "Viet Herb Ltd.",
    violation: "Structure/Function claim thiếu dòng disclaimer bắt buộc của FDA",
    cfr: "21 CFR 101.93",
    classification: "Class II",
  },
  {
    date: "11/2024",
    product: "Whitening Face Cream",
    company: "Saigon Beauty Corp.",
    violation: 'Nhãn mỹ phẩm chứa drug claim ("brightens skin tone" = tác động cấu trúc da)',
    cfr: "21 CFR 701.3",
    classification: "Class II",
  },
  {
    date: "09/2024",
    product: "Dried Mango Slices",
    company: "Delta Snack Inc.",
    violation: "Net weight chỉ ghi đơn vị oz, thiếu đơn vị metric (gram) theo yêu cầu",
    cfr: "21 CFR 101.105",
    classification: "Class III",
  },
]

const processSteps = [
  {
    step: "01",
    title: "Tải nhãn lên hệ thống",
    description:
      "Chụp ảnh hoặc tải file nhãn sản phẩm. AI Vision OCR trích xuất toàn bộ nội dung, bố cục và cấu trúc hình ảnh với độ chính xác cao.",
    note: "Hỗ trợ JPG, PNG, PDF - tối đa 4 mặt nhãn cùng lúc.",
    icon: Upload,
  },
  {
    step: "02",
    title: "Đối chiếu dữ liệu thực tế",
    description:
      "Từng yếu tố trên nhãn được đối chiếu trực tiếp với 5.346 Warning Letters, Recall, Alerts và toàn bộ 21 CFR liên quan.",
    note: "Cơ sở dữ liệu cập nhật hàng tuần từ FDA.gov.",
    icon: Database,
  },
  {
    step: "03",
    title: "Phân tích chuyên sâu",
    description:
      "Mô hình AI chuyên biệt xác định từng điểm vi phạm, trích dẫn mã CFR cụ thể và đánh giá mức độ nghiêm trọng.",
    note: "Phân loại: Critical / Major / Minor - Hoàn thành trong ~2 phút.",
    icon: Brain,
  },
  {
    step: "04",
    title: "Chuyên gia rà soát",
    description:
      "FDA Compliance Specialist rà soát báo cáo AI và bổ sung nhận định chuyên sâu dựa trên kinh nghiệm thực tế.",
    note: "Thời gian rà soát: 4–24 giờ làm việc.",
    icon: Users,
  },
  {
    step: "05",
    title: "Báo cáo & Chứng nhận",
    description:
      "Báo cáo đầy đủ kèm trích dẫn CFR, hướng dẫn khắc phục từng lỗi, Risk Score tổng thể và xác nhận tuân thủ.",
    note: "Xuất PDF chuyên nghiệp - dùng để đàm phán với buyer và importer.",
    icon: FileCheck,
  },
]

const commonViolations = [
  { industry: "Thực phẩm", violation: "Sai đơn vị khối lượng tịnh", percentage: 31, cases: 1187 },
  { industry: "Thực phẩm", violation: "Sai định dạng Nutrition Facts 2016", percentage: 24, cases: 894 },
  { industry: "TP/TPCN", violation: "Không khai báo chất gây dị ứng", percentage: 17, cases: 618 },
  { industry: "TPCN", violation: "Thiếu disclaimer cho claim chức năng", percentage: 22, cases: 429 },
  { industry: "Mỹ phẩm", violation: "Nhãn chứa tuyên bố dược phẩm", percentage: 34, cases: 306 },
]

const comparisonData = [
  { criteria: "Thời gian phân tích", vexim: "2–3 phút", traditional: "3–7 ngày làm việc" },
  { criteria: "Chi phí", vexim: "299.000đ–899.000đ/tháng", traditional: "$500–2.000 mỗi lần kiểm tra" },
  { criteria: "Phạm vi ngành", vexim: "Thực phẩm, Mỹ phẩm, TPCN, OTC", traditional: "Thường chuyên sâu 1 ngành duy nhất" },
  { criteria: "Nguồn dữ liệu", vexim: "5.346 Warning Letters + toàn bộ 21 CFR", traditional: "Dựa vào kinh nghiệm cá nhân" },
  { criteria: "Tính nhất quán", vexim: "100% nhất quán giữa các lần kiểm tra", traditional: "Phụ thuộc trạng thái chuyên gia" },
  { criteria: "Kiểm tra lại sau khi sửa", vexim: "Miễn phí, không giới hạn", traditional: "Tính thêm phí mỗi lần" },
  { criteria: "Báo cáo chi tiết", vexim: "PDF kèm mã CFR + ảnh chụp nhãn", traditional: "File Word hoặc email tóm tắt" },
  { criteria: "Hỗ trợ sau phân tích", vexim: "Chuyên gia rà soát + tư vấn 1-1", traditional: "Hạn chế hoặc không có" },
]

const testimonials = [
  {
    quote:
      "Hai container bánh kẹo bị FDA giữ tại cảng Los Angeles vì khai báo chất gây dị ứng sai. Sau khi sử dụng Vexim, chúng tôi phát hiện lỗi tương tự trên 3 sản phẩm khác TRƯỚC khi xuất hàng. Ước tính tiết kiệm ít nhất 60.000 USD.",
    name: "Nguyễn Thành Trung",
    title: "Giám đốc Xuất khẩu — Công ty TNHH Thực phẩm Hòa Bình",
    highlight: "Tiết kiệm 60K USD",
  },
  {
    quote:
      "Thực phẩm chức năng có quy định cực kỳ phức tạp. Vexim phát hiện lỗi Structure/Function claim mà cả đội QA nội bộ 5 người đều bỏ sót. Báo cáo chi tiết đến từng mã CFR — rất chuyên nghiệp.",
    name: "Trần Thị Minh Hằng",
    title: "Trưởng phòng QA — Viet Herb & Supplement Co.",
    highlight: "Phát hiện lỗi QA bỏ sót",
  },
  {
    quote:
      "Trước đây mỗi lần xuất hàng là một lần lo lắng. Từ khi dùng Vexim, quy trình đã được chuẩn hóa hoàn toàn. 12 tháng liên tiếp zero FDA detention. Đây là khoản đầu tư có tỷ suất sinh lời cao nhất trong công ty.",
    name: "Lê Quang Khải",
    title: "Tổng Giám đốc — Saigon Organic Foods",
    highlight: "12 tháng 0 detention",
  },
]

export default function FDALabelCheckPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white pt-32 md:pt-40 pb-16 md:pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium">
                <Database className="w-4 h-4" />
                Đối soát trực tiếp dữ liệu từ 5.346 vi phạm thực tế của FDA
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance leading-tight">
                Kiểm tra tuân thủ nhãn FDA theo 21 CFR
                <span className="block text-accent mt-2">Phát hiện lỗi trước khi hàng rời cảng</span>
              </h1>
              <p className="text-xl text-white/90 mb-8 text-pretty leading-relaxed max-w-3xl mx-auto">
                Bạn có chắc nhãn sản phẩm không nằm trong danh sách Warning Letters của FDA? Vexim AI tự động hóa quy
                trình thẩm định phức tạp bằng cách đối soát với 5.346 vi phạm thực tế. Chúng tôi phát hiện những lỗi mà
                mắt thường dễ dàng bỏ sót, giúp doanh nghiệp loại bỏ rủi ro lưu kho bãi và chi phí thu hồi hàng tỷ đồng.
              </p>
              <div className="flex flex-wrap gap-4 justify-center mb-12">
                <ConsultationDialog>
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-white shadow-lg text-lg px-8 py-6">
                    Kiểm tra nhãn của bạn ngay
                  </Button>
                </ConsultationDialog>
                <Link href="/fda-tracker">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 text-white text-lg px-8 py-6"
                  >
                    Xem các trường hợp vi phạm thực tế
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 max-w-4xl mx-auto">
                {[
                  { value: "5.346", label: "Vi phạm FDA trong cơ sở dữ liệu" },
                  { value: "4 ngành", label: "Thực phẩm . Mỹ phẩm . TPCN . OTC" },
                  { value: "~2 phút", label: "Thời gian nhận kết quả" },
                  { value: "99,5%", label: "Tỷ lệ thông quan sau khi sửa" },
                  { value: "200+", label: "Doanh nghiệp Việt Nam tin dùng" },
                ].map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-accent">{stat.value}</div>
                    <div className="text-xs md:text-sm text-white/70 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Target Audience Section */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <p className="text-sm font-medium text-accent mb-2">Dành cho ai?</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Bạn đang ở trong tình huống nào?</h2>
              <p className="text-lg text-muted-foreground text-pretty">
                Dù đang chuẩn bị xuất khẩu lần đầu hay đã từng bị FDA cảnh cáo - Vexim đều có giải pháp phù hợp.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {targetAudiences.map((item, idx) => (
                <Card key={idx} className="border-2 hover:border-primary/50 transition-colors overflow-hidden">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-3 text-primary">{item.title}</h3>
                    <p className="text-muted-foreground mb-4 text-sm">{item.problem}</p>
                    <div className="bg-accent/10 rounded-lg p-4">
                      <p className="text-sm font-medium text-accent">{item.solution}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Industries Section */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <p className="text-sm font-medium text-accent mb-2">Phạm vi hỗ trợ</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                4 ngành hàng do FDA kiểm soát - Vexim hỗ trợ toàn bộ
              </h2>
              <p className="text-lg text-muted-foreground">
                Mỗi ngành có bộ quy định riêng biệt. AI của Vexim được huấn luyện chuyên sâu trên từng nhóm 21 CFR tương
                ứng.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {industries.map((industry, idx) => (
                <Card key={idx} className="border-2 hover:border-primary/50 transition-colors h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-foreground mb-1">{industry.title}</h3>
                      <p className="text-sm font-medium text-primary">{industry.regulation}</p>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4 flex-grow">{industry.description}</p>
                    <div className="pt-4 border-t">
                      <span className="text-sm font-semibold text-accent">{industry.warningLetters}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Violation Database Section */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Cơ sở dữ liệu vi phạm FDA thực tế
              </h2>
              <p className="text-lg text-muted-foreground">
                Đây không phải lý thuyết - mỗi dòng dữ liệu dưới đây là một doanh nghiệp đã phải trả giá đắt vì lỗi nhãn
                dán.
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              {/* Violation Table */}
              <Card className="overflow-hidden mb-8">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-4 font-semibold">Ngày</th>
                        <th className="text-left p-4 font-semibold">Sản phẩm</th>
                        <th className="text-left p-4 font-semibold">Vi phạm</th>
                        <th className="text-left p-4 font-semibold">Mã CFR</th>
                        <th className="text-left p-4 font-semibold">Phân loại</th>
                      </tr>
                    </thead>
                    <tbody>
                      {violationExamples.map((v, idx) => (
                        <tr key={idx} className="border-t hover:bg-muted/50 transition-colors">
                          <td className="p-4 text-muted-foreground">{v.date}</td>
                          <td className="p-4">
                            <div className="font-medium">{v.product}</div>
                            <div className="text-xs text-muted-foreground">{v.company}</div>
                          </td>
                          <td className="p-4 text-muted-foreground">{v.violation}</td>
                          <td className="p-4 font-mono text-primary text-xs">{v.cfr}</td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                v.classification === "Class I"
                                  ? "bg-red-100 text-red-700"
                                  : v.classification === "Class II"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {v.classification}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Classification Legend */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="border-l-4 border-l-red-500">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-red-600 mb-1">Class I</h4>
                    <p className="text-xs text-muted-foreground">
                      Mức nguy hiểm cao nhất. Có thể gây hại sức khỏe nghiêm trọng hoặc tử vong. Phải thu hồi toàn bộ
                      ngay lập tức.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-yellow-500">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-yellow-600 mb-1">Class II</h4>
                    <p className="text-xs text-muted-foreground">
                      Nguy cơ gây hại tạm thời. Có thể gây hiểu nhầm nghiêm trọng hoặc ảnh hưởng sức khỏe tạm thời.
                      Chiếm đa số vi phạm nhãn.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-blue-600 mb-1">Class III</h4>
                    <p className="text-xs text-muted-foreground">
                      Vi phạm kỹ thuật. Không gây hại trực tiếp, nhưng hàng vẫn bị giữ tại cảng và từ chối nhập khẩu vào
                      Mỹ.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <p className="text-sm font-medium text-accent mb-2">Quy trình hoạt động</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Nhận báo cáo chỉ trong 5 bước</h2>
              <p className="text-lg text-muted-foreground">
                Minh bạch, chính xác, có thể kiểm chứng với chuyên gia. Mỗi vi phạm đều kèm mã CFR và hướng dẫn khắc
                phục cụ thể.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {processSteps.map((step, idx) => (
                <Card key={idx} className="border-l-4 border-l-primary hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                          <step.icon className="w-8 h-8 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-bold text-accent">BƯỚC {step.step}</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                        <p className="text-muted-foreground leading-relaxed mb-2">{step.description}</p>
                        <p className="text-sm text-primary font-medium">{step.note}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Example Report */}
            <div className="max-w-4xl mx-auto mt-12">
              <h3 className="text-xl font-semibold mb-6 text-center">Ví dụ kết quả phân tích thực tế</h3>
              <Card className="border-2 border-primary/20">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                      <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-red-700 text-sm">NGHIÊM TRỌNG - 21 CFR 101.4(b)(2)</p>
                        <p className="text-sm text-red-600">
                          Chất gây dị ứng MILK (sữa) không được khai báo trong Allergen Statement. Phải bổ sung dòng
                          &quot;Contains: Milk&quot; hoặc in đậm trong danh sách thành phần.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-yellow-700 text-sm">QUAN TRỌNG - 21 CFR 101.9(c)(7)</p>
                        <p className="text-sm text-yellow-600">
                          Added Sugars (đường bổ sung) chưa được khai báo riêng trong bảng Nutrition Facts. Bắt buộc
                          theo định dạng mới từ 01/01/2021.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-yellow-700 text-sm">QUAN TRỌNG - 21 CFR 101.105(a)</p>
                        <p className="text-sm text-yellow-600">
                          Khối lượng tịnh chỉ ghi &quot;8 oz&quot;, thiếu đơn vị hệ mét (226g). FDA yêu cầu ghi đồng
                          thời cả hai hệ đơn vị.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-green-700 text-sm">ĐẠT CHUẨN - 21 CFR 101.2(b)</p>
                        <p className="text-sm text-green-600">
                          Mặt hiển thị chính có đầy đủ Tên sản phẩm, Khối lượng tịnh, Nhãn hiệu. Kích thước chữ đạt yêu
                          cầu tối thiểu.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground">Điểm rủi ro:</p>
                        <p className="text-2xl font-bold text-red-500">7,8/10</p>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <span className="text-red-600">Nghiêm trọng: 1</span>
                        <span className="text-yellow-600">Quan trọng: 2</span>
                        <span className="text-blue-600">Nhẹ: 1</span>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-accent">Cần khắc phục trước khi xuất hàng</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Trust Vexim */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Tại sao kết quả của Vexim lại đáng tin cậy?
              </h2>
              <p className="text-lg text-muted-foreground">
                AI của Vexim được huấn luyện trực tiếp trên dữ liệu cưỡng chế thực tế của FDA - không chỉ lý thuyết sách
                vở.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
              {[
                {
                  icon: Database,
                  title: "5.346 FDA Warning Letters & Recalls (2021–2025)",
                  description:
                    "Toàn bộ vi phạm thực tế trên cả 4 ngành. AI học từ chính những lỗi mà doanh nghiệp đã bị FDA xử phạt.",
                },
                {
                  icon: FileText,
                  title: "21 CFR Part 101, 111, 701, 801",
                  description:
                    "Toàn bộ quy định ghi nhãn cho Thực phẩm, TPCN, Mỹ phẩm và Thiết bị y tế. Cập nhật theo Federal Register.",
                },
                {
                  icon: FileCheck,
                  title: "Tài liệu hướng dẫn của FDA (Draft + Final)",
                  description:
                    "Draft Guidance, CPG, Import Alerts và Q&A - các tài liệu diễn giải quy định được FDA sử dụng trong thực tế.",
                },
                {
                  icon: AlertTriangle,
                  title: "Dữ liệu cảnh báo nhập khẩu (Alerts FDA)",
                  description:
                    "Hồ sơ các lô hàng bị từ chối tại cảng Mỹ - giúp AI hiểu pattern vi phạm phổ biến nhất theo từng loại sản phẩm.",
                },
              ].map((item, idx) => (
                <Card key={idx} className="border-2 hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <item.icon className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Common Violations */}
            <div className="max-w-4xl mx-auto">
              <h3 className="text-xl font-semibold mb-6 text-center">Các vi phạm phổ biến nhất theo ngành:</h3>
              <div className="space-y-3">
                {commonViolations.map((v, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-muted/50 rounded-lg p-4">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                      {v.industry}
                    </span>
                    <span className="flex-grow text-sm">{v.violation}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-accent rounded-full" style={{ width: `${v.percentage}%` }}></div>
                      </div>
                      <span className="text-sm font-semibold text-accent">{v.percentage}%</span>
                      <span className="text-xs text-muted-foreground">{v.cases.toLocaleString()} vụ</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-center text-sm text-muted-foreground mt-6">
                Cơ sở dữ liệu được cập nhật hàng tuần. Mỗi Warning Letter mới tại FDA.gov được đội ngũ kỹ thuật Vexim xử
                lý và đưa vào hệ thống trong vòng 7 ngày.
              </p>
            </div>
          </div>
        </section>

        {/* What Happens at Port */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Điều gì xảy ra khi hàng đến cảng Mỹ? Bạn nên biết
              </h2>
              <p className="text-lg text-muted-foreground">
                FDA sử dụng hệ thống AI PREDICT 2.0 từ năm 2024 - tự động phát hiện lô hàng rủi ro cao.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {/* Process Flow */}
              <div className="grid md:grid-cols-4 gap-4 mb-12">
                {[
                  {
                    step: 1,
                    title: "Khai báo nhập khẩu",
                    desc: "Container đến cảng, nhà nhập khẩu nộp hồ sơ khai báo cho Hải quan Mỹ (CBP).",
                    icon: Ship,
                  },
                  {
                    step: 2,
                    title: "FDA sàng lọc tự động",
                    desc: "Hệ thống AI PREDICT của FDA quét tự động, đánh dấu sản phẩm có rủi ro cao.",
                    icon: Search,
                  },
                  {
                    step: 3,
                    title: "Kiểm tra vật lý",
                    desc: "FDA lấy mẫu kiểm tra nhãn. Phát hiện vi phạm → Giữ hàng (Detention Notice).",
                    icon: FileText,
                  },
                  {
                    step: 4,
                    title: "Thông quan hoặc từ chối",
                    desc: "Đạt → hàng được thông quan. Không đạt → từ chối nhập khẩu, phải vận chuyển về hoặc tiêu hủy.",
                    icon: PackageX,
                  },
                ].map((item, idx) => (
                  <Card key={idx} className="text-center">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-xs font-medium text-accent mb-2">BƯỚC {item.step}</div>
                      <h4 className="font-semibold mb-2 text-sm">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Cost Cards */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="border-2 border-red-200 bg-red-50/50">
                  <CardContent className="p-6 text-center">
                    <DollarSign className="w-10 h-10 text-red-500 mx-auto mb-3" />
                    <h4 className="font-semibold mb-1">Chi phí giữ hàng</h4>
                    <p className="text-2xl font-bold text-red-600 mb-2">$5.000–15.000</p>
                    <p className="text-xs text-muted-foreground">
                      Phí container, phí lưu bãi, phí trễ tàu — tăng theo từng ngày bị giữ.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-yellow-200 bg-yellow-50/50">
                  <CardContent className="p-6 text-center">
                    <Clock className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
                    <h4 className="font-semibold mb-1">Thời gian chậm trễ</h4>
                    <p className="text-2xl font-bold text-yellow-600 mb-2">2–4 tuần</p>
                    <p className="text-xs text-muted-foreground">
                      Chờ sửa nhãn hoặc vận chuyển về. Mất suất lên kệ siêu thị, mất buyer.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-orange-200 bg-orange-50/50">
                  <CardContent className="p-6 text-center">
                    <TrendingDown className="w-10 h-10 text-orange-500 mx-auto mb-3" />
                    <h4 className="font-semibold mb-1">Tổn hại uy tín</h4>
                    <p className="text-2xl font-bold text-orange-600 mb-2">Khó phục hồi</p>
                    <p className="text-xs text-muted-foreground">
                      FDA lưu hồ sơ vi phạm vĩnh viễn. Các lô hàng tiếp theo chắc chắn sẽ bị kiểm tra kỹ hơn.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8 p-6 bg-accent/10 rounded-xl text-center">
                <h4 className="text-xl font-bold mb-2">
                  Kiểm tra TRƯỚC khi gửi hàng = Tiết kiệm 15.000-50.000 USD mỗi lô
                </h4>
                <p className="text-muted-foreground mb-4">
                  Chi phí sử dụng Vexim chỉ từ 499.000đ. Chỉ cần tránh được 1 lần bị từ chối - tỷ suất sinh lời lên đến
                  100-1.000 lần.
                </p>
                <ConsultationDialog>
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-white">
                    Kiểm tra nhãn miễn phí ngay
                  </Button>
                </ConsultationDialog>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Vexim so với dịch vụ tư vấn truyền thống
              </h2>
              <p className="text-lg text-muted-foreground">
                Nhanh hơn, chính xác hơn, tiết kiệm hơn - và không phụ thuộc vào kiến thức cá nhân của một chuyên gia.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-primary text-white">
                      <tr>
                        <th className="text-left p-4 font-semibold">Tiêu chí so sánh</th>
                        <th className="text-left p-4 font-semibold">Vexim AI Platform</th>
                        <th className="text-left p-4 font-semibold">Tư vấn truyền thống</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonData.map((row, idx) => (
                        <tr key={idx} className="border-t hover:bg-muted/50 transition-colors">
                          <td className="p-4 font-medium">{row.criteria}</td>
                          <td className="p-4 text-accent font-medium">{row.vexim}</td>
                          <td className="p-4 text-muted-foreground">{row.traditional}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <p className="text-sm font-medium text-accent mb-2">Phản hồi từ khách hàng</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Hơn 200 doanh nghiệp Việt Nam đã kiểm chứng hiệu quả
              </h2>
              <p className="text-lg text-muted-foreground">Tỷ lệ thông quan FDA đạt 99,5% sau khi sử dụng Vexim.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {testimonials.map((t, idx) => (
                <Card key={idx} className="border-2 hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <p className="text-muted-foreground mb-6 leading-relaxed">&quot;{t.quote}&quot;</p>
                    <div className="border-t pt-4">
                      <p className="font-semibold">{t.name}</p>
                      <p className="text-sm text-muted-foreground">{t.title}</p>
                      <span className="inline-block mt-2 px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">
                        {t.highlight}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* What You Get */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Bạn nhận được gì khi sử dụng Vexim?
              </h2>
              <p className="text-lg text-muted-foreground">
                Cam kết từ đội ngũ FDA Compliance Specialist với hơn 10 năm kinh nghiệm thực chiến.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Card className="border-2 border-primary/20">
                <CardContent className="p-6">
                  <Brain className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-4">Báo cáo AI chuyên sâu</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      Quét toàn bộ nhãn bằng OCR + Vision AI
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      Phát hiện vi phạm kèm trích dẫn mã CFR cụ thể
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      Phân loại mức độ: Nghiêm trọng / Quan trọng / Nhẹ
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      Hướng dẫn khắc phục chi tiết từng điểm vi phạm
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20">
                <CardContent className="p-6">
                  <Users className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-4">Tư vấn bởi chuyên gia</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      Rà soát bởi FDA Compliance Specialist
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      Tư vấn trực tiếp 1-1 qua call hoặc email
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      Đánh giá rủi ro bị từ chối tại cảng Mỹ
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      Hỗ trợ chỉnh sửa file thiết kế nhãn
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20">
                <CardContent className="p-6">
                  <Award className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-4">Đảm bảo & Chứng nhận</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      Cấp Certification Letter khi nhãn đạt chuẩn
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      Kiểm tra lại miễn phí khi có thay đổi nhỏ
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      Hỗ trợ khi FDA yêu cầu giải trình bổ sung
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      Cam kết bồi thường nếu sai sót thuộc về Vexim
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="max-w-3xl mx-auto mt-12 p-6 bg-muted/50 rounded-xl">
              <p className="text-sm text-muted-foreground italic text-center">
                <strong>Cam kết từ đội ngũ Vexim Compliance:</strong> &quot;Vexim Global kết hợp công nghệ AI với đội
                ngũ chuyên gia tuân thủ FDA, phân tích dữ liệu cưỡng chế thực tế (Regulation — Warning Letter — Recall)
                nhằm đánh giá rủi ro nhãn dán và hồ sơ xuất khẩu. Chúng tôi đã đồng hành cùng hàng trăm doanh nghiệp
                Việt Nam chuẩn hóa nhãn sản phẩm trước khi xuất khẩu sang Mỹ, tập trung giảm thiểu nguy cơ bị giữ hàng,
                ghi nhãn sai quy cách và thu hồi sản phẩm.&quot;
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-gradient-to-br from-primary to-primary/90 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Đừng để lô hàng tiếp theo trở thành bài học đắt giá
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Hơn 200 doanh nghiệp Việt Nam đã sử dụng Vexim để bảo vệ lô hàng, giữ vững uy tín thương hiệu và đảm bảo
                hợp đồng xuất khẩu không bị gián đoạn.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <ConsultationDialog>
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-white shadow-lg text-lg px-8 py-6">
                    Kiểm tra nhãn miễn phí — Bắt đầu trong 2 phút
                  </Button>
                </ConsultationDialog>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 text-white text-lg px-8 py-6"
                >
                  Xem bảng giá chi tiết
                </Button>
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
