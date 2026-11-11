# Trang chủ Vexim Global — thiết kế lại EN/VI

## Phạm vi và định hướng

Chỉ thay **`/` và `/vi`**. Lấy cảm hứng từ nhịp bố cục trang giới thiệu doanh nghiệp của DGM Asia (hero → giới thiệu → giải pháp → phương pháp → nội dung/liên hệ), không sao chép thiết kế, hình ảnh, logo khách hàng, case study hay lời khẳng định của bên đó. Dùng bảng màu xanh navy/xanh dương của logo Vexim, khoảng trắng rộng, đường chia mảnh và nội dung biên tập riêng. Không có logo khách hàng, testimonial, con số hiệu quả hoặc lời hứa thứ hạng chưa xác minh.

Trang chủ mới ở `components/home/localized-home.tsx`, `landing-header.tsx`, `landing-sections.tsx` và `landing.module.css`:

1. Hero có H1 hiện có của từng locale, CTA biểu mẫu đánh giá và liên kết thật tới `https://veximtrade.com`. Một SVG **tự dựng** ở `public/home/export-atelier.svg` diễn giải nhà máy, địa cầu và kết nối xuất khẩu; ghi rõ là minh họa, **không** phải dữ liệu người mua/giao dịch/thứ hạng thật. OG EN/VI 1200×630 cùng phong cách mới, từ `scripts/generate-home-og.mjs`.
2. Dải hành trình 3 bước, ba cột năng lực (website xuất khẩu, buyer-intent SEO, Vexim Trade), câu chuyện về khoảng trống thông tin và ba bước triển khai. Không còn bento, dashboard, bộ hình minh họa hay giao diện hero cũ.
3. Ba phạm vi B2B Launchpad / Global Growth Engine / Enterprise Dominance là **đề xuất phạm vi**, không phải báo giá hay cam kết kết quả. Listing/xác minh tuân thủ điều kiện nền tảng và thỏa thuận. Tài nguyên FDA/GACC/MoCRA/US Agent liên kết tới các trang **tiếng Việt** riêng biệt, không được trình bày như bản dịch tiếng Anh.
4. Footer hiển thị thông tin liên hệ từ `lib/business-profile.ts`, liên kết tài nguyên/Trade và CTA. Menu EN/VI là dropdown điều hướng giữa hai URL đã xuất bản `/` ↔ `/vi`.

Nội dung bổ sung riêng của bản thiết kế ở `lib/landing-copy.ts`; nội dung sản phẩm/engagement hiện có ở `lib/homepage-content.ts`, thông điệp SSR ở `lib/home-i18n.ts`, phần menu/form client ở `lib/home-client-i18n.ts`. Metadata, canonical, hreflang, sitemap và Organization/LocalBusiness/Service schema giữ nguyên. Không dùng Schema.org `ProfessionalService` (loại tổng quát đã deprecated), không thêm thông tin thành tích hoặc chứng nhận giả.

## Những phần giữ nguyên

`/privacy` và `/vi/privacy` **vẫn dùng header, footer và biểu mẫu cũ**; footer được chuyển từ component homepage đã gỡ sang `components/home/privacy-footer.tsx` với JSX/CSS cũ, không đổi nội dung. Trang dịch vụ, blog, Vexim Trade, admin và các URL/CTA đã duyệt không thuộc đợt thay đổi. Phạm vi dịch thuật từng giai đoạn xem `docs/i18n-rollout.md`; không dùng `?lang=vi`, dịch tự động hay gắn English alternate cho trang dịch vụ chưa được duyệt.

Biểu mẫu đánh giá vẫn POST tới `/api/digital-audit` với URL tương đối và xác thực/honeypot/Origin hiện có. Nếu server email chưa cấu hình hoặc gửi thất bại, hiển thị lỗi và bản nháp email — **không báo thành công giả**, không tự crawl website. Thông báo quyền riêng tư chỉ mô tả luồng biểu mẫu này, không thay thế chính sách dữ liệu toàn website.

## Xác minh trước khi phát hành

- Build: `pnpm build`; bản thử cục bộ có thể cần biến Supabase **giả chỉ để biên dịch** các route cũ, không dùng chúng để chứng minh hoạt động đăng nhập/dữ liệu production. `next.config.mjs` hiện bỏ qua lỗi type khi build; `tsc --noEmit` của toàn repo vẫn có 47 lỗi cũ ở file không sửa/`.next/types`, không có lỗi trong component trang chủ mới.
- Với production server cục bộ: `SCHEMA_TEST_BASE_URL=http://127.0.0.1:3000 pnpm test:schema`, `pnpm test:fda`, `pnpm test:trade`; `HOME_TEST_BASE_URL=http://127.0.0.1:3000 pnpm test:homepage`. Có thể đặt `BROWSER_EXECUTABLE_PATH` để kiểm tra Chromium ở 320–1920px, CLS, menu dropdown/anchor, ảnh SVG, form thành công/thất bại **mock**, và fallback email. Không gửi email thật.
- OG: `BROWSER_EXECUTABLE_PATH=/path/to/chromium pnpm og:home` và `pnpm og:home --vi`. Bộ ảnh nằm ở `public/og-image.jpg` và `public/og-image-vi.jpg`; không dùng tài nguyên từ trang tham chiếu.
- Lighthouse CLI 12.8.2, Chromium 153 trên **production build cục bộ**: mobile EN **94–96/100/100/100**, VI **95/100/100/100** qua hai lượt đo; desktop EN/VI **100/100/100/100** (Performance/Accessibility/Best Practices/SEO), CLS = 0. Mục tiêu Performance di động **>95 chưa được đáp ứng ổn định**; các điểm tổng hợp biến thiên giữa lượt đo. Đo lại Core Web Vitals thực sau triển khai và trên thiết bị thật.
- Kiểm tra riêng nội dung đã duyệt của FDA/Trade, icon và blog nếu môi trường có đủ dependency. Tình trạng Vercel/production cần được xác minh từ CI và URL thật; build hoặc preview cục bộ **không** khẳng định đã triển khai.

## Bằng chứng còn cần từ chủ doanh nghiệp

Chỉ công bố khách hàng, tỷ lệ, kết quả SEO/lead hoặc quyền lợi nền tảng khi có quyền hiển thị và dữ liệu đã xác minh, kèm ngày/thị trường/nguồn đo. Chưa xác nhận SMTP production, chính sách retention chung hoặc giới hạn chống spam đa instance. Không tự đưa các số liệu/khách hàng của DGM Asia vào Vexim.
