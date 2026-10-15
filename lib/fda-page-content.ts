/** Page facts and copy shared by SSR content, metadata and JSON-LD. No invented rates or prices. */
export const FDA_PAGE = {
  path: "/services/fda",
  title: "Đăng ký FDA: Chi phí, hồ sơ & US Agent | Vexim Global",
  description:
    "Vexim Global tư vấn đăng ký FDA, DUNS và US Agent cho doanh nghiệp xuất khẩu Mỹ. Xem hồ sơ, chi phí, quy trình và nhận tư vấn miễn phí.",
  image: "/images/og-fda.png",
  imageAlt: "Đăng ký FDA, hồ sơ và US Agent cho hàng xuất khẩu Mỹ tại Vexim Global",
} as const

export const FDA_FAQS = [
  {
    question: "FDA là gì và tại sao doanh nghiệp Việt Nam cần đăng ký?",
    answer:
      "FDA là cơ quan quản lý thực phẩm và dược phẩm Hoa Kỳ. Cơ sở thực phẩm thuộc diện áp dụng phải đăng ký trước khi cung cấp thực phẩm cho thị trường Mỹ, trừ trường hợp được miễn. Mỹ phẩm, thiết bị y tế và dược phẩm có nghĩa vụ riêng. Đăng ký không đồng nghĩa FDA phê duyệt hoặc chứng nhận chất lượng sản phẩm.",
  },
  {
    question: "Thời gian đăng ký FDA mất bao lâu?",
    answer:
      "Thời gian phụ thuộc nhóm sản phẩm, tình trạng DUNS/UFI, xác nhận của US Agent và mức độ đầy đủ của hồ sơ. Vexim xác nhận lịch dự kiến sau khi rà soát thông tin; không áp dụng một cam kết 2–5 ngày cho mọi thủ tục. Thời gian bổ sung hồ sơ và phản hồi của cơ quan quản lý cần được tính riêng.",
  },
  {
    question: "Chi phí đăng ký FDA là bao nhiêu?",
    answer:
      "Chi phí dịch vụ được báo theo phạm vi: đăng ký cơ sở, hỗ trợ DUNS, US Agent, rà soát nhãn hoặc thủ tục bổ sung. FDA không thu phí đăng ký hoặc gia hạn cơ sở thực phẩm; phí tư vấn và US Agent là các khoản riêng. Các lĩnh vực khác cần đối chiếu mức phí theo quy định áp dụng. Vexim làm rõ các hạng mục trước khi thực hiện.",
  },
  {
    question: "Đăng ký FDA có thời hạn bao lâu và gia hạn thế nào?",
    answer:
      "Với cơ sở thực phẩm thuộc diện đăng ký, kỳ gia hạn diễn ra từ 01/10 đến 31/12 mỗi năm chẵn. Không mặc định đăng ký có hiệu lực tròn hai năm kể từ ngày cấp, và không áp dụng lịch này cho mọi lĩnh vực. FDA không cấp chứng nhận đăng ký cơ sở thực phẩm; giấy xác nhận của đơn vị dịch vụ, nếu có, phải ghi rõ chủ thể phát hành.",
  },
  {
    question: "Vexim Global có phải là đại lý chính thức của FDA không?",
    answer:
      "Vexim là đơn vị tư vấn và hỗ trợ thủ tục; không đại diện cho FDA và không được hiểu là được FDA chứng nhận hay bảo trợ. US Agent là đầu mối liên lạc tại Mỹ do cơ sở chỉ định. Việc có pháp nhân hoặc EIN tại Mỹ không đồng nghĩa FDA phê duyệt đơn vị dịch vụ. US Agent cũng khác với FSVP Importer hoặc nhà nhập khẩu đứng tên lô hàng.",
  },
  {
    question: "Tôi cần chuẩn bị những giấy tờ gì để đăng ký FDA?",
    answer:
      "Trước tiên cần tên và địa chỉ cơ sở, thông tin liên hệ, hoạt động sản xuất, nhóm sản phẩm và tình trạng đăng ký hiện có. Với cơ sở thực phẩm, cần đối chiếu DUNS/UFI và US Agent khi áp dụng. Vexim xác nhận danh sách tài liệu cụ thể sau khi phân loại sản phẩm; nhãn, thành phần và tài liệu kỹ thuật có thể cần cho các hạng mục riêng.",
  },
  {
    question: "Nếu hàng bị FDA giữ lại thì phải làm sao?",
    answer:
      "Cần thu thập thông báo của FDA, thông tin lô hàng và các hồ sơ liên quan, đồng thời phối hợp với nhà nhập khẩu và đơn vị khai báo để xác định lý do và thời hạn phản hồi. Vexim tiếp nhận thông tin để đánh giá phạm vi hỗ trợ. Không thể cam kết giải phóng hàng chỉ dựa vào số đăng ký FDA.",
  },
  {
    question: "Vexim Global hỗ trợ những loại sản phẩm nào?",
    answer:
      "Vexim tiếp nhận tư vấn cho thực phẩm, mỹ phẩm và các nhóm sản phẩm liên quan tới yêu cầu FDA. Phạm vi thực hiện được xác nhận sau khi đánh giá phân loại, công dụng và hồ sơ. MoCRA, FCE/SID, FSVP hay thủ tục thiết bị y tế không phải tên gọi thay thế cho Food Facility Registration và có thể cần quy trình riêng.",
  },
] as const

export const FDA_SOURCES = [
  {
    title: "Đăng ký cơ sở thực phẩm",
    url: "https://www.fda.gov/food/registration-food-facilities-and-other-submissions/online-registration-food-facilities",
  },
  {
    title: "Kỳ gia hạn đăng ký cơ sở thực phẩm",
    url: "https://www.fda.gov/food/online-registration-food-facilities/food-facility-registration-user-guide-biennial-registration-renewal",
  },
  {
    title: "Phí đăng ký và giấy xác nhận của đơn vị dịch vụ",
    url: "https://www.fda.gov/food/guidance-regulation-food-and-dietary-supplements/questions-regarding-whether-food-facilities-are-required-pay-registration-fees-and-private",
  },
  {
    title: "Phân biệt đăng ký với FDA phê duyệt",
    url: "https://www.fda.gov/consumers/consumer-updates/it-really-fda-approved",
  },
  {
    title: "Đăng ký và liệt kê mỹ phẩm theo MoCRA",
    url: "https://www.fda.gov/cosmetics/registration-listing-cosmetic-product-facilities-and-products",
  },
] as const

/** Public case, authorized by the owner. Images are deliberately omitted until uploaded. */
export const FDA_LIBRA_CASE = {
  company: "CÔNG TY TNHH LIBRA VIỆT NAM",
  product: "Bánh kẹo xuất khẩu sang Mỹ",
  summary:
    "Theo hồ sơ năng lực Vexim công bố, Vexim đã hỗ trợ CÔNG TY TNHH LIBRA VIỆT NAM rà soát thông tin, chuẩn bị hồ sơ và hoàn tất đăng ký cơ sở thực phẩm FDA phục vụ kế hoạch xuất khẩu bánh kẹo sang Mỹ.",
  note: "Thông tin trường hợp được dẫn từ hồ sơ năng lực của Vexim. Kết quả từng hồ sơ không phải cam kết về thời gian, phê duyệt sản phẩm hoặc thông quan cho mọi doanh nghiệp.",
} as const

/** Populate with approved local file paths after the owner uploads the real documents. */
export const FDA_LANDING_MEDIA: Record<string, string | null> = {
  registration: null,
  certificate: null,
  libraFactory: null,
  libraDossier: null,
  libraRegistration: null,
  libraShipment: null,
  partnerLibra: null,
  partnerGreenFoods: null,
  partnerBimiFoods: null,
  partnerDannFood: null,
  partnerPhamGia: null,
}

export const FDA_HERO_IMAGE = "/china-customs-port-container-shipping-trade.jpg"

export const FDA_PROBLEMS = [
  { problem: "Quy trình phức tạp, khó hiểu", solution: "Hướng dẫn rõ từng bước theo loại hồ sơ" },
  { problem: "Lo ngại rủi ro khi nhập khẩu", solution: "Rà soát thông tin và yêu cầu trước khi xuất hàng" },
  { problem: "Chưa xác định đầu mối tại Mỹ", solution: "Làm rõ vai trò và phạm vi hỗ trợ của US Agent" },
  { problem: "Chi phí chưa rõ, dễ phát sinh", solution: "Thống nhất hạng mục và phạm vi trong báo giá" },
  { problem: "Khó theo dõi sau đăng ký", solution: "Hỗ trợ cập nhật và nhắc lịch theo phạm vi hợp tác" },
  { problem: "Chưa chủ động kế hoạch xử lý", solution: "Xác nhận lịch dự kiến khi đã rà soát đủ thông tin" },
] as const

export const FDA_COMPARISON = [
  {
    label: "US Agent tại Mỹ",
    vexim: "Làm rõ đầu mối và phạm vi hỗ trợ",
    check: "Ai là đơn vị thực hiện, trách nhiệm cụ thể?",
  },
  {
    label: "Phạm vi công việc",
    vexim: "Xác nhận theo loại sản phẩm và hồ sơ",
    check: "Gói dịch vụ bao gồm và không bao gồm gì?",
  },
  {
    label: "Thời gian xử lý",
    vexim: "Thống nhất sau khi rà soát đủ dữ liệu",
    check: "Tính từ thời điểm nào, có điều kiện gì?",
  },
  {
    label: "Kết quả bàn giao",
    vexim: "Thông tin và xác nhận theo thủ tục áp dụng",
    check: "Đăng ký cơ sở hay thủ tục lưu hành sản phẩm?",
  },
  {
    label: "Hỗ trợ sau đăng ký",
    vexim: "Theo hạng mục và thời hạn hợp tác",
    check: "Ai hỗ trợ cập nhật, gia hạn hoặc phát sinh?",
  },
  {
    label: "Chi phí",
    vexim: "Báo giá theo phạm vi trước khi thực hiện",
    check: "Đã gồm US Agent, thuế và khoản bổ sung chưa?",
  },
] as const

export const FDA_LANDING_PROCESS = [
  {
    title: "Tư vấn",
    description: "Tiếp nhận thông tin cơ sở, sản phẩm và nhu cầu xuất khẩu.",
    note: "Xác định nhu cầu",
  },
  {
    title: "Chuẩn bị hồ sơ",
    description: "Đối chiếu dữ liệu và hướng dẫn tài liệu phù hợp với thủ tục.",
    note: "Rà soát thông tin",
  },
  {
    title: "Đăng ký với FDA",
    description: "Thực hiện hồ sơ theo hệ thống và phạm vi đã thống nhất.",
    note: "Theo dõi trạng thái",
  },
  {
    title: "Đối chiếu kết quả",
    description: "Kiểm tra thông tin hệ thống và xử lý yêu cầu bổ sung nếu có.",
    note: "Cập nhật tiến độ",
  },
  {
    title: "Bàn giao & Hỗ trợ",
    description: "Bàn giao thông tin đăng ký, hướng dẫn cập nhật và lịch gia hạn.",
    note: "Đồng hành sau đăng ký",
  },
] as const

export const FDA_LIBRA_STEPS = [
  {
    title: "Nhà máy / Xưởng sản xuất",
    subtitle: "CÔNG TY TNHH LIBRA VIỆT NAM",
    description:
      "Doanh nghiệp sản xuất bánh kẹo có nhu cầu chuẩn bị hồ sơ phục vụ kế hoạch xuất khẩu sang thị trường Mỹ.",
    media: "libraFactory",
    mediaLabel: "Tư liệu nhà máy Libra",
  },
  {
    title: "Vexim Global tiếp nhận",
    subtitle: "Tư vấn & Chuẩn bị hồ sơ",
    description:
      "Tiếp nhận thông tin, rà soát hồ sơ cơ sở và phối hợp chuẩn bị các dữ liệu cần thiết cho thủ tục đăng ký theo phạm vi hợp tác.",
    media: "libraDossier",
    mediaLabel: "Hồ sơ của doanh nghiệp",
  },
  {
    title: "Hoàn tất đăng ký cơ sở",
    subtitle: "Đối chiếu & Bàn giao thông tin",
    description:
      "Theo hồ sơ năng lực Vexim công bố, thủ tục đăng ký cơ sở thực phẩm đã được hoàn tất. Đây không phải FDA phê duyệt chất lượng sản phẩm.",
    media: "libraRegistration",
    mediaLabel: "Thông tin xác nhận đăng ký",
  },
  {
    title: "Đồng hành kế hoạch xuất khẩu",
    subtitle: "Hồ sơ và chứng từ liên quan",
    description:
      "Tham khảo tư liệu lô hàng đã được Vexim công bố trong trường hợp Libra. Kết quả của một doanh nghiệp không phải bảo đảm thông quan cho mọi lô hàng.",
    media: "libraShipment",
    mediaLabel: "Tư liệu vận chuyển Libra",
  },
] as const

export const FDA_PARTNERS = [
  { name: "Libra", media: "partnerLibra" },
  { name: "Green Foods", media: "partnerGreenFoods" },
  { name: "BimiFoods", media: "partnerBimiFoods" },
  { name: "Dann Food", media: "partnerDannFood" },
  { name: "Pham Gia", media: "partnerPhamGia" },
] as const
