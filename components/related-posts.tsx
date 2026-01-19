import { Card } from "@/components/ui/card"
import { Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

interface RelatedPostsProps {
  currentPostId: string
  category: string
}

export async function RelatedPosts({ currentPostId, category }: RelatedPostsProps) {
  const supabase = await createClient()

  // Get related posts from the same category
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .eq("category", category)
    .neq("id", currentPostId)
    .order("published_at", { ascending: false })
    .limit(3)

  if (!posts || posts.length === 0) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    })
  }

  return (
    <section className="mt-16 pt-16 border-t">
      <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8">Bài viết liên quan</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="block group">
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-0 h-full flex flex-col">
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.featured_image || "/placeholder.svg?height=300&width=400"}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(post.published_at)}</span>
                </div>
                <h3 className="text-lg font-bold text-primary mb-2 text-balance group-hover:text-accent transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1 mb-3">{post.excerpt}</p>
                <div className="flex items-center text-accent text-sm font-medium group-hover:gap-2 transition-all">
                  <span>Đọc thêm</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
