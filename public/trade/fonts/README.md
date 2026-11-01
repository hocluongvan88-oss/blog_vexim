# Inter cho Vexim Trade

- Nguồn: Inter, bản phát hành chính thức **v4.1** của [rsms/inter](https://github.com/rsms/inter/tree/v4.1).
- File nguồn: `docs/font-files/InterVariable.woff2` (352.240 byte).
- SHA-256 nguồn: `693b77d4f32ee9b8bfc995589b5fad5e99adf2832738661f5402f9978429a8e3`.
- Giấy phép SIL Open Font License 1.1: `OFL.txt`, lấy từ `LICENSE.txt` cùng bản phát hành. Không dùng font độc quyền của Apple.
- Một WOFF2 chứa Latin, Latin mở rộng, tiếng Việt và các dấu tổ hợp; hỗ trợ cả Unicode NFC và NFD. Trọng lượng biến thiên 100–900; optical size cố định 14 để dùng kiểu chữ text nhất quán. Không thêm package runtime hay request tới Google Fonts.
- File đầu ra: `inter-vietnamese-latin-variable.3642455776.woff2`, 127.828 byte. SHA-256: `36424557765bf4952444f1a7de2cd85158c9ac4cbb5db15801fdfd96dfd9b6d4`.

## Tạo lại

Dùng Python với `fonttools[woff]==4.67.0`, tải file nguồn và giấy phép qua GitHub API (không lưu bản đầy đủ vào Git):

```sh
curl -fsSL -H 'Accept: application/vnd.github.raw+json' \
  'https://api.github.com/repos/rsms/inter/contents/docs/font-files/InterVariable.woff2?ref=v4.1' \
  -o /tmp/InterVariable.woff2
fonttools varLib.instancer /tmp/InterVariable.woff2 opsz=14 \
  --output=/tmp/InterVariable-text.woff2
pyftsubset /tmp/InterVariable-text.woff2 \
  --output-file=/tmp/inter-vietnamese-latin-variable.woff2 --flavor=woff2 \
  --unicodes='U+0000-024F,U+0300-036F,U+1E00-1EFF,U+2000-206F,U+20A0-20CF,U+2113,U+2122,U+2191-2193,U+2212,U+2215,U+FEFF,U+FFFD' \
  '--layout-features=*' '--name-IDs=*' '--name-languages=*' \
  --notdef-glyph --notdef-outline --recommended-glyphs
```

Kiểm tra checksum nguồn trước khi tạo lại. Đổi tên đầu ra theo 10 ký tự đầu của SHA-256 và cập nhật `lib/vexim-trade-assets.ts` nếu byte thay đổi.

## Vì sao dùng một file?

Cấu hình cũ khai báo nhầm Latin thành Latin mở rộng, bỏ sót ASCII: trình duyệt trộn Be Vietnam Pro với font hệ thống. Một số subset dựng sẵn còn thiếu dấu tổ hợp U+0302, U+0306 và U+031B, khiến tiếng Việt dạng NFD rơi sang font dự phòng. Bản này lấy các glyph từ font gốc, giữ chung trong một file, khai báo đúng phạm vi Unicode và preload file đó.

`npm run test:trade` kiểm tra phạm vi ký tự, chữ ký WOFF2 và content hash. `npm run test:trade:browser` dùng Chrome DevTools Protocol kiểm tra **font thực sự vẽ glyph**, không chỉ `font-family`: tiêu đề, mô tả, ASCII, toàn bộ chữ Việt U+1EA0–1EF9 và dấu NFC/NFD đều phải dùng Inter, không trộn font hệ thống.
