"use client"

import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface SearchResult {
  id: string
  title: string
  excerpt: string
  slug: string
  category: string
  featured_image: string
}

export function BlogSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      setShowResults(false)
      return
    }

    const timer = setTimeout(async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/blog/search?q=${encodeURIComponent(query)}`)
        const data = await response.json()
        setResults(data.results || [])
        setShowResults(true)
      } catch (error) {
        console.error("[v0] Search error:", error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const handleClear = () => {
    setQuery("")
    setResults([])
    setShowResults(false)
  }

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Tìm kiếm bài viết..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10 h-12 text-base bg-white border-2 focus:border-primary"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border-2 border-primary/20 max-h-[500px] overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-6 text-center text-muted-foreground">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
              Đang tìm kiếm...
            </div>
          ) : results.length > 0 ? (
            <div className="p-2">
              <div className="text-xs text-muted-foreground px-3 py-2 font-medium">
                Tìm thấy {results.length} kết quả
              </div>
              {results.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  onClick={() => {
                    setShowResults(false)
                    setQuery("")
                  }}
                  className="block"
                >
                  <Card className="p-4 mb-2 hover:bg-secondary/50 transition-colors cursor-pointer border-0 shadow-none">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={post.featured_image || "/placeholder.svg?height=80&width=80"}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-accent font-medium mb-1">{post.category}</div>
                        <h4 className="font-bold text-sm mb-1 line-clamp-2 text-primary">{post.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">{post.excerpt}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">Không tìm thấy bài viết nào phù hợp</p>
              <p className="text-sm text-muted-foreground mt-2">Thử tìm kiếm với từ khóa khác</p>
            </div>
          )}
        </div>
      )}

      {/* Overlay to close results when clicking outside */}
      {showResults && <div className="fixed inset-0 z-40" onClick={() => setShowResults(false)} />}
    </div>
  )
}
