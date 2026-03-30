'use client'

import { Card } from '@/components/ui/card'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

export function ProcessFlowSection() {
  const steps = [
    {
      number: 1,
      title: 'Tư vấn & Đánh giá',
      description: 'Hiểu rõ doanh nghiệp của bạn, loại sản phẩm, thị trường mục tiêu',
      details: [
        'Phân tích loại sản phẩm',
        'Xác định quy định áp dụng',
        'Lập kế hoạch tài chính & timeline'
      ]
    },
    {
      number: 2,
      title: 'Chuẩn bị Hồ sơ',
      description: 'Chúng tôi giúp chuẩn bị tất cả các tài liệu cần thiết',
      details: [
        'Biên soạn hồ sơ FDA',
        'Chuẩn bị thông tin sản phẩm',
        'Kiểm tra tuân thủ quy định'
      ]
    },
    {
      number: 3,
      title: 'Đăng ký Cơ sở & Sản phẩm',
      description: 'Nộp hồ sơ lên FDA hoặc FDA Cosmetics Portal',
      details: [
        'Đăng ký cơ sở sản xuất',
        'Đăng ký sản phẩm',
        'Chỉ định U.S. Agent/RP'
      ]
    },
    {
      number: 4,
      title: 'Theo dõi & Hỗ trợ',
      description: 'Chúng tôi liên lạc với FDA, trả lời câu hỏi, cập nhật tiến độ',
      details: [
        'Liên lạc với FDA',
        'Xử lý những câu hỏi từ FDA',
        'Cập nhật thông tin mới'
      ]
    },
    {
      number: 5,
      title: 'Xác nhận & Hỗ trợ Tiếp theo',
      description: 'FDA phê duyệt, giúp bạn bắt đầu xuất khẩu hoặc kinh doanh',
      details: [
        'Nhận giấy chứng nhận',
        'Hướng dẫn mỹ phẩm compliance',
        'Hỗ trợ gia hạn (nếu cần)'
      ]
    }
  ]

  const timeline = [
    { phase: 'Tư vấn & chuẩn bị', duration: '1-2 tuần', icon: '📋' },
    { phase: 'Nộp hồ sơ FDA', duration: '1-2 tuần', icon: '📄' },
    { phase: 'FDA xử lý & hỏi đáp', duration: '2-6 tuần', icon: '⏳' },
    { phase: 'Xác nhận & hoàn tất', duration: '1-2 tuần', icon: '✅' }
  ]

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-card to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Quy trình đơn giản, minh bạch
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            5 bước để hoàn tất đăng ký FDA của bạn
          </p>
        </div>

        {/* Steps */}
        <div className="mb-16">
          <div className="grid md:grid-cols-5 gap-4 md:gap-2 mb-8">
            {steps.map((step, idx) => (
              <div key={step.number} className="relative">
                {/* Card */}
                <Card className="p-6 text-center h-full border border-border hover:border-secondary/50 hover:shadow-lg transition-all">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                    {step.number}
                  </div>
                  <h3 className="font-semibold text-foreground mb-3 text-sm">
                    {step.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    {step.description}
                  </p>
                  <ul className="text-xs space-y-2 text-left">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-secondary">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Arrow between steps */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:flex absolute -right-6 top-1/2 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-5 h-5 text-secondary" />
                  </div>
                )}

                {/* Arrow for mobile */}
                {idx < steps.length - 1 && (
                  <div className="md:hidden flex justify-center py-2">
                    <div className="rotate-90">
                      <ArrowRight className="w-5 h-5 text-secondary" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <Card className="p-8 bg-primary/5 border border-primary/20 mb-16">
          <h3 className="text-2xl font-bold text-foreground mb-8">
            Thời gian xử lý dự kiến
          </h3>
          <div className="space-y-6">
            {timeline.map((item, idx) => (
              <div key={idx} className="flex gap-4 items-center">
                <div className="flex-shrink-0">
                  <div className="text-3xl">{item.icon}</div>
                </div>
                <div className="flex-grow">
                  <h4 className="font-semibold text-foreground">{item.phase}</h4>
                </div>
                <div className="flex-shrink-0">
                  <div className="px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold">
                    {item.duration}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-primary/20">
            <p className="text-sm text-muted-foreground">
              <strong>Tổng cộng:</strong> 6-14 tuần tùy vào loại sản phẩm và tính phức tạp của hồ sơ
            </p>
          </div>
        </Card>

        {/* Key benefits of process */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 border border-border bg-background">
            <CheckCircle2 className="w-8 h-8 text-secondary mb-3" />
            <h4 className="font-semibold text-foreground mb-2">Minh bạch 100%</h4>
            <p className="text-sm text-muted-foreground">
              Bạn được cập nhật từng bước tiến độ, không bất ngờ
            </p>
          </Card>
          <Card className="p-6 border border-border bg-background">
            <CheckCircle2 className="w-8 h-8 text-secondary mb-3" />
            <h4 className="font-semibold text-foreground mb-2">Tiết kiệm thời gian</h4>
            <p className="text-sm text-muted-foreground">
              Không cần tự điều hành, chúng tôi xử lý toàn bộ quá trình
            </p>
          </Card>
          <Card className="p-6 border border-border bg-background">
            <CheckCircle2 className="w-8 h-8 text-secondary mb-3" />
            <h4 className="font-semibold text-foreground mb-2">Hỗ trợ bất cứ lúc nào</h4>
            <p className="text-sm text-muted-foreground">
              Đội ngũ sẵn sàng trả lời câu hỏi 24/7
            </p>
          </Card>
        </div>
      </div>
    </section>
  )
}
