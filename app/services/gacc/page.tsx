import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, AlertTriangle, Clock, TrendingUp, ArrowRight, Globe } from "lucide-react"
import Image from "next/image"
import { ConsultationDialog } from "@/components/consultation-dialog"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mã GACC (Trung Quốc) - Vexim Global",
  description:
    "Dịch vụ đăng ký mã số GACC để xuất khẩu hàng hóa vào Trung Quốc. Kinh nghiệm phong phú, tỷ lệ thành công cao.",
}

export default function GACCPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 md:pb-24 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
                Thị trường Trung Quốc
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 text-balance">
                Đăng ký Mã GACC (Trung Quốc)
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                Chìa khóa vàng mở cửa thị trường tỷ dân Trung Quốc. GACC (General Administration of Customs of China) là
                yêu cầu bắt buộc với hầu hết hàng xuất khẩu thực phẩm, nông sản, thủy hải sản. Chúng tôi giúp bạn đăng
                ký nhanh chóng, chính xác.
              </p>
              <ConsultationDialog
                trigger={
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    Tư vấn miễn phí ngay <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                }
              />
            </div>
            <div className="relative h-[400px] lg:h-[500px]">
              <Image
                src="/china-customs-port-container-shipping-trade.jpg"
                alt="GACC Registration"
                fill
                className="object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why GACC */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-balance">
              Mã GACC là gì và tại sao bắt buộc?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              GACC Code (Mã Tổng cục Hải quan Trung Quốc) là mã số định danh duy nhất cho cơ sở sản xuất, chế biến muốn
              xuất khẩu vào Trung Quốc
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="p-6 border-l-4 border-l-accent">
              <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-accent" />
                Bắt buộc pháp lý
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Từ năm 2022, Trung Quốc yêu cầu tất cả nhà sản xuất nước ngoài phải có mã GACC trước khi xuất khẩu thực
                phẩm, nông sản, thủy hải sản. Không có mã này, hàng sẽ bị hải quan Trung Quốc từ chối ngay tại cửa khẩu.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">Yêu cầu của GACC Order 248 và 249</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">Áp dụng với cả cơ sở sản xuất và đóng gói</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 border-l-4 border-l-red-500">
              <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                Hậu quả nếu không có mã GACC
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Xuất khẩu không có mã GACC dẫn đến hậu quả nghiêm trọng cho doanh nghiệp
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    Container bị giữ tại cảng Trung Quốc, không được thông quan
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    Chi phí lưu container, hàng hóa hư hỏng, mất đơn hàng
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    Uy tín doanh nghiệp bị ảnh hưởng với đối tác Trung Quốc
                  </span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Products Requiring GACC */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-balance">Nhóm hàng hóa cần mã GACC</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Vexim Global chuyên đăng ký GACC cho các ngành hàng xuất khẩu chủ lực của Việt Nam
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Thủy hải sản",
                items: [
                  "Tôm đông lạnh",
                  "Cá tra, cá basa fillet",
                  "Mực, bạch tuộc",
                  "Nghêu, sò, ốc",
                  "Hải sản chế biến",
                ],
                popular: true,
              },
              {
                title: "Trái cây tươi",
                items: ["Thanh long", "Sầu riêng", "Xoài", "Vải thiều", "Chuối, dừa"],
                popular: true,
              },
              {
                title: "Nông sản chế biến",
                items: ["Hạt điều", "Hạt tiêu", "Cà phê", "Gạo", "Mì ăn liền"],
              },
              {
                title: "Thịt & Sản phẩm thịt",
                items: ["Thịt lợn đông lạnh", "Thịt gà đông lạnh", "Xúc xích", "Giò chả", "Thịt bò chế biến"],
              },
              {
                title: "Sữa & Chế phẩm sữa",
                items: ["Sữa tươi, sữa tiệt trùng", "Sữa bột", "Pho mát", "Sữa chua", "Kem"],
              },
              {
                title: "Thực phẩm đóng gói",
                items: ["Bánh kẹo", "Đồ uống đóng chai", "Nước trái cây", "Gia vị, nước chấm", "Thực phẩm đông lạnh"],
              },
            ].map((category, index) => (
              <Card
                key={index}
                className={`p-6 hover:shadow-lg transition-shadow ${category.popular ? "border-2 border-accent" : ""}`}
              >
                {category.popular && (
                  <div className="inline-block bg-accent text-white px-3 py-1 rounded-full text-xs font-medium mb-3">
                    Phổ biến nhất
                  </div>
                )}
                <h3 className="text-xl font-bold text-primary mb-4">{category.title}</h3>
                <ul className="space-y-2">
                  {category.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-balance">Quy trình đăng ký mã GACC</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Vexim Global đơn giản hóa quy trình phức tạp thành 6 bước rõ ràng
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                step: "01",
                title: "Đánh giá điều kiện cơ sở",
                description:
                  "Kiểm tra xem cơ sở sản xuất/chế biến có đủ điều kiện vệ sinh an toàn thực phẩm theo yêu cầu GACC không. Hướng dẫn khắc phục nếu chưa đạt.",
                duration: "1-2 ngày",
              },
              {
                step: "02",
                title: "Đăng ký với Bộ NN&PTNT Việt Nam",
                description:
                  "Nộp hồ sơ lên Cục Quản lý Chất lượng Nông lâm sản và Thủy sản (NAFIQAD) hoặc cơ quan quản lý ngành hàng. Đây là bước bắt buộc trước khi đăng ký GACC.",
                duration: "10-15 ngày",
              },
              {
                step: "03",
                title: "Chuẩn bị hồ sơ GACC",
                description:
                  "Thu thập thông tin chi tiết về cơ sở (địa chỉ, công suất, quy trình sản xuất, danh sách sản phẩm). Chuẩn bị tài liệu bằng tiếng Trung và tiếng Anh.",
                duration: "3-5 ngày",
              },
              {
                step: "04",
                title: "Nộp hồ sơ lên GACC Portal",
                description:
                  "Đăng ký trên hệ thống CIFER (China Import Food Enterprise Registration). Theo dõi tiến độ xử lý và phản hồi yêu cầu bổ sung từ GACC.",
                duration: "20-30 ngày",
              },
              {
                step: "05",
                title: "Thanh tra tại cơ sở (nếu cần)",
                description:
                  "Một số trường hợp GACC yêu cầu thanh tra tại nhà máy. Chúng tôi hỗ trợ chuẩn bị và phiên dịch trong buổi thanh tra.",
                duration: "Tùy lịch GACC",
              },
              {
                step: "06",
                title: "Nhận mã GACC & Hướng dẫn sử dụng",
                description:
                  "GACC cấp mã số duy nhất cho cơ sở. Hướng dẫn khai báo mã GACC trên tờ khai hải quan và chứng từ xuất khẩu.",
                duration: "Tức thì sau phê duyệt",
              },
            ].map((process, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">{process.step}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                      <h3 className="text-xl font-bold text-primary">{process.title}</h3>
                      <span className="text-sm text-accent font-medium mt-2 md:mt-0">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {process.duration}
                      </span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{process.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Vexim */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-balance">Ưu thế của Vexim Global</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <TrendingUp className="w-12 h-12 text-accent mx-auto mb-4" />
              <div className="text-4xl font-bold text-accent mb-2">95%</div>
              <h3 className="text-lg font-bold text-primary mb-3">Tỷ lệ thành công</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Hiểu rõ yêu cầu GACC và quy trình Việt Nam
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Clock className="w-12 h-12 text-accent mx-auto mb-4" />
              <div className="text-4xl font-bold text-accent mb-2">30-45</div>
              <h3 className="text-lg font-bold text-primary mb-3">Ngày hoàn thành</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Nhanh hơn 50% so với tự đăng ký</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-4" />
              <div className="text-4xl font-bold text-accent mb-2">300+</div>
              <h3 className="text-lg font-bold text-primary mb-3">Cơ sở đã đăng ký</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Từ thủy sản đến trái cây, nông sản</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Globe className="w-12 h-12 text-accent mx-auto mb-4" />
              <div className="text-4xl font-bold text-accent mb-2">24/7</div>
              <h3 className="text-lg font-bold text-primary mb-3">Liên lạc với GACC</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Đại diện tại Trung Quốc xử lý vấn đề</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
            Đừng để thiếu mã GACC làm gián đoạn xuất khẩu
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Liên hệ ngay để được đánh giá miễn phí và nhận báo giá chi tiết trong 24 giờ
          </p>
          <ConsultationDialog
            trigger={
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Đăng ký tư vấn miễn phí ngay
              </Button>
            }
          />
        </div>
      </section>

      <Footer />
    </div>
  )
}
