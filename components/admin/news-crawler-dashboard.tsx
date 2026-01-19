"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Play, RefreshCcw, CheckCircle, XCircle } from "lucide-react"

interface Article {
  id: string
  source: string
  title: string
  url: string
  published_date: string
  summary: string
  category: string
  relevance_score: number
  filter_layer: string
  keywords: string[]
  status: string
  created_at: string
}

export function NewsCrawlerDashboard() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [articles, setArticles] = useState<Article[]>([])
  const [loadingArticles, setLoadingArticles] = useState(false)

  useEffect(() => {
    loadArticles()
  }, [])

  const loadArticles = async () => {
    setLoadingArticles(true)
    try {
      const response = await fetch("/api/news/list?limit=20")
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

  const handleCrawl = async (source?: string) => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/news/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source }),
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
    }
  }

  const handleUpdateStatus = async (articleId: string, status: "approved" | "rejected" | "published") => {
    try {
      const response = await fetch("/api/news/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId, status }),
      })

      const data = await response.json()
      if (data.success) {
        await loadArticles()
      }
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>News Crawler Control Panel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <Button onClick={() => handleCrawl("FDA")} disabled={loading} className="flex items-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              Crawl FDA News
            </Button>

            <Button
              onClick={() => handleCrawl("GACC")}
              disabled={loading}
              variant="outline"
              className="flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              Crawl GACC News
            </Button>

            <Button
              onClick={() => handleCrawl()}
              disabled={loading}
              variant="secondary"
              className="flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
              Crawl All Sources
            </Button>
          </div>

          {result && (
            <Card className="mt-4">
              <CardContent className="pt-6">
                {result.success ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="default">Success</Badge>
                    </div>
                    {result.results?.map((r: any, idx: number) => (
                      <div key={idx} className="text-sm">
                        <strong>{r.source}:</strong> {r.articlesFiltered} articles added from {r.articlesFound} found
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">Error</Badge>
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
          <CardTitle>Recent Articles ({articles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingArticles ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : articles.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Chưa có bài viết nào. Nhấn nút crawl để bắt đầu.
            </p>
          ) : (
            <div className="space-y-3">
              {articles.map((article) => (
                <Card key={article.id}>
                  <CardContent className="pt-6 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline">{article.source}</Badge>
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
                        </div>

                        <h4 className="font-semibold text-sm">
                          <a href={article.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {article.title}
                          </a>
                        </h4>

                        <p className="text-xs text-muted-foreground">{article.summary}</p>

                        <div className="flex gap-1 flex-wrap">
                          {article.keywords?.slice(0, 5).map((kw: string) => (
                            <Badge key={kw} variant="outline" className="text-xs">
                              {kw}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {article.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleUpdateStatus(article.id, "approved")}
                            className="flex items-center gap-1"
                          >
                            <CheckCircle className="w-3 h-3" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleUpdateStatus(article.id, "rejected")}
                            className="flex items-center gap-1"
                          >
                            <XCircle className="w-3 h-3" />
                            Reject
                          </Button>
                        </div>
                      )}

                      {article.status === "approved" && (
                        <Button size="sm" variant="default" onClick={() => handleUpdateStatus(article.id, "published")}>
                          Publish
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3-Tier Filtering System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Badge className="mt-1">Tier 1</Badge>
              <div>
                <h4 className="font-semibold text-sm">Keyword Filtering</h4>
                <p className="text-sm text-muted-foreground">
                  Lọc nhanh theo từ khóa: FDA, GACC, food, export, import, regulation, seafood, agricultural...
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge className="mt-1">Tier 2</Badge>
              <div>
                <h4 className="font-semibold text-sm">AI Relevance Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  ChatGPT phân tích nội dung, đánh giá mức độ liên quan (high, medium, low) và phân loại category
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge className="mt-1">Tier 3</Badge>
              <div>
                <h4 className="font-semibold text-sm">Detailed Validation</h4>
                <p className="text-sm text-muted-foreground">
                  Structured output với điểm số chi tiết, key points, sản phẩm ảnh hưởng, deadline, yêu cầu hành động
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
