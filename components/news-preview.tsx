import { Card } from "@/components/ui/card"
import { Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export async function NewsPreview() {
  let news: any[] = []

  try {
    const supabase = await createClient()
    const { data: posts } = await supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(3)

    news = posts || []
  } catch {
    // Supabase not configured or unavailable — render empty state
  }

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    })
  }

  return (
    <section id="news" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 text-balance">
            Tin tức & Cập nhật
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Những thông tin mới nhất về xuất nhập khẩu và thương mại quốc tế
          </p>
        </div>

        {news.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {news.map((article) => (
              <Link key={article.id} href={`/blog/${article.slug}`} className="block group h-full">
                <Card className="overflow-hidden border-border/80 shadow-sm hover:shadow-xl hover:border-sky-200 transition-all duration-300 hover:-translate-y-1.5 p-0 h-full flex flex-col rounded-xl">
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={article.featured_image || "/placeholder.svg?height=400&width=600"}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {article.category && (
                      <span className="absolute top-3 left-3 inline-block bg-navy-900/90 backdrop-blur-sm text-sky-200 px-3 py-1 rounded-full text-xs font-semibold">
                        {article.category}
                      </span>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(article.published_at)}</span>
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-accent transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3 flex-1">{article.excerpt}</p>
                    <div className="flex items-center text-accent font-medium group-hover:gap-2 transition-all">
                      <span>Đọc thêm</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chưa có bài viết nào. Hãy quay lại sau!</p>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-navy-950 px-6 py-3 rounded-lg font-semibold shadow-md shadow-orange-500/25 transition-all"
          >
            Xem tất cả bài viết
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
