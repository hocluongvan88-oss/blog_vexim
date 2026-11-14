/**
 * Nội dung định vị và phạm vi hợp tác của trang chủ.
 *
 * Vexim khởi đầu từ tư vấn tuân thủ xuất khẩu (FDA, GACC). Khi mảng đó bão hoà
 * và cạnh tranh bằng giá, Vexim chuyển sang giải quyết phần thiếu hụt lớn hơn:
 * doanh nghiệp Việt có hàng tốt nhưng phụ thuộc nền tảng thứ ba, không có kênh
 * riêng để người mua tự tìm hiểu, và luôn bị so giá với hàng nghìn nhà cung cấp
 * khác. Bốn phần dưới đây là bốn mảnh ghép của hướng đi mới.
 *
 * Ngôn từ: dùng đúng từ của người làm nghề xuất khẩu — hàng, mẫu, đơn, giá,
 * chứng từ, người mua, nhà máy. Không dùng từ nghề marketing (từ khoá, SEO,
 * lập chỉ mục, lưu lượng) vì người đọc không biết những từ đó.
 *
 * Không cam kết thứ hạng tìm kiếm, lượng hỏi hàng hay hợp đồng.
 */

export const HOME_POSITIONING = {
  headline: "Your own route to international buyers",
  description: "Vietnamese manufacturers rarely lose on product quality. They lose on being found: the listings that buyers read belong to marketplaces and foreign suppliers, the price gets pushed down, and nobody can tell which factory is behind a photo. Vexim builds the part exporters do not have — a B2B marketplace for Vietnamese goods, your own product website, buyer work in each market you sell to, and the monthly content work that keeps all of it current.",
  tradeUrl: "https://veximtrade.com",
} as const

export const EXPORT_PILLARS = [
  {
    id: "trade-platform", number: "01", label: "THE MARKETPLACE",
    title: "A B2B marketplace built around Vietnamese goods",
    description: "A buyer arrives looking for a product and a market, not a list of three thousand suppliers. Vexim Trade groups suppliers by what Vietnam actually produces well, so a buyer with a real order reaches your profile already knowing what you make.",
    features: [
      "Product groups built on Vietnam's strongest export lines.",
      "Supplier profiles organised by product, not ranked by the lowest offer.",
      "A short route from a product page to a conversation with the supplier.",
    ],
    output: "A place where the buyer comes to you on purpose.",
  },
  {
    id: "market-visibility", number: "02", label: "THE REACH",
    title: "Work in the markets you actually sell to",
    description: "A buyer in Ohio and a buyer in Osaka do not describe your product the same way, and they are not comparing you with the same suppliers. Treating every market as one campaign reaches none of them properly.",
    features: [
      "We read what buyers write and ask for in each market before writing anything.",
      "Product and company material aimed at the people who place orders.",
      "Reports that separate what we did from what came back.",
    ],
    output: "Fewer markets, entered properly.",
  },
  {
    id: "export-website", number: "03", label: "THE FOUNDATION",
    title: "A product website a buyer can order from",
    description: "A buyer needs specifications, minimum order, packaging, certificates, delivery time and a name to write to. Most factory sites publish a brochure. We build the working version: fast, in order, and easy to check.",
    features: [
      "Pages that open quickly on a buyer's phone abroad.",
      "Product sheets with MOQ, Incoterms 2020, packing and specifications.",
      "Factory records and certificates supplied and confirmed by your team.",
    ],
    output: "A page a buyer can check without writing to you first.",
  },
  {
    id: "content-operations", number: "04", label: "THE OPERATIONS",
    title: "Content and buyer-facing pages, kept up every month",
    description: "A website does not keep working because it is finished. Someone has to follow what buyers in each market are looking for, write it in their language, put it up on a schedule and check that buyers actually reach it. Most exporters have nobody doing this.",
    features: [
      "Topic plans per product group and per target market.",
      "Articles and product pages written on a monthly cycle.",
      "Monthly checks that the pages can be found, with a short report you can act on.",
    ],
    output: "Presence that builds instead of expiring.",
  },
] as const

/** Proposed engagement scopes; deliverables and marketplace terms require agreement. */
export const EXPORT_TIERS = [
  {
    id: "core", number: "01", name: "B2B Launchpad", audience: "Single core product line",
    label: "BUILD THE FOUNDATION",
    description: "For a factory that needs to stand on its own outside a marketplace before spending on reach.",
    features: [
      "Commercial product website and catalogue structure",
      "Buyer research for the core product group",
      "Vexim Trade supplier profile, subject to approval and agreed term",
    ],
  },
  {
    id: "growth", number: "02", name: "Global Growth Engine", audience: "Multi-category factories",
    label: "ADD MARKETS",
    description: "For a factory with several product lines where one market is no longer enough.",
    features: [
      "Multi-category catalogue and page structure",
      "Buyer and product work across priority markets",
      "Monthly content production and editorial work",
      "An inquiry flow that fits how your sales team already works",
    ],
  },
  {
    id: "enterprise", number: "03", name: "Enterprise Dominance", audience: "Large manufacturing groups",
    label: "OPERATE AT SCALE",
    description: "For groups that need a standing channel, not a project with an end date.",
    features: [
      "Website and catalogue structure for each business unit",
      "Product positioning and B2B communications planning",
      "Buyer data work where the sources and rights allow it",
      "Ongoing operations scoped by agreement",
    ],
  },
] as const

/**
 * Bản tiếng Việt — ngôn ngữ mặc định của site.
 *
 * Ngôn từ lấy từ cách nhà cung cấp nói với nhau: hàng, mẫu, đơn, giá, chứng từ,
 * người mua, nhà máy. Không dùng từ nghề marketing như "từ khoá", "SEO",
 * "lập chỉ mục", "lưu lượng" — người đọc không biết, và cũng không cần biết.
 */
export const HOME_POSITIONING_VI = {
  headline: "Con đường riêng để người mua quốc tế tìm thấy bạn",
  description: "Doanh nghiệp Việt thường không thua ở chất lượng hàng. Cái thiếu là chỗ để người mua tìm thấy: những trang người mua đọc đều thuộc về sàn và nhà cung cấp nước ngoài, giá thì bị kéo xuống, còn người mua thì không biết nhà máy nào đứng sau tấm ảnh. Vexim làm phần doanh nghiệp còn thiếu: một sàn B2B cho hàng Việt, một website sản phẩm của riêng doanh nghiệp, công việc với người mua ở từng thị trường bạn bán, và đội ngũ viết nội dung hằng tháng để mọi thứ không cũ đi.",
  tradeUrl: HOME_POSITIONING.tradeUrl,
} as const

export const EXPORT_PILLARS_VI = [
  {
    id: "trade-platform", number: "01", label: "SÀN B2B",
    title: "Sàn B2B xây quanh những mặt hàng Việt Nam làm tốt",
    description: "Người mua đến với một mặt hàng và một thị trường trong đầu, không phải với danh sách ba nghìn nhà cung cấp để lọc. Vexim Trade xếp nhà cung cấp theo đúng những nhóm hàng Việt Nam làm tốt, để người mua có đơn thật đến được hồ sơ của bạn và đã biết bạn làm gì.",
    features: [
      "Nhóm hàng xây theo những mặt hàng Việt Nam có thế mạnh xuất khẩu.",
      "Hồ sơ nhà cung cấp xếp theo mặt hàng, không xếp theo giá thấp nhất.",
      "Đường ngắn từ trang sản phẩm đến cuộc trao đổi với nhà cung cấp.",
    ],
    output: "Một nơi người mua chủ động tìm đến bạn.",
  },
  {
    id: "market-visibility", number: "02", label: "TIẾP CẬN THỊ TRƯỜNG",
    title: "Làm việc ở đúng những thị trường bạn bán",
    description: "Người mua ở Mỹ và người mua ở Nhật không gọi tên hàng của bạn giống nhau, và cũng không so bạn với cùng một nhóm nhà cung cấp. Làm một chiến dịch chung cho tất cả các thị trường thì không tới được thị trường nào đúng nghĩa.",
    features: [
      "Đọc cách người mua ở từng thị trường gọi tên và hỏi mua hàng trước khi viết.",
      "Nội dung sản phẩm và hồ sơ công ty nhắm đúng người đặt đơn.",
      "Báo cáo tách rõ việc đã làm và những gì quay lại.",
    ],
    output: "Đi ít thị trường nhưng đi đến nơi.",
  },
  {
    id: "export-website", number: "03", label: "WEBSITE SẢN PHẨM",
    title: "Website sản phẩm để người mua đặt được hàng",
    description: "Người mua cần thông số, số lượng đặt tối thiểu, quy cách đóng gói, chứng nhận, thời gian giao và tên người để viết thư. Phần lớn website nhà máy chỉ đăng brochure. Vexim làm bản dùng được cho mua bán: mở nhanh, có thứ tự, dễ đối chiếu.",
    features: [
      "Trang mở nhanh trên điện thoại của người mua ở nước ngoài.",
      "Bảng hàng kèm số lượng tối thiểu, Incoterms 2020, quy cách đóng gói và thông số.",
      "Hồ sơ nhà máy và chứng nhận do doanh nghiệp cung cấp, có xác nhận nội bộ.",
    ],
    output: "Một trang người mua tự xem được, không phải hỏi trước.",
  },
  {
    id: "content-operations", number: "04", label: "VẬN HÀNH",
    title: "Nội dung và trang bán hàng, cập nhật đều mỗi tháng",
    description: "Website không tự chạy được chỉ vì đã dựng xong. Phải có người theo dõi người mua ở từng thị trường đang tìm gì, viết bằng ngôn ngữ của họ, đăng đúng nhịp và kiểm tra xem người mua có thực sự tới được trang hay không. Phần lớn doanh nghiệp xuất khẩu không có người làm việc này.",
    features: [
      "Kế hoạch chủ đề theo từng nhóm hàng và từng thị trường mục tiêu.",
      "Bài viết và trang sản phẩm viết theo chu kỳ hằng tháng.",
      "Kiểm tra hằng tháng xem trang có được tìm thấy không, kèm báo cáo ngắn để làm tiếp.",
    ],
    output: "Hiện diện tích lại dần, không hết hạn sau mỗi chiến dịch.",
  },
] as const

/** The three engagement names remain product names, not translated guarantees. */
export const EXPORT_TIERS_VI = [
  {
    id: "core", number: "01", name: "B2B Launchpad", audience: "Một mặt hàng chủ lực",
    label: "DỰNG NỀN TẢNG",
    description: "Dành cho nhà máy cần có chỗ đứng đàng hoàng ngoài sàn trước khi chi tiền cho việc mở thị trường.",
    features: [
      "Website sản phẩm và cấu trúc danh mục hàng",
      "Tìm hiểu người mua cho nhóm hàng chính",
      "Dựng hồ sơ nhà cung cấp trên Vexim Trade, tùy duyệt và thời hạn thỏa thuận",
    ],
  },
  {
    id: "growth", number: "02", name: "Global Growth Engine", audience: "Nhà máy nhiều nhóm hàng",
    label: "MỞ THÊM THỊ TRƯỜNG",
    description: "Dành cho nhà máy đã có vài nhóm hàng và một thị trường không còn đủ chỗ tăng.",
    features: [
      "Danh mục và cấu trúc trang cho nhiều nhóm hàng",
      "Làm việc với người mua ở các thị trường trọng điểm",
      "Viết nội dung và vận hành biên tập hằng tháng",
      "Quy trình nhận yêu cầu khớp với cách đội bán hàng đang làm",
    ],
  },
  {
    id: "enterprise", number: "03", name: "Enterprise Dominance", audience: "Tập đoàn sản xuất quy mô lớn",
    label: "VẬN HÀNH Ở QUY MÔ",
    description: "Dành cho doanh nghiệp cần một kênh vận hành thường trực, không phải dự án có ngày kết thúc.",
    features: [
      "Website và danh mục riêng cho từng đơn vị",
      "Định vị mặt hàng và kế hoạch truyền thông B2B",
      "Khai thác dữ liệu người mua khi nguồn dữ liệu và quyền truy cập cho phép",
      "Vận hành liên tục theo phạm vi đã thỏa thuận",
    ],
  },
] as const
