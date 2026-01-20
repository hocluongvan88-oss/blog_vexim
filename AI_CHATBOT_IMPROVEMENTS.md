# AI Chatbot Improvements - Fixed Issues

## Vấn đề đã Fix

### 1. ✅ SAI NGHIỆP VỤ FDA (RẤT QUAN TRỌNG)

**Trước đây (SAI):**
- AI nói: "Đăng ký sản phẩm với FDA"
- AI nói: "Prior Notice là đăng ký sản phẩm"

**Bây giờ (ĐÚNG):**
- File `/knowledge/fda-correct-knowledge.md` chứa kiến thức FDA CHÍNH XÁC
- AI system prompt đã được update với kiến thức đúng:
  - FDA KHÔNG đăng ký sản phẩm thực phẩm thường
  - FDA chỉ yêu cầu: (1) Đăng ký CƠ SỞ (Food Facility Registration), (2) Prior Notice (khai báo từng lô hàng)
  - KHÔNG BAO GIỜ nói "đăng ký sản phẩm với FDA"

### 2. ✅ Phản hồi "bạn có làm không" chưa tối ưu

**Trước đây:**
- AI giải thích dài về vai trò
- Lặp lại câu hỏi
- Chưa chốt gọn

**Bây giờ:**
- Rule engine detect pattern: `/(bạn|bên|công ty).*(có làm|làm được|làm)/i`
- Trigger IMMEDIATE HANDOFF với urgency HIGH
- Message ngắn gọn: "Dạ, Vexim có hỗ trợ dịch vụ này ạ! Để tư vấn cụ thể..."

**Rule mới: SI-01-HIGH**
\`\`\`typescript
const directDoQuestions = [
  /(bạn|bên|công ty).*(có làm|làm được|làm)/i,
  /ý.*là.*(có làm|làm được|làm không)/i,
  /(em|anh|mình|các bạn).*(làm.*không|có làm)/i,
]
// => HANDOFF_TO_ADMIN với urgency: "high"
\`\`\`

### 3. ✅ "Kết nối giúp anh" → AI nói lan man

**Trước đây:**
- AI vẫn giải thích lại
- Hỏi thêm câu hỏi không cần thiết
- Không xin thông tin liên hệ rõ ràng

**Bây giờ:**
- Rule engine detect: `/(kết nối|liên hệ|gọi).*(cho|giúp|tôi|mình)/i`
- Trigger IMMEDIATE HANDOFF
- Message: "Dạ, Vexim có hỗ trợ... Anh/chị để lại số điện thoại..."

**Rule mới: SI-02-IMMEDIATE**
\`\`\`typescript
const immediateHandoffPatterns = [
  /(kết nối|liên hệ|gọi).*(cho|giúp|tôi|mình|em|anh)/i,
  /(có|được|đồng ý|ok|oke|okê).*(em|anh|nhé|ạ)$/i,
  /^(có|được|ok|oke|okê|đồng ý|đc)$/i,
  /muốn (làm|thuê|nhờ).*ngay/i,
]
// => HANDOFF_TO_ADMIN với urgency: "high"
\`\`\`

### 4. ✅ Thông báo cho admin

**Trước đây:**
- Có notification nhưng chưa test kỹ

**Bây giờ:**
- Notification được gọi ở `/app/api/chatbot/send-ai/route.ts` line 165-172
- Gửi cả email + push notification
- Thông tin đầy đủ: customer name, message, urgency, service tag

### 5. ✅ AI System Prompt được cải thiện

**Thêm vào system prompt:**
\`\`\`
Nguyên tắc trả lời:
- Ngắn gọn, súc tích (không quá 5 câu)
- Khi khách hỏi "bạn có làm không": Trả lời NGAY "Vexim có làm dịch vụ này ạ"
- KHÔNG giải thích vai trò AI, KHÔNG lặp lại câu hỏi khách
- Chủ động hỏi thông tin để qualify lead (sản phẩm, thị trường, công ty)
\`\`\`

## Các Rule đã cải thiện

### Sales Intent Rules (SI)

| Rule ID | Pattern | Action | Urgency |
|---------|---------|--------|---------|
| SI-01-HIGH | "bạn có làm không" | HANDOFF | high |
| SI-02-IMMEDIATE | "kết nối giúp anh" | HANDOFF | high |
| SI-03 | Service inquiry | ASK_CONTACT | medium |
| SI-04 | Want to proceed | ASK_CONTACT | high |
| SI-05 | Timeline questions | ASK_CONTACT | medium |
| SI-06 | Comparison questions | ASK_CONTACT | low |

### Message Templates

**High urgency handoff:**
\`\`\`
Dạ, Vexim có hỗ trợ dịch vụ này ạ!

Để tư vấn cụ thể cho trường hợp của anh/chị, em xin phép kết nối với chuyên viên. 

Anh/chị để lại số điện thoại, chuyên viên sẽ liên hệ tư vấn chi tiết ngay ạ.
\`\`\`

**Standard handoff:**
\`\`\`
Cảm ơn anh/chị. Để tư vấn chính xác nhất, em đang chuyển cho chuyên viên của Vexim xử lý. Chuyên viên sẽ phản hồi trong thời gian sớm nhất ạ.
\`\`\`

## Test Cases

### Test Case 1: "bạn có làm không"

**Input:** "ý mình là bạn có làm không"

**Expected:**
- Rule: SI-01-HIGH triggered
- Action: HANDOFF_TO_ADMIN
- Message: "Dạ, Vexim có hỗ trợ dịch vụ này ạ!..."
- Notification: Email + Push to admin

### Test Case 2: "kết nối giúp anh"

**Input:** "Kết nối giúp anh"

**Expected:**
- Rule: SI-02-IMMEDIATE triggered
- Action: HANDOFF_TO_ADMIN
- Message: "Dạ, Vexim có hỗ trợ dịch vụ này ạ!..."
- Notification: Email + Push to admin

### Test Case 3: "Có em" (short agreement)

**Input:** "Có em"

**Expected:**
- Rule: SI-02-IMMEDIATE triggered (matches `/^(có|được|ok)$/i`)
- Action: HANDOFF_TO_ADMIN
- Notification: Email + Push to admin

### Test Case 4: FDA question

**Input:** "Mình muốn đăng ký chè khô"

**Expected:**
- AI explains: "Chè khô là thực phẩm thường nên FDA không có hệ thống đăng ký sản phẩm ạ..."
- AI mentions: "Để xuất khẩu chè khô sang Mỹ, anh/chị cần: 1. Đăng ký CƠ SỞ sản xuất..."
- KHÔNG nói: "đăng ký sản phẩm với FDA"

## Kiểm tra nhanh

1. Vào chat widget
2. Test câu: "bạn có làm FDA không"
3. Xem response có ngắn gọn và chốt lead không
4. Kiểm tra admin có nhận notification không

## Files đã thay đổi

1. `/knowledge/fda-correct-knowledge.md` - Kiến thức FDA đúng nghiệp vụ
2. `/lib/rule-engine.ts` - Sales intent rules cải thiện
3. `/lib/ai-service.ts` - System prompt update
4. `/app/api/chatbot/send-ai/route.ts` - Message template update
