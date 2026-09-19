import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/require-admin"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB (khớp với thông báo ở UI)
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/avif"]
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif", "avif"]

/**
 * POST /api/upload-image — upload ảnh cho trình soạn thảo blog.
 * Yêu cầu đăng nhập admin (trước đây ai cũng gọi được -> rủi ro lạm dụng Blob).
 */
export async function POST(request: NextRequest) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.response

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Chỉ chấp nhận ảnh JPG, PNG, WebP, GIF, AVIF" }, { status: 400 })
    }

    const extension = (file.name.split(".").pop() || "").toLowerCase()
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return NextResponse.json({ error: "Phần mở rộng file không hợp lệ" }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 })
    }

    // Tên file an toàn + hậu tố ngẫu nhiên để không ghi đè lên ảnh cũ
    const timestamp = Date.now()
    const baseName = file.name
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9.-]/g, "_")
      .slice(0, 60)
    const filename = `blog/${timestamp}-${baseName || "image"}.${extension}`

    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
    })

    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
      contentType: file.type,
      size: file.size,
    })
  } catch (error) {
    console.error("[blog] Upload error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 },
    )
  }
}
