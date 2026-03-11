import { createClient, createStaticClient } from "@/lib/supabase/server"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { BackToTop } from "@/components/back-to-top"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, User, ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { BlogSearch } from "@/components/blog-search"
import { notFound } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"

// Category configuration with SEO metadata
const categoryConfig: Record<string, { 
  title: string
  description: string
  keywords: string[]
  relatedService?: string
}> = {
  "FDA": {
    title: "Hướng dẫn đăng ký FDA",
    description: "Tin tức, hướng dẫn chi tiết về đăng ký FDA cho thực phẩm, dược phẩm và thiết bị y tế xuất khẩu sang Mỹ.",
    keywords: ["đăng ký FDA", "FDA Mỹ", "xuất khẩu thực phẩm Mỹ", "FDA registration"],
    relatedService: "/services/fda"
  },
  "GACC": {
    title: "Hướng dẫn đăng ký GACC",
    description: "Cập nhật quy định GACC, hướng dẫn đăng ký xuất khẩu thực phẩm sang Trung Quốc theo Decree 248/249.",
    keywords: ["đăng ký GACC", "xuất khẩu Trung Quốc", "Decree 248", "Decree 249"],
    relatedService: "/services/gacc"
  },
  "MFDS": {
    title: "Hướng dẫn đăng ký MFDS Hàn Quốc",
    description: "Quy định và thủ tục đăng ký MFDS cho thực phẩm, mỹ phẩm xuất khẩu sang Hàn Quốc.",
    keywords: ["đăng ký MFDS", "xuất khẩu Hàn Quốc", "MFDS Korea", "mỹ phẩm Hàn Quốc"],
    relatedService: "/services/mfds"
  },
  "Truy xuất nguồn gốc": {
    title: "Truy xuất nguồn gốc sản phẩm",
    description: "Giải pháp truy xuất nguồn gốc bằng công nghệ AI và blockchain cho doanh nghiệp xuất khẩu.",
    keywords: ["truy xuất nguồn gốc", "blockchain", "AI traceability", "supply chain"],
    relatedService: "/services/ai-traceability"
  },
  "Tin tức thị trường": {
    title: "Tin tức thị trường xuất nhập khẩu",
    description: "Cập nhật tin tức mới nhất về thị trường xuất nhập khẩu quốc tế và chính sách thương mại.",
    keywords: ["tin tức xuất nhập khẩu", "thị trường quốc tế", "chính sách thương mại"],
  },
  "Xuất nhập khẩu": {
    title: "Kiến thức xuất nhập khẩu",
    description: "Hướng dẫn chi tiết về quy trình xuất nhập khẩu, thủ tục hải quan và logistics quốc tế.",
    keywords: ["xuất nhập khẩu", "thủ tục hải quan", "logistics", "vận chuyển quốc tế"],
    relatedService: "/services/export-delegation"
  },
  "Kiến thức pháp lý": {
    title: "Kiến thức pháp lý xuất nhập khẩu",
    description: "Cập nhật quy định pháp lý, hiệp định thương mại và các yêu cầu tuân thủ trong xuất nhập khẩu.",
    keywords: ["pháp lý xuất nhập khẩu", "hiệp định thương mại", "tuân thủ pháp luật"],
  },
}

export const revalidate = 60

// Generate static params for all categories
export async function generateStaticParams() {
  return Object.keys(categoryConfig).map((category) => ({
    category: encodeURIComponent(category),
  }))
}

// Generate metadata for each category page
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const decodedCategory = decodeURIComponent(category)
  const config = categoryConfig[decodedCategory]

  if (!config) {
    return {
      title: "Danh mục không tồn tại",
      robots: { index: false, follow: false },
    }
  }

  return {
    title: `${config.title} | Blog Vexim Global`,
    description: config.description,
    keywords: config.keywords,
    alternates: {
      canonical: `https://www.veximglobal.com/blog/category/${encodeURIComponent(decodedCategory)}`,
    },
    openGraph: {
      title: `${config.title} | Blog Vexim Global`,
      description: config.description,
      url: `/blog/category/${encodeURIComponent(decodedCategory)}`,
      type: "website",
    },
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const supabase = await createClient()
  const { category } = await params
  const decodedCategory = decodeURIComponent(category)
  
  const config = categoryConfig[decodedCategory]
  if (!config) {
    notFound()
  }

  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .eq("category", decodedCategory)
    .order("published_at", { ascending: false })

  if (error) {
    console.error("Error fetching posts:", error)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Category list schema for SEO
  const categoryListSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: config.title,
    description: config.description,
    url: `https://www.veximglobal.com/blog/category/${encodeURIComponent(decodedCategory)}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts?.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://www.veximglobal.com/blog/${post.slug}`,
        name: post.title,
      })) || [],
    },
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Trang chủ",
        item: "https://www.veximglobal.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://www.veximglobal.com/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: decodedCategory,
        item: `https://www.veximglobal.com/blog/category/${encodeURIComponent(decodedCategory)}`,
      },
    ],
  }

  const allCategories = Object.keys(categoryConfig)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              {/* Breadcrumb */}
              <div className="flex justify-center mb-6">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/" className="text-white/70 hover:text-white">
                        Trang chủ
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="text-white/50" />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/blog" className="text-white/70 hover:text-white">
                        Blog
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="text-white/50" />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="text-white">{decodedCategory}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
                {config.title}
              </h1>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-6">
                {config.description}
              </p>
              
              {/* Related Service Link */}
              {config.relatedService && (
                <Link href={config.relatedService}>
                  <Button variant="secondary" className="mb-6">
                    Xem dịch vụ {decodedCategory} của chúng tôi
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              )}

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <BlogSearch />
              </div>
            </div>
          </div>
        </section>

        {/* Categories Filter */}
        <section className="py-6 border-b bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-2 justify-center">
              <Link href="/blog">
                <Button variant="outline" size="sm">
                  Tất cả
                </Button>
              </Link>
              {allCategories.map((cat) => (
                <Link key={cat} href={`/blog/category/${encodeURIComponent(cat)}`}>
                  <Button
                    variant={cat === decodedCategory ? "default" : "outline"}
                    size="sm"
                    className={cat === decodedCategory ? "bg-accent hover:bg-accent/90" : ""}
                  >
                    {cat}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Posts Count */}
        <section className="py-4 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">{posts?.length || 0}</span> bài viết trong danh mục <span className="font-semibold text-accent">{decodedCategory}</span>
              </p>
              <Link href="/blog">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại Blog
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-12 md:py-16">
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
                          alt={`${post.title} - ${decodedCategory} - Vexim Global`}
                          width={600}
                          height={375}
                          loading="lazy"
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
                        <h2 className="text-xl font-bold text-primary mb-3 line-clamp-2 text-balance group-hover:text-accent transition-colors">
                          {post.title}
                        </h2>

                        {/* Excerpt */}
                        <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3 flex-1">
                          {post.excerpt}
                        </p>

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
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <p className="text-muted-foreground text-lg mb-6">
                    Chưa có bài viết nào trong danh mục <span className="font-semibold">{decodedCategory}</span>.
                  </p>
                  <Link href="/blog">
                    <Button>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Xem tất cả bài viết
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Related Service CTA */}
        {config.relatedService && (
          <section className="py-12 bg-primary/5">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
                  Cần hỗ trợ về {decodedCategory}?
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Đội ngũ chuyên gia Vexim Global sẵn sàng tư vấn và hỗ trợ bạn với dịch vụ {decodedCategory} chuyên nghiệp.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link href={config.relatedService}>
                    <Button size="lg">
                      Tìm hiểu dịch vụ
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/#contact">
                    <Button variant="outline" size="lg">
                      Liên hệ tư vấn
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
