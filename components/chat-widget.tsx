"use client"

import React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { MessageCircle, X, Send, Minimize2, Headset, Phone, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { mergeIncomingMessages } from "@/lib/chat-message-merge"
import {
  VEXIM_PHONE_DISPLAY,
  VEXIM_PHONE_TEL_URL,
  VEXIM_ZALO_URL,
  contactInvite,
} from "@/lib/contact-info"
import {
  shouldOfferConsultation,
  type ConsultationReason,
} from "@/lib/consultation-offer"

/**
 * Nội dung thẻ "cần tư vấn sâu hơn" — nói đúng ngữ cảnh từng trường hợp
 * thay vì lặp lại một câu máy móc.
 */
const CONSULTATION_CONTENT: Record<ConsultationReason, { title: string; subtitle: string }> = {
  handoff: { title: "Đã chuyển cho chuyên viên", subtitle: contactInvite() },
  handed_over: { title: "Chuyên viên đang hỗ trợ anh/chị", subtitle: contactInvite() },
  ask_contact: {
    title: "Anh/chị để lại liên hệ giúp em nhé",
    subtitle: `Chuyên viên Vexim sẽ gọi lại trong giờ làm việc — hoặc anh/chị chủ động nhắn Zalo ${VEXIM_PHONE_DISPLAY}.`,
  },
  ai_suggested: {
    title: "Vấn đề này cần chuyên viên tư vấn kỹ hơn",
    subtitle: contactInvite(),
  },
  no_documents: {
    title: "Em chưa có tài liệu cho phần này",
    subtitle: `Để chắc chắn và không nói sai, anh/chị hỏi trực tiếp chuyên viên Vexim nhé — ${VEXIM_PHONE_DISPLAY}.`,
  },
  deep_request: {
    title: "Phần này chuyên viên báo giá & tư vấn riêng",
    subtitle: contactInvite(),
  },
  error: {
    title: "Kết nối đang gián đoạn",
    subtitle: `Anh/chị nhắn Zalo hoặc gọi ${VEXIM_PHONE_DISPLAY} để được hỗ trợ ngay ạ.`,
  },
}

// Simple markdown parser for chatbot messages
function parseMarkdown(text: string): React.ReactNode {
  const lines = text.split('\n')
  const elements: React.ReactNode[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Bold text: **text** or __text__
    let processedLine = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    processedLine = processedLine.replace(/__(.+?)__/g, '<strong>$1</strong>')

    // Italic: *text* or _text_ (but not ** or __)
    processedLine = processedLine.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>')
    processedLine = processedLine.replace(/(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g, '<em>$1</em>')

    // List items: * item or - item
    if (line.trim().match(/^[\*\-]\s+/)) {
      const content = line.trim().replace(/^[\*\-]\s+/, '')
      let processedContent = content.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      processedContent = processedContent.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>')
      elements.push(
        <li key={i} className="ml-4 mb-1" dangerouslySetInnerHTML={{ __html: processedContent }} />
      )
      continue
    }

    // Numbered list: 1. item
    if (line.trim().match(/^\d+\.\s+/)) {
      const content = line.trim().replace(/^\d+\.\s+/, '')
      let processedContent = content.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      processedContent = processedContent.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>')
      elements.push(
        <li key={i} className="ml-4 mb-1 list-decimal" dangerouslySetInnerHTML={{ __html: processedContent }} />
      )
      continue
    }

    // Links: [text](url)
    processedLine = processedLine.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">$1</a>')

    // Empty lines
    if (line.trim() === '') {
      elements.push(<br key={i} />)
      continue
    }

    // Regular paragraphs
    if (processedLine.includes('<')) {
      elements.push(
        <p key={i} className="mb-2" dangerouslySetInnerHTML={{ __html: processedLine }} />
      )
    } else {
      elements.push(
        <p key={i} className="mb-2">{processedLine}</p>
      )
    }
  }

  return <div className="space-y-1">{elements}</div>
}

interface Message {
  id: string
  /** "agent" = chuyên viên Vexim trả lời trực tiếp trong trang quản trị */
  sender_type: "customer" | "bot" | "agent"
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
  const [isStreaming, setIsStreaming] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  /** Lý do mời khách liên hệ Zalo/hotline (null = chưa cần) */
  const [consultReason, setConsultReason] = useState<ConsultationReason | null>(null)
  const [phoneCopied, setPhoneCopied] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const knownIdsRef = useRef<Set<string>>(new Set())
  /** Nội dung các tin khách ĐÃ GỬI tại máy này — để không hiện trùng khi nạp lại lịch sử */
  const localCustomerTextsRef = useRef<Set<string>>(new Set())

  /** Gộp tin nhắn mới vào danh sách, bỏ qua tin đã có (dùng cho cả polling). */
  const mergeMessages = useCallback((incoming: Message[], options: { countUnread?: boolean } = {}) => {
    const { added, unread } = mergeIncomingMessages<Message>(
      incoming,
      knownIdsRef.current,
      localCustomerTextsRef.current,
      options,
    )

    if (added.length === 0) return

    setMessages((prev) => [...prev, ...added])
    if (unread > 0) setUnreadCount((count) => count + unread)
  }, [])

  // Tạo customer ID duy nhất + nạp lại hội thoại cũ
  useEffect(() => {
    let storedId = localStorage.getItem("vexim_customer_id")
    if (!storedId) {
      storedId = `customer_${Date.now()}_${Math.random().toString(36).substring(7)}`
      localStorage.setItem("vexim_customer_id", storedId)
    }
    setCustomerId(storedId)

    const storedConvId = localStorage.getItem("vexim_conversation_id")
    if (storedConvId) {
      setConversationId(storedConvId)
      loadHistory(storedConvId)
    }
  }, [])

  // KHÔNG tự động scroll khi đang typing - để user đọc thoải mái
  // Chỉ scroll khi HOÀN THÀNH typing VÀ user đang ở cuối
  useEffect(() => {
    if (isStreaming) return

    const messageContainer = messagesEndRef.current?.parentElement
    if (!messageContainer) return

    const isNearBottom =
      messageContainer.scrollHeight - messageContainer.scrollTop - messageContainer.clientHeight < 100

    if (isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isStreaming])

  // Auto-focus input khi mở chat hoặc khi không minimize
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen, isMinimized])

  // Mở chat -> coi như đã đọc
  useEffect(() => {
    if (isOpen) setUnreadCount(0)
  }, [isOpen])

  /**
   * Trong lúc khung chat mở, cứ 8 giây hỏi lại lịch sử để khách thấy ngay
   * câu trả lời của chuyên viên trong trang quản trị (trước đây khách phải
   * tải lại trang mới thấy, nên gần như không bao giờ thấy).
   */
  useEffect(() => {
    if (!isOpen || !conversationId) return

    const timer = setInterval(async () => {
      try {
        const response = await fetch(`/api/chatbot/history?conversation_id=${conversationId}`)
        const data = await response.json()
        if (data.status === "ok" && Array.isArray(data.messages)) {
          mergeMessages(data.messages)
        }
      } catch {
        // im lặng, thử lại ở nhịp sau
      }
    }, 8000)

    return () => clearInterval(timer)
  }, [isOpen, conversationId, mergeMessages])

  /**
   * Khung chat đang ĐÓNG: thỉnh thoảng vẫn kiểm tra để hiện chấm đỏ khi
   * chuyên viên trả lời — khách không phải ngồi chờ sẵn trong khung chat.
   */
  useEffect(() => {
    if (isOpen || !conversationId) return

    const timer = setInterval(async () => {
      try {
        const response = await fetch(`/api/chatbot/history?conversation_id=${conversationId}`)
        const data = await response.json()
        if (data.status === "ok" && Array.isArray(data.messages)) {
          mergeMessages(data.messages, { countUnread: true })
        }
      } catch {
        // im lặng
      }
    }, 20000)

    return () => clearInterval(timer)
  }, [isOpen, conversationId, mergeMessages])

  // Load lịch sử chat
  const loadHistory = async (convId: string) => {
    try {
      const response = await fetch(`/api/chatbot/history?conversation_id=${convId}`)
      const data = await response.json()
      if (data.status === "ok" && Array.isArray(data.messages)) {
        mergeMessages(data.messages)
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

    knownIdsRef.current.add(userMessage.id)
    localCustomerTextsRef.current.add(userMessage.message_text.trim())
    setMessages((prev) => [...prev, userMessage])
    const sentText = inputMessage
    setInputMessage("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chatbot/send-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customer_id: customerId,
          customer_name: "Khách hàng",
          message_text: sentText,
          conversation_id: conversationId || undefined,
        }),
      })

      const data = await response.json()

      // send-ai trả về: ok | handed_over | handoff | ask_contact | error
      if (
        (data.status === "ok" ||
          data.status === "handed_over" ||
          data.status === "handoff" ||
          data.status === "ask_contact") &&
        data.response
      ) {
        if (data.response.conversation_id && data.response.conversation_id !== conversationId) {
          setConversationId(data.response.conversation_id)
          localStorage.setItem("vexim_conversation_id", data.response.conversation_id)
        }

        // Khi nào mời khách tư vấn sâu hơn qua Zalo/hotline — xem lib/consultation-offer.ts
        const decision = shouldOfferConsultation({
          status: data.status,
          suggestHandover: data.response.suggest_handover === true,
          sourcesCount: Array.isArray(data.response.sources) ? data.response.sources.length : undefined,
          customerMessage: sentText,
        })
        if (decision.offer && decision.reason) setConsultReason(decision.reason)

        const fullMessage = String(data.response.message_text || "")
        const messageId = data.response.message_id || `bot_${Date.now()}`
        const timestamp = data.response.timestamp || new Date().toISOString()

        knownIdsRef.current.add(String(messageId))

        // Hiển thị typing effect
        setIsStreaming(true)

        const tempBotMessage: Message = {
          id: messageId,
          sender_type: "bot",
          message_text: "",
          created_at: timestamp,
        }
        setMessages((prev) => [...prev, tempBotMessage])

        // Typing effect: hiển thị từng ký tự
        let currentIndex = 0
        const typingSpeed = 15 // ms per character (càng nhỏ càng nhanh)

        const typingInterval = setInterval(() => {
          if (currentIndex < fullMessage.length) {
            currentIndex++
            setMessages((prev) => {
              const updated = [...prev]
              const lastMsg = updated[updated.length - 1]
              if (lastMsg && lastMsg.id === messageId) {
                lastMsg.message_text = fullMessage.substring(0, currentIndex)
              }
              return updated
            })
          } else {
            // Hoàn thành typing
            clearInterval(typingInterval)
            setIsStreaming(false)
          }
        }, typingSpeed)
      } else {
        throw new Error(data.error || "Lỗi không xác định")
      }
    } catch (error) {
      console.error("[v0] Error sending message:", error)
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        sender_type: "bot",
        message_text:
          "Xin lỗi, em đang gặp sự cố kết nối. Anh/chị nhắn Zalo hoặc gọi hotline để được hỗ trợ ngay ạ.",
        created_at: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
      setConsultReason("error")
    } finally {
      setIsLoading(false)
      // Auto-focus input sau khi gửi tin nhắn
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
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
          aria-label="Mở chat với trợ lý AI"
        >
          <MessageCircle className="h-6 w-6 text-white" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
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
                <p className="text-xs text-white/80">Trợ lý AI • Trả lời ngay 24/7</p>
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
                    <p className="text-sm">Xin chào! Em là trợ lý AI của Vexim Global.</p>
                    <p className="text-xs mt-2">
                      Anh/chị hỏi về FDA, GACC, MFDS, US Agent… em trả lời ngay ạ.
                    </p>
                    <p className="mt-3 text-xs">
                      Cần tư vấn sâu hơn, anh/chị nhắn Zalo{" "}
                      <a
                        href={VEXIM_ZALO_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-[#0068FF] hover:underline"
                      >
                        {VEXIM_PHONE_DISPLAY}
                      </a>{" "}
                      ạ.
                    </p>
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
                          : msg.sender_type === "agent"
                            ? "bg-emerald-50 text-gray-800 rounded-bl-none border border-emerald-200"
                            : "bg-white text-gray-800 rounded-bl-none"
                      )}
                    >
                      {msg.sender_type === "agent" && (
                        <span className="mb-1 flex items-center gap-1 text-xs font-medium text-emerald-700">
                          <Headset className="h-3 w-3" /> Chuyên viên Vexim
                        </span>
                      )}
                      <div className="break-words">
                        {msg.sender_type === "customer" ? (
                          <p className="whitespace-pre-wrap">{msg.message_text}</p>
                        ) : (
                          parseMarkdown(msg.message_text)
                        )}
                      </div>
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

              {/* Mời tư vấn sâu hơn: hiện số Zalo/hotline chính thức của Vexim */}
              {consultReason && (
                <div className="border-t border-sky-200 bg-gradient-to-br from-sky-50 to-white p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-sky-900">
                        {CONSULTATION_CONTENT[consultReason].title}
                      </p>
                      <p className="mt-0.5 text-xs text-sky-800/90">
                        {CONSULTATION_CONTENT[consultReason].subtitle}
                      </p>
                    </div>
                    <button
                      onClick={() => setConsultReason(null)}
                      className="shrink-0 text-sky-700/60 transition-colors hover:text-sky-900"
                      aria-label="Đóng gợi ý"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-2 flex items-center gap-2 rounded-md border border-sky-200 bg-white px-3 py-2">
                    <Phone className="h-4 w-4 shrink-0 text-sky-600" />
                    <span className="text-base font-bold tracking-wide text-slate-900">
                      {VEXIM_PHONE_DISPLAY}
                    </span>
                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(VEXIM_PHONE_DISPLAY.replace(/\s/g, ""))
                          setPhoneCopied(true)
                          setTimeout(() => setPhoneCopied(false), 2000)
                        } catch {
                          // Trình duyệt chặn clipboard -> khách vẫn đọc được số trên màn hình
                        }
                      }}
                      className="ml-auto flex items-center gap-1 text-xs font-medium text-sky-700 hover:text-sky-900"
                      aria-label="Sao chép số điện thoại"
                    >
                      {phoneCopied ? (
                        <>
                          <Check className="h-3.5 w-3.5" /> Đã copy
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" /> Copy
                        </>
                      )}
                    </button>
                  </div>

                  <div className="mt-2 flex gap-2">
                    <a
                      href={VEXIM_ZALO_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-1 items-center justify-center gap-2 rounded-md bg-[#0068FF] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0057d6]"
                    >
                      <Headset className="h-4 w-4" />
                      Nhắn Zalo
                    </a>
                    <a
                      href={VEXIM_PHONE_TEL_URL}
                      className="flex flex-1 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50"
                    >
                      <Phone className="h-4 w-4" />
                      Gọi điện
                    </a>
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="border-t bg-white p-4 rounded-b-lg">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
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
                  Cần tư vấn sâu hơn?{" "}
                  <a
                    href={VEXIM_ZALO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#0068FF] hover:underline"
                  >
                    Zalo {VEXIM_PHONE_DISPLAY}
                  </a>{" "}
                  ·{" "}
                  <a href={VEXIM_PHONE_TEL_URL} className="font-medium hover:underline">
                    Gọi {VEXIM_PHONE_DISPLAY}
                  </a>
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
