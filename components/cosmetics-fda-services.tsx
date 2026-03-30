'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

const cosmeticsServices = [
  {
    id: 1,
    title: 'Đăng ký FDA cho Cơ sở Sản xuất',
    description: 'Hỗ trợ đăng ký cơ sở sản xuất mỹ phẩm trên hệ thống FDA',
    details: [
      'Chuẩn bị hồ sơ theo MoCRA',
      'Đăng ký trên FDA Cosmetics Portal',
      'Hỗ trợ sau đăng ký'
    ],
    price: 'Liên hệ'
  },
  {
    id: 2,
    title: 'Chỉ định U.S. Responsible Person (RP)',
    description: 'Lựa chọn và đăng ký đại diện hợp lệ trách nhiệm tại Mỹ',
    details: [
      'Tìm U.S. Responsible Person',
      'Chuẩn bị hồ sơ RP',
      'Đăng ký trên FDA'
    ],
    price: 'Liên hệ'
  },
  {
    id: 3,
    title: 'Đăng ký Cosmetic Product Listing',
    description: 'Lập danh sách sản phẩm mỹ phẩm trên hệ thống FDA',
    details: [
      'Phân loại sản phẩm',
      'Chuẩn bị thông tin chi tiết',
      'Đăng ký trên FDA database'
    ],
    price: 'Liên hệ'
  },
  {
    id: 4,
    title: 'Tư vấn & Chuẩn bị Product Information File (PIF)',
    description: 'Lập hồ sơ thông tin chi tiết về sản phẩm theo tiêu chuẩn FDA',
    details: [
      'Phân tích thành phần',
      'Lập tài liệu PIF đầy đủ',
      'Kiểm tra tính tuân thủ'
    ],
    price: 'Liên hệ'
  },
  {
    id: 5,
    title: 'Tư vấn Ghi nhãn Mỹ phẩm',
    description: 'Đảm bảo ghi nhãn mỹ phẩm đúng theo quy định FDA',
    details: [
      'Kiểm tra tuyên bố quảng cáo',
      'Thiết kế nhãn phù hợp',
      'Hỗ trợ lưu thông thị trường'
    ],
    price: 'Liên hệ'
  },
  {
    id: 6,
    title: 'Hỗ trợ Compliance bán hàng Amazon/Mỹ',
    description: 'Tư vấn tuân thủ khi bán hàng qua các kênh Mỹ',
    details: [
      'Kiểm tra compliance Amazon',
      'Cập nhật hồ sơ sản phẩm',
      'Hỗ trợ xử lý báo cáo'
    ],
    price: 'Liên hệ'
  }
]

export function CosmeticsFdaServicesComponent() {
  return (
    <section className="py-16 md:py-24 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Dịch vụ FDA cho Mỹ phẩm
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hỗ trợ toàn diện đăng ký FDA theo MoCRA (Modernization of Cosmetics Regulation Act)
          </p>
        </div>

        {/* Services grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cosmeticsServices.map((service) => (
            <Card 
              key={service.id}
              className="p-6 hover:shadow-lg transition-shadow duration-300 border border-border bg-background hover:border-secondary/50 flex flex-col"
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
            Cần hỗ trợ xuất khẩu mỹ phẩm sang Mỹ?
          </p>
          <Link href="#contact">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white gap-2">
              Yêu cầu tư vấn miễn phí ngay
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
