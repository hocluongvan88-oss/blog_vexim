"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, User, Send, UserCog } from "lucide-react"
import { toast } from "sonner"

interface Message {
  id: string
  sender_type: "user" | "bot" | "agent"
  message: string
  created_at: string
  agent_name?: string
}

interface ConversationHandoverProps {
  conversationId: string
  messages: Message[]
  isHandedOver: boolean
  handoverAgent?: string
  onTakeOver: () => void
  onRelease: () => void
  onSendMessage: (message: string) => void
}

export function ConversationHandover({
  conversationId,
  messages,
  isHandedOver,
  handoverAgent,
  onTakeOver,
  onRelease,
  onSendMessage,
}: ConversationHandoverProps) {
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    setSending(true)
    try {
      await onSendMessage(newMessage)
      setNewMessage("")
    } catch (error) {
      toast.error("Không thể gửi tin nhắn")
    } finally {
      setSending(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Hội Thoại</CardTitle>
            <CardDescription>
              {isHandedOver
                ? `Đang được tư vấn bởi ${handoverAgent}`
                : "AI đang tự động trả lời"}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {!isHandedOver ? (
              <Button onClick={onTakeOver} variant="default">
                <UserCog className="mr-2 h-4 w-4" />
                Cướp Quyền
              </Button>
            ) : (
              <Button onClick={onRelease} variant="outline">
                Trả Lại AI
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Messages */}
        <div className="space-y-4 max-h-[500px] overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender_type === "user" ? "" : "flex-row-reverse"}`}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {msg.sender_type === "user" ? (
                    <User className="h-4 w-4" />
                  ) : msg.sender_type === "bot" ? (
                    <Bot className="h-4 w-4" />
                  ) : (
                    <UserCog className="h-4 w-4" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div
                className={`flex-1 max-w-[80%] ${msg.sender_type === "user" ? "" : "text-right"}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {msg.sender_type === "bot" && (
                    <Badge variant="secondary">AI</Badge>
                  )}
                  {msg.sender_type === "agent" && (
                    <Badge variant="default">{msg.agent_name || "Chuyên gia"}</Badge>
                  )}
                  {msg.sender_type === "user" && (
                    <Badge variant="outline">Khách hàng</Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {new Date(msg.created_at).toLocaleTimeString("vi-VN")}
                  </span>
                </div>
                <div
                  className={`p-3 rounded-lg ${
                    msg.sender_type === "user"
                      ? "bg-secondary"
                      : msg.sender_type === "agent"
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reply Form */}
        {isHandedOver && (
          <div className="flex gap-2">
            <Textarea
              placeholder="Nhập tin nhắn của bạn..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              className="resize-none"
              rows={2}
            />
            <Button
              onClick={handleSendMessage}
              disabled={sending || !newMessage.trim()}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
