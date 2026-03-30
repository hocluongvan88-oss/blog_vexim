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
    color: "from-blue-500 to-blue-600",
  },
  {
    number: "02",
    title: "Chuẩn bị hồ sơ",
    description: "Thu thập, kiểm tra và hoàn thiện toàn bộ hồ sơ pháp lý theo quy định của từng thị trường.",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    number: "03",
    title: "Nộp hồ sơ & Theo dõi",
    description: "Gửi hồ sơ đến cơ quan có thẩm quyền, theo dõi tiến độ và phối hợp giải quyết vướng mắc.",
    color: "from-blue-500 to-blue-600",
  },
  {
    number: "04",
    title: "Nhận kết quả & Hỗ trợ",
    description: "Bàn giao giấy phép, hướng dẫn sử dụng và hỗ trợ duy trì tuân thủ lâu dài.",
    color: "from-emerald-500 to-emerald-600",
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
          {/* Desktop View - Horizontal Flow */}
          <div className="hidden md:grid md:grid-cols-4 gap-4 mb-8">
            {workflowSteps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="p-6 h-full border-2 hover:border-primary/30 transition-all duration-300">
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} text-white flex items-center justify-center text-2xl font-bold mb-4 mx-auto shadow-lg`}
                  >
                    {step.number}
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-2 text-center">{step.title}</h3>
                  <p className="text-sm text-muted-foreground text-center leading-relaxed">{step.description}</p>
                </Card>
                {index < workflowSteps.length - 1 && (
                  <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                    <div className="w-4 h-4 border-t-4 border-r-4 border-accent rotate-45"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile View - Vertical Flow */}
          <div className="md:hidden space-y-6">
            {workflowSteps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="p-6 border-2 hover:border-primary/30 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-14 h-14 flex-shrink-0 rounded-full bg-gradient-to-br ${step.color} text-white flex items-center justify-center text-xl font-bold shadow-lg`}
                    >
                      {step.number}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-primary mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </Card>
                {index < workflowSteps.length - 1 && (
                  <div className="flex justify-center my-2">
                    <div className="w-1 h-6 bg-accent"></div>
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
                className="inline-block bg-accent text-white px-8 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors"
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
