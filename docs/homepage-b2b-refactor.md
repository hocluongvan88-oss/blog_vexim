# Trang chủ mới — Vexim Global / B2B Digital Export

## Phạm vi đợt 1

Trang chủ cũ được thay bằng các component riêng trong `components/home/`:

1. Hero tiếng Anh, CTA yêu cầu audit và liên kết `https://veximtrade.com`. Dashboard CSS là **sơ đồ minh họa**, có nhãn *not live performance data*; không có thứ hạng hay buyer thật.
2. Digital gap: ba rủi ro về website không tìm thấy, phụ thuộc marketplace, dữ liệu sản phẩm thiếu cấu trúc. Không dùng con số “90%” vì chưa có nguồn.
3. Ba trụ cột: kiến trúc web B2B, SEO buyer-intent, kết nối Vexim Trade. Nội dung tập trung năng lực/phạm vi dự kiến, không bảo đảm ranking hay tích hợp tự động chưa xác nhận.
4. Proof: tab tương tác theo visibility / impressions / qualified inquiries; **chưa xuất bản số liệu hoặc URL khách hàng**. Nêu rõ cần nguồn, mốc thời gian và phương pháp xác minh.
5. Ba phạm vi hợp tác Core / Growth / Enterprise (đề xuất để thảo luận, **không phải bảng giá đã phê duyệt**). Listing có điều kiện đủ tiêu chuẩn và điều khoản đã thống nhất.
6. Compliance trở thành dải tiện ích nhỏ, link đúng các trang FDA, GACC, MoCRA, US Agent đã có. Footer tiếng Anh có công ty, Vexim Trade, contact, client portal, privacy notice; không sửa nội dung các landing page dịch vụ.

Nguồn copy/danh sách scope nằm ở `lib/homepage-content.ts`. Không có query `?lang=vi` hay công tắc i18n trên trang chủ.

## Bằng chứng cần bổ sung để hoàn thiện Proof of Performance

Chỉ bật dữ liệu sau khi chủ doanh nghiệp xác nhận và cho phép công bố:

- URL chính xác của Vexim Trade / website khách hàng và quyền hiển thị tên thương hiệu.
- Ảnh chụp SERP có **ngày, quốc gia, thiết bị, từ khóa chính xác và URL đích**; thứ hạng thay đổi theo thời điểm, không so sánh mơ hồ với Alibaba / Global Sources.
- Báo cáo Search Console theo khoảng thời gian cụ thể: impression / click / query buyer-intent; không đồng nhất impression với buyer thực tế.
- Định nghĩa lead, nguồn attribution và dữ liệu CRM đã ẩn thông tin cá nhân; xác nhận chuyển đổi trước khi công bố.

Hiện không dùng placeholder thành tích giả, logo bên thứ ba, báo giá, tỉ lệ thắng hay lời hứa “Top Google”.

## Form audit và privacy

- Modal gồm URL (HTTP/S), tên công ty, thị trường xuất khẩu, **email doanh nghiệp** để phản hồi; scope tự điền theo tier được chọn. Gửi `POST /api/digital-audit` bằng URL tương đối.
- API kiểm tra loại/nội dung/độ dài/Origin, honeypot và giới hạn 3 lần/giờ/IP **trên mỗi instance**. Gửi email text-only tới `ADMIN_EMAIL` hoặc `MAIL_USERNAME`; `replyTo` là email đã xác thực; không crawl URL hay ghi vào cơ sở dữ liệu. Dùng SMTP TLS mặc định, không tắt kiểm tra chứng chỉ.
- Cần `MAIL_USERNAME` và `MAIL_PASSWORD`; tùy chọn `MAIL_HOST`, `MAIL_PORT`, `MAIL_FROM_ADDRESS`, `ADMIN_EMAIL`. Nếu chưa cấu hình hoặc gửi thất bại, giao diện hiển thị lỗi và nút mở/chép bản nháp email. **Không báo thành công khi chưa gửi**.
- Limiter in-memory chỉ là phòng vệ cơ bản; trước khi mở chiến dịch quy mô lớn cần limiter dùng chung, chống spam, privacy/retention được doanh nghiệp và pháp chế phê duyệt. Chưa kiểm thử SMTP production.
- `/privacy` chỉ mô tả **form audit mới**, không tự nhận là chính sách pháp lý cho toàn bộ website. Cần chính sách chính thức được duyệt cho blog/portal/chat/analytics nếu muốn dùng như privacy policy toàn site.

## SEO, ngôn ngữ, hiệu suất

- Trang chủ và `/privacy`: SSR `<html lang="en">`, trang Việt còn `lang="vi"`. Middleware gắn header nội bộ; ClientWidgets đồng bộ lại `lang` khi Next Link điều hướng mềm. Trang chủ bỏ chatbot/Zalo tiếng Việt; metadata title/description/canonical/OG/JSON-LD là B2B và WebPage `en`, Website đa ngôn ngữ. Không đổi `@id` các service landing cũ.
- Trong Next 15, root layout đọc request header nên các route trở thành server-rendered on demand, và metadata có thể bị stream xuống `body`. `htmlLimitedBots: /.*/` giữ metadata trong `<head>` cho cả người dùng và bot. **Trade-off:** mất pre-render tĩnh ở các marketing route; cân nhắc tách root layout theo route group trong đợt tối ưu sau nếu cache edge/TTFB production không đạt mục tiêu.
- Font Inter tiếng Anh là subset cục bộ `public/fonts/inter-home-latin.woff2` (nguồn/giấy phép OFL từ `public/trade/fonts/`), preload + `font-display: optional`. Font Be Vietnam Pro của các trang Việt được self-host trong `app/fonts/` (OFL) thay cho yêu cầu tải Google Fonts khi build. OG 1200×630 mới có script `scripts/generate-home-og.py`, không dùng ảnh hay kết quả giả.
- `public/manifest.json` vốn là **Admin Dashboard**; trang chủ/privacy hủy kế thừa link manifest, vẫn giữ cho admin.

## Kiểm tra cục bộ

- `npm run test:homepage`: SSR và schema/head, responsive Chromium 320–1920px, không tràn ngang/hydration errors, CLS lúc tải, tab bằng bàn phím, modal gửi thành công/thất bại **mock** và email fallback (không gửi mail thật). Cần server chạy (`HOME_TEST_BASE_URL`, mặc định `http://127.0.0.1:3000`), bật browser bằng `BROWSER_EXECUTABLE_PATH` và thư viện Chromium phù hợp.
- `npm run test:schema`, `npm run test:trade`, `npm run test:fda`; tùy chọn `SCHEMA_TEST_BASE_URL` để kiểm tra HTML SSR thật.
- Build production trong sandbox cần `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` do **các route đăng nhập cũ** khởi tạo client khi import. Thử nghiệm build bằng giá trị giả cục bộ chỉ kiểm tra compile/chạy trang chủ, **không kiểm tra dữ liệu production**; không lưu hoặc triển khai giá trị giả. `next.config.mjs` đang bỏ qua lỗi TypeScript khi build theo cấu hình cũ: `npx tsc --noEmit` còn **47 lỗi ở file không sửa hoặc `.next/types` sinh ra**, không có lỗi trong component/route/schema mới. Build thành công không đồng nghĩa toàn bộ typecheck sạch.
- Lighthouse CLI 12.8.0 trên Chromium 133, Next production local (giả lập mạng/CPU, không phải Vercel production): **mobile Performance 95 / Accessibility 100 / Best Practices 100 / SEO 100; desktop 100 / 100 / 100 / 100; CLS = 0** cả hai. Báo cáo JSON cục bộ: `/home/user/homepage-lighthouse-mobile-final.json`, `/home/user/homepage-lighthouse-desktop-final.json` (nằm ngoài Git). Điểm có thể thay đổi theo môi trường, mạng, dữ liệu, script analytics và thiết bị; cần đo Core Web Vitals thực sau triển khai.

## Chưa triển khai / cần xác nhận

Danh mục dịch vụ SEO/web thực tế, quy trình Vexim Trade và quyền verified listing 1 năm, dữ liệu chứng minh hiệu quả, chính sách privacy toàn site, SMTP/CRM production và hạn mức rate-limit dùng chung. Chưa sửa lại trang FDA/Trade đã duyệt, và không ghi dữ liệu production.
