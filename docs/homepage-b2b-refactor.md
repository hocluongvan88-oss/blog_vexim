# Trang chủ mới — Vexim Global / B2B Digital Export

## Phạm vi bản thiết kế lại

Trang chủ tiếng Anh trong `components/home/` theo bố cục tối giản, sáng, nhiều khoảng trắng:

1. Hero có headline/CTA audit và liên kết thật đến `https://veximtrade.com`; minh họa **SVG isometric tự dựng** về nhà máy Việt Nam, catalog và thị trường quốc tế, được ghi rõ là concept, không phải dữ liệu buyer/ranking thật.
2. Bento bất đối xứng gồm ba trụ cột: kiến trúc web xuất khẩu, SEO buyer-intent, kết nối Vexim Trade. Bốn vector cục bộ ở `public/home/` nhẹ, không tải từ bên thứ ba. Không có dark-mode CLI hay bảng dữ liệu hiệu suất giả.
3. Verification gap hai cột giải thích rủi ro khi buyer kiểm tra supplier và lộ trình trang chính thức → xác minh → liên hệ; **không dùng 90%** khi chưa có nguồn, không hứa hợp đồng OEM.
4. Ba scope B2B Launchpad / Global Growth Engine / Enterprise Dominance phân theo product line và vận hành, **không phải bảng giá**. Quyền listing, xác minh và thời hạn phải được xác nhận theo điều kiện nền tảng/thỏa thuận, không tự hứa 1 năm hoặc duyệt tức thì.
5. Compliance là dải link phụ đến FDA, GACC, MoCRA, US Agent; footer sáng có thông tin công ty, kênh Trade, contact, portal và privacy. Các landing page dịch vụ, blog và admin giữ nguyên.

Nguồn copy/scope ở `lib/homepage-content.ts`; bản dịch nội dung ở `lib/home-i18n.ts`. Dropdown VI/EN chuyển giữa `/` (tiếng Việt, mặc định) và `/en` (privacy: `/privacy` ↔ `/en/privacy`). Liên kết mang `?lang=` để middleware ghi nhớ lựa chọn; khách dùng trình duyệt tiếng Anh được chuyển sang `/en`. Phạm vi triển khai theo giai đoạn và điều kiện duyệt trang dịch vụ ghi trong `docs/i18n-rollout.md`. Các thông điệp "Page 1", "high-volume contracts" và tự động matching chưa được đưa lên vì thiếu bằng chứng/quy trình được chủ doanh nghiệp xác nhận.

## Bằng chứng cần bổ sung trước khi công bố kết quả hiệu suất

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
- `/privacy` và `/en/privacy` chỉ mô tả **form audit mới** bằng tiếng Anh/Việt, không tự nhận là chính sách pháp lý cho toàn bộ website. Cần chính sách chính thức được duyệt cho blog/portal/chat/analytics nếu muốn dùng như privacy policy toàn site.

## SEO, ngôn ngữ, hiệu suất

- `/` và `/privacy`: SSR `<html lang="vi">`; `/en` và `/en/privacy`: SSR `<html lang="en">`. Middleware gắn header nội bộ; ClientWidgets đồng bộ `lang`/font khi Next Link điều hướng mềm. Cả hai trang chủ dùng luồng audit riêng, không tải widget chat/Zalo tiếng Việt của các trang dịch vụ. Mỗi trang có title/description/canonical/OG và `hreflang` đúng ngôn ngữ; homepage có WebPage/Service/ImageObject theo locale, WebSite đa ngôn ngữ. Không đổi `@id` các service landing cũ; chưa khai English alternates cho chúng. Schema giữ một entity `Organization` + `LocalBusiness` đã được xác minh, **không tạo thêm `ProfessionalService`** vì [Schema.org ghi loại tổng quát này đã deprecated](https://schema.org/ProfessionalService) và dễ gây nhầm với `Service`.
- Trong Next 15, root layout đọc request header nên các route trở thành server-rendered on demand, và metadata có thể bị stream xuống `body`. `htmlLimitedBots: /.*/` giữ metadata trong `<head>` cho cả người dùng và bot. **Trade-off:** mất pre-render tĩnh ở các marketing route; cân nhắc tách root layout theo route group trong đợt tối ưu sau nếu cache edge/TTFB production không đạt mục tiêu.
- Font Inter tiếng Anh là subset cục bộ `public/fonts/inter-home-latin.woff2` (nguồn/giấy phép OFL từ `public/trade/fonts/`), `font-display: optional`, **không preload** để ưu tiên CSS/hero trong lần tải lạnh. Riêng `/` và `/privacy` dùng Be Vietnam Pro Regular/SemiBold self-host (OFL) với `font-display: optional`, không thay đổi font của dịch vụ/blog. OG sáng 1200×630 theo từng ngôn ngữ, tạo bằng `BROWSER_EXECUTABLE_PATH=/path/to/chromium pnpm og:home` và `pnpm og:home -- --vi` (`scripts/generate-home-og.mjs`), không dùng ảnh hay kết quả giả.
- `public/manifest.json` vốn là **Admin Dashboard**; trang chủ/privacy hủy kế thừa link manifest, vẫn giữ cho admin.

## Kiểm tra cục bộ

- `pnpm test:homepage`: SSR của hai trang chủ và hai trang privacy, `hreflang`/sitemap/metadata, responsive Chromium 320–1920px, SVG/bento, không tràn ngang/hydration errors, CLS lúc tải, dropdown EN/VI (desktop/mobile), header sticky, modal gửi thành công/thất bại **mock** và email fallback hai ngôn ngữ (không gửi mail thật). Cần server chạy (`HOME_TEST_BASE_URL`, mặc định `http://127.0.0.1:3000`), bật browser bằng `BROWSER_EXECUTABLE_PATH` và thư viện Chromium phù hợp.
- `npm run test:schema`, `npm run test:trade`, `npm run test:fda`; tùy chọn `SCHEMA_TEST_BASE_URL` để kiểm tra HTML SSR thật.
- Build production trong sandbox cần `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` do **các route đăng nhập cũ** khởi tạo client khi import. Thử nghiệm build bằng giá trị giả cục bộ chỉ kiểm tra compile/chạy trang chủ, **không kiểm tra dữ liệu production**; không lưu hoặc triển khai giá trị giả. `next.config.mjs` đang bỏ qua lỗi TypeScript khi build theo cấu hình cũ: `npx tsc --noEmit` còn **47 lỗi ở file không sửa hoặc `.next/types` sinh ra**, không có lỗi trong component/route/schema mới. Build thành công không đồng nghĩa toàn bộ typecheck sạch.
- Lighthouse CLI 12.8.2 trên Chromium 153, bản Next production **local** (Supabase giả chỉ để compile, không phải Vercel production): lượt đo cuối mobile **EN 94 / 100 / 100 / 100**, **VI 95 / 100 / 100 / 100** (Performance / Accessibility / Best Practices / SEO); desktop **100 / 100 / 100 / 100** cho cả hai, CLS = 0. Điểm mobile dao động giữa các lượt (EN 94–96, VI 93–95); **mục tiêu Performance >95 chưa được đáp ứng ổn định**. Báo cáo thử nằm ở cache ngoài Git. Cần đo Core Web Vitals thực sau triển khai; không coi thử nghiệm cục bộ là xác nhận Vercel/production.

## Chưa triển khai / cần xác nhận

Danh mục dịch vụ SEO/web thực tế, quy trình Vexim Trade và quyền verified listing 1 năm, dữ liệu chứng minh hiệu quả, chính sách privacy toàn site, SMTP/CRM production và hạn mức rate-limit dùng chung. Chưa sửa lại trang FDA/Trade đã duyệt, và không ghi dữ liệu production.
