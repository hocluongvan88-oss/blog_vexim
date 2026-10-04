-- Sửa lỗi chatbot không trả lời được: model Groq đã bị khai tử.
--
-- Groq ngừng phục vụ `llama-3.3-70b-versatile` (và `llama-3.1-8b-instant`) từ
-- 16/08/2026. Sau mốc đó, mọi request tới model cũ trả về:
--   404 {"error":{"code":"model_not_found"}}
-- khiến chatbot nhận được câu hỏi nhưng không bao giờ sinh được câu trả lời.
--
-- Cách chạy: Supabase → SQL Editor → dán toàn bộ file này → Run.
-- (Hoặc đổi trực tiếp trong Admin → Cài đặt → Mô hình AI, không cần SQL.)

-- 1. Xem model đang cấu hình
SELECT key, value, description
FROM ai_config
WHERE key = 'groq_model';

-- 2. Đổi sang model Groq khuyến nghị (giá trị lưu dạng JSON string)
UPDATE ai_config
SET value = '"openai/gpt-oss-120b"'
WHERE key = 'groq_model';

-- 3. Nếu chưa có dòng nào thì thêm mới
INSERT INTO ai_config (key, value, description)
VALUES ('groq_model', '"openai/gpt-oss-120b"', 'Tên mô hình AI trên Groq')
ON CONFLICT (key) DO NOTHING;

-- 4. Kiểm tra lại
SELECT key, value FROM ai_config WHERE key = 'groq_model';

-- Ghi chú: code đã có sẵn chuỗi model dự phòng
-- (openai/gpt-oss-120b → openai/gpt-oss-20b) nên nếu quên bước này, chatbot vẫn
-- trả lời được — nhưng nên đổi để log không còn cảnh báo model không tồn tại.
