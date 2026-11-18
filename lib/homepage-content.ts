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
 * Văn phong học từ Agentcy: câu ngắn có nhịp, nhưng KHÔNG khô. Bốn thiết bị
 * dùng đều tay:
 *   1. Con số cụ thể làm điểm tựa: "ba nghìn", "sáu thứ", "một bước", "hai cột".
 *   2. Vật cụ thể có tên: pallet, Incoterms 2020, tờ khai, tên người để viết thư.
 *   3. Cặp đối lập: "Hàng không thiếu. Đường đến người mua mới thiếu."
 *   4. Ba nhịp liên tiếp: "Cùng kiểu ảnh. Cùng mức đặt tối thiểu. Giá thấp hơn một chút."
 *
 * Và một thứ nữa Agentcy làm rất giỏi: tự nói ra giới hạn của mình.
 * "Trước đó thì không." / "Không có lựa chọn thứ ba."
 *
 * Từ vựng vẫn là của nhà cung cấp: hàng, đơn, mẫu, giá, chứng từ, nhà máy.
 * Không dùng từ khoá, SEO, lập chỉ mục, lưu lượng, thứ hạng.
 */
export const HOME_POSITIONING_VI = {
  headline: "Hàng tốt chưa đủ. Người mua phải tìm thấy bạn.",
  description: "Doanh nghiệp Việt hiếm khi thua ở chất lượng. Thua ở chỗ người mua không tìm ra mình. Trên sàn, ba nghìn nhà cung cấp chen nhau bằng một tấm ảnh, và người mua chỉ còn một thứ để so. Vexim giữ bốn việc: sàn B2B Vexim Trade, website sản phẩm của riêng bạn, tiếp cận người mua ở từng thị trường, và nội dung ra đều mỗi tháng.",
  tradeUrl: HOME_POSITIONING.tradeUrl,
} as const

export const EXPORT_PILLARS_VI = [
  {
    id: "trade-platform", number: "01", label: "SÀN B2B",
    title: "Sàn B2B xây quanh hàng Việt Nam làm tốt",
    description: "Người mua đến với một mặt hàng trong đầu. Không phải danh sách ba nghìn nhà cung cấp để lọc. Vexim Trade xếp nhà cung cấp theo nhóm hàng Việt Nam làm tốt, nên người mua có đơn thật tới thẳng hồ sơ của bạn.",
    features: [
      "Ngành hàng chia theo thứ Việt Nam làm tốt nhất, không dàn đều.",
      "Hồ sơ xếp theo mặt hàng. Không xếp theo giá thấp nhất.",
      "Từ trang sản phẩm tới chỗ trao đổi: một bước.",
    ],
    output: "Người mua chủ động tìm đến bạn.",
  },
  {
    id: "market-visibility", number: "02", label: "TIẾP CẬN THỊ TRƯỜNG",
    title: "Làm việc ở đúng thị trường bạn bán",
    description: "Người mua ở Ohio và người mua ở Osaka không gọi tên hàng của bạn giống nhau. Họ cũng không so bạn với cùng một nhóm nhà cung cấp. Một chiến dịch cho tất cả các thị trường thì không tới được thị trường nào.",
    features: [
      "Đọc cách người mua ở từng nơi gọi tên hàng trước khi viết một chữ.",
      "Nội dung nhắm người đặt đơn, không nhắm người đọc cho vui.",
      "Báo cáo hai cột: việc đã làm, và những gì quay lại.",
    ],
    output: "Đi ít thị trường, đi đến nơi.",
  },
  {
    id: "export-website", number: "03", label: "WEBSITE SẢN PHẨM",
    title: "Website sản phẩm để người mua đặt được hàng",
    description: "Người mua cần sáu thứ: thông số, số lượng tối thiểu, quy cách đóng gói, chứng nhận, thời gian giao, và tên một người để viết thư. Phần lớn website nhà máy chỉ đăng brochure.",
    features: [
      "Mở nhanh trên điện thoại người mua, kể cả khi mạng yếu.",
      "Bảng hàng kèm số lượng tối thiểu, Incoterms 2020, quy cách đóng gói.",
      "Hồ sơ nhà máy và chứng nhận do bạn cung cấp. Chúng tôi xác nhận nội bộ.",
    ],
    output: "Người mua tự xem được, không phải hỏi trước.",
  },
  {
    id: "content-operations", number: "04", label: "VẬN HÀNH",
    title: "Nội dung và trang bán hàng, ra đều mỗi tháng",
    description: "Website không tự chạy vì đã dựng xong. Mỗi tháng phải có người xem người mua đang tìm gì, viết, đăng, rồi kiểm tra xem có ai tới thật không. Hầu hết doanh nghiệp xuất khẩu không có ai làm việc này.",
    features: [
      "Chủ đề chốt trước tháng, theo nhóm hàng và thị trường.",
      "Bài viết và trang sản phẩm ra đều, không dồn một cục.",
      "Kiểm tra hằng tháng xem trang có được tìm thấy không. Báo cáo gọn một trang.",
    ],
    output: "Hiện diện tích lại dần. Không hết hạn sau mỗi chiến dịch.",
  },
] as const

/** The three engagement names remain product names, not translated guarantees. */
export const EXPORT_TIERS_VI = [
  {
    id: "core", number: "01", name: "B2B Launchpad", audience: "Một mặt hàng chủ lực",
    label: "DỰNG NỀN TẢNG",
    description: "Cho nhà máy cần đứng được ngoài sàn trước khi chi tiền mở thị trường.",
    features: [
      "Website sản phẩm và cấu trúc danh mục hàng",
      "Tìm hiểu người mua cho nhóm hàng chính",
      "Hồ sơ nhà cung cấp trên Vexim Trade, tùy duyệt và thời hạn thỏa thuận",
    ],
  },
  {
    id: "growth", number: "02", name: "Global Growth Engine", audience: "Nhà máy nhiều nhóm hàng",
    label: "MỞ THÊM THỊ TRƯỜNG",
    description: "Cho nhà máy đã có vài nhóm hàng và một thị trường không còn đủ chỗ tăng.",
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
    description: "Cho doanh nghiệp cần một kênh chạy thường trực, không phải dự án có ngày kết thúc.",
    features: [
      "Website và danh mục riêng cho từng đơn vị",
      "Định vị mặt hàng và kế hoạch truyền thông B2B",
      "Khai thác dữ liệu người mua khi nguồn và quyền truy cập cho phép",
      "Vận hành liên tục theo phạm vi đã thỏa thuận",
    ],
  },
] as const
