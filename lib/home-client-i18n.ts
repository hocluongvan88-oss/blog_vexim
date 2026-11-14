/** Small client-only dictionary: navigation and audit form. The larger landing
 * page translations stay in the server bundle instead of shipping to browsers. */
export const HOME_CLIENT_MESSAGES = {
  en: {
    brandTagline: "EXPORT SALES CHANNEL",
    nav: { main: "Main navigation", mobile: "Mobile navigation", open: "Open navigation", close: "Close navigation", solutions: "Solutions", why: "Why Vexim", engagements: "Engagements", contact: "Contact", trade: "Vexim Trade", tradeEcosystem: "Vexim Trade ecosystem", audit: "Talk to us" },
    language: { choose: "Choose language", english: "English", vietnamese: "Tiếng Việt" },
    audit: {
      defaultButton: "Talk to us", eyebrow: "YOUR NEXT EXPORT MARKET", title: "Tell us what you sell and where.",
      description: "Send us your website and the markets you are going after. We will write back to your business email and say what we see.",
      selected: "Selected scope:", sent: "Your request has been sent. Vexim Global can reply to the business email you provided.",
      website: "Website URL", websiteHint: "https://yourcompany.com", company: "Company name", companyHint: "Your manufacturing company",
      markets: "Target export markets", marketsHint: "e.g. United States, Japan, EU", email: "Business email", emailHint: "name@company.com",
      note: "Sent to Vexim Global by email. Nothing is checked automatically and no result is promised.",
      busy: "Sending request…", submit: "Send request", unavailable: "Online submission is unavailable. Please send the email draft instead.",
      network: "We could not reach the server. Please send the email draft instead.",
      alternative: "Alternative: send from your email app.", alternativeInfo: "Open the draft, review it and press send. If the email app does not open, copy the details and email", openDraft: "Open email draft ↗", copied: "Details copied", copy: "Copy request details", copyUnavailable: "Copy unavailable. Please email", direct: "Prefer a direct conversation?",
      draftSubject: "Export channel request — Vexim Global", draftGreeting: "Hello Vexim Global,", draftIntro: "I would like to talk about selling into new markets.",
      draftWebsite: "Website:", draftCompany: "Company:", draftMarkets: "Target export markets:", draftEmail: "My business email:", draftScope: "Service scope:", draftClosing: "Please reply to discuss the next steps.",
    },
  },
  vi: {
    brandTagline: "KÊNH BÁN HÀNG XUẤT KHẨU",
    nav: { main: "Điều hướng chính", mobile: "Điều hướng di động", open: "Mở điều hướng", close: "Đóng điều hướng", solutions: "Giải pháp", why: "Vì sao chọn Vexim", engagements: "Phạm vi hợp tác", contact: "Liên hệ", trade: "Vexim Trade", tradeEcosystem: "Hệ sinh thái Vexim Trade", audit: "Yêu cầu đánh giá" },
    language: { choose: "Chọn ngôn ngữ", english: "English", vietnamese: "Tiếng Việt" },
    audit: {
      defaultButton: "Yêu cầu trao đổi", eyebrow: "THỊ TRƯỜNG TIẾP THEO CỦA BẠN", title: "Cho chúng tôi biết bạn bán gì, bán ở đâu.",
      description: "Gửi website và những thị trường bạn đang nhắm tới. Vexim Global sẽ viết lại qua email công việc và nói rõ chúng tôi thấy gì.",
      selected: "Phạm vi đã chọn:", sent: "Yêu cầu của bạn đã được gửi. Vexim Global có thể phản hồi qua email công việc bạn cung cấp.",
      website: "URL website", websiteHint: "https://congtycuaban.vn", company: "Tên công ty", companyHint: "Doanh nghiệp sản xuất của bạn",
      markets: "Thị trường xuất khẩu mục tiêu", marketsHint: "Ví dụ: Mỹ, Nhật Bản, EU", email: "Email công việc", emailHint: "ten@congty.vn",
      note: "Thông tin được gửi đến Vexim Global qua email. Không có gì được kiểm tra tự động và không cam kết kết quả.",
      busy: "Đang gửi yêu cầu…", submit: "Gửi yêu cầu", unavailable: "Chưa thể gửi trực tuyến. Bạn có thể gửi bản nháp qua ứng dụng email.",
      network: "Không thể kết nối máy chủ. Bạn có thể gửi bản nháp qua ứng dụng email.",
      alternative: "Cách khác: gửi bằng ứng dụng email.", alternativeInfo: "Mở bản nháp, kiểm tra thông tin rồi gửi. Nếu ứng dụng email không mở, hãy sao chép nội dung và gửi đến", openDraft: "Mở bản nháp email ↗", copied: "Đã sao chép thông tin", copy: "Sao chép nội dung", copyUnavailable: "Không thể sao chép. Vui lòng gửi email đến", direct: "Bạn muốn trao đổi trực tiếp?",
      draftSubject: "Yêu cầu trao đổi về kênh bán xuất khẩu — Vexim Global", draftGreeting: "Xin chào Vexim Global,", draftIntro: "Tôi muốn trao đổi về việc bán hàng vào thị trường mới.",
      draftWebsite: "Website:", draftCompany: "Công ty:", draftMarkets: "Thị trường xuất khẩu mục tiêu:", draftEmail: "Email liên hệ:", draftScope: "Phạm vi dịch vụ:", draftClosing: "Vui lòng phản hồi để trao đổi bước tiếp theo.",
    },
  },
} as const

export const VI_AUDIT_ERRORS: Record<string, string> = {
  "Please provide a valid request.": "Vui lòng cung cấp thông tin yêu cầu hợp lệ.",
  "Please enter a complete website URL.": "Vui lòng nhập URL website đầy đủ.",
  "Please enter a complete HTTP or HTTPS website URL.": "Vui lòng nhập URL website bắt đầu bằng http:// hoặc https://.",
  "Please enter a company name (up to 160 characters).": "Vui lòng nhập tên công ty (tối đa 160 ký tự).",
  "Please enter target export markets (up to 300 characters).": "Vui lòng nhập thị trường xuất khẩu mục tiêu (tối đa 300 ký tự).",
  "Please enter a valid business email.": "Vui lòng nhập email công việc hợp lệ.",
  "Please select a valid service scope.": "Vui lòng chọn phạm vi dịch vụ hợp lệ.",
}
