/** Shared by the visible landing page and its Service graph. These are services,
 * not a catalogue of food products or packages with promised results. */
export const HOME_HERO = {
  vi: {
    badge: "Xúc tiến xuất khẩu ngành thực phẩm",
    lead: "Tìm khách hàng nhập khẩu cho",
    accent: "doanh nghiệp thực phẩm Việt Nam",
    description:
      "Vexim Global kết hợp sàn B2B Vexim Trade, SEO quốc tế và thiết kế website xuất khẩu để nhà nhập khẩu tìm thấy doanh nghiệp, xem hồ sơ năng lực và gửi yêu cầu báo giá trực tiếp.",
    register: "Mở gian hàng miễn phí",
    consult: "Tư vấn SEO quốc tế",
    signals: ["Sàn B2B chuyên ngành", "Hiển thị trên Google và AI", "Báo cáo theo yêu cầu báo giá"],
  },
  en: {
    badge: "Trade promotion for food exporters",
    lead: "Connect with food importers",
    accent: "looking for suppliers in Vietnam",
    description:
      "Vexim Global brings together the Vexim Trade B2B marketplace, international SEO and export websites. Help buyers find your business, review your capabilities and request a quote directly.",
    register: "Open a free storefront",
    consult: "Discuss international SEO",
    signals: ["Specialist B2B marketplace", "Google and AI search", "Reporting on quote requests"],
  },
} as const

export const HOME_SOLUTIONS = {
  vi: [
    {
      id: "trade",
      label: "Sàn B2B",
      name: "Vexim Trade",
      description:
        "Gian hàng B2B dành cho doanh nghiệp thực phẩm Việt Nam. Nhà nhập khẩu xem hồ sơ, đối chiếu năng lực cung ứng và gửi yêu cầu báo giá thẳng đến doanh nghiệp.",
    },
    {
      id: "seo",
      label: "SEO & GEO",
      name: "SEO quốc tế",
      description: "Đưa thông tin nhà cung cấp đến đúng thị trường qua Google và các công cụ tìm kiếm có hỗ trợ AI.",
    },
    {
      id: "website",
      label: "Website",
      name: "Website xuất khẩu",
      description: "Hồ sơ năng lực đa ngôn ngữ, trình bày nhà máy, chứng nhận và đầu mối nhận báo giá rõ ràng.",
    },
  ],
  en: [
    {
      id: "trade",
      label: "B2B marketplace",
      name: "Vexim Trade",
      description:
        "A storefront for Vietnam’s food exporters. Importers can review your profile, compare supply capabilities and send quote requests straight to your team.",
    },
    {
      id: "seo",
      label: "SEO & GEO",
      name: "International SEO",
      description:
        "Help buyers in your target markets discover accurate supplier information on Google and AI search tools.",
    },
    {
      id: "website",
      label: "Web design",
      name: "Export websites",
      description:
        "A multilingual company profile with factory credentials, current documentation and a clear route to a quote.",
    },
  ],
} as const

export type HomeSolutionId = (typeof HOME_SOLUTIONS.vi)[number]["id"]
