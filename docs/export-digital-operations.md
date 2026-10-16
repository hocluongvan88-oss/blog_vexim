# Vexim Export Digital — triển khai và vận hành

## Phạm vi

- Landing: `/services/export-digital`.
- Bài đọc sau đăng ký: `/services/export-digital/goc-nhin-buyer`.
- API Node.js: `POST /api/export-digital-assessment`.
- Mục tiêu duy nhất: yêu cầu miễn phí báo cáo **“Buyer và AI nhìn thấy gì về bạn”**, chuyên viên gửi trong **2 ngày làm việc**, không cam kết mua dịch vụ.
- Form chi tiết: website hoặc “Chưa có website”; doanh nghiệp, sản phẩm, ít nhất một thị trường, người liên hệ, điện thoại/Zalo bắt buộc. Email và kênh xuất khẩu không bắt buộc.
- Checklist nỗi đau chỉ nằm trong bộ nhớ trình duyệt; không gửi vào form hay analytics.
- Không tích hợp Growth, không tạo dự án/CRM, không tự xuất PDF, không gửi email xác nhận tới khách. Không có lịch đặt hẹn tự động; hẹn trao đổi qua Zalo.

## Biến môi trường phía server

Cấu hình trong secret manager của môi trường triển khai, không đưa mật khẩu vào Git hoặc biến `NEXT_PUBLIC_*`:

| Biến                          | Ý nghĩa                                                                                  |
| ----------------------------- | ---------------------------------------------------------------------------------------- |
| `MAIL_USERNAME`               | Tài khoản SMTP, bắt buộc                                                                 |
| `MAIL_PASSWORD`               | Mật khẩu/app password SMTP, bắt buộc                                                     |
| `MAIL_HOST`                   | Mặc định `smtp.zoho.com`; dùng host thực tế của tài khoản                                |
| `MAIL_PORT`                   | Mặc định `587` (STARTTLS); `465` dùng TLS ngay khi kết nối                               |
| `MAIL_FROM_ADDRESS`           | Địa chỉ gửi được SMTP cho phép; mặc định `MAIL_USERNAME`                                 |
| `MAIL_FROM_NAME`              | Mặc định `Vexim Export Digital`                                                          |
| `EXPORT_DIGITAL_NOTIFY_EMAIL` | Hộp thư nhận yêu cầu dành riêng cho dịch vụ; nên đặt một hộp thư được phân công theo dõi |
| `ADMIN_EMAIL`                 | Hộp thư dự phòng nếu không có biến nhận riêng                                            |

Thứ tự chọn người nhận: `EXPORT_DIGITAL_NOTIFY_EMAIL` → `ADMIN_EMAIL` → `MAIL_USERNAME`. Nên dùng **một hộp thư hoặc alias nhóm** có người phụ trách; nếu dùng danh sách nhiều người nhận, phản hồi thành công chỉ chứng minh SMTP chấp nhận ít nhất một địa chỉ, không chứng minh tất cả nhận được.

Reply-To dùng email khách nếu khách cung cấp; nếu không, dùng email công khai của Vexim. Chuyên viên liên hệ qua điện thoại/Zalo trong trường hợp không có email. Template HTML escape dữ liệu khách, có cả bản text và mã yêu cầu.

API chỉ trả `202`/`success: true` sau khi SMTP báo có địa chỉ được chấp nhận. Thiếu cấu hình, lỗi SMTP hoặc không có người nhận được chấp nhận trả `503`; form giữ dữ liệu để thử lại hoặc liên hệ Zalo. **SMTP chấp nhận không đồng nghĩa đã vào inbox**; cần theo dõi bounce/spam và SPF, DKIM, DMARC tại nhà cung cấp.

## Quy trình thủ công sau khi nhận email

1. Phân công người trực hộp thư, ghi nhận mã yêu cầu và thời hạn 2 ngày làm việc vào công cụ nội bộ đã được doanh nghiệp phê duyệt. Không chuyển dữ liệu sang công cụ bên thứ ba chưa được phép.
2. Kiểm tra thông tin và liên hệ đúng người gửi; API **không** tự xác minh quyền sở hữu website hay số điện thoại.
3. Đánh giá website/hiện diện theo sáu tiêu chí trên landing: nguồn gốc, con người, quy trình, bằng chứng, năng lực, hợp tác. Nếu chưa có website, đánh giá tài liệu/hiện diện hiện có, không bịa điểm số hoặc kết quả tìm kiếm.
4. Chuyên viên lập báo cáo; tách quan sát thực tế, thời điểm kiểm tra và đề xuất. Không hứa thứ hạng Google/AI, số đơn hàng hay phê duyệt pháp lý. Báo cáo không thay thế tư vấn tuân thủ cho từng sản phẩm/thị trường.
5. Gửi báo cáo qua Zalo hoặc email được cung cấp trong 2 ngày làm việc; đề xuất cuộc trao đổi 20 phút nếu khách muốn. Không tự đăng ký khách vào chiến dịch tiếp thị.
6. Xử lý yêu cầu sửa/xóa dữ liệu qua kênh liên hệ Vexim; phân quyền và thời hạn lưu giữ hộp thư/công cụ nội bộ theo chính sách thực tế. Landing không triển khai cơ sở dữ liệu lead mới.

## Bảo vệ và giới hạn cần biết

- JSON tối đa 16.000 byte, kiểm tra schema cả client/server, honeypot, kiểm tra Origin cùng host khi có header. Website chỉ được chuẩn hóa và ghi vào email; API không fetch/crawl URL khách.
- Giới hạn 5 yêu cầu mới/giờ theo hash IP và chống gửi trùng theo IP + UUID + nội dung trong 1 giờ **chỉ nằm trong bộ nhớ từng tiến trình** (tối đa khoảng 10.000 mục mỗi map). Không bền vững qua restart/deploy, không chia sẻ giữa instance, có thể ảnh hưởng người cùng IP.
- Client tái sử dụng UUID khi thử lại; lỗi cho phép thử lại. Không đảm bảo exactly-once: mất phản hồi sau khi SMTP nhận hoặc đổi instance có thể tạo email trùng. Nhân viên đối chiếu mã yêu cầu trước khi xử lý.
- Trước khi quảng bá lớn/chạy nhiều instance: bổ sung rate limit ở edge/WAF hoặc kho dùng chung; chuẩn hóa proxy header đáng tin cậy và hạn chế truy cập trực tiếp origin. Origin/header IP không phải cơ chế xác thực hoặc chống bot hoàn chỉnh.
- Không log toàn bộ payload/email/điện thoại. Log lỗi SMTP hiện chỉ là thông báo tổng quát. Không đưa ảnh báo cáo thật hay dữ liệu lead vào Git, screenshot công khai hoặc bộ test.

## Analytics và bằng chứng

Các event: `assessment_cta_click`, `assessment_form_start`, `generate_lead`, `zalo_click`, với nhãn cố định `form_id`, `service`, `source`. Không gửi tên, email, điện thoại, website, lựa chọn thị trường hoặc checklist. `generate_lead` chỉ phát sau phản hồi API thành công.

Đây là điểm nối tới `gtag`/`dataLayer` sẵn có, **không tự cài GA4/GTM**. Kiểm tra cấu hình, tránh nhân đôi nếu cả hai được cài, kiểm tra consent và DebugView trên môi trường thật trước khi dùng làm số liệu. Bộ test mock analytics không chứng minh GA4 production đã nhận event.

Mục tiêu chuyển đổi ≥3%, tỷ lệ nhận cuộc gọi ≥30% và hợp đồng theo tháng chỉ là đề xuất KPI nội bộ, không phải thành tích đã đạt. Không công bố số liệu nếu chưa đo/xác minh.

Google/AI trong hero và câu chuyện hạt điều được ghi rõ minh họa, không phải khách hàng/kết quả thật. Chưa có case study, logo, testimonial hoặc PDF mẫu đã được phép công khai nên không hiển thị phần bằng chứng đó. Chủ website cung cấp tư liệu thật trước khi bổ sung.

## Kiểm thử kỹ thuật

```sh
# Một terminal: dev server chấp nhận preview proxy
npm run dev -- --hostname 0.0.0.0

# Terminal khác: schema/API mock/email/SSR/link/sitemap
SCHEMA_TEST_BASE_URL=http://127.0.0.1:3000 npm run test:export-digital
SCHEMA_TEST_BASE_URL=http://127.0.0.1:3000 npm run test:fda
SCHEMA_TEST_BASE_URL=http://127.0.0.1:3000 npm run test:schema
npm run test:emails

# Chromium cài trên máy; đường dẫn phải trỏ tới executable thực tế
BROWSER_EXECUTABLE_PATH=/path/to/chromium npm run test:export-digital:browser

# Chỉ chạy khi nội dung/schema đã thay đổi, sau đó review diff
SCHEMA_TEST_BASE_URL=http://127.0.0.1:3000 npm run schema:export-digital
```

Browser suite kiểm tra 320/390/768/1440px, overflow, CTA/sticky, checklist, bàn phím/FAQ, validation, không có website/email, nhiều lựa chọn, lỗi/retry, chống click lặp, success/focus và analytics không PII. API và analytics được mock; **không gửi lead/email thật**.

Schema artifact: `docs/seo/export-digital-schema.json`, bao gồm graph dùng chung và landing. Test kiểm tra tham chiếu ID, 8 FAQ khớp nội dung SSR, metadata/canonical/OG và không có đánh giá/giá bịa đặt. Schema đúng không đảm bảo index, rich result hay được AI đề xuất.

## Checklist trước khi mở quảng bá

- [ ] CI/build production của toàn repo chạy được; xử lý lỗi nền của repo nếu pipeline yêu cầu. Kiểm tra TypeScript toàn repo hiện còn lỗi ở các phần ngoài Export Digital; không coi test riêng là full build đạt.
- [ ] Cấu hình SMTP và hộp thư người nhận; gửi một lead thử có sự đồng ý, kiểm tra inbox/spam/bounce, Reply-To và bản mobile của email. Chưa có kiểm thử SMTP thật trong phiên triển khai này.
- [ ] Xác minh công khai `/services/export-digital`, bài đọc, OG, sitemap, canonical và JSON-LD sau deploy. Push Git không phải bằng chứng deploy production thành công.
- [ ] Đảm bảo người trực hộp thư và năng lực gửi báo cáo trong 2 ngày làm việc; thử quy trình cả trường hợp không có email/website.
- [ ] Kiểm tra rate limit/forwarded headers theo kiến trúc hosting, bảo vệ chống spam trước khi tăng traffic.
- [ ] Kiểm tra analytics/consent thật nếu sẽ đo KPI, không gửi dữ liệu cá nhân vào analytics.
- [ ] Không mở mục bằng chứng hoặc thêm ảnh khách trước khi có tài liệu thật và quyền công bố.
