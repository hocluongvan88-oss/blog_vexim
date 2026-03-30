'use client'

import { Card } from '@/components/ui/card'
import { CheckCircle2, AlertCircle } from 'lucide-react'

export function FdaComparisonSection() {
  const comparisonData = [
    {
      category: 'Loại sản phẩm',
      food: 'Thực phẩm & đồ uống',
      cosmetics: 'Mỹ phẩm & dùng ngoài'
    },
    {
      category: 'Quy định chính',
      food: 'FSMA (Food Safety Modernization Act)',
      cosmetics: 'MoCRA (Modernization of Cosmetics Regulation Act)'
    },
    {
      category: 'Kiểm soát trước khi bán',
      food: 'Có - Yêu cầu FDA phê duyệt (nếu cần)',
      cosmetics: 'Không - FDA không phê duyệt trước'
    },
    {
      category: 'Đại diện tại Mỹ',
      food: 'U.S. Agent (Tùy chọn nhưng khuyến cáo)',
      cosmetics: 'U.S. Responsible Person (Bắt buộc theo MoCRA)'
    },
    {
      category: 'Đăng ký cơ sở',
      food: 'Bắt buộc & gia hạn 2 năm',
      cosmetics: 'Bắt buộc & gia hạn hàng năm'
    },
    {
      category: 'Ghi nhãn',
      food: 'Chi tiết: thành phần, hạn sử dụng, thông tin dinh dưỡng',
      cosmetics: 'Đơn giản: thành phần, chống chỉ định'
    },
    {
      category: 'Kế hoạch an toàn',
      food: 'FSMA/HACCP bắt buộc',
      cosmetics: 'Không bắt buộc (nhưng khuyến cáo)'
    },
    {
      category: 'Thử nghiệm sản phẩm',
      food: 'Có thể yêu cầu kiểm tra vi sinh, hóa chất',
      cosmetics: 'Ít yêu cầu hơn, chủ yếu kiểm tra thành phần'
    }
  ]

  const foodRequirements = [
    'Đăng ký FDA Food Facility',
    'Chỉ định U.S. Agent',
    'Lập kế hoạch FSMA/HACCP',
    'Ghi nhãn tuân thủ FDA',
    'Kiểm tra an toàn thực phẩm'
  ]

  const cosmeticsRequirements = [
    'Đăng ký FDA Cosmetics Facility',
    'Chỉ định U.S. Responsible Person',
    'Đăng ký Cosmetic Product Listing',
    'Lập Product Information File (PIF)',
    'Ghi nhãn tuân thủ MoCRA'
  ]

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Sự khác biệt: Thực phẩm vs Mỹ phẩm
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hiểu rõ yêu cầu khác nhau để lựa chọn dịch vụ phù hợp
          </p>
        </div>

        {/* Comparison table */}
        <div className="overflow-x-auto mb-16">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-left p-4 font-bold text-foreground bg-muted/50">Tiêu chí</th>
                <th className="text-left p-4 font-bold text-primary">Thực phẩm (FSMA)</th>
                <th className="text-left p-4 font-bold text-secondary">Mỹ phẩm (MoCRA)</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, idx) => (
                <tr 
                  key={idx}
                  className="border-b border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4 font-semibold text-foreground bg-muted/20">{row.category}</td>
                  <td className="p-4 text-sm text-foreground">{row.food}</td>
                  <td className="p-4 text-sm text-foreground">{row.cosmetics}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Requirements sections */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Food requirements */}
          <Card className="p-8 border-l-4 border-l-primary bg-background">
            <h3 className="text-2xl font-bold text-primary mb-6 flex gap-2 items-center">
              <AlertCircle className="w-6 h-6" />
              Yêu cầu cho Thực phẩm
            </h3>
            <ul className="space-y-4">
              {foodRequirements.map((req, idx) => (
                <li key={idx} className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{req}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground mt-6 pt-6 border-t border-border">
              Yêu cầu: Kỳ hạn, bắt buộc, chi tiết cao
            </p>
          </Card>

          {/* Cosmetics requirements */}
          <Card className="p-8 border-l-4 border-l-secondary bg-background">
            <h3 className="text-2xl font-bold text-secondary mb-6 flex gap-2 items-center">
              <AlertCircle className="w-6 h-6" />
              Yêu cầu cho Mỹ phẩm
            </h3>
            <ul className="space-y-4">
              {cosmeticsRequirements.map((req, idx) => (
                <li key={idx} className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{req}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground mt-6 pt-6 border-t border-border">
              Yêu cầu: Gia hạn hàng năm, bắt buộc, chi tiết trung bình
            </p>
          </Card>
        </div>

        {/* Key insights */}
        <Card className="p-8 bg-secondary/5 border border-secondary/20">
          <h3 className="text-lg font-bold text-foreground mb-4">
            Những điều cần biết:
          </h3>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-secondary font-bold">1.</span>
              <span className="text-foreground">
                <strong>Thực phẩm</strong> có quy định chặt chẽ hơn vì liên quan trực tiếp đến sức khỏe người dùng
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-secondary font-bold">2.</span>
              <span className="text-foreground">
                <strong>Mỹ phẩm</strong> có quy trình đăng ký nhanh hơn nhưng yêu cầu U.S. Responsible Person bắt buộc
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-secondary font-bold">3.</span>
              <span className="text-foreground">
                Cả hai đều yêu cầu <strong>ghi nhãn chính xác</strong> - lỗi ghi nhãn là lý do chính khiến hàng bị cấm
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-secondary font-bold">4.</span>
              <span className="text-foreground">
                Nên <strong>lên kế hoạch sớm</strong> vì quy trình có thể mất 2-8 tuần tùy theo tính chất sản phẩm
              </span>
            </li>
          </ul>
        </Card>
      </div>
    </section>
  )
}
