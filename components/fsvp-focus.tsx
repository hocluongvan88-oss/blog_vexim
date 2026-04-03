import { Card } from "@/components/ui/card"
import Image from "next/image"
import { CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FSVPFocus() {
  return (
    <section id="fsvp" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Image */}
          <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden shadow-xl">
            <Image
              src="/international-trade-export-logistics-cargo-shippin.jpg"
              alt="FSVP Logistics"
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div>
            <div className="mb-6">
              <div className="inline-block px-3 py-1 bg-accent/10 text-accent font-medium text-sm rounded-full mb-4">
                Dịch vụ Trọng Điểm
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-balance">
                FSVP - Điều kiện bắt buộc xuất khẩu sang Mỹ
              </h2>
            </div>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Tất cả hàng thực phẩm nhập khẩu vào Mỹ phải tuân thủ FSVP (Foreign Supplier Verification Program) theo FSMA Rule 21 CFR 1.500. Đây là yêu cầu bắt buộc từ FDA, không phải tùy chọn.
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-primary mb-2">FSVP Importer</h3>
                  <p className="text-muted-foreground">
                    Người nhập khẩu tại Mỹ chịu trách nhiệm xác minh nhà cung cấp nước ngoài (bạn). Cần công ty/cá nhân đại diện tại Mỹ.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-primary mb-2">FSVP Plan</h3>
                  <p className="text-muted-foreground">
                    Kế hoạch chi tiết về quản lý rủi ro, kiểm soát chất lượng, và truy xuất nguồn gốc. Phải được lập trước khi gửi lô hàng đầu tiên.
                  </p>
                </div>
              </div>
            </div>

            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
              Tư vấn FSVP Plan
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
