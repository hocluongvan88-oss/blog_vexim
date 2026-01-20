# Hệ thống Chuyển giao Cuộc trò chuyện (Handover System)

## Tổng quan

Hệ thống cho phép chuyển giao cuộc trò chuyện giữa AI Bot và Admin theo 2 cách:
1. **Admin chủ động cướp quyền** (Manual Takeover)
2. **AI tự động đề xuất chuyển giao** (Auto-suggested Handover)

## Khi nào AI tự động đề xuất chuyển giao?

AI sẽ tự động đề xuất chuyển sang Admin trong các trường hợp sau (được phân tích trong `/lib/ai-service.ts`):

### 1. Yêu cầu khẩn cấp
Tin nhắn chứa các từ khóa: `khẩn cấp`, `gấp`, `ngay`, `urgent`, `nhanh`

**Ví dụ:**
- "Tôi cần gấp, làm ơn hỗ trợ ngay"
- "Urgent! Need help immediately"

### 2. Yêu cầu phức tạp
Tin nhắn chứa các từ khóa: `tư vấn chi tiết`, `báo giá cụ thể`, `hợp đồng`, `thỏa thuận`, `ký kết`

**Ví dụ:**
- "Tôi cần tư vấn chi tiết về dịch vụ FDA"
- "Vui lòng gửi báo giá cụ thể cho 100 sản phẩm"

### 3. AI không tự tin (Confidence thấp < 0.5)
AI phát hiện response của nó chứa các từ: `không chắc`, `có thể`, `không rõ`, `xin lỗi`, `không hiểu`

**Ví dụ response của AI:**
- "Xin lỗi, tôi không chắc về thông tin này..."
- "Tôi không hiểu yêu cầu của bạn, vui lòng liên hệ..."

### 4. Lỗi hệ thống
Khi có lỗi kỹ thuật xảy ra trong quá trình xử lý

## Cách Admin chủ động cướp quyền

### Bước 1: Vào trang Conversations
Truy cập: `/admin/conversations`

### Bước 2: Chọn cuộc trò chuyện
Click vào cuộc trò chuyện muốn xử lý trong danh sách bên trái

### Bước 3: Nhấn nút "Chuyển sang Admin"
Nút này hiển thị ở góc phải trên cùng của khung chat

### Kết quả:
- Badge "Admin mode" xuất hiện trên cuộc trò chuyện
- AI ngừng trả lời tự động
- Admin có thể gửi tin nhắn trực tiếp
- Record được tạo trong bảng `conversation_handovers`

## Sau khi cướp quyền

### Trạng thái thay đổi:
\`\`\`
conversations.handover_mode = "manual"
conversations.metadata.handed_over = true
conversation_handovers.status = "active"
\`\`\`

### Chức năng Admin:
- ✅ Xem toàn bộ lịch sử chat
- ✅ Gửi tin nhắn trực tiếp cho khách hàng
- ✅ Tin nhắn có `sender_type = "agent"`
- ✅ Badge "Admin mode" hiển thị
- ✅ Nút "Trả lại AI" để trả quyền lại

### AI sẽ:
- ❌ KHÔNG trả lời tự động các tin nhắn mới
- ✅ Vẫn lưu lịch sử để học hỏi

## Trả lại quyền cho AI

### Cách thực hiện:
Nhấn nút "Trả lại AI" ở góc phải trên cùng

### Kết quả:
\`\`\`
conversations.handover_mode = null
conversations.metadata.handed_over = false
conversation_handovers.status = "released"
conversation_handovers.released_at = [timestamp]
\`\`\`

### AI sẽ:
- ✅ Tiếp tục trả lời tự động các tin nhắn mới
- ✅ Học hỏi từ cách Admin đã xử lý

## Các trạng thái Handover

| Status | Mô tả | AI hoạt động? |
|--------|-------|---------------|
| `null` | Chế độ tự động, AI xử lý | ✅ Có |
| `auto` | AI đang xử lý bình thường | ✅ Có |
| `ai_suggested` | AI đề xuất chuyển Admin | ✅ Có (nhưng không tự tin) |
| `manual` | Admin đang xử lý | ❌ Không |

## Database Schema

### Table: `conversation_handovers`
\`\`\`sql
- id (uuid)
- conversation_id (uuid)
- agent_id (uuid) 
- agent_name (text)
- status (text) -- 'active', 'released'
- from_type (text) -- 'bot'
- to_type (text) -- 'agent'
- reason (text) -- lý do handover
- created_at (timestamp)
- released_at (timestamp)
\`\`\`

### Table: `conversations` (metadata field)
\`\`\`json
{
  "handed_over": true/false,
  "agent_name": "admin",
  ...
}
\`\`\`

## API Endpoints

### POST `/api/chatbot/handover`

**Takeover (Admin cướp quyền):**
\`\`\`json
{
  "conversationId": "uuid",
  "action": "takeover"
}
\`\`\`

**Release (Trả lại AI):**
\`\`\`json
{
  "conversationId": "uuid", 
  "action": "release"
}
\`\`\`

## Best Practices

### Khi nào Admin nên cướp quyền?
- ✅ Khách hàng yêu cầu khẩn cấp
- ✅ Vấn đề phức tạp cần tư vấn chuyên sâu
- ✅ AI đề xuất handover (confidence thấp)
- ✅ Cần thương lượng giá/hợp đồng
- ✅ Khách hàng không hài lòng với AI

### Khi nào nên trả lại cho AI?
- ✅ Đã giải quyết xong vấn đề phức tạp
- ✅ Chỉ cần theo dõi thêm (AI có thể xử lý)
- ✅ Cuộc trò chuyện chuyển sang câu hỏi đơn giản
- ✅ Khách hàng hài lòng và chỉ cần thông tin cơ bản

## Troubleshooting

### Lỗi: "Cannot read properties of undefined (reading 'metadata')"
**Nguyên nhân:** Interface `Conversation` không có field `metadata`
**Giải pháp:** Đã fix bằng cách thêm `metadata?` vào interface

### Lỗi: "Failed to release"
**Nguyên nhân:** Không tìm thấy conversation_handover active
**Giải pháp:** Kiểm tra database xem có record với `status='active'` không

### AI vẫn trả lời dù đã handover
**Nguyên nhân:** Logic trong `/app/api/chatbot/send-ai/route.ts` không check handover
**Giải pháp:** Thêm check:
\`\`\`typescript
// Check if conversation is handed over
const { data: handover } = await supabase
  .from('conversation_handovers')
  .select('id')
  .eq('conversation_id', convId)
  .eq('status', 'active')
  .single()

if (handover) {
  // Skip AI response, conversation is handled by agent
  return NextResponse.json({ 
    status: "handed_over",
    message: "This conversation is being handled by an agent" 
  })
}
\`\`\`
