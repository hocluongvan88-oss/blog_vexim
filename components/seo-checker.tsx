"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, AlertTriangle, Info } from "lucide-react"
import { useEffect, useState } from "react"

interface SEOScore {
  score: number
  issues: {
    type: "error" | "warning" | "success" | "info"
    message: string
  }[]
}

interface SEOCheckerProps {
  title: string
  excerpt: string
  content: string
  metaTitle: string
  metaDescription: string
  featuredImage: string
}

export function SEOChecker({ title, excerpt, content, metaTitle, metaDescription, featuredImage }: SEOCheckerProps) {
  const [seoScore, setSeoScore] = useState<SEOScore>({ score: 0, issues: [] })

  useEffect(() => {
    analyzeSEO()
  }, [title, excerpt, content, metaTitle, metaDescription, featuredImage])

  const analyzeSEO = () => {
    const issues: SEOScore["issues"] = []
    let score = 100

    // Check title length
    const titleToCheck = metaTitle || title
    if (!titleToCheck) {
      issues.push({ type: "error", message: "Tiêu đề bài viết không được để trống" })
      score -= 20
    } else if (titleToCheck.length < 30) {
      issues.push({ type: "warning", message: "Tiêu đề quá ngắn. Nên từ 30-60 ký tự để tối ưu SEO" })
      score -= 10
    } else if (titleToCheck.length > 60) {
      issues.push({ type: "warning", message: "Tiêu đề quá dài. Google có thể cắt bớt trong kết quả tìm kiếm" })
      score -= 10
    } else {
      issues.push({ type: "success", message: "Độ dài tiêu đề tối ưu (30-60 ký tự)" })
    }

    // Check meta description
    const descToCheck = metaDescription || excerpt
    if (!descToCheck) {
      issues.push({ type: "error", message: "Meta description không được để trống" })
      score -= 15
    } else if (descToCheck.length < 120) {
      issues.push({ type: "warning", message: "Meta description quá ngắn. Nên từ 120-160 ký tự" })
      score -= 10
    } else if (descToCheck.length > 160) {
      issues.push({ type: "warning", message: "Meta description quá dài. Google có thể cắt bớt" })
      score -= 10
    } else {
      issues.push({ type: "success", message: "Meta description tối ưu (120-160 ký tự)" })
    }

    // Check content length
    const contentText = content.replace(/<[^>]*>/g, "").trim()
    const wordCount = contentText.split(/\s+/).filter((w) => w.length > 0).length

    if (!content || wordCount < 100) {
      issues.push({ type: "error", message: `Nội dung quá ngắn (${wordCount} từ). Nên có ít nhất 300 từ` })
      score -= 20
    } else if (wordCount < 300) {
      issues.push({ type: "warning", message: `Nội dung hơi ngắn (${wordCount} từ). Nên có ít nhất 300 từ` })
      score -= 10
    } else {
      issues.push({ type: "success", message: `Độ dài nội dung tốt (${wordCount} từ)` })
    }

    // Check headings
    const h2Count = (content.match(/<h2>/gi) || []).length
    const h3Count = (content.match(/<h3>/gi) || []).length

    if (h2Count === 0 && h3Count === 0) {
      issues.push({ type: "warning", message: "Nên sử dụng heading (H2, H3) để cấu trúc nội dung" })
      score -= 10
    } else {
      issues.push({ type: "success", message: `Có ${h2Count} H2 và ${h3Count} H3 trong bài viết` })
    }

    // Check featured image
    if (!featuredImage) {
      issues.push({ type: "warning", message: "Nên thêm ảnh bìa để tăng tương tác" })
      score -= 10
    } else {
      issues.push({ type: "success", message: "Đã có ảnh bìa" })
    }

    // Check images in content
    const imgCount = (content.match(/<img/gi) || []).length
    if (wordCount > 500 && imgCount === 0) {
      issues.push({ type: "info", message: "Với bài dài, nên thêm ảnh minh họa vào nội dung" })
    }

    // Check links
    const linkCount = (content.match(/<a /gi) || []).length
    if (linkCount === 0) {
      issues.push({ type: "info", message: "Có thể thêm liên kết nội bộ hoặc tham khảo" })
    } else {
      issues.push({ type: "success", message: `Có ${linkCount} liên kết trong bài` })
    }

    setSeoScore({ score: Math.max(0, score), issues })
  }

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
            vexim.vn › blog › {title ? title.toLowerCase().replace(/\s+/g, "-") : "slug"}
          </div>
          <div className="text-sm text-muted-foreground line-clamp-2">
            {metaDescription || excerpt || "Mô tả ngắn của bài viết..."}
          </div>
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground mb-3">Đánh giá chi tiết:</p>
        {seoScore.issues.map((issue, index) => (
          <div key={index} className="flex items-start gap-3">
            {issue.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />}
            {issue.type === "error" && <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />}
            {issue.type === "warning" && <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />}
            {issue.type === "info" && <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />}
            <span className="text-sm leading-relaxed">{issue.message}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
