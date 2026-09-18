"use client"

import type React from "react"
import { useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, AlertTriangle, Info, Image as ImageIcon, Link2, ExternalLink, Sparkles } from "lucide-react"
import type { Block } from "@/components/block-editor/types"
import { analyzePostSeo, type SeoIssue, type IssueSeverity } from "@/lib/seo-analysis"
import { useImageDimensions, isDiscoverReady } from "@/hooks/use-image-dimensions"

interface SEOCheckerProps {
  title: string
  excerpt: string
  metaTitle: string
  metaDescription: string
  featuredImage: string
  featuredImageAlt?: string
  focusKeyword?: string
  slug?: string
  blocks?: Block[]
  publishedAt?: string | null
  updatedAt?: string | null
  /** Các bài khác để phát hiện trùng chủ đề */
  otherPosts?: Array<{ id?: string; title: string; focus_keyword?: string | null }>
  /** Bấm "Sửa ngay" -> cuộn tới đúng khối */
  onFocusBlock?: (blockId: string) => void
}

const SEVERITY_ORDER: Record<IssueSeverity, number> = { error: 0, warning: 1, info: 2, success: 3 }

function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-600"
  if (score >= 60) return "text-yellow-600"
  return "text-red-600"
}

function scoreBar(score: number): string {
  if (score >= 80) return "bg-emerald-500"
  if (score >= 60) return "bg-yellow-500"
  return "bg-red-500"
}

function scoreLabel(score: number): string {
  if (score >= 80) return "Tốt"
  if (score >= 60) return "Khá"
  return "Cần cải thiện"
}

function IssueIcon({ severity }: { severity: IssueSeverity }) {
  switch (severity) {
    case "success":
      return <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
    case "error":
      return <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
    case "warning":
      return <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
    default:
      return <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
  }
}

export function SEOChecker({
  title,
  excerpt,
  metaTitle,
  metaDescription,
  featuredImage,
  featuredImageAlt = "",
  focusKeyword = "",
  slug = "",
  blocks = [],
  publishedAt = null,
  updatedAt = null,
  otherPosts = [],
  onFocusBlock,
}: SEOCheckerProps) {
  // Đo kích thước ảnh bìa để kiểm tra điều kiện Discover (≥1200px, >300.000 pixel)
  const featuredImageDimensions = useImageDimensions(featuredImage)

  const analysis = useMemo(
    () =>
      analyzePostSeo({
        title,
        excerpt,
        metaTitle,
        metaDescription,
        focusKeyword,
        slug,
        featuredImage,
        featuredImageAlt,
        blocks,
        publishedAt,
        updatedAt,
        otherPosts,
      }),
    [
      title,
      excerpt,
      metaTitle,
      metaDescription,
      focusKeyword,
      slug,
      featuredImage,
      featuredImageAlt,
      blocks,
      publishedAt,
      updatedAt,
      otherPosts,
    ],
  )

  const { scores, issues: rawIssues, counts, info } = analysis

  const issues = useMemo(() => {
    if (!featuredImage || !featuredImageDimensions) return rawIssues
    if (isDiscoverReady(featuredImageDimensions)) return rawIssues

    return [
      ...rawIssues,
      {
        severity: "warning" as IssueSeverity,
        category: "image",
        message: `Ảnh bìa ${featuredImageDimensions.width}×${featuredImageDimensions.height}px chưa đạt chuẩn Google Discover (cần ≥1200px ngang, >300.000 pixel)`,
        action: "Dùng ảnh lớn hơn — ảnh nhỏ chỉ hiện dạng thumbnail nhỏ trong Discover",
      },
    ]
  }, [rawIssues, featuredImage, featuredImageDimensions])

  // Chỉ hiện việc cần làm trước, việc đã đạt gom xuống dưới
  const todoIssues = useMemo(
    () =>
      issues
        .filter((issue) => issue.severity !== "success")
        .sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]),
    [issues],
  )
  const doneIssues = useMemo(() => issues.filter((issue) => issue.severity === "success"), [issues])

  const grouped = useMemo(() => {
    const groups: Record<string, SeoIssue[]> = {}
    for (const issue of todoIssues) {
      groups[issue.category] = groups[issue.category] || []
      groups[issue.category].push(issue)
    }
    return groups
  }, [todoIssues])

  const categoryLabels: Record<string, string> = {
    title: "Tiêu đề",
    meta: "Meta description",
    content: "Nội dung",
    structure: "Cấu trúc heading",
    ai: "Khả năng được AI trích dẫn",
    sources: "Nguồn & độ tin cậy",
    link: "Liên kết",
    image: "Hình ảnh",
    keyword: "Từ khóa trọng tâm",
    duplicate: "Trùng chủ đề",
    freshness: "Độ mới",
    slug: "Đường dẫn",
  }

  const categoryIcons: Record<string, React.ReactNode> = {
    image: <ImageIcon className="w-4 h-4" />,
    link: <Link2 className="w-4 h-4" />,
    sources: <ExternalLink className="w-4 h-4" />,
    ai: <Sparkles className="w-4 h-4" />,
  }

  const errorCount = issues.filter((issue) => issue.severity === "error").length
  const warningCount = issues.filter((issue) => issue.severity === "warning").length

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-primary">Phân tích SEO</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {errorCount > 0 && <span className="text-red-600 font-medium">{errorCount} lỗi · </span>}
            {warningCount > 0 && <span className="text-yellow-600 font-medium">{warningCount} cảnh báo · </span>}
            {counts.words} từ · {info.readingMinutes} phút đọc
          </p>
        </div>
      </div>

      {/* Hai thang điểm độc lập: kỹ thuật (bắt buộc) và khả năng được AI trích dẫn */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-lg border p-3">
          <div className="flex items-center justify-between">
            <span className={`text-2xl font-bold ${scoreColor(scores.technical)}`}>{scores.technical}</span>
            <Badge variant="secondary" className="text-[10px]">
              {scoreLabel(scores.technical)}
            </Badge>
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">SEO kỹ thuật</div>
          <div className="h-1.5 rounded-full bg-muted mt-2 overflow-hidden">
            <div className={`h-full ${scoreBar(scores.technical)}`} style={{ width: `${scores.technical}%` }} />
          </div>
        </div>

        <div className="rounded-lg border p-3">
          <div className="flex items-center justify-between">
            <span className={`text-2xl font-bold ${scoreColor(scores.readiness)}`}>{scores.readiness}</span>
            <Badge variant="secondary" className="text-[10px]">
              {scoreLabel(scores.readiness)}
            </Badge>
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">Answer-readiness (AI)</div>
          <div className="h-1.5 rounded-full bg-muted mt-2 overflow-hidden">
            <div className={`h-full ${scoreBar(scores.readiness)}`} style={{ width: `${scores.readiness}%` }} />
          </div>
        </div>
      </div>

      {/* Tóm tắt nhanh các chỉ số AI quan tâm */}
      <div className="grid grid-cols-3 gap-2 mb-5 text-center">
        <div className={`rounded-md border p-2 ${counts.hasAnswerFirstIntro ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}>
          <div className="text-sm font-semibold">{counts.hasAnswerFirstIntro ? "✓" : "—"}</div>
          <div className="text-[10px] text-muted-foreground leading-tight">Mở bài trả lời trực tiếp</div>
        </div>
        <div className={`rounded-md border p-2 ${counts.hasSources ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}>
          <div className="text-sm font-semibold">{counts.hasSources ? "✓" : "—"}</div>
          <div className="text-[10px] text-muted-foreground leading-tight">Nguồn chính thống</div>
        </div>
        <div className={`rounded-md border p-2 ${counts.hasFaq ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}>
          <div className="text-sm font-semibold">{counts.hasFaq ? "✓" : "—"}</div>
          <div className="text-[10px] text-muted-foreground leading-tight">Mục FAQ</div>
        </div>
      </div>

      {/* Xem trước Google Search */}
      <div className="mb-5 p-4 bg-secondary/30 rounded-lg border">
        <p className="text-xs text-muted-foreground mb-2">Xem trước Google Search (≈600px):</p>
        <div className="space-y-1">
          <div className="text-xs text-emerald-700 line-clamp-1">
            veximglobal.com › blog › {slug || "duong-dan-bai-viet"}
          </div>
          <div className="text-base text-blue-700 line-clamp-2">
            {analysis.info.titleLength > 0 ? metaTitle || title : "Tiêu đề bài viết..."}
          </div>
          <div className="text-sm text-muted-foreground line-clamp-2">
            {metaDescription || excerpt || "Mô tả ngắn của bài viết..."}
          </div>
        </div>
        <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
          <span>Tiêu đề ~{info.titlePixelWidth}px / 600px</span>
          <span>·</span>
          <span>Mô tả {info.descriptionLength} / 158 ký tự</span>
        </div>
      </div>

      {/* Việc cần làm, nhóm theo chủ đề */}
      {todoIssues.length === 0 ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          Không còn việc nào cần xử lý trước khi xuất bản. 🎉
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([category, categoryIssues]) => (
            <div key={category} className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                {categoryIcons[category]}
                {categoryLabels[category] ?? category}
              </h4>
              {categoryIssues.map((issue, index) => (
                <div key={`${category}-${index}`} className="flex items-start gap-2 text-sm">
                  <IssueIcon severity={issue.severity} />
                  <div className="flex-1">
                    <div>{issue.message}</div>
                    {issue.action && <div className="text-xs text-muted-foreground mt-0.5">→ {issue.action}</div>}
                  </div>
                  {issue.blockId && onFocusBlock && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 px-2 text-[11px] bg-transparent flex-shrink-0"
                      onClick={() => onFocusBlock(issue.blockId as string)}
                    >
                      Sửa ngay
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Đã đạt */}
      {doneIssues.length > 0 && (
        <details className="mt-4 group">
          <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
            Đã đạt ({doneIssues.length})
          </summary>
          <div className="mt-2 space-y-1.5">
            {doneIssues.map((issue, index) => (
              <div key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{issue.message}</span>
              </div>
            ))}
          </div>
        </details>
      )}
    </Card>
  )
}
