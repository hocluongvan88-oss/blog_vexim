import { Card } from "@/components/ui/card"
import { CalendarDays, Clock } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

interface RecentPostsProps {
  limit?: number
  /** Don't suggest the article the visitor is already reading. */
  excludePostId?: string
}

interface RecentPost {
  id: string
  title: string
  slug: string
  category: string
  featured_image: string | null
  published_at: string | null
  created_at: string | null
}

/** Real published posts, newest publication first. No view-based ranking or sample fallback. */
export async function RecentPosts({ limit = 5, excludePostId }: RecentPostsProps) {
  const count = Number.isFinite(limit) ? Math.max(1, Math.min(10, Math.trunc(limit))) : 5
  let posts: RecentPost[]
  try {
    const supabase = await createClient()
    let query = supabase
      .from("posts")
      .select("id, title, slug, category, featured_image, published_at, created_at")
      .eq("status", "published")
    if (excludePostId) query = query.neq("id", excludePostId)
    const { data, error } = await query
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false, nullsFirst: false })
      .order("id", { ascending: false })
      .limit(count)
    if (error || !data?.length) return null
    posts = data as RecentPost[]
  } catch {
    // Missing configuration/backend errors must not break the article or invent posts.
    return null
  }

  return (
    <Card className="gap-0 overflow-hidden p-0" aria-labelledby="recent-posts-title">
      <div className="relative overflow-hidden bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4">
        <div className="pointer-events-none absolute -right-6 -top-8 h-28 w-28 rounded-full bg-sky-400/20 blur-2xl" aria-hidden="true" />
        <div className="relative flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/20">
            <Clock className="h-4 w-4 text-amber-400" aria-hidden="true" />
          </span>
          <h2 id="recent-posts-title" className="text-lg font-bold text-white">Bài viết mới nhất</h2>
        </div>
      </div>
      <div className="divide-y divide-border">
        {posts.map((post) => {
          const rawDate = post.published_at || post.created_at
          const date = rawDate ? new Date(rawDate) : null
          const validDate = date && Number.isFinite(date.getTime()) ? date : null
          return (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group flex gap-3 p-4 transition-colors hover:bg-secondary/50">
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
                <img
                  src={post.featured_image || "/placeholder.svg?height=96&width=96"}
                  alt={post.title}
                  width={64}
                  height={64}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="line-clamp-3 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-accent">
                  {post.title}
                </h3>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span className="max-w-full truncate font-medium text-accent">{post.category}</span>
                  {validDate && (
                    <span className="flex items-center gap-1 whitespace-nowrap">
                      <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                      <time dateTime={validDate.toISOString()}>
                        {validDate.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Ho_Chi_Minh" })}
                      </time>
                    </span>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </Card>
  )
}
