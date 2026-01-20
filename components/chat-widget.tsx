"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  sender_type: "customer" | "bot"
  message_text: string
  created_at: string
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [customerId, setCustomerId] = useState("")
  const [conversationId, setConversationId] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Tạo customer ID duy nhất
  useEffect(() => {
    let storedId = localStorage.getItem("vexim_customer_id")
    if (!storedId) {
      storedId = `customer_${Date.now()}_${Math.random().toString(36).substring(7)}`
      localStorage.setItem("vexim_customer_id", storedId)
    }
    setCustomerId(storedId)

    // Lấy conversation ID nếu có
    const storedConvId = localStorage.getItem("vexim_conversation_id")
    if (storedConvId) {
      setConversationId(storedConvId)
      loadHistory(storedConvId)
    }
  }, [])

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Load lịch sử chat
  const loadHistory = async (convId: string) => {
    try {
      const response = await fetch(`https://chatbot-six-wheat.vercel.app/api/webhook/website?conversation_id=${convId}`)
      const data = await response.json()
      if (data.status === "ok" && data.messages) {
        setMessages(data.messages)
      }
    } catch (error) {
      console.error("[v0] Error loading history:", error)
    }
  }

  // Gửi tin nhắn
  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: `temp_${Date.now()}`,
      sender_type: "customer",
      message_text: inputMessage,
      created_at: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const response = await fetch("https://chatbot-six-wheat.vercel.app/api/webhook/website", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Origin": "https://www.veximglobal.com"
        },
        body: JSON.stringify({
          customer_id: customerId,
          customer_name: "Khách hàng",
          message_text: inputMessage,
          channel: "website",
          website_url: "https://www.veximglobal.com"
        }),
      })

      const data = await response.json()

      if (data.status === "ok" && data.response) {
        // Lưu conversation ID
        if (data.response.conversation_id && !conversationId) {
          setConversationId(data.response.conversation_id)
          localStorage.setItem("vexim_conversation_id", data.response.conversation_id)
        }

        // Thêm phản hồi từ bot
        const botMessage: Message = {
          id: data.response.message_id || `bot_${Date.now()}`,
          sender_type: "bot",
          message_text: data.response.message_text,
          created_at: data.response.timestamp || new Date().toISOString(),
        }
        setMessages((prev) => [...prev, botMessage])
      } else {
        throw new Error(data.error || "Lỗi không xác định")
      }
    } catch (error) {
      console.error("[v0] Error sending message:", error)
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        sender_type: "bot",
        message_text: "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau hoặc liên hệ hotline để được hỗ trợ!",
        created_at: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Xử lý Enter để gửi
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent shadow-lg transition-all hover:scale-110 hover:shadow-xl"
          aria-label="Mở chat"
        >
          <MessageCircle className="h-6 w-6 text-white" />
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white animate-pulse">
            1
          </span>
        </button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div
          className={cn(
            "fixed bottom-6 right-6 z-50 flex flex-col bg-white rounded-lg shadow-2xl transition-all",
            isMinimized ? "h-16 w-80" : "h-[600px] w-96 max-w-[calc(100vw-3rem)]"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-primary to-accent p-4 rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </div>
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
              </div>
              <div>
                <h3 className="font-semibold text-white">Vexim Global</h3>
                <p className="text-xs text-white/80">Đang hoạt động</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Thu nhỏ"
              >
                <Minimize2 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Đóng"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">Xin chào! Tôi có thể giúp gì cho bạn?</p>
                    <p className="text-xs mt-2">Hãy bắt đầu cuộc trò chuyện...</p>
                  </div>
                )}

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn("flex", msg.sender_type === "customer" ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg px-4 py-2 text-sm shadow-sm",
                        msg.sender_type === "customer"
                          ? "bg-primary text-white rounded-br-none"
                          : "bg-white text-gray-800 rounded-bl-none"
                      )}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.message_text}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {new Date(msg.created_at).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
                      <div className="flex gap-1">
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                        <span
                          className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></span>
                        <span
                          className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        ></span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t bg-white p-4 rounded-b-lg">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập tin nhắn..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} disabled={isLoading || !inputMessage.trim()} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Powered by Vexim Global • Hỗ trợ 24/7
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
