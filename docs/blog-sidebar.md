# Thanh bên blog

## Thay đổi

- Trang danh sách và trang bài viết dùng `RecentPosts`, lấy trực tiếp bảng `posts` qua Supabase phía server: chỉ `status = published`, sắp `published_at DESC NULLS LAST`, rồi `created_at DESC NULLS LAST`, `id DESC`. Mặc định 5 bài; trang chi tiết loại bài đang đọc. Không xếp theo lượt xem, không dùng bài mẫu khi lỗi hoặc không có dữ liệu.
- Hiển thị ngày đăng thực tế theo múi giờ Việt Nam; bài cũ thiếu ngày đăng dùng `created_at`. Ngày không hợp lệ được ẩn.
- Ghi đè cục bộ `Card` bằng `p-0 gap-0` để tiêu đề nền navy sát mép trên, không sửa mặc định Card toàn website. Card danh mục cũng dùng cách này.
- Xóa khối “Tại sao chọn Vexim Global?”; đổi nhãn dịch vụ và các liên kết dịch vụ liên quan trong blog thành “Nền tảng kết nối B2B”. Giữ URL `/services/export-sales` và cách điều hướng toàn trang của landing này.
- `BlogSidebarRail` gom các card vào một cột sticky từ breakpoint `lg`, cách đỉnh 96px (header desktop cao 80px). Vùng trong có chiều cao tối đa bằng viewport trừ 112px, cuộn riêng và nhận focus bàn phím để vẫn tới được form/dịch vụ khi cột dài. Hỗ trợ `dvh`, fallback `vh`; dừng tại đáy khối nội dung, không đè footer. Không dùng thư viện animation hay JS xử lý sự kiện cuộn. Trang bài viết hoạt động sticky ngay cả khi tắt JavaScript.
- Riêng trang danh sách có thêm thanh lọc danh mục sticky: `BlogSidebarOffset` dùng `ResizeObserver` đo chiều cao thực tế của thanh lọc và cập nhật offset/chiều cao khả dụng của sidebar, kể cả khi danh mục xuống dòng hoặc đổi kích thước cửa sổ. Trước khi đo được hoặc khi tắt JavaScript, sidebar danh sách ở luồng bình thường để không che lên thanh lọc.
- Chỉ ở trang có `[data-blog-sidebar-rail]`, đổi `body` từ `overflow-x: hidden` sang `clip`: `hidden` khiến overflow-y tính thành `auto`, tạo tổ tiên cuộn giả làm sticky không chạy. Các trang khác không đổi. Bỏ `overflow-hidden` ở tổ tiên mục lục để mục lục cũng sticky được.
- Mobile giữ cách hiển thị cũ: trang bài viết ẩn sidebar dưới `lg`; trang danh sách xếp sidebar dưới nội dung, không giới hạn chiều cao/cuộn riêng.

## Kiểm tra

```sh
npm run test:blog-sidebar
BROWSER_EXECUTABLE_PATH=/path/to/chromium npm run test:blog-sidebar
```

Lệnh đầu kiểm tra truy vấn/SSR bằng query spy trong bộ nhớ, không truy cập database thật. Có đường dẫn Chromium sẽ chạy thêm kiểm tra trình duyệt với component thật, CSS thật, khung header/grid và bài viết mô phỏng; không thêm route mock vào ứng dụng và không gửi form tới API thật. Có thể đặt `BLOG_SIDEBAR_SCREENSHOT_DIR` ngoài repository để lưu ảnh kiểm tra.

Đã kiểm tra Chromium 133 ở 320, 390, 768, 1024, 1280, 1568, 1920px cho hai chế độ bài viết/danh sách; padding header; vị trí sticky sau nhiều lần cuộn; mục lục; focus vào form; phím End cuộn tới cuối cột; giới hạn footer; mobile; đổi kích thước cửa sổ không tải lại trang để kiểm tra offset thanh lọc; viewport cao 600px; reduced motion; HTML và sticky trang bài viết khi tắt JavaScript; danh sách bài mới trên trang danh sách khi tắt JavaScript. Không có lỗi hydration/runtime trong harness.

`test:trade`, `test:schema`, `test:fda` và `git diff --check` đều đạt. TypeScript toàn dự án vẫn báo 44 lỗi ở các file ngoài thay đổi này; không có lỗi ở component/trang/fixture vừa sửa. Đây không phải xác nhận build toàn dự án sạch, kiểm chứng dữ liệu production hay xác nhận đã triển khai website chính thức.
