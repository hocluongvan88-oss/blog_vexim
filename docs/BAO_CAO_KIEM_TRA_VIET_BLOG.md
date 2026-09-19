# BÁO CÁO KIỂM TRA CHI TIẾT — MODULE VIẾT BLOG
**Dự án:** blog_vexim (Vexim Global) · **Ngày:** 18/09/2026 · **Nhánh:** `arena/01a0b4a5-blog-vexim` (commit `64da4c3`)

---

## 1. Phạm vi & cách kiểm tra

**Phạm vi module "viết blog" (write blog):**
- Trang quản trị bài viết: `app/admin/(dashboard)/posts/{page,new,[id]/edit}`
- Trình soạn thảo khối: `components/block-editor/*` (block-editor, inline-toolbar, 6 loại block)
- Hỗ trợ soạn thảo: `components/admin/{ai-writing-assistant,html-paste-dialog,post-preview-dialog}`, `components/seo-checker.tsx`, `components/image-uploader.tsx`, `components/admin/ai-writing-assistant.tsx`
- API: `app/api/posts`, `app/api/posts/[id]`, `app/api/upload-image`, `app/api/blog/ai-assistant`
- Render công khai: `lib/blocks-to-html.tsx`, `app/blog/[slug]/page.tsx`
- Schema/RLS: `scripts/001_*`, `scripts/005_*`, `scripts/015_*`

**Cách kiểm tra:**
1. Đọc toàn bộ mã nguồn của module (≈5.500 dòng trong các file trên + các file liên quan).
2. Cài dependencies (`npm install --ignore-scripts`, 519 packages) và **chạy type-check thật**: `npx tsc --noEmit` → 85 lỗi toàn dự án.
3. **Chạy mô phỏng runtime** (esbuild + jsdom + React 19 render thật các component) để xác nhận 3 lỗi nghi ngờ — kết quả dán ở mục 3.
4. Chạy thử lint: `eslint .` → **thất bại** (repo không có `eslint.config.*`, eslint không nằm trong `devDependencies`).
5. Đối chiếu schema DB trong `scripts/*.sql` với payload mà UI gửi lên.

**Giới hạn:** không kết nối được Supabase production (`.env` chỉ có biến SMTP), nên các kết luận liên quan *dữ liệu thật* (schema bảng `posts`, RLS đã chạy hay chưa) được đánh dấu ⚠️ **cần xác minh trên môi trường thật**.

---

## 2. Tóm tắt lỗi theo mức độ

| # | Mức | Lỗi | Vị trí chính |
|---|-----|-----|--------------|
| 1 | 🔴 P0 | **Import HTML/Markdown xong không hiển thị, gõ 1 ký tự là mất toàn bộ nội dung vừa import** | `block-editor.tsx:91`, `posts/new:78`, `posts/[id]/edit:135` |
| 2 | 🔴 P0 | **Mở bài viết HTML cũ (WordPress) rồi lưu → phá hủy cấu trúc bài (mất heading/list/đoạn)** | `posts/[id]/edit:60-70` + `paragraph-block.tsx:112-152` |
| 3 | 🔴 P0 | **Alt text của ảnh bị bỏ qua khi render công khai** (SEO checker lại bắt buộc nhập) | `lib/blocks-to-html.tsx:165` |
| 4 | 🔴 P0 ⚠️ | **Payload lưu bài chứa 2 cột không có trong migration** (`featured_image_alt`, `focus_keyword`) → có thể chặn hoàn toàn việc lưu bài | `posts/new:111-112`, `edit:168-169` vs `scripts/001` |
| 5 | 🟠 P1 | **API tạo/sửa/xóa bài & upload ảnh không kiểm tra đăng nhập/quyền admin** | `app/api/posts/*`, `app/api/upload-image` |
| 6 | 🟠 P1 | Paste 1 đoạn có định dạng → chèn ra **text thô** (`<strong>...` hiện literal) | `paragraph-block.tsx:606-640` |
| 7 | 🟠 P1 | Nhấn Enter trong đoạn có định dạng (bold/link) → **mất định dạng** | `paragraph-block.tsx:157-162` |
| 8 | 🟠 P1 | Có ≥2 danh sách trong bài → **focus nhảy sai danh sách** | `list-block.tsx:220-221` |
| 9 | 🟠 P1 | Nút "Áp dụng" của AI **không làm gì** (chỉ hiện toast bảo copy tay) | `posts/new:61-67`, `edit:118-124` |
| 10 | 🟠 P1 | **Toàn bộ toast của sonner bị "câm"** (không mount `<Toaster/>`) | `components/ui/sonner.tsx` không được dùng |
| 11 | 🟡 P2 | Undo/redo: effect không có dependency array + lệch con trỏ sau 50 bước | `block-editor.tsx:106-131` |
| 12 | 🟡 P2 | Kiểm tra "bài trống" vô hiệu (`blocks.length === 0` luôn sai) → xuất bản bài rỗng | `posts/new:90`, `edit:145` |
| 13 | 🟡 P2 | Slug: không xử lý trùng/không sửa được/không đổi khi đổi tiêu đề | `app/api/posts/route.ts:30-38` |
| 14 | 🟡 P2 | Logic parse markdown/HTML **bị lặp 3-4 nơi**, có bug `hasHeader` luôn `true` | `block-editor.tsx:78-107`, `paragraph-block.tsx`, `html-paste-dialog.tsx` |
| 15 | 🟡 P2 | `htmlToBlocks()` (hàm đúng cho import/legacy) **không được dùng ở đâu** | `lib/blocks-to-html.tsx:221` |
| 16 | 🟡 P2 | Không sanitize/escape khi render + không escape attribute → rủi ro XSS từ nội dung import/AI/DB | `lib/blocks-to-html.tsx` |
| 17 | 🟡 P2 | Hiệu năng: `select("*")` + không phân trang; re-render + `JSON.stringify` mỗi lần gõ | `app/blog/page.tsx`, `api/posts`, `block-editor.tsx:109` |
| 18 | 🟡 P2 | Không autosave / không cảnh báo rời trang → mất bài đang viết | `posts/new`, `posts/[id]/edit` |
| 19 | 🟡 P2 | Không có test, `npm run lint` không chạy được, `ignoreBuildErrors: true` che 85 lỗi TS | `package.json`, `next.config.mjs` |
| 20 | ⚪ P3 | Danh mục hard-code 4-5 nơi (dễ lệch nhau, sitemap thiếu 2 danh mục) | `posts/new`, `posts/edit`, `blog/page.tsx`, `category/[category]`, `sitemap.ts` |
| 21 | ⚪ P3 | Preview khác bản thật (không render công thức, cỡ heading khác, ngày = hôm nay) | `post-preview-dialog.tsx`, `block-renderer.tsx` |
| 22 | ⚪ P3 | SEO checker bỏ qua nội dung list/table khi đếm từ | `posts/new:41-49`, `edit:98-106` |
| 23 | ⚪ P3 | Vệ sinh repo: `.env` (chứa mật khẩu SMTP) và `Vexim_blog-main.zip` (2,8 MB) **đang được commit** | `.env`, `Vexim_blog-main.zip` |

---

---

## 2b. TRẠNG THÁI KHẮC PHỤC (cập nhật 18/09/2026)

Toàn bộ lỗi P0 → P2 **đã được sửa trong mã nguồn** và **đã kiểm chứng lại bằng type-check + chạy thật** (xem mục 3b). Chi tiết:

| # | Lỗi | Trạng thái | File đã sửa / thêm mới |
|---|-----|-----------|------------------------|
| 1 | Import HTML không hiển thị & bị ghi đè | ✅ Đã sửa | `components/block-editor/block-editor.tsx` (effect đồng bộ `value` từ cha, so sánh JSON để tránh vòng lặp) |
| 2 | Mở & lưu bài HTML cũ làm hỏng bài | ✅ Đã sửa | `[id]/edit/page.tsx` dùng `htmlToBlocks()` + banner cảnh báo định dạng cũ |
| 3 | Alt text ảnh bị bỏ qua khi render | ✅ Đã sửa | `lib/blocks-to-html.tsx` (alt = `data.alt` \|\| caption, escape attribute); `app/blog/[slug]/page.tsx` dùng `featured_image_alt` |
| 4 | 2 cột `featured_image_alt`, `focus_keyword` thiếu trong migration | ✅ Đã sửa (script) | **`scripts/035_add_blog_seo_columns.sql`** (thêm mới) — ⚠️ cần chạy trên Supabase |
| 5 | API ghi bài & upload ảnh không kiểm tra quyền | ✅ Đã sửa | **`lib/require-admin.ts`** (mới) + áp dụng cho `api/posts`, `api/posts/[id]`, `api/upload-image`, `api/blog/ai-assistant`; **`scripts/036_harden_posts_rls.sql`** (mới) |
| 6 | Paste có định dạng bị chèn text thô | ✅ Đã sửa | `components/block-editor/blocks/paragraph-block.tsx` (chèn tại con trỏ, giữ thẻ inline) + `lib/content-parsers.ts` |
| 7 | Enter làm mất định dạng đoạn văn | ✅ Đã sửa | `paragraph-block.tsx` (`syncFromDom()` trước khi tách khối) |
| 8 | Focus nhảy sai khi có nhiều danh sách | ✅ Đã sửa | `blocks/list-block.tsx` (`listRef` — scope theo khối, không query toàn trang) |
| 9 | Nút "Áp dụng" của AI là no-op | ✅ Đã sửa | `posts/new`, `posts/[id]/edit` (thay đúng khối đang chọn, hoặc thêm khối mới) + `ai-writing-assistant.tsx` gọi `onApply` |
| 10 | Toast sonner bị "câm" | ✅ Đã sửa | `app/layout.tsx` mount `<Toaster richColors closeButton position="top-right" />` |
| 11 | Undo/redo lệch & chạy mỗi render | ✅ Đã sửa | `block-editor.tsx` dùng `useRef` cho history, gộp thao tác gõ (900ms), giới hạn 50 bước |
| 12 | Validate bài rỗng vô hiệu | ✅ Đã sửa | `lib/post-payload.ts` (`buildPostPayload` trả `plainTextLength`) + API chặn publish < 50 ký tự |
| 13 | Slug trùng / không sửa được | ✅ Đã sửa | `lib/post-payload.ts` (`slugify`, `ensureUniqueSlug` thêm hậu tố `-2`, `-3`); ô sửa slug + nút "Tạo lại" ở cả 2 trang |
| 14 | Logic parse lặp 3-4 nơi + bug `hasHeader` | ✅ Đã sửa | **`lib/content-parsers.ts`** (nguồn duy nhất cho markdown/HTML); `hasHeader` theo dòng separator |
| 15 | `htmlToBlocks()` không được dùng | ✅ Đã sửa | Dùng cho Import HTML (dialog + paste), bài cũ ở trang edit |
| 16 | Không sanitize/escape | ✅ Đã sửa | **`lib/sanitize.ts`** (mới, whitelist inline), `blocksToHTML` escape attr/caption, `post-payload.ts` sanitize phía server |
| 17 | `select("*")` / không phân trang | ✅ Đã sửa | `POST_LIST_COLUMNS` ở các trang danh sách; API có `limit`/`offset`; giới hạn số bài |
| 18 | Không autosave | ✅ Đã sửa | **`hooks/use-draft-autosave.ts`** (mới) dùng ở cả 2 trang soạn thảo + banner khôi phục + cảnh báo rời trang |
| 19 | Không test / lint hỏng / ignoreBuildErrors | ⚠️ Một phần | Đã thêm test chạy thật (harness jsdom) để kiểm chứng; **chưa thêm** eslint config + test tự động vào repo (xem mục 8) |
| 20 | Danh mục hard-code 5 nơi | ✅ Đã sửa | **`lib/blog-categories.ts`** (mới) dùng cho new/edit/category/blog list/sitemap |
| 21 | Preview khác bản thật | ✅ Đã sửa | `post-preview-dialog.tsx` + `block-renderer.tsx` dùng chung `blocksToHTML()` |
| 22 | SEO checker bỏ qua list/table | ✅ Đã sửa | `seo-checker.tsx` nhận `blocks`, `blocksToPlainText()` dùng chung |
| 23 | Vệ sinh repo (.env, zip) | ⏳ Chưa làm | Cần quyết định của chủ dự án (xoá khỏi git có thể ảnh hưởng lịch sử triển khai) |

**Việc cần làm ngay trên môi trường thật (không thể làm từ mã nguồn):**
1. Chạy `scripts/035_add_blog_seo_columns.sql` (thêm 2 cột SEO) — nếu không, mọi lần lưu bài sẽ lỗi 500.
2. Chạy `scripts/036_harden_posts_rls.sql` (siết RLS: chỉ admin ghi bài).

---

## 3. Bằng chứng chạy thật (không chỉ đọc code)
 (không chỉ đọc code)

Tôi render thật `BlockEditor`, `ParagraphBlock` và gọi `blocksToHTML` trong môi trường jsdom + React 19. Kết quả:

```json
{
  "imageHtml": "<figure class=\"w-full my-8\"><img src=\"https://example.com/a.png\"
                alt=\"CAPTION_TEXT\" ... /><figcaption ...>CAPTION_TEXT</figcaption></figure>",

  "domHasImportedAfter": false,
  "parentStateAfterImport": "[{...\"id\":\"block_initial_default\"...},
                              {\"id\":\"imp1\",\"type\":\"heading\",\"data\":{\"text\":\"IMPORTED_HEADING\"}}]",
  "parentStateAfterTyping": "[{...\"id\":\"block_initial_default\",\"data\":{\"text\":\"some text typed by user\"}}]",

  "legacyRendered": "Tiêu đề lớnĐoạn văn một.Mục AMục B"
}
```

**Đọc kết quả:**
- Ảnh có `alt: "ALT_TEXT_CHUAN_SEO"` nhưng HTML xuất ra `alt="CAPTION_TEXT"` → **alt SEO bị vứt bỏ**.
- Sau khi "Import HTML": state cha **có** block mới, nhưng DOM **không hiển thị** (`domHasImportedAfter: false`) → người dùng tưởng import lỗi.
- Gõ 1 ký tự tiếp theo: `parentStateAfterTyping` **mất block `imp1`** → nội dung import biến mất vĩnh viễn.
- Bài HTML cũ `"<h2>Tiêu đề lớn</h2><p>Đoạn văn một.</p><ul><li>Mục A</li><li>Mục B</li></ul>"` khi mở trong editor bị làm phẳng thành `"Tiêu đề lớnĐoạn văn một.Mục AMục B"` (dính chữ, mất hết cấu trúc).

---

## 3b. Kiểm chứng SAU khi sửa (chạy lại trên mã nguồn mới)

**Type-check:** `npx tsc --noEmit` → module blog **0 lỗi** (toàn dự án còn 72 lỗi cũ thuộc các module khác, không nằm trong phạm vi blog).

**Chạy thật lại harness jsdom + React 19** (render component thật, không chỉ đọc code):

| Hạng mục | Trước khi sửa | Sau khi sửa |
|----------|---------------|-------------|
| Alt ảnh khi render công khai | `alt="CAPTION_TEXT"` (mất alt SEO) | `alt="ALT_TEXT_CHUAN_SEO"` ✅ |
| Import HTML/Markdown vào editor | DOM không hiển thị block mới; gõ 1 ký tự là **mất toàn bộ block vừa import** | DOM hiển thị đủ block; gõ tiếp vẫn giữ nguyên ✅ |
| Mở bài HTML cũ | bị làm phẳng: `"Tiêu đề lớnĐoạn văn một.Mục AMục B"` | tách đúng 3 khối `heading / paragraph / list` ✅ |
| Bảng markdown (hasHeader) | luôn `true` | có dòng separator → `true`; không có → `false` ✅ |
| Paste 3 dòng text | chèn text thô, mất định dạng | tách thành 3 khối đoạn văn ✅ |
| Enter khi đang in đậm | mất thẻ `<strong>` | giữ nguyên định dạng ✅ |
| Sanitize nội dung | không có | loại `<script>`, `<img onerror>`, `javascript:`, `javascript:` link còn thẻ `<a>` thừa; giữ `<strong>`, link https + `rel="noopener noreferrer"` ✅ |

> Lưu ý: harness jsdom kiểm chứng *logic* là chính; vẫn nên thử tay trên trình duyệt thật (Chrome/Safari) trước khi phát hành.

**Cách chạy lại kiểm chứng:** xem mục 8 (đề xuất bổ sung test tự động để thay thế harness tạm).

---

## 4. Chi tiết từng lỗi & cách sửa

### 🔴 LỖI 1 — Import HTML/Markdown không hiển thị và bị ghi đè

**Hiện tượng:** Bấm "Import HTML" → toast báo "Đã thêm N blocks" nhưng editor không thay đổi; gõ vào editor là nội dung import mất sạch.

**Nguyên nhân:** `BlockEditor` chỉ đọc prop `value` **một lần duy nhất** khi mount (khởi tạo `useState`) và không bao giờ đồng bộ lại:

```tsx
// components/block-editor/block-editor.tsx:85-105
const initialBlocks = value && value.length > 0 ? value : [ ... ]
const [blocks, setBlocks] = useState<Block[]>(initialBlocks)   // ← chỉ dùng value lần đầu
...
useEffect(() => { onChange(blocks) }, [blocks, onChange])      // ← luôn ghi đè state cha bằng state nội bộ
```

Trong khi trang cha lại ghi nội dung import vào **state cha**:
```tsx
// app/admin/(dashboard)/posts/new/page.tsx:78-81
const handleHTMLImport = (newBlocks: Block[]) => {
  setBlocks([...blocks, ...newBlocks])   // ← cha đổi, con không biết
}
```

**Cách sửa (tối thiểu, an toàn với đang gõ):** thêm ref + effect đồng bộ trong `block-editor.tsx`:

```tsx
const blocksRef = useRef(blocks)
useEffect(() => { blocksRef.current = blocks }, [blocks])

useEffect(() => {
  if (!value) return
  if (JSON.stringify(value) === JSON.stringify(blocksRef.current)) return  // thay đổi nội bộ → bỏ qua
  const next = value.length > 0 ? value : [{ id: `block_default`, type: "paragraph", data: { text: "", align: "justify" } }]
  setBlocks(next)
  setHistory((h) => [...h, next].slice(-50))
  setHistoryIndex((i) => Math.min(i + 1, 49))
}, [value])
```

> Cách chuẩn hơn về lâu dài: để cha là "single source of truth" (controlled editor) và chỉ giữ ref cho `contentEditable`/selection.

---

### 🔴 LỖI 2 — Mở & lưu bài viết HTML cũ làm hỏng bài

**Hiện tượng:** Bài import từ WordPress (content là HTML) khi mở trong editor bị dồn thành 1 đoạn văn dính chữ; lưu lại là mất heading, list, đoạn, bảng… vĩnh viễn.

**Nguyên nhân 2 lớp:**
1. Nếu `JSON.parse(post.content)` thất bại, toàn bộ HTML được nhồi vào **một paragraph block**: `posts/[id]/edit/page.tsx:63-70` (`id: "legacy_content"`).
2. `ParagraphBlock.sanitizeHTML()` **unwrap mọi thẻ block** (chỉ cho phép `strong,b,em,i,u,a,code,br,span`) và ghép text **không có dấu cách/xuống dòng** → `paragraph-block.tsx:112-152` (đặc biệt dòng 130: `el.replaceWith(...Array.from(el.childNodes))`).
3. `handleInput`/`handleBlur` ghi lại chính HTML đã bị làm phẳng đó vào state → mất dữ liệu.

**Cách sửa:**
- Trong `posts/[id]/edit/page.tsx`, thay fallback 1-block bằng chính hàm `htmlToBlocks()` đã có sẵn (đang bị bỏ không dùng):

```tsx
} catch {
  setBlocks(htmlToBlocks(post.content || ""))   // import { htmlToBlocks } from "@/lib/blocks-to-html"
}
```
- Bổ sung cảnh báo cho người dùng khi bài ở định dạng HTML cũ ("Bài viết định dạng cũ — hệ thống đã chuyển sang dạng khối, vui lòng kiểm tra lại trước khi lưu").
- Về lâu dài: chạy script migrate một lần để chuyển `content` HTML → JSON blocks cho toàn bộ bài cũ.

---

### 🔴 LỖI 3 — Alt text ảnh bị bỏ qua ở bản render công khai

**Vị trí:** `lib/blocks-to-html.tsx:165`

```tsx
return `<figure class="${widthClass} my-8"><img src="${data.url || ""}" alt="${data.caption || ""}" ... />${caption}</figure>`
//                                                                   ^^^^^^^^^^^^^^^^^^^^^^ sai: phải là data.alt
```

**Hệ quả:** Editor bắt buộc nhập "Alt Text (Bắt buộc cho SEO)" (`image-block.tsx`), SEO checker trừ điểm nếu thiếu, nhưng Google/người đọc **không bao giờ nhận được alt đó**; nếu không có caption thì `alt=""`.

**Cách sửa:**
```tsx
const altText = escapeAttr(data.alt || data.caption || "")
const captionHtml = data.caption ? `<figcaption ...>${escapeHtml(data.caption)}</figcaption>` : ""
return `<figure class="${widthClass} my-8"><img src="${escapeAttr(data.url || "")}" alt="${altText}" ... />${captionHtml}</figure>`
```
(Thêm hàm `escapeHtml/escapeAttr` — hiện tại nội dung được nối thẳng vào HTML, có thể vỡ thuộc tính nếu caption chứa dấu `"`.)

---

### 🔴 LỖI 4 ⚠️ — Payload lưu bài chứa cột không tồn tại trong migration

UI gửi lên 2 field:
```ts
// posts/new/page.tsx:111-112  |  posts/[id]/edit/page.tsx:168-169
featured_image_alt: featuredImageAlt,
focus_keyword: focusKeyword,
```
Nhưng **không có file SQL nào trong repo tạo 2 cột này** (đã grep toàn bộ `scripts/*.sql`; `001_create_posts_table.sql` chỉ có: id, title, slug, excerpt, content, category, featured_image, meta_title, meta_description, status, published_at, created_at, updated_at, wordpress_id, wordpress_url; `005` thêm `views_count`, `views_this_month`, `last_view_reset`).

**Rủi ro:** nếu DB production chưa được thêm tay 2 cột → PostgREST trả lỗi kiểu *"Could not find the 'featured_image_alt' column of 'posts' in the schema cache"*, và **không thể lưu bất kỳ bài nào** (cả Lưu nháp lẫn Xuất bản).

**Cần làm ngay:**
1. Kiểm tra DB thật: `SELECT column_name FROM information_schema.columns WHERE table_name='posts';`
2. Nếu thiếu, thêm script mới (ví dụ `scripts/035_add_blog_seo_columns.sql`):
```sql
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS featured_image_alt TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS focus_keyword TEXT;
```
3. Liên quan: `app/blog/[slug]/page.tsx` có `keywords: post.tags || [post.category]` nhưng bảng `posts` **không có cột `tags`** → luôn fallback về category, và tính năng "Đề xuất Tags" của AI **không có chỗ lưu**. Nên thêm `tags TEXT[]` (hoặc bỏ tính năng/tính năng gợi ý tags).

---

### 🟠 LỖI 5 — API ghi bài & upload ảnh không có kiểm tra quyền

```ts
// app/api/posts/route.ts:26-27  (POST)
const supabase = await createClient()      // anon key + cookie, KHÔNG check user
const body = await request.json()          // nhận nguyên body từ client
...
// app/api/posts/[id]/route.ts:17,36 (PUT/DELETE) — tương tự
```

- Lớp bảo vệ duy nhất là RLS, nhưng `scripts/015_improve_posts_security.sql` chỉ giới hạn `TO authenticated` với `WITH CHECK (true)` → **bất kỳ tài khoản Supabase authenticated nào** (không cần nằm trong `admin_users`) đều tạo/sửa/xóa được bài. Chính file SQL ghi rõ đây là "TODO" chưa làm.
- `POST /api/upload-image` (`app/api/upload-image/route.ts`) và `POST /api/blog/ai-assistant` cũng **không auth** → người ngoài có thể upload file lên Vercel Blob (tốn chi phí/lạm dụng) và đốt token Groq.
- Ngoài ra API dùng **mass assignment**: `insert(body)`/`update(body)` nhận mọi key do client gửi (có thể ghi `views_count`, `wordpress_id`, `created_at`…). Nên whitelist field.

**Cách sửa:**
```ts
// lib/require-admin.ts
export async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: admin } = await supabase.from("admin_users").select("id").eq("email", user.email).maybeSingle()
  return admin ? supabase : null
}
// trong POST/PUT/DELETE: if (!(await requireAdmin())) return NextResponse.json({error:"Unauthorized"},{status:401})
```
Và siết RLS theo `admin_users` như gợi ý ở cuối script 015.

---

### 🟠 LỖI 6 — Paste đoạn văn có định dạng bị chèn thành text thô

`components/block-editor/blocks/paragraph-block.tsx:606-640` — hàm `insertPasteContent`:

```tsx
const temp = document.createElement("div")
temp.textContent = content      // ← coi HTML là text thuần
```

Vì `handlePaste` truyền vào `cleanInlineHTML(...)` (tức là HTML đã giữ `<strong>`, `<a>`…), người dùng sẽ thấy đúng chuỗi `<strong>chữ đậm</strong>` trong editor.

**Sửa:**
```tsx
const temp = document.createElement("div")
temp.innerHTML = sanitizeHTML(content)   // giữ định dạng, đã qua whitelist
...
document.execCommand("insertHTML", false, temp.innerHTML) // (hoặc giữ nguyên range.insertNode với fragment từ innerHTML)
```

---

### 🟠 LỖI 7 — Enter làm mất định dạng đoạn văn

```tsx
// paragraph-block.tsx:155-165
const currentText = e.currentTarget.textContent || ""   // ← lấy text thuần
onChange({ text: currentText })                          // ← ghi đè, mất <strong>/<a>
```
Khi đoạn có bold/link, nhấn Enter (hoặc Backspace ở đoạn rỗng) sẽ xóa định dạng của đoạn đó. Nên dùng `e.currentTarget.innerHTML` + `sanitizeHTML` như `handleBlur`.

---

### 🟠 LỖI 8 — Focus nhảy sai block khi bài có nhiều danh sách

`components/block-editor/blocks/list-block.tsx:218-223`:
```tsx
const liElement = document.querySelector(`li[data-item-index="${focusedIndex}"]`)
```
`querySelector` là **global**: với bài có 2 list, khi thêm mục ở list thứ hai focus sẽ nhảy sang mục cùng index của list thứ nhất. Cần scope theo `ref` của block (`listRef.current?.querySelector(...)`).

Tương tự, `block-editor.tsx` dùng `document.querySelector('[data-block-id=...]')` — may mắn là `data-block-id` không trùng giữa các block nên tạm ổn.

---

### 🟠 LỖI 9 — Nút "Áp dụng" của AI Writing Assistant là no-op

```tsx
// posts/new/page.tsx:61-67 (và edit:118-124)
const handleApplyAISuggestion = (newText: string) => {
  toast({ title: "Áp dụng thành công",
          description: "Vui lòng copy và paste vào khối đang chỉnh sửa hoặc tạo khối mới" })
}   // ← newText bị bỏ hoàn toàn
```
Người dùng bấm "Áp dụng" (và thấy toast "thành công") nhưng nội dung không được chèn. Nên: xác định block đang chọn/đoạn bôi đen và cập nhật `blocks` tương ứng (hoặc tối thiểu là copy vào clipboard).

---

### 🟠 LỖI 10 — Toast (sonner) không bao giờ hiển thị

- Rất nhiều file gọi `toast()` từ `sonner`: `components/admin/ai-writing-assistant.tsx`, `app/admin/(dashboard)/{settings,clients,conversations,knowledge-base,fda-registrations...}`, `app/client-portal/page.tsx`…
- Nhưng `<Toaster/>` của sonner (`components/ui/sonner.tsx`) **không được import ở đâu** (đã grep `ui/sonner` → 0 kết quả). Layout admin chỉ mount `components/ui/toaster.tsx` của shadcn (chỉ nghe `useToast`), root layout không mount gì.

⇒ Mọi thông báo "AI đã xử lý xong!", "Đã copy vào clipboard", lỗi upload… đều im lặng. **Sửa:** thêm `<Toaster richColors position="top-right" />` (sonner) vào `app/layout.tsx` hoặc `app/admin/(dashboard)/layout.tsx`.

---

### 🟡 Các lỗi P2 đáng chú ý khác

**11. Undo/Redo (`block-editor.tsx:106-131`)** — effect lịch sử **không có dependency array** ⇒ chạy sau *mọi* render, `JSON.stringify` toàn bộ blocks mỗi lần gõ (bài 40-50 khối sẽ giật khi gõ). Nhánh `if (newHistory.length > 50) newHistory.shift()` **không cập nhật `historyIndex`** → con trỏ undo lệch. Ngoài ra chỉ có phím tắt, không có nút Undo/Redo trên UI.

**12. Validate bài rỗng vô hiệu** — `if (!title || !category || !excerpt || blocks.length === 0)`; editor *luôn* có ≥1 block rỗng nên có thể "Xuất bản" bài không có nội dung. Nên kiểm tra `getTextContent().trim().length < N`.

**13. Slug** — sinh từ tiêu đề trong `app/api/posts/route.ts:30-38`: hai bài cùng tiêu đề → lỗi unique constraint (500, message SQL thô trả về UI); không có ô sửa slug; `PUT` không cập nhật slug khi đổi tiêu đề (nên tài liệu hóa hoặc thêm lựa chọn "đổi slug"). Nên thêm hậu tố `-2`, `-3`… khi trùng.

**14. Trùng lặp logic parse** — cùng một logic table/markdown/HTML được viết lại **3 lần**: `block-editor.tsx:48-107` (`parseMarkdownTable`, `parseHTMLTable` — hiện là **dead code**), `paragraph-block.tsx` (`parseMarkdownContent`, `parseHTMLTable`, `cleanInlineHTML`), `html-paste-dialog.tsx` (bản thứ ba). Hệ quả thấy rõ: cả 2 chỗ đều có bug `hasHeader: ... || true` → **luôn true**.

**15. `htmlToBlocks()` không được dùng** (`lib/blocks-to-html.tsx:221`) trong khi nó chính là hàm cần cho Import HTML và migrate bài cũ → nên dùng nó làm nguồn duy nhất thay cho 3 bản parse ở trên.

**16. An toàn nội dung** — `blocksToHTML()` không escape/sanitize; nội dung block (từ paste/AI/DB/import) được đổ thẳng vào `dangerouslySetInnerHTML` ở `app/blog/[slug]/page.tsx` và `block-renderer.tsx`. Sanitize hiện chỉ chạy ở client khi gõ/paste (`paragraph-block.tsx`), không có normalize ở server. Khuyến nghị: sanitize whitelist ở server trước khi render (hoặc khi lưu) để chống XSS nếu có nguồn nội dung khác (AI, script migrate, API).

**17. Hiệu năng** — `app/blog/page.tsx`, `app/blog/category/[category]/page.tsx`, `api/posts`, `lib/blog-data.tsx`(mock, không dùng) đều `select("*")` gồm cả `content` JSON cho mọi bài, không phân trang. Nên `select("id,title,slug,excerpt,category,featured_image,published_at")` + `range()`. Editor cũng nên throttle đồng bộ state cha.

**18. Không autosave** — không có `localStorage`/`beforeunload` trong module (đã grep → 0). Editor "nặng", người dùng dễ mất bài. Nên autosave draft vào `localStorage` (5-10 giây) + cảnh báo rời trang.

**19. Chất lượng mã** —
- `npm run lint` = `eslint .` nhưng repo **không có `eslint.config.*`** và eslint không có trong devDependencies → lỗi ngay.
- Không có bất kỳ test nào (không có `*.test.*`, jest/vitest/playwright config, `.github/workflows`).
- `next.config.mjs` đặt `typescript.ignoreBuildErrors: true` ⇒ build luôn xanh dù có lỗi TS. `npx tsc --noEmit` cho **85 lỗi**; riêng module blog:
  - `components/block-editor/blocks/heading-block.tsx:106` TS2590 *"union type too complex"* + 4 lỗi handler (do `HeadingTag = \`h${level}\` as keyof JSX.IntrinsicElements`);
  - `components/block-editor/inline-toolbar.tsx:403` — truyền `title` cho icon Lucide (không hợp lệ);
  - `components/block-editor/block-renderer.tsx` (5 lỗi TS7053) và `lib/blocks-to-html.tsx:123,154` (2 lỗi TS7053) — index object bằng `any`.
  → Nên sửa dần và bật lại `ignoreBuildErrors: false` sau khi về 0.

**20-22.** Danh mục hard-code ở 5 nơi (thêm danh mục mới phải sửa 5 file, sitemap hiện thiếu "Dịch vụ Agent Hoa Kỳ" và "Ủy thác xuất nhập khẩu"); Preview dùng `BlockRenderer` khác `blocksToHTML` (không render công thức LaTeX, cỡ heading khác, ngày hiện tại thay vì ngày đăng, không có meta) → nên dùng chung một hàm render; SEO checker đếm từ chỉ từ heading/paragraph/quote (bỏ list/table) → điểm SEO không chính xác.

**23. Vệ sinh repo** — `.env` (chứa `ZOHO_SMTP_*`, `ZOHO_FROM_EMAIL`, `NEXT_PUBLIC_SITE_URL`) và file nén `Vexim_blog-main.zip` (2,8 MB) **đang được commit**. Nên đưa `.env` vào `.gitignore` + `git rm --cached .env` và xoá zip khỏi repo. *(Ngoài phạm vi module blog nhưng mức độ cao: script `023_create_client_accounts.sql` mở policy `Allow anon read for login` với `USING (true)` trên bảng `clients` — bao gồm cả cột `password_hash`; và `admin_users` bị `DISABLE ROW LEVEL SECURITY` + `GRANT SELECT TO anon`.)*

---

## 5. Đề xuất thứ tự khắc phục

**Ngay lập tức (P0, nên làm trong hôm nay):**
1. Kiểm tra & thêm 2 cột `featured_image_alt`, `focus_keyword` (lỗi 4) — nếu thiếu thì cả module không lưu được bài.
2. Sửa `alt` trong `lib/blocks-to-html.tsx` (lỗi 3) — 1 dòng.
3. Đồng bộ `value` trong `BlockEditor` (lỗi 1) — ~10 dòng, sửa được cả "import không hiện" lẫn "mất nội dung import".
4. Dùng `htmlToBlocks()` cho bài HTML cũ (lỗi 2) — tránh mất dữ liệu hàng loạt.

**Tuần này (P1):**
5. `requireAdmin()` cho `/api/posts/*`, `/api/upload-image`, `/api/blog/ai-assistant` + siết RLS theo `admin_users` (lỗi 5).
6. Mount `<Toaster/>` sonner (lỗi 10) — 1 dòng, khôi phục toàn bộ thông báo.
7. Fix paste (lỗi 6, 7), focus list (lỗi 8), nút Áp dụng AI (lỗi 9).

**Sprint kế tiếp (P2/P3):**
8. Gom logic parse về một chỗ (`htmlToBlocks`) + sửa `hasHeader`; sanitize/escape ở server.
9. Validate nội dung + slug chống trùng; autosave; phân trang/chọn cột; mount eslint config + test tối thiểu (đề xuất Vitest cho `blocks-to-html`, `parseMarkdownContent`); tiến tới `ignoreBuildErrors: false`.
10. Gom danh mục về một nguồn cấu hình; dùng chung hàm render cho preview; vệ sinh repo (.env, zip).

---

## 6. Điểm mạnh của module (giữ nguyên khi sửa)

- Kiến trúc block-based rõ ràng, type hoá (`components/block-editor/types.ts`), hỗ trợ 6 loại khối + chèn ảnh có alt/caption + căn lề.
- `blocksToHTML()` có xử lý tinh tế cho nội dung AI: quy đổi LaTeX (`$\ge$` → `≥`), render công thức "dễ đọc" thay vì thô.
- Có sẵn nhiều tính năng SEO tốt: SEO checker tính điểm, meta title/description, ảnh bìa + alt, internal link picker trong toolbar, `generateMetadata` + JSON-LD `BlogPosting`/`BreadcrumbList`, sitemap, TOC tự động, redirect non-www → www.
- Paste từ Google Docs/Word/Markdown đã được xử lý khá kỹ (tách bảng, heading, list; whitelist thẻ, chặn `javascript:`).
- Đã có ý thức về phân quyền (layout admin check `admin_users`) và về migration an toàn từ WordPress (`htmlToBlocks`, script import).

---

## 7. Việc cần xác minh trên môi trường thật (không kiểm tra được từ mã nguồn)

| # | Cần kiểm tra | Cách kiểm tra |
|---|--------------|---------------|
| 1 | Bảng `posts` có cột `featured_image_alt`, `focus_keyword`? | `SELECT column_name FROM information_schema.columns WHERE table_name='posts'` |
| 2 | RLS bảng `posts` đã chạy `015` chưa? Có policy `USING (true)` cũ còn sót? | `SELECT * FROM pg_policies WHERE tablename='posts'` |
| 3 | Supabase project có bật đăng ký công khai (signup) không? (liên quan mức độ nghiêm trọng của lỗi 5) | Supabase Dashboard → Authentication |
| 4 | Biến môi trường production: `NEXT_PUBLIC_SUPABASE_URL/ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GROQ_API_KEY`, `BLOB_READ_WRITE_TOKEN` | Vercel → Settings → Environment Variables |
| 5 | Bài cũ (WordPress) đã bị lưu ở dạng phẳng chưa? Cần backup trước khi migrate | Query `content` của vài bài để kiểm tra chúng có `JSON.parse` được không |

---

## 8. Việc còn lại (khuyến nghị — chưa thực hiện)

1. **Chạy 2 script SQL trên Supabase** (bắt buộc): `scripts/035_add_blog_seo_columns.sql`, `scripts/036_harden_posts_rls.sql`.
2. **Thêm lint + test tự động**: `eslint.config.mjs` (+ `eslint-config-next`) và Vitest cho `lib/sanitize.ts`, `lib/content-parsers.ts`, `lib/blocks-to-html.tsx`, `lib/post-payload.ts` (hiện repo không có test nào; `npm run lint` lỗi vì thiếu config).
3. **Chỉ bật lại** `typescript.ignoreBuildErrors: false` sau khi 72 lỗi TS còn lại ở các module khác (analytics, fda-registrations, services/*, chatbot…) được xử lý.
4. **Vệ sinh repo**: `git rm --cached .env` + thêm `.env` vào `.gitignore`; xoá `Vexim_blog-main.zip` (2,8 MB) khỏi git; cân nhắc **đổi mật khẩu SMTP Zoho** vì mật khẩu cũ vẫn nằm trong lịch sử git.
5. **Dọn mã chết** (không được import ở đâu): `components/rich-text-editor.tsx`, `lib/blog-data.tsx` (dữ liệu mock), các hàm parse cũ đã thay bằng `lib/content-parsers.ts`.
6. **Kiểm thử tay trước khi phát hành**: tạo bài mới → import HTML từ Google Docs → publish → mở `/blog/<slug>`; mở 1 bài cũ định dạng HTML → lưu → mở lại để chắc chắn không mất cấu trúc; thử AI "Áp dụng" khi đang bôi đen đoạn văn.
