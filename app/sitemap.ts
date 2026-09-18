import type { MetadataRoute } from "next"
import { createStaticClient } from "@/lib/supabase/server"
import { BLOG_CATEGORIES } from "@/lib/blog-categories"
import { STATIC_ROUTES } from "@/lib/site-routes"

/**
 * sitemap.xml
 *
 * Hai lỗi kỹ thuật đã sửa:
 * 1. `lastModified: new Date()` cho mọi trang tĩnh/danh mục → nói dối Google rằng
 *    "trang vừa thay đổi" ở mỗi lần build. Google sẽ bỏ qua lastmod khi thấy không đáng tin.
 *    Nay chỉ đặt lastModified khi ĐO ĐƯỢC ngày sửa thật (bài viết), còn lại bỏ trường này.
 * 2. Danh sách trang tĩnh thiếu gần 20 trang dịch vụ thật → chuyển sang `STATIC_ROUTES`
 *    trong `lib/site-routes.ts` (nguồn duy nhất, dễ cập nhật).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.veximglobal.com"
  const supabase = createStaticClient()

  let blogPages: MetadataRoute.Sitemap = []
  /** Ngày sửa mới nhất của từng danh mục (để đặt lastModified thật cho trang danh mục) */
  const categoryLastModified = new Map<string, Date>()
  let blogLastModified: Date | undefined

  if (supabase) {
    try {
      const { data: posts } = await supabase
        .from("posts")
        .select("slug, category, published_at, updated_at")
        .eq("status", "published")
        .order("published_at", { ascending: false })

      const toDate = (value: string | null) => (value ? new Date(value) : undefined)

      posts?.forEach((post) => {
        const lastModified = toDate(post.updated_at) || toDate(post.published_at)
        if (!lastModified) return

        if (!blogLastModified || lastModified > blogLastModified) {
          blogLastModified = lastModified
        }

        if (post.category) {
          const current = categoryLastModified.get(post.category)
          if (!current || lastModified > current) {
            categoryLastModified.set(post.category, lastModified)
          }
        }
      })

      blogPages =
        posts?.map((post) => ({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: toDate(post.updated_at) || toDate(post.published_at),
          changeFrequency: "monthly" as const,
          priority: 0.8,
        })) || []
    } catch (error) {
      console.error("[v0] Error fetching posts for sitemap:", error)
      // Continue with just static pages
    }
  }

  const staticPages: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: route.path === "/" ? baseUrl : `${baseUrl}${route.path}`,
    // Trang tĩnh: ngày sửa thật nằm trong code, không đo được ở runtime → bỏ lastModified
    // thay vì gửi `new Date()` giả (Google chỉ tin lastmod khi nó chính xác).
    lastModified: route.path === "/blog" ? blogLastModified : undefined,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  // Trang danh mục — lấy từ nguồn dùng chung để không bị thiếu danh mục
  const categoryPages: MetadataRoute.Sitemap = BLOG_CATEGORIES.map((category) => ({
    url: `${baseUrl}/blog/category/${encodeURIComponent(category.slug)}`,
    lastModified: categoryLastModified.get(category.slug),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  return [...staticPages, ...categoryPages, ...blogPages]
}
