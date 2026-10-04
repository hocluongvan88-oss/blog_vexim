-- Cẩm nang bán hàng cho AI (tuỳ chọn).
--
-- VÌ SAO: có 2 loại nội dung khác nhau về bản chất —
--
--   1. QUY TẮC HÀNH VI (thu thập thông tin khách, câu hỏi kết nối chuyên viên,
--      khi nào tổng hợp rồi mời chuyên viên) -> phải là LUẬT CỨNG, luôn có trong
--      prompt. Admin sửa được bằng khoá `sales_playbook` dưới đây, KHÔNG cần deploy.
--      Để trống/không chạy file này thì hệ thống dùng bản mặc định trong code
--      (lib/sales-playbook.ts).
--
--   2. SỐ LIỆU / ĐIỀU KIỆN (FDA 1–2 ngày nếu có DUNS, 5–8 ngày nếu chưa;
--      GACC chỉ nhận nhóm chế biến, 15–30 ngày) -> để trong KHO TRI THỨC
--      (Admin -> Kho tri thức) vì con số sẽ thay đổi theo thời gian.
--
-- Cách chạy: Supabase -> SQL Editor -> dán -> Run.

-- Xem cẩm nang hiện tại (nếu có)
SELECT key, left(value, 120) AS preview FROM ai_config WHERE key = 'sales_playbook';

-- (Khuyến nghị) KHÔNG cần thêm gì: hệ thống tự dùng bản mặc định.
-- Chỉ khi muốn tự viết cẩm nang riêng, sửa nội dung dưới rồi chạy:
--
-- INSERT INTO ai_config (key, value, description)
-- VALUES (
--   'sales_playbook',
--   '🎯 CÁCH TƯ VẤN NHƯ NHÂN VIÊN KINH DOANH CỦA VEXIM'
--   || chr(10) || '- Trả lời câu hỏi trước, rồi hỏi thêm 1–2 thông tin còn thiếu.'
--   || chr(10) || '- Khi khách hỏi giá hoặc đã đủ thông tin: tổng hợp lại và hỏi "Anh/chị có muốn em kết nối với chuyên viên bên em không ạ?"',
--   'Cẩm nang bán hàng nhúng vào prompt (để trống = dùng bản mặc định)'
-- )
-- ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Ghi chú: số điện thoại/Zalo và mốc thời gian chuẩn nằm trong code
-- (lib/contact-info.ts, lib/lead-profile.ts) và tài liệu
-- knowledge/thoi-gian-dang-ky-fda-gacc.md trong Kho tri thức.
