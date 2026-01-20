"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Users, Clock, TrendingUp } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Conversation {
  id: string
  customer_id: string
  customer_name: string
  channel: string
  status: string
  last_message: string
  created_at: string
  updated_at: string
  message_count?: number
}

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    today: 0,
  })

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    try {
      const supabase = createClient()

      // Lấy tất cả conversations
      const { data: convs, error } = await supabase
        .from("conversations")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(100)

      if (error) throw error

      // Tính số tin nhắn cho mỗi conversation
      const convsWithCount = await Promise.all(
        (convs || []).map(async (conv) => {
          const { count } = await supabase
            .from("chat_messages")
            .select("*", { count: "exact", head: true })
            .eq("conversation_id", conv.id)

          return { ...conv, message_count: count || 0 }
        })
      )

      setConversations(convsWithCount)

      // Tính stats
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      setStats({
        total: convsWithCount.length,
        active: convsWithCount.filter((c) => c.status === "active").length,
        today: convsWithCount.filter((c) => new Date(c.created_at) >= today).length,
      })
    } catch (error) {
      console.error("[v0] Error loading conversations:", error)
    } finally {
      setLoading(false)
    }
  }

  const getChannelBadge = (channel: string) => {
    const colors = {
      website: "bg-blue-100 text-blue-700",
      facebook: "bg-indigo-100 text-indigo-700",
      zalo: "bg-cyan-100 text-cyan-700",
    }
    return colors[channel as keyof typeof colors] || "bg-gray-100 text-gray-700"
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-700",
      closed: "bg-gray-100 text-gray-700",
      pending: "bg-yellow-100 text-yellow-700",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-700"
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Quản lý hội thoại</h1>
        <p className="text-muted-foreground mt-2">Xem và quản lý tất cả các cuộc hội thoại từ khách hàng</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tổng hội thoại</p>
              <p className="text-2xl font-bold text-primary">{stats.total}</p>
            </div>
            <MessageCircle className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Đang hoạt động</p>
              <p className="text-2xl font-bold text-primary">{stats.active}</p>
            </div>
            <Users className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Hôm nay</p>
              <p className="text-2xl font-bold text-primary">{stats.today}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Conversations List */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-primary mb-4">Danh sách hội thoại</h2>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Đang tải...</div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Chưa có hội thoại nào</p>
          </div>
        ) : (
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {conversations.map((conv) => (
                <Card key={conv.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-primary">{conv.customer_name}</h3>
                        <Badge className={getChannelBadge(conv.channel)}>{conv.channel}</Badge>
                        <Badge className={getStatusBadge(conv.status)}>{conv.status}</Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{conv.last_message}</p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(conv.updated_at).toLocaleString("vi-VN")}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {conv.message_count} tin nhắn
                        </span>
                        <span className="text-xs">ID: {conv.customer_id.substring(0, 20)}...</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </Card>
    </div>
  )
}
