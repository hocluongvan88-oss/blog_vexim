'use client'

import { Card } from '@/components/ui/card'
import { Award, Users, Globe, CheckCircle2 } from 'lucide-react'

export function TrustMetricsSection() {
  const metrics = [
    {
      icon: Users,
      value: '500+',
      label: 'Doanh nghiệp hỗ trợ',
      description: 'Hơn 500 công ty Việt Nam đã tin tưởng Vexim Global'
    },
    {
      icon: Globe,
      value: '1000+',
      label: 'Sản phẩm đăng ký FDA',
      description: 'Hỗ trợ đăng ký thành công cho 1000+ sản phẩm'
    },
    {
      icon: Award,
      value: '15+',
      label: 'Năm kinh nghiệm',
      description: 'Hơn 15 năm chuyên môn trong lĩnh vực FDA compliance'
    },
    {
      icon: CheckCircle2,
      value: '100%',
      label: 'Tỉ lệ thành công',
      description: 'Tất cả hồ sơ đều được xử lý đúng quy định FDA'
    }
  ]

  const credentials = [
    {
      title: 'FDA Compliance Experts',
      description: 'Đội ngũ chuyên gia am hiểu sâu về quy định FDA hiện hành'
    },
    {
      title: 'MoCRA Certified',
      description: 'Cập nhật kiến thức mới nhất về Modernization of Cosmetics Regulation Act'
    },
    {
      title: 'FSMA Specialists',
      description: 'Chuyên gia xây dựng Food Safety Modernization Act compliance'
    },
    {
      title: 'Industry Partners',
      description: 'Hợp tác với các cơ quan FDA, U.S. Agents, và Responsible Persons'
    }
  ]

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Tại sao chọn Vexim Global?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Kinh nghiệm, chuyên môn và cam kết của chúng tôi với hơn 500 doanh nghiệp Việt Nam
          </p>
        </div>

        {/* Metrics grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {metrics.map((metric) => {
            const Icon = metric.icon
            return (
              <Card 
                key={metric.label}
                className="p-8 text-center border border-border bg-background hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-center mb-4">
                  <Icon className="w-10 h-10 text-secondary" />
                </div>
                <p className="text-3xl font-bold text-primary mb-2">
                  {metric.value}
                </p>
                <p className="font-semibold text-foreground mb-3">
                  {metric.label}
                </p>
                <p className="text-sm text-muted-foreground">
                  {metric.description}
                </p>
              </Card>
            )
          })}
        </div>

        {/* Credentials section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
            Chứng chỉ & Chuyên môn
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {credentials.map((cred) => (
              <div 
                key={cred.title}
                className="flex gap-4 p-6 bg-background border border-border rounded-lg hover:border-secondary/50 transition-colors"
              >
                <CheckCircle2 className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    {cred.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {cred.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust statement */}
        <Card className="p-8 bg-gradient-to-r from-primary/10 to-secondary/10 border border-secondary/20">
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-foreground italic text-center">
              "Vexim Global không chỉ là đơn vị tư vấn FDA, mà còn là đối tác tin cậy giúp doanh nghiệp Việt Nam mở rộng thị trường Hoa Kỳ. Chúng tôi cam kết đảm bảo tuân thủ 100% quy định, giảm thiểu rủi ro hàng hóa bị cấm, và tối ưu hóa quá trình xuất khẩu."
            </p>
            <p className="text-center text-sm text-muted-foreground mt-4 font-semibold">
              — Vexim Global Team
            </p>
          </div>
        </Card>
      </div>
    </section>
  )
}
