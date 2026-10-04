/**
 * Khách gửi file (nhãn sản phẩm, danh mục, giấy tờ…) ngay trong khung chat.
 *
 * Vì sao cần: người mua dịch vụ tư vấn thường muốn gửi nhãn/danh mục để được tư
 * vấn đúng sản phẩm. Trước đây khung chat không có nút đính kèm, nên muốn gửi
 * file thì khách phải rời web sang Zalo — mất khách khỏi website.
 *
 * File được lưu vào Supabase Storage, thư mục theo hội thoại. Sau khi tải lên
 * thành công, khung chat gửi kèm `has_file: true` để rule engine chuyển chuyên
 * viên (LQ-04) — file cần người thật xem, không thể để AI tự đoán.
 *
 * Cần chạy scripts/041_chat_attachments_bucket.sql một lần để tạo bucket.
 */
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { findOrCreateConversation } from "@/lib/chatbot-conversation"

/** 10 MB — đủ cho catalog/nhãn sản phẩm, không biến chat thành nơi lưu trữ. */
const MAX_FILE_BYTES = 10 * 1024 * 1024
const BUCKET = "chat-attachments"

const ALLOWED_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/msword": "doc",
  "application/vnd.ms-excel": "xls",
  "text/csv": "csv",
  "text/plain": "txt",
}

/** Bỏ dấu tiếng Việt và ký tự lạ để tên file an toàn trên URL. */
function safeFileName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .slice(-80)
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")
    const conversationIdRaw = formData.get("conversation_id")
    const customerId = formData.get("customer_id")
    const conversationId = typeof conversationIdRaw === "string" ? conversationIdRaw : undefined

    if (!(file instanceof File)) {
      return NextResponse.json({ status: "error", error: "Thiếu file" }, { status: 400 })
    }
    // Khách có thể gửi file ngay khi vừa mở khung chat (chưa có hội thoại) ->
    // tìm theo customer_id hoặc tạo mới, giống hệt luồng gửi tin nhắn.
    if (!conversationId && (typeof customerId !== "string" || !customerId)) {
      return NextResponse.json({ status: "error", error: "Thiếu conversation_id" }, { status: 400 })
    }
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { status: "error", error: "File vượt quá 10MB. Anh/chị gửi qua Zalo giúp em nhé." },
        { status: 413 },
      )
    }

    const extension = ALLOWED_TYPES[file.type]
    if (!extension) {
      return NextResponse.json(
        {
          status: "error",
          error: "Em nhận được PDF, ảnh, Word, Excel và CSV. Định dạng khác anh/chị gửi qua Zalo giúp em nhé.",
        },
        { status: 415 },
      )
    }

    const supabase = await createClient()

    const conversation = await findOrCreateConversation(supabase, {
      conversationId,
      customerId: typeof customerId === "string" ? customerId : undefined,
    })

    if (!conversation) {
      return NextResponse.json({ status: "error", error: "Không tìm thấy hội thoại" }, { status: 404 })
    }

    const path = `${conversation.id}/${Date.now()}-${safeFileName(file.name) || `file.${extension}`}`
    const arrayBuffer = await file.arrayBuffer()

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, arrayBuffer, { contentType: file.type, upsert: false })

    if (uploadError) {
      console.error("[v0] Lỗi tải file lên:", uploadError)
      const bucketMissing = /bucket|not found/i.test(uploadError.message || "")
      return NextResponse.json(
        {
          status: "error",
          error: bucketMissing
            ? "Kênh nhận file chưa được bật. Anh/chị gửi qua Zalo giúp em nhé."
            : "Chưa tải được file. Anh/chị thử lại hoặc gửi qua Zalo giúp em nhé.",
        },
        { status: 500 },
      )
    }

    const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(path)

    return NextResponse.json({
      status: "ok",
      conversation_id: conversation.id,
      url: publicUrlData?.publicUrl || "",
      name: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error("[v0] Lỗi API tải file:", error)
    return NextResponse.json({ status: "error", error: "Internal server error" }, { status: 500 })
  }
}
