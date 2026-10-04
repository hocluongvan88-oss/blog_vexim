"use client"

import React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import {
  MessageCircle,
  X,
  Send,
  Minimize2,
  Headset,
  Phone,
  Copy,
  Check,
  ArrowDown,
  Paperclip,
  Mail,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { mergeIncomingMessages } from "@/lib/chat-message-merge"
import { parseChatMarkdown, type InlineNode } from "@/lib/chat-markdown"
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
import {
  HANDOFF_CONNECT_QUESTION,
  extractLeadProfile,
  isLeadReady,
  summarizeLead,
  type LeadProfile,
} from "@/lib/lead-profile"

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
  ready_for_handoff: {
    title: "Em đã nắm được thông tin cơ bản của mình",
    subtitle: "Chuyên viên Vexim sẽ xem hồ sơ và tư vấn chính xác cho trường hợp của anh/chị ạ.",
  },
  error: {
    title: "Kết nối đang gián đoạn",
    subtitle: `Anh/chị nhắn Zalo hoặc gọi ${VEXIM_PHONE_DISPLAY} để được hỗ trợ ngay ạ.`,
  },
}

/**
 * Câu hỏi gợi ý ở màn hình trống.
 *
 * Vì sao cần: khách doanh nghiệp vào trang dịch vụ thường không biết bắt đầu từ
 * đâu, còn ô chat trống thì không cho thấy Vexim hiểu nghề tới mức nào. Bốn câu
 * này là bốn chủ đề được hỏi nhiều nhất (theo dữ liệu chat_messages).
 */
const QUICK_QUESTIONS = [
  "Thực phẩm đóng hộp xuất sang Mỹ cần gì?",
  "Đăng ký GACC mất bao lâu?",
  "Đã có mã DUNS thì đăng ký FDA mất mấy ngày?",
  "US Agent là gì và khi nào cần?",
]

/**
 * Dựng nội dung tin nhắn từ dữ liệu đã đọc của lib/chat-markdown.ts.
 *
 * KHÔNG dùng dangerouslySetInnerHTML: nội dung do AI sinh ra (và AI có thể bị
 * dẫn dắt bởi câu hỏi của khách) nên tuyệt đối không được chèn thẳng vào DOM.
 * Cách này vừa an toàn vừa hiển thị được bảng — thứ mà bản cũ không làm được.
 */
function renderInline(nodes: InlineNode[], keyPrefix: string): React.ReactNode[] {
  return nodes.map((node, index) => {
    const key = `${keyPrefix}-${index}`
    switch (node.type) {
      case "strong":
        return <strong key={key} className="font-semibold">{node.text}</strong>
      case "em":
        return <em key={key}>{node.text}</em>
      case "code":
        return (
          <code key={key} className="rounded bg-black/5 px-1 py-0.5 font-mono text-[0.85em]">
            {node.text}
          </code>
        )
      case "link":
        return (
          <a
            key={key}
            href={node.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {node.text}
          </a>
        )
      default:
        return <React.Fragment key={key}>{node.text}</React.Fragment>
    }
  })
}

function MessageContent({ text }: { text: string }) {
  const blocks = parseChatMarkdown(text)

  return (
    <div className="space-y-1.5">
      {blocks.map((block, blockIndex) => {
        const key = `b${blockIndex}`
        if (block.type === "spacer") return <div key={key} className="h-1" />

        if (block.type === "list") {
          return (
            <ul key={key} className="space-y-0.5 pl-4">
              {block.items.map((item, itemIndex) => (
                <li key={`${key}-${itemIndex}`} className={block.ordered ? "list-decimal" : "list-disc"}>
                  {renderInline(item, `${key}-${itemIndex}`)}
                </li>
              ))}
            </ul>
          )
        }

        if (block.type === "table") {
          return (
            // Bảng có thể rộng hơn khung chat -> cho cuộn ngang, không phá bố cục
            <div key={key} className="-mx-1 overflow-x-auto">
              <table className="w-full min-w-[260px] border-collapse text-left text-[13px]">
                <thead>
                  <tr>
                    {block.header.map((cell, cellIndex) => (
                      <th
                        key={`${key}-h${cellIndex}`}
                        className="border border-gray-200 bg-gray-100 px-2 py-1 font-semibold"
                      >
                        {renderInline(cell, `${key}-h${cellIndex}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rowIndex) => (
                    <tr key={`${key}-r${rowIndex}`}>
                      {row.map((cell, cellIndex) => (
                        <td
                          key={`${key}-r${rowIndex}c${cellIndex}`}
                          className="border border-gray-200 px-2 py-1 align-top"
                        >
                          {renderInline(cell, `${key}-r${rowIndex}c${cellIndex}`)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }

        return <p key={key}>{renderInline(block.inline, key)}</p>
      })}
    </div>
  )
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
  const [unreadCount, setUnreadCount] = useState(0)
  /** Lý do mời khách liên hệ Zalo/hotline (null = chưa cần) */
  const [consultReason, setConsultReason] = useState<ConsultationReason | null>(null)
  const [phoneCopied, setPhoneCopied] = useState(false)
  /** Thông tin khách đã cung cấp trong lúc chat (thu thập như một sale Vexim) */
  const [leadProfile, setLeadProfile] = useState<LeadProfile>({})
  const leadProfileRef = useRef<LeadProfile>({})
  /** Trạng thái nút "Kết nối chuyên viên" */
  const [connectState, setConnectState] = useState<"idle" | "sending" | "sent" | "error">("idle")
  /** Trạng thái gửi file đính kèm */
  const [attachState, setAttachState] = useState<"idle" | "uploading" | "error">("idle")
  const [attachError, setAttachError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  /** Ô nhận email để khách tự yêu cầu bản tóm tắt (dùng cho sếp/bộ phận đọc lại) */
  const [summaryEmail, setSummaryEmail] = useState("")
  const [emailState, setEmailState] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [emailMessage, setEmailMessage] = useState("")
  /** Bản tổng hợp thông tin khách để hiện cho khách xác nhận lại */
  const leadSummary = summarizeLead(leadProfile)
  /** Khung cuộn chứa tin nhắn — dùng để tự động cuộn xuống khi có tin mới. */
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  /** Khách có đang ở cuối khung không? (false = đang kéo lên đọc lại) */
  const isAtBottomRef = useRef(true)
  const [showJumpToLatest, setShowJumpToLatest] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const knownIdsRef = useRef<Set<string>>(new Set())
  /** Nội dung các tin khách ĐÃ GỬI tại máy này — để không hiện trùng khi nạp lại lịch sử */
  const localCustomerTextsRef = useRef<Set<string>>(new Set())

  /** Cuộn xuống cuối khung chat. */
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "auto") => {
    const container = messagesContainerRef.current
    if (!container) return
    if (behavior === "smooth") {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" })
    } else {
      container.scrollTop = container.scrollHeight
    }
    isAtBottomRef.current = true
    setShowJumpToLatest(false)
  }, [])

  /** Theo dõi vị trí cuộn để biết khách có đang ở cuối khung hay không. */
  const handleMessagesScroll = useCallback(() => {
    const container = messagesContainerRef.current
    if (!container) return
    const distanceToBottom = container.scrollHeight - container.scrollTop - container.clientHeight
    const atBottom = distanceToBottom <= 80
    isAtBottomRef.current = atBottom
    setShowJumpToLatest(!atBottom)
  }, [])

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

    // Khách quay lại sau khi đóng trình duyệt: giữ lại thông tin đã cung cấp
    try {
      const storedProfile = localStorage.getItem("vexim_lead_profile")
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile) as LeadProfile
        leadProfileRef.current = parsed
        setLeadProfile(parsed)
      }
    } catch {
      // dữ liệu cũ hỏng -> bỏ qua, thu thập lại từ đầu
    }

    const storedConvId = localStorage.getItem("vexim_conversation_id")
    if (storedConvId) {
      setConversationId(storedConvId)
      loadHistory(storedConvId)
    }
  }, [])

  /**
   * Tự cuộn xuống khi có nội dung mới — kể cả trong lúc AI đang gõ từng ký tự.
   *
   * Trước đây: cứ đang gõ là KHÔNG cuộn, nên câu trả lời dài trôi xuống dưới
   * đáy khung và khách phải tự kéo xuống mới đọc được. Ngoài ra phép kiểm tra
   * "đang ở cuối" được tính SAU khi khung đã cao thêm, nên tin mới luôn bị coi
   * là "khách đã kéo lên" và không cuộn.
   *
   * Nay: ghi nhớ vị trí cuộn TRƯỚC đó (isAtBottomRef, cập nhật trong onScroll).
   * Chỉ không cuộn khi khách chủ động kéo lên đọc lại — lúc đó hiện nút
   * "Tin nhắn mới" để khách tự quyết định.
   */
  useEffect(() => {
    if (!isAtBottomRef.current) return
    const container = messagesContainerRef.current
    if (!container) return
    // Đang gõ từng ký tự thì phải nhảy thẳng xuống đáy; dùng "smooth" sẽ bị trễ
    // và giật vì nội dung tăng liên tục mỗi 15ms.
    container.scrollTop = container.scrollHeight
  }, [messages, consultReason])

  // Auto-focus input khi mở chat hoặc khi không minimize
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus()
        // Mở lại khung chat -> luôn hiện tin nhắn mới nhất ở cuối
        scrollToBottom()
      }, 100)
    }
  }, [isOpen, isMinimized, scrollToBottom])

  // Mở chat -> coi như đã đọc
  useEffect(() => {
    if (isOpen) setUnreadCount(0)
  }, [isOpen])

  // Phím Escape đóng khung chat (thói quen chung của mọi cửa sổ nổi).
  // Trước đây chỉ có chuột mới đóng được -> người dùng bàn phím bị kẹt.
  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
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

  // Gửi tin nhắn. Tham số `preset` dùng cho các câu hỏi gợi ý ở màn hình trống.
  const sendMessage = async (
    preset?: string,
    attachment?: { url: string; name: string },
  ) => {
    const outgoing = (preset ?? inputMessage).trim()
    if (!outgoing || isLoading) return

    const userMessage: Message = {
      id: `temp_${Date.now()}`,
      sender_type: "customer",
      message_text: outgoing,
      created_at: new Date().toISOString(),
    }

    knownIdsRef.current.add(userMessage.id)
    localCustomerTextsRef.current.add(userMessage.message_text.trim())

    // Thu thập thông tin khách hàng (thị trường, nhóm sản phẩm, DUNS, số điện thoại…)
    const nextProfile = extractLeadProfile(userMessage.message_text, leadProfileRef.current)
    leadProfileRef.current = nextProfile
    setLeadProfile(nextProfile)
    try {
      localStorage.setItem("vexim_lead_profile", JSON.stringify(nextProfile))
    } catch {
      // trình duyệt chặn localStorage -> vẫn gửi lên máy chủ trong request bên dưới
    }
    // Khách vừa gửi tin -> chắc chắn muốn thấy tin của mình, kể cả khi đang
    // kéo lên đọc lại đoạn trước.
    isAtBottomRef.current = true
    setShowJumpToLatest(false)
    setMessages((prev) => [...prev, userMessage])
    const sentText = outgoing
    if (!preset) setInputMessage("")
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
          lead_profile: nextProfile,
          has_file: Boolean(attachment),
          attachment_url: attachment?.url,
          attachment_name: attachment?.name,
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
          leadProfile: nextProfile,
        })
        if (decision.offer && decision.reason) setConsultReason(decision.reason)

        const fullMessage = String(data.response.message_text || "")
        const messageId = data.response.message_id || `bot_${Date.now()}`
        const timestamp = data.response.timestamp || new Date().toISOString()

        knownIdsRef.current.add(String(messageId))

        // Hiện câu trả lời NGAY, không gõ từng ký tự.
        //
        // Bản cũ gõ 15ms/ký tự: câu trả lời 500 ký tự bắt khách chờ 7,5 giây —
        // với người đang so sánh nhiều nhà cung cấp thì đây là lý do bỏ đi.
        // Nó còn gây lỗi: isLoading đã tắt trong lúc chữ vẫn đang gõ, nên khách
        // gửi được tin thứ hai -> hai vòng lặp gõ cùng ghi vào "tin cuối" và làm
        // lẫn nội dung hai câu trả lời.
        isAtBottomRef.current = true
        setMessages((prev) => [
          ...prev,
          {
            id: messageId,
            sender_type: "bot",
            message_text: fullMessage,
            created_at: timestamp,
          },
        ])
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

  /**
   * Khách chọn file -> tải lên rồi gửi tin nhắn kèm file.
   *
   * File cần chuyên viên xem (nhãn, danh mục, giấy tờ) nên máy chủ sẽ tự chuyển
   * chuyên viên theo rule LQ-04 — AI không tự đoán nội dung file.
   */
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    // Cho phép chọn lại đúng file vừa rồi ở lần sau
    event.target.value = ""
    if (!file) return

    setAttachState("uploading")
    setAttachError("")

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("customer_id", customerId)
      if (conversationId) formData.append("conversation_id", conversationId)

      const response = await fetch("/api/chatbot/upload", { method: "POST", body: formData })
      const data = await response.json()

      if (!response.ok || data.status !== "ok") {
        throw new Error(data.error || "Chưa tải được file")
      }

      // Hội thoại có thể vừa được tạo ở bước tải file
      if (data.conversation_id && data.conversation_id !== conversationId) {
        setConversationId(data.conversation_id)
        localStorage.setItem("vexim_conversation_id", data.conversation_id)
      }

      setAttachState("idle")
      await sendMessage(`Em gửi file: ${data.name}`, { url: data.url, name: data.name })
    } catch (error: any) {
      console.error("[v0] Lỗi gửi file:", error)
      setAttachState("error")
      setAttachError(error?.message || "Chưa tải được file. Anh/chị gửi qua Zalo giúp em nhé.")
    }
  }

  /** Khách yêu cầu gửi bản tóm tắt cuộc trao đổi qua email. */
  const sendSummaryEmail = async () => {
    if (!summaryEmail.trim() || emailState === "sending") return
    setEmailState("sending")
    setEmailMessage("")

    try {
      const response = await fetch("/api/chatbot/email-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: conversationId,
          email: summaryEmail.trim(),
          lead_profile: leadProfileRef.current,
        }),
      })
      const data = await response.json()
      if (!response.ok || data.status !== "ok") throw new Error(data.error || "Chưa gửi được email")
      setEmailState("sent")
      setEmailMessage(data.message || "Đã gửi bản tóm tắt ạ.")
    } catch (error: any) {
      setEmailState("error")
      setEmailMessage(error?.message || "Chưa gửi được email, anh/chị thử lại giúp em nhé.")
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
          aria-label="Mở chat với trợ lý AI của Vexim Global"
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
            isMinimized
              ? "h-16 w-80"
              : // dvh = chiều cao thật của màn hình (điện thoại có thanh địa chỉ động)
                "h-[min(600px,calc(100dvh-3rem))] w-96 max-w-[calc(100vw-1.5rem)]"
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
                <p className="text-xs text-white/80">
                  Trợ lý AI 24/7 • Chuyên viên trong giờ làm việc
                </p>
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
              <div className="relative flex min-h-0 flex-1 flex-col">
                <div
                  ref={messagesContainerRef}
                  onScroll={handleMessagesScroll}
                  role="log"
                  aria-live="polite"
                  aria-label="Nội dung hội thoại với trợ lý Vexim"
                  className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 bg-gray-50"
                >
                  {messages.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">Xin chào! Em là trợ lý AI của Vexim Global.</p>
                      <p className="text-xs mt-2">
                        Anh/chị hỏi về FDA, GACC, MFDS, US Agent… em trả lời ngay ạ.
                      </p>
                      {/* Câu hỏi gợi ý — khách mới chỉ cần bấm là hỏi được */}
                      <div className="mt-4 flex flex-wrap justify-center gap-2">
                        {QUICK_QUESTIONS.map((question) => (
                          <button
                            key={question}
                            type="button"
                            onClick={() => sendMessage(question)}
                            className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-left text-xs text-gray-700 transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                          >
                            {question}
                          </button>
                        ))}
                      </div>

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
                            <MessageContent text={msg.message_text} />
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

              </div>

              {/* Khách đã kéo lên đọc lại -> không kéo họ xuống, chỉ gợi ý */}
              {showJumpToLatest && messages.length > 0 && (
                <button
                  type="button"
                  onClick={() => scrollToBottom("smooth")}
                  className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-md ring-1 ring-gray-200 transition-colors hover:bg-gray-50"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                  Tin nhắn mới nhất
                </button>
              )}
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

                  {/* Câu hỏi bắt buộc theo yêu cầu của Vexim: luôn hỏi khách có muốn
                      kết nối với chuyên viên không, kèm nút để khách đồng ý 1 chạm. */}
                  {isLeadReady(leadProfile) || consultReason === "ready_for_handoff" ? (
                    <p className="mt-2 text-sm font-medium text-sky-900">{HANDOFF_CONNECT_QUESTION}</p>
                  ) : null}

                  {leadSummary.length > 0 && (
                    <ul className="mt-2 space-y-0.5 rounded-md border border-sky-100 bg-white/70 px-3 py-2 text-xs text-slate-700">
                      <li className="font-medium text-sky-900">Thông tin em đã ghi nhận:</li>
                      {leadSummary.map((line) => (
                        <li key={line}>• {line}</li>
                      ))}
                    </ul>
                  )}

                  {connectState === "sent" ? (
                    <p className="mt-2 flex items-center gap-1.5 rounded-md bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800">
                      <Check className="h-3.5 w-3.5" />
                      Đã gửi tới chuyên viên Vexim — anh/chị để ý điện thoại/Zalo giúp em nhé.
                    </p>
                  ) : (
                    <button
                      type="button"
                      disabled={connectState === "sending"}
                      onClick={async () => {
                        setConnectState("sending")
                        try {
                          const response = await fetch("/api/chatbot/connect", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              conversation_id: conversationId,
                              lead_profile: leadProfileRef.current,
                            }),
                          })
                          const data = await response.json()
                          if (!response.ok || data.status !== "ok") throw new Error(data.error || "failed")
                          setConnectState("sent")
                          // Hiện luôn trong mạch hội thoại để khách yên tâm
                          setMessages((prev) => [
                            ...prev,
                            {
                              id: `connect_${Date.now()}`,
                              sender_type: "bot",
                              message_text: String(data.message_text || ""),
                              created_at: new Date().toISOString(),
                            },
                          ])
                        } catch (error) {
                          console.error("[v0] Không gửi được yêu cầu kết nối:", error)
                          setConnectState("error")
                        }
                      }}
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-700 disabled:opacity-60"
                    >
                      <Headset className="h-4 w-4" />
                      {connectState === "sending" ? "Đang gửi tới chuyên viên…" : "Có, kết nối em với chuyên viên"}
                    </button>
                  )}
                  {connectState === "error" && (
                    <p className="mt-1 text-xs text-rose-600">
                      Chưa gửi được ạ. Anh/chị nhắn Zalo {VEXIM_PHONE_DISPLAY} giúp em nhé.
                    </p>
                  )}

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

                  {/* Khách doanh nghiệp cần gửi lại nội dung cho sếp/bộ phận:
                      cho họ nhận bản tóm tắt qua email thay vì phải copy tay. */}
                  {emailState === "sent" ? (
                    <p className="mt-2 flex items-center gap-1.5 rounded-md bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800">
                      <Check className="h-3.5 w-3.5" />
                      {emailMessage}
                    </p>
                  ) : (
                    <div className="mt-2">
                      <div className="flex gap-2">
                        <Input
                          type="email"
                          value={summaryEmail}
                          onChange={(e) => setSummaryEmail(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") sendSummaryEmail()
                          }}
                          placeholder="Email để nhận bản tóm tắt"
                          className="h-9 flex-1 text-sm"
                          aria-label="Email nhận bản tóm tắt cuộc trao đổi"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-9"
                          disabled={emailState === "sending" || !summaryEmail.trim()}
                          onClick={sendSummaryEmail}
                        >
                          {emailState === "sending" ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <>
                              <Mail className="mr-1 h-3.5 w-3.5" /> Gửi
                            </>
                          )}
                        </Button>
                      </div>
                      <p className="mt-1 text-[11px] text-sky-800/80">
                        Em gửi lại toàn bộ nội dung trao đổi để anh/chị chuyển cho bộ phận liên quan.
                      </p>
                      {emailState === "error" && emailMessage && (
                        <p className="mt-1 text-[11px] text-rose-600">{emailMessage}</p>
                      )}
                    </div>
                  )}

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
                  {/* Đính kèm file — khách gửi nhãn/danh mục ngay trong chat,
                      không phải rời web sang Zalo */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg,.webp,.xlsx,.xls,.docx,.doc,.csv,.txt"
                    onChange={handleFileSelect}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={isLoading || attachState === "uploading"}
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Gửi file cho chuyên viên"
                    title="Gửi nhãn sản phẩm, danh mục, giấy tờ (PDF, ảnh, Word, Excel)"
                  >
                    {attachState === "uploading" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Paperclip className="h-4 w-4" />
                    )}
                  </Button>
                  <Input
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập tin nhắn..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => sendMessage()}
                    disabled={isLoading || !inputMessage.trim()}
                    size="icon"
                    aria-label="Gửi tin nhắn"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                {attachState === "error" && attachError && (
                  <p className="mt-2 text-center text-xs text-rose-600">{attachError}</p>
                )}
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
