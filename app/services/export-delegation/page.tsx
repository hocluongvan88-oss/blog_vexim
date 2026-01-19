import Header from "@/components/header"
import Footer from "@/components/footer"
import { BackToTop } from "@/components/back-to-top"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, TrendingUp, DollarSign, Clock, Shield, Globe, Package } from "lucide-react"
import ConsultationDialog from "@/components/consultation-dialog"
import Image from "next/image"

export default function ExportDelegationPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white pt-32 md:pt-40 pb-16 md:pb-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <div>
                <div className="inline-block mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium">
                  Giải pháp xuất khẩu trọn gói
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
                  Uỷ thác xuất nhập khẩu - Tập trung sản xuất, chúng tôi lo xuất khẩu
                </h1>
                <p className="text-xl text-white/90 mb-8 text-pretty leading-relaxed">
                  Vexim đảm nhận toàn bộ quy trình xuất khẩu từ A-Z: Giấy phép, hải quan, logistics, thanh toán quốc tế.
                  Doanh nghiệp chỉ cần tập trung sản xuất, nhận tiền khi hàng đã sang tay người mua.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <ConsultationDialog>
                    <Button size="lg" className="bg-accent hover:bg-accent/90 text-white shadow-lg">
                      Tư vấn uỷ thác XNK
                    </Button>
                  </ConsultationDialog>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 text-white"
                  >
                    Tải case study
                  </Button>
                </div>
              </div>
              <div className="relative h-[400px] lg:h-[500px]">
                <Image
                  src="/international-trade-export-logistics-cargo-shippin.jpg"
                  alt="Export Delegation Service"
                  fill
                  className="object-cover rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Why Delegation Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Tại sao chọn uỷ thác xuất khẩu?</h2>
              <p className="text-lg text-muted-foreground text-pretty">
                Dành cho doanh nghiệp chưa có giấy phép xuất khẩu, hoặc muốn giảm thiểu rủi ro và chi phí khi thâm nhập
                thị trường mới.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <Clock className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Tiết kiệm thời gian</h3>
                  <p className="text-muted-foreground">
                    Không cần tự mình xin giấy phép xuất khẩu, đăng ký FDA/GACC/MFDS, học hải quan. Vexim đã có sẵn
                    license và kinh nghiệm.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <DollarSign className="w-12 h-12 text-accent mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Giảm rủi ro tài chính</h3>
                  <p className="text-muted-foreground">
                    Vexim chịu trách nhiệm thanh toán quốc tế (LC, T/T), xử lý tranh chấp với buyer. Doanh nghiệp nhận
                    tiền VNĐ an toàn.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <Shield className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Compliance đảm bảo</h3>
                  <p className="text-muted-foreground">
                    Vexim đảm bảo hàng xuất đi đúng quy định Hải quan VN và nước nhập khẩu. Tránh bị phạt, tịch thu
                    container.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Services Included */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Dịch vụ uỷ thác XNK bao gồm gì?</h2>
              <p className="text-lg text-muted-foreground">
                Vexim đảm nhận từ A-Z, doanh nghiệp chỉ cần giao hàng tại kho
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                {
                  title: "Đăng ký giấy phép nước nhập khẩu",
                  description:
                    "FDA (Mỹ), GACC (Trung Quốc), MFDS (Hàn Quốc), CE (EU)... Vexim đã có license sẵn hoặc đăng ký mới nhanh chóng.",
                  icon: Shield,
                },
                {
                  title: "Làm chứng từ xuất khẩu",
                  description:
                    "C/O (Certificate of Origin), Health Certificate, Phytosanitary Certificate, Invoice, Packing List. Hợp pháp hóa lãnh sự nếu cần.",
                  icon: Package,
                },
                {
                  title: "Thủ tục hải quan xuất khẩu",
                  description:
                    "Khai báo hải quan điện tử, làm thủ tục kiểm dịch, kiểm tra chuyên ngành. Thông quan nhanh chóng tại cảng biển/sân bay.",
                  icon: CheckCircle2,
                },
                {
                  title: "Logistics quốc tế",
                  description:
                    "Book container/vận chuyển hàng không. Làm việc với hãng tàu (Maersk, MSC, CMA CGM). Theo dõi hành trình real-time.",
                  icon: Globe,
                },
                {
                  title: "Thanh toán quốc tế",
                  description:
                    "Nhận thanh toán từ buyer (LC, T/T, DP). Xử lý ngoại tệ với ngân hàng. Chuyển tiền VNĐ về cho doanh nghiệp sau khi trừ phí.",
                  icon: DollarSign,
                },
                {
                  title: "Hỗ trợ sau bán hàng",
                  description:
                    "Xử lý khiếu nại chất lượng, claim insurance nếu hàng hư hỏng. Tư vấn strategy để tăng doanh số lần sau.",
                  icon: TrendingUp,
                },
              ].map((service, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <service.icon className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Quy trình uỷ thác xuất khẩu</h2>
              <p className="text-lg text-muted-foreground">Minh bạch, dễ theo dõi từng bước</p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {[
                {
                  step: "01",
                  title: "Ký hợp đồng uỷ thác XNK",
                  description:
                    "Doanh nghiệp (bên uỷ thác) và Vexim (bên nhận uỷ thác) ký hợp đồng. Thỏa thuận về: Giá mua hàng từ nhà máy, phí dịch vụ Vexim (thường 3-7% FOB), điều khoản thanh toán.",
                  duration: "1-2 ngày",
                },
                {
                  step: "02",
                  title: "Nhận đơn hàng từ buyer nước ngoài",
                  description:
                    "Vexim tìm buyer (hoặc doanh nghiệp giới thiệu buyer). Vexim đàm phán điều khoản, ký hợp đồng với buyer. Nhận Purchase Order (PO) chính thức.",
                  duration: "3-7 ngày",
                },
                {
                  step: "03",
                  title: "Doanh nghiệp sản xuất & giao hàng",
                  description:
                    "Vexim đặt hàng với doanh nghiệp (theo PO của buyer). Doanh nghiệp sản xuất, đóng gói, dán nhãn theo yêu cầu. Giao hàng tại kho Vexim hoặc cảng.",
                  duration: "15-30 ngày",
                },
                {
                  step: "04",
                  title: "Vexim làm giấy phép & hải quan",
                  description:
                    "Vexim đăng ký FDA/GACC/MFDS (nếu cần). Làm C/O, Health Cert, Invoice... Khai báo hải quan xuất khẩu. Làm thủ tục kiểm dịch.",
                  duration: "3-5 ngày",
                },
                {
                  step: "05",
                  title: "Vận chuyển quốc tế",
                  description:
                    "Book container/chuyến bay. Làm Bill of Lading (B/L) hoặc Airway Bill (AWB). Theo dõi hành trình container. Cập nhật ETA cho buyer.",
                  duration: "20-45 ngày",
                },
                {
                  step: "06",
                  title: "Thanh toán & chốt sổ",
                  description:
                    "Vexim nhận tiền từ buyer (LC sight/T/T). Trừ phí dịch vụ, chi phí logistics. Chuyển phần còn lại (VNĐ) cho doanh nghiệp. Cung cấp báo cáo chi tiết.",
                  duration: "3-7 ngày sau khi hàng về đích",
                },
              ].map((process, idx) => (
                <Card key={idx} className="border-l-4 border-l-primary hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-2xl font-bold text-primary">{process.step}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                          <h3 className="text-xl font-semibold">{process.title}</h3>
                          <span className="inline-flex items-center gap-1 text-sm font-medium text-accent">
                            <Clock className="w-4 h-4" />
                            {process.duration}
                          </span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{process.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Structure */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Chi phí dịch vụ uỷ thác XNK</h2>
              <p className="text-lg text-muted-foreground">Minh bạch, dễ hiểu, không phí ẩn</p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Card className="border-2 border-primary/20">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Phí dịch vụ Vexim</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">3-7% trên giá trị FOB (tùy độ phức tạp)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">Đã bao gồm: Giấy phép, hải quan, chứng từ</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">Miễn phí tư vấn chiến lược xuất khẩu</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Chi phí logistics (actual cost)</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                          <DollarSign className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">Cước vận chuyển quốc tế (container/air freight)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <DollarSign className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">Phí hải quan xuất (nếu có)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <DollarSign className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">Phí kiểm dịch, fumigation (nếu cần)</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t">
                    <div className="bg-accent/10 rounded-lg p-6">
                      <h4 className="font-semibold mb-2 text-lg">Ví dụ cụ thể:</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Container hải sản 20 feet sang Mỹ, giá trị FOB $50,000
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Giá mua từ nhà máy:</span>
                          <span className="font-semibold">$42,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Phí dịch vụ Vexim (5%):</span>
                          <span className="font-semibold">$2,500</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Chi phí logistics:</span>
                          <span className="font-semibold">$5,500</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t text-base">
                          <span className="font-semibold">Tổng FOB:</span>
                          <span className="font-bold text-primary">$50,000</span>
                        </div>
                        <div className="flex justify-between text-accent">
                          <span>Nhà máy nhận (VNĐ):</span>
                          <span className="font-bold">≈ 1,050 triệu VNĐ</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <ConsultationDialog>
                      <Button size="lg" className="bg-primary hover:bg-primary/90">
                        Nhận báo giá chi tiết
                      </Button>
                    </ConsultationDialog>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary to-primary/90 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Xuất khẩu dễ dàng với Vexim</h2>
              <p className="text-xl text-white/90 mb-8">
                Tập trung sản xuất, để chúng tôi lo phần còn lại. 500+ doanh nghiệp Việt đã thành công với dịch vụ uỷ
                thác XNK của Vexim.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <ConsultationDialog>
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-white shadow-lg">
                    Tư vấn uỷ thác XNK ngay
                  </Button>
                </ConsultationDialog>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 text-white"
                >
                  Xem câu chuyện thành công
                </Button>
              </div>
              <p className="mt-6 text-white/80 text-sm">Tư vấn miễn phí • Hợp đồng rõ ràng • Thanh toán đúng hạn</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
