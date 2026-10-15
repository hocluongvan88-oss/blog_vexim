# Email Vexim Global

## Nguồn nội dung chung

- `lib/business-profile.ts`: `BRAND_SLOGAN` (Tử Tế - Tận Tâm - Trách Nhiệm), email `.com`, hotline, địa chỉ và giờ làm việc.
- `lib/email-layout.ts`: HTML shell dùng table và inline styles; nền trung tính, điểm nhấn navy; hỗ trợ `prefers-color-scheme: dark` trong Apple Mail và bố cục mobile. Không dùng gradient, webfont hoặc ảnh để hiển thị nội dung chính.
- Bốn module template: `email-templates.tsx` (FDA Tracker), `email-consultation.tsx`, `email-gacc.tsx`, `email-fda-registration.tsx`.
- Dữ liệu khách hàng/FDA được escape trước khi chèn HTML. CTA chỉ chấp nhận URL HTTP(S).

## Tạo preview và kiểm thử

```sh
npm run preview:emails
npm run test:emails
```

Mở `/email-preview/index.html` trên dev server để xem 10 mẫu. Chọn độ rộng 320/375/390/430px; thay đổi chế độ sáng/tối của hệ thống hoặc trình duyệt. Dữ liệu và token trong preview chỉ là minh họa, không phải thông báo FDA thật.

Bộ test không gọi DB/SMTP thật: kiểm tra template, dữ liệu độc hại, link xác nhận, trả kết quả gửi thư, trạng thái API xác nhận và hủy đăng ký bằng mocks.

Đã kiểm tra thêm bằng Chromium: 10 mẫu × 5 độ rộng (320, 375, 390, 430, 768) × sáng/tối = 100 lượt render, không tràn ngang; CTA cao tối thiểu 44px. Đã kiểm tra UI hủy đăng ký chỉ gửi DELETE sau thao tác xác nhận (mock API).

**Chưa kiểm thử trên Apple Mail/Gmail iPhone thật hoặc gửi thư qua SMTP production.** Chromium không mô phỏng thuật toán đổi màu của mọi email client.

## Kiểm tra trước khi triển khai

1. Kiểm tra `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM_ADDRESS`, `MAIL_FROM_NAME`; địa chỉ gửi phải được nhà cung cấp email cho phép. Không tự đổi biến môi trường hay DNS qua sửa template.
2. Đặt `NEXT_PUBLIC_BASE_URL=https://www.veximglobal.com`. Resend dự phòng dùng `FROM_EMAIL` nếu đã cấu hình.
3. Gửi một đăng ký tư vấn và một đăng ký FDA bằng địa chỉ thử nghiệm được chủ hộp thư đồng ý. Kiểm tra Apple Mail và Gmail trên iPhone ở cả hai chế độ, bật cỡ chữ lớn, thử link/nút và reply.
4. Kiểm tra xác nhận FDA có hạn 24h, trạng thái hết hạn và gửi lại. API đăng ký trả 503 nếu email xác nhận không được gửi, không báo thành công giả.
5. Link hủy mở `/fda-tracker/unsubscribe`; chỉ khi người dùng xác nhận mới gọi DELETE. Link không hợp lệ không được báo hủy thành công hay gửi email xác nhận hủy tới địa chỉ tùy ý.
6. Template `.com`/Reply-To không tự đảm bảo SPF, DKIM, DMARC hoặc inbox placement. Cần kiểm tra trên tên miền/nhà cung cấp gửi thực tế.
