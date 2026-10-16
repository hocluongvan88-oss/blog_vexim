export const EXPORT_DIGITAL = {
  path: "/services/export-digital",
  title: "Website xuất khẩu & hiện diện số | Vexim Export Digital",
  description:
    "Buyer và AI đang thấy gì về doanh nghiệp bạn? Nhận báo cáo đánh giá website, câu chuyện sản phẩm và 3 việc nên làm — miễn phí trong 2 ngày làm việc.",
  reportTitle: "Buyer và AI nhìn thấy gì về bạn",
  image: "/images/og-export-digital.png",
} as const

export const EXPORT_MARKETS = ["Mỹ", "EU", "Úc", "Nhật", "Hàn", "Trung Đông", "Trung Quốc", "Khác"] as const
export const EXPORT_CHANNELS = ["Alibaba", "Sàn khác", "Hội chợ", "Đại lý", "Chưa xuất khẩu"] as const

export const EXPORT_SIGNALS = [
  "Gửi báo giá xong, buyer im lặng.",
  "Luôn bị so giá với nhà cung cấp rẻ hơn vài phần trăm.",
  "Đã đầu tư chứng nhận, nhưng chưa bán được giá cao hơn.",
  "Chỉ gặp buyer nhỏ lẻ, đơn thử rồi thôi.",
  "Buyer hỏi “Company profile của bạn đâu?” mà chưa có tài liệu đủ thuyết phục để gửi.",
] as const

export const BUYER_CRITERIA = [
  {
    title: "Nguồn gốc",
    question: "Nguyên liệu từ đâu, có ổn định không?",
    evidence: "Vùng nguyên liệu, mùa vụ, ảnh thật và khả năng truy xuất.",
    icon: "origin",
  },
  {
    title: "Con người",
    question: "Ai đứng sau sản phẩm này?",
    evidence: "Người sáng lập, đội QA, kinh nghiệm có thể đối chiếu.",
    icon: "people",
  },
  {
    title: "Quy trình",
    question: "Kiểm soát chất lượng thế nào?",
    evidence: "Các bước sản xuất, ảnh và video nhà máy thực tế.",
    icon: "process",
  },
  {
    title: "Bằng chứng",
    question: "Những điều bạn nói có thật không?",
    evidence: "Chứng nhận, thông tin đăng ký, kiểm nghiệm còn hiệu lực và được phép công khai.",
    icon: "proof",
  },
  {
    title: "Năng lực",
    question: "Bạn đáp ứng được đơn hàng của tôi không?",
    evidence: "Công suất, MOQ, quy cách, đóng gói và thời gian giao có căn cứ.",
    icon: "capacity",
  },
  {
    title: "Hợp tác",
    question: "Bắt đầu làm việc với bạn thế nào?",
    evidence: "Cách gửi mẫu, quy trình báo giá, điều khoản và đầu mối liên hệ.",
    icon: "cooperate",
  },
] as const

export const EXPORT_COMPARISON = [
  ["Một gian hàng theo khuôn mẫu chung", "Một nhà máy, con người và quy trình cụ thể"],
  ["Khác biệt khó thể hiện trong vài dòng báo giá", "Lý do để cân nhắc ngoài giá: đáng tin, ổn định, đúng yêu cầu"],
  ["Chứng nhận có thể bị thu nhỏ trong ảnh sản phẩm", "Bằng chứng được trình bày rõ, có thông tin để đối chiếu"],
  [
    "Ít nguồn thông tin gốc để công cụ tìm kiếm đối chiếu",
    "Thông tin nhất quán giúp công cụ tìm kiếm và AI có thêm cơ sở hiểu bạn",
  ],
] as const

export const EXPORT_STEPS = [
  {
    title: "Đánh giá miễn phí",
    text: "Kiểm tra website và thông tin công khai trên Google, AI theo truy vấn đã chọn. Chuyên viên gửi báo cáo trong 2 ngày làm việc.",
    note: "Bắt đầu ở đây",
  },
  {
    title: "Khai thác câu chuyện",
    text: "Phỏng vấn, thu thập hồ sơ và lên kế hoạch ảnh, video. Có thể dành nửa ngày tại nhà máy theo phạm vi thống nhất.",
    note: "Hiểu đúng doanh nghiệp",
  },
  {
    title: "Xây dựng",
    text: "Website song ngữ, company profile, nội dung được rà soát claims theo thị trường nhập khẩu; đồng bộ với gian hàng B2B.",
    note: "Kể đúng, chứng minh được",
  },
  {
    title: "Tăng trưởng",
    text: "Nội dung theo câu hỏi của buyer, nghiên cứu khách hàng tiềm năng và theo dõi yêu cầu báo giá trong báo cáo hằng tháng.",
    note: "Đo bằng trao đổi thực tế",
  },
] as const

export const EXPORT_FAQS = [
  {
    question: "Tôi đã có gian hàng trên Alibaba, có cần website không?",
    answer:
      "Sàn giúp buyer tìm thấy bạn; website riêng là nơi trình bày sâu hơn về nhà máy, sản phẩm, bằng chứng và cách hợp tác. Hai kênh bổ trợ nhau, không thay thế nhau. Vexim tư vấn đồng bộ thông tin để khoản đầu tư trên sàn có thêm điểm tựa khi buyer kiểm tra doanh nghiệp.",
  },
  {
    question: "Vexim làm tuân thủ, sao lại làm website?",
    answer:
      "Vexim bắt đầu từ tư vấn tuân thủ FDA, GACC và các yêu cầu xuất khẩu. Website là nơi thể hiện những gì doanh nghiệp thực sự có: sản phẩm, quy trình, hồ sơ và năng lực. Chúng tôi kết hợp cách kể câu chuyện với việc rà soát nội dung, không biến đăng ký FDA hay một giấy chứng nhận thành cam kết chất lượng hoặc thông quan cho mọi sản phẩm.",
  },
  {
    question: "Bao lâu thì thấy kết quả?",
    answer:
      "Hồ sơ và website có thể dùng để gửi buyer ngay sau khi hoàn thiện và nghiệm thu. SEO cần được theo dõi theo tháng, phụ thuộc thị trường, mức cạnh tranh và nền tảng website; không có một mốc 4–9 tháng bảo đảm cho mọi doanh nghiệp. Danh sách buyer và lịch triển khai được thống nhất theo phạm vi hợp tác, không phải lời hứa có đơn hàng ngay tháng đầu.",
  },
  {
    question: "Có cam kết lên top Google hay ChatGPT không?",
    answer:
      "Không. Vexim không cam kết vị trí trên Google, ChatGPT, Gemini hay Perplexity, và không hứa một số đơn hàng cụ thể. Chúng tôi tập trung vào nội dung kiểm chứng được, website dễ truy cập, cấu trúc rõ ràng và theo dõi các yêu cầu báo giá. Kết quả từ AI thay đổi theo truy vấn, thời điểm và nguồn dữ liệu.",
  },
  {
    question: "Doanh nghiệp tôi nhỏ, có phù hợp không?",
    answer:
      "Có, nếu doanh nghiệp đang hoặc sắp xuất khẩu và cần tài liệu đáng tin để buyer kiểm tra. Gói Hồ sơ xuất khẩu có thể là bước nhỏ để bắt đầu; chưa cần làm website lớn ngay. Báo cáo miễn phí giúp xác định việc nào nên làm trước theo nguồn lực thực tế.",
  },
  {
    question: "Tôi xuất sang Trung Quốc thì sao?",
    answer:
      "Vexim sẽ trao đổi riêng về kênh phù hợp như Baidu, WeChat hoặc 1688 tùy mô hình và khách hàng mục tiêu. Không áp dụng một lời hứa SEO Google cho mọi thị trường. Nội dung, hồ sơ và claims cũng cần được đối chiếu với yêu cầu tại thị trường nhập khẩu.",
  },
  {
    question: "Báo cáo miễn phí gồm những gì?",
    answer:
      "Báo cáo gồm kiểm tra nền tảng website, thông tin buyer và AI có thể tìm thấy qua các truy vấn được ghi nhận, đánh giá sáu yếu tố câu chuyện, tham khảo đối thủ trong kết quả tìm kiếm và ba việc nên ưu tiên. Nếu chưa có website, Vexim đánh giá dấu vết số theo tên doanh nghiệp và kênh hiện có. Báo cáo do chuyên viên thực hiện, gửi trong 2 ngày làm việc qua kênh liên hệ đã cung cấp; kết quả là ảnh chụp tại thời điểm kiểm tra, không đại diện cho mọi câu trả lời AI.",
  },
  {
    question: "Thông tin tôi để lại có được bảo mật không?",
    answer:
      "Vexim sử dụng thông tin để thực hiện báo cáo và liên hệ trao đổi về yêu cầu của bạn, không bán hoặc chia sẻ cho đối tác tiếp thị. Hạ tầng lưu chuyển email được sử dụng để tiếp nhận yêu cầu. Không gửi mật khẩu, dữ liệu khách hàng hoặc hồ sơ mật qua form này; bạn có thể yêu cầu điều chỉnh hoặc xóa thông tin bằng cách liên hệ Vexim.",
  },
] as const
