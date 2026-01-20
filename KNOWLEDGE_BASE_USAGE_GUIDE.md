# Hướng Dẫn Sử Dụng Kho Tri Thức AI (Knowledge Base)

## Tổng Quan

Kho Tri Thức AI là nơi bạn quản lý tất cả tài liệu, nghị định, thông tư, và kiến thức mà AI chatbot sẽ sử dụng để trả lời câu hỏi của khách hàng.

**Truy cập:** `/admin/knowledge-base`

---

## Các Loại Tài Liệu Có Thể Tải Lên

### 1. Văn Bản Trực Tiếp (Text)
Nhập trực tiếp nội dung vào form.

**Khi nào dùng:**
- Tài liệu ngắn
- Cần chỉnh sửa nhanh
- Copy/paste từ nguồn khác

**Ví dụ:**
- Quy trình nội bộ
- Câu hỏi thường gặp (FAQ)
- Chính sách công ty

### 2. URL
Nhập link website và hệ thống sẽ tự động tải nội dung.

**Khi nào dùng:**
- Tài liệu từ website chính thức
- Bài viết blog
- Trang hướng dẫn online

**Ví dụ:**
- https://www.fda.gov/food/guidance-regulation
- https://customs.gov.cn/english
- https://vexim.com/blog/quy-dinh-moi-nhat

**Lưu ý:** URL phải công khai và không yêu cầu đăng nhập.

### 3. File Upload
Tải lên file từ máy tính.

**Định dạng hỗ trợ:**
- ✅ **TXT** - File văn bản thuần
- ✅ **MD** (Markdown) - File markdown
- ✅ **RTF** - Rich Text Format
- ✅ **PDF** - Portable Document Format (đang cải thiện)
- ✅ **DOC/DOCX** - Microsoft Word (đang cải thiện)

**Khi nào dùng:**
- Nghị định, thông tư chính thức
- Tài liệu PDF từ cơ quan nhà nước
- File Word từ đối tác
- Báo cáo, hướng dẫn chi tiết

---

## Cách Tải Lên Tài Liệu

### Bước 1: Mở Dialog Thêm Tài Liệu
Click nút **"Thêm Tài Liệu"** ở góc phải trên.

### Bước 2: Chọn Loại Nguồn
- **Văn Bản**: Nhập trực tiếp
- **URL**: Nhập link
- **File**: Upload file từ máy

### Bước 3: Nhập Thông Tin
- **Tiêu Đề**: Tên mô tả tài liệu (VD: "Nghị định 15/2018 về GACC")
- **Nội Dung/URL/File**: Tùy theo loại nguồn đã chọn

### Bước 4: Tải Lên
Click nút **"Tải Lên"** và đợi hệ thống xử lý.

**Thời gian xử lý:**
- Văn bản nhỏ (<5000 từ): 2-5 giây
- Tài liệu lớn (>10000 từ): 10-30 giây
- File PDF/Word: 30-60 giây

---

## Ví Dụ Thực Tế - Tải Lên Nghị Định

### Tình Huống: Bạn có file PDF "Nghi-dinh-15-2018-GACC.pdf"

**Cách 1: Chuyển đổi sang Text (Khuyên dùng)**

1. Mở PDF bằng Adobe Reader hoặc Chrome
2. Copy toàn bộ nội dung (Ctrl+A, Ctrl+C)
3. Chọn loại nguồn: **Văn Bản**
4. Tiêu đề: `Nghị định 15/2018 - Quy định đăng ký GACC`
5. Paste nội dung vào ô **Nội Dung**
6. Click **Tải Lên**

**Ưu điểm:** Độ chính xác cao nhất, AI đọc được đầy đủ

**Cách 2: Upload File Trực Tiếp**

1. Chọn loại nguồn: **File**
2. Tiêu đề: `Nghị định 15/2018 - Quy định đăng ký GACC`
3. Click **Choose File** và chọn file PDF
4. Click **Tải Lên**

**Lưu ý:** Hiện tại việc đọc PDF có thể chưa hoàn hảo. Nếu AI không trả lời đúng, hãy dùng Cách 1.

---

## Import Hàng Loạt Từ Thư Mục `/knowledge/`

Nếu bạn có nhiều file `.md` trong thư mục `/knowledge/` của project:

1. Click nút **"Import Files"**
2. Hệ thống tự động quét và import tất cả file `.md`
3. Các file đã tồn tại sẽ bị bỏ qua (không ghi đè)

**File hiện có trong `/knowledge/`:**
- `fda-correct-knowledge.md`
- `gacc-knowledge.md`
- `mfds-knowledge.md`
- `export-delegation-knowledge.md`
- `ai-traceability-knowledge.md`
- `us-agent-knowledge.md`

---

## Quản Lý Tài Liệu

### Chỉnh Sửa (Edit)
Click icon bút chì để sửa tiêu đề hoặc nội dung.

**Lưu ý:** Chỉ có thể sửa tài liệu dạng "Văn Bản". File và URL không sửa được.

### Xử Lý Lại (Reprocess)
Nếu tài liệu bị lỗi khi xử lý, click icon refresh để xử lý lại.

### Xóa (Delete)
Click icon thùng rác để xóa tài liệu.

**Cảnh báo:** Không thể hoàn tác sau khi xóa!

---

## Hiểu Về "Chunks" và Xử Lý

### Chunks Là Gì?

Mỗi tài liệu được chia thành nhiều **chunks** (đoạn nhỏ) để AI có thể tìm kiếm và trả lời hiệu quả hơn.

**Ví dụ:** 
- Tài liệu 10,000 từ → 20-30 chunks
- Mỗi chunk ~300-500 từ
- AI tìm chunk liên quan nhất để trả lời

### Trạng Thái Tài Liệu

- **Đang xử lý** (Processing): Hệ thống đang chia thành chunks
- **Hoạt động** (Active): Đã sẵn sàng, AI có thể sử dụng
- **Lỗi** (Error): Xử lý thất bại, cần upload lại

---

## Best Practices - Cách Tốt Nhất

### 1. Đặt Tên Tiêu Đề Rõ Ràng

❌ **Tránh:**
- "Tài liệu 1"
- "File mới"
- "test"

✅ **Nên:**
- "Nghị định 15/2018 - Quy định GACC"
- "Quy trình đăng ký FDA 2026"
- "Thông tư 38/2019 - Nhập khẩu thực phẩm"

### 2. Cấu Trúc Nội Dung Tốt

✅ **Nên:**
- Có tiêu đề rõ ràng
- Chia theo section/phần
- Dùng bullet points
- Tách đoạn văn rõ ràng

❌ **Tránh:**
- Văn bản liền một khối
- Không có ngắt đoạn
- Quá nhiều ký tự đặc biệt

### 3. Cập Nhật Thường Xuyên

- Khi có quy định mới → Upload ngay
- Quy định cũ bị thay thế → Xóa bản cũ, upload bản mới
- Review mỗi quý để đảm bảo thông tin chính xác

### 4. Kiểm Tra Sau Khi Upload

1. Upload tài liệu xong
2. Mở chatbot và hỏi thử
3. Kiểm tra AI có trả lời đúng không
4. Nếu sai → Chỉnh sửa hoặc upload lại

---

## Xử Lý Vấn Đề Thường Gặp

### Vấn đề 1: AI Không Trả Lời Từ Tài Liệu Mới

**Nguyên nhân:**
- Tài liệu đang trong trạng thái "Processing"
- Nội dung quá ngắn hoặc không rõ ràng
- AI không tìm thấy chunk phù hợp

**Giải pháp:**
1. Đợi tài liệu chuyển sang "Active"
2. Kiểm tra số chunks (nên có ít nhất 3-5 chunks)
3. Thử hỏi câu hỏi cụ thể hơn
4. Xử lý lại tài liệu (click Reprocess)

### Vấn đề 2: Upload File PDF Bị Lỗi

**Nguyên nhân:**
- PDF là ảnh scan (không phải text)
- File quá lớn (>5MB)
- File bị mã hóa/bảo vệ

**Giải pháp:**
1. Chuyển PDF sang text:
   - Mở PDF → Copy text → Dùng loại "Văn Bản"
2. Nếu PDF là ảnh → Dùng OCR để chuyển sang text
3. Chia file lớn thành nhiều phần nhỏ

### Vấn đề 3: Nội dung Không Đúng Định Dạng

**Nguyên nhân:**
- Copy/paste từ Word/PDF giữ nguyên format
- Ký tự đặc biệt lạ

**Giải pháp:**
1. Paste vào Notepad trước để loại bỏ format
2. Copy từ Notepad vào form
3. Hoặc dùng file .txt thuần

---

## Ví Dụ Nội Dung Tài Liệu Chuẩn

```markdown
# Nghị định 15/2018 - Đăng ký GACC

## 1. Giới thiệu

Nghị định 15/2018 quy định về việc đăng ký cơ sở sản xuất thực phẩm 
xuất khẩu sang Trung Quốc với cơ quan hải quan Trung Quốc (GACC).

## 2. Đối tượng áp dụng

- Doanh nghiệp sản xuất thực phẩm xuất khẩu sang Trung Quốc
- Cơ sở chế biến thực phẩm muốn đăng ký với GACC
- Công ty có sản phẩm thuộc danh mục quản lý của GACC

## 3. Quy trình đăng ký

### Bước 1: Chuẩn bị hồ sơ
- Giấy phép kinh doanh
- Giấy chứng nhận ATTP
- Bản vẽ mặt bằng cơ sở
- ISO/HACCP (nếu có)

### Bước 2: Nộp hồ sơ
Nộp hồ sơ qua hệ thống online của GACC...

## 4. Thời gian xử lý

- Thời gian tiếp nhận: 5-7 ngày làm việc
- Thời gian thẩm định: 30-45 ngày
- Kiểm tra thực tế (nếu cần): 60-90 ngày

## 5. Lưu ý quan trọng

- Hồ sơ phải có bản dịch tiếng Trung
- Giấy tờ phải công chứng
- Cơ sở phải đáp ứng tiêu chuẩn Trung Quốc
```

---

## Liên Hệ Hỗ Trợ

Nếu gặp khó khăn khi sử dụng Knowledge Base:

1. Kiểm tra file log (F12 Console trong trình duyệt)
2. Chụp màn hình lỗi
3. Liên hệ team tech support với thông tin:
   - Tên file đang upload
   - Kích thước file
   - Screenshot lỗi
   - Các bước đã thực hiện

---

## Tóm Tắt Nhanh

| Loại Tài Liệu | Khuyên Dùng | Độ Chính Xác | Thời Gian |
|---------------|-------------|---------------|-----------|
| Văn Bản Text  | ⭐⭐⭐⭐⭐ | Cao nhất      | Nhanh     |
| URL           | ⭐⭐⭐⭐   | Cao           | Trung bình|
| File TXT/MD   | ⭐⭐⭐⭐⭐ | Cao nhất      | Nhanh     |
| File PDF      | ⭐⭐⭐     | Trung bình    | Chậm      |
| File Word     | ⭐⭐⭐     | Trung bình    | Chậm      |

**Khuyến nghị:** Luôn ưu tiên chuyển đổi tài liệu sang **Text** hoặc **Markdown** trước khi upload để đạt độ chính xác cao nhất!
