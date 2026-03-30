'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

const foodServices = [
  {
    id: 1,
    title: 'Đăng ký FDA Cơ sở sản xuất',
    description: 'Hỗ trợ đăng ký cơ sở sản xuất thực phẩm trên hệ thống FDA',
    details: [
      'Chuẩn bị hồ sơ đầy đủ',
      'Đăng ký trên FDA eCopy',
      'Hỗ trợ sau đăng ký'
    ],
    price: 'Liên hệ'
  },
  {
    id: 2,
    title: 'Gia hạn FDA Facility (Biennial Renewal)',
    description: 'Gia hạn lệnh đăng ký thực phẩm hàng 2 năm một lần',
    details: [
      'Theo dõi thời gian gia hạn',
      'Chuẩn bị và nộp hồ sơ',
      'Xác nhận gia hạn thành công'
    ],
    price: 'Liên hệ'
  },
  {
    id: 3,
    title: 'U.S. Agent cho Cơ sở Thực phẩm',
    description: 'Chỉ định đại diện Mỹ hợp lệ theo quy định FDA',
    details: [
      'Lựa chọn U.S. Agent phù hợp',
      'Đăng ký với FDA',
      'Hỗ trợ liên lạc với FDA'
    ],
    price: 'Liên hệ'
  },
  {
    id: 4,
    title: 'Tư vấn & Xây dựng FSVP Importer',
    description: 'Lập kế hoạch FSVP cho các nhập khẩu thực phẩm vào Mỹ',
    details: [
      'Phân tích rủi ro thực phẩm',
      'Xây dựng kế hoạch FSVP',
      'Đánh giá nhà cung cấp'
    ],
    price: 'Liên hệ'
  },
  {
    id: 5,
    title: 'Tư vấn Ghi nhãn Thực phẩm',
    description: 'Đảm bảo ghi nhãn đúng theo quy định FDA',
    details: [
      'Kiểm tra tiêu chí ghi nhãn',
      'Thiết kế nhãn phù hợp',
      'Hỗ trợ lưu thông thị trường'
    ],
    price: 'Liên hệ'
  },
  {
    id: 6,
    title: 'Tư vấn Kế hoạch An toàn Thực phẩm',
    description: 'Lập kế hoạch HACCP/FSP theo tiêu chuẩn FDA',
    details: [
      'Phân tích điểm kiểm soát',
      'Lập tài liệu HACCP',
      'Đào tạo toàn nhân viên'
    ],
    price: 'Liên hệ'
  }
]

export function FoodFdaServicesComponent() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Dịch vụ FDA cho Thực phẩm
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hỗ trợ toàn diện đăng ký FDA và tuân thủ FSMA cho doanh nghiệp thực phẩm xuất khẩu
          </p>
        </div>

        {/* Services grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foodServices.map((service) => (
            <Card 
              key={service.id}
              className="p-6 hover:shadow-lg transition-shadow duration-300 border border-border bg-card hover:border-secondary/50 flex flex-col"
            >
              {/* Service title and description */}
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                {service.description}
              </p>

              {/* Service details */}
              <ul className="space-y-2 mb-6 flex-grow">
                {service.details.map((detail, idx) => (
                  <li key={idx} className="flex gap-2 text-sm text-foreground">
                    <span className="text-secondary font-bold">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>

              {/* Price and CTA */}
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-4">
                  Giá: <span className="font-semibold text-foreground">{service.price}</span>
                </p>
                <Link href="#contact" className="w-full">
                  <Button 
                    variant="outline"
                    className="w-full border-secondary text-secondary hover:bg-secondary/10 group"
                  >
                    Liên hệ tư vấn
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-6">
            Cần giải pháp FDA tùy chỉnh cho doanh nghiệp của bạn?
          </p>
          <Link href="#contact">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white gap-2">
              Yêu cầu tư vấn miễn phí ngay
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
