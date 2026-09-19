import { Card } from "@/components/ui/card"
import { Eye, TrendingUp } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

interface PopularPostsProps {
  /** Số bài hiển thị (mặc định 5) */
  limit?: number
}

/**
 * Sidebar "Bài viết phổ biến" — lấy theo views_count (được ViewTracker cập nhật).
 * Server component: render sẵn, không cần fetch phía client.
 */
export async function PopularPosts({ limit = 5 }: PopularPostsProps) {
  let posts: Array<{
    id: string
    title: string
    slug: string
    category: string
    featured_image: string | null
    views_count: number | null
  }> = []

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("posts")
      .select("id, title, slug, category, featured_image, views_count")
      .eq("status", "published")
      .order("views_count", { ascending: false })
      .order("published_at", { ascending: false })
      .limit(limit)

    posts = (data as typeof posts) || []
  } catch {
    // Supabase chưa cấu hình — ẩn khối thay vì phá trang
    return null
  }

  if (posts.length === 0) return null

  const formatViews = (views: number | null | undefined) => {
    const n = Number(views) || 0
    if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(".", ",")}k`
    return String(n)
  }

  return (
    <Card className="overflow-hidden">
      {/* Header khối — navy đậm + điểm nhấn xanh nhạt */}
      <div className="relative bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4 overflow-hidden">
        <div className="pointer-events-none absolute -right-6 -top-8 w-28 h-28 rounded-full bg-sky-400/20 blur-2xl" aria-hidden="true" />
        <div className="flex items-center gap-2.5 relative">
          <span className="w-8 h-8 rounded-lg bg-amber-400/20 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </span>
          <h4 className="font-bold text-lg text-white">Bài viết phổ biến</h4>
        </div>
      </div>

      <div className="divide-y divide-border">
        {posts.map((post, index) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="flex gap-3.5 p-4 group hover:bg-secondary/50 transition-colors">
            {/* Số thứ tự */}
            <span
              className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                index < 3 ? "bg-gradient-to-br from-amber-400 to-orange-500 text-navy-950" : "bg-secondary text-navy-700"
              }`}
            >
              {index + 1}
            </span>

            {/* Thumbnail */}
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-secondary">
              <img
                src={post.featured_image || "/placeholder.svg?height=96&width=96"}
                alt={post.title}
                width={64}
                height={64}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h5 className="text-sm font-semibold leading-snug line-clamp-2 text-foreground group-hover:text-accent transition-colors">
                {post.title}
              </h5>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                <span className="text-accent font-medium truncate">{post.category}</span>
                <span className="flex items-center gap-1 whitespace-nowrap">
                  <Eye className="w-3.5 h-3.5" />
                  {formatViews(post.views_count)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  )
}
