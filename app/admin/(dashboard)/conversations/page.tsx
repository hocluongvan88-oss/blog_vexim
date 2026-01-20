"use client"

import { useEffect, useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { 
  MessageCircle, 
  Users, 
  Clock, 
  TrendingUp, 
  Send, 
  Bot, 
  User as UserIcon,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

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
  handover_mode?: string
  ai_confidence?: number
}

interface ChatMessage {
  id: string
  conversation_id: string
  sender_type: string
  message_text: string
  created_at: string
  ai_model?: string
  ai_confidence?: number
}

const loadMessages = async (conversationId: string) => {
  const supabase = createClient()
  const { data: msgs, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("[v0] Error loading messages:", error)
    return
  }

  return msgs as ChatMessage[]
}

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const [takingOver, setTakingOver] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    today: 0,
  })

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    if (selectedConv) {
      loadMessages(selectedConv.id).then(setMessages)
      // Subscribe to new messages
      const supabase = createClient()
      const channel = supabase
        .channel(`conversation_${selectedConv.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
            filter: `conversation_id=eq.${selectedConv.id}`
          },
          (payload) => {
            setMessages(prev => [...prev, payload.new as ChatMessage])
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [selectedConv])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

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

  const loadMessages = async (conversationId: string) => {
    setLoadingMessages(true)
    try {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error("[v0] Error loading messages:", error)
      toast.error("Không thể tải tin nhắn")
    } finally {
      setLoadingMessages(false)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConv || sending) return

    setSending(true)
    try {
      const supabase = createClient()

      // Insert message as agent
      const { error } = await supabase
        .from("chat_messages")
        .insert({
          conversation_id: selectedConv.id,
          sender_type: "agent",
          message_text: newMessage,
        })

      if (error) throw error

      // Update conversation
      await supabase
        .from("conversations")
        .update({
          last_message: newMessage,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedConv.id)

      setNewMessage("")
      toast.success("Đã gửi tin nhắn")
    } catch (error) {
      console.error("[v0] Error sending message:", error)
      toast.error("Không thể gửi tin nhắn")
    } finally {
      setSending(false)
    }
  }

  const handleTakeOver = async () => {
    if (!selectedConv || takingOver) return

    setTakingOver(true)
    try {
      const response = await fetch("/api/chatbot/handover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: selectedConv.id,
          from_type: "bot",
          to_type: "agent",
          reason: "Admin manually took over conversation",
        }),
      })

      if (!response.ok) throw new Error("Failed to take over")

      toast.success("Đã chuyển sang chế độ admin")
      
      // Refresh conversation
      const updated = { ...selectedConv, handover_mode: "manual" }
      setSelectedConv(updated)
      setConversations(prevConvs => 
        prevConvs.map(c => c.id === updated.id ? updated : c)
      )
    } catch (error) {
      console.error("[v0] Error taking over:", error)
      toast.error("Không thể chuyển cuộc trò chuyện")
    } finally {
      setTakingOver(false)
    }
  }

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConv(conv)
    setMessages([])
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

      {/* Main Content - Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <Card className="lg:col-span-1 p-4">
          <h2 className="text-lg font-bold text-primary mb-4">Danh sách hội thoại</h2>

          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Đang tải...</div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Chưa có hội thoại nào</p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-400px)]">
              <div className="space-y-2">
                {conversations.map((conv) => (
                  <Card 
                    key={conv.id} 
                    className={cn(
                      "p-3 cursor-pointer hover:shadow-md transition-shadow",
                      selectedConv?.id === conv.id && "border-primary border-2"
                    )}
                    onClick={() => handleSelectConversation(conv)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-sm text-primary truncate flex-1">
                        {conv.customer_name}
                      </h3>
                      <Badge className={cn("text-xs", getChannelBadge(conv.channel))}>
                        {conv.channel}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                      {conv.last_message}
                    </p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {conv.message_count}
                      </span>
                      <span>{new Date(conv.updated_at).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}</span>
                    </div>

                    {conv.handover_mode && (
                      <Badge className="mt-2 text-xs bg-amber-100 text-amber-700">
                        Admin mode
                      </Badge>
                    )}
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </Card>

        {/* Chat Interface */}
        <Card className="lg:col-span-2 flex flex-col">
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-primary">{selectedConv.customer_name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getChannelBadge(selectedConv.channel)}>
                        {selectedConv.channel}
                      </Badge>
                      <Badge className={getStatusBadge(selectedConv.status)}>
                        {selectedConv.status}
                      </Badge>
                      {selectedConv.ai_confidence !== undefined && (
                        <Badge className={cn(
                          "gap-1",
                          selectedConv.ai_confidence > 0.7 
                            ? "bg-green-100 text-green-700" 
                            : selectedConv.ai_confidence > 0.5
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        )}>
                          {selectedConv.ai_confidence > 0.7 ? <CheckCircle className="h-3 w-3" /> : 
                           selectedConv.ai_confidence > 0.5 ? <AlertCircle className="h-3 w-3" /> :
                           <XCircle className="h-3 w-3" />}
                          Confidence: {(selectedConv.ai_confidence * 100).toFixed(0)}%
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {!selectedConv.handover_mode && (
                    <Button 
                      size="sm" 
                      onClick={handleTakeOver}
                      disabled={takingOver}
                    >
                      {takingOver ? "Đang chuyển..." : "Chuyển sang Admin"}
                    </Button>
                  )}
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4 h-[calc(100vh-500px)]">
                {loadingMessages ? (
                  <div className="text-center py-8 text-muted-foreground">Đang tải tin nhắn...</div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Chưa có tin nhắn nào</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex gap-3",
                          msg.sender_type === "customer" ? "justify-start" : "justify-end"
                        )}
                      >
                        {msg.sender_type === "customer" && (
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <UserIcon className="h-4 w-4 text-blue-600" />
                          </div>
                        )}
                        
                        <div
                          className={cn(
                            "max-w-[70%] rounded-lg px-4 py-2 shadow-sm",
                            msg.sender_type === "customer"
                              ? "bg-blue-50 text-gray-900"
                              : msg.sender_type === "bot"
                              ? "bg-gray-100 text-gray-900"
                              : "bg-primary text-white"
                          )}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold">
                              {msg.sender_type === "customer" 
                                ? "Khách hàng" 
                                : msg.sender_type === "bot"
                                ? "AI Bot"
                                : "Admin"}
                            </span>
                            {msg.sender_type === "bot" && msg.ai_model && (
                              <span className="text-xs opacity-70">({msg.ai_model})</span>
                            )}
                          </div>
                          <p className="text-sm whitespace-pre-wrap break-words">{msg.message_text}</p>
                          <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                            <span>
                              {new Date(msg.created_at).toLocaleString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </span>
                            {msg.ai_confidence !== undefined && (
                              <span>Confidence: {(msg.ai_confidence * 100).toFixed(0)}%</span>
                            )}
                          </div>
                        </div>

                        {msg.sender_type === "bot" && (
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                            <Bot className="h-4 w-4 text-purple-600" />
                          </div>
                        )}
                        {msg.sender_type === "agent" && (
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <UserIcon className="h-4 w-4 text-green-600" />
                          </div>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Nhập tin nhắn..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                    disabled={sending}
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={sending || !newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Chọn một cuộc hội thoại để xem chi tiết</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
