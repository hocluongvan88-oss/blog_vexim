import { createClient } from "@/lib/supabase/server"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { BackToTop } from "@/components/back-to-top"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowRight, FolderOpen } from "lucide-react"
import Link from "next/link"
import { BlogSearch } from "@/components/blog-search"
import { PopularPosts } from "@/components/popular-posts"
import BlogSidebar from "@/components/blog-sidebar"
import { BLOG_CATEGORY_SLUGS } from "@/lib/blog-categories"

const POST_CARD_COLUMNS = "id, title, slug, excerpt, category, featured_image, published_at"

export const metadata = {
  title: "Blog - Kiến thức xuất nhập khẩu",
  description: "Cập nhật tin tức, kiến thức pháp lý và hướng dẫn về xuất nhập khẩu quốc tế từ chuyên gia Vexim Global.",
  alternates: {
    canonical: "https://www.veximglobal.com/blog",
  },
  openGraph: {
    title: "Blog - Kiến thức xuất nhập khẩu | Vexim Global",
    description: "Cập nhật tin tức, kiến thức pháp lý và hướng dẫn về xuất nhập khẩu quốc tế từ chuyên gia Vexim Global.",
    url: "/blog",
    type: "website",
  },
}

export const revalidate = 60 // Revalidate mỗi 60 giây

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const supabase = await createClient()
  const params = await searchParams
  const selectedCategory = params.category || "all"

  // Chỉ lấy các cột cần cho danh sách (trước đây select("*") kéo theo cả content JSON của mọi bài)
  let query = supabase
    .from("posts")
    .select(POST_CARD_COLUMNS)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(60)

  if (selectedCategory && selectedCategory !== "all") {
    query = query.eq("category", selectedCategory)
  }

  const { data: posts, error } = await query

  if (error) {
    console.error("Error fetching posts:", error)
  }

  const categories = ["all", ...BLOG_CATEGORY_SLUGS]

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* ============================================================
            Hero — navy đậm nhiều lớp (ảnh logistics + glow xanh nhạt),
            không còn là một mảng màu phẳng như trước.
            ============================================================ */}
        <section className="relative bg-navy-950 text-white pt-32 md:pt-40 pb-16 md:pb-20 overflow-hidden">
          {/* Ảnh nền logistics / vận chuyển */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url(https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2000)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-navy-950/95 via-navy-900/90 to-navy-950/97" />
          </div>

          {/* Điểm nhấn xanh nhạt + họa tiết trang trí */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[640px] h-[320px] rounded-full bg-sky-400/15 blur-[110px]" />
            <div className="absolute bottom-[-40%] right-[-8%] w-[420px] h-[420px] rounded-full bg-amber-400/10 blur-[120px]" />
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #7dd3fc 1px, transparent 1px), linear-gradient(to bottom, #7dd3fc 1px, transparent 1px)",
                backgroundSize: "56px 56px",
              }}
            />
          </div>

          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-sky-300/30 bg-sky-400/10 px-4 py-1.5 text-sm font-medium text-sky-200 mb-6">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Kiến thức & cập nhật pháp lý
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">Blog & Kiến thức</h1>
              <p className="text-lg md:text-xl text-white/85 leading-relaxed mb-8">
                Cập nhật tin tức mới nhất về xuất nhập khẩu, quy định pháp lý quốc tế và các hướng dẫn chuyên sâu từ đội
                ngũ chuyên gia Vexim Global
              </p>
              {/* Search Bar in Hero Section */}
              <div className="max-w-2xl mx-auto">
                <BlogSearch />
              </div>
            </div>
          </div>

          {/* Viền chuyển màu navy -> xanh nhạt ở đáy hero */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-sky-400/70 to-transparent" aria-hidden="true" />
        </section>

        {/* Categories Filter */}
        <section className="py-6 border-b bg-white sticky top-[68px] md:top-[84px] z-30">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-2.5 justify-center">
              {categories.map((cat) => {
                const active = cat === selectedCategory
                return (
                  <Link key={cat} href={`/blog?category=${cat}`}>
                    <Button
                      variant={active ? "default" : "outline"}
                      size="sm"
                      className={
                        active
                          ? "bg-navy-900 text-white shadow-md shadow-navy-900/20"
                          : "bg-white text-slate-600 border-border hover:border-navy-700 hover:text-navy-900"
                      }
                    >
                      {cat === "all" ? "Tất cả" : cat}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* ============================================================
            Nội dung chính: grid bài viết (trái) + sidebar (phải)
            ============================================================ */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-10">
              {/* Grid bài viết */}
              <div>
                {posts && posts.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-6 md:gap-7">
                    {posts.map((post) => (
                      <Link key={post.id} href={`/blog/${post.slug}`} className="block h-full">
                        <Card className="overflow-hidden border-border/80 shadow-sm hover:shadow-xl hover:border-sky-200 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer group p-0 h-full flex flex-col rounded-xl">
                          {/* Featured Image */}
                          <div className="aspect-[16/10] overflow-hidden relative">
                            <img
                              src={post.featured_image || "/placeholder.svg?height=400&width=600"}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {/* Category Badge trên thumbnail */}
                            <span className="absolute top-3 left-3 inline-block bg-navy-900/90 backdrop-blur-sm text-sky-200 px-3 py-1 rounded-full text-xs font-semibold">
                              {post.category}
                            </span>
                          </div>

                          {/* Content */}
                          <div className="p-5 md:p-6 flex-1 flex flex-col">
                            {/* Title */}
                            <h3 className="text-lg md:text-xl font-bold text-navy-900 mb-2.5 line-clamp-2 group-hover:text-accent transition-colors">
                              {post.title}
                            </h3>

                            {/* Excerpt */}
                            <p className="text-muted-foreground text-sm md:text-[15px] mb-4 leading-relaxed line-clamp-3 flex-1">
                              {post.excerpt}
                            </p>

                            {/* Meta Info */}
                            <div className="flex items-center gap-4 text-xs md:text-sm text-muted-foreground border-t border-border pt-4">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-accent" />
                                <span>{formatDate(post.published_at)}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <User className="w-4 h-4 text-accent" />
                                <span>Vexim Global</span>
                              </div>
                            </div>

                            {/* Read More Link */}
                            <div className="mt-4 flex items-center gap-1 text-accent font-semibold text-sm group-hover:gap-2 transition-all">
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
                    <p className="text-muted-foreground text-lg">Chưa có bài viết nào trong danh mục này.</p>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <aside className="lg:sticky lg:top-32 h-fit space-y-6">
                <PopularPosts />

                {/* Danh mục */}
                <Card className="overflow-hidden">
                  <div className="relative bg-gradient-to-r from-navy-900 to-navy-800 px-6 py-4 overflow-hidden">
                    <div className="pointer-events-none absolute -right-6 -top-8 w-28 h-28 rounded-full bg-sky-400/20 blur-2xl" aria-hidden="true" />
                    <div className="flex items-center gap-2.5 relative">
                      <span className="w-8 h-8 rounded-lg bg-sky-400/20 flex items-center justify-center">
                        <FolderOpen className="w-4 h-4 text-sky-300" />
                      </span>
                      <h4 className="font-bold text-lg text-white">Danh mục</h4>
                    </div>
                  </div>
                  <div className="p-3">
                    {categories
                      .filter((cat) => cat !== "all")
                      .map((cat) => {
                        const active = cat === selectedCategory
                        return (
                          <Link
                            key={cat}
                            href={`/blog?category=${encodeURIComponent(cat)}`}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                              active
                                ? "bg-secondary text-navy-900"
                                : "text-slate-600 hover:bg-secondary/60 hover:text-navy-900"
                            }`}
                          >
                            <span>{cat}</span>
                            <ArrowRight className="w-4 h-4 text-accent" />
                          </Link>
                        )
                      })}
                  </div>
                </Card>

                {/* Form tư vấn + thống kê + dịch vụ nổi bật */}
                <BlogSidebar />
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
