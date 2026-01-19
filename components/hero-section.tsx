"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ArrowRight, Loader2, Shield, FileCheck, Lock } from "lucide-react"
import { ConsultationDialog } from "./consultation-dialog"

export function HeroSection() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    product: "",
    description: "",
    honeypot: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage("")

    try {
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitMessage("✓ Cảm ơn bạn! Chúng tôi sẽ liên hệ trong vòng 24h.")
        setFormData({ name: "", phone: "", email: "", service: "", product: "", description: "", honeypot: "" })
      } else {
        setSubmitMessage(`✗ ${data.error || "Có lỗi xảy ra. Vui lòng thử lại."}`)
      }
    } catch (error) {
      setSubmitMessage("✗ Không thể kết nối. Vui lòng kiểm tra mạng và thử lại.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="hero" className="relative pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=2000)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/90 to-primary/80" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance leading-tight">
              Hàng hóa xuất khẩu gặp khó khăn về pháp lý?
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-yellow-400 drop-shadow-lg">
              Chuyên gia Regulatory Affairs hỗ trợ toàn diện
            </h2>
            <p className="text-lg md:text-xl mb-8 text-white/90 leading-relaxed">
              Theo quy định của FDA (21 CFR), GACC (Decree 248/249), và MFDS Korea (Food Sanitation Act), hàng hóa thiếu
              chứng từ tuân thủ sẽ bị giữ tại cảng, tiêu hủy hoặc tái xuất. Vexim Global - với đội ngũ chuyên gia pháp lý
              thương mại quốc tế - cung cấp giải pháp tuân thủ toàn diện, giúp doanh nghiệp Việt Nam tiếp cận thị trường
              toàn cầu an toàn và hiệu quả.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-accent flex-shrink-0" />
                <span className="text-white/90">
                  Tư vấn tuân thủ FDA, GACC, MFDS theo tiêu chuẩn ngành quốc tế
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FileCheck className="w-6 h-6 text-accent flex-shrink-0" />
                <span className="text-white/90">
                  Hồ sơ pháp lý được kiểm tra kỹ lưỡng, tối ưu tỷ lệ chấp thuận
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Lock className="w-6 h-6 text-accent flex-shrink-0" />
                <span className="text-white/90">Bảo mật thông tin theo chuẩn ISO 27001 và GDPR/PDPA</span>
              </li>
            </ul>
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={() => setIsDialogOpen(true)}
            >
              Tư vấn miễn phí
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* Right Content - Consultation Form */}
          <Card id="consultation-form" className="p-6 md:p-8 bg-white shadow-2xl">
            <h3 className="text-2xl font-bold text-primary mb-2">Tư vấn miễn phí - Nhận kết quả trong 24h</h3>
            <p className="text-muted-foreground mb-6">
              <span className="text-accent font-semibold">Hãy để lại thông tin</span> chúng tôi sẽ liên hệ với bạn ngay!
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot field ẩn */}
              <input
                type="text"
                name="website"
                value={formData.honeypot}
                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                style={{ position: "absolute", left: "-9999px" }}
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Họ và tên <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Nguyễn Văn A"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Số điện thoại <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0912 345 678"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email <span className="text-destructive">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="service" className="block text-sm font-medium mb-2">
                  Loại dịch vụ quan tâm
                </label>
                <select
                  id="service"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  disabled={isSubmitting}
                >
                  <option value="">Chọn dịch vụ</option>
                  <option value="fda">Đăng ký FDA</option>
                  <option value="gacc">Mã GACC</option>
                  <option value="mfds">Giấy phép MFDS - KOREA</option>
                  <option value="agent-us">Dịch vụ Agent Hoa Kỳ</option>
                  <option value="ai-traceability">Nền tảng truy xuất nguồn gốc tích hợp AI</option>
                  <option value="delegation">Uỷ thác xuất nhập khẩu</option>
                  <option value="other">Khác</option>
                </select>
              </div>

              <div>
                <label htmlFor="product" className="block text-sm font-medium mb-2">
                  Sản phẩm cần đăng ký
                </label>
                <Input
                  id="product"
                  type="text"
                  placeholder="VD: Sữa tươi, Thực phẩm chức năng"
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                  Mô tả thêm (chứng chỉ, quy trình sản xuất...)
                </label>
                <textarea
                  id="description"
                  placeholder="VD: Có chứng chỉ ISO, sản xuất theo tiêu chuẩn GMP..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                  rows={3}
                />
              </div>

              {submitMessage && (
                <div
                  className={`p-3 rounded-md text-sm ${submitMessage.startsWith("✓") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
                >
                  {submitMessage}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  "Gửi yêu cầu tư vấn"
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>

      <ConsultationDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </section>
  )
}
