"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Bell, CheckCheck, MessageSquare, PhoneCall, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

/**
 * Chuông thông báo cho admin.
 *
 * Trước đây bảng `admin_notifications` CHỈ được ghi mà không có bất kỳ UI nào đọc,
 * nên admin không biết là có khách đang chờ → phải "ngồi canh web".
 * Component này đọc realtime và hiện ngay số lượng + nội dung cần xử lý.
 */

interface AdminNotification {
  id: string
  type: string
  conversation_id: string | null
  title: string
  message: string
  urgency: "high" | "medium" | "low"
  metadata: { service_tag?: string; channel?: string; reason?: string } | null
  is_read: boolean
  created_at: string
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 1) return "vừa xong"
  if (minutes < 60) return `${minutes} phút trước`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} giờ trước`
  return `${Math.floor(hours / 24)} ngày trước`
}

const URGENCY_STYLES: Record<string, string> = {
  high: "border-l-red-500 bg-red-50/60",
  medium: "border-l-amber-500 bg-amber-50/50",
  low: "border-l-blue-400 bg-blue-50/40",
}

export function AdminNotificationBell({ className }: { className?: string }) {
  const supabase = createClient()
  const [notifications, setNotifications] = useState<AdminNotification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const mountedRef = useRef(true)

  const load = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("admin_notifications")
        .select("id, type, conversation_id, title, message, urgency, metadata, is_read, created_at")
        .order("created_at", { ascending: false })
        .limit(30)

      if (error) throw error
      if (mountedRef.current) setNotifications((data as AdminNotification[]) || [])
    } catch (error) {
      console.error("[notify-bell] Không tải được thông báo:", error)
    } finally {
      if (mountedRef.current) setIsLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    mountedRef.current = true
    load()

    // Realtime: có thông báo mới là hiện ngay, không cần tải lại trang
    const channel = supabase
      .channel("admin-notifications-bell")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "admin_notifications" },
        (payload) => {
          const incoming = payload.new as AdminNotification
          setNotifications((prev) => [incoming, ...prev].slice(0, 30))
        },
      )
      .subscribe()

    return () => {
      mountedRef.current = false
      supabase.removeChannel(channel)
    }
  }, [supabase, load])

  const unread = notifications.filter((item) => !item.is_read)
  const unreadCount = unread.length

  const markAllRead = async () => {
    const unreadIds = unread.map((item) => item.id)
    if (unreadIds.length === 0) return
    setNotifications((prev) => prev.map((item) => ({ ...item, is_read: true })))
    const { error } = await supabase.from("admin_notifications").update({ is_read: true }).in("id", unreadIds)
    if (error) console.error("[notify-bell] Không đánh dấu đã đọc:", error.message)
  }

  const markOneRead = async (id: string) => {
    setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, is_read: true } : item)))
    await supabase.from("admin_notifications").update({ is_read: true }).eq("id", id)
  }

  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("relative bg-transparent", className)}>
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center bg-orange-500 text-white text-[11px]">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-[360px] p-0">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <span className="text-sm font-semibold text-primary">
            Thông báo {unreadCount > 0 && <span className="text-orange-600">({unreadCount} mới)</span>}
          </span>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Đã đọc hết
            </button>
          )}
        </div>

        <div className="max-h-[380px] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : notifications.length === 0 ? (
            <p className="px-3 py-8 text-center text-xs text-muted-foreground">
              Chưa có thông báo nào. Khi khách để lại liên hệ hoặc cần chuyên viên, thông báo sẽ hiện ở đây.
            </p>
          ) : (
            notifications.map((item) => (
              <Link
                key={item.id}
                href={item.conversation_id ? `/admin/conversations?id=${item.conversation_id}` : "/admin/conversations"}
                onClick={() => markOneRead(item.id)}
                className={cn(
                  "flex gap-2.5 border-b border-l-4 px-3 py-2.5 transition-colors last:border-b-0 hover:bg-secondary/60",
                  URGENCY_STYLES[item.urgency] || URGENCY_STYLES.low,
                  item.is_read && "opacity-60",
                )}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {item.type === "handover" ? (
                    <PhoneCall className="h-4 w-4 text-primary" />
                  ) : (
                    <MessageSquare className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-primary">{item.title}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{item.message}</p>
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span>{timeAgo(item.created_at)}</span>
                    {item.metadata?.service_tag && (
                      <span className="rounded bg-secondary px-1.5 py-0.5">{item.metadata.service_tag}</span>
                    )}
                    {item.metadata?.channel && <span>· {item.metadata.channel}</span>}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        <div className="border-t px-3 py-2 text-center">
          <Link href="/admin/conversations" className="text-xs font-medium text-primary hover:underline">
            Mở hộp thư khách hàng
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  )
}
