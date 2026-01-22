"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { AlertTriangle, Calendar, Building2, FileText, Bell, Mail, Lock, Loader2, Shield } from "lucide-react"
import type { FDACategory, FDAItem } from "@/types/fda"
import { fdaApi } from "@/lib/fda-api"
import { FDASubscriptionDialog } from "@/components/fda/fda-subscription-dialog"

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

      const result = await fdaApi.getFDAItems(selectedCategory, endpoint, {}, 10)

      if (result) {
        setItems(result.items)
        setTotalCount(result.total)
      }
    } catch (error) {
      console.error("Error loading FDA data:", error)
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
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-600 rounded-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">FDA Tracker</h1>
            <p className="text-slate-600">Theo dõi cảnh báo FDA realtime từ Mỹ</p>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Badge variant="outline" className="px-3 py-1.5">
            <Bell className="w-4 h-4 mr-2" />
            Cập nhật 24/7
          </Badge>
          <Badge variant="outline" className="px-3 py-1.5">
            <FileText className="w-4 h-4 mr-2" />
            Nguồn: FDA.gov
          </Badge>
          <Badge variant="outline" className="px-3 py-1.5">
            <Mail className="w-4 h-4 mr-2" />
            Tóm tắt bằng AI
          </Badge>
        </div>

        {/* Search Bar */}
        <div className="max-w-md">
          <Input
            type="search"
            placeholder="Tìm kiếm sản phẩm hoặc nhà sản xuất..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as FDACategory)}>
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="food">
            <span className="text-base">Thực phẩm</span>
          </TabsTrigger>
          <TabsTrigger value="drug">
            <span className="text-base">Dược phẩm</span>
          </TabsTrigger>
          <TabsTrigger value="cosmetic">
            <span className="text-base">Mỹ phẩm</span>
          </TabsTrigger>
          <TabsTrigger value="device">
            <span className="text-base">Thiết bị</span>
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
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Tổng số cảnh báo</p>
                    <p className="text-2xl font-bold text-slate-900">{totalCount.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600">Hiển thị miễn phí</p>
                    <p className="text-2xl font-bold text-blue-600">{FREE_ITEMS_LIMIT}</p>
                  </div>
                </div>
              </div>

              {/* Visible Items */}
              <div className="grid gap-4">
                {filteredVisibleItems.map((item, index) => (
                  <FDAItemCard key={item.id} item={item} index={index + 1} />
                ))}
              </div>

              {/* Gated Content Blur Effect */}
              {lockedItemsCount > 0 && (
                <div className="relative mt-8 mb-12 md:mb-8">
                  {/* Blurred Preview Cards */}
                  <div className="space-y-4 blur-sm pointer-events-none">
                    {[1, 2].map((i) => (
                      <Card key={i} className="p-6 border-slate-200">
                        <div className="space-y-2">
                          <div className="h-4 bg-slate-200 rounded w-3/4" />
                          <div className="h-4 bg-slate-200 rounded w-1/2" />
                          <div className="h-4 bg-slate-200 rounded w-5/6" />
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Call to Action Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Card className="max-w-md p-8 shadow-xl bg-white/95 backdrop-blur border-2 border-blue-600">
                      <div className="text-center">
                        <div className="mb-4 inline-flex p-4 bg-blue-100 rounded-full">
                          <Lock className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Còn {lockedItemsCount} cảnh báo</h3>
                        <p className="text-slate-600 mb-6">
                          Đăng ký email để nhận <strong> {totalCount} cảnh báo</strong> theo nhóm ngành hàng của bạn, ngôn ngữ đã được dịch sang tiếng Việt.
                        </p>
                        <Button
                          onClick={() => setShowSubscriptionDialog(true)}
                          size="lg"
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Mail className="w-5 h-5 mr-2" />
                          Đăng ký nhận thông báo miễn phí
                        </Button>
                        <p className="text-xs text-slate-500 mt-4">
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
    if (classification.includes("I")) return "bg-red-100 text-red-700 border-red-300"
    if (classification.includes("II")) return "bg-orange-100 text-orange-700 border-orange-300"
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
    <Card className="p-6 hover:shadow-lg transition-shadow border-slate-200">
      <div className="flex gap-4">
        {/* Index Number */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-700 font-bold">{index}</span>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-semibold text-lg text-slate-900 leading-tight">{item.title}</h3>
            {item.classification && (
              <Badge className={`flex-shrink-0 ${getStatusColor(item.classification)}`}>{item.classification}</Badge>
            )}
          </div>

          {/* Critical Info */}
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-md p-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-900 leading-relaxed">{item.criticalInfo}</p>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
            {item.date && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{new Date(item.date).toLocaleDateString("vi-VN")}</span>
              </div>
            )}
            {item.manufacturer && (
              <div className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                <span>{item.manufacturer}</span>
              </div>
            )}
            {item.distributionPattern && formatDistribution(item.distributionPattern) && (
              <Badge variant="outline" className="text-xs">
                {formatDistribution(item.distributionPattern)}
              </Badge>
            )}
          </div>

          {/* AI Summary (if available) */}
          {item.aiSummary && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-sm text-slate-700 leading-relaxed">
                <strong className="text-blue-700">Tóm tắt AI:</strong> {item.aiSummary}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
