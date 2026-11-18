/**
 * Nội dung trang tổng quan (hub) — tiếng Việt.
 *
 * Quy tắc của trang này: nó KHÔNG kể hết câu chuyện. Nó chia nhánh.
 * Mỗi khối là một tiêu đề, một dòng, một mũi tên. Người đọc bấm sang
 * trang con để lấy chi tiết. Toàn trang dưới 60 từ phần thân ngoài tiêu đề.
 *
 * Giọng Agentcy: câu ngắn, cặp đối lập, số cụ thể, tự cắt ý.
 * Từ vựng: hàng, đơn, mẫu, giá, chứng từ, nhà máy. Không từ khoá/SEO.
 *
 * Đường dẫn trong FILE NÀY PHẢI TRỎ TỚI TRANG CÓ THẬT. Danh sách trang con
 * được kiểm bằng `node scripts/verify-hub-links.mjs`.
 */

export type HubCard = {
  /** Số thứ tự hiển thị, dạng "01". */
  number: string
  /** Nhãn nhóm, chữ hoa, dùng cho cả tiêu đề trang con. */
  label: string
  title: string
  /** Một dòng. Không quá 14 từ. */
  line: string
  href: string
  /** true: mở tab mới, có icon ↗. Dùng cho veximtrade.com. */
  external?: boolean
  cta: string
}

export const VI_HUB = {
  hero: {
    eyebrow: "VEXIM GLOBAL · KÊNH BÁN XUẤT KHẨU",
    titleBefore: "Hàng tốt chưa đủ.",
    titleAccent: "Người mua phải tìm thấy bạn.",
    line: "Bốn việc, làm cùng nhau, cho nhà sản xuất Việt Nam bán ra nước ngoài.",
    primary: "Yêu cầu trao đổi",
    secondary: "Xem bốn việc",
    secondaryHref: "#works",
    indexLabel: "Mục lục trang",
    index: [
      { number: "01", label: "Bốn việc Vexim làm", href: "#works" },
      { number: "02", label: "Phạm vi hợp tác", href: "#scope" },
      { number: "03", label: "Dịch vụ tuân thủ", href: "#compliance" },
      { number: "04", label: "Liên hệ", href: "#contact" },
    ],
  },

  /** Bốn trụ cột — mỗi thẻ là một cửa vào landing page con. */
  worksLabel: "01 / VEXIM LÀM GÌ",
  worksTitle: "Bốn việc. Bốn trang.",
  worksHint: "Bấm vào từng việc để xem chi tiết.",
  works: [
    {
      number: "01", label: "SÀN B2B", title: "Vexim Trade",
      line: "Người mua có sẵn đơn tìm tới hồ sơ nhà máy.",
      href: "https://veximtrade.com", external: true, cta: "Mở Vexim Trade",
    },
    {
      number: "02", label: "TIẾP CẬN THỊ TRƯỜNG", title: "Người mua ở từng thị trường",
      line: "Đọc cách họ gọi tên hàng trước khi viết một chữ.",
      href: "/services/export-delegation", cta: "Xem cách làm",
    },
    {
      number: "03", label: "WEBSITE SẢN PHẨM", title: "Trang để người mua đặt được hàng",
      line: "Sáu thứ người mua cần. Phần lớn website chỉ có brochure.",
      href: "/services/export-sales", cta: "Xem cấu trúc trang",
    },
    {
      number: "04", label: "DỊCH VỤ XUẤT KHẨU", title: "Chứng từ và thủ tục",
      line: "Uỷ thác xuất nhập khẩu, giấy phép nước nhập khẩu.",
      href: "/services/export-delegation", cta: "Xem dịch vụ",
    },
  ] satisfies readonly HubCard[],

  /** Ba phạm vi hợp tác — vẫn là ba thẻ, nhưng gọn. */
  scopeLabel: "02 / PHẠM VI HỢP TÁC",
  scopeTitle: "Chốt thị trường trước.",
  scopeLine: "Rồi mới chốt khối lượng việc.",
  scope: [
    { name: "B2B Launchpad", for: "Một mặt hàng chủ lực", id: "core" },
    { name: "Global Growth Engine", for: "Nhiều nhóm hàng, nhiều thị trường", id: "growth" },
    { name: "Enterprise Dominance", for: "Tập đoàn sản xuất quy mô lớn", id: "enterprise" },
  ] as const,
  scopeCta: "Trao đổi về phạm vi này",

  /** Tuân thủ — vẫn là bốn lối vào, xếp hai cột, không kể lể. */
  complianceLabel: "03 / TUÂN THỦ",
  complianceTitle: "Nghề gốc của Vexim.",
  complianceLine: "Bốn dịch vụ, do đúng đội ngũ làm hai mươi năm nay.",
  complianceLinks: [
    { name: "FDA", note: "Đăng ký cơ sở, nhãn, US Agent", href: "/services/fda" },
    { name: "GACC", note: "Mã xuất khẩu vào Trung Quốc", href: "/services/gacc" },
    { name: "MoCRA", note: "Mỹ phẩm vào thị trường Mỹ", href: "/services/cosmetics/mocra-registration" },
    { name: "US Agent", note: "Đại diện pháp lý tại Mỹ", href: "/services/us-agent" },
  ],

  /** Dải kết — một dòng, một nút. */
  ctaTitle: "Hàng của bạn không có lỗi.",
  ctaAccent: "Đường tới người mua mới có lỗi.",
  ctaLine: "Cho chúng tôi biết bạn bán gì và muốn vào đâu.",
  ctaButton: "Yêu cầu trao đổi",

  /** Thanh ngành hàng chạy dưới hero. */
  marquee: ["Cà phê", "Hạt điều", "Gia vị", "Hoa hồi", "Quế", "Tiêu đen", "Trà", "Gạo", "Thuỷ sản", "Đồ thủ công"],
} as const

export const VI_HUB_META = {
  title: "Kênh bán xuất khẩu cho nhà sản xuất Việt Nam | Vexim Global",
  description: "Bốn việc Vexim làm cho nhà sản xuất Việt Nam: sàn B2B Vexim Trade, tiếp cận người mua theo thị trường, website sản phẩm, và dịch vụ xuất khẩu.",
} as const
