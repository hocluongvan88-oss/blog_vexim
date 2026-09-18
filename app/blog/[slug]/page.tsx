import { createClient, createStaticClient } from "@/lib/supabase/server"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { BackToTop } from "@/components/back-to-top"
import { Button } from "@/components/ui/button"
import ConsultationDialog from "@/components/consultation-dialog"
import { Calendar, User, ArrowLeft, Clock, RefreshCw } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import Link from "next/link"
import { notFound } from "next/navigation"
import { BlogShareButtons } from "@/components/blog-share-buttons"
import { RelatedPosts } from "@/components/related-posts"
import BlogSidebar from "@/components/blog-sidebar"
import { BlogTableOfContents } from "@/components/blog-table-of-contents"
import { BlogInternalLinks } from "@/components/blog-internal-links"
import { ViewTracker } from "@/components/view-tracker"
import { blocksToHTML, renderInlineMath } from "@/lib/blocks-to-html"
import { ensureHeadingAnchors } from "@/lib/heading-anchors"
import { POST_DETAIL_COLUMNS } from "@/lib/post-payload"
import type { Block } from "@/components/block-editor/types"

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

  const { data: post } = await supabase.from("posts").select(POST_DETAIL_COLUMNS).eq("slug", slug).single()

  if (!post) {
    return {
      title: "Bài viết không tồn tại",
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  /**
   * Rút mô tả quanh mốc ~158 ký tự nhưng cắt ở ranh giới từ
   * (trước đây dùng substring(0,157) nên có thể cắt giữa từ).
   */
  const trimmedDescription = (text: string | null | undefined) => {
    if (!text) return "Vexim Global - Tư vấn xuất nhập khẩu chuyên nghiệp"
    const normalized = text.replace(/\s+/g, " ").trim()
    if (normalized.length <= 158) return normalized
    const cut = normalized.slice(0, 158)
    const lastSpace = cut.lastIndexOf(" ")
    return `${(lastSpace > 100 ? cut.slice(0, lastSpace) : cut).trim()}…`
  }

  const baseUrl = new URL("https://www.veximglobal.com")

  // Ảnh chia sẻ: dùng ảnh bìa, nếu bài chưa có thì rơi về ảnh OG mặc định của site
  const shareImage = post.featured_image || "/og-image.jpg"

  return {
    metadataBase: baseUrl,
    title: post.meta_title || post.title,
    description: trimmedDescription(post.meta_description || post.excerpt),
    // KHÔNG xuất thẻ meta keywords: Google bỏ qua từ 2009, chỉ lộ danh sách từ khóa cho đối thủ
    authors: [{ name: "Vexim Global" }],
    alternates: {
      canonical: `https://www.veximglobal.com/blog/${post.slug}`,
    },
    openGraph: {
      title: post.meta_title || post.title,
      description: trimmedDescription(post.meta_description || post.excerpt),
      url: `/blog/${post.slug}`,
      images: [
        {
          url: shareImage,
          width: 1200,
          height: 630,
          alt: post.featured_image_alt || post.title,
        },
      ],
      type: "article",
      publishedTime: post.published_at,
      modifiedTime: post.updated_at || post.published_at,
      authors: ["Vexim Global"],
      section: post.category,
    },
    twitter: {
      card: "summary_large_image",
      title: post.meta_title || post.title,
      description: trimmedDescription(post.meta_description || post.excerpt),
      images: [shareImage],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createClient()
  const { slug } = await params

  const { data: post, error } = await supabase
    .from("posts")
    .select(POST_DETAIL_COLUMNS)
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

  // Parse blocks from content (could be JSON blocks or HTML)
  let rawHtml = ""
  try {
    const blocks: Block[] = JSON.parse(post.content)
    rawHtml = blocksToHTML(blocks)
  } catch {
    // If parsing fails, assume it's already HTML. Still convert any inline
    // LaTeX math (e.g. "$\ge$") so symbols render as proper characters.
    rawHtml = renderInlineMath(post.content)
  }

  // id cho mọi heading + danh sách heading để render mục lục (server-side, khớp 100% với HTML)
  const { html: htmlContent, headings } = ensureHeadingAnchors(rawHtml)
  const tocHeadings = headings.filter((heading) => heading.level <= 3)

  const calculateReadingTime = (content: string): number => {
    const text = content.replace(/<[^>]*>/g, "")
    const wordCount = text.split(/\s+/).length
    const wordsPerMinute = 200
    return Math.ceil(wordCount / wordsPerMinute)
  }

  const readingTime = calculateReadingTime(htmlContent)

  // Chỉ hiện "Cập nhật lần cuối" khi bài được sửa sau khi đăng quá 1 ngày (tránh nhiễu)
  const isUpdated =
    !!post.updated_at &&
    !!post.published_at &&
    new Date(post.updated_at).getTime() - new Date(post.published_at).getTime() > 86400000

  const pageUrl = `https://www.veximglobal.com/blog/${post.slug}`
  const wordCount = htmlContent.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${pageUrl}#article`,
    // headline phải khớp tiêu đề hiển thị (H1) của bài; bản SEO viết khác thì để ở alternativeHeadline
    headline: post.title,
    alternativeHeadline: post.meta_title || undefined,
    description: post.meta_description || post.excerpt,
    image: [post.featured_image || "https://www.veximglobal.com/og-image.jpg"],
    datePublished: post.published_at,
    // dateModified = ngày sửa thật (post.updated_at được trigger cập nhật mỗi lần lưu)
    dateModified: post.updated_at || post.published_at,
    inLanguage: "vi-VN",
    articleSection: post.category,
    keywords: [post.focus_keyword, post.category].filter(Boolean).join(", "),
    wordCount,
    isAccessibleForFree: true,
    author: {
      "@type": "Organization",
      name: "Vexim Global",
      url: "https://www.veximglobal.com",
    },
    publisher: {
      "@type": "Organization",
      "@id": "https://www.veximglobal.com/#organization",
      name: "Vexim Global",
      url: "https://www.veximglobal.com",
      // File logo phải tồn tại thật và crawl được (trước đây trỏ /logo.png không có)
      logo: {
        "@type": "ImageObject",
        url: "https://www.veximglobal.com/logo.png",
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
  }

  /**
   * Trích các cặp H2/H3 dạng câu hỏi + đoạn trả lời ngay dưới để sinh FAQPage.
   *
   * Lưu ý: Google đã khai tử FAQ *rich result* từ 07/05/2026 (không còn hiện dropdown),
   * nhưng vẫn dùng dữ liệu có cấu trúc để hiểu trang — và Q&A dạng chữ vẫn là phần
   * được AI Overviews trích dẫn nhiều.
   */
  const faqSchema =
    (() => {
      const headingRegex = /<h([23])[^>]*>([\s\S]*?)<\/h\1>([\s\S]*?)(?=<h[23][\s>]|$)/gi
      const entries: Array<{ question: string; answer: string }> = []
      let match: RegExpExecArray | null

      while ((match = headingRegex.exec(htmlContent)) !== null && entries.length < 10) {
        const question = match[2].replace(/<[^>]*>/g, "").trim()
        const answer = match[3]
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 500)

        if (!question || !answer) continue
        if (!/[?]$/.test(question) && !/(là gì|bao lâu|bao nhiêu|như thế nào|khi nào|tại sao|vì sao|có nên|được không|cần gì|gồm)/i.test(question))
          continue

        entries.push({ question, answer })
      }

      if (entries.length < 2) return null

      return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: entries.map((entry) => ({
          "@type": "Question",
          name: entry.question,
          acceptedAnswer: { "@type": "Answer", text: entry.answer },
        })),
      }
    })()

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
        name: post.category,
        item: `https://www.veximglobal.com/blog/category/${encodeURIComponent(post.category)}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: post.title,
        item: pageUrl,
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
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

            {/* Grid layout with TOC, content and sidebar */}
            <div className="grid grid-cols-1 xl:grid-cols-[220px_minmax(0,1fr)_300px] lg:grid-cols-[minmax(0,1fr)_300px] gap-8">
              {/* Table of Contents - Left side on xl screens */}
              <aside className="hidden xl:block overflow-hidden">
                <BlogTableOfContents headings={tocHeadings} />
              </aside>

              {/* Main Content */}
              <div className="min-w-0">
                {/* Visible Breadcrumb Navigation - Good for SEO and UX */}
                <div className="mb-6">
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink href="/" className="text-muted-foreground hover:text-primary">
                          Trang chủ
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink href="/blog" className="text-muted-foreground hover:text-primary">
                          Blog
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage className="text-foreground max-w-[300px] lg:max-w-[500px] truncate">
                          {post.title}
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>

                <div className="mb-4">
                  <span className="inline-block bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6 text-pretty">
                  {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8 pb-8 border-b">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    <span className="font-medium">Vexim Global</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <time dateTime={post.published_at || undefined}>{formatDate(post.published_at)}</time>
                  </div>
                  {/* Ngày cập nhật thật: tín hiệu độ mới cho Google và thông tin cho người đọc */}
                  {isUpdated && (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4" />
                      <span>
                        Cập nhật lần cuối:{" "}
                        <time dateTime={post.updated_at || undefined}>{formatDate(post.updated_at)}</time>
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{readingTime} phút đọc</span>
                  </div>
                </div>

                {post.featured_image && (
                  <div className="aspect-video overflow-hidden rounded-lg mb-12">
                    <img
                      src={post.featured_image || "/placeholder.svg"}
                      alt={post.featured_image_alt || `${post.title} - ${post.category} - Vexim Global`}
                      width={1200}
                      height={630}
                      loading="eager"
                      fetchPriority="high"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div
                  className="prose prose-lg max-w-none prose-headings:text-primary prose-h2:text-3xl prose-h2:font-bold prose-h2:mb-4 prose-h2:mt-8 prose-h3:text-2xl prose-h3:font-bold prose-h3:mb-3 prose-h3:mt-6 prose-p:text-base prose-p:leading-relaxed prose-p:mb-4 prose-ul:my-4 prose-li:text-base prose-li:leading-relaxed prose-a:text-accent prose-a:underline hover:prose-a:opacity-80 prose-figure:my-8 prose-figcaption:text-center prose-figcaption:text-sm prose-figcaption:text-muted-foreground prose-figcaption:italic prose-figcaption:mt-3 prose-img:rounded-lg prose-img:shadow-md"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />

                {/* Internal Links to Related Services - Good for SEO */}
                <div className="mt-12 lg:hidden">
                  <BlogInternalLinks category={post.category} />
                </div>

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
              <div className="hidden lg:block space-y-6">
                <BlogSidebar />
                {/* Internal Links in Sidebar for desktop */}
                <BlogInternalLinks category={post.category} />
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
