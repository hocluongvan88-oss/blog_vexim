/**
 * Hồ sơ doanh nghiệp Vexim Global — NGUỒN DUY NHẤT cho NAP + schema.
 *
 * Vì sao file này tồn tại: trước khi sửa, thông tin doanh nghiệp bị chép tay ở
 * nhiều nơi và LỆCH NHAU, khiến schema khai sai sự thật — lỗi nặng nhất về
 * E-E-A-T vì Google đối chiếu schema với nội dung hiển thị trên trang:
 *
 *   - `app/page.tsx` khai `telephone: "+84-xxx-xxx-xxx"` (giá trị placeholder
 *     bị lộ ra ngoài production).
 *   - `app/layout.tsx` + `app/page.tsx` khai addressLocality "Hồ Chí Minh"
 *     trong khi footer hiển thị "25/6/51 Ngọa Long, Tây Tựu, Hà Nội".
 *   - `app/page.tsx` khai giờ làm việc T2–T6 08:00–17:00, footer ghi 8:00–18:00
 *     và có thêm Thứ 7 — schema thiếu hẳn Thứ 7.
 *   - `logo` khai width/height 512x512 nhưng file `public/logo.png` là 824x543.
 *   - geo khai toạ độ TP.HCM (10.8231, 106.6297) cho một địa chỉ ở Hà Nội.
 *
 * Từ nay sửa một chỗ là footer, schema, email và sitemap dùng theo.
 *
 * ⚠️ HAI GIÁ TRỊ CẦN DOANH NGHIỆP XÁC NHẬN (đang để nguyên như cũ, chưa tự đổi):
 *   1. `SOCIAL_PROFILES.facebook` / `.linkedin` — hai URL này chỉ xuất hiện trong
 *      schema chứ không có ở bất kỳ chỗ nào khác trên site, và icon mạng xã hội ở
 *      footer vẫn trỏ `href="#"`. Rất có thể là URL tạm. Hãy thay bằng profile thật
 *      (hoặc bỏ khỏi `sameAs`) — `sameAs` trỏ tới trang không tồn tại là tín hiệu xấu.
 *   2. `ADDRESS` — đang lấy đúng theo footer. Nếu Vexim có văn phòng ở TP.HCM thì
 *      khai cả hai bằng `MULTIPLE_LOCATIONS`.
 */

import { VEXIM_PHONE, VEXIM_PHONE_DISPLAY } from "./contact-info"

/** Domain chính thức (bản CÓ www). Bản không-www được 301 về đây — xem `next.config.mjs`. */
export const SITE_URL = "https://www.veximglobal.com"

/**
 * `SITE_URL` + "/" ở cuối — dạng URL của TRANG CHỦ dùng cho sitemap/og:url.
 *
 * ⚠️ ĐÃ KIỂM CHỨNG: Next.js KHÔNG THỂ xuất canonical dạng ".../" cho trang chủ.
 * Trong `next/dist/lib/metadata/resolvers/resolve-url.js`, hàm
 * `resolveAbsoluteUrlWithPathname()` có dòng:
 *
 *     resolvedUrl = result.pathname === '/' ? result.origin : result.href
 *
 * tức là khi pathname là "/" nó trả về origin (đã bỏ "/"), và chỉ gắn lại "/" nếu
 * bật `trailingSlash: true` toàn site. Bật `trailingSlash` sẽ 308 MỌI URL trong site
 * (thêm một hop redirect cho hàng chục trang dịch vụ) chỉ để đổi một dấu "/", nên
 * ở đây chọn cách rẻ hơn: giữ `trailingSlash: false` và dùng DẠNG KHÔNG-CÓ-"/"
 * một cách NHẤT QUÁN cho canonical + og:url + sitemap của trang chủ.
 *
 * Yêu cầu thật của audit là "thống nhất một dạng", không phải bắt buộc phải có "/".
 * Nếu sau này muốn đổi sang dạng có "/", việc cần làm là:
 *   1. bật `trailingSlash: true` trong next.config.mjs,
 *   2. đổi giá trị dưới đây thành `${SITE_URL}/`,
 *   3. submit lại sitemap trong Search Console.
 */
export const SITE_URL_WITH_SLASH = `${SITE_URL}/`

export const ORGANIZATION_ID = `${SITE_URL}/#organization`
export const WEBSITE_ID = `${SITE_URL}/#website`
export const LOGO_ID = `${SITE_URL}/#logo`
/** Node dịch vụ ở trang chủ (ProfessionalService) */
export const HOME_SERVICE_ID = `${SITE_URL}/#service`

export const ORGANIZATION_NAME = "Vexim Global"

/** Số điện thoại dạng quốc tế E.164 — bắt buộc cho schema `telephone`. */
export const PHONE_E164 = "+84373685634"

/** Email công khai. Footer + email nội bộ (`app/api/gacc/submit`) đang dùng đuôi .vn */
export const PUBLIC_EMAIL = "contact@veximglobal.vn"

/** Địa chỉ hiển thị công khai (khớp 1:1 với footer). */
export const ADDRESS = {
  streetAddress: "25/6/51 Ngọa Long, Tây Tựu",
  addressLocality: "Hà Nội",
  addressCountry: "VN",
} as const

/**
 * Logo — width/height phải là kích thước THẬT của file, không phải số tròn cho đẹp.
 * `public/logo.png` đo được 824x543 (kiểm bằng cách đọc IHDR của file PNG).
 */
export const LOGO = {
  url: `${SITE_URL}/logo.png`,
  width: 824,
  height: 543,
} as const

export const OG_IMAGE = {
  url: `${SITE_URL}/og-image.jpg`,
  width: 1200,
  height: 630,
} as const

/**
 * Giờ làm việc — NGUỒN DUY NHẤT cho cả footer lẫn `openingHoursSpecification`.
 * `opens`/`closes` theo định dạng HH:MM mà schema.org yêu cầu.
 */
export const OPENING_HOURS = [
  { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "18:00" },
  { days: ["Saturday"], opens: "08:00", closes: "12:00" },
] as const

/** Chuỗi hiển thị cho footer, sinh từ `OPENING_HOURS` để không thể lệch nhau. */
export const OPENING_HOURS_LABELS: string[] = [
  "Thứ 2 - Thứ 6: 8:00 - 18:00",
  "Thứ 7: 8:00 - 12:00",
  "Chủ nhật: Nghỉ",
]

/** Thị trường phục vụ — dùng cho `areaServed`. */
export const AREA_SERVED = ["VN", "US"] as const

/**
 * Kênh chính thức cho `sameAs`.
 * ⚠️ Facebook/LinkedIn CHƯA được xác minh — xem ghi chú ở đầu file.
 * Zalo là link thật (sinh từ hotline trong `lib/contact-info.ts`).
 */
export const SOCIAL_PROFILES = {
  facebook: "https://www.facebook.com/veximglobal",
  linkedin: "https://www.linkedin.com/company/veximglobal",
  zalo: `https://zalo.me/${VEXIM_PHONE}`,
} as const

export const SAME_AS: string[] = [
  SOCIAL_PROFILES.facebook,
  SOCIAL_PROFILES.linkedin,
  SOCIAL_PROFILES.zalo,
  /** Trang hồ sơ năng lực (chứng nhận đã cấp, case study) — bằng chứng E-E-A-T. */
  "https://fda.veximglobal.com",
]

/** Ngôn ngữ hỗ trợ khách hàng. */
export const AVAILABLE_LANGUAGES = ["Vietnamese", "English"] as const

/**
 * Một dịch vụ trong danh mục.
 *
 * `id` dùng làm `@id` của node `Service` — trang chủ liệt kê trong `hasOfferCatalog`,
 * còn landing page của chính dịch vụ đó phát ra node cùng `@id`. Nhờ trùng `@id`,
 * Google gộp được hai node thành MỘT thực thể thay vì coi là hai dịch vụ khác nhau.
 *
 * `anchor` là text link có chứa từ khóa, thay cho "Tìm hiểu thêm" chung chung
 * (anchor chung chung không truyền ngữ cảnh cho trang đích).
 */
export interface ServiceCatalogItem {
  /** Khóa nội bộ, đồng thời là slug của `@id` */
  key: string
  /** Tên dịch vụ hiển thị */
  name: string
  /** Giá trị cho `serviceType` */
  serviceType: string
  /** Mô tả ngắn cho schema */
  description: string
  /** URL landing page (tương đối) */
  path: string
  /** Anchor text chứa từ khóa cho link ở trang chủ */
  anchor: string
}

export const SERVICE_CATALOG: ServiceCatalogItem[] = [
  {
    key: "fda-registration",
    name: "Đăng ký FDA & DUNS",
    serviceType: "FDA Food Facility Registration & DUNS",
    description:
      "Đăng ký mã DUNS (UFI) và Food Facility Registration với FDA cho doanh nghiệp Việt xuất khẩu thực phẩm sang Mỹ, kèm gia hạn định kỳ 2 năm.",
    path: "/services/fda",
    anchor: "Dịch vụ đăng ký FDA cho doanh nghiệp Việt",
  },
  {
    key: "mocra",
    name: "Tuân thủ MoCRA",
    serviceType: "MoCRA Cosmetic Facility Registration & Product Listing",
    description:
      "Đăng ký cơ sở sản xuất mỹ phẩm và liệt kê sản phẩm lên FDA theo Đạo luật Hiện đại hóa Mỹ phẩm (MoCRA) 2022, kèm tư vấn Adverse Event.",
    path: "/services/cosmetics/mocra-registration",
    anchor: "Dịch vụ đăng ký MoCRA cho mỹ phẩm xuất khẩu Mỹ",
  },
  {
    key: "us-agent",
    name: "US Agent & Responsible Person",
    serviceType: "FDA US Agent & MoCRA Responsible Person",
    description:
      "Đại diện pháp lý tại Mỹ cho cơ sở thực phẩm (US Agent) và người chịu trách nhiệm cho mỹ phẩm (Responsible Person) theo quy định liên bang.",
    path: "/services/us-agent",
    anchor: "Dịch vụ US Agent FDA tại Mỹ",
  },
  {
    key: "fsvp",
    name: "FSVP Importer & Plan",
    serviceType: "Foreign Supplier Verification Program (FSVP) Compliance",
    description:
      "Đảm nhận vai trò FSVP Importer và xây dựng FSVP Plan, đánh giá nhà cung cấp nước ngoài theo FSMA cho lô thực phẩm nhập vào Mỹ.",
    path: "/services/fsvp",
    anchor: "Dịch vụ tuân thủ FSVP cho thực phẩm nhập khẩu",
  },
  {
    key: "llc-ein",
    name: "Thành lập LLC & EIN",
    serviceType: "US LLC Formation & EIN Registration",
    description:
      "Thành lập công ty LLC tại Mỹ và xin mã số thuế EIN để doanh nghiệp Việt tự đứng tên nhập khẩu, mở tài khoản ngân hàng Mỹ.",
    path: "/services/llc-ein",
    anchor: "Dịch vụ thành lập công ty LLC và xin mã EIN tại Mỹ",
  },
  {
    key: "export-sales",
    name: "Phòng Sale Xuất Khẩu",
    serviceType: "Outsourced Export Sales Team",
    description:
      "Phòng kinh doanh xuất khẩu thuê ngoài trọn gói: tiếp cận buyer Mỹ phù hợp ngành hàng, hỗ trợ đàm phán và tuân thủ cho nhà máy Việt.",
    path: "/services/export-sales",
    anchor: "Dịch vụ phòng sale xuất khẩu thuê ngoài sang Mỹ",
  },
]

/** `@id` ổn định cho một dịch vụ — dùng chung ở trang chủ và landing page. */
export function serviceId(key: string): string {
  return `${SITE_URL}/#service-${key}`
}

/** Tìm một dịch vụ trong danh mục theo khóa. */
export function getService(key: string): ServiceCatalogItem | undefined {
  return SERVICE_CATALOG.find((item) => item.key === key)
}

/** Chuỗi mô tả doanh nghiệp dùng chung cho meta description và schema `description`. */
export const ORGANIZATION_DESCRIPTION =
  "Vexim Global hỗ trợ doanh nghiệp Việt đăng ký FDA, DUNS, US Agent, FSVP, tuân thủ MoCRA và lập LLC tại Mỹ. Quy trình rõ ràng, tư vấn miễn phí trong 24h."

/** Số hiển thị ở footer / schema, ví dụ "0373 685 634". */
export const PHONE_DISPLAY = VEXIM_PHONE_DISPLAY

/**
 * Title + description của TRANG CHỦ.
 *
 * Đặt ở đây để `app/layout.tsx` (title.default, og:title, twitter:title) và
 * `app/page.tsx` (title, description, og:description) dùng chung MỘT chuỗi —
 * trước đây ba chỗ này lệch nhau (meta description nhắc MFDS/CE còn og:description
 * thì không), và cả hai đều liệt kê dịch vụ mà trang không hề cung cấp.
 */
export const SITE_TITLE = "Đăng Ký FDA, US Agent & Tư Vấn Xuất Khẩu Sang Mỹ | Vexim Global"

/** Cùng nội dung cho meta description, og:description và twitter:description. */
export const SITE_DESCRIPTION = ORGANIZATION_DESCRIPTION

/** Alt text cho ảnh OG — mô tả ảnh, không nhét khẩu hiệu. */
export const OG_IMAGE_ALT =
  "Vexim Global — dịch vụ đăng ký FDA, US Agent, FSVP, MoCRA và thành lập LLC cho doanh nghiệp Việt xuất khẩu sang Mỹ"
