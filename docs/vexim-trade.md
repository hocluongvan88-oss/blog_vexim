# Vexim Trade — bản landing dành cho nhà cung cấp

## Phạm vi đã xác nhận

Theo trả lời của chủ website: **thay trang và ảnh dịch vụ Phòng Sale Xuất Khẩu** trong repo hiện tại, không triển khai một website/domain mới.

- URL đang dựng: `https://www.veximglobal.com/services/export-sales` (giữ liên kết cũ).
- Mọi CTA đăng ký: `https://veximtrade.com/supplier/register`.
- Canonical, OG URL, WebPage, breadcrumb, Service và sitemap dùng URL thực tế trên Vexim Global. Không tự khai canonical trỏ tới `/nha-cung-cap` trên một domain chưa triển khai.
- Organization Vexim Trade liên kết pháp nhân mẹ Vexim Global. WebSite mô tả host Vexim Global thực tế; dịch vụ/nhãn hiệu là Vexim Trade. `@id` dịch vụ giữ ổn định giữa homepage và landing.
- Không dựng trang đăng ký, cổng nhà cung cấp hoặc bản tiếng Anh. Chưa thêm hreflang khi bản tiếng Anh chưa tồn tại.
- FSVP vẫn là ô riêng, không bị thay. Giao diện FDA chính và các ô dịch vụ khác không được thiết kế lại.

## Lần thiết kế lại theo hướng tối giản cao cấp

Theo yêu cầu tiếp theo của chủ website, giao diện đã chuyển sang ngôn ngữ thiết kế lấy cảm hứng từ trang giới thiệu sản phẩm Apple, không sao chép logo/tài sản của Apple:

- Hero căn giữa, tiêu đề hai tông lớn, khoảng trắng rộng, CTA dạng pill, thanh điều hướng kính mờ. Be Vietnam Pro vẫn là font địa phương tự host.
- Ảnh hạt điều làm sân khấu sản phẩm; hồ sơ HTML nổi trên ảnh. Các tính năng là thẻ nhẹ, khối xác minh bo lớn, khối cam kết tối và CTA cuối tối giản.
- Ba ảnh hạt điều, hồ tiêu, quế/hồi là **ảnh minh họa do AI tạo**, không phải ảnh sản phẩm thật của nhà cung cấp và không dùng để chứng minh xác minh. Có chú thích ngay dưới hero.
- Ảnh trang/ô dịch vụ đều là WebP, tạo bằng Sharp; không đưa PNG nguồn nặng vào Git. Ảnh lớn nhất khoảng **47 KiB**, ảnh danh mục **8–21 KiB**, ảnh ô dịch vụ khoảng **14 KiB**. Manifest nằm trong `lib/vexim-trade-assets.ts`.
- `srcset` 480/800px cho danh mục và 960/1536px cho hero, `sizes`, width/height và lazy loading có sẵn; mỗi file có hash và cache immutable một năm. Thử nghiệm kiểm tra chữ ký RIFF/WEBP, hash và dung lượng.
- OG dùng ảnh/thiết kế mới, vẫn **PNG 1200×630 khoảng 90 KiB** để tương thích chia sẻ mạng xã hội. OG không tải trong lượt đọc trang bình thường.
- Không thêm thư viện animation, parallax, video, slideshow hay JavaScript nặng. Nội dung, CTA đăng ký/UTM, schema và các giới hạn nghiệp vụ không đổi.

## Nội dung và tài sản cần duyệt

Chưa có link Canvas; chủ website cho phép dựng theo đặc tả và đề xuất phần còn thiếu. Các câu đã cung cấp được giữ nguyên. Những đoạn bổ sung ở phần vấn đề, tính năng, xác minh, hai cam kết và bốn bước là **bản biên tập đề xuất**, không phải bản thiết kế đã đối chiếu hoặc bằng chứng về hệ thống đang vận hành.

- Chỉ hiển thị **hai** cam kết. Câu thứ ba về bán thứ hạng chưa được phép nên không xuất hiện.
- Hồ sơ hạt điều được ghi rõ minh họa, không phải doanh nghiệp thật; “Gửi yêu cầu báo giá” trong hình là `span`, không phải CTA, không nhận focus.
- Logo lá cây, ảnh minh họa AI và OG là tài sản cho bản dựng, không phải ảnh nhà máy/chứng từ/khách hàng được xác minh. Không sử dụng ảnh stock thay tài liệu của chủ website.
- Pháp nhân/địa chỉ/điện thoại/email trên landing lấy từ cấu hình Trade theo văn bản mới, khớp từng chữ với graph Trade. Footer website chính giữ thông tin đã được duyệt trước đó. Cần chủ website xác nhận lại pháp nhân và cách viết địa chỉ trước công bố chính thức.
- **Chưa có URL chính sách bảo mật và điều khoản.** Hai nhãn đang là văn bản, không tạo liên kết giả hoặc đưa ra chính sách pháp lý tự soạn. Bổ sung URL đã xác nhận tại `TRADE.privacy` và `TRADE.terms` trước mở quảng bá.
- Chưa có URL danh mục công khai được xác nhận: tiêu đề danh mục chưa là link, vì vậy chưa có `category_click` thực tế. Khi thêm `href` hợp lệ trong cấu hình, renderer tự tạo link và sự kiện tương ứng. Hiện chỉ cho phép URL HTTPS cùng origin `https://veximtrade.com`.
- Không đặt giá/phí, review, aggregateRating, số nhà cung cấp, số đơn hàng, huy hiệu chứng nhận sản phẩm hoặc lời hứa thứ hạng. Cần bộ phận kinh doanh xác nhận phạm vi xác minh, cơ chế hiển thị và giới hạn tiếp nhận hồ sơ trước phát hành.

## Kiến trúc

- `app/services/export-sales/route.ts`: trả **toàn bộ HTML từ server**, status 200, không dùng hydration. Đây là Route Handler tài liệu, không phải API và không phát ra React Server Component payload.
- `lib/vexim-trade-page.ts`: renderer, escape HTML, schema, kiểm tra link danh mục và bảo toàn UTM.
- `lib/vexim-trade-content.ts`: nội dung, liên hệ, danh mục, ngày sửa. UI, số lượng, mô tả danh mục và OfferCatalog đọc cùng nguồn; test bổ sung thử danh mục thứ tư mà không sửa renderer.
- `lib/vexim-trade-styles.ts`: CSS quan trọng inline, token màu trên `:root`, responsive, focus, reduced motion.
- `lib/vexim-trade-assets.ts`: tên file font/JS có content hash; font Be Vietnam Pro 400/500/600/700 chỉ subset latin/vietnamese. Fontsource 5.2.7; giấy phép OFL đi kèm `public/trade/fonts/OFL.txt`.
- `public/trade/`: font WOFF2, SVG logo, WebP ảnh sản phẩm/ô dịch vụ, PNG OG 1200×630 dưới 300 KB, Apple touch icon, JS nhỏ có content hash. JS không phải phụ thuộc React/framework.
- `components/service-link.tsx`: đường dẫn Trade dùng `a` thật, tránh Next client router cố tải tài liệu HTML dưới dạng RSC. Các đường dẫn dịch vụ khác vẫn dùng Next Link như trước. Đã áp dụng cho card trang chủ và link liên quan trong blog.
- Middleware bỏ qua refresh phiên Supabase cho tài liệu/asset công khai này: không phụ thuộc đăng nhập và không tạo cookie phiên cho HTML cache công khai.
- Trang có 9 khối: header, bảy section trong main, footer. Header sticky không quá 72px; menu mobile dùng `details/summary` native, vẫn hoạt động khi tắt JS. Khi có JS, `aria-expanded` được đồng bộ và Escape đóng menu.
- Alias `/services/fda-label-check` trước đây re-export trang sales đã bị thay. Nay redirect 308 tới trang nhãn có sẵn `/services/food/label-compliance`; loại alias redirect khỏi sitemap. Không sửa nội dung giao diện FDA chính.

### Cache và chuẩn hóa URL

HTML đặt `Cache-Control: public, max-age=600, s-maxage=600`. Không đọc cookie hoặc cá nhân hóa nội dung; UTM chỉ đưa vào URL CTA, không đưa vào analytics event. CDN/proxy **không được bỏ query khỏi cache key** khi cache HTML có UTM.

Font/JS/WebP có hash được cấu hình cache một năm, immutable. Nếu sửa bytes của asset có hash, phải đổi hash trong tên và cập nhật manifest. CSS inline đổi cùng HTML, không có file CSS blocking riêng.

- URL viết hoa được middleware trả 301, giữ query.
- Chuyển non-www sang www giữ cấu hình 301 hiện có.
- Dấu slash cuối vẫn theo chuẩn **308 của Next.js hiện có**; chưa thay quy tắc toàn site chỉ vì một landing. Đây là khác biệt với yêu cầu 301 trong đặc tả domain Trade ban đầu.
- HTTPS và Brotli do hosting/CDN quản lý; cần xác nhận response thực tế sau deploy. Không tuyên bố đã cấu hình DNS/TLS/Brotli bằng việc sửa HTML.

## Đo lường

JS chỉ phục vụ đo lường và tăng cường menu native; cuộn mượt dùng CSS, tắt khi `prefers-reduced-motion`.

- `cta_register_click`: `position` = `header`, `hero`, `footer_cta`.
- `cta_learn_click`: không có dữ liệu cá nhân.
- `scroll_depth`: `percent` = 50, 90, mỗi mốc chỉ một lần trên mỗi lần tải tài liệu.
- `category_click`: `category` là key cấu hình, chỉ khi danh mục có link thực.

Ưu tiên `gtag` có sẵn; nếu không, dùng `va` (SDK Vercel Analytics hiện có của dự án); cuối cùng queue `dataLayer`. Không phát cùng sự kiện tới hai collector. Trên **Vercel production, không noindex**, script Vercel Analytics cùng origin được nạp sau hai animation frame; staging/dev không tải collector. Không tự tạo GA4 property, measurement ID hay cài GTM mới.

Bộ test mock SDK/collector, xác minh payload và thời điểm gắn script; **chưa xác nhận dashboard production, gói hỗ trợ custom events hoặc consent production**. Phải kiểm tra chúng trước dùng số liệu. Không đặt tên, email hoặc điện thoại vào UTM. Không có form thu thập lead hoặc tự tạo tài khoản trên landing.

Chỉ chuyển tiếp tham số tên `utm_*` hợp lệ (giới hạn độ dài), giữ nguyên giá trị qua URL encoding; không chuyển tiếp `email`, `next`, redirect URL tùy ý hoặc tham số khác. UTM được server đưa vào cả ba liên kết nên vẫn hoạt động khi tắt JS. Canonical không chứa query.

## Kiểm thử và kết quả cục bộ

```sh
npm run dev -- --hostname 0.0.0.0

SCHEMA_TEST_BASE_URL=http://127.0.0.1:3000 npm run test:trade
SCHEMA_TEST_BASE_URL=http://127.0.0.1:3000 npm run test:schema
SCHEMA_TEST_BASE_URL=http://127.0.0.1:3000 npm run test:fda
npm run test:emails
BROWSER_EXECUTABLE_PATH=/path/to/chromium npm run test:trade:browser

# Khi sửa schema/nội dung, tạo lại rồi review diff:
npm run schema:trade
npm run schema:export
```

- Test Trade: HTML không hydration; 1 H1; thứ bậc heading; 9 khối; 3 href thật; copy; UTM an toàn; các cặp tương phản ≥4.5; font, hash JS, ngân sách dung lượng gồm mọi biến thể WebP, OG PNG; graph có mọi @id tham chiếu được định nghĩa; category UI/schema cùng nguồn.
- Test SSR: status/cache/canonical, JSON-LD khớp bản xuất, asset 200, redirect viết hoa, alias nhãn, homepage card/ảnh mới, sitemap/ngày sửa thật, robots không chặn asset.
- Browser: 320/360/390/639/640/768/1023/1024/1440/1920px không tràn ngang; breakpoints đúng; Tab/skip link/menu/neo/sticky/Escape; font local; không tải Next JS; đọc và mở menu được khi tắt JS; UTM; sự kiện GA/Vercel mock và mốc scroll không trùng. Không tạo đăng ký thật.
- Ngân sách tài liệu + font + JS + **toàn bộ biến thể WebP** khoảng **311 KiB nén ước tính** (bảo thủ, tính cả ảnh ô dịch vụ trang chủ và các biến thể không tải đồng thời). Lighthouse local ghi nhận khoảng **229 KiB truyền tải** cho lượt đọc đầu. Chưa tính SDK analytics/toolbar do môi trường production/preview chèn.
- Lighthouse mobile cục bộ với Chromium 133: **Performance 100, Accessibility 100, Best Practices 100**, LCP **1,3 giây**, CLS **0**, TBT **70 ms** ở lượt đo cuối sau thiết kế lại; LCP element là H1. Đây là lab trên Next dev, không phải số liệu hiện trường hay cam kết mọi thiết bị.
- **SEO 69 trên staging/dev là chủ đích do meta + header noindex.** Các kiểm tra SEO khác đạt ở lần đo này; cần chạy lại Lighthouse trên production có index trước kết luận đạt SEO ≥90. Không tắt noindex staging chỉ để lấy điểm.
- INP thực tế chưa có dữ liệu hiện trường; TBT không thay thế INP. Cần theo dõi CrUX/RUM sau đủ traffic.
- `npm run build` hiện bị chặn ở `app/layout.tsx`: font Google của website chính không tải được trong môi trường hạn chế mạng. Landing Trade tự host font và không phụ thuộc request này. Chưa thể tuyên bố full production build đạt; TypeScript toàn repo còn lỗi ngoài phần Trade.

## Trước khi public/triển khai domain Trade

- [ ] Chủ website duyệt các đoạn copy bổ sung, logo/artwork, các cam kết và thông tin pháp nhân/địa chỉ.
- [ ] Cung cấp hai URL chính sách thực tế; chỉ thêm link danh mục khi trang đích đã public.
- [ ] Kiểm tra trang đăng ký Trade hoạt động, nhận UTM và có thông báo/chính sách dữ liệu thích hợp. Chưa kiểm tra đăng ký thật trên hệ thống bên ngoài.
- [ ] CI/build của toàn repo đạt trong môi trường triển khai; kiểm tra HTML, canonical/OG/schema/sitemap/cache/compression thực tế sau deploy.
- [ ] Staging giữ `noindex, nofollow` (dựa vào `VERCEL_ENV=preview`, dev hoặc `VEXIM_TRADE_NOINDEX=true`) và bật Deployment Protection/mật khẩu trong Vercel. Mã nguồn không tự bật mật khẩu hosting.
- [ ] Production xác nhận đúng môi trường, robots cho phép index, đo lại Lighthouse và dashboard analytics/custom events/consent.
- [ ] Nếu sau này chuyển sang `https://veximtrade.com/nha-cung-cap`, triển khai ở đúng repo/domain đó và cập nhật canonical/schema/asset/sitemap; lập kế hoạch redirect từ URL Vexim Global nếu chuyển hẳn. Chưa thực hiện đổi domain trong bản này.
- [ ] Chủ tài khoản gửi URL production qua Search Console; không coi schema hợp lệ là bảo đảm được Google lập chỉ mục.
