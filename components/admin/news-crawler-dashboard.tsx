"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Play, RefreshCcw, CheckCircle, XCircle, FileText, Globe, Sparkles, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"

const ITEMS_PER_PAGE = 10

interface Article {
  id: string
  source_name: string
  title: string
  source_url: string
  published_date: string
  summary: string
  category: string
  relevance_score: number
  filter_layer: string
  tags: string[]
  status: string
  created_at: string
  content?: string
}

export function NewsCrawlerDashboard() {
  const [loading, setLoading] = useState(false)
  const [loadingSource, setLoadingSource] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [articles, setArticles] = useState<Article[]>([])
  const [loadingArticles, setLoadingArticles] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    loadArticles()
  }, [])

  const loadArticles = async () => {
    setLoadingArticles(true)
    try {
      const response = await fetch("/api/news/list?limit=200")
      const data = await response.json()
      if (data.success) {
        setArticles(data.articles)
      }
    } catch (error) {
      console.error("Error loading articles:", error)
    } finally {
      setLoadingArticles(false)
    }
  }

  const handleCrawl = async (source?: string, daysBack?: number) => {
    setLoading(true)
    setLoadingSource(source || "all")
    setResult(null)

    try {
      const response = await fetch("/api/news/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source, daysBack }),
      })

      const data = await response.json()
      setResult(data)

      if (data.success) {
        await loadArticles()
      }
    } catch (error) {
      console.error("Crawl error:", error)
      setResult({ success: false, error: "Failed to crawl news" })
    } finally {
      setLoading(false)
      setLoadingSource(null)
    }
  }

  const handleUpdateStatus = async (e: React.MouseEvent, articleId: string, status: "approved" | "rejected" | "published") => {
    e.preventDefault()
    e.stopPropagation()
    
    setUpdatingId(articleId)
    try {
      const response = await fetch("/api/news/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId, status }),
      })

      const data = await response.json()
      if (data.success) {
        await loadArticles()
      } else {
        console.error("Failed to update status:", data.error)
      }
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setUpdatingId(null)
    }
  }

  // Filter articles by source
  const filteredArticles = activeTab === "all" 
    ? articles 
    : articles.filter(a => a.source_name === activeTab)

  // Count by source
  const federalRegisterCount = articles.filter(a => a.source_name === "FEDERAL_REGISTER").length
  const fdaCount = articles.filter(a => a.source_name === "FDA").length
  const gaccCount = articles.filter(a => a.source_name === "GACC").length

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // Reset page when tab changes
  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab])

  // Get source badge color
  const getSourceColor = (source: string) => {
    switch (source) {
      case "FEDERAL_REGISTER": return "bg-blue-500 text-white"
      case "FDA": return "bg-green-500 text-white"
      case "GACC": return "bg-orange-500 text-white"
      default: return "bg-gray-500 text-white"
    }
  }

  // Get category badge
  const getCategoryBadge = (category: string) => {
    if (category?.includes("Cosmetics")) return { label: "Cosmetics", color: "bg-pink-100 text-pink-800" }
    if (category?.includes("Drug")) return { label: "Drugs", color: "bg-purple-100 text-purple-800" }
    if (category?.includes("Food")) return { label: "Food", color: "bg-amber-100 text-amber-800" }
    return { label: category, color: "bg-gray-100 text-gray-800" }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            News Crawler Control Panel
          </CardTitle>
          <CardDescription>
            Tự động thu thập tin tức FDA từ Federal Register (Cosmetics, Drugs, Food), FDA.gov và GACC
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              onClick={() => handleCrawl("FEDERAL_REGISTER", 7)} 
              disabled={loading} 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              {loadingSource === "FEDERAL_REGISTER" ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              Federal Register (7 ngày)
            </Button>

            <Button 
              onClick={() => handleCrawl("FDA")} 
              disabled={loading} 
              variant="outline"
              className="flex items-center gap-2"
            >
              {loadingSource === "FDA" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              FDA News
            </Button>

            <Button
              onClick={() => handleCrawl("GACC")}
              disabled={loading}
              variant="outline"
              className="flex items-center gap-2"
            >
              {loadingSource === "GACC" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              GACC News
            </Button>

            <Button
              onClick={() => handleCrawl()}
              disabled={loading}
              variant="secondary"
              className="flex items-center gap-2"
            >
              {loadingSource === "all" ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
              Crawl All Sources
            </Button>
          </div>

          {result && (
            <Card className="mt-4 border-l-4 border-l-green-500">
              <CardContent className="pt-6">
                {result.success ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="font-medium">Crawl hoàn tất</span>
                    </div>
                    {result.results?.map((r: any, idx: number) => (
                      <div key={idx} className="text-sm flex items-center gap-2">
                        <Badge className={getSourceColor(r.source)}>{r.source}</Badge>
                        <span>{r.articlesFiltered || 0} bài mới từ {r.articlesFound || 0} tìm thấy</span>
                        {r.error && <span className="text-red-500">({r.error})</span>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-muted-foreground">{result.error}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Tin tức FDA ({articles.length})</span>
            <div className="flex gap-2 text-sm font-normal">
              <Badge className="bg-blue-500">{federalRegisterCount} Federal Register</Badge>
              <Badge className="bg-green-500">{fdaCount} FDA</Badge>
              <Badge className="bg-orange-500">{gaccCount} GACC</Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Tất cả ({articles.length})</TabsTrigger>
              <TabsTrigger value="FEDERAL_REGISTER">Federal Register ({federalRegisterCount})</TabsTrigger>
              <TabsTrigger value="FDA">FDA ({fdaCount})</TabsTrigger>
              <TabsTrigger value="GACC">GACC ({gaccCount})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {loadingArticles ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : filteredArticles.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Chưa có bài viết nào. Nhấn nút crawl để bắt đầu.
                </p>
              ) : (
                <div className="space-y-3">
                  {paginatedArticles.map((article) => {
                    const categoryBadge = getCategoryBadge(article.category)
                    const isUpdating = updatingId === article.id

                    return (
                      <Card key={article.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="pt-4 space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge className={getSourceColor(article.source_name)}>{article.source_name}</Badge>
                                <Badge className={categoryBadge.color}>{categoryBadge.label}</Badge>
                                {article.relevance_score != null && (
                                  <Badge
                                    variant={
                                      article.relevance_score >= 80
                                        ? "default"
                                        : article.relevance_score >= 60
                                          ? "secondary"
                                          : "outline"
                                    }
                                  >
                                    {article.relevance_score}%
                                  </Badge>
                                )}
                                <Badge
                                  variant={
                                    article.status === "approved"
                                      ? "default"
                                      : article.status === "published"
                                        ? "default"
                                        : article.status === "rejected"
                                          ? "destructive"
                                          : "secondary"
                                  }
                                >
                                  {article.status}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(article.published_date).toLocaleDateString("vi-VN")}
                                </span>
                              </div>

                              <h4 className="font-semibold text-sm leading-tight">
                                <a 
                                  href={article.source_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="hover:text-blue-600 hover:underline inline-flex items-start gap-1"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {article.title}
                                  <ExternalLink className="w-3 h-3 flex-shrink-0 mt-1" />
                                </a>
                              </h4>

                              <p className="text-sm text-muted-foreground">{article.summary}</p>

                              {article.tags && article.tags.length > 0 && (
                                <div className="flex gap-1 flex-wrap">
                                  {article.tags.slice(0, 5).map((kw: string, i: number) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                      {kw}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col gap-2 flex-shrink-0">
                              {article.status === "pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={(e) => handleUpdateStatus(e, article.id, "approved")}
                                    disabled={isUpdating}
                                    className="flex items-center gap-1"
                                  >
                                    {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                                    Duyệt
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={(e) => handleUpdateStatus(e, article.id, "rejected")}
                                    disabled={isUpdating}
                                    className="flex items-center gap-1"
                                  >
                                    {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                                    Bỏ qua
                                  </Button>
                                </>
                              )}

                              {article.status === "approved" && (
                                <Button 
                                  size="sm" 
                                  variant="default" 
                                  onClick={(e) => handleUpdateStatus(e, article.id, "published")}
                                  disabled={isUpdating}
                                >
                                  {isUpdating ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                                  Xuất bản
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        Hiển thị {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredArticles.length)} / {filteredArticles.length} bài viết
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Trước
                        </Button>
                        <span className="text-sm px-2">
                          Trang {currentPage} / {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Sau
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Nguồn dữ liệu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Badge className="bg-blue-500 text-white">Federal Register</Badge>
                <div>
                  <h4 className="font-semibold text-sm">Cơ quan đăng ký liên bang Mỹ</h4>
                  <p className="text-sm text-muted-foreground">
                    Thu thập quy định FDA về: Cosmetics (MoCRA), Drugs, Food Safety
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    API: federalregister.gov/api/v1
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Badge className="bg-green-500 text-white">FDA.gov</Badge>
                <div>
                  <h4 className="font-semibold text-sm">FDA Press Announcements</h4>
                  <p className="text-sm text-muted-foreground">
                    Thông báo báo chí, cảnh báo an toàn thực phẩm từ FDA
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Badge className="bg-orange-500 text-white">GACC</Badge>
                <div>
                  <h4 className="font-semibold text-sm">Tổng cục Hải quan Trung Quốc</h4>
                  <p className="text-sm text-muted-foreground">
                    Quy định xuất nhập khẩu, đăng ký cơ sở với Trung Quốc
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Hệ thống lọc 3 lớp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Badge variant="outline">Tier 1</Badge>
                <div>
                  <h4 className="font-semibold text-sm">API Query Filter</h4>
                  <p className="text-sm text-muted-foreground">
                    Lọc theo từ khóa cosmetic, drug, food trực tiếp từ Federal Register API
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Badge variant="outline">Tier 2</Badge>
                <div>
                  <h4 className="font-semibold text-sm">AI Phân tích & Tóm tắt</h4>
                  <p className="text-sm text-muted-foreground">
                    ChatGPT tóm tắt tiếng Việt, đánh giá mức độ liên quan, trích xuất key points
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Badge variant="outline">Tier 3</Badge>
                <div>
                  <h4 className="font-semibold text-sm">Admin Review</h4>
                  <p className="text-sm text-muted-foreground">
                    Xem xét và duyệt bài trước khi xuất bản cho khách hàng
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cron Job tự động</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">
                Hệ thống tự động crawl tin tức mỗi ngày lúc <strong>6:00 AM UTC</strong> (13:00 giờ Việt Nam)
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Endpoint: /api/news/cron (yêu cầu CRON_SECRET)
              </p>
            </div>
            <Badge variant="secondary">Tự động</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
