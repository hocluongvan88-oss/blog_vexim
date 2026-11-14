/**
 * Nội dung định vị và phạm vi hợp tác của trang chủ.
 *
 * Vexim khởi đầu từ tư vấn tuân thủ xuất khẩu (FDA, GACC). Khi mảng đó bão hoà
 * và cạnh tranh bằng giá, Vexim chuyển sang giải quyết phần thiếu hụt lớn hơn:
 * doanh nghiệp Việt có hàng tốt nhưng phụ thuộc nền tảng thứ ba, không có kênh
 * riêng để người mua tự tìm hiểu, và luôn bị so giá với hàng nghìn nhà cung cấp
 * khác. Bốn trụ cột dưới đây là bốn mảnh ghép của hướng đi mới.
 *
 * Không cam kết thứ hạng, lượng khách hàng tiềm năng hay kết quả hợp đồng.
 */

export const HOME_POSITIONING = {
  headline: "Your own route to international buyers",
  description: "Vietnamese manufacturers rarely lose on product quality. They lose on visibility: the searches go to marketplaces and foreign suppliers, the price gets negotiated down, and buyers never see the factory behind the listing. Vexim builds the channel that closes that gap — a B2B platform, your own commercial website, market-by-market search presence and the operational work that keeps it running.",
  tradeUrl: "https://veximtrade.com",
} as const

export const EXPORT_PILLARS = [
  {
    id: "trade-platform", number: "01", label: "THE MARKETPLACE",
    title: "A B2B platform built around Vietnamese strengths",
    description: "Buyers arrive with a market and a category in mind, not a list of 3,000 suppliers to filter. Vexim Trade organises supply around the categories Vietnam actually exports well, so a qualified buyer reaches your profile with context instead of price alone.",
    features: [
      "Category structure built on Vietnam's strongest export lines.",
      "Buyer profiles separated by product line, not by whoever bids lowest.",
      "A direct route from a product view to a supplier conversation.",
    ],
    output: "A place where your buyer can find you on purpose.",
  },
  {
    id: "market-visibility", number: "02", label: "THE REACH",
    title: "Presence in the markets you actually sell to",
    description: "Marketing that treats each market as a different job. Search demand, buying language and competitor set in the US differ from Germany, Japan or the Gulf; a single global campaign reaches none of them properly.",
    features: [
      "Market-by-market keyword and demand research before any content is written.",
      "Brand and product coverage aimed at the buyer roles that sign purchase orders.",
      "Reporting that separates what was done from what it produced.",
    ],
    output: "Fewer markets, entered properly.",
  },
  {
    id: "export-website", number: "03", label: "THE FOUNDATION",
    title: "A website that works like a trade document",
    description: "An export buyer needs specifications, MOQ, packaging, certifications, lead times and a named contact. Most manufacturer sites publish a brochure. We build the commercial version: fast, structured and easy to verify.",
    features: [
      "Static or server-rendered build, so pages load on a buyer's phone abroad.",
      "Catalogues with MOQ, Incoterms 2020, packaging and specification sheets.",
      "Factory credentials and documents supplied and confirmed by your team.",
    ],
    output: "A page a buyer can check without asking you first.",
  },
  {
    id: "content-operations", number: "04", label: "THE OPERATIONS",
    title: "Content and search work, run every month",
    description: "A website does not hold its position by existing. Someone has to research what buyers in each market type, write it in their language, publish it on schedule and watch what indexing actually does. That is the part most exporters do not have a team for.",
    features: [
      "Keyword coverage planned per category and per target market.",
      "Editorial writing and product content produced on a monthly cycle.",
      "Technical indexing checks and a standing report you can act on.",
    ],
    output: "Presence that compounds instead of expiring.",
  },
] as const

/** Proposed engagement scopes; deliverables and marketplace terms require agreement. */
export const EXPORT_TIERS = [
  {
    id: "core", number: "01", name: "B2B Launchpad", audience: "Single core product line",
    label: "BUILD THE FOUNDATION",
    description: "For a factory that needs to exist credibly outside a marketplace before spending on reach.",
    features: [
      "Commercial B2B website and catalogue structure",
      "Buyer-intent search groundwork for the core category",
      "Vexim Trade profile setup, subject to eligibility and agreed term",
    ],
  },
  {
    id: "growth", number: "02", name: "Global Growth Engine", audience: "Multi-category factories",
    label: "ADD MARKETS",
    description: "For a factory with several product lines where one market is no longer enough.",
    features: [
      "Multi-category catalogue and content architecture",
      "Market-by-market search coverage across priority regions",
      "Monthly content production and editorial operations",
      "Inquiry handling designed around your sales workflow",
    ],
  },
  {
    id: "enterprise", number: "03", name: "Enterprise Dominance", audience: "Large manufacturing groups",
    label: "OPERATE AT SCALE",
    description: "For groups that need a standing channel, not a project with an end date.",
    features: [
      "Custom web and catalogue infrastructure across business units",
      "Category search strategy and B2B communications planning",
      "Outbound data work where sources and access allow",
      "Ongoing operations scoped by agreement",
    ],
  },
] as const

/**
 * Bản tiếng Việt — ngôn ngữ mặc định của site.
 *
 * Giọng điệu: chuyên gia marketing thực chiến, nói thẳng vào vấn đề của doanh
 * nghiệp, không dùng từ hoa mỹ hay ký tự trang trí.
 */
export const HOME_POSITIONING_VI = {
  headline: "Con đường riêng để người mua quốc tế tìm thấy bạn",
  description: "Doanh nghiệp Việt thường không thua ở chất lượng hàng. Cái thiếu là khả năng được nhìn thấy: từ khoá rơi vào tay sàn thương mại và nhà cung cấp nước ngoài, giá thì bị ép, còn người mua thì không bao giờ nhìn thấy nhà máy đứng sau tấm ảnh trên sàn. Vexim làm phần còn thiếu đó, gồm bốn việc: một sàn B2B, một website thương mại của riêng doanh nghiệp, hiện diện tìm kiếm theo từng thị trường, và đội ngũ vận hành nội dung hằng tháng để những thứ trên không bị lỗi thời.",
  tradeUrl: HOME_POSITIONING.tradeUrl,
} as const

export const EXPORT_PILLARS_VI = [
  {
    id: "trade-platform", number: "01", label: "SÀN B2B",
    title: "Sàn B2B xây quanh ngành hàng mạnh của Việt Nam",
    description: "Người mua thường đến với một thị trường và một ngành hàng trong đầu, không phải với danh sách ba nghìn nhà cung cấp để lọc. Vexim Trade tổ chức nguồn cung theo đúng những ngành Việt Nam làm tốt, để người mua có nhu cầu thật đến được hồ sơ của bạn với đầy đủ bối cảnh, không chỉ còn mỗi giá.",
    features: [
      "Cấu trúc ngành hàng theo những nhóm sản phẩm Việt Nam có lợi thế xuất khẩu.",
      "Hồ sơ người mua đọc theo ngành hàng, không xếp chung theo giá thấp nhất.",
      "Đường đi thẳng từ trang sản phẩm đến cuộc trao đổi với nhà cung cấp.",
    ],
    output: "Một nơi người mua tìm đúng bạn, không phải tìm ra ai rẻ hơn.",
  },
  {
    id: "market-visibility", number: "02", label: "TIẾP CẬN THỊ TRƯỜNG",
    title: "Tiếp cận theo từng thị trường, không dàn trải toàn cầu",
    description: "Mỗi thị trường là một bài toán riêng. Nhu cầu tìm kiếm, cách người mua đặt từ khoá và đối thủ ở Mỹ khác Đức, khác Nhật, khác Trung Đông. Một chiến dịch chung cho tất cả các thị trường thì không tới được thị trường nào đúng nghĩa.",
    features: [
      "Nghiên cứu từ khoá và nhu cầu theo từng thị trường trước khi viết nội dung.",
      "Phủ sản phẩm và thương hiệu hướng tới đúng người có quyền quyết định mua.",
      "Báo cáo tách bạch giữa việc đã làm và kết quả thu về.",
    ],
    output: "Đi ít thị trường nhưng đi đến nơi.",
  },
  {
    id: "export-website", number: "03", label: "WEBSITE THƯƠNG MẠI",
    title: "Website chạy như một bộ chứng từ thương mại",
    description: "Người mua xuất khẩu cần thông số, MOQ, quy cách đóng gói, chứng nhận, thời gian giao và tên người phụ trách. Phần lớn website nhà máy chỉ đăng brochure. Vexim làm bản dùng được cho mua bán: nhanh, có cấu trúc, dễ đối chiếu.",
    features: [
      "Dựng tĩnh hoặc kết xuất phía máy chủ, để trang mở được trên điện thoại của người mua ở nước ngoài.",
      "Danh mục sản phẩm kèm MOQ, Incoterms 2020, quy cách đóng gói và tài liệu thông số.",
      "Hồ sơ nhà máy và chứng từ do doanh nghiệp cung cấp, có xác nhận nội bộ.",
    ],
    output: "Một trang người mua tự kiểm tra được mà không cần hỏi trước.",
  },
  {
    id: "content-operations", number: "04", label: "VẬN HÀNH",
    title: "Nội dung và công việc tìm kiếm, chạy đều hằng tháng",
    description: "Website không tự giữ được vị trí chỉ vì đã dựng xong. Phải có người nghiên cứu người mua ở từng thị trường đang tìm gì, viết bằng ngôn ngữ của họ, đăng đúng nhịp và theo dõi xem công cụ tìm kiếm thực sự ghi nhận được gì. Đây là phần mà hầu hết doanh nghiệp xuất khẩu không có người làm.",
    features: [
      "Phủ từ khoá theo từng nhóm sản phẩm và từng thị trường mục tiêu.",
      "Viết bài và nội dung sản phẩm theo chu kỳ hằng tháng.",
      "Kiểm tra kỹ thuật lập chỉ mục và báo cáo định kỳ, đọc được và làm được.",
    ],
    output: "Hiện diện tích luỹ dần, không hết hạn sau mỗi chiến dịch.",
  },
] as const

/** The three engagement names remain product names, not translated guarantees. */
export const EXPORT_TIERS_VI = [
  {
    id: "core", number: "01", name: "B2B Launchpad", audience: "Một dòng sản phẩm chủ lực",
    label: "DỰNG NỀN TẢNG",
    description: "Dành cho nhà máy cần có chỗ đứng đàng hoàng ngoài sàn thương mại trước khi chi tiền cho tiếp cận.",
    features: [
      "Website thương mại B2B và cấu trúc danh mục sản phẩm",
      "Nền tảng tìm kiếm theo nhu cầu người mua cho nhóm sản phẩm chính",
      "Thiết lập hồ sơ Vexim Trade, tùy điều kiện tham gia và thời hạn thỏa thuận",
    ],
  },
  {
    id: "growth", number: "02", name: "Global Growth Engine", audience: "Nhà máy nhiều danh mục",
    label: "MỞ THÊM THỊ TRƯỜNG",
    description: "Dành cho nhà máy đã có vài dòng sản phẩm và một thị trường không còn đủ chỗ tăng.",
    features: [
      "Cấu trúc danh mục và nội dung cho nhiều nhóm sản phẩm",
      "Phủ tìm kiếm theo từng thị trường trọng điểm",
      "Sản xuất nội dung và vận hành biên tập hằng tháng",
      "Quy trình tiếp nhận yêu cầu khớp với cách đội bán hàng đang làm",
    ],
  },
  {
    id: "enterprise", number: "03", name: "Enterprise Dominance", audience: "Tập đoàn sản xuất quy mô lớn",
    label: "VẬN HÀNH Ở QUY MÔ",
    description: "Dành cho doanh nghiệp cần một kênh vận hành thường trực, không phải dự án có ngày kết thúc.",
    features: [
      "Hạ tầng website và danh mục riêng cho từng đơn vị",
      "Chiến lược tìm kiếm theo ngành hàng và kế hoạch truyền thông B2B",
      "Khai thác dữ liệu người mua khi nguồn dữ liệu và quyền truy cập cho phép",
      "Vận hành liên tục theo phạm vi đã thỏa thuận",
    ],
  },
] as const
