/**
 * Danh sách URL công khai của site — nguồn dùng chung cho sitemap.xml.
 *
 * Lý do tồn tại: trước đây `app/sitemap.ts` chỉ liệt kê 7 trang dịch vụ, bỏ sót
 * gần 20 trang dịch vụ thật (/services/food/*, /services/cosmetics/*, /services/gacc/assessment,
 * /services/fsvp, /services/fda-label-check, /services/llc-ein) và /fda-tracker.
 * Các trang này vẫn được Google tìm thấy qua liên kết nội bộ, nhưng thiếu trong sitemap
 * khiến tốc độ phát hiện/đánh giá lại chậm hơn và Search Console khó đối soát.
 *
 * Khi thêm trang công khai mới: thêm vào đây (đây là nơi duy nhất cần sửa).
 */

export interface StaticRoute {
  path: string
  priority: number
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly"
}

export const STATIC_ROUTES: StaticRoute[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.9, changeFrequency: "weekly" },
  { path: "/fda-tracker", priority: 0.8, changeFrequency: "daily" },

  // Dịch vụ theo thị trường
  { path: "/services/fda", priority: 0.9, changeFrequency: "weekly" },
  { path: "/services/gacc", priority: 0.9, changeFrequency: "weekly" },
  { path: "/services/mfds", priority: 0.9, changeFrequency: "weekly" },
  { path: "/services/us-agent", priority: 0.8, changeFrequency: "weekly" },
  { path: "/services/ai-traceability", priority: 0.7, changeFrequency: "monthly" },
  { path: "/services/export-delegation", priority: 0.7, changeFrequency: "monthly" },
  { path: "/services/fsvp", priority: 0.8, changeFrequency: "monthly" },
  { path: "/services/fda-label-check", priority: 0.7, changeFrequency: "monthly" },
  { path: "/services/llc-ein", priority: 0.7, changeFrequency: "monthly" },

  // Dịch vụ thực phẩm (FDA Mỹ)
  { path: "/services/food/fda-registration", priority: 0.8, changeFrequency: "monthly" },
  { path: "/services/food/fda-renewal", priority: 0.7, changeFrequency: "monthly" },
  { path: "/services/food/us-agent", priority: 0.7, changeFrequency: "monthly" },
  { path: "/services/food/fsvp-importer", priority: 0.7, changeFrequency: "monthly" },
  { path: "/services/food/fsvp-plan", priority: 0.7, changeFrequency: "monthly" },
  { path: "/services/food/prior-notice", priority: 0.7, changeFrequency: "monthly" },
  { path: "/services/food/ingredient-review", priority: 0.7, changeFrequency: "monthly" },
  { path: "/services/food/label-compliance", priority: 0.7, changeFrequency: "monthly" },

  // Dịch vụ mỹ phẩm (MoCRA)
  { path: "/services/cosmetics/mocra-registration", priority: 0.8, changeFrequency: "monthly" },
  { path: "/services/cosmetics/mocra-renewal", priority: 0.7, changeFrequency: "monthly" },
  { path: "/services/cosmetics/product-listing", priority: 0.7, changeFrequency: "monthly" },
  { path: "/services/cosmetics/responsible-person", priority: 0.7, changeFrequency: "monthly" },
  { path: "/services/cosmetics/ingredient-review", priority: 0.7, changeFrequency: "monthly" },
  { path: "/services/cosmetics/label-compliance", priority: 0.7, changeFrequency: "monthly" },

  // Dịch vụ GACC (Trung Quốc)
  { path: "/services/gacc/assessment", priority: 0.7, changeFrequency: "monthly" },
]

/**
 * Route KHÔNG đưa vào sitemap dù tồn tại:
 * - `/client-portal`: khu vực đăng nhập của khách hàng (đã chặn index bằng layout noindex + robots.txt)
 * - `/admin/*`, `/api/*`: nội bộ
 */
export const EXCLUDED_FROM_SITEMAP = ["/client-portal", "/admin", "/api"]
