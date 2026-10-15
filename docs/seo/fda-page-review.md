# Trang `/services/fda`: SEO, nội dung và chuyển đổi

## Phạm vi

Giữ H1 “Đăng ký FDA”, bố cục hero hai cột và thứ tự các khối cũ: lợi ích, nhóm sản phẩm, quy trình 5 bước, lý do chọn Vexim và CTA cuối trang. Bổ sung bảng chi phí/thời gian sau quy trình, case Libra ở khối năng lực và FAQ/nguồn FDA trước CTA.

Không sửa source của `fda.veximglobal.com`. Không tái sử dụng ảnh N&P cho Libra và không tự tạo tư liệu khách hàng.

## Những gì đã cập nhật

- Metadata riêng: title, description, canonical www, Open Graph locale/title/description/image/alt, Twitter card/title/description/image/alt.
- Ảnh chia sẻ thật `public/images/og-fda.png`, 1200×630, khoảng 28KB; chỉ dùng logo Vexim, không có logo FDA hoặc ảnh khách hàng giả.
- Một H1, main landmark, breadcrumb điều hướng, heading có ngữ cảnh, alt ảnh minh họa, sizes/priority cho ảnh đầu trang.
- 6 nhóm sản phẩm vẫn giữ dạng card nhưng làm rõ nghĩa vụ không giống nhau, không khẳng định mọi sản phẩm đều dùng Food Facility Registration.
- Sửa kỳ gia hạn cơ sở thực phẩm thành 01/10–31/12 năm chẵn; phân biệt đăng ký với phê duyệt/chứng nhận; không nói số đăng ký phải được in trên nhãn.
- Bỏ 98%, 500+, kinh nghiệm 10+ năm và các thời gian áp dụng chung chưa có dữ liệu đối chiếu. Không thêm giá hoặc cam kết hoàn tất thay thế.
- Chi phí: báo theo phạm vi, phân biệt phí đăng ký cơ sở thực phẩm của FDA với phí dịch vụ/US Agent; không tự công bố thuế hoặc giá.
- Case: dùng đúng **CÔNG TY TNHH LIBRA VIỆT NAM**, chỉ trình bày phạm vi đăng ký đã công bố, dẫn hồ sơ năng lực; không bảo đảm thông quan hoặc sao chép số liệu so sánh đối thủ.
- 6 FAQ dùng chung dữ liệu với schema, hiển thị server-side trong `<details>`.
- Thay nút tải tài liệu chưa có file bằng link hướng dẫn chính thức của FDA, không tạo PDF giả.

## Schema

Layout tiếp tục xuất Organization/LocalBusiness, Logo và WebSite một lần. Trang FDA xuất một graph gồm:

1. WebPage, nối về WebSite và Service.
2. Service với `@id` giữ nguyên như danh mục trang chủ.
3. BreadcrumbList (Trang chủ → Đăng ký FDA).
4. ImageObject cho ảnh chia sẻ.
5. FAQPage, đúng 6 câu hỏi/câu trả lời đang hiển thị.

Bản gộp để kiểm tra: `docs/seo/fda-schema.json`. **Không chèn thêm file này vào app**, vì app đã tự xuất JSON-LD. Không có Review, AggregateRating, giá hay thời hạn xử lý giả.

FAQPage mô tả nội dung hỏi đáp, không phải cam kết Google sẽ hiển thị FAQ rich results hoặc cải thiện thứ hạng.

## Form và sự kiện

`ConsultationDialog` dùng một form chung, hỗ trợ cả `trigger`, `children` và chế độ controlled; dùng Radix DialogTrigger để hỗ trợ bàn phím/focus. Field IDs dùng `useId`, dịch vụ FDA được chọn sẵn cho hai CTA của trang.

- `consultation_open`: mở CTA.
- `generate_lead`: chỉ sau response thành công và `success: true` từ API.
- Chỉ gửi form_name/source/service trong danh sách mã cho phép, không gửi tên, email, điện thoại hoặc mô tả sản phẩm cho analytics.
- Dùng `window.gtag` hoặc dataLayer đã có. **Chưa tự cài GA4/GTM hoặc xác minh tài khoản production**. Nếu chưa có cấu hình, form vẫn hoạt động và không phát sinh request analytics từ helper.
- Nguồn CTA: `fda_hero`, `fda_final_cta`.

## Kiểm tra lại

```sh
npm run schema:fda
SCHEMA_TEST_BASE_URL=http://127.0.0.1:3000 npm run test:fda
SCHEMA_TEST_BASE_URL=http://127.0.0.1:3000 npm run test:schema
npm run test:emails
```

Browser test (Chromium cài sẵn, dùng API/analytics mô phỏng, không gửi email thật):

```sh
BROWSER_EXECUTABLE_PATH=/path/to/chromium npm run test:fda:browser
```

Đã kiểm tra 320/390/768/1440px không tràn ngang trang, ảnh tải được; CTA bằng bàn phím; form chọn sẵn FDA; lỗi gửi giữ dữ liệu và không đếm lead; retry thành công đếm một lần; không có PII trong event; focus trở về CTA; Escape/FAQ hoạt động; luồng children và header controlled ở trang US Agent vẫn mở được.

TypeScript toàn repo vẫn có lỗi tồn tại ở các khu vực khác. Không có lỗi trong page FDA, các module nội dung/schema FDA, dialog và helper conversion sau thay đổi này. Chưa kiểm thử SMTP thật, GA4 production hoặc Rich Results Test trực tuyến. Chưa chạy full build trong sandbox do phụ thuộc tải Google Fonts.

## Chờ chủ website bổ sung

1. Ảnh nhà máy, xác nhận đăng ký và chứng từ Libra; gửi tên file trong `public/`. Chỉ công bố sau khi kiểm tra đúng doanh nghiệp, quyền sử dụng và che dữ liệu nhạy cảm.
2. Phạm vi cụ thể của báo giá và thời gian thực tế từng dịch vụ, nếu muốn công khai con số.
3. Cách tính/mốc thời gian cho tỷ lệ thành công và số khách hàng trước khi đưa lại vào nội dung.
4. Cấu hình analytics đang dùng để xác minh dữ liệu chuyển đổi production; không cung cấp mật khẩu/token trong chat.
