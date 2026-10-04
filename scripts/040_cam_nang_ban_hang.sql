-- Cẩm nang bán hàng cho AI (tuỳ chọn — KHÔNG bắt buộc chạy).
--
-- ── VÌ SAO CÓ FILE NÀY ────────────────────────────────────────────────
-- Có 2 loại nội dung khác nhau về bản chất:
--
--   1. QUY TẮC HÀNH VI (thu thập thông tin khách, câu hỏi kết nối chuyên viên,
--      khi nào tổng hợp rồi mời chuyên viên) -> phải là LUẬT CỨNG, luôn có mặt
--      trong prompt của AI. Có thể sửa bằng khoá `sales_playbook` trong
--      ai_config (file này) hoặc ngay trong Admin → Cài đặt → "Cẩm nang bán hàng".
--      Để trống / không chạy file này = dùng bản mặc định trong code
--      (lib/sales-playbook.ts).
--
--   2. SỐ LIỆU / ĐIỀU KIỆN (FDA 1–2 ngày nếu có DUNS, 5–8 ngày nếu chưa;
--      GACC chỉ nhận nhóm chế biến, 15–30 ngày) -> để trong KHO TRI THỨC
--      (Admin → Kho tri thức), vì con số sẽ thay đổi theo thời gian.
--
-- ── LƯU Ý KỸ THUẬT ────────────────────────────────────────────────────
-- Cột ai_config.value là kiểu JSONB (xem scripts/008), KHÔNG phải text. Vì vậy:
--   • Không dùng được left(value, 120)  -> phải là left(value #>> '{}', 120)
--   • Khi ghi giá trị dạng chuỗi phải dùng to_jsonb(...) (hoặc literal có dấu
--     ngoặc kép hợp lệ như '"openai/gpt-oss-120b"'), nếu không Postgres báo lỗi.
--
-- Cách chạy: Supabase → SQL Editor → dán từng bước → Run.

-- ── BƯỚC 1: Xem cẩm nang hiện có (nếu chưa từng đặt thì không ra dòng nào) ──
SELECT
  key,
  left(value #>> '{}', 200) AS preview,
  updated_at
FROM ai_config
WHERE key = 'sales_playbook';

-- ── BƯỚC 2: (TUỲ CHỌN) Tự viết cẩm nang riêng ────────────────────────
-- Bỏ comment khối dưới rồi sửa nội dung bên trong $$ ... $$ cho phù hợp.
-- Nếu không chạy bước này, hệ thống dùng bản mặc định — vẫn đầy đủ quy tắc
-- thu thập thông tin và câu hỏi kết nối chuyên viên.
--
-- INSERT INTO ai_config (key, value, description)
-- VALUES (
--   'sales_playbook',
--   to_jsonb($$🎯 CÁCH TƯ VẤN NHƯ NHÂN VIÊN KINH DOANH CỦA VEXIM
-- - Trả lời câu hỏi trước, ngắn gọn, rồi hỏi thêm 1–2 thông tin còn thiếu.
-- - Thông tin cần nắm: thị trường, nhóm sản phẩm, đã có mã DUNS đúng địa chỉ
--   nhà máy chưa, số điện thoại/Zalo.
-- - Khi khách hỏi giá hoặc đã đủ thông tin: tổng hợp lại rồi hỏi
--   "Anh/chị có muốn em kết nối với chuyên viên bên em không ạ?"$$::text),
--   'Cẩm nang bán hàng nhúng vào prompt (để trống = dùng bản mặc định)'
-- )
-- ON CONFLICT (key) DO UPDATE
--   SET value = EXCLUDED.value,
--       updated_at = NOW();

-- ── BƯỚC 3: Xoá để quay về bản mặc định trong code ────────────────────
-- DELETE FROM ai_config WHERE key = 'sales_playbook';

-- ── BƯỚC 4: Kiểm tra lại ──────────────────────────────────────────────
SELECT key, left(value #>> '{}', 200) AS preview FROM ai_config WHERE key = 'sales_playbook';
