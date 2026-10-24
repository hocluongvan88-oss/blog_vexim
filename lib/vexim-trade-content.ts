/** Copy and launch configuration. Missing design copy is an editorial draft for owner review. */
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
  hero: "Vexim Trade giới thiệu nhà cung cấp nông sản Việt Nam đến người mua nước ngoài, với hồ sơ trình bày theo cách người mua đọc và so sánh: quy cách chuẩn ngành, xác minh rõ ràng, yêu cầu báo giá gửi thẳng đến doanh nghiệp.",
  legalName: "Công ty TNHH Vexim Global",
  address: {
    streetAddress: "Số 25/6/51 Ngõa Long, Tây Tựu",
    addressLocality: "Bắc Từ Liêm",
    addressRegion: "Hà Nội",
    addressCountry: "VN",
  },
  phone: "+84373685634",
  email: "contact@veximglobal.com",
  updated: "2026-10-24",
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
    text: "Hồ sơ dành cho doanh nghiệp xuất khẩu hạt điều, trình bày rõ phân hạng, quy cách và khả năng cung ứng.",
    specs: "Phân hạng · Cỡ hạt · Đóng gói",
  },
  {
    key: "pepper",
    name: "Hồ tiêu",
    exportTitle: "Xuất khẩu hồ tiêu",
    text: "Thông tin phục vụ xuất khẩu hồ tiêu: chủng loại, dung trọng, độ ẩm và phương án đóng gói để người mua đối chiếu.",
    specs: "Chủng loại · Dung trọng · Độ ẩm",
  },
  {
    key: "spices",
    name: "Quế, hồi",
    exportTitle: "Xuất khẩu quế hồi",
    text: "Hồ sơ xuất khẩu quế hồi thể hiện nguồn gốc, dạng sản phẩm, quy cách và điều kiện cung ứng thực tế.",
    specs: "Nguồn gốc · Dạng sản phẩm · Quy cách",
  },
]
export function tradeCategorySummary() {
  const count = TRADE_CATEGORIES.length === 3 ? "ba" : String(TRADE_CATEGORIES.length)
  return `Đang mở ${count} danh mục: ${TRADE_CATEGORIES.map((category) => category.name.toLocaleLowerCase("vi")).join("; ")}.`
}
export function tradeCategoryHeading() {
  return `${TRADE_CATEGORIES.length === 3 ? "Ba" : TRADE_CATEGORIES.length} danh mục, số chỗ có hạn`
}
export function tradeOgDescription() {
  return `Hồ sơ nhà cung cấp trình bày theo cách người mua nước ngoài đọc và so sánh. ${tradeCategorySummary()}`
}
export const TRADE_PROBLEMS = [
  {
    title: "Thông tin thiếu cụ thể",
    text: "Một lời giới thiệu “hàng chất lượng cao” chưa giúp người mua biết sản phẩm có phù hợp không. Họ cần quy cách, khả năng cung ứng và đầu mối liên hệ rõ ràng.",
  },
  {
    title: "Người mua tìm trên Google",
    text: "Khi tìm người mua nước ngoài, doanh nghiệp cũng cần nghĩ về chiều ngược lại: người mua có thể tìm và kiểm tra nhà cung cấp qua công cụ tìm kiếm.",
  },
  {
    title: "Hồ sơ cần có mặt ở đó",
    text: "Một hồ sơ công khai, dễ đọc và có thông tin cụ thể tạo thêm điểm chạm để người mua tìm hiểu bạn. Không phải lời hứa về thứ hạng tìm kiếm hay số đơn hàng.",
  },
] as const
export const TRADE_FEATURES = [
  {
    title: "Quy cách chuẩn ngành",
    text: "Mỗi danh mục có các trường thông tin phù hợp, giúp người mua đọc và so sánh sản phẩm trên cùng một cấu trúc.",
    icon: "specs",
  },
  {
    title: "Xác minh từng bước",
    text: "Giấy tờ, nhà máy và lịch sử giao hàng được xem xét riêng. Hồ sơ thể hiện rõ bước nào đã được duyệt.",
    icon: "shield",
  },
  {
    title: "Hiển thị công bằng",
    text: "Thông tin nhà cung cấp được trình bày theo cùng một cấu trúc, để người mua đối chiếu năng lực và mức độ phù hợp.",
    icon: "compare",
  },
  {
    title: "Báo giá gửi thẳng",
    text: "Yêu cầu báo giá đi thẳng đến doanh nghiệp. Bạn chủ động trao đổi quy cách, giá và điều kiện hợp tác với người mua.",
    icon: "mail",
  },
] as const
export const TRADE_VERIFICATION = [
  {
    title: "Giấy tờ doanh nghiệp",
    text: "Đối chiếu thông tin pháp nhân và giấy tờ doanh nghiệp cung cấp. Đây là bước kiểm tra danh tính nhà cung cấp.",
  },
  {
    title: "Thăm nhà máy",
    text: "Ghi nhận cơ sở và hoạt động sản xuất qua việc thăm nhà máy, theo phạm vi được thống nhất. Kết quả của bước này được duyệt riêng.",
  },
  {
    title: "Lịch sử giao hàng",
    text: "Xem xét tài liệu giao hàng có thể đối chiếu, trong phạm vi doanh nghiệp được phép cung cấp. Không công bố thông tin thương mại mật.",
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
    logo: `${parentId.split("/#")[0]}/trade/logo.svg`,
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
