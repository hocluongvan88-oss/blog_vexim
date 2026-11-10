# Sửa bố cục trang tạo/chỉnh sửa bài viết

## Phạm vi

Áp dụng cho `/admin/posts/new` và `/admin/posts/[id]/edit`, theo ảnh chủ website gửi. Không đổi nội dung bài viết, phân tích/chấm điểm SEO, API lưu bài hoặc kiểm tra quyền admin. Không sửa trang public FDA/Trade.

## Các lỗi và cách sửa

1. **Tiêu đề bị khuất:** trước đây dùng `Input` một dòng. Thay bằng `PostTitleInput` dùng textarea tự tăng/giảm chiều cao theo nội dung, chiều rộng canvas và khi webfont tải xong. Tiêu đề vẫn là một chuỗi logic, xuống dòng chỉ ở phần hiển thị. Dán nhiều dòng được đổi thành khoảng trắng. Enter chuyển tới khối đầu như trước; Enter khi đang gõ IME không làm mất focus.
2. **Lề nội dung không cân:** vùng block cũ có padding trái 48px nhưng phải 24px. Nay hai bên bằng nhau, có gutter cho tay nắm block ở desktop, lề gọn hơn trên điện thoại. Nút thêm cuối bài thẳng hàng với nội dung. Heading/paragraph cho phép ngắt chuỗi dài, không ép canvas rộng ra hoặc giấu phần cuối.
3. **Cột công cụ quá lớn:** thay 420/470/520px bằng 300px ở viewport 1280–1535px, 340px từ 1536px. Dưới 1280px, công cụ xếp dưới editor thay vì ép hai cột hẹp cạnh nhau. Giữ nút ẩn/hiện công cụ.
4. **Chi tiết hỗ trợ:** admin main có `min-w-0`; card soạn thảo chỉ dùng một khoảng cách giữa các phần, không cộng dồn `gap` và `space-y`. Toolbar khối nằm trong luồng và tự wrap để không che nội dung/tràn ngoài canvas. Các nhãn điểm SEO và thống kê được wrap trong sidebar hẹp.

## Kiểm thử

```sh
# npm ci --ignore-scripts nếu môi trường chưa có dependencies
LD_LIBRARY_PATH=/path/to/chromium-libs \
BROWSER_EXECUTABLE_PATH=/path/to/chromium \
POST_EDITOR_SCREENSHOT_DIR=/tmp/editor-review \
npm run test:post-editor:browser
```

Test dùng esbuild CLI cố định `0.25.12` qua `npx` (cần npm registry/cache ở lần chạy đầu); không thêm thư viện runtime vào website. Bundle/CSS và HTTP server thử nghiệm nằm trong thư mục tạm, được dọn khi kết thúc.

Harness render **hai client page thật, BlockEditor và các panel thật**, dùng stylesheet Tailwind của dự án. Chỉ giả lập Next routing, dữ liệu bài viết và API local; khung điều hướng trái mô phỏng chiều rộng 256px của admin layout. Không thêm route thử nghiệm vào `app/`, không tắt auth và không ghi bài/AI request lên production.

Đã đạt trên Chromium 133:

- Viewport 320, 390, 768, 1024, 1280, 1440, 1568, 1920px: không tràn ngang, title dài hiển thị đủ, đúng số cột và chiều rộng sidebar.
- Title tăng/giảm chiều cao khi đổi nội dung, đổi viewport, ẩn/hiện sidebar; giữ nguyên giá trị khi resize; xử lý chuỗi không có khoảng trắng, dán nhiều dòng và Enter/IME.
- Padding trái/phải của canvas bằng nhau; heading/paragraph không tràn với chuỗi dài; toolbar của khối đang chọn vẫn nằm trong khung ở mobile/desktop.
- Tab Thiết lập/SEO/AI trong sidebar 300px không làm tràn trang, các nút tab nằm gọn trong tablist.
- Khôi phục draft, nạp bài sửa và lưu nháp tới server giả lập: giữ đủ title/content, lần lượt POST/PUT đúng như trước. Không tạo hoặc sửa bài thật.
- Không có lỗi JavaScript trong hai trang thử nghiệm.

`tsc --noEmit` toàn repo còn 44 lỗi ở các file khác; không có lỗi tại các file thay đổi trong phần editor. Đây không phải xác nhận toàn bộ production build đạt hoặc đã kiểm thử bằng phiên đăng nhập admin thật.
