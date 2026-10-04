# Hướng Dẫn Tích Hợp Hệ Thống AI Chatbot Vexim

## Tổng Quan

Hệ thống AI Chatbot đã được tích hợp với các tính năng sau:
- ✅ AI Groq với Retrieval-Augmented Generation (RAG)
- ✅ Knowledge Base Management (Quản lý kho tri thức)
- ✅ Agent Handover System (Cướp quyền AI để tư vấn trực tiếp)
- 🔄 Zalo Integration (Đang phát triển)
- 🔄 Facebook Integration (Đang phát triển)

## 1. Setup Database

### Bước 1: Kết nối Supabase
1. Vào v0 interface, chọn **Connect** → **Supabase**
2. Làm theo hướng dẫn để kết nối

### Bước 2: Chạy Migration
Chạy script tạo database schema:
\`\`\`bash
scripts/008_create_ai_knowledge_base.sql
\`\`\`

Script này sẽ tạo các bảng:
- `knowledge_documents` - Lưu tài liệu gốc
- `knowledge_chunks` - Lưu các đoạn văn đã chia nhỏ
- `ai_config` - Cấu hình AI
- `conversation_handovers` - Quản lý handover

## 2. Cấu Hình Groq API

### Lấy API Key
1. Đăng ký tài khoản tại [Groq Console](https://console.groq.com)
2. Tạo API key mới
3. Thêm vào Environment Variables trong v0:
   \`\`\`
   GROQ_API_KEY=your_api_key_here
   \`\`\`

### Cấu Hình Model
Mặc định sử dụng: `openai/gpt-oss-120b` (Groq đã ngừng phục vụ Llama 3.3 70B từ 16/08/2026)

Có thể thay đổi trong `lib/ai-service.ts`:
\`\`\`typescript
const MODEL = "openai/gpt-oss-120b" // Model cũ đã bị Groq khai tử 16/08/2026
\`\`\`

## 3. Quản Lý Knowledge Base

### Truy Cập
Admin Dashboard → **Kho Tri Thức AI**

### Thêm Tài Liệu

#### Từ Văn Bản
1. Click "Thêm Tài Liệu"
2. Chọn tab "Văn Bản"
3. Nhập tiêu đề và nội dung
4. Click "Tải Lên"

#### Từ URL
1. Click "Thêm Tài Liệu"
2. Chọn tab "URL"
3. Nhập URL trang web chứa thông tin
4. Hệ thống tự động crawl nội dung

#### Từ File
1. Click "Thêm Tài Liệu"
2. Chọn tab "File"
3. Upload file (PDF, DOCX, TXT)
4. Hệ thống tự động xử lý

### Cách AI Sử Dụng Tài Liệu
- Tài liệu được chia thành các chunks nhỏ
- Khi user hỏi, AI tìm kiếm chunks liên quan
- AI trả lời dựa trên context từ chunks + prompt system

## 4. Agent Handover System

### Cách Hoạt Động

#### Tự Động Gợi Ý
AI sẽ tự động đề xuất handover khi:
- User có câu hỏi phức tạp
- User yêu cầu tư vấn chuyên sâu
- User muốn nói chuyện với người thật

#### Cướp Quyền Thủ Công
Admin có thể:
1. Vào **Hội thoại Chat**
2. Xem các conversation đang diễn ra
3. Click "Cướp Quyền" để tự tư vấn
4. Trả lời trực tiếp qua interface
5. Click "Trả Lại AI" khi xong

### UI/UX
- User thấy badge "AI" hoặc "Chuyên gia"
- Tin nhắn từ agent có màu khác
- Realtime updates (nếu có socket)

## 5. Tích Hợp Zalo (Sắp Ra Mắt)

### Workflow
\`\`\`
User Zalo → Zalo Webhook → /api/webhooks/zalo 
           → AI/Agent Process → Response → Zalo API
\`\`\`

### Cần Chuẩn Bị
- Zalo Official Account
- Zalo Developer App
- Webhook URL từ v0 project

## 6. Tích Hợp Facebook (Sắp Ra Mắt)

### Workflow
\`\`\`
User Messenger → FB Webhook → /api/webhooks/facebook 
               → AI/Agent Process → Response → FB Send API
\`\`\`

### Cần Chuẩn Bị
- Facebook Page
- Facebook Developer App
- Messenger Webhook subscription

## 7. Testing

### Test AI Response
\`\`\`bash
curl -X POST https://your-domain.com/api/chatbot/send-ai \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Quy trình đăng ký FDA là gì?",
    "conversationId": "test-123"
  }'
\`\`\`

### Test Knowledge Base
1. Upload tài liệu về dịch vụ Vexim
2. Hỏi chatbot về dịch vụ đó
3. Kiểm tra AI có trả lời đúng không

## 8. Best Practices

### Nội Dung Knowledge Base
- **Rõ ràng**: Viết ngắn gọn, dễ hiểu
- **Cấu trúc**: Chia theo chủ đề
- **Cập nhật**: Thường xuyên review và update

### System Prompt
Chỉnh sửa trong `lib/ai-service.ts`:
\`\`\`typescript
const SYSTEM_PROMPT = `Bạn là trợ lý AI của Vexim Global...`
\`\`\`

### Handover Rules
- Handover ngay khi user yêu cầu
- Không để user chờ quá 2 phút
- Thông báo rõ ràng khi handover

## 9. Monitoring

### Metrics Cần Theo Dõi
- Response time AI
- Handover rate
- User satisfaction
- Knowledge base coverage

### Logs
Check logs tại:
- Browser Console (client-side)
- Vercel Logs (server-side)
- Supabase Logs (database)

## 10. Roadmap

### Phase 1 (Hiện Tại)
- [x] Groq AI Integration
- [x] Knowledge Base Management
- [x] Agent Handover

### Phase 2 (Tiếp Theo)
- [ ] Zalo Integration
- [ ] Facebook Integration
- [ ] WhatsApp Integration

### Phase 3 (Tương Lai)
- [ ] Voice Chat Support
- [ ] Multi-language Support
- [ ] Advanced Analytics Dashboard
- [ ] AI Training Interface

## Support

Nếu cần hỗ trợ:
1. Check logs trong Vercel
2. Kiểm tra Supabase connection
3. Review environment variables
4. Test API endpoints riêng lẻ

---

**Lưu ý**: Đảm bảo đã chạy script migration trước khi sử dụng hệ thống.
