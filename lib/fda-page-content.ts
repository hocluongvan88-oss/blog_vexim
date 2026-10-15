/** Page facts and copy shared by SSR content, metadata and JSON-LD. No invented rates or prices. */
export const FDA_PAGE = {
  path: "/services/fda",
  title: "Đăng ký FDA: Chi phí, hồ sơ & US Agent | Vexim Global",
  description: "Vexim Global tư vấn đăng ký FDA, DUNS và US Agent cho doanh nghiệp xuất khẩu Mỹ. Xem hồ sơ, chi phí, quy trình và nhận tư vấn miễn phí.",
  image: "/images/og-fda.png",
  imageAlt: "Đăng ký FDA, hồ sơ và US Agent cho hàng xuất khẩu Mỹ tại Vexim Global",
} as const

export const FDA_FAQS = [
  {
    question: "Đăng ký FDA mất bao lâu?",
    answer: "Thời gian phụ thuộc vào nhóm sản phẩm, tình trạng DUNS/UFI, việc xác nhận của US Agent và mức độ đầy đủ của hồ sơ. Vexim xác nhận lịch dự kiến sau khi rà soát thông tin. Không áp dụng một cam kết 2–5 ngày cho mọi thủ tục; thời gian bổ sung hồ sơ và phản hồi từ cơ quan quản lý cần được tính riêng.",
  },
  {
    question: "Chi phí đăng ký FDA gồm những khoản nào?",
    answer: "Chi phí dịch vụ được báo theo phạm vi công việc: đăng ký cơ sở, hỗ trợ DUNS, US Agent, rà soát nhãn hoặc thủ tục bổ sung nếu cần. FDA không thu phí đăng ký hoặc gia hạn cơ sở thực phẩm; phí dịch vụ của Vexim và phí US Agent là các khoản riêng. Mức phí của lĩnh vực khác phải được đối chiếu riêng, không suy ra từ đăng ký thực phẩm.",
  },
  {
    question: "Doanh nghiệp Việt Nam có cần US Agent không?",
    answer: "Cơ sở thực phẩm ở ngoài Hoa Kỳ thuộc diện phải đăng ký cần chỉ định US Agent theo quy định FDA. US Agent là đầu mối liên lạc với FDA, không đồng nghĩa được FDA chứng nhận hoặc bảo lãnh chất lượng sản phẩm. Vai trò US Agent cũng khác FSVP Importer và nhà nhập khẩu đứng tên lô hàng.",
  },
  {
    question: "Đăng ký cơ sở thực phẩm FDA gia hạn khi nào?",
    answer: "Cơ sở thực phẩm thuộc diện đăng ký phải gia hạn trong khoảng 01/10 đến 31/12 của mỗi năm chẵn. Mốc này không có nghĩa mọi đăng ký đều có hiệu lực tròn hai năm kể từ ngày cấp và không áp dụng chung cho mỹ phẩm, thiết bị y tế hay dược phẩm.",
  },
  {
    question: "Đăng ký FDA có phải là phê duyệt hoặc chứng nhận chất lượng không?",
    answer: "Không. Đăng ký cơ sở thực phẩm không phải FDA phê duyệt chất lượng cơ sở hoặc sản phẩm. FDA không cấp chứng nhận đăng ký cơ sở thực phẩm. Giấy xác nhận do đơn vị dịch vụ phát hành, nếu có, phải ghi rõ đơn vị phát hành và không được trình bày như chứng nhận do FDA cấp.",
  },
  {
    question: "Food Facility Registration khác FCE/SID như thế nào?",
    answer: "Food Facility Registration là thủ tục đăng ký cơ sở thực phẩm. FCE/SID liên quan đến đăng ký cơ sở và hồ sơ quy trình chế biến đối với một số thực phẩm đóng hộp ít axit hoặc thực phẩm axit hóa thuộc diện áp dụng. Không phải mọi thực phẩm đều cần FCE/SID; cần rà soát loại sản phẩm, quy trình và điều kiện bảo quản để xác định nghĩa vụ riêng.",
  },
] as const

export const FDA_PRODUCT_GROUPS = [
  {
    title: "Thực phẩm & Đồ uống",
    description: "Xác định nghĩa vụ Food Facility Registration, DUNS/UFI và US Agent; rà soát Prior Notice và FSVP theo từng trường hợp. Có các trường hợp miễn đăng ký cần xem xét riêng.",
    items: ["Thực phẩm chế biến", "Thực phẩm bổ sung", "Đồ uống", "Thực phẩm đông lạnh"],
    path: "/services/food/fda-registration",
    anchor: "Đăng ký cơ sở thực phẩm FDA",
  },
  {
    title: "Mỹ phẩm & Chăm sóc cá nhân",
    description: "Rà soát phân loại sản phẩm và nghĩa vụ theo MoCRA. Đăng ký cơ sở và liệt kê sản phẩm mỹ phẩm khác với đăng ký cơ sở thực phẩm; có trường hợp được miễn theo quy định.",
    items: ["Mỹ phẩm trang điểm", "Sản phẩm chăm sóc da", "Dầu gội & sữa tắm", "Nước hoa"],
    path: "/services/cosmetics/mocra-registration",
    anchor: "Đăng ký cơ sở và sản phẩm mỹ phẩm theo MoCRA",
  },
  {
    title: "Thiết bị y tế",
    description: "Cần xác định phân loại, mục đích sử dụng và yêu cầu lưu hành trước khi chốt phạm vi hỗ trợ. Đăng ký và liệt kê không thay thế thủ tục clearance hoặc approval nếu sản phẩm thuộc diện áp dụng.",
    items: ["Phân loại thiết bị", "Mục đích sử dụng", "Nghĩa vụ đăng ký và liệt kê", "Yêu cầu trước khi lưu hành"],
  },
  {
    title: "Dược phẩm",
    description: "Đánh giá theo thành phần, công dụng và cách ghi nhãn. Không mặc định vitamin, thảo dược hoặc sản phẩm bổ sung đều là thuốc; nghĩa vụ được xác định theo phân loại thực tế.",
    items: ["Phân loại sản phẩm", "Thành phần và công dụng", "Nội dung ghi nhãn", "Phạm vi thủ tục cần đánh giá"],
  },
  {
    title: "Thực phẩm động vật",
    description: "Rà soát nghĩa vụ đăng ký cơ sở thực phẩm cho người hoặc động vật theo hoạt động của cơ sở, đồng thời xem xét yêu cầu riêng đối với nguyên liệu và sản phẩm.",
    items: ["Thức ăn cho thú cưng", "Thức ăn chăn nuôi", "Thức ăn thủy sản", "Nguyên liệu và phụ gia"],
    path: "/services/food/fda-registration",
    anchor: "Tìm hiểu nghĩa vụ đăng ký cơ sở thực phẩm",
  },
  {
    title: "Vật liệu tiếp xúc thực phẩm",
    description: "Xem xét vật liệu, thành phần và điều kiện tiếp xúc thực phẩm. Không phải mọi bao bì hoặc dụng cụ đều thực hiện Food Facility Registration như cơ sở sản xuất thực phẩm.",
    items: ["Bao bì thực phẩm", "Hộp và chai lọ", "Màng bọc", "Dụng cụ tiếp xúc thực phẩm"],
  },
] as const

export const FDA_PROCESS = [
  { title: "Tư vấn & Đánh giá sơ bộ", duration: "Sau khi tiếp nhận yêu cầu", description: "Xác định loại sản phẩm, hoạt động của cơ sở và thủ tục phù hợp. Phân biệt đăng ký cơ sở, liệt kê sản phẩm và các yêu cầu liên quan trước khi báo phạm vi công việc." },
  { title: "Chuẩn bị hồ sơ đầy đủ", duration: "Phụ thuộc tài liệu doanh nghiệp", description: "Rà soát tên, địa chỉ cơ sở, thông tin liên hệ, DUNS/UFI nếu áp dụng và thông tin US Agent. Đối chiếu các dữ liệu trước khi nộp để hạn chế sai lệch." },
  { title: "Nộp hồ sơ lên hệ thống FDA", duration: "Theo lịch thống nhất sau rà soát", description: "Thực hiện theo hệ thống và biểu mẫu áp dụng cho từng thủ tục. Theo dõi trạng thái và trao đổi với doanh nghiệp nếu cần xác nhận hoặc bổ sung thông tin." },
  { title: "Đối chiếu kết quả đăng ký", duration: "Khi hệ thống ghi nhận kết quả", description: "Bàn giao thông tin và xác nhận đăng ký theo phạm vi dịch vụ. Việc có số đăng ký không đồng nghĩa FDA phê duyệt sản phẩm, không tự bảo đảm thông quan và không phải yêu cầu chung phải in số trên nhãn." },
  { title: "Hỗ trợ gia hạn & Cập nhật", duration: "Theo phạm vi hợp tác", description: "Với cơ sở thực phẩm thuộc diện đăng ký, kỳ gia hạn diễn ra từ 01/10 đến 31/12 năm chẵn. Các lĩnh vực khác có yêu cầu riêng; việc cập nhật thông tin và dịch vụ US Agent được thống nhất theo hợp đồng." },
] as const

export const FDA_REQUIREMENTS = [
  { type: "Cơ sở thực phẩm", documents: "Tên và địa chỉ cơ sở, hoạt động sản xuất, DUNS/UFI, thông tin liên hệ và US Agent.", agent: "Cơ sở ngoài Mỹ thuộc diện đăng ký cần US Agent.", timing: "Xác nhận sau khi rà soát DUNS/UFI và hồ sơ đầy đủ." },
  { type: "Mỹ phẩm theo MoCRA", documents: "Thông tin cơ sở, sản phẩm, nhãn và Responsible Person theo nghĩa vụ áp dụng.", agent: "US Agent cho cơ sở nước ngoài thuộc diện đăng ký; không đồng nhất với Responsible Person.", timing: "Phụ thuộc đăng ký cơ sở, liệt kê sản phẩm và trường hợp miễn." },
  { type: "Các nhóm sản phẩm khác", documents: "Thông tin thành phần, mục đích sử dụng, nhãn và tài liệu kỹ thuật theo sản phẩm.", agent: "Xác định theo lĩnh vực và thủ tục cụ thể.", timing: "Cần đánh giá phạm vi riêng; không áp dụng lịch chung của thực phẩm." },
] as const

export const FDA_SOURCES = [
  { title: "Đăng ký cơ sở thực phẩm", url: "https://www.fda.gov/food/registration-food-facilities-and-other-submissions/online-registration-food-facilities" },
  { title: "Kỳ gia hạn đăng ký cơ sở thực phẩm", url: "https://www.fda.gov/food/online-registration-food-facilities/food-facility-registration-user-guide-biennial-registration-renewal" },
  { title: "Phí đăng ký và giấy xác nhận của đơn vị dịch vụ", url: "https://www.fda.gov/food/guidance-regulation-food-and-dietary-supplements/questions-regarding-whether-food-facilities-are-required-pay-registration-fees-and-private" },
  { title: "Phân biệt đăng ký với FDA phê duyệt", url: "https://www.fda.gov/consumers/consumer-updates/it-really-fda-approved" },
  { title: "Đăng ký và liệt kê mỹ phẩm theo MoCRA", url: "https://www.fda.gov/cosmetics/registration-listing-cosmetic-product-facilities-and-products" },
] as const

/** Public case, authorized by the owner. Images are deliberately omitted until uploaded. */
export const FDA_LIBRA_CASE = {
  company: "CÔNG TY TNHH LIBRA VIỆT NAM",
  product: "Bánh kẹo xuất khẩu sang Mỹ",
  summary: "Theo hồ sơ năng lực Vexim công bố, Vexim đã hỗ trợ CÔNG TY TNHH LIBRA VIỆT NAM rà soát thông tin, chuẩn bị hồ sơ và hoàn tất đăng ký cơ sở thực phẩm FDA phục vụ kế hoạch xuất khẩu bánh kẹo sang Mỹ.",
  note: "Thông tin trường hợp được dẫn từ hồ sơ năng lực của Vexim. Kết quả từng hồ sơ không phải cam kết về thời gian, phê duyệt sản phẩm hoặc thông quan cho mọi doanh nghiệp.",
} as const
