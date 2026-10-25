/** Owner-approved copy revision, 25 October 2026. */
export const TRADE = {
  name: "Vexim Trade",
  path: "/services/export-sales",
  platform: "https://veximtrade.com",
  register: "https://veximtrade.com/supplier/register",
  organizationId: "https://veximtrade.com/#organization",
  title: "Đăng ký nhà cung cấp nông sản xuất khẩu | Vexim Trade",
  description:
    "Đưa hồ sơ doanh nghiệp nông sản Việt Nam đến người mua nước ngoài. Quy cách chuẩn ngành, xác minh từng bước, yêu cầu báo giá gửi thẳng đến doanh nghiệp.",
  h1: "Người mua đang tìm hàng Việt Nam. Hãy để họ tìm thấy doanh nghiệp bạn.",
  hero: "Vexim Trade giới thiệu nhà cung cấp nông sản Việt Nam đến người mua nước ngoài, với hồ sơ trình bày theo quy cách chuẩn ngành, xác minh rõ ràng, yêu cầu báo giá gửi thẳng đến doanh nghiệp.",
  legalName: "Công ty TNHH Vexim Global",
  address: {
    streetAddress: "Số 25/6/51 Ngoạ Long, Tây Tựu",
    addressLocality: "Bắc Từ Liêm",
    addressRegion: "Hà Nội",
    addressCountry: "VN",
  },
  phone: "+84373685634",
  email: "contact@veximglobal.com",
  updated: "2026-10-25",
  // Set only after the owner supplies confirmed public policy URLs.
  privacy: "",
  terms: "",
} as const

/** Add a public href only after the actual category URL is confirmed. One source for UI and schema. */
export const TRADE_CATEGORIES: readonly {
  key: string
  name: string
  exportTitle: string
  text: string
  specs: string
  href?: string
}[] = [
  {
    key: "cashew",
    name: "Hạt điều nhân",
    exportTitle: "Xuất khẩu hạt điều",
    text: "Phân hạng, cỡ hạt, quy cách đóng gói và sản lượng cung ứng, trình bày theo đúng cách buyer điều thường so sánh.",
    specs: "Phân hạng · Cỡ hạt · Đóng gói",
  },
  {
    key: "pepper",
    name: "Hồ tiêu",
    exportTitle: "Xuất khẩu hồ tiêu",
    text: "Chủng loại, dung trọng, độ ẩm và cách đóng bao, đủ để buyer đối chiếu ngay với yêu cầu của mình.",
    specs: "Chủng loại · Dung trọng · Độ ẩm",
  },
  {
    key: "spices",
    name: "Quế, hồi",
    exportTitle: "Xuất khẩu quế hồi",
    text: "Vùng nguyên liệu, dạng sản phẩm, quy cách và khả năng cung ứng thực tế của từng doanh nghiệp.",
    specs: "Nguồn gốc · Dạng sản phẩm · Quy cách",
  },
]
export function tradeCategorySummary() {
  const count = TRADE_CATEGORIES.length === 3 ? "ba" : String(TRADE_CATEGORIES.length)
  return `Đang mở ${count} danh mục: ${TRADE_CATEGORIES.map((category) => category.name.toLocaleLowerCase("vi")).join("; ")}.`
}
export function tradeCategoryHeading() {
  return "Mỗi ngành hàng, một bộ hồ sơ đúng chuẩn"
}
export function tradeOgDescription() {
  return `Hồ sơ nhà cung cấp trình bày theo cách người mua nước ngoài đọc và so sánh. ${tradeCategorySummary()}`
}
export const TRADE_PROBLEMS = [
  {
    title: "Thông tin thiếu cụ thể",
    text: "Một lời giới thiệu “hàng chất lượng cao” chưa giúp người mua biết sản phẩm có phù hợp hay không. Họ cần quy cách, khả năng cung ứng và đầu mối liên hệ rõ ràng.",
  },
  {
    title: "Người mua tìm trên Google",
    text: "Người mua quốc tế không biết doanh nghiệp của bạn là ai, điều đầu tiên họ sẽ tìm và kiểm tra nhà cung cấp qua google hay các công cụ tìm kiếm khác.",
  },
  {
    title: "Hồ sơ chuyên nghiệp",
    text: "Một hồ sơ chuyên nghiệp, dễ đọc và có thông tin cụ thể tạo điểm chạm để người mua tìm hiểu bạn. Không phải chỉ là lời hứa về thứ hạng tìm kiếm hay số đơn hàng.",
  },
] as const
export const TRADE_FEATURES = [
  {
    title: "Quy cách chuẩn ngành",
    text: "Mỗi danh mục có các trường thông tin phù hợp, giúp người mua đọc và so sánh sản phẩm trên cùng một cấu trúc.",
    icon: "specs",
  },
  {
    title: "Xác minh nhà cung cấp",
    text: "Giấy tờ, nhà máy và lịch sử giao hàng được đội ngũ kiểm duyệt. Đảm bảo tính minh bạch và chất lượng nhà cung cấp.",
    icon: "shield",
  },
  {
    title: "Biểu đồ thông tin mùa vụ",
    text: "Thông tin mùa vụ được cập nhật thường xuyên tới người mua hàng, thúc đẩy khả năng tạo ra doanh thu tối đa.",
    icon: "season",
  },
  {
    title: "RFQ gửi trực tiếp đến Supp",
    text: "Yêu cầu báo giá gửi thẳng đến doanh nghiệp. Bạn chủ động trao đổi quy cách, giá và điều kiện hợp tác với người mua.",
    icon: "mail",
  },
] as const
export const TRADE_VERIFICATION = [
  {
    title: "Giấy tờ doanh nghiệp",
    text: "Đối chiếu thông tin pháp nhân và giấy tờ doanh nghiệp cung cấp. Đây là bước kiểm tra danh tính nhà cung cấp.",
  },
  {
    title: "Xác minh nhà máy",
    text: "Ghi nhận cơ sở và hoạt động sản xuất qua việc thăm hoặc xác minh nhà máy, theo phạm vi được thống nhất.",
  },
  {
    title: "Lịch sử giao hàng",
    text: "Xem xét tài liệu giao hàng có thể đối chiếu, trong phạm vi doanh nghiệp được phép cung cấp. Tuyệt đối không công khai thông tin thương mại mật.",
  },
] as const
/** The unapproved third claim about selling rankings is intentionally absent. */
export const TRADE_COMMITMENTS = [
  {
    title: "Không hứa có đơn hàng",
    text: "Vexim Trade tạo nơi giới thiệu và kết nối. Quyết định mua bán phụ thuộc vào sản phẩm, nhu cầu và thỏa thuận giữa hai doanh nghiệp.",
  },
  {
    title: "Không thay bạn đàm phán",
    text: "Doanh nghiệp chủ động phản hồi yêu cầu báo giá, trao đổi với người mua và quyết định giá, điều kiện giao hàng, hợp đồng.",
  },
] as const
export const TRADE_STEPS = [
  { title: "Tạo tài khoản", text: "Bắt đầu tại trang đăng ký nhà cung cấp của Vexim Trade." },
  { title: "Hoàn thiện hồ sơ", text: "Điền thông tin doanh nghiệp, sản phẩm và quy cách theo danh mục." },
  { title: "Gửi để xem xét", text: "Cung cấp tài liệu phù hợp; từng bước xác minh được xét duyệt riêng." },
  {
    title: "Sẵn sàng trao đổi",
    text: "Sau khi hồ sơ được duyệt và công khai, chủ động phản hồi yêu cầu của người mua.",
  },
] as const

export function buildTradeOrganization(parentId: string) {
  return {
    "@type": "Organization",
    "@id": TRADE.organizationId,
    name: TRADE.name,
    url: `${TRADE.platform}/`,
    logo: `${parentId.split("/#")[0]}/trade/apple-touch-icon.png?v=vexim`,
    description: "Danh bạ nhà cung cấp nông sản Việt Nam dành cho người mua nước ngoài.",
    parentOrganization: { "@id": parentId },
    address: { "@type": "PostalAddress", ...TRADE.address },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: TRADE.phone,
      email: TRADE.email,
      contactType: "customer service",
      availableLanguage: ["vi", "en"],
    },
  }
}

/** Generic consultation card, not an additional confirmed product category. */
export const TRADE_OTHER_CATEGORY = {
  name: "Ngành hàng khác",
  text: "Chưa thấy ngành hàng của bạn? Cứ gửi đăng ký, đội ngũ Vexim Trade sẽ xem hồ sơ và trao đổi về mẫu thông tin phù hợp.",
  specs: "Liên hệ tư vấn",
} as const

export const TRADE_SECTIONS = {
  featureNote:
    "Hãy tiếp cận buyer bằng thông tin họ cần. Quy cách rõ ràng, nhà cung cấp đã được xác minh, mùa vụ cập nhật đều đặn. Buyer có thể gửi RFQ cho bạn ngay.",
  verificationTitle: "Ba bước xét duyệt nâng cao uy tín",
  verificationDescription:
    "Uy tín không nằm ở lời giới thiệu, mà ở những gì kiểm chứng được. Bước nào bạn hoàn thành, hồ sơ ghi nhận bước đó, để buyer yên tâm ngay từ lần đầu tìm hiểu.",
  categoryEyebrow: "Thế mạnh nông sản Việt Nam",
  categoryDescription:
    "Mỗi ngành hàng có mẫu hồ sơ riêng, theo đúng những thông số buyer quốc tế quen hỏi. Dưới đây là một số ngành hàng tiêu biểu, danh mục vẫn đang tiếp tục mở rộng.",
  closingTitle: "Sản phẩm bạn đã có. Giờ là lúc để buyer tìm thấy bạn.",
  closingDescription:
    "Tạo hồ sơ trên Vexim Trade, để quy cách và uy tín của doanh nghiệp tự lên tiếng với người mua quốc tế.",
} as const
