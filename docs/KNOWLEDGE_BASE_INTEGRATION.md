# Knowledge Base Integration Summary for Vexim Global AI Chatbot

## Files Created

### 1. **FDA** (`/knowledge/fda-correct-knowledge.md`)
- Giải thích chính xác FDA không đăng ký sản phẩm
- Yêu cầu: Food Facility Registration + Prior Notice + US Agent
- Handover rules: sản phẩm cụ thể, bị từ chối, dietary supplement, low-acid canned food
- Contact message: tiêu chuẩn cho FDA

### 2. **GACC** (`/knowledge/gacc-knowledge.md`)
- Giải thích GACC (Hải quan Trung Quốc)
- Yêu cầu: Đăng ký cơ sở, kiểm dịch, nhãn mác tiếng Trung
- Danh sách cơ sở được phê duyệt từng loại sản phẩm
- Handover: sản phẩm cụ thể, bị từ chối, thành phần phức tạp

### 3. **MFDS** (`/knowledge/mfds-knowledge.md`)
- Giải thích MFDS (Bộ Thực phẩm Hàn Quốc)
- Yêu cầu: Đăng ký cơ sở, kiểm dịch, cấp phép cho thực phẩm chức năng/mới
- Nhãn mác tiếng Hàn Quốc
- Handover: thực phẩm chức năng, mới, phức tạp

### 4. **Export Delegation** (`/knowledge/export-delegation-knowledge.md`)
- Uỷ quyền xuất khẩu là gì
- Lợi ích: tiết kiệm chi phí, nhanh chóng, giảm rủi ro
- Quy trình từ tìm kiếm thị trường → tìm khách hàng → xuất khẩu

### 5. **AI Traceability** (`/knowledge/ai-traceability-knowledge.md`)
- Truy xuất nguồn gốc sản phẩm bằng AI + blockchain
- Yêu cầu pháp lý từ FDA, EU, Hàn Quốc, Trung Quốc
- Lợi ích: tin tưởng khách, phát hiện hàng giả, quản lý hàng tồn

### 6. **US Agent** (`/knowledge/us-agent-knowledge.md`)
- Đại diện tại Mỹ cho FDA (bắt buộc)
- Vai trò: nhận thông báo từ FDA, xử lý tuân thủ, lưu trữ tài liệu
- Tìm kiếm US Agent, đăng ký với FDA

## System Prompt Updated

File `/lib/ai-service.ts` đã cập nhật với:
- Danh sách tất cả 6 dịch vụ chính
- Nguyên tắc bắt buộc cho FDA, GACC, MFDS
- Handover rules rõ ràng cho mỗi dịch vụ
- Contact message chuẩn

## Rule Engine Integration

File `/lib/rule-engine.ts` đã có sẵn:
- Detect service tags: FDA, GACC, MFDS, US_AGENT, EXPORT, TRACEABILITY
- Handover logic: sales intent, compliance risk, lead quality
- ASK_CONTACT message: tùy theo urgency level

## Next Steps

1. AI sẽ tự động detect service tag từ message khách
2. Nếu cần, sẽ sử dụng knowledge base tương ứng
3. Handover tự động khi detect sales intent hoặc compliance risk
4. Admin sẽ nhận notification + push + email

## Testing Recommendations

Hãy test các câu hỏi sau để xác nhận AI hoạt động đúng:

1. **FDA Test**: "Tôi muốn xuất hàng vào Mỹ. Cần làm gì?"
   - AI: Giải thích FDA yêu cầu + handover
   
2. **GACC Test**: "Hàng của tôi bị GACC từ chối. Sao vậy?"
   - AI: Handover ngay (compliance risk)
   
3. **Sales Intent Test**: "Bạn có làm được không?"
   - AI: Trả lời ngay + handover
   
4. **MFDS Test**: "Tôi muốn xuất thực phẩm chức năng vào Hàn Quốc"
   - AI: Giải thích MFDS + handover (functional food)
