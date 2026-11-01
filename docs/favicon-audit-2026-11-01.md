# Kiểm tra favicon Vexim Global — 01/11/2026

## Kết luận và mức độ chắc chắn

1. `public/favicon.png` trước sửa **là PNG hợp lệ, vuông 500×500** (166.206 byte). Không có căn cứ kết luận Google từ chối chỉ vì kích thước 500px hoặc vì không phải bội số 48. Hướng dẫn Google hiện tại yêu cầu tối thiểu 8×8, khuyến nghị lớn hơn 48×48; 500×500 đáp ứng điều kiện này.
2. Ảnh chụp kết quả tìm kiếm do chủ website cung cấp **đã có favicon**, nhưng là thiết kế có chữ VEXIM phía dưới. File favicon hiện tại dùng biểu tượng V không có chữ. Đây là khác biệt phiên bản/nguồn ảnh, không phải ảnh Google đang dùng biểu tượng quả địa cầu mặc định.
3. **Lỗi cấu hình/tài sản xác nhận trong repo:** Apple icon được liên kết trong metadata là ảnh chữ nhật 824×543, trùng logo đầy đủ có chữ; hai icon PWA mang đuôi PNG nhưng thực chất là JPEG 1024×1024; các file ghi tên 32×32 cũng là logo chữ nhật 824×543. Do Google hỗ trợ cả `rel=icon` và `rel=apple-touch-icon`, việc cung cấp bộ nhận diện khác nhau là không nhất quán. Tuy nhiên, chưa có log Googlebot/Search Console để xác nhận Google đã chọn URL Apple icon hay đang dùng cache cũ. Các lỗi PWA không tự chứng minh nguyên nhân favicon Google.
4. Không cần sửa Organization.logo thành favicon: logo tổ chức 824×543 có mục đích khác, vẫn giữ nguyên `public/logo.png` và schema của nó.

## Dữ liệu trước/sau

| Tài sản                                         | Trước                                              | Sau                                                                      |
| ----------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------ |
| `/favicon.png`                                  | PNG 500×500; 166.206 byte; V có khoảng trắng rộng  | PNG 96×96; 5.707 byte; cùng biểu tượng V gốc, bố cục rõ ở kích thước nhỏ |
| `/apple-icon.png`                               | PNG 824×543; 162.766 byte; logo có chữ             | PNG vuông 180×180; 14.783 byte; biểu tượng V                             |
| `/icon-192.png`                                 | JPEG 1024×1024, dù khai PNG 192×192 trong manifest | PNG thật 192×192; 11.579 byte                                            |
| `/icon-512.png`                                 | JPEG 1024×1024, dù khai PNG 512×512 trong manifest | PNG thật 512×512; 63.204 byte                                            |
| `/icon-dark-32x32.png`, `/icon-light-32x32.png` | PNG 824×543, không khớp tên file                   | PNG thật 32×32; 1.032 byte/file                                          |
| `/favicon.ico`                                  | Chưa có                                            | ICO dự phòng chứa frame PNG 32 và 48px                                   |
| Metadata homepage                               | PNG 500×500; Apple icon không khai kích thước      | PNG 96×96 và Apple PNG 180×180, khai đúng kích thước/MIME                |

Biểu tượng lấy từ phần V của logo gốc `public/logo.png`, không vẽ lại hoặc thay màu. Logo đầy đủ, nội dung/giao diện FDA, nội dung Trade, icon riêng Trade và danh tính admin trong manifest không thay đổi. Icon manifest vẫn giữ vùng an toàn hình tròn cho `purpose: any maskable`.

**Giữ URL favicon ổn định:** `/favicon.png`; không thêm timestamp/hash/query phiên bản thay đổi liên tục. ICO dự phòng không phải yêu cầu bắt buộc để Google chấp nhận PNG. Các đường dẫn trong `public/` được truy cập ở gốc website, tức `/favicon.png`, **không phải** `/public/favicon.png`.

## HTML sau sửa

Cấu hình dùng chung tại `lib/site-icons.ts`, được `app/layout.tsx` sử dụng. Kiểm tra HTML SSR thực tế xác nhận:

```html
<link rel="icon" href="/favicon.png" type="image/png" sizes="96x96" />
<link rel="apple-touch-icon" href="/apple-icon.png" type="image/png" sizes="180x180" />
```

Không có `app/favicon.ico` hoặc root file-convention icon khác ghi đè khai báo metadata. `/favicon.ico` dự phòng nằm trong `public/`, không tự thêm một khai báo cạnh tranh vào metadata.

Google dùng **một favicon cho mỗi hostname**. Favicon riêng trong trang `/services/export-sales` không tạo một favicon Google độc lập cho nhãn hiệu Trade trên cùng `www.veximglobal.com`.

## Kiểm tra production: đã thấy gì và chưa thấy gì

- Lấy được nội dung trang chủ public qua công cụ đọc web: website có phản hồi nội dung. Công cụ này chuyển HTML thành văn bản, **không dùng kết quả đó để khẳng định đã kiểm tra thẻ `<link>` production**.
- Đọc được `https://www.veximglobal.com/robots.txt`: `User-Agent: *`, `Allow: /`, chỉ Disallow `/admin/`, `/api/`, `/client-portal/`. Các quy tắc được thấy không chặn favicon hoặc trang chủ.
- Kết nối trực tiếp từ sandbox tới production qua `curl` bị lỗi TLS/mạng; công cụ đọc trang cũng không lấy thành công file ảnh nhị phân. **Không diễn giải lỗi công cụ này thành lỗi 500/403 của favicon production**. Chưa xác nhận response header, bytes, cache/CDN, WAF, redirect hoặc khả năng truy cập từ IP Googlebot-Image thật trên production.
- Chưa truy cập Search Console hoặc log máy chủ, chưa xác nhận ngày Google crawl favicon hay nguồn icon Google đang giữ.
- Thay đổi được kiểm thử local và push lên nhánh làm việc, không đồng nghĩa đã deploy production, xóa cache Google hay Google đã chọn favicon mới.

## Kiểm thử đã thực hiện

```sh
npm run icons:generate
npm run test:icons
FAVICON_TEST_BASE_URL=http://127.0.0.1:3000 npm run test:icons
SCHEMA_TEST_BASE_URL=http://127.0.0.1:3000 npm run test:schema
SCHEMA_TEST_BASE_URL=http://127.0.0.1:3000 npm run test:fda
SCHEMA_TEST_BASE_URL=http://127.0.0.1:3000 npm run test:trade
```

- Kiểm tra magic bytes PNG, decoder Sharp, kích thước thật, ảnh không trống, kích thước/MIME trong metadata và manifest, vùng an toàn maskable, header/frame/offset của ICO.
- Raw SSR homepage chỉ có một `rel=icon` chính và một Apple icon, URL/kích thước/MIME đúng.
- HTTP local với UA trình duyệt, `Googlebot`, `Googlebot-Image/1.0`: asset 200, `image/png`, giải mã được, không có cookie phiên hoặc X-Robots-Tag chặn; homepage trả 200. Có kiểm tra ICO và robots.
- Thay UA **không chứng minh** bot thật qua được CDN/WAF; cần xác nhận production riêng.
- Kiểm thử schema/FDA/Trade đạt. TypeScript toàn repo vẫn có 45 lỗi cũ, không có lỗi tại layout hoặc module icon mới; không tuyên bố toàn bộ production build đạt.

## Việc cần làm sau deploy

1. Deploy bản sửa lên **`https://www.veximglobal.com/`**. Nếu CDN có cache asset cũ, làm mới cache `/favicon.png` và `/apple-icon.png`, không đổi URL liên tục.
2. Mở trực tiếp hai ảnh và kiểm tra status 200, MIME PNG, kích thước lần lượt 96×96 và 180×180; đảm bảo không trả trang đăng nhập/HTML/challenge. Xem nguồn HTML trang chủ để xác nhận hai thẻ icon trên.
3. Kiểm tra URL chuẩn www và redirect từ non-www; kiểm tra Googlebot/Googlebot-Image không bị WAF hoặc quy tắc hosting chặn. Đối chiếu log và xác minh bot thật nếu cần.
4. Trong Google Search Console, dùng **URL Inspection → trang chủ `https://www.veximglobal.com/` → Test live URL → Request indexing**. Không cần gửi URL favicon như một trang nội dung cần index.
5. Chờ Google crawl lại trang chủ và icon. Google nói quá trình có thể mất **vài ngày đến vài tuần**, không có thời hạn bảo đảm và không cam kết favicon sẽ được hiển thị chỉ vì đạt các điều kiện kỹ thuật. Xóa cache trình duyệt của người dùng không xóa cache Google Search.

## Nguồn chính thức

- Google Search Central — Define a favicon to show in search results: https://developers.google.com/search/docs/appearance/favicon-in-search (đọc ngày 01/11/2026).
- Robots public đã đọc: https://www.veximglobal.com/robots.txt.
