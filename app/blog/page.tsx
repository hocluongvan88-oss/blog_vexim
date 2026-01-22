import { createClient } from "@/lib/supabase/server"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { BackToTop } from "@/components/back-to-top"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowRight } from "lucide-react"
import Link from "next/link"
import { BlogSearch } from "@/components/blog-search"

export const metadata = {
  title: "Blog - Kiến thức xuất nhập khẩu",
  description: "Cập nhật tin tức, kiến thức pháp lý và hướng dẫn về xuất nhập khẩu quốc tế từ chuyên gia Vexim Global.",
  keywords: [
    "blog xuất nhập khẩu",
    "kiến thức xuất khẩu",
    "tin tức thương mại",
    "hướng dẫn FDA",
    "hướng dẫn GACC",
    "pháp lý xuất khẩu",
  ],
  alternates: {
    canonical: "https://vexim.vn/blog",
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

  let query = supabase.from("posts").select("*").eq("status", "published").order("published_at", { ascending: false })

  if (selectedCategory && selectedCategory !== "all") {
    query = query.eq("category", selectedCategory)
  }

  const { data: posts, error } = await query

  if (error) {
    console.error("Error fetching posts:", error)
  }

  const categories = [
    "all",
    "FDA",
    "GACC",
    "MFDS",
    "Truy xuất nguồn gốc",
    "Tin tức thị trường",
    "Xuất nhập khẩu",
    "Kiến thức pháp lý",
  ]

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
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">Blog & Kiến thức</h1>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-8">
                Cập nhật tin tức mới nhất về xuất nhập khẩu, quy định pháp lý quốc tế và các hướng dẫn chuyên sâu từ đội
                ngũ chuyên gia Vexim Global
              </p>
              {/* Search Bar in Hero Section */}
              <div className="max-w-2xl mx-auto">
                <BlogSearch />
              </div>
            </div>
          </div>
        </section>

        {/* Categories Filter */}
        <section className="py-8 border-b bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((cat) => (
                <Link key={cat} href={`/blog?category=${cat}`}>
                  <Button
                    variant={cat === selectedCategory ? "default" : "outline"}
                    className={cat === selectedCategory ? "bg-accent hover:bg-accent/90" : ""}
                  >
                    {cat === "all" ? "Tất cả" : cat}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            {posts && posts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group p-0 h-full flex flex-col">
                      {/* Featured Image */}
                      <div className="aspect-[16/10] overflow-hidden">
                        <img
                          src={post.featured_image || "/placeholder.svg?height=400&width=600"}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 rounded-t-lg"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        {/* Category Badge */}
                        <div className="mb-3">
                          <span className="inline-block bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium">
                            {post.category}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-primary mb-3 line-clamp-2 text-balance group-hover:text-accent transition-colors">
                          {post.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3 flex-1">{post.excerpt}</p>

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground border-t pt-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(post.published_at)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>Vexim Global</span>
                          </div>
                        </div>

                        {/* Read More Link */}
                        <div className="mt-4 flex items-center text-accent font-medium group-hover:gap-2 transition-all">
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
        </section>
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
