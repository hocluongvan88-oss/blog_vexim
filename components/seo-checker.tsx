"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, AlertTriangle, Info, Image, Link2, ExternalLink } from "lucide-react"
import { useEffect, useState } from "react"

interface SEOScore {
  score: number
  issues: {
    type: "error" | "warning" | "success" | "info"
    message: string
    category?: string
  }[]
}

import type { Block, ImageData } from "@/components/block-editor/types"

interface SEOCheckerProps {
  title: string
  excerpt: string
  content: string
  metaTitle: string
  metaDescription: string
  featuredImage: string
  featuredImageAlt?: string
  focusKeyword?: string
  blocks?: Block[]
}

export function SEOChecker({
  title,
  excerpt,
  content,
  metaTitle,
  metaDescription,
  featuredImage,
  featuredImageAlt = "",
  focusKeyword = "",
  blocks = [],
}: SEOCheckerProps) {
  const [seoScore, setSeoScore] = useState<SEOScore>({ score: 0, issues: [] })

  useEffect(() => {
    const issues: SEOScore["issues"] = []
    let score = 100

    // ========== TITLE CHECKS ==========
    const titleToCheck = metaTitle || title
    if (!titleToCheck) {
      issues.push({ type: "error", message: "Tiêu đề bài viết không được để trống", category: "title" })
      score -= 20
    } else if (titleToCheck.length < 30) {
      issues.push({ type: "warning", message: "Tiêu đề quá ngắn. Nên từ 30-60 ký tự để tối ưu SEO", category: "title" })
      score -= 10
    } else if (titleToCheck.length > 60) {
      issues.push({ type: "warning", message: "Tiêu đề quá dài. Google có thể cắt bớt trong kết quả tìm kiếm", category: "title" })
      score -= 10
    } else {
      issues.push({ type: "success", message: "Độ dài tiêu đề tối ưu (30-60 ký tự)", category: "title" })
    }

    // ========== META DESCRIPTION CHECKS ==========
    const descToCheck = metaDescription || excerpt
    if (!descToCheck) {
      issues.push({ type: "error", message: "Meta description không được để trống", category: "meta" })
      score -= 15
    } else if (descToCheck.length < 120) {
      issues.push({ type: "warning", message: "Meta description quá ngắn. Nên từ 120-160 ký tự", category: "meta" })
      score -= 10
    } else if (descToCheck.length > 160) {
      issues.push({ type: "warning", message: "Meta description quá dài. Google có thể cắt bớt", category: "meta" })
      score -= 10
    } else {
      issues.push({ type: "success", message: "Meta description tối ưu (120-160 ký tự)", category: "meta" })
    }

    // ========== CONTENT LENGTH CHECKS ==========
    const contentText = content.replace(/<[^>]*>/g, "").trim()
    const wordCount = contentText.split(/\s+/).filter((w) => w.length > 0).length

    if (!content || wordCount < 100) {
      issues.push({ type: "error", message: `Nội dung quá ngắn (${wordCount} từ). Nên có ít nhất 300 từ`, category: "content" })
      score -= 20
    } else if (wordCount < 300) {
      issues.push({ type: "warning", message: `Nội dung hơi ngắn (${wordCount} từ). Nên có ít nhất 300 từ`, category: "content" })
      score -= 10
    } else {
      issues.push({ type: "success", message: `Độ dài nội dung tốt (${wordCount} từ)`, category: "content" })
    }

    // ========== HEADING CHECKS ==========
    let h2Count = 0
    let h3Count = 0

    if (blocks.length > 0) {
      blocks.forEach((block) => {
        if (block.type === "heading") {
          if (block.data.level === 2) h2Count++
          if (block.data.level === 3) h3Count++
        }
      })
    } else {
      h2Count = (content.match(/<h2>/gi) || []).length
      h3Count = (content.match(/<h3>/gi) || []).length
    }

    if (h2Count === 0 && h3Count === 0) {
      issues.push({ type: "warning", message: "Nên sử dụng heading (H2, H3) để cấu trúc nội dung", category: "structure" })
      score -= 10
    } else {
      issues.push({ type: "success", message: `Đã có ${h2Count} H2 và ${h3Count} H3 trong bài viết`, category: "structure" })
    }

    // ========== FEATURED IMAGE CHECKS ==========
    if (!featuredImage) {
      issues.push({ type: "warning", message: "Nên thêm ảnh bìa để tăng tương tác", category: "image" })
      score -= 10
    } else {
      issues.push({ type: "success", message: "Đã có ảnh bìa", category: "image" })
      
      // Check featured image alt
      if (!featuredImageAlt) {
        issues.push({ type: "warning", message: "Ảnh bìa chưa có alt text. Thêm alt text để cải thiện SEO", category: "image" })
        score -= 5
      }
    }

    // ========== IMAGE ALT TEXT CHECKS ==========
    let imgCount = 0
    let imgWithoutAlt = 0
    
    if (blocks.length > 0) {
      blocks.forEach((block) => {
        if (block.type === "image") {
          imgCount++
          const imageData = block.data as ImageData
          if (!imageData.alt && !imageData.caption) {
            imgWithoutAlt++
          }
        }
      })
    } else {
      imgCount = (content.match(/<img/gi) || []).length
      // Count images without alt or with empty alt
      const imgMatches = content.match(/<img[^>]*>/gi) || []
      imgWithoutAlt = imgMatches.filter(img => !img.includes('alt=') || img.includes('alt=""') || img.includes("alt=''")).length
    }

    if (imgCount > 0) {
      if (imgWithoutAlt > 0) {
        issues.push({ 
          type: "error", 
          message: `${imgWithoutAlt}/${imgCount} hình ảnh thiếu alt text. Alt text rất quan trọng cho SEO và accessibility`, 
          category: "image" 
        })
        score -= imgWithoutAlt * 5
      } else {
        issues.push({ type: "success", message: `Tất cả ${imgCount} hình ảnh đều có alt text`, category: "image" })
      }
    }

    if (wordCount > 500 && imgCount === 0) {
      issues.push({ type: "info", message: "Với bài dài, nên thêm ảnh minh họa vào nội dung", category: "image" })
    }

    // ========== LINK CHECKS ==========
    const internalLinks: string[] = []
    const externalLinks: string[] = []
    const nofollowLinks: string[] = []
    
    // Parse links from content
    const linkRegex = /<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi
    let linkMatch
    while ((linkMatch = linkRegex.exec(content)) !== null) {
      const href = linkMatch[1]
      const fullTag = linkMatch[0]
      
      if (href.startsWith('http') && !href.includes('veximglobal.com') && !href.includes('vexim.vn')) {
        externalLinks.push(href)
        if (fullTag.includes('nofollow')) {
          nofollowLinks.push(href)
        }
      } else if (href.startsWith('/') || href.includes('veximglobal.com') || href.includes('vexim.vn')) {
        internalLinks.push(href)
      }
    }

    const totalLinks = internalLinks.length + externalLinks.length

    if (totalLinks === 0) {
      issues.push({ type: "info", message: "Nên thêm liên kết nội bộ để cải thiện SEO và giữ chân người đọc", category: "link" })
    } else {
      if (internalLinks.length > 0) {
        issues.push({ type: "success", message: `Có ${internalLinks.length} liên kết nội bộ (Internal links)`, category: "link" })
      } else {
        issues.push({ type: "warning", message: "Chưa có liên kết nội bộ. Thêm link đến bài viết khác để cải thiện SEO", category: "link" })
        score -= 5
      }

      if (externalLinks.length > 0) {
        const unfollowedExternal = externalLinks.length - nofollowLinks.length
        issues.push({ 
          type: "info", 
          message: `Có ${externalLinks.length} liên kết ngoài${unfollowedExternal > 0 ? ` (${unfollowedExternal} dofollow, ${nofollowLinks.length} nofollow)` : ' (tất cả nofollow)'}`, 
          category: "link" 
        })
      }
    }

    // ========== FOCUS KEYWORD CHECKS ==========
    if (focusKeyword) {
      const keywordLower = focusKeyword.toLowerCase()
      const titleLower = titleToCheck?.toLowerCase() || ""
      const descLower = descToCheck?.toLowerCase() || ""
      const contentLower = contentText.toLowerCase()

      // Check keyword in title
      if (titleLower.includes(keywordLower)) {
        issues.push({ type: "success", message: `Từ khóa "${focusKeyword}" có trong tiêu đề`, category: "keyword" })
      } else {
        issues.push({ type: "warning", message: `Từ khóa "${focusKeyword}" chưa có trong tiêu đề`, category: "keyword" })
        score -= 10
      }

      // Check keyword in meta description
      if (descLower.includes(keywordLower)) {
        issues.push({ type: "success", message: `Từ khóa có trong meta description`, category: "keyword" })
      } else {
        issues.push({ type: "warning", message: `Từ khóa chưa có trong meta description`, category: "keyword" })
        score -= 5
      }

      // Check keyword density
      const keywordCount = (contentLower.match(new RegExp(keywordLower, "g")) || []).length
      const density = wordCount > 0 ? ((keywordCount / wordCount) * 100).toFixed(2) : "0"
      
      if (keywordCount === 0) {
        issues.push({ type: "error", message: `Từ khóa "${focusKeyword}" không xuất hiện trong nội dung`, category: "keyword" })
        score -= 15
      } else if (parseFloat(density) < 0.5) {
        issues.push({ type: "warning", message: `Mật độ từ khóa thấp (${density}%). Nên từ 0.5-2%`, category: "keyword" })
        score -= 5
      } else if (parseFloat(density) > 3) {
        issues.push({ type: "warning", message: `Mật độ từ khóa cao (${density}%). Có thể bị xem là spam`, category: "keyword" })
        score -= 5
      } else {
        issues.push({ type: "success", message: `Mật độ từ khóa tốt: ${density}% (${keywordCount} lần trong ${wordCount} từ)`, category: "keyword" })
      }
    }

    setSeoScore({ score: Math.max(0, Math.min(100, score)), issues })
  }, [title, excerpt, content, metaTitle, metaDescription, featuredImage, featuredImageAlt, focusKeyword, blocks])

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { text: "Tốt", variant: "default" as const, color: "bg-emerald-600" }
    if (score >= 60) return { text: "Khá", variant: "secondary" as const, color: "bg-yellow-600" }
    return { text: "Cần cải thiện", variant: "destructive" as const, color: "bg-red-600" }
  }

  const badge = getScoreBadge(seoScore.score)

  // Group issues by category
  const groupedIssues = {
    title: seoScore.issues.filter(i => i.category === "title"),
    meta: seoScore.issues.filter(i => i.category === "meta"),
    content: seoScore.issues.filter(i => i.category === "content"),
    structure: seoScore.issues.filter(i => i.category === "structure"),
    image: seoScore.issues.filter(i => i.category === "image"),
    link: seoScore.issues.filter(i => i.category === "link"),
    keyword: seoScore.issues.filter(i => i.category === "keyword"),
  }

  const IssueIcon = ({ type }: { type: string }) => {
    switch (type) {
      case "success": return <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
      case "error": return <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
      case "warning": return <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
      default: return <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-primary">Phân tích SEO</h3>
        <div className="flex items-center gap-3">
          <div className={`text-3xl font-bold ${getScoreColor(seoScore.score)}`}>{seoScore.score}</div>
          <Badge className={`${badge.color} text-white`}>{badge.text}</Badge>
        </div>
      </div>

      {/* Google Search Preview */}
      <div className="mb-6 p-4 bg-secondary/30 rounded-lg border">
        <p className="text-xs text-muted-foreground mb-2">Xem trước Google Search:</p>
        <div className="space-y-1">
          <div className="text-sm text-blue-600 line-clamp-1">{metaTitle || title || "Tiêu đề bài viết..."}</div>
          <div className="text-xs text-emerald-700 line-clamp-1">
            veximglobal.com › blog › {title ? title.toLowerCase().replace(/\s+/g, "-").slice(0, 30) : "slug"}...
          </div>
          <div className="text-sm text-muted-foreground line-clamp-2">
            {metaDescription || excerpt || "Mô tả ngắn của bài viết..."}
          </div>
        </div>
      </div>

      {/* Issues by Category */}
      <div className="space-y-4">
        {/* Title & Meta */}
        {(groupedIssues.title.length > 0 || groupedIssues.meta.length > 0) && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground">Tiêu đề & Meta</h4>
            {[...groupedIssues.title, ...groupedIssues.meta].map((issue, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <IssueIcon type={issue.type} />
                <span>{issue.message}</span>
              </div>
            ))}
          </div>
        )}

        {/* Content & Structure */}
        {(groupedIssues.content.length > 0 || groupedIssues.structure.length > 0) && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground">Nội dung & Cấu trúc</h4>
            {[...groupedIssues.content, ...groupedIssues.structure].map((issue, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <IssueIcon type={issue.type} />
                <span>{issue.message}</span>
              </div>
            ))}
          </div>
        )}

        {/* Images */}
        {groupedIssues.image.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1">
              <Image className="w-4 h-4" /> Hình ảnh
            </h4>
            {groupedIssues.image.map((issue, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <IssueIcon type={issue.type} />
                <span>{issue.message}</span>
              </div>
            ))}
          </div>
        )}

        {/* Links */}
        {groupedIssues.link.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1">
              <Link2 className="w-4 h-4" /> Liên kết
            </h4>
            {groupedIssues.link.map((issue, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <IssueIcon type={issue.type} />
                <span>{issue.message}</span>
              </div>
            ))}
          </div>
        )}

        {/* Keyword */}
        {groupedIssues.keyword.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground">Từ khóa trọng tâm</h4>
            {groupedIssues.keyword.map((issue, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <IssueIcon type={issue.type} />
                <span>{issue.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
