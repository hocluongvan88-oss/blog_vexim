"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, X, ExternalLink, ChevronUp } from "lucide-react"
import Link from "next/link"
import { fdaApi } from "@/lib/fda-api"

export function FDAAlertBadge() {
  const [latestAlerts, setLatestAlerts] = useState<number>(0)
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    // Check if user has dismissed the badge in this session
    const isDismissed = sessionStorage.getItem("fda-badge-dismissed")
    if (isDismissed) {
      setDismissed(true)
      return
    }

    loadLatestAlertCount()
  }, [])

  async function loadLatestAlertCount() {
    try {
      // Fetch latest food enforcement alerts (most relevant for Vietnamese consumers)
      const result = await fdaApi.getFDAItems("food", "enforcement", {}, 5)

      if (result && result.total > 0) {
        setLatestAlerts(result.total)
        setVisible(true)
      }
    } catch (error) {
      console.error("[v0] Error loading FDA alert count:", error)
    }
  }

  function handleDismiss() {
    setVisible(false)
    sessionStorage.setItem("fda-badge-dismissed", "true")
    setDismissed(true)
  }

  function toggleExpanded() {
    setExpanded(!expanded)
  }

  if (!visible || dismissed) {
    return null
  }

  return (
    <>
      {/* Minimized Badge - Default State */}
      {!expanded && (
        <button
          onClick={toggleExpanded}
          className="fixed bottom-6 left-6 z-40 animate-in slide-in-from-bottom-5 duration-500 group"
          aria-label="Xem cảnh báo FDA"
        >
          <div className="relative">
            {/* Pulse Animation Ring */}
            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" />
            
            {/* Main Badge */}
            <div className="relative bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full shadow-2xl hover:shadow-red-500/50 transition-all duration-300 group-hover:scale-110">
              <div className="flex items-center gap-2 px-4 py-3 md:px-5 md:py-3.5">
                <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 animate-pulse" />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold opacity-90">FDA Alert</div>
                  <div className="text-lg font-bold leading-none">{latestAlerts.toLocaleString()}</div>
                </div>
                <Badge className="bg-white text-red-600 text-xs font-bold px-1.5 py-0.5 sm:px-2">
                  Mới
                </Badge>
                <ChevronUp className="w-4 h-4 opacity-75" />
              </div>
            </div>

            {/* Mobile-only simple badge */}
            <div className="sm:hidden absolute inset-0 flex items-center justify-center">
              <div className="bg-red-600 text-white rounded-full w-14 h-14 flex flex-col items-center justify-center shadow-xl">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-xs font-bold mt-0.5">{latestAlerts > 999 ? '999+' : latestAlerts}</span>
              </div>
            </div>
          </div>
        </button>
      )}

      {/* Expanded Card - When Clicked */}
      {expanded && (
        <div className="fixed bottom-6 left-6 z-40 animate-in slide-in-from-bottom-5 duration-300">
          <Card className="w-[calc(100vw-3rem)] max-w-sm shadow-2xl border-2 border-red-500 bg-white">
            <div className="p-4 md:p-5">
              {/* Close Button */}
              <button
                onClick={handleDismiss}
                className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                aria-label="Đóng"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Minimize Button */}
              <button
                onClick={toggleExpanded}
                className="absolute top-2 right-10 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                aria-label="Thu nhỏ"
              >
                <ChevronUp className="w-4 h-4 rotate-180" />
              </button>

              {/* Header with Icon */}
              <div className="flex items-start gap-3 mb-3 pr-16">
                <div className="flex-shrink-0 p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base md:text-lg leading-tight">
                    Cảnh báo FDA mới
                  </h3>
                  <p className="text-xs md:text-sm text-slate-600 mt-1">Theo dõi realtime từ Mỹ</p>
                </div>
              </div>

              {/* Alert Count */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 md:p-4 mb-3 md:mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-slate-600 mb-1">Tổng cảnh báo hiện tại</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl md:text-3xl font-bold text-red-600">
                        {latestAlerts.toLocaleString()}
                      </span>
                      <Badge variant="destructive" className="animate-pulse text-xs">
                        Mới
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs md:text-sm text-slate-700 mb-3 md:mb-4 leading-relaxed">
                Thu hồi <strong>thực phẩm, dược phẩm, mỹ phẩm</strong> từ FDA. Quan trọng cho hàng nhập khẩu và xách
                tay.
              </p>

              {/* CTA Button */}
              <Link href="/fda-tracker" className="block">
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white text-sm md:text-base">
                  <span>Xem ngay</span>
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </Link>

              {/* Trust Signal */}
              <p className="text-xs text-slate-500 text-center mt-3">Nguồn: FDA.gov | Cập nhật 24/7</p>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
