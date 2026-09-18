# Kiểm chứng nhanh module SEO của blog

Hai file `*.test.ts` dưới đây là harness chạy bằng `node` (không cần test runner).
Chúng bundle trực tiếp mã nguồn thật trong `lib/` nên kiểm tra đúng hành vi đang chạy:

- `anchors.test.ts` — sinh `id` cho heading, chống trùng, idempotent, mục lục khớp HTML,
  ảnh có `width/height` (chống CLS), alt không lọt thẻ HTML (18 điểm kiểm tra).
- `analysis.test.ts` — bộ chấm điểm SEO: bài "tốt" đạt điểm cao và không có lỗi,
  bài "yếu" bị cảnh báo đúng các nhóm (nguồn, FAQ, liên kết nội bộ, alt, ảnh bìa,
  trùng tiêu đề, bài cũ), mọi issue đều trỏ tới block để bấm "Sửa ngay" (24 điểm kiểm tra).

## Cách chạy (từ thư mục gốc dự án)

```bash
# 1. Heading/anchor + ảnh
npx esbuild scripts/verify-seo/anchors.test.ts --bundle --platform=node --format=cjs \
  --jsx=automatic --alias:@=. --outfile=/tmp/anchors.test.cjs && node /tmp/anchors.test.cjs

# 2. Bộ chấm điểm SEO
npx esbuild scripts/verify-seo/analysis.test.ts --bundle --platform=node --format=cjs \
  --jsx=automatic --alias:@=. --outfile=/tmp/analysis.test.cjs && node /tmp/analysis.test.cjs
```

Mỗi lần chạy in ra `PASS`/`FAIL` cho từng điểm và thoát với mã lỗi nếu có điểm trượt.
Nên chạy lại mỗi khi sửa `lib/seo-analysis.ts`, `lib/heading-anchors.ts`, `lib/blocks-to-html.tsx`.
