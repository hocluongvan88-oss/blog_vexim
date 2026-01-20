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
  XCircle,
  ArrowLeft
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
  handover_mode?: string | null
  ai_confidence?: number
  metadata?: {
    handed_over?: boolean
    agent_name?: string
    [key: string]: any
  }
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
    pending: 0,
  })
  const [hasMoreMessages, setHasMoreMessages] = useState(false)
  const [messageOffset, setMessageOffset] = useState(0)
  const MESSAGE_PAGE_SIZE = 50

  const loadMessages = async (conversationId: string, offset = 0, append = false) => {
    setLoadingMessages(true)
    try {
      const supabase = createClient()
      
      // Load messages in descending order, then reverse
      const { data, error, count } = await supabase
        .from("chat_messages")
        .select("*", { count: "exact" })
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: false })
        .range(offset, offset + MESSAGE_PAGE_SIZE - 1)

      if (error) throw error
      
      const reversedData = (data || []).reverse()
      
      if (append) {
        setMessages(prev => [...reversedData, ...prev])
      } else {
        setMessages(reversedData)
        setMessageOffset(MESSAGE_PAGE_SIZE)
      }
      
      setHasMoreMessages((count || 0) > offset + MESSAGE_PAGE_SIZE)
    } catch (error) {
      console.error("[v0] Error loading messages:", error)
      toast.error("Không thể tải tin nhắn")
    } finally {
      setLoadingMessages(false)
    }
  }

  const loadMoreMessages = async () => {
    if (!selectedConv || !hasMoreMessages) return
    await loadMessages(selectedConv.id, messageOffset, true)
    setMessageOffset(prev => prev + MESSAGE_PAGE_SIZE)
  }

  useEffect(() => {
    loadConversations()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadConversations()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (selectedConv) {
      loadMessages(selectedConv.id)
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

      // Tính số tin nhắn và kiểm tra handover status cho mỗi conversation
      const convsWithCount = await Promise.all(
        (convs || []).map(async (conv) => {
          const { count } = await supabase
            .from("chat_messages")
            .select("*", { count: "exact", head: true })
            .eq("conversation_id", conv.id)

          // Kiểm tra xem conversation có đang được handover không
          const { data: activeHandover, error: handoverError } = await supabase
            .from("conversation_handovers")
            .select("status, agent_name")
            .eq("conversation_id", conv.id)
            .eq("status", "active")
            .maybeSingle()

          if (handoverError) {
            console.error("[v0] Error checking handover:", handoverError)
          }

          return { 
            ...conv, 
            message_count: count || 0,
            handover_mode: activeHandover ? "manual" : null,
            metadata: {
              ...(conv.metadata || {}),
              handed_over: !!activeHandover,
              agent_name: activeHandover?.agent_name
            }
          }
        })
      )

      setConversations(convsWithCount)

      // Calculate stats
      const now = new Date()
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

      // Count pending: handover_mode = 'manual' and no agent messages yet
      const pendingConvs = await Promise.all(
        convsWithCount
          .filter(c => c.handover_mode === "manual")
          .map(async (conv) => {
            const { count } = await supabase
              .from("chat_messages")
              .select("*", { count: "exact", head: true })
              .eq("conversation_id", conv.id)
              .eq("sender_type", "agent")
            
            return count === 0 ? conv : null
          })
      )
      
      const pendingCount = pendingConvs.filter(c => c !== null).length

      setStats({
        total: convsWithCount.length,
        active: convsWithCount.filter((c) => c.status === "active").length,
        today: convsWithCount.filter(
          (c) => new Date(c.created_at) >= todayStart
        ).length,
        pending: pendingCount,
      })
    } catch (error) {
      console.error("[v0] Error loading conversations:", error)
    } finally {
      setLoading(false)
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
          conversationId: selectedConv.id,
          action: "takeover",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to take over")
      }

      const result = await response.json()
      console.log("[v0] Takeover result:", result)
      
      toast.success("Đã chuyển sang chế độ admin")
      
      // Refresh conversation - reload from server
      await loadConversations()
      
      // Update local state
      const updated = { 
        ...selectedConv, 
        handover_mode: "manual",
        metadata: {
          ...(selectedConv.metadata || {}),
          handed_over: true,
        }
      }
      setSelectedConv(updated)
      
      // Reload messages to show handover
      loadMessages(selectedConv.id)
    } catch (error) {
      console.error("[v0] Error taking over:", error)
      toast.error(`Không thể chuyển cuộc trò chuyện: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setTakingOver(false)
    }
  }

  const handleRelease = async () => {
    if (!selectedConv || takingOver) return

    setTakingOver(true)
    try {
      const response = await fetch("/api/chatbot/handover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: selectedConv.id,
          action: "release",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to release")
      }

      const result = await response.json()
      console.log("[v0] Release result:", result)
      
      toast.success("Đã trả lại cho AI")
      
      // Refresh conversation - reload from server to get updated data
      await loadConversations()
      
      // Update local state
      const updated = { 
        ...selectedConv, 
        handover_mode: null,
        metadata: {
          ...(selectedConv.metadata || {}),
          handed_over: false,
        }
      }
      setSelectedConv(updated)
      
      // Reload messages
      loadMessages(selectedConv.id)
    } catch (error) {
      console.error("[v0] Error releasing:", error)
      toast.error(`Không thể trả lại cuộc trò chuyện: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setTakingOver(false)
    }
  }

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConv(conv)
    setMessages([])
    setMessageOffset(0)
    setHasMoreMessages(false)
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
    <div className="space-y-4 p-4 lg:space-y-6 lg:p-6">
      <div className="hidden lg:block">
        <h1 className="text-3xl font-bold text-primary">Quản lý hội thoại</h1>
        <p className="text-muted-foreground mt-2">Xem và quản lý tất cả các cuộc hội thoại từ khách hàng</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <Card className="p-3 lg:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-muted-foreground">Tổng</p>
              <p className="text-xl lg:text-2xl font-bold text-primary">{stats.total}</p>
            </div>
            <MessageCircle className="h-6 w-6 lg:h-8 lg:w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-3 lg:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-muted-foreground">Hoạt động</p>
              <p className="text-xl lg:text-2xl font-bold text-primary">{stats.active}</p>
            </div>
            <Users className="h-6 w-6 lg:h-8 lg:w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-3 lg:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-muted-foreground">Hôm nay</p>
              <p className="text-xl lg:text-2xl font-bold text-primary">{stats.today}</p>
            </div>
            <TrendingUp className="h-6 w-6 lg:h-8 lg:w-8 text-purple-500" />
          </div>
        </Card>
        <Card className="p-3 lg:p-4 border-orange-200 bg-orange-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm text-orange-700 font-medium">Chờ</p>
              <p className="text-xl lg:text-2xl font-bold text-orange-900">{stats.pending}</p>
            </div>
            <AlertCircle className="h-6 w-6 lg:h-8 lg:w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Main Content - Mobile: Stack, Desktop: Split View */}
      <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6">
        {/* Conversations List - On mobile: hide when chat selected */}
        <Card className={cn(
          "lg:col-span-1 p-4",
          selectedConv ? "hidden lg:block" : "block"
        )}>
          <h2 className="text-base lg:text-lg font-bold text-primary mb-3 lg:mb-4">Danh sách hội thoại</h2>

          {loading ? (
            <div className="text-center py-6 lg:py-8 text-muted-foreground text-sm">Đang tải...</div>
          ) : !conversations || conversations.length === 0 ? (
            <div className="text-center py-6 lg:py-8 text-muted-foreground">
              <MessageCircle className="h-10 w-10 lg:h-12 lg:w-12 mx-auto mb-2 lg:mb-3 opacity-50" />
              <p className="text-xs lg:text-sm">Chưa có hội thoại nào</p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-280px)] lg:h-[calc(100vh-400px)]">
              <div className="space-y-2">
                {conversations.map((conv) => (
                  <Card
                    key={conv.id}
                    className={cn(
                      "p-3 cursor-pointer hover:shadow-md transition-shadow",
                      selectedConv?.id === conv.id && "border-primary border-2",
                      conv.handover_mode === "manual" && "border-l-4 border-l-orange-500 bg-orange-50/30"
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

                  {conv.handover_mode === "manual" && (
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

        {/* Chat Interface - On mobile: full screen when selected */}
        <Card className={cn(
          "lg:col-span-2 flex flex-col",
          !selectedConv ? "hidden lg:flex" : "block lg:flex"
        )}>
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <div className="p-3 lg:p-4 border-b">
                <div className="flex items-center gap-3">
                  {/* Mobile Back Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden flex-shrink-0 bg-transparent"
                    onClick={() => setSelectedConv(null)}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base lg:text-lg font-bold text-primary truncate">{selectedConv.customer_name}</h2>
                    <div className="flex items-center gap-1 lg:gap-2 mt-1 flex-wrap">
                      <Badge className={cn("text-xs", getChannelBadge(selectedConv.channel))}>
                        {selectedConv.channel}
                      </Badge>
                      <Badge className={cn("text-xs", getStatusBadge(selectedConv.status))}>
                        {selectedConv.status}
                      </Badge>
                      {selectedConv.ai_confidence !== undefined && (
                        <Badge className={cn(
                          "gap-1 text-xs hidden lg:flex",
                          selectedConv.ai_confidence > 0.7 
                            ? "bg-green-100 text-green-700" 
                            : selectedConv.ai_confidence > 0.5
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        )}>
                          {selectedConv.ai_confidence > 0.7 ? <CheckCircle className="h-3 w-3" /> : 
                           selectedConv.ai_confidence > 0.5 ? <AlertCircle className="h-3 w-3" /> :
                           <XCircle className="h-3 w-3" />}
                          {(selectedConv.ai_confidence * 100).toFixed(0)}%
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    {selectedConv.handover_mode === "manual" ? (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={handleRelease}
                        disabled={takingOver}
                        className="text-xs lg:text-sm bg-transparent"
                      >
                        <span className="hidden lg:inline">{takingOver ? "Đang xử lý..." : "Trả lại AI"}</span>
                        <span className="lg:hidden">{takingOver ? "..." : "AI"}</span>
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={handleTakeOver}
                        disabled={takingOver}
                        className="text-xs lg:text-sm"
                      >
                        <span className="hidden lg:inline">{takingOver ? "Đang chuyển..." : "Chuyển sang Admin"}</span>
                        <span className="lg:hidden">{takingOver ? "..." : "Admin"}</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-[calc(100vh-280px)] lg:h-[500px] p-3 lg:p-4">
                  {loadingMessages && messages.length === 0 ? (
                    <div className="text-center py-6 lg:py-8 text-muted-foreground text-sm">Đang tải tin nhắn...</div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-6 lg:py-8 text-muted-foreground">
                      <MessageCircle className="h-10 w-10 lg:h-12 lg:w-12 mx-auto mb-2 lg:mb-3 opacity-50" />
                      <p className="text-sm">Chưa có tin nhắn nào</p>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {hasMoreMessages && (
                        <div className="text-center pb-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={loadMoreMessages}
                            disabled={loadingMessages}
                          >
                            {loadingMessages ? "Đang tải..." : "Tải tin nhắn cũ hơn"}
                          </Button>
                        </div>
                      )}
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={cn(
                            "flex gap-2 items-start",
                            msg.sender_type === "customer" ? "justify-start" : "justify-end"
                          )}
                        >
                          {msg.sender_type === "customer" && (
                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <UserIcon className="h-3 w-3 text-blue-600" />
                            </div>
                          )}
                          
                          <div
                            className={cn(
                              "max-w-[85%] lg:max-w-[70%] rounded-lg px-2.5 lg:px-3 py-1.5 shadow-sm",
                              msg.sender_type === "customer"
                                ? "bg-blue-50 text-gray-900"
                                : msg.sender_type === "bot"
                                ? "bg-gray-100 text-gray-900"
                                : "bg-primary text-white"
                            )}
                          >
                            <div className="flex items-center gap-1 lg:gap-1.5 flex-wrap">
                              <span className="text-[10px] font-semibold">
                                {msg.sender_type === "customer" 
                                  ? "KH" 
                                  : msg.sender_type === "bot"
                                  ? "AI"
                                  : "Admin"}
                              </span>
                              <span className="text-[10px] opacity-60">
                                {new Date(msg.created_at).toLocaleString("vi-VN", {
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })}
                              </span>
                              {msg.ai_confidence !== undefined && (
                                <span className="text-[10px] opacity-60 hidden lg:inline">
                                  {(msg.ai_confidence * 100).toFixed(0)}%
                                </span>
                              )}
                            </div>
                            <p className="text-xs lg:text-sm whitespace-pre-wrap break-words mt-0.5">{msg.message_text}</p>
                          </div>

                          {msg.sender_type === "bot" && (
                            <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                              <Bot className="h-3 w-3 text-purple-600" />
                            </div>
                          )}
                          {msg.sender_type === "agent" && (
                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <UserIcon className="h-3 w-3 text-green-600" />
                            </div>
                          )}
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>
              </div>

              {/* Input */}
              <div className="p-3 lg:p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Nhập tin nhắn..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                    disabled={sending}
                    className="text-sm"
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={sending || !newMessage.trim()}
                    size="icon"
                    className="flex-shrink-0"
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
