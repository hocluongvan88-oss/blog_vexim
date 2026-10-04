-- Bucket nhận file khách gửi trong khung chat (nhãn sản phẩm, danh mục, giấy tờ).
--
-- VÌ SAO: người mua dịch vụ tư vấn thường muốn gửi nhãn/danh mục sản phẩm để được
-- tư vấn đúng. Không có chỗ nhận file thì họ phải rời web sang Zalo — mất khách.
--
-- File được lưu theo thư mục từng hội thoại: <conversation_id>/<timestamp>-<tên file>
-- Khách tải lên được (anon INSERT), ai cũng ĐỌC được qua URL công khai để chuyên
-- viên mở xem (bucket public read). Không cho khách xoá/sửa file của người khác.
--
-- Cách chạy: Supabase -> SQL Editor -> dán -> Run. Chạy một lần là đủ.
-- Nếu KHÔNG chạy: khung chat vẫn hoạt động, chỉ là khách gửi file sẽ nhận thông
-- báo "gửi qua Zalo giúp em" (không vỡ gì).

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'chat-attachments',
  'chat-attachments',
  TRUE,
  10485760, -- 10 MB
  ARRAY[
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/webp',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'application/vnd.ms-excel',
    'text/csv',
    'text/plain'
  ]
)
ON CONFLICT (id) DO UPDATE
  SET public = TRUE,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Khách (chưa đăng nhập) được TẢI LÊN
DROP POLICY IF EXISTS "Cho khach tai file chat len" ON storage.objects;
CREATE POLICY "Cho khach tai file chat len"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'chat-attachments');

-- Ai cũng ĐỌC được file trong bucket này (bucket public, chuyên viên mở xem)
DROP POLICY IF EXISTS "Cho phep doc file chat" ON storage.objects;
CREATE POLICY "Cho phep doc file chat"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'chat-attachments');

-- Kiểm tra
SELECT id, public, file_size_limit FROM storage.buckets WHERE id = 'chat-attachments';
