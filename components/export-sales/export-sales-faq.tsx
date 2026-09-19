"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const FAQS = [
  {
    q: "Doanh nghiệp tự thuê 1–2 nhân viên sales xuất khẩu có rẻ và hiệu quả hơn không?",
    a: "Chi phí bề mặt của 1 nhân viên sales có kinh nghiệm xuất khẩu Mỹ là 18–25 triệu VNĐ/tháng. Nhưng chưa tính: thời gian tuyển dụng (2–4 tháng), chi phí đào tạo pháp lý FDA/MoCRA và quy trình thanh toán quốc tế (thêm 3–6 tháng), cùng rủi ro nhân sự nghỉ việc mang theo toàn bộ quan hệ buyer. Với Vexim Global, doanh nghiệp có ngay cả một đội ngũ chuyên nghiệp (trưởng dự án, chuyên gia FDA, nhân sự đàm phán) vận hành từ tuần đầu tiên — với hoa hồng thành công chỉ tính khi có tiền USD về tài khoản.",
  },
  {
    q: "Mất bao lâu để có đơn hàng đầu tiên? Vexim Global có cam kết không?",
    a: "Dựa trên dữ liệu thực tế từ 180+ nhà máy trong hệ thống, thời gian trung bình từ khi ký hợp đồng đến khi có đơn hàng mẫu đầu tiên là 8–12 tuần. Vexim không đưa ra con số buyer cam kết cố định, vì mỗi ngành nghề, sản phẩm có dung lượng thị trường khác nhau — danh mục buyer tiềm năng được xác định theo ngành hàng cụ thể, thẩm định hồ sơ hải quan kỹ lưỡng và báo cáo minh bạch cho doanh nghiệp. Nếu sau 4 tháng không có tiến triển thực chất, doanh nghiệp có quyền dừng hợp đồng theo điều khoản minh bạch đã ký.",
  },
  {
    q: "Làm thế nào để nhà máy kiểm soát công việc Vexim đang triển khai?",
    a: "Hệ thống quản trị cung cấp báo cáo và tiến độ real-time: từng buyer Mỹ đang được tiếp cận, trạng thái deal (báo giá, gửi mẫu, đàm phán), toàn bộ email trao đổi bằng tiếng Anh và chứng từ thương mại. Doanh nghiệp nắm rõ đội ngũ Vexim đang làm gì mỗi tuần — mọi thông tin đều được số hóa minh bạch, không phụ thuộc vào các báo cáo tổng kết chung chung.",
  },
  {
    q: "Nhà máy chưa có đăng ký FDA hoặc chưa hoàn thiện nhãn thì có tham gia được không?",
    a: "Hoàn toàn được. Đây là tình huống phổ biến nhất của các nhà máy sản xuất Việt Nam khi mới bắt đầu xuất khẩu sang Mỹ. Đội ngũ chuyên gia FDA của Vexim sẽ trực tiếp rà soát, đăng ký cơ sở (Food Facility / Cosmetic Listing MoCRA) và chuẩn hóa nhãn mác trong 24–48 giờ. Quy trình chuẩn hóa này được tiến hành song song với việc nghiên cứu danh sách buyer mục tiêu để không lãng phí thời gian.",
  },
  {
    q: "Vexim bảo vệ nhà máy trước rủi ro lừa đảo thanh toán quốc tế như thế nào?",
    a: "Vexim chỉ kết nối nhà máy với các buyer Mỹ đã được xác minh qua dữ liệu hải quan thực tế (Bill of Lading) và lịch sử nhập khẩu. Đặc biệt, Vexim áp dụng quy trình xác thực thanh toán SWIFT 2 lớp độc lập (Separation of Duties): nhân viên kinh doanh không được tự xác nhận thanh toán; chỉ khi bộ phận kiểm soát độc lập và ngân hàng xác nhận tiền USD đã về tài khoản nhà máy mới tiến hành các bước tiếp theo.",
  },
  {
    q: "Mô hình phí của Vexim gồm những khoản nào? Có phát sinh chi phí ẩn không?",
    a: "Mô hình hợp tác của Vexim gồm 2 phần minh bạch ghi rõ trong hợp đồng: (1) Phí duy trì đội sales hàng tháng; và (2) Hoa hồng thành công (% trên kim ngạch USD đã về tài khoản nhà máy). Không có bất kỳ chi phí ẩn nào.",
  },
  {
    q: "Quy mô nhà máy nào phù hợp với dịch vụ phòng sales xuất khẩu?",
    a: "Phù hợp từ xưởng sản xuất quy mô vừa (15–30 nhân sự) đến nhà máy lớn hàng trăm công nhân. Yêu cầu quan trọng nhất là doanh nghiệp có sản phẩm chất lượng ổn định, năng lực đáp ứng đơn hàng định kỳ và cam kết đầu tư nghiêm túc vào thị trường Mỹ dài hạn. Các ngành chủ lực gồm: thực phẩm & đồ uống, mỹ phẩm thiên nhiên (MoCRA), thực phẩm chức năng và thiết bị y tế.",
  },
]

export function ExportSalesFaq() {
  return (
    <Accordion type="single" collapsible className="w-full space-y-3 sm:space-y-4">
      {FAQS.map((faq, index) => (
        <AccordionItem
          key={index}
          value={`faq-${index}`}
          className="border border-border/80 rounded-xl px-4 sm:px-5 py-1 sm:py-2 bg-card hover:border-primary/40 transition-colors shadow-xs"
        >
          <AccordionTrigger className="text-left text-sm sm:text-base font-semibold text-foreground hover:no-underline py-3.5 sm:py-4 leading-snug">
            {faq.q}
          </AccordionTrigger>
          <AccordionContent className="text-xs sm:text-sm leading-relaxed text-muted-foreground pt-1 pb-3.5 sm:pb-4">
            {faq.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
