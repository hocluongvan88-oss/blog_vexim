"use client"

import { Mail, Phone, MapPin, Facebook, Linkedin, Youtube } from "lucide-react"
import { FDASubscriptionInline } from "@/components/fda/fda-subscription-inline"

export function Footer() {
  return (
    <footer id="contact" className="bg-primary text-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* FDA Subscription Banner - Above Main Footer */}
        <div className="mb-12 -mt-8">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            <FDASubscriptionInline variant="cta" className="border-0" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Vexim Global</h3>
            <p className="text-white/80 leading-relaxed mb-4">
              Đối tác tin cậy trong lĩnh vực tư vấn pháp lý xuất nhập khẩu quốc tế. Chúng tôi cam kết mang đến giải pháp
              tối ưu nhất cho doanh nghiệp.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-4">Dịch vụ</h3>
            <ul className="space-y-2">
              <li>
                <a href="#fda" className="text-white/80 hover:text-accent transition-colors">
                  Đăng ký FDA
                </a>
              </li>
              <li>
                <a href="#gacc" className="text-white/80 hover:text-accent transition-colors">
                  Mã GACC
                </a>
              </li>
              <li>
                <a href="#mfds" className="text-white/80 hover:text-accent transition-colors">
                  Giấy phép MFDS
                </a>
              </li>
              <li>
                <a href="#ce" className="text-white/80 hover:text-accent transition-colors">
                  Chứng nhận CE
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                <span className="text-white/80">25/6/51 Ngọa Long, Tây Tựu, Hà Nội</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <a href="tel:+842812345678" className="text-white/80 hover:text-accent transition-colors">
                  0373 685 634                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <a href="mailto: contact@veximglobal.vn" className="text-white/80 hover:text-accent transition-colors">
                  contact@veximglobal.vn
                </a>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="text-xl font-bold mb-4">Giờ làm việc</h3>
            <ul className="space-y-2 text-white/80">
              <li>Thứ 2 - Thứ 6: 8:00 - 18:00</li>
              <li>Thứ 7: 8:00 - 12:00</li>
              <li>Chủ nhật: Nghỉ</li>
              <li className="text-accent font-medium pt-2">Hỗ trợ khẩn cấp: 24/7</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center text-white/80">
          <p>&copy; {new Date().getFullYear()} Vexim Global. Bản quyền thuộc về Công ty.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
