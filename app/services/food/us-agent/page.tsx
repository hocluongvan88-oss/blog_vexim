import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, AlertTriangle, Phone, Mail, MapPin, Clock, Shield, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ConsultationDialog } from "@/components/consultation-dialog"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dịch vụ US Agent cho Thực phẩm - FDA Requirement",
  description:
    "Đại diện pháp lý tại Mỹ cho cơ sở sản xuất thực phẩm xuất khẩu. Bắt buộc theo FDA. Văn phòng thật tại Houston, TX. Sẵn sàng 24/7.",
  keywords: [
    "US Agent",
    "FDA Agent",
    "đại diện FDA",
    "US Agent thực phẩm",
    "FDA representative",
    "xuất khẩu thực phẩm Mỹ",
  ],
  alternates: {
    canonical: "/services/food/us-agent",
  },
}

export default function USAgentFoodPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 md:pb-24 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="inline-block bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                  Bước 4
                </span>
                <span className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium">
                  Thực phẩm
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 text-balance">
                Dịch vụ US Agent
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                FDA bắt buộc mọi cơ sở nước ngoài phải có US Agent - đại diện pháp lý tại Mỹ. 
                US Agent là đầu mối liên lạc 24/7 giữa FDA và doanh nghiệp của bạn.
              </p>
              <div className="flex flex-wrap gap-4">
                <ConsultationDialog
                  trigger={
                    <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                      Đăng ký US Agent <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  }
                />
                <Link href="/services/food/fsvp-importer">
                  <Button size="lg" variant="outline">
                    Bước tiếp: FSVP Importer
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[500px]">
              <Image
                src="/us-agent-fda-representative.jpg"
                alt="US Agent Service"
                fill
                className="object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Warning */}
      <section className="py-8 bg-destructive/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4">
            <AlertTriangle className="w-8 h-8 text-destructive" />
            <p className="text-lg font-medium text-destructive">
              Không có US Agent = Không thể đăng ký FDA = Hàng bị từ chối nhập khẩu
            </p>
          </div>
        </div>
      </section>

      {/* What is US Agent */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                US Agent là gì và tại sao bắt buộc?
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="text-xl font-bold text-primary mb-4">Định nghĩa US Agent</h3>
                <p className="text-muted-foreground leading-relaxed">
                  US Agent là cá nhân hoặc tổ chức có trụ sở tại Hoa Kỳ, được cơ sở nước ngoài 
                  ủy quyền làm đại diện liên lạc với FDA. US Agent phải có khả năng nhận và 
                  phản hồi liên lạc từ FDA 24/7.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold text-primary mb-4">Yêu cầu pháp lý</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Theo 21 CFR 1.227, mọi cơ sở nước ngoài đăng ký FDA phải chỉ định US Agent. 
                  Thông tin US Agent phải được khai báo trong FDA Form 3537a và cập nhật khi có thay đổi.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Dịch vụ US Agent của Vexim bao gồm
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: MapPin,
                title: "Văn phòng thật tại Mỹ",
                description: "Địa chỉ văn phòng thực tại Houston, Texas. Không phải PO Box hay virtual office. FDA audit OK.",
              },
              {
                icon: Phone,
                title: "Điện thoại Mỹ 24/7",
                description: "Số điện thoại Mỹ (+1-713-xxx-xxxx) sẵn sàng nhận cuộc gọi từ FDA bất cứ lúc nào.",
              },
              {
                icon: Mail,
                title: "Email doanh nghiệp",
                description: "Email chuyên nghiệp để nhận và xử lý mọi thông báo từ FDA một cách nhanh chóng.",
              },
              {
                icon: Shield,
                title: "Nhận Warning Letters",
                description: "Nhận warning letters, import alerts từ FDA. Thông báo ngay cho bạn và hỗ trợ phản hồi.",
              },
              {
                icon: Clock,
                title: "Phản hồi FDA nhanh",
                description: "Phản hồi FDA trong vòng 2 giờ làm việc. Soạn response letters nếu cần.",
              },
              {
                icon: CheckCircle2,
                title: "Letter of Authorization",
                description: "Cung cấp LOA chính thức để bạn điền vào FDA registration. Valid cho toàn bộ period.",
              },
            ].map((service, idx) => (
              <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                <service.icon className="w-10 h-10 text-accent mb-4" />
                <h3 className="text-lg font-bold text-primary mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm">{service.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Đăng ký US Agent chỉ 1-2 ngày
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                step: "01",
                title: "Gửi thông tin doanh nghiệp",
                description: "Tên công ty, địa chỉ nhà máy, loại sản phẩm, FDA Registration Number (nếu có).",
              },
              {
                step: "02",
                title: "Ký Agreement & thanh toán",
                description: "Ký US Agent Agreement. Thanh toán phí dịch vụ (theo năm).",
              },
              {
                step: "03",
                title: "Nhận thông tin US Agent",
                description: "Nhận LOA, thông tin US Agent (tên, địa chỉ, phone, email) để điền FDA registration.",
              },
            ].map((process, idx) => (
              <Card key={idx} className="p-6">
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-white">{process.step}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-2">{process.title}</h3>
                    <p className="text-muted-foreground">{process.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Có US Agent uy tín = FDA yên tâm
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Vexim Global - Văn phòng thật tại Houston, Texas. 
            Đồng hành cùng 500+ doanh nghiệp Việt Nam xuất khẩu sang Mỹ.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ConsultationDialog
              trigger={
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Đăng ký US Agent ngay
                </Button>
              }
            />
            <Link href="/services/food/fsvp-importer">
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                Bước 5: FSVP Importer
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
