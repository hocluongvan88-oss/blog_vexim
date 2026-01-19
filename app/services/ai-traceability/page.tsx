import Header from "@/components/header"
import Footer from "@/components/footer"
import { BackToTop } from "@/components/back-to-top"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Sparkles, Zap, Shield, BarChart3, ArrowRight, Database, Network, Globe, Cpu } from "lucide-react"
import ConsultationDialog from "@/components/consultation-dialog"
import Image from "next/image"

export default function AITraceabilityPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
        {/* Hero Section with Tech Aesthetic */}
        <section className="relative pt-32 md:pt-40 pb-20 md:pb-32 overflow-hidden">
          {/* Animated background grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

          {/* Gradient orbs */}
          <div className="absolute top-40 -left-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 px-4 py-1.5 text-sm font-medium">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 inline" />
                Công nghệ AI & Blockchain
              </Badge>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
                Nền tảng truy xuất
                <br />
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  nguồn gốc tích hợp AI
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
                Hệ thống quản lý CTE/KDE chuyên nghiệp. Tự động hóa 100% truy xuất nguồn gốc thực phẩm theo chuẩn FDA
                FSMA 204.
              </p>

              <div className="flex flex-wrap gap-4 justify-center mb-12">
                <ConsultationDialog>
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 px-8 h-12 text-base"
                  >
                    Dùng thử 14 ngày miễn phí
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </ConsultationDialog>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-border hover:bg-muted px-8 h-12 text-base bg-transparent"
                >
                  <Zap className="mr-2 w-4 h-4" />
                  Xem demo 2 phút
                </Button>
              </div>

              {/* Tech stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {[
                  { value: "98%", label: "Tuân thủ FDA" },
                  { value: "2 phút", label: "Truy xuất" },
                  { value: "500+", label: "Doanh nghiệp" },
                  { value: "24/7", label: "Hỗ trợ" },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="text-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border"
                  >
                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Platform Preview Image Section */}
        <section className="py-16 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl shadow-primary/10">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent/10"></div>
                <Image
                  src="/ai-technology-blockchain-supply-chain-digital-trac.jpg"
                  alt="AI Traceability Platform Dashboard"
                  width={1200}
                  height={700}
                  className="w-full h-auto relative z-10"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Core Technology Features */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
                <Cpu className="w-3.5 h-3.5 mr-1.5 inline" />
                Công nghệ tiên tiến
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Giải pháp FSMA 204 toàn diện</h2>
              <p className="text-lg text-muted-foreground">
                Tự động hóa CTE/KDE tracking, đảm bảo tuân thủ FDA Rule 204, tiết kiệm 90% thời gian
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Feature Card 1 */}
              <Card className="group relative overflow-hidden border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative p-8">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Quản lý 7 loại CTE</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Ghi nhận Harvesting, Cooling, Initial Packing, Shipping, Receiving, Transformation, First Receiver.
                    Tự động validate trình tự thời gian theo yêu cầu FDA.
                  </p>
                  <div className="space-y-3">
                    {[
                      "Hỗ trợ đầy đủ 7 loại CTE theo Rule 204",
                      "Capture 15+ KDEs bắt buộc tự động",
                      "Audit trail đầy đủ",
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Feature Card 2 */}
              <Card className="group relative overflow-hidden border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative p-8">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Network className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Truy xuất hai chiều qua TLC</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Theo dõi từng lô FTL từ nguồn gốc đến điểm đến. Trace backward và forward trong vài giây. Dashboard
                    compliance real-time.
                  </p>
                  <div className="space-y-3">
                    {[
                      "TLC tự động cho mỗi lô FTL",
                      "Truy xuất nguồn gốc chỉ trong 2 phút",
                      "Export báo cáo chuẩn FDA PDF/Excel",
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Feature Card 3 */}
              <Card className="group relative overflow-hidden border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative p-8">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Database className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Ghi nhận KDE đầy đủ</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Tự động capture các KDEs: Quantity, Location, Date/Time, Business Name, Phone, FDA Registration. Đối
                    soát số lượng input/output.
                  </p>
                  <div className="space-y-3">
                    {[
                      "15+ KDEs bắt buộc theo Rule 204",
                      "Quantity reconciliation tự động",
                      "Real-time compliance dashboard",
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Feature Card 4 */}
              <Card className="group relative overflow-hidden border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative p-8">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Báo cáo FDA chuyên nghiệp</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Xuất báo cáo tuân thủ FSMA 204 đạt chuẩn quốc tế. Template được FDA approved. Gửi cho auditor chỉ
                    trong 1 click.
                  </p>
                  <div className="space-y-3">
                    {["Template chuẩn FDA Rule 204", "Export trong 1 click", "Đa ngôn ngữ Việt/Anh/Hàn/Nhật"].map(
                      (feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="py-20 bg-gradient-to-b from-transparent via-secondary/30 to-transparent relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px]"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Công nghệ hàng đầu</h2>
              <p className="text-lg text-muted-foreground">Nền tảng được xây dựng trên các công nghệ tiên tiến nhất</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: Shield,
                  title: "Blockchain Security",
                  description:
                    "Dữ liệu được mã hóa và lưu trữ phân tán trên blockchain, đảm bảo tính toàn vẹn và không thể thay đổi.",
                },
                {
                  icon: Cpu,
                  title: "AI-Powered Validation",
                  description: "Trí tuệ nhân tạo tự động kiểm tra và validate dữ liệu CTE/KDE theo quy định FDA.",
                },
                {
                  icon: Globe,
                  title: "Cloud Infrastructure",
                  description: "Hệ thống cloud đảm bảo uptime 99.9%, truy cập mọi lúc mọi nơi với độ trễ thấp.",
                },
              ].map((tech, idx) => (
                <Card
                  key={idx}
                  className="p-8 text-center border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg backdrop-blur-sm bg-card/80"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-6">
                    <tech.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{tech.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{tech.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Implementation Steps */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Triển khai trong 3 bước</h2>
              <p className="text-lg text-muted-foreground">Không cần chuyên gia IT. Không cần đào tạo phức tạp.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  step: "01",
                  title: "Đăng ký & Setup",
                  description:
                    "Tạo tài khoản trong 2 phút. Nhập FDA Registration, U.S. Agent info. Hệ thống tự động validate.",
                },
                {
                  step: "02",
                  title: "Cấu hình dữ liệu",
                  description:
                    "Khai báo locations và FTL products. Hệ thống gợi ý CTE cần thiết cho từng loại sản phẩm.",
                },
                {
                  step: "03",
                  title: "Bắt đầu tracking",
                  description:
                    "Record CTEs khi hàng di chuyển. Dashboard cập nhật real-time. Export báo cáo FDA bất cứ lúc nào.",
                },
              ].map((step, idx) => (
                <Card
                  key={idx}
                  className="relative p-8 border-border hover:border-primary/50 transition-all duration-300"
                >
                  <div className="absolute -top-6 left-8 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {step.step}
                  </div>
                  <div className="mt-6">
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-accent"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Sẵn sàng tuân thủ FSMA 204?</h2>
              <p className="text-xl text-white/90 mb-10 leading-relaxed">
                Hơn 500 doanh nghiệp xuất khẩu Việt Nam đã tin dùng Vexim Global AI Platform. Bắt đầu miễn phí 14 ngày
                hôm nay.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <ConsultationDialog>
                  <Button
                    size="lg"
                    className="bg-white hover:bg-white/90 text-primary shadow-lg px-8 h-12 text-base font-semibold"
                  >
                    Dùng thử miễn phí 14 ngày
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </ConsultationDialog>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 hover:bg-white/10 text-white backdrop-blur-sm px-8 h-12 text-base font-semibold bg-transparent"
                >
                  Xem bảng giá
                </Button>
              </div>
              <p className="mt-8 text-white/70 text-sm">Không cần thẻ tín dụng • Hủy bất cứ lúc nào • Hỗ trợ 24/7</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
