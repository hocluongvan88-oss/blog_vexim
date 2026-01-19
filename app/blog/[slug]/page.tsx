import { createClient, createStaticClient } from "@/lib/supabase/server"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { BackToTop } from "@/components/back-to-top"
import { Button } from "@/components/ui/button"
import ConsultationDialog from "@/components/consultation-dialog"
import { Calendar, User, ArrowLeft, Clock } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { BlogShareButtons } from "@/components/blog-share-buttons"
import { RelatedPosts } from "@/components/related-posts"
import BlogSidebar from "@/components/blog-sidebar"
import { ViewTracker } from "@/components/view-tracker"

export const revalidate = 60

export async function generateStaticParams() {
  const supabase = createStaticClient()

  if (!supabase) {
    console.log("[v0] Supabase not configured, skipping static params generation")
    return []
  }

  const { data: posts } = await supabase.from("posts").select("slug").eq("status", "published")

  if (!posts) return []

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createClient()
  const { slug } = await params

  const { data: post } = await supabase.from("posts").select("*").eq("slug", slug).single()

  if (!post) {
    return {
      title: "Bài viết không tồn tại",
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    keywords: post.tags || [post.category],
    authors: [{ name: "Vexim Global" }],
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      url: `/blog/${post.slug}`,
      images: post.featured_image
        ? [
            {
              url: post.featured_image,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : [],
      type: "article",
      publishedTime: post.published_at,
      modifiedTime: post.updated_at || post.published_at,
      authors: ["Vexim Global"],
      section: post.category,
    },
    twitter: {
      card: "summary_large_image",
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      images: post.featured_image ? [post.featured_image] : [],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createClient()
  const { slug } = await params

  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  if (error || !post) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const calculateReadingTime = (content: string): number => {
    const text = content.replace(/<[^>]*>/g, "")
    const wordCount = text.split(/\s+/).length
    const wordsPerMinute = 200
    return Math.ceil(wordCount / wordsPerMinute)
  }

  const readingTime = calculateReadingTime(post.content)

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.featured_image,
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    author: {
      "@type": "Organization",
      name: "Vexim Global",
      url: "https://vexim.vn",
    },
    publisher: {
      "@type": "Organization",
      name: "Vexim Global",
      logo: {
        "@type": "ImageObject",
        url: "https://vexim.vn/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://vexim.vn/blog/${post.slug}`,
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <ViewTracker postId={post.id} />
      <Header />
      <BlogShareButtons />
      <main className="min-h-screen pt-20 md:pt-24">
        <article className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <Link href="/blog" className="hidden md:inline-block mb-8">
              <Button variant="ghost" className="-ml-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại Blog
              </Button>
            </Link>

            {/* Grid layout with content and sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 xl:gap-12">
              {/* Main Content */}
              <div className="min-w-0">
                <div className="mb-4">
                  <span className="inline-block bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6 text-balance">
                  {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8 pb-8 border-b">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    <span className="font-medium">Vexim Global</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>{formatDate(post.published_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{readingTime} phút đọc</span>
                  </div>
                </div>

                {post.featured_image && (
                  <div className="aspect-video overflow-hidden rounded-lg mb-12">
                    <img
                      src={post.featured_image || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div
                  className="prose prose-lg max-w-none prose-headings:text-primary prose-h2:text-3xl prose-h2:font-bold prose-h2:mb-4 prose-h2:mt-8 prose-h3:text-2xl prose-h3:font-bold prose-h3:mb-3 prose-h3:mt-6 prose-p:text-base prose-p:leading-relaxed prose-p:mb-4 prose-ul:my-4 prose-li:text-base prose-li:leading-relaxed prose-a:text-accent prose-a:underline hover:prose-a:opacity-80"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                <div className="mt-16 p-8 bg-gradient-to-br from-primary to-primary/90 rounded-lg text-white text-center">
                  <h3 className="text-2xl font-bold mb-4">Cần tư vấn thêm về dịch vụ này?</h3>
                  <p className="text-white/90 mb-6 max-w-2xl mx-auto leading-relaxed">
                    Đội ngũ chuyên gia của Vexim Global sẵn sàng hỗ trợ bạn với hơn 10 năm kinh nghiệm trong lĩnh vực
                    xuất nhập khẩu
                  </p>
                  <ConsultationDialog>
                    <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white border-none">
  Liên hệ tư vấn miễn phí
</Button>
                  </ConsultationDialog>
                </div>

                <RelatedPosts currentPostId={post.id} category={post.category} />
              </div>

              {/* Sidebar - Hidden on mobile, shown on large screens */}
              <div className="hidden lg:block">
                <BlogSidebar />
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
