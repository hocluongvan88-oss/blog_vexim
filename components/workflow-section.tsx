"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { useState } from "react"
import { ConsultationDialog } from "./consultation-dialog"

const workflowSteps = [
  {
    number: "01",
    title: "Tiếp nhận & Tư vấn",
    description: "Lắng nghe nhu cầu, phân tích tình hình doanh nghiệp và đề xuất giải pháp phù hợp nhất.",
    color: "from-navy-700 to-navy-900",
  },
  {
    number: "02",
    title: "Chuẩn bị hồ sơ",
    description: "Thu thập, kiểm tra và hoàn thiện toàn bộ hồ sơ pháp lý theo quy định của từng thị trường.",
    color: "from-sky-500 to-sky-600",
  },
  {
    number: "03",
    title: "Nộp hồ sơ & Theo dõi",
    description: "Gửi hồ sơ đến cơ quan có thẩm quyền, theo dõi tiến độ và phối hợp giải quyết vướng mắc.",
    color: "from-navy-700 to-navy-900",
  },
  {
    number: "04",
    title: "Nhận kết quả & Hỗ trợ",
    description: "Bàn giao giấy phép, hướng dẫn sử dụng và hỗ trợ duy trì tuân thủ lâu dài.",
    color: "from-sky-500 to-sky-600",
  },
]

export function WorkflowSection() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 text-balance">
            Quy trình làm việc chuyên nghiệp
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            4 bước đơn giản để đưa sản phẩm của bạn ra thị trường quốc tế
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/*
            MỘT khối duy nhất cho cả desktop lẫn mobile.

            Trước đây có hai khối render song song (`hidden md:grid` và `md:hidden`),
            mỗi khối lặp lại 4 tiêu đề bước — kết quả là 4 H3 "Tiếp nhận & Tư vấn",
            "Chuẩn bị hồ sơ", "Nộp hồ sơ & Theo dõi", "Nhận kết quả & Hỗ trợ" XUẤT HIỆN
            HAI LẦN trong HTML. CSS chỉ ẩn một khối về mặt hiển thị, còn crawler vẫn
            đọc thấy cả hai -> nội dung trùng lặp và cấu trúc heading bị nhiễu.

            Nay dùng grid responsive: 1 cột trên mobile, 4 cột từ `md` trở lên.
            Mũi tên nối giữa các bước chỉ hiện trên desktop (nơi các bước nằm ngang).
          */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-4 mb-8">
            {workflowSteps.map((step, index) => (
              <div key={step.number} className="relative">
                <Card className="p-6 h-full border-2 hover:border-primary/30 transition-all duration-300">
                  <div className="flex items-start gap-4 md:block">
                    <div
                      className={`w-14 h-14 md:w-16 md:h-16 flex-shrink-0 rounded-full bg-gradient-to-br ${step.color} text-white flex items-center justify-center text-xl md:text-2xl font-bold md:mb-4 md:mx-auto shadow-lg`}
                    >
                      {step.number}
                    </div>
                    <div className="flex-1 md:text-center">
                      <h3 className="text-lg font-bold text-primary mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </Card>
                {/* Mũi tên nối: chỉ ở desktop, giữa các cột */}
                {index < workflowSteps.length - 1 && (
                  <div
                    className="absolute top-1/2 -right-2 transform -translate-y-1/2 z-10 hidden md:block"
                    aria-hidden="true"
                  >
                    <div className="w-4 h-4 border-t-4 border-r-4 border-accent rotate-45"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
              <div className="flex items-center justify-center gap-2 mb-4">
                <CheckCircle2 className="w-6 h-6 text-accent" />
                <h3 className="text-xl font-bold text-primary">Cam kết minh bạch trong từng bước</h3>
              </div>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto leading-relaxed">
                Bạn sẽ được thông báo tiến độ thường xuyên và có thể liên hệ chuyên viên phụ trách bất cứ lúc nào trong
                suốt quá trình.
              </p>
              <button
                onClick={() => setIsDialogOpen(true)}
                className="inline-block bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-navy-950 px-8 py-3 rounded-lg font-semibold shadow-md shadow-orange-500/25 transition-all"
              >
                Bắt đầu ngay hôm nay
              </button>
            </Card>
          </div>
        </div>
      </div>

      <ConsultationDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </section>
  )
}
