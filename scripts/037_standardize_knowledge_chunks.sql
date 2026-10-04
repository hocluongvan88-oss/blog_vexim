-- ============================================================
-- 037: CHUẨN HOÁ BẢNG knowledge_chunks
-- ============================================================
--
-- VẤN ĐỀ
-- Script 008 tạo cột `chunk_text`. Script 012 đổi tên thành `content`.
-- Từ đó code bị chia làm hai phe và CHỈ MỘT phe chạy được:
--
--   • Nếu ĐÃ chạy 012 (cột = `content`):
--       - api/knowledge-base/import-files  → ghi vào `chunk_text` → LỖI
--       - api/knowledge-base/documents/[id] (sửa tài liệu) → LỖI
--       → Tài liệu vẫn hiện trong danh sách nhưng kho tri thức TRỐNG
--         nên AI không tra cứu được gì và trả lời chung chung.
--
--   • Nếu CHƯA chạy 012 (cột = `chunk_text`):
--       - api/knowledge-base/upload → ghi `content` + `token_count` → LỖI
--       → Không nạp được tài liệu nào.
--
-- Script này đưa DB về MỘT chuẩn duy nhất và bổ sung cột còn thiếu, để mọi route
-- hoạt động giống nhau. An toàn khi chạy nhiều lần.
--
-- CÁCH CHẠY: Supabase Dashboard → SQL Editor → dán toàn bộ → Run.

-- 1. Nếu còn cột cũ `chunk_text` và CHƯA có `content` -> đổi tên
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'knowledge_chunks' AND column_name = 'chunk_text'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'knowledge_chunks' AND column_name = 'content'
  ) THEN
    ALTER TABLE public.knowledge_chunks RENAME COLUMN chunk_text TO content;
    RAISE NOTICE '037: Đã đổi tên chunk_text -> content';
  END IF;
END $$;

-- 2. Bổ sung các cột mà code cần (nếu thiếu)
ALTER TABLE public.knowledge_chunks ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE public.knowledge_chunks ADD COLUMN IF NOT EXISTS chunk_index INTEGER DEFAULT 0;
ALTER TABLE public.knowledge_chunks ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.knowledge_chunks ADD COLUMN IF NOT EXISTS token_count INTEGER DEFAULT 0;

-- 3. Đảm bảo cột nội dung không NULL (API luôn gửi nội dung)
UPDATE public.knowledge_chunks SET content = '' WHERE content IS NULL;

-- 4. Cột bổ sung cho knowledge_documents
ALTER TABLE public.knowledge_documents ADD COLUMN IF NOT EXISTS source_type TEXT DEFAULT 'text';
ALTER TABLE public.knowledge_documents ADD COLUMN IF NOT EXISTS chunks_count INTEGER DEFAULT 0;

-- 5. Index phục vụ tìm kiếm theo từ khoá.
--    LƯU Ý: index full-text cũ dùng to_tsvector('english', ...) KHÔNG hiệu quả với
--    tiếng Việt (và code tìm kiếm bằng ILIKE nên không dùng tới). Dùng trigram
--    (pg_trgm) để ILIKE '%từ khoá%' chạy nhanh — quan trọng khi kho tri thức lớn.
CREATE EXTENSION IF NOT EXISTS pg_trgm;

DROP INDEX IF EXISTS idx_knowledge_chunks_chunk_text_fts;
DROP INDEX IF EXISTS idx_knowledge_chunks_content_fts;

CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_content_trgm
  ON public.knowledge_chunks USING gin (content gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_document_id
  ON public.knowledge_chunks (document_id);

-- 6. Đồng bộ lại chunks_count theo số chunk THỰC TẾ.
--    Đây là bước sửa hậu quả của lỗi "ghi chunk thất bại nhưng vẫn báo thành công":
--    trước đây UI hiện 12 đoạn nhưng DB có 0.
UPDATE public.knowledge_documents d
SET chunks_count = COALESCE(c.real_count, 0),
    status = CASE
      WHEN COALESCE(c.real_count, 0) = 0 AND d.status = 'active' THEN 'error'
      ELSE d.status
    END
FROM (
  SELECT document_id, COUNT(*)::int AS real_count
  FROM public.knowledge_chunks
  GROUP BY document_id
) c
WHERE d.id = c.document_id
  AND d.chunks_count IS DISTINCT FROM c.real_count;

-- Tài liệu không có chunk nào mà đang 'active' -> đánh dấu lỗi để admin biết
UPDATE public.knowledge_documents d
SET status = 'error', chunks_count = 0
WHERE NOT EXISTS (
  SELECT 1 FROM public.knowledge_chunks c WHERE c.document_id = d.id
)
AND d.status = 'active';

-- 7. RLS: chatbot của khách vãng lai (anon) phải đọc được kho tri thức
ALTER TABLE public.knowledge_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous read knowledge_chunks" ON public.knowledge_chunks;
CREATE POLICY "Allow anonymous read knowledge_chunks"
  ON public.knowledge_chunks FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Allow authenticated read knowledge_chunks" ON public.knowledge_chunks;
CREATE POLICY "Allow authenticated read knowledge_chunks"
  ON public.knowledge_chunks FOR SELECT TO authenticated USING (true);

-- 8. Báo PostgREST nạp lại schema
NOTIFY pgrst, 'reload schema';

-- 9. BÁO CÁO KIỂM TRA
-- Chạy câu này để xem tài liệu nào AI thật sự đọc được:
SELECT
  d.id,
  d.title,
  d.status,
  d.chunks_count            AS so_doan_ghi_tren_tai_lieu,
  COUNT(c.id)               AS so_doan_thuc_te,
  CASE
    WHEN COUNT(c.id) = 0 THEN '❌ AI KHÔNG đọc được tài liệu này'
    WHEN d.status <> 'active' THEN '⚠️ Bị loại vì trạng thái không phải active'
    ELSE '✅ OK'
  END                       AS ket_luan
FROM public.knowledge_documents d
LEFT JOIN public.knowledge_chunks c ON c.document_id = d.id
GROUP BY d.id, d.title, d.status, d.chunks_count
ORDER BY so_doan_thuc_te ASC, d.created_at DESC;
