'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

export function FdaHeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main headline and subheadline */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-full">
            <p className="text-sm font-semibold text-secondary">Hỗ trợ xuất khẩu sang Hoa Kỳ</p>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance mb-6 text-foreground">
            Đăng ký FDA dễ dàng
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mt-2">
              cho doanh nghiệp Việt Nam
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 text-balance leading-relaxed">
            Vexim Global là đối tác tin cậy của hơn 500+ doanh nghiệp Việt Nam trong việc đăng ký FDA và tuân thủ quy định xuất khẩu thực phẩm, mỹ phẩm vào thị trường Hoa Kỳ.
          </p>

          {/* Trust metrics */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 mb-12 max-w-2xl mx-auto">
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-primary">500+</p>
              <p className="text-sm text-muted-foreground">Doanh nghiệp hỗ trợ</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-primary">1000+</p>
              <p className="text-sm text-muted-foreground">Sản phẩm đăng ký</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-primary">15+</p>
              <p className="text-sm text-muted-foreground">Năm kinh nghiệm</p>
            </div>
          </div>

          {/* Primary CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/services/fda">
              <Button size="lg" className="gap-2 w-full sm:w-auto bg-primary hover:bg-primary/90 text-white">
                Khám phá dịch vụ FDA
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="#contact">
              <Button 
                size="lg" 
                variant="outline"
                className="gap-2 w-full sm:w-auto border-2 border-secondary text-secondary hover:bg-secondary/10"
              >
                Tư vấn miễn phí
              </Button>
            </Link>
          </div>
        </div>

        {/* Key benefits */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 pt-12 border-t border-border">
          <div className="flex gap-4">
            <CheckCircle2 className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">Đăng ký nhanh chóng</h3>
              <p className="text-sm text-muted-foreground">
                Xử lý hồ sơ trong 24-48 giờ, hỗ trợ từng bước quy trình FDA
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <CheckCircle2 className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">Chuyên gia FDA</h3>
              <p className="text-sm text-muted-foreground">
                Đội ngũ chuyên gia am hiểu sâu về quy định FDA, MoCRA, FSMA
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <CheckCircle2 className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">Hỗ trợ toàn diện</h3>
              <p className="text-sm text-muted-foreground">
                Từ hồ sơ, ghi nhãn, đến xuất khẩu - giải pháp trọn gói
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
