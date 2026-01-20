# 📚 Hướng Dẫn Import Knowledge Base Tự Động

## Tổng Quan

Hệ thống cho phép import tự động các file markdown (.md) từ thư mục `/knowledge/` vào Knowledge Base động để AI có thể query và sử dụng.

---

## ✅ Tính Năng Đã Triển Khai

### 1. Script Import Tự Động (`/scripts/import-knowledge-base.ts`)

**Chức năng:**
- Quét toàn bộ thư mục `/knowledge/` tìm file `.md`
- Tự động mapping category dựa trên tên file:
  - `fda-*.md` → "Pháp lý Hoa Kỳ"
  - `gacc-*.md` → "Pháp lý Trung Quốc"
  - `mfds-*.md` → "Pháp lý Hàn Quốc"
  - `export-delegation-*.md` → "Xuất khẩu"
  - `ai-traceability-*.md` → "Công nghệ"
  - `us-agent-*.md` → "Dịch vụ Hoa Kỳ"
- Lấy filename làm title (convert từ kebab-case sang Title Case)
- Làm sạch Markdown formatting trước khi chunking
- Tự động extract tags từ content
- Chia nhỏ content thành chunks với overlap để AI hiểu context tốt hơn

**Cách chạy:**
\`\`\`bash
# Cần có env variables:
# - NEXT_PUBLIC_SUPABASE_URL
# - SUPABASE_SERVICE_ROLE_KEY

npx tsx scripts/import-knowledge-base.ts
\`\`\`

### 2. API Endpoint (`/api/knowledge-base/import-files`)

**Chức năng:** 
- Import files qua HTTP request (dễ dàng chạy từ admin UI)
- Tương tự script nhưng chạy trong server-side Next.js
- Trả về summary: success/skipped/errors count

**Usage:**
\`\`\`bash
curl -X POST http://localhost:3000/api/knowledge-base/import-files \
  -H "Authorization: Bearer <admin-token>"
\`\`\`

### 3. Admin UI Button

**Vị trí:** `/admin/knowledge-base`

**Chức năng:**
- Nút "Import Files" để admin import nhanh
- Hiển thị progress và summary sau khi hoàn tất
- Tự động reload danh sách documents

---

## 🔧 Quy Trình Import

### Bước 1: Clean Markdown
\`\`\`typescript
// Loại bỏ các ký tự markdown nhưng giữ nội dung
- Heading markers (###)
- Bold/Italic (**)
- Links []()
- Code blocks ```
- List markers (-, *)
- Tables
\`\`\`

### Bước 2: Metadata Mapping
\`\`\`typescript
{
  title: "Fda Correct Knowledge" → "FDA Correct Knowledge",
  category: "fda-*" → "Pháp lý Hoa Kỳ",
  tags: ["FDA", "đăng ký", "prior notice", ...],
  source_url: "file://fda-correct-knowledge.md"
}
\`\`\`

### Bước 3: Chunking với Overlap
\`\`\`typescript
// Chia theo đoạn văn (paragraph)
chunkSize = 3 paragraphs
overlap = 1 paragraph

// Ví dụ:
Chunk 1: P1 + P2 + P3
Chunk 2: P3 + P4 + P5  (overlap P3)
Chunk 3: P5 + P6 + P7  (overlap P5)
\`\`\`

**Lợi ích overlap:** AI có context xung quanh khi search, không bị mất thông tin giữa các chunks.

### Bước 4: Insert vào Database
\`\`\`sql
-- Insert document
INSERT INTO knowledge_documents (title, content, category, tags, ...)

-- Insert chunks
INSERT INTO knowledge_chunks (document_id, chunk_text, chunk_index, ...)

-- Update status
UPDATE knowledge_documents SET status = 'active'
\`\`\`

---

## 📋 Trả Lời Câu Hỏi

### 1. Vector Search hay Keyword Search?

**Hiện tại:** **Full-Text Search (FTS)** của PostgreSQL

\`\`\`sql
CREATE INDEX idx_knowledge_chunks_chunk_text_fts  
  ON knowledge_chunks USING gin(to_tsvector('english', chunk_text));
\`\`\`

**Đặc điểm:**
- ✅ Keyword search thông minh (stemming, ranking)
- ✅ Tìm theo từ khóa và biến thể
- ❌ CHƯA phải semantic/vector search

**Để có Vector Search thật:**
Cần tích hợp:
1. **pgvector extension** trong Supabase
2. **Embeddings model** (OpenAI/Cohere/Open Source)
3. Convert chunks → vectors → store trong DB
4. Search bằng cosine similarity

### 2. Chỉnh sửa Chunks trực tiếp?

**Hiện tại:** **KHÔNG** - chỉ có thể:
- Xóa document (cascade delete chunks)
- Upload lại document mới
- Reprocess document

**Để có Edit Chunks:**
Cần thêm:
- UI table để list chunks của document
- Form edit chunk_text
- API PUT `/knowledge-base/chunks/:id`
- Nút "Save" để update chunk

---

## 📝 Files Được Tạo/Cập Nhật

### Mới Tạo:
1. `/scripts/import-knowledge-base.ts` - Script Node.js để import
2. `/app/api/knowledge-base/import-files/route.ts` - API endpoint
3. `/KNOWLEDGE_BASE_IMPORT_GUIDE.md` - File này

### Đã Cập Nhật:
1. `/app/admin/(dashboard)/knowledge-base/page.tsx` - Thêm nút Import

---

## 🚀 Cách Sử Dụng

### Option 1: Qua Admin UI (Khuyến nghị)
1. Vào `/admin/knowledge-base`
2. Click nút **"Import Files"**
3. Confirm dialog
4. Chờ import xong (hiện toast với summary)

### Option 2: Chạy Script Trực Tiếp
\`\`\`bash
cd /path/to/project
npx tsx scripts/import-knowledge-base.ts
\`\`\`

### Option 3: Qua API
\`\`\`bash
curl -X POST http://localhost:3000/api/knowledge-base/import-files
\`\`\`

---

## ⚠️ Lưu Ý Quan Trọng

1. **File đã tồn tại sẽ bị bỏ qua** - Script check bằng `title`
2. **Markdown sẽ được làm sạch** - Mất formatting nhưng giữ content
3. **Chunks có overlap** - Tốt cho context nhưng tăng storage
4. **Cần quyền admin** - API yêu cầu authentication

---

## 🔮 Tương Lai - Vector Search

Để nâng cấp lên vector search:

\`\`\`typescript
// 1. Thêm column vector
ALTER TABLE knowledge_chunks 
  ADD COLUMN embedding vector(1536);

// 2. Generate embeddings
const embedding = await openai.embeddings.create({
  model: "text-embedding-3-small",
  input: chunkText
})

// 3. Store vector
await supabase
  .from('knowledge_chunks')
  .update({ embedding: embedding.data[0].embedding })

// 4. Search by similarity
const results = await supabase.rpc('match_chunks', {
  query_embedding: queryVector,
  match_threshold: 0.7,
  match_count: 5
})
\`\`\`

---

## 📊 Kết Quả Sau Import

Với 6 files hiện tại, bạn sẽ có:
- 6 documents trong `knowledge_documents`
- ~150-200 chunks trong `knowledge_chunks` (tùy độ dài content)
- AI có thể query và trả lời dựa trên kiến thức này

---

**Chúc bạn import thành công!** 🎉
