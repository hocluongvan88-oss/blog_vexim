"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Phone, CheckCircle2, TrendingUp, Award, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function BlogSidebar() {
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const containerRef = useRef<HTMLElement>(null)
  const { scrollY } = useScroll()
  
  // Parallax animations for each card
  const y1 = useTransform(scrollY, [0, 500], [0, 50])
  const y2 = useTransform(scrollY, [0, 500], [0, 100])
  const y3 = useTransform(scrollY, [0, 500], [0, 150])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setSubmitted(true)
    setLoading(false)

    // Reset after 3 seconds
    setTimeout(() => {
      setSubmitted(false)
      setEmail("")
      setPhone("")
    }, 3000)
  }

  return (
    <aside ref={containerRef} className="space-y-6">
      {/* CTA Card */}
      <motion.div style={{ y: y1 }}>
        <Card className="p-6 bg-gradient-to-br from-primary to-primary/90 text-white">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <Badge className="bg-accent/20 text-white border-0">Miễn phí</Badge>
          </div>

          <h3 className="text-xl font-bold mb-3 text-balance">Nhận tư vấn miễn phí từ chuyên gia</h3>

          <p className="text-white/90 text-sm mb-6 leading-relaxed">
            Giải đáp mọi thắc mắc về FDA, GACC, MFDS và các quy định xuất nhập khẩu thực phẩm
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="sidebar-email" className="text-white mb-2 block text-sm">
                  Email của bạn
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="sidebar-email"
                    type="email"
                    placeholder="email@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white border-0"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="sidebar-phone" className="text-white mb-2 block text-sm">
                  Số điện thoại
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="sidebar-phone"
                    type="tel"
                    placeholder="0912 345 678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10 bg-white border-0"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90 text-white font-semibold"
                disabled={loading}
              >
                {loading ? "Đang gửi..." : "Đăng ký tư vấn miễn phí"}
              </Button>

              <p className="text-white/70 text-xs text-center">Chúng tôi cam kết bảo mật thông tin của bạn</p>
            </form>
          ) : (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-3" />
              <p className="text-lg font-semibold mb-1">Đăng ký thành công!</p>
              <p className="text-white/90 text-sm">Chúng tôi sẽ liên hệ với bạn trong 24h</p>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Stats Card */}
      <motion.div style={{ y: y2 }}>
        <Card className="p-6">
          <h4 className="font-bold text-lg mb-4 text-primary">Tại sao chọn Vexim Global?</h4>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="font-bold text-2xl text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Doanh nghiệp tin dùng</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-bold text-2xl text-primary">98%</div>
                <div className="text-sm text-muted-foreground">Hồ sơ được chấp thuận</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="font-bold text-2xl text-primary">10+</div>
                <div className="text-sm text-muted-foreground">Năm kinh nghiệm</div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Services Quick Links */}
      <motion.div style={{ y: y3 }}>
        <Card className="p-6">
          <h4 className="font-bold text-lg mb-4 text-primary">Dịch vụ nổi bật</h4>

          <div className="space-y-3">
            {[
              "Đăng ký FDA thực phẩm",
              "Cấp mã GACC Trung Quốc",
              "Chứng nhận MFDS Hàn Quốc",
              "Xử lý hàng bị giữ tại cảng",
            ].map((service, idx) => (
              <a
                key={idx}
                href="/dich-vu"
                className="flex items-center gap-2 p-3 rounded-lg hover:bg-accent/5 transition-colors group"
              >
                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                <span className="text-sm group-hover:text-accent transition-colors">{service}</span>
              </a>
            ))}
          </div>
        </Card>
      </motion.div>
    </aside>
  )
}
