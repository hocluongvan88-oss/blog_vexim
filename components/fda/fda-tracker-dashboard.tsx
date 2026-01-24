"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { AlertTriangle, Calendar, Building2, FileText, Bell, Mail, Lock, Loader2, Shield } from "lucide-react"
import type { FDACategory, FDAItem } from "@/types/fda"
import { FDASubscriptionDialog } from "@/components/fda/fda-subscription-dialog"
import { fdaApi } from "@/lib/fda-api"

const FREE_ITEMS_LIMIT = 3

export function FDATrackerDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<FDACategory>("food")
  const [items, setItems] = useState<FDAItem[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadFDAData()
  }, [selectedCategory])

  async function loadFDAData() {
    setLoading(true)
    try {
      const endpoint = selectedCategory === "cosmetic" ? "event" : "enforcement"
      console.log("[v0] Loading FDA data for category:", selectedCategory, "endpoint:", endpoint)

      // Try API route first (with caching)
      try {
        const response = await fetch(
          `/api/fda/items?category=${selectedCategory}&endpoint=${endpoint}&limit=10`
        )

        if (response.ok) {
          const result = await response.json()
          console.log("[v0] FDA API result from route:", result)

          if (result && result.items) {
            console.log("[v0] Setting items:", result.items.length, "total:", result.total)
            setItems(result.items)
            setTotalCount(result.total)
            return
          }
        } else {
          console.log("[v0] API route returned:", response.status, "- falling back to direct FDA API")
        }
      } catch (routeError) {
        console.log("[v0] API route error - falling back to direct FDA API:", routeError)
      }

      // Fallback: Call FDA API directly (no caching)
      console.log("[v0] Falling back to direct FDA API call")
      const result = await fdaApi.getFDAItems(selectedCategory, endpoint, {}, 10)

      if (result) {
        console.log("[v0] Setting items from direct API:", result.items.length, "total:", result.total)
        setItems(result.items)
        setTotalCount(result.total)
      } else {
        console.log("[v0] No result from FDA API")
        setItems([])
        setTotalCount(0)
      }
    } catch (error) {
      console.error("[v0] Error loading FDA data:", error)
      setItems([])
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }

  const visibleItems = items.slice(0, FREE_ITEMS_LIMIT)
  const lockedItemsCount = Math.max(0, totalCount - FREE_ITEMS_LIMIT)

  const filteredVisibleItems = searchTerm
    ? visibleItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.criticalInfo.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : visibleItems

  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 sm:p-3 bg-blue-600 rounded-lg">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              FDA Tracker
            </h1>
            <p className="text-sm sm:text-base text-slate-600">
              Theo dõi cảnh báo FDA realtime từ Mỹ
            </p>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-6">
          <Badge variant="outline" className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm">
            <Bell className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Cập nhật 24/7
          </Badge>
          <Badge variant="outline" className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm">
            <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Nguồn: FDA.gov
          </Badge>
          <Badge variant="outline" className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm">
            <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Tóm tắt bằng AI
          </Badge>
        </div>

        {/* Search Bar */}
        <div className="max-w-md">
          <Input
            type="search"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as FDACategory)}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 h-auto p-1 mb-8">
          <TabsTrigger value="food" className="text-xs sm:text-sm py-2">
            Thực phẩm
          </TabsTrigger>
          <TabsTrigger value="drug" className="text-xs sm:text-sm py-2">
            Dược phẩm
          </TabsTrigger>
          <TabsTrigger value="cosmetic" className="text-xs sm:text-sm py-2">
            Mỹ phẩm
          </TabsTrigger>
          <TabsTrigger value="device" className="text-xs sm:text-sm py-2">
            Thiết bị
          </TabsTrigger>
        </TabsList>

        {/* Results Section */}
        <TabsContent value={selectedCategory} className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-slate-600">Đang tải dữ liệu từ FDA...</span>
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-600">Tổng cảnh báo</p>
                    <p className="text-xl sm:text-2xl font-bold text-slate-900">
                      {totalCount.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs sm:text-sm text-slate-600">Giới hạn</p>
                    <p className="text-xl sm:text-2xl font-bold text-blue-600">
                      {FREE_ITEMS_LIMIT}
                    </p>
                  </div>
                </div>
              </div>

              {/* Visible Items */}
              <div className="grid gap-4">
                {filteredVisibleItems.length > 0 ? (
                  filteredVisibleItems.map((item, index) => (
                    <FDAItemCard key={item.id} item={item} index={index + 1} />
                  ))
                ) : (
                  <Card className="p-8 text-center">
                    <p className="text-slate-600">
                      {searchTerm ? "Không tìm thấy kết quả phù hợp" : "Không có dữ liệu"}
                    </p>
                    <p className="text-sm text-slate-500 mt-2">
                      Items: {items.length}, Total: {totalCount}
                    </p>
                  </Card>
                )}
              </div>

              {/* Gated Content Blur Effect */}
              {lockedItemsCount > 0 && (
                <div className="relative mt-8 mb-8">
                  {/* Blurred Preview Cards */}
                  <div className="space-y-4 blur-sm pointer-events-none select-none">
                    {[1, 2].map((i) => (
                      <Card key={i} className="p-4 sm:p-6 border-slate-200">
                        <div className="space-y-2">
                          <div className="h-4 bg-slate-200 rounded w-3/4" />
                          <div className="h-4 bg-slate-200 rounded w-1/2" />
                          <div className="h-4 bg-slate-200 rounded w-5/6" />
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Call to Action Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md p-4 sm:p-6 md:p-8 shadow-xl bg-white/95 backdrop-blur border-2 border-blue-600">
                      <div className="text-center">
                        <div className="mb-3 sm:mb-4 inline-flex p-3 sm:p-4 bg-blue-100 rounded-full">
                          <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mb-2">
                          Còn {lockedItemsCount} cảnh báo
                        </h3>
                        <p className="text-xs sm:text-sm md:text-base text-slate-600 mb-4 sm:mb-6">
                          Đăng ký email để nhận <strong>{totalCount} cảnh báo</strong> theo ngành hàng của bạn, tóm tắt bằng tiếng Việt và
                          thông báo tự động.
                        </p>
                        <Button
                          onClick={() => setShowSubscriptionDialog(true)}
                          size="lg"
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base"
                        >
                          <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                          Đăng ký miễn phí
                        </Button>
                        <p className="text-xs text-slate-500 mt-3 sm:mt-4">
                          Không spam. Hủy đăng ký bất cứ lúc nào.
                        </p>
                      </div>
                    </Card>
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Subscription Dialog */}
      <FDASubscriptionDialog open={showSubscriptionDialog} onOpenChange={setShowSubscriptionDialog} />
    </div>
  )
}

function FDAItemCard({ item, index }: { item: FDAItem; index: number }) {
  // Status color mapping
  const getStatusColor = (classification?: string) => {
    if (!classification) return "bg-slate-100 text-slate-700"
    if (classification.includes("I"))
      return "bg-red-100 text-red-700 border-red-300"
    if (classification.includes("II"))
      return "bg-orange-100 text-orange-700 border-orange-300"
    return "bg-yellow-100 text-yellow-700 border-yellow-300"
  }

  // Format distribution pattern to be concise
  const formatDistribution = (distribution?: string) => {
    if (!distribution) return null

    // Check if it starts with "Worldwide"
    if (distribution.toLowerCase().startsWith("worldwide")) {
      // Count number of countries/states mentioned
      const countryCount = (distribution.match(/,/g) || []).length
      if (countryCount > 10) {
        return "Worldwide (80+ countries)"
      }
      return "Worldwide"
    }

    // For US-only distributions
    if (distribution.toLowerCase().includes("us nationwide")) {
      const stateCount = (distribution.match(/[A-Z]{2}/g) || []).length
      return `US Nationwide (${stateCount} states)`
    }

    // Truncate long text
    if (distribution.length > 50) {
      return distribution.substring(0, 47) + "..."
    }

    return distribution
  }

  return (
    <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow border-slate-200">
      <div className="flex gap-3 sm:gap-4">
        {/* Index Number */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-700 font-bold text-sm sm:text-base">
              {index}
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <h3 className="font-semibold text-base sm:text-lg text-slate-900 leading-tight line-clamp-2">
              {item.title}
            </h3>
            {item.classification && (
              <Badge
                className={`flex-shrink-0 w-fit ${getStatusColor(item.classification)}`}
              >
                {item.classification}
              </Badge>
            )}
          </div>

          {/* Critical Info */}
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-md p-2 sm:p-3">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-red-900 leading-relaxed line-clamp-3">
              {item.criticalInfo}
            </p>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-slate-600">
            {item.date && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{new Date(item.date).toLocaleDateString("vi-VN")}</span>
              </div>
            )}
            {item.manufacturer && (
              <div className="flex items-center gap-1 min-w-0">
                <Building2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="truncate max-w-[150px] sm:max-w-none">
                  {item.manufacturer}
                </span>
              </div>
            )}
            {item.distributionPattern &&
              formatDistribution(item.distributionPattern) && (
                <Badge variant="outline" className="text-xs">
                  {formatDistribution(item.distributionPattern)}
                </Badge>
              )}
          </div>

          {/* AI Summary (if available) */}
          {item.aiSummary && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-2 sm:p-3">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                <strong className="text-blue-700">Tóm tắt AI:</strong>{" "}
                {item.aiSummary}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
