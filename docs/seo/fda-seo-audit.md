# Kiểm tra SEO và khả năng diễn giải nội dung trang FDA

Ngày kiểm tra: 15/10/2026. URL chính: https://www.veximglobal.com/services/fda.

## Kết luận

Nền tảng on-page SEO và liên kết thực thể trong JSON-LD đã rõ ràng trong code và HTML SSR local. Không phát hiện lỗi chặn index trong cấu hình được kiểm tra. Đây không phải chứng nhận đạt mọi tiêu chí SEO, không xác nhận Google đã index và không bảo đảm công cụ AI đề xuất Vexim.

Giao diện, banner và bố cục không thay đổi trong đợt kiểm tra này.

## Phạm vi kiểm chứng

- **Trang công khai:** công cụ đọc trang truy cập được nội dung mới, đủ section, hình ảnh Libra/logo và tám câu hỏi/câu trả lời. Robots công khai cho phép `/`, chặn các khu vực nội bộ, không chặn `/services/fda`. Sitemap công khai có URL FDA chuẩn www.
- **Code và HTTP/HTML SSR local:** kiểm tra raw HTML, canonical, robots meta, header X-Robots-Tag, JSON-LD, đồ thị tham chiếu, FAQ và đường dẫn ảnh/liên kết.
- **Chưa kiểm chứng:** raw JSON-LD/header production, kết quả Schema Markup Validator/Rich Results Test trực tuyến, URL Inspection/Search Console, Bing Webmaster Tools, Core Web Vitals thực tế, robots/CDN với từng bot và server log, mức độ được AI trích dẫn. Công cụ đọc trang công khai trả về nội dung đã trích xuất, không đủ để chứng minh raw JSON-LD production giống local.

## Các mục đạt trong HTML SSR local

| Hạng mục | Kết quả |
| --- | --- |
| HTTP trang | 200 |
| Title | Đăng ký FDA: Chi phí, hồ sơ & US Agent \| Vexim Global |
| Meta description | Riêng cho FDA, phù hợp nội dung; không nhồi dịch vụ khác |
| Canonical | `https://www.veximglobal.com/services/fda` |
| Robots | `index, follow`; không thấy X-Robots-Tag chặn index |
| Googlebot | Cho phép snippet, ảnh lớn và video preview theo metadata hiện tại |
| Ngôn ngữ, heading | `lang=vi`, một H1, các section H2/H3 rõ ràng |
| Chia sẻ | OG/Twitter riêng; ảnh 1200×630 có thật |
| Nội dung văn bản | Có trong SSR, không phải trang chỉ có ảnh hoặc chờ JavaScript mới có nội dung |
| Hỏi đáp | Tám FAQ hiển thị trùng chính xác với JSON-LD |
| Ảnh | Hero và 11 tư liệu/logo đều có alt, file và URL hợp lệ |
| Liên kết | Liên kết nội bộ được kiểm tra trả 200; anchor có đích |
| Doanh nghiệp | Email, số điện thoại và địa chỉ dùng cấu hình chung; kênh mạng xã hội public |
| Tính trung thực | Không có đánh giá, số sao, giá hoặc tỷ lệ thành công tự tạo |

## Schema đang có

Hai script JSON-LD trong HTML nhưng cùng một đồ thị liên kết bằng `@id` tuyệt đối:

```text
Organization / LocalBusiness (Vexim Global)
  ├── logo → ImageObject
  └── publisher của WebSite

WebPage (/services/fda)
  ├── isPartOf → WebSite
  ├── publisher → Organization
  ├── mainEntity / about → Service (đăng ký FDA & DUNS)
  │                         └── provider → Organization
  ├── breadcrumb → BreadcrumbList
  └── primaryImageOfPage → ImageObject (ảnh chia sẻ của trang)

FAQPage
  ├── isPartOf → WebPage
  ├── about → Service
  └── 8 Question / acceptedAnswer trùng phần FAQ hiển thị
```

- Organization chỉ định nghĩa một lần trên trang, không nhân đôi theo từng script.
- Service dùng cùng ID và dữ liệu với danh mục dịch vụ trang chủ.
- Kiểm tra tham chiếu không tìm thấy ID trùng hoặc ID chưa được định nghĩa.
- Không khai trực tiếp `availableLanguage`/`inLanguage` sai chỗ trên Service; ngôn ngữ trang nằm ở WebPage/FAQPage và hỗ trợ liên hệ nằm ở ContactPoint.
- Không xem tư liệu đăng ký do doanh nghiệp tải lên là bằng chứng FDA phê duyệt/chứng nhận chất lượng. Nội dung và FAQ phân biệt rõ đăng ký, phê duyệt và giấy xác nhận do đơn vị dịch vụ phát hành.

### Điểm đã sửa sau kiểm tra

Mô tả FDA Service trong danh mục chung trước đây ghi “gia hạn định kỳ 2 năm”, có thể bị hiểu thành hiệu lực tròn hai năm kể từ ngày đăng ký. Đã làm rõ:

> Cơ sở thuộc diện áp dụng gia hạn từ 01/10 đến 31/12 năm chẵn. Đăng ký không đồng nghĩa FDA phê duyệt sản phẩm.

Đã sinh lại bản schema xuất của trang chủ và FDA để đồng nhất. Thay đổi này không sửa giao diện.

## Khả năng xuất hiện trong câu trả lời AI

Theo tài liệu Google Search Central, trang muốn đủ điều kiện làm liên kết hỗ trợ trong AI Overviews/AI Mode phải được index và đủ điều kiện hiển thị snippet. SEO nền tảng vẫn áp dụng; không có schema đặc biệt bắt buộc dành riêng cho hai tính năng này.

Nguồn chính thức: https://developers.google.com/search/docs/appearance/ai-features

Cấu hình hiện tại giúp mô tả rõ Vexim là đơn vị cung cấp dịch vụ nào, nội dung hướng tới doanh nghiệp nào, có bằng chứng/case và kênh liên hệ gì. Tuy nhiên, schema không phải cơ chế mua ưu tiên hoặc bảo đảm một AI bất kỳ sẽ đề xuất doanh nghiệp. Không thêm `llms.txt`, bot-specific allow hoặc markup quảng cáo chỉ để tạo cảm giác đã “chuẩn AI”.

## Những việc nên kiểm tra tiếp trên hệ thống thật

1. URL Inspection trong Search Console: Google-selected canonical, trạng thái index, lần crawl gần nhất và HTML đã render. Kiểm tra thêm trong Bing Webmaster Tools nếu sử dụng.
2. Chạy Schema Markup Validator cho URL production để đối chiếu triển khai thực tế. Rich Results Test không phải bộ xác nhận mọi loại Schema.org, và schema đúng không đảm bảo rich result.
3. Đo Core Web Vitals/PageSpeed trên production; chưa đủ cơ sở kết luận chỉ từ kiểm tra responsive.
4. Xác định vai trò của `https://fda.veximglobal.com/` so với trang chính. Hai trang có nhiều section gần nhau; cần kiểm tra canonical/redirect của subdomain trước khi quyết định hợp nhất. Không tự sửa site khác hoặc khẳng định đã có lỗi canonical khi chưa kiểm chứng.
5. Tăng độ tin cậy nội dung bằng người phụ trách chuyên môn, lịch rà soát thực tế, phạm vi/báo giá có căn cứ và các nguồn độc lập khi có. Không tự thêm tác giả, chứng chỉ, đánh giá hoặc ngày cập nhật giả.
6. Theo dõi lượt crawl, truy vấn, referral và khách hàng thực tế; không dùng vài câu hỏi thử với chatbot để kết luận độ phủ AI ổn định.

## Kiểm thử

```sh
npm run schema:export
npm run schema:fda
SCHEMA_TEST_BASE_URL=http://127.0.0.1:3000 npm run test:fda
SCHEMA_TEST_BASE_URL=http://127.0.0.1:3000 npm run test:schema
git diff --check
```

Đều pass trong lần kiểm tra này. Bộ kiểm tra FDA đã bổ sung regression cho robots meta/header, URL trong sitemap, robots.txt và cách mô tả kỳ gia hạn trong schema.
