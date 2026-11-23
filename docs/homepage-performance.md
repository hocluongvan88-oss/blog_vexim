# Tốc độ trang chủ — số đo và những gì đã đổi

Đo bằng Lighthouse 12 (Chromium headless, preset mobile mặc định: CPU x4, 4G chậm) trên bản
`next build && next start` ở máy local, mỗi cấu hình chạy 3–4 lần. Số tuyệt đối phụ thuộc máy
đo; điều đáng đọc là **tỉ lệ thay đổi** và **thành phần nào chiếm thời gian**.

| Chỉ số | Trước | Sau |
|---|---|---|
| Performance score | 90 | 92–96 |
| First Contentful Paint | 1,4 s | 1,2 s |
| Largest Contentful Paint | 3,5 s | 2,7–3,3 s |
| Total Blocking Time | 110 ms | 30–100 ms |
| Cumulative Layout Shift | 0 | 0 |
| Tổng dung lượng trang | 446 KiB | 380 KiB |
| CSS chặn render | 223 KB (4 tệp) | 65 KB |
| Font tải ở lần đầu | 3 tệp / 120 KB | 3 tệp / 87 KB |
| Ảnh trên mobile (≤430 px) | bản 800 px | bản 480 px |

## 1. CSS trang chủ tách khỏi CSS toàn site

`app/globals.css` phải phục vụ admin, blog, 23 trang dịch vụ và cổng khách hàng, nên Tailwind
sinh ~181 KB (≈29 KB gzip). Trước đây tệp này nằm ở root layout, nghĩa là trang chủ phải tải và
phân tích **toàn bộ** khối đó trước khi vẽ chữ đầu tiên.

Nay CSS chia theo nhóm route:

- `app/(landing)/layout.tsx` → `app/landing.css`: `@import "tailwindcss" source(none)` và khai báo
  đúng những tệp mà 4 trang landing render (`components/home/*`, `site-header`, hộp thoại tư vấn và
  3 component UI của nó). Kết quả: 89 KB thô (≈14 KB gzip).
- `app/(site)/layout.tsx` → `app/globals.css`: giữ nguyên cho admin/blog/dịch vụ.
- `app/page.tsx` (trang chủ tiếng Việt nằm ngoài nhóm route ở URL gốc) → `landing.css`.

**Khi thêm class Tailwind mới cho landing page**: nếu class nằm trong `components/home`,
`components/site-header.tsx`, `components/consultation-dialog.tsx` hoặc `components/ui/{button,dialog,input,sonner}.tsx`
thì không cần sửa gì. Nếu tạo component mới, thêm đường dẫn của nó vào `@source` trong `app/landing.css`.

## 2. sonner/Toaster không còn tải ở trang công khai

`Toaster` từng được mount ở mọi trang. Nay `components/root-shell.tsx` chỉ render nó ở `/admin/*`
và `/client-portal` (những nơi thật sự gọi `toast()`), và nạp bằng `next/dynamic`. Trang công khai
không còn tải `sonner` + `next-themes` (~9 KB gzip).

`RootShell` cũng thay `ClientWidgets` ở root layout: bản cũ gọi `usePathname()` nên **mọi** trang
buộc phải render động theo từng request.

## 3. Nút Zalo nạp sau khi khách tương tác

SDK `sp.zalo.me` kéo theo iframe `page.widget.zalo.me` tự tải hai font `fa-light-300.woff2` +
`fa-regular-400.woff2`. Lighthouse xếp cả cụm vào mục "Hiển thị phông chữ" (~220 ms) và cộng
thời gian CPU bên thứ ba vào đúng lúc trang cần CPU nhất.

`components/zalo-chat-button.tsx` nay chờ tương tác đầu tiên (chạm/cuộn/gõ phím) hoặc 4 giây sau
khi `load` mới gắn widget — nút Zalo vẫn luôn xuất hiện, chỉ không tranh băng thông với nội dung chính.

## 4. Font: subset theo tiếng Việt

5 tệp `app/fonts/BeVietnamPro-*.woff2` được subset bằng `pyftsubset` (fontTools) về đúng
Latin + Latin Extended + Vietnamese (`U+1EA0–1EF9`), giữ nguyên họ chữ và độ đậm. Tổng 208 KB → 146 KB.
Lệnh tái tạo:

```bash
pyftsubset app/fonts/BeVietnamPro-Regular.woff2 \
  --unicodes="U+0020-007E,U+00A0-00FF,U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01B0,U+02C6-02C7,U+02D8-02DD,U+1EA0-1EF9,U+2000-206F,U+2122,U+2190-2199" \
  --flavor=woff2 --layout-features='*' --output-file=app/fonts/BeVietnamPro-Regular.woff2
```

Làm tương tự cho Light/Medium/SemiBold/Bold. **Nếu thêm ngôn ngữ mới** (ví dụ chữ Hàn/Trung trong
bài dịch vụ) phải subset lại với dải ký tự tương ứng.

## 5. Ảnh

- Thêm biến thể `-480.webp` cho 4 ảnh thật sự hiện ở cột hẹp; `Photo` trong `home-sections.tsx`
  khai báo `srcSet` 480/800/1200 và `sizes` đúng cho lưới tin tức → mobile không còn tải bản 800 px.
- Nén lại 5 logo đối tác (chất lượng 82) và giữ đúng kích thước hiển thị.
- `next.config.mjs`: ảnh/font trong `/public` (`/home/*`, `/images/*`, `/fonts/*`, `og-image*`,
  `apple-touch-icon.png`) được trả `Cache-Control: public, max-age=31536000, immutable` thay vì
  `max-age=0` như mặc định của Next. **Khi thay ảnh giữ nguyên tên tệp, phải đổi tên** — nếu không
  trình duyệt cũ sẽ dùng bản cũ tới 1 năm.

## 6. Còn lại (chưa làm) và vì sao

- **LCP ~2,7–3,3 s** chủ yếu là *render delay*, không phải tải ảnh: LCP là khối chữ `<h1>` (font đã
  preload, tải xong < 200 ms). Thời gian còn lại là hydrate React của cả trang rồi mới vẽ nốt khối
  chữ lớn nhất. Giảm tiếp cần cắt bớt JS của chính trang chủ (context của form, header dùng chung).
- **`polyfills-*.js` (38 KB gzip)** là script `nomodule` Next tự phát cho trình duyệt cũ; trình duyệt
  hiện đại không tải. Giữ nguyên để không mất khách trên WebView cũ.
- **Chunk `1255-*.js` 45 KB gzip** là React + runtime của Next (dùng chung mọi trang), không cắt
  được nếu vẫn giữ App Router.
- **`/services/*`, `/blog`**: chưa tách CSS vì các trang này dùng chồng chéo gần như toàn bộ
  `components/ui`; muốn tách phải làm theo từng nhóm route và đo lại.
