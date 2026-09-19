# Vercel Blob Storage Setup Guide

## Tổng quan

Hệ thống đã được nâng cấp để sử dụng **Vercel Blob Storage** thay vì lưu ảnh dưới dạng Base64 trong database.

## Lợi ích của Vercel Blob

1. **Hiệu suất cao hơn**: Ảnh được serve qua CDN toàn cầu
2. **Tiết kiệm database**: Không lưu Base64 lớn trong database
3. **Tối ưu hóa**: Automatic image optimization và caching
4. **Scalable**: Không giới hạn storage như database
5. **Faster loading**: CDN edge locations gần người dùng

## Cách Setup

### Bước 1: Kết nối Blob Integration (trong v0)

1. Mở sidebar trong chat v0
2. Chọn tab "Connect"
3. Tìm và kết nối "Blob" integration
4. Environment variable `BLOB_READ_WRITE_TOKEN` sẽ được tự động thêm

### Bước 2: Setup cho Local Development (tùy chọn)

Nếu bạn muốn test local:

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Pull environment variables
vercel env pull .env.local
\`\`\`

### Bước 3: Verify Setup

Sau khi kết nối Blob integration:

1. Vào Admin Panel: `/admin/posts/new`
2. Thử upload ảnh trong "Featured Image"
3. Kiểm tra URL trả về có dạng: `https://[hash].public.blob.vercel-storage.com/...`
4. Nếu URL vẫn là `data:image/...` => Blob chưa được setup đúng

## API Changes

### Upload Image API (`/app/api/upload-image/route.ts`)

**Trước (Base64):**
\`\`\`typescript
const base64 = buffer.toString("base64")
const dataUrl = `data:${file.type};base64,${base64}`
return NextResponse.json({ url: dataUrl })
\`\`\`

**Sau (Blob):**
\`\`\`typescript
import { put } from "@vercel/blob"

const blob = await put(filename, file, {
  access: "public",
})
return NextResponse.json({ url: blob.url })
\`\`\`

## Troubleshooting

### Lỗi: "BLOB_READ_WRITE_TOKEN is not defined"

**Nguyên nhân**: Chưa kết nối Blob integration

**Giải pháp**:
1. Kết nối Blob từ sidebar trong v0
2. Hoặc thêm manual trong Vercel Dashboard > Settings > Environment Variables

### Lỗi: "Request failed with status code 403"

**Nguyên nhân**: Token không hợp lệ hoặc hết hạn

**Giải pháp**:
1. Xóa Blob integration cũ
2. Kết nối lại Blob integration mới
3. Redeploy project

### URL vẫn là Base64

**Nguyên nhân**: Code cũ chưa được deploy

**Giải pháp**:
1. Verify file `/app/api/upload-image/route.ts` đã import `@vercel/blob`
2. Trigger redeploy trong Vercel
3. Clear browser cache

## File Size Limits

- **Vercel Blob**: 500MB per file (Free tier)
- **Recommended**: Giới hạn 10MB cho ảnh blog (đã config trong code)

## Best Practices

1. **Validate file type**: Chỉ cho phép image/* types
2. **Compress trước khi upload**: Giảm file size để tăng tốc độ
3. **Use unique filenames**: Tránh conflict (đã có timestamp trong code)
4. **Set proper access**: "public" cho ảnh blog
5. **Clean up unused blobs**: Định kỳ xóa ảnh không dùng

## Code Example

\`\`\`typescript
// Upload ảnh trong component
const handleImageUpload = async (file: File) => {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch("/api/upload-image", {
    method: "POST",
    body: formData,
  })

  const data = await response.json()
  console.log("Blob URL:", data.url)
  // URL format: https://xxxxx.public.blob.vercel-storage.com/...
}
\`\`\`

## Monitoring

Xem thống kê Blob usage:
1. Vercel Dashboard > Storage
2. Xem số lượng files, bandwidth, storage used
3. Free tier: 500MB storage, 1GB bandwidth/month

## Migration từ Base64

Nếu bạn đã có ảnh Base64 trong database:

1. Tạo script migration để convert Base64 → Blob
2. Chạy script để upload lại tất cả ảnh
3. Update database records với Blob URLs mới
4. Clean up Base64 data cũ

## Support

- Vercel Blob Docs: https://vercel.com/docs/storage/vercel-blob
- Issues: Check Vercel Dashboard > Storage > Logs
- v0 Support: Chat với v0 để troubleshoot
