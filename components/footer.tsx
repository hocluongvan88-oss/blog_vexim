"use client"

import type React from "react"
import { Mail, Phone, MapPin, Facebook, Linkedin } from "lucide-react"
import {
  ADDRESS,
  ORGANIZATION_NAME,
  PHONE_DISPLAY,
  OPENING_HOURS_LABELS,
  PUBLIC_EMAIL,
  SOCIAL_PROFILES,
} from "@/lib/business-profile"
import { VEXIM_PHONE_TEL_URL } from "@/lib/contact-info"

/**
 * Tiêu đề cột ở footer dùng <p> + class, KHÔNG dùng <h3>.
 *
 * Footer có mặt trên MỌI trang, nên 4 thẻ <h3> ("Vexim Global", "Dịch vụ",
 * "Liên hệ", "Giờ làm việc") từng được cộng vào outline heading của toàn site,
 * chen ngang sau heading của nội dung chính và làm loãng cấu trúc tài liệu.
 * Đây là nhãn điều hướng, không phải tiêu đề mục nội dung.
 * Class `footer-heading` giữ nguyên giao diện cũ (text-xl font-bold mb-4).
 */
function FooterHeading({ children }: { children: React.ReactNode }) {
  return <p className="footer-heading text-xl font-bold mb-4">{children}</p>
}

export function Footer() {
  return (
    <footer id="contact" className="bg-primary text-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <FooterHeading>{ORGANIZATION_NAME}</FooterHeading>
            <p className="text-white/80 leading-relaxed mb-4">
              Đối tác tin cậy trong lĩnh vực tư vấn pháp lý xuất nhập khẩu quốc tế. Chúng tôi cam kết mang đến giải pháp
              tối ưu nhất cho doanh nghiệp.
            </p>
            <div className="flex gap-4">
              {/*
                Trước đây cả 3 icon đều trỏ href="#" — link chết, không truyền tín hiệu
                nào và khiến `sameAs` trong schema trỏ tới profile không được link từ trang.
                YouTube đã bỏ vì site chưa có kênh khai báo ở đâu trong code.
              */}
              <a
                href={SOCIAL_PROFILES.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-cta hover:text-cta-foreground transition-colors"
                aria-label="Facebook Vexim Global"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={SOCIAL_PROFILES.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-cta hover:text-cta-foreground transition-colors"
                aria-label="LinkedIn Vexim Global"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href={SOCIAL_PROFILES.zalo}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-cta hover:text-cta-foreground transition-colors text-sm font-semibold"
                aria-label="Zalo Vexim Global"
              >
                Zalo
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <FooterHeading>Dịch vụ</FooterHeading>
            <ul className="space-y-2">
              <li>
                <a href="/services/fda" className="text-white/80 hover:text-accent transition-colors">
                  Đăng ký FDA
                </a>
              </li>
              <li>
                <a href="/services/fsvp" className="text-white/80 hover:text-accent transition-colors">
                  FSVP Compliance
                </a>
              </li>
              <li>
                <a href="/services/cosmetics/mocra-registration" className="text-white/80 hover:text-accent transition-colors">
                  MOCRA Registration
                </a>
              </li>
              <li>
                <a href="/services/us-agent" className="text-white/80 hover:text-accent transition-colors">
                  US Agent Services
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <FooterHeading>Liên hệ</FooterHeading>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                <span className="text-white/80">
                  {ADDRESS.streetAddress}, {ADDRESS.addressLocality}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0" />
                {/*
                  `tel:` cũ là +842812345678 (số bàn TP.HCM) trong khi text hiển thị
                  là 0373 685 634 — bấm gọi trên mobile sẽ gọi SAI số. Nay cả hai
                  lấy từ cùng một nguồn.
                */}
                <a href={VEXIM_PHONE_TEL_URL} className="text-white/80 hover:text-accent transition-colors">
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0" />
                {/* `mailto:` cũ có dấu cách thừa: "mailto: contact@..." — không mở được mail client */}
                <a href={`mailto:${PUBLIC_EMAIL}`} className="text-white/80 hover:text-accent transition-colors">
                  {PUBLIC_EMAIL}
                </a>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <FooterHeading>Giờ làm việc</FooterHeading>
            {/* Sinh từ OPENING_HOURS_LABELS — cùng nguồn với openingHoursSpecification trong schema */}
            <ul className="space-y-2 text-white/80">
              {OPENING_HOURS_LABELS.map((line) => (
                <li key={line}>{line}</li>
              ))}
              <li className="text-amber-400 font-semibold pt-2">Hỗ trợ khẩn cấp: 24/7</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center text-white/80">
          <p>&copy; {new Date().getFullYear()} {ORGANIZATION_NAME}. Bản quyền thuộc về Công ty.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
