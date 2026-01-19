import Header from "@/components/header"
import Footer from "@/components/footer"
import { BackToTop } from "@/components/back-to-top"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, AlertTriangle, Shield, FileText, Clock, UserCheck } from "lucide-react"
import ConsultationDialog from "@/components/consultation-dialog"
import Image from "next/image"

export default function USAgentPage() {
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
                  Dịch vụ đại diện tại Hoa Kỳ
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
                  Dịch vụ US Agent - Cầu nối pháp lý tại Mỹ
                </h1>
                <p className="text-xl text-white/90 mb-8 text-pretty leading-relaxed">
                  Làm đại diện pháp lý (US Agent) cho doanh nghiệp Việt Nam xuất khẩu thực phẩm, mỹ phẩm, thiết bị y tế
                  sang Hoa Kỳ. Bắt buộc theo FDA, đảm bảo 24/7 liên lạc với FDA.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <ConsultationDialog>
                    <Button size="lg" className="bg-accent hover:bg-accent/90 text-white shadow-lg">
                      Đăng ký US Agent ngay
                    </Button>
                  </ConsultationDialog>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 text-white"
                  >
                    Tải mẫu hợp đồng
                  </Button>
                </div>
              </div>
              <div className="relative h-[400px] lg:h-[500px]">
                <Image
                  src="/us-customs-broker-agent-import-export-documentatio.jpg"
                  alt="US Agent Service"
                  fill
                  className="object-cover rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Why US Agent Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Tại sao cần US Agent?</h2>
              <p className="text-lg text-muted-foreground text-pretty">
                FDA quy định bắt buộc: Mọi cơ sở nước ngoài phải chỉ định 1 US Agent tại Hoa Kỳ để làm đầu mối liên lạc
                khẩn cấp với FDA 24/7.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Card className="border-2 hover:border-destructive/50 transition-colors">
                <CardContent className="p-6">
                  <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Bắt buộc pháp lý FDA</h3>
                  <p className="text-muted-foreground">
                    Không có US Agent = Không thể đăng ký FDA = Hàng bị chặn tại cửa khẩu Mỹ. FDA Form 3537a/2891 yêu
                    cầu thông tin US Agent.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <Shield className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Liên lạc khẩn cấp</h3>
                  <p className="text-muted-foreground">
                    Khi FDA phát hiện vấn đề (recall, inspection), họ liên hệ US Agent trước. Phản hồi chậm = phạt tiền
                    + đình chỉ.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-accent/50 transition-colors">
                <CardContent className="p-6">
                  <UserCheck className="w-12 h-12 text-accent mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Đại diện chuyên nghiệp</h3>
                  <p className="text-muted-foreground">
                    US Agent của Vexim tại Houston, Texas. Địa chỉ văn phòng thật, điện thoại Mỹ, email doanh nghiệp.
                    Sẵn sàng 24/7.
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Dịch vụ US Agent của Vexim bao gồm
              </h2>
              <p className="text-lg text-muted-foreground">
                Không chỉ đơn thuần cung cấp địa chỉ, chúng tôi là đối tác chiến lược
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {[
                {
                  title: "Đăng ký làm US Agent chính thức",
                  description:
                    "Tên, địa chỉ văn phòng, số điện thoại Mỹ, email doanh nghiệp. Được ghi nhận trên hệ thống FDA FURLS (Food Facility Registration). Cung cấp Letter of Authorization (LOA).",
                  icon: FileText,
                },
                {
                  title: "Nhận và xử lý liên lạc từ FDA",
                  description:
                    "Theo dõi email/phone 24/7 từ FDA. Khi có warning letter, import alert, inspection notice, chúng tôi thông báo ngay cho bạn. Dịch thuật tài liệu FDA sang tiếng Việt.",
                  icon: Shield,
                },
                {
                  title: "Hỗ trợ trả lời FDA (nếu cần)",
                  description:
                    "Soạn thảo phản hồi FDA (response to warning letter, FURLS update). Tư vấn corrective action plan. Đại diện liên lạc với FDA inspector.",
                  icon: UserCheck,
                },
                {
                  title: "Cập nhật thông tin FDA Registration",
                  description:
                    "Mỗi 2 năm phải renew FDA registration (Food Facility / Cosmetic Facility). Cập nhật product category, owner operator info. Nhắc nhở trước deadline.",
                  icon: Clock,
                },
                {
                  title: "Tư vấn tuân thủ FDA liên tục",
                  description:
                    "Cảnh báo thay đổi quy định FDA (FSMA, labeling, new guidance). Tư vấn Prior Notice (PN) khi xuất hàng. Kiểm tra labeling có hợp lệ không.",
                  icon: CheckCircle2,
                },
                {
                  title: "Văn phòng thật tại Houston, TX",
                  description:
                    "Địa chỉ: 1234 Main Street, Houston, TX 77002. Điện thoại: +1-713-XXX-XXXX. Không phải PO Box hay virtual office. FDA audit OK.",
                  icon: Shield,
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

        {/* Who Needs Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Ai cần dịch vụ US Agent?</h2>
            </div>

            <div className="max-w-5xl mx-auto space-y-4">
              {[
                {
                  category: "Cơ sở sản xuất thực phẩm",
                  description:
                    "Xuất khẩu hải sản, rau quả, gia vị, đồ uống... sang Mỹ. Phải đăng ký FDA Food Facility (Form 3537a) → Bắt buộc có US Agent.",
                  required: true,
                },
                {
                  category: "Nhà sản xuất mỹ phẩm",
                  description:
                    "Skincare, makeup, personal care products. Đăng ký Cosmetic Facility Registration → Cần US Agent theo MoCRA 2022.",
                  required: true,
                },
                {
                  category: "Nhà sản xuất thiết bị y tế",
                  description:
                    "Class I/II/III medical devices. Đăng ký FDA Establishment (Form 2891) → US Agent là điều kiện tiên quyết.",
                  required: true,
                },
                {
                  category: "Nhà xuất khẩu thực phẩm chức năng",
                  description:
                    "Dietary supplements (vitamin, khoáng chất, thảo dược). Phải có US Agent để FDA liên lạc khi có vấn đề về chất lượng.",
                  required: true,
                },
                {
                  category: "Doanh nghiệp OEM/ODM",
                  description:
                    "Sản xuất theo đơn đặt hàng của khách Mỹ. Khách yêu cầu có US Agent để đảm bảo compliance.",
                  required: false,
                },
              ].map((item, idx) => (
                <Card
                  key={idx}
                  className={`border-l-4 ${item.required ? "border-l-destructive" : "border-l-accent"} hover:shadow-md transition-all`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{item.category}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                      {item.required && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-destructive/10 text-destructive rounded-full text-sm font-medium whitespace-nowrap">
                          <AlertTriangle className="w-4 h-4" />
                          Bắt buộc
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Quy trình đăng ký US Agent</h2>
              <p className="text-lg text-muted-foreground">Chỉ 3 bước đơn giản, hoàn tất trong 1-2 ngày làm việc</p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              {[
                {
                  step: "01",
                  title: "Cung cấp thông tin doanh nghiệp",
                  description:
                    "Tên công ty, địa chỉ nhà máy tại Việt Nam, loại sản phẩm xuất khẩu, số FDA Registration (nếu có). Email liên hệ chính và phone number.",
                },
                {
                  step: "02",
                  title: "Ký hợp đồng US Agent",
                  description:
                    "Vexim gửi Agreement Letter (Letter of Authorization). Bạn ký và gửi lại scan. Thanh toán phí dịch vụ (theo năm hoặc theo lô hàng).",
                },
                {
                  step: "03",
                  title: "Nhận thông tin US Agent chính thức",
                  description:
                    "Vexim cung cấp: Tên US Agent, địa chỉ Houston TX, phone/email Mỹ, signed LOA. Bạn dùng thông tin này để điền FDA Form 3537a / 2891 / Cosmetic Registration.",
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
                        <h3 className="text-xl font-semibold mb-2">{process.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{process.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-accent/10 rounded-lg">
                <Clock className="w-5 h-5 text-accent" />
                <span className="font-semibold text-lg">Thời gian: 1-2 ngày làm việc</span>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Hint */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Card className="border-2 border-primary/20 bg-primary/5">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4">Chi phí dịch vụ US Agent</h3>
                  <p className="text-lg text-muted-foreground mb-6">
                    Phí hợp lý, minh bạch. Không phát sinh chi phí ẩn. Bao gồm tất cả các dịch vụ đã liệt kê.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <ConsultationDialog>
                      <Button size="lg" className="bg-primary hover:bg-primary/90">
                        Nhận báo giá chi tiết
                      </Button>
                    </ConsultationDialog>
                    <Button size="lg" variant="outline">
                      So sánh gói dịch vụ
                    </Button>
                  </div>
                  <p className="mt-6 text-sm text-muted-foreground">
                    Tặng 1 tháng miễn phí cho khách hàng đăng ký dịch vụ FDA hoặc FSMA 204
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary to-primary/90 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Bảo vệ doanh nghiệp với US Agent uy tín</h2>
              <p className="text-xl text-white/90 mb-8">
                Vexim Global - Văn phòng thật tại Houston, Texas. Phản hồi FDA trong vòng 2 giờ. Đồng hành cùng 500+
                doanh nghiệp Việt Nam.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <ConsultationDialog>
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-white shadow-lg">
                    Đăng ký US Agent ngay
                  </Button>
                </ConsultationDialog>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 text-white"
                >
                  Xem mẫu Letter of Authorization
                </Button>
              </div>
              <p className="mt-6 text-white/80 text-sm">
                Sẵn sàng 24/7 • Văn phòng tại Houston TX • Phản hồi FDA nhanh chóng
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
