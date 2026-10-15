# Xây lại trang `/services/fda` theo landing FDA

Cập nhật: 15/10/2026.

## Phạm vi và giao diện

**Thay toàn bộ nội dung/bố cục cũ của `/services/fda`**, không phải bổ sung vài section SEO. Dựng lại theo thứ tự và các khối nội dung của `https://fda.veximglobal.com/`, với những điều chỉnh chủ website yêu cầu:

- Hero dùng ảnh cảng container có sẵn trong repo (`public/china-customs-port-container-shipping-trade.jpg`), phủ tối để đọc chữ; không dùng nền xanh đặc.
- Dùng màu thương hiệu sẵn có của website chính: navy `#0b2545`, sky `#0284c7`, nền xanh nhạt `#e8f1fa`, CTA amber `#f59e0b`. Giữ Header/Footer chung của website chính.
- Bỏ toàn bộ chiến dịch giảm 20%: không topbar khuyến mãi, không câu quảng cáo, không nút nhận ưu đãi ở cả hai form.
- Không sửa source hoặc triển khai riêng cho subdomain FDA. Bố cục được dựng lại từ trang tham chiếu công khai; không khẳng định sao chép chính xác từng pixel.

Thứ tự section được kiểm thử:

1. Banner ảnh: headline, CTA, thông tin nổi bật + form tư vấn gọn bên phải (xếp dọc trên mobile).
2. Sáu nhóm doanh nghiệp cần rà soát nghĩa vụ đăng ký FDA: thực phẩm/đồ uống, đóng gói/lưu trữ thực phẩm, thức ăn động vật, mỹ phẩm, thiết bị y tế và dược phẩm. Giữ nguyên lưới sáu card và phong cách hiển thị; phân biệt thủ tục theo ngành và các trường hợp miễn.
3. Bốn lợi ích + dải nhóm sản phẩm.
4. Bảng so sánh ba cột, sáu tiêu chí + CTA.
5. Quy trình năm bước.
6. Hai khung hồ sơ / xác nhận đăng ký.
7. Hành trình Libra bốn bước, nội dung và ảnh xen kẽ trên desktop.
8. Dải đối tác.
9. Thông tin liên hệ + form đầy đủ.
10. Tám FAQ + liên kết nguồn FDA chính thức.

Anchor form cuối trang là `#fda-contact`, tránh trùng `#contact` của Footer dùng chung.

## Nội dung và ảnh đã được chủ website bổ sung

- Tên chính xác: **CÔNG TY TNHH LIBRA VIỆT NAM**.
- Không tải ảnh từ subdomain hoặc lấy hồ sơ N&P gắn cho Libra. Không tạo chứng nhận, mã đăng ký hay tài liệu khách hàng giả.
- Đã kết nối đủ 11 ảnh do chủ website tải lên `public/images/fda/` vào `FDA_LANDING_MEDIA`: hai hồ sơ, bốn ảnh Libra và năm logo đối tác. Đã chuyển các file có đuôi WebP/PNG sai định dạng về đúng định dạng; tài liệu dùng WebP lossless để giữ nguyên nội dung. Các hồ sơ đều mang tên Libra, không dùng hồ sơ N&P.
- Muốn thay ảnh, cập nhật file tương ứng hoặc đường dẫn trong cấu hình. Giữ `null` nếu cần tạm ẩn ảnh. Ảnh hồ sơ/case có liên kết mở ảnh đầy đủ; logo dùng object-contain để không bị cắt. Không tự chỉnh nội dung hoặc mốc hiệu lực trên giấy xác nhận do chủ website cung cấp. Logo Dann Food được tải lên có chữ Vieclam.tv; nên thay bằng logo gốc sạch khi có.
- Không sao chép các số liệu chưa chứng minh từ trang mẫu (200+ khách hàng, 99% thành công, tiết kiệm 40%, thời gian chung 2–5 ngày). Bảng so sánh dùng tiêu chí kiểm tra dịch vụ, không gán số liệu xấu cho đối thủ.
- Đăng ký không phải FDA phê duyệt/chứng nhận chất lượng. FDA không cấp chứng nhận đăng ký cơ sở thực phẩm; giấy xác nhận từ đơn vị dịch vụ phải phân biệt rõ. Gia hạn cơ sở thực phẩm thuộc diện áp dụng: 01/10–31/12 năm chẵn.
- Địa chỉ/email/điện thoại Việt Nam lấy từ cấu hình chung. Phần US Agent phân biệt Vexim Global LLC / EIN với doanh nghiệp Việt Nam / MST, không coi EIN là chứng nhận của FDA.

## SEO và schema

Giữ metadata riêng của trang: title, description, canonical `https://www.veximglobal.com/services/fda`, OG/Twitter và ảnh chia sẻ thật `public/images/og-fda.png` (1200×630, khoảng 28KB).

- Một H1, main landmark, breadcrumb, heading theo section, alt ảnh, ảnh hero priority/sizes.
- Layout xuất Organization/LocalBusiness, Logo và WebSite một lần.
- Page graph gồm WebPage, Service (cùng ID với danh mục dịch vụ), BreadcrumbList, ImageObject cho ảnh chia sẻ và FAQPage.
- Tám FAQ trong HTML SSR và schema lấy từ **cùng một mảng**, không hai bản chép tay khác nhau.
- Không có Review, AggregateRating, giá, khuyến mãi hoặc kết quả đăng ký giả trong schema.
- `docs/seo/fda-schema.json` là bản gộp để kiểm tra; **không chèn lại** file này vào app.
- FAQPage chỉ mô tả nội dung hỏi đáp, không hứa rich results hoặc thứ hạng tìm kiếm.

## Hai form inline

`components/fda/lead-form.tsx` thay các CTA mở modal cũ trên trang FDA, nhưng không thay đổi dialog dùng ở trang khác/Header.

- Hero: tên, điện thoại, email, loại sản phẩm bắt buộc.
- Cuối trang: thêm tên công ty bắt buộc và mô tả tùy chọn tối đa 500 ký tự, bộ đếm và nút xóa.
- Gửi endpoint thật `POST /api/consultation`, `service: "fda"`. Tên công ty được ghép vào mô tả để đi qua mẫu email hiện có.
- Native validation, nhãn/ID riêng cho hai form, honeypot, trạng thái đang gửi, lỗi/retry giữ dữ liệu, thành công và gửi mới. Không báo thành công nếu API lỗi, trả JSON không hợp lệ hoặc thiếu `success: true`.
- `form_start`: focus đầu tiên của mỗi lượt form. `generate_lead`: chỉ sau response thành công. Nguồn: `fda_hero`, `fda_contact`.
- Analytics chỉ có form_name/source/service; không gửi tên, email, số điện thoại, tên công ty, sản phẩm hoặc mô tả. Dùng gtag/dataLayer có sẵn, không tự cài GA4/GTM.

## Kiểm tra đã chạy

```sh
npm run schema:fda
SCHEMA_TEST_BASE_URL=http://127.0.0.1:3000 npm run test:fda
SCHEMA_TEST_BASE_URL=http://127.0.0.1:3000 npm run test:schema
npm run test:emails
LD_LIBRARY_PATH=/tmp/al2023/lib BROWSER_EXECUTABLE_PATH=/tmp/chromium npm run test:fda:browser
git diff --check
```

- SSR: đúng thứ tự 10 section, banner ảnh, hai form, tám FAQ/schema khớp, không ưu đãi giảm giá, không ID trùng, anchor có đích, liên kết nội bộ trả 200, ảnh OG hợp lệ và toàn bộ tham chiếu schema được giải quyết.
- Chromium: 320/390/768/1440px không tràn ngang trang, ảnh tải được. Đã xem screenshot desktop/mobile. Bảng rộng cuộn trong vùng riêng trên mobile.
- Form: required, hero lỗi/retry/thành công, hai form độc lập, reset, trường công ty trong payload, giới hạn/bộ đếm 500 ký tự, chặn gửi trùng khi đang chờ, lỗi mạng/JSON không hợp lệ/`success: false` không đếm lead, event lead đúng nguồn và không có PII.
- FAQ bằng bàn phím; không JavaScript page error. Dialog trigger và header controlled ở trang US Agent vẫn hoạt động.
- Schema toàn site và bộ kiểm tra email hiện có đều pass.

**Giới hạn kiểm chứng:** Browser test dùng API và analytics mô phỏng, không gửi email thật. Chưa kiểm tra SMTP, GA4/GTM hoặc triển khai production. `tsc --noEmit` toàn repo vẫn thất bại với lỗi ở các khu vực khác; không có lỗi được báo ở các file FDA page/form/content/schema/conversion vừa sửa. Không coi đây là full build thành công; sandbox có giới hạn tải Google Fonts.
