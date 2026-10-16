"use client"

import type React from "react"
import { Mail, Phone, MapPin } from "lucide-react"
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
          <nav aria-label="Mạng xã hội Vexim Global" className="flex flex-wrap items-center justify-center gap-4 mb-6">
            {[
              { name: "Facebook", href: SOCIAL_PROFILES.facebook, icon: "/facebook.png" },
              { name: "LinkedIn", href: SOCIAL_PROFILES.linkedin, icon: "/linkedin.png" },
              { name: "Zalo", href: SOCIAL_PROFILES.zalo, icon: "/Icon_of_Zalo.svg.webp" },
            ].map(({ name, href, icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${name} Vexim Global (mở tab mới)`}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white transition-colors"
              >
                <img src={icon} alt="" width={40} height={40} className="rounded-md bg-white" />
                <span>{name}</span>
              </a>
            ))}
          </nav>
          <p>&copy; {new Date().getFullYear()} {ORGANIZATION_NAME}. Bản quyền thuộc về Công ty.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
