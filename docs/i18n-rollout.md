# Lộ trình EN/VI cho trang chủ Vexim Global

## Phạm vi đã xuất bản

| Nội dung | Tiếng Anh | Tiếng Việt |
| --- | --- | --- |
| Trang chủ hạ tầng số | `/` | `/vi` |
| Thông báo dữ liệu của biểu mẫu đánh giá | `/privacy` | `/vi/privacy` |

Hai cặp URL có nội dung SSR riêng, canonical tự trỏ, `hreflang` hai chiều và `x-default` về bản tiếng Anh của **chính trang tương ứng**. Dropdown ở header trỏ sang bản tương ứng của đúng loại trang. Không dùng `?lang=vi`, tự động chuyển hướng theo IP/ngôn ngữ trình duyệt, hay dịch tự động trên client. Biểu mẫu đánh giá dùng chung endpoint; giao diện và bản nháp email được bản địa hóa. Thông báo dữ liệu chỉ mô tả **biểu mẫu đánh giá này**, không nhận là chính sách quyền riêng tư bao trùm toàn website.

`lib/locale-routes.ts` là danh sách duy nhất của **các cặp đã được xuất bản**. Nội dung dài của trang và metadata ở `lib/home-i18n.ts` (server); phần điều hướng và biểu mẫu ở `lib/home-client-i18n.ts` (client). Ba phạm vi B2B Launchpad, Global Growth Engine và Enterprise Dominance giữ nguyên tên sản phẩm ở cả hai ngôn ngữ. Mỗi homepage có WebPage/Service/ImageObject riêng, nhưng dùng cùng `Organization`/`LocalBusiness` và cùng thông tin liên hệ.

## Chưa nằm trong đợt này

Các URL dịch vụ pháp lý/quy định hiện có vẫn là tiếng Việt, **không** gắn dropdown hay `hreflang="en"`/English canonical giả. Blog, FDA tracker và trang độc lập Vexim Trade cũng không được mở thêm ngôn ngữ trong đợt này. Các liên kết tài nguyên ở footer tiếng Anh có nhãn “(Vietnamese)”; khu vực dịch vụ tuân thủ có ghi chú riêng rằng các trang đích hiện chỉ có tiếng Việt.

**Trước khi mở từng cặp dịch vụ:** biên tập viên và người phụ trách pháp lý duyệt toàn bộ nội dung, thuật ngữ và thông tin quy định hiện hành; xác nhận URL tiếng Anh thực sự hoạt động, canonical/OG/schema và điều khoản dịch vụ tương ứng; sau đó mới thêm cặp URL vào `LOCALIZED_PATHS`, sitemap/điều hướng của *riêng* trang đó, và kiểm tra SSR/SEO/đổi ngôn ngữ. Không sao chép dịch máy hoặc bật hàng loạt cho 24 URL trước khi duyệt.

## Kiểm tra trước khi triển khai

- `pnpm schema:export && pnpm test:schema` kiểm tra đồ thị EN/VI và JSON xuất ở `docs/seo/homepage-schema.json`, `docs/seo/homepage-schema-vi.json`. Có thể đặt `SCHEMA_TEST_BASE_URL` trỏ tới bản build chạy thật để so sánh HTML.
- Sau `pnpm build` và `pnpm start`, chạy `pnpm test:homepage` (đặt `BROWSER_EXECUTABLE_PATH` nếu có Chromium để chạy cả tương tác). Test bao gồm bốn URL, `hreflang`/sitemap, menu EN/VI, biểu mẫu EN/VI, 320–1920px, không tràn ngang và không CLS.
- Kiểm tra riêng `pnpm test:fda`, `pnpm test:trade` và các bài kiểm tra hiện có trước khi phát hành. Build/test cục bộ **không chứng minh** production đã triển khai; kiểm tra URL công khai và trạng thái deploy sau khi PR được merge.
