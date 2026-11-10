/** Homepage positioning and proposed scopes. No unsupported rankings or outcomes. */
export const HOME_POSITIONING = {
  headline: "Global B2B Digital Infrastructure & Export Acceleration",
  description: "We empower Vietnamese manufacturers to build world-class official digital foundations, become easier to discover through buyer-intent search, and connect with the Vexim Trade ecosystem.",
  tradeUrl: "https://veximtrade.com",
} as const

export const EXPORT_PILLARS = [
  {
    id: "export-architecture", number: "01", label: "THE FOUNDATION", title: "B2B Export Web Architecture",
    description: "A fast, credible home for your products and the details international buyers need to verify your business.",
    features: [
      "High-speed static / SSR architecture for an official B2B website.",
      "Structured catalogs with MOQ, Incoterms 2020 and specifications.",
      "Factory credentials and spec sheets supplied and verified by your team.",
    ],
    output: "Own your digital foundation.",
  },
  {
    id: "buyer-intent-seo", number: "02", label: "THE DISCOVERY ENGINE", title: "Global Buyer-Intent SEO",
    description: "Make your product categories useful for the commercial searches procurement teams actually make.",
    features: [
      "Query mapping for bulk supply, OEM sourcing and FOB searches.",
      "Market-specific content planning for the US, EU and Middle East.",
      "Technical indexing and reporting with a clear source and timeframe.",
    ],
    output: "Be ready when buyers search.",
  },
  {
    id: "trade-sync", number: "03", label: "THE CONNECTION LAYER", title: "Vexim Trade Platform Integration",
    description: "Connect an independent export website with a relevant marketplace presence and a clearer inquiry pathway.",
    features: [
      "Listing support and cross-linking, subject to platform eligibility.",
      "Inquiry routing designed around your sales team's workflow.",
      "Outbound data matching only where platform access and scope allow.",
    ],
    output: "Connect discovery to conversation.",
  },
] as const

/** Proposed engagement scopes; deliverables and marketplace terms require agreement. */
export const EXPORT_TIERS = [
  {
    id: "core", number: "01", name: "B2B Launchpad", audience: "Single core product line", label: "BUILD THE FOUNDATION",
    description: "A focused digital export starting point for one product line.",
    features: [
      "B2B website infrastructure and catalog setup",
      "Core category buyer-intent SEO",
      "Vexim Trade listing support, subject to eligibility and agreed term",
    ],
  },
  {
    id: "growth", number: "02", name: "Global Growth Engine", audience: "Multi-category factories", label: "CONNECT THE PORTFOLIO",
    description: "An ongoing search, content and inquiry operation across a broader catalog.",
    features: [
      "Multi-category catalog architecture",
      "Multi-region buyer-intent SEO",
      "Monthly B2B content operations",
      "Inbound inquiry optimization",
    ],
  },
  {
    id: "enterprise", number: "03", name: "Enterprise Dominance", audience: "Large manufacturing groups", label: "OPERATE AT SCALE",
    description: "A tailored export agency retainer aligned with your product and market complexity.",
    features: [
      "Custom web and catalog infrastructure",
      "Category SEO and digital B2B PR planning",
      "Outbound data matching where available",
      "Ongoing operations scoped by agreement",
    ],
  },
] as const

/** Vietnamese editorial copy. Keep the approved English landing and service identities unchanged. */
export const HOME_POSITIONING_VI = {
  headline: "Hạ tầng số B2B toàn cầu & Tăng tốc xuất khẩu",
  description: "Vexim Global hỗ trợ nhà sản xuất Việt Nam xây dựng hiện diện số chính thức, tổ chức nội dung theo nhu cầu tìm kiếm của người mua và kết nối với hệ sinh thái Vexim Trade.",
  tradeUrl: HOME_POSITIONING.tradeUrl,
} as const

export const EXPORT_PILLARS_VI = [
  {
    id: "export-architecture", number: "01", label: "NỀN TẢNG", title: "Kiến trúc website B2B xuất khẩu",
    description: "Một kênh chính thức, dễ sử dụng để giới thiệu sản phẩm và thông tin mà người mua quốc tế cần để tìm hiểu doanh nghiệp.",
    features: [
      "Website B2B tối ưu tốc độ, sử dụng kiến trúc tĩnh hoặc kết xuất phía máy chủ.",
      "Danh mục sản phẩm có cấu trúc với MOQ, Incoterms 2020 và thông số kỹ thuật.",
      "Thông tin nhà máy và tài liệu sản phẩm do doanh nghiệp cung cấp, xác minh.",
    ],
    output: "Sở hữu nền tảng số của riêng bạn.",
  },
  {
    id: "buyer-intent-seo", number: "02", label: "KHẢ NĂNG ĐƯỢC TÌM THẤY", title: "SEO theo nhu cầu người mua",
    description: "Xây dựng nội dung danh mục hữu ích cho những truy vấn thương mại mà đội ngũ thu mua có thể sử dụng.",
    features: [
      "Lập bản đồ truy vấn về nguồn cung số lượng lớn, gia công OEM và điều kiện FOB.",
      "Lập kế hoạch nội dung theo thị trường Mỹ, EU và Trung Đông.",
      "Theo dõi khả năng lập chỉ mục và báo cáo có nguồn dữ liệu, mốc thời gian rõ ràng.",
    ],
    output: "Sẵn sàng khi người mua tìm kiếm.",
  },
  {
    id: "trade-sync", number: "03", label: "KẾT NỐI", title: "Kết nối nền tảng Vexim Trade",
    description: "Liên kết website xuất khẩu độc lập với sự hiện diện phù hợp trên nền tảng và lộ trình tiếp nhận yêu cầu rõ ràng hơn.",
    features: [
      "Hỗ trợ danh bạ và liên kết chéo, tùy điều kiện tham gia của nền tảng.",
      "Thiết kế luồng tiếp nhận yêu cầu phù hợp với quy trình bán hàng của bạn.",
      "Đối chiếu dữ liệu đầu ra khi phạm vi và quyền truy cập nền tảng cho phép.",
    ],
    output: "Từ tìm kiếm đến trao đổi trực tiếp.",
  },
] as const

/** The three engagement names remain product names, not translated guarantees. */
export const EXPORT_TIERS_VI = [
  {
    id: "core", number: "01", name: "B2B Launchpad", audience: "Một dòng sản phẩm chủ lực", label: "XÂY NỀN TẢNG",
    description: "Bước khởi đầu tập trung cho một dòng sản phẩm xuất khẩu.",
    features: [
      "Xây dựng website B2B và danh mục sản phẩm",
      "SEO theo nhu cầu người mua cho nhóm sản phẩm chính",
      "Hỗ trợ danh bạ Vexim Trade tùy điều kiện tham gia và thời hạn thỏa thuận",
    ],
  },
  {
    id: "growth", number: "02", name: "Global Growth Engine", audience: "Nhà máy có nhiều danh mục", label: "KẾT NỐI DANH MỤC",
    description: "Vận hành nội dung, tìm kiếm và tiếp nhận yêu cầu cho danh mục sản phẩm rộng hơn.",
    features: [
      "Kiến trúc danh mục nhiều nhóm sản phẩm",
      "SEO theo nhu cầu người mua ở nhiều thị trường",
      "Vận hành nội dung B2B hằng tháng",
      "Cải thiện lộ trình tiếp nhận yêu cầu",
    ],
  },
  {
    id: "enterprise", number: "03", name: "Enterprise Dominance", audience: "Nhóm doanh nghiệp sản xuất quy mô lớn", label: "VẬN HÀNH Ở QUY MÔ LỚN",
    description: "Phạm vi hợp tác theo nhu cầu sản phẩm và thị trường của từng doanh nghiệp.",
    features: [
      "Hạ tầng website và danh mục tùy chỉnh",
      "Lập kế hoạch SEO danh mục và truyền thông B2B",
      "Đối chiếu dữ liệu đầu ra khi có nguồn phù hợp",
      "Vận hành liên tục theo phạm vi đã thỏa thuận",
    ],
  },
] as const
