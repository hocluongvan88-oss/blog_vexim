-- ============================================================
-- 038: EMBEDDING THẬT CHO KHO TRI THỨC (tìm kiếm theo NGỮ NGHĨA)
-- ============================================================
--
-- VẤN ĐỀ
-- Trước đây AI tìm tài liệu bằng cách so khớp TỪ KHOÁ (ilike). Cách này bỏ sót
-- rất nhiều câu hỏi thật của khách, ví dụ khách hỏi:
--     "thủ tục xuất hàng sang Mỹ cần gì?"
-- nhưng tài liệu chỉ ghi "Prior Notice", "FSMA", "US Agent" → không khớp chữ nào
-- → AI trả lời "em chưa có thông tin".
--
-- Script này tạo cột vector + hàm tìm kiếm tương đồng để AI hiểu theo Ý NGHĨA.
--
-- THỨ TỰ CHẠY: phải chạy 037 trước (037 chuẩn hoá cột nội dung về `content`),
-- rồi mới chạy script này.
--
-- KÍCH THƯỚC: 1536 chiều — dùng chung được cho cả Gemini
-- (gemini-embedding-001 với outputDimensionality=1536) và OpenAI
-- (text-embedding-3-small). Nếu đổi EMBEDDING_DIMENSIONS trong Vercel thì phải
-- sửa số 1536 ở đây cho khớp rồi chạy lại.
--
-- CÁCH CHẠY: Supabase Dashboard → SQL Editor → dán toàn bộ → Run.

-- 1. Bật extension pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Thêm cột vector + thông tin model đã dùng
ALTER TABLE public.knowledge_chunks ADD COLUMN IF NOT EXISTS embedding vector(1536);
ALTER TABLE public.knowledge_chunks ADD COLUMN IF NOT EXISTS embedding_model TEXT;
ALTER TABLE public.knowledge_chunks ADD COLUMN IF NOT EXISTS embedded_at TIMESTAMPTZ;

COMMENT ON COLUMN public.knowledge_chunks.embedding IS
  'Vector ngữ nghĩa 1536 chiều (Gemini gemini-embedding-001 hoặc OpenAI text-embedding-3-small). NULL = chưa nạp.';

-- 3. Index HNSW cho tìm kiếm cosine — nhanh kể cả khi có hàng trăm nghìn đoạn.
--    (HNSW cần pgvector >= 0.5.0; Supabase hiện đã hỗ trợ.)
DROP INDEX IF EXISTS idx_knowledge_chunks_embedding;
CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_embedding
  ON public.knowledge_chunks USING hnsw (embedding vector_cosine_ops);

-- 4. Hàm tìm kiếm theo ngữ nghĩa.
--    SECURITY DEFINER để chatbot (anon) gọi được mà không cần mở quyền đọc bảng.
CREATE OR REPLACE FUNCTION public.match_knowledge_chunks(
  query_embedding vector(1536),
  match_count INT DEFAULT 8,
  min_similarity DOUBLE PRECISION DEFAULT 0.0
)
RETURNS TABLE (
  id UUID,
  document_id UUID,
  content TEXT,
  document_title TEXT,
  category TEXT,
  similarity DOUBLE PRECISION
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.document_id,
    c.content,
    d.title,
    d.category,
    1 - (c.embedding <=> query_embedding) AS similarity
  FROM public.knowledge_chunks c
  JOIN public.knowledge_documents d ON d.id = c.document_id
  WHERE c.embedding IS NOT NULL
    AND d.status = 'active'
    AND 1 - (c.embedding <=> query_embedding) >= min_similarity
  ORDER BY c.embedding <=> query_embedding
  LIMIT GREATEST(match_count, 1);
END;
$$;

-- 5. Cho phép chatbot của khách (anon) và admin gọi hàm tìm kiếm
GRANT EXECUTE ON FUNCTION public.match_knowledge_chunks(vector, INT, DOUBLE PRECISION)
  TO anon, authenticated, service_role;

-- 6. Báo PostgREST nạp lại schema (để gọi được hàm qua supabase.rpc)
NOTIFY pgrst, 'reload schema';

-- 7. KIỂM TRA: bao nhiêu đoạn đã có vector, bao nhiêu còn thiếu?
--    Sau khi chạy script, vào Admin → Kho tri thức → "Nạp embedding cho AI".
SELECT
  COUNT(*)                                            AS tong_so_doan,
  COUNT(embedding)                                    AS da_co_embedding,
  COUNT(*) - COUNT(embedding)                         AS con_thieu,
  ROUND(100.0 * COUNT(embedding) / GREATEST(COUNT(*), 1), 1) AS phan_tram_hoan_thanh
FROM public.knowledge_chunks;
