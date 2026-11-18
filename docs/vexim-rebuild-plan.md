# Kế hoạch xây dựng lại Vexim Global

Ngày lập: 2026-11-18. Căn cứ: 13 trang đã đọc trực tiếp (MONA, Agentcy PR, 6 trang Nhật,
5 trang Panasonic VN, LG Việt Nam) + khảo sát codebase hiện tại.

## 0. Trạng thái hiện tại của Vexim (khảo sát code)

| Hạng mục | Thực tế |
|---|---|
| Tổng số route | 53 `page.tsx` |
| Ngôn ngữ | `/` tiếng Việt (mặc định), `/en` tiếng Anh — **chỉ có 2 trang được dịch**: trang chủ và privacy |
| Trang dịch vụ | 12 nhóm viết tiếng Việt (`/services/fda`, `/gacc`, `/us-agent`, `/export-sales`, …) |
| Vexim Trade | **Không có route riêng** — chỉ là `/services/export-sales` render từ `renderTradePage()`; link ra ngoài `veximtrade.com` |
| Blog | Có, tiếng Việt, có category và slug |
| Landing page | 1 trang dài: hero → 4 trụ cột → dải ảnh → vấn đề phụ thuộc → 3 gói → tuân thủ → CTA |
| Ảnh | 15 ảnh stock + 4 hình vector tự vẽ, **không có ảnh chụp thật nào** |
| Số liệu | **Không có con số nào kiểm chứng được** ngoài "20 năm làm chứng từ" |
| Testimonial | **Không có** |
| Dữ liệu người mua | **Không có** (không phải sàn hai chiều thật, chưa có buyer account) |

### Ba lỗ hổng lớn nhất

1. **Không có bằng chứng.** Cả 13 trang đã đọc đều có ít nhất một dạng bằng chứng:
   MONA có Search Console thật, Panasonic có footnote Euromonitor, LG có 4.137 đánh giá
   sản phẩm, itochu có báo cáo tài chính PDF. Vexim không có gì.
2. **Hai người đọc khác nhau dùng chung một trang.** Nhà máy Việt muốn bán hàng;
   người mua quốc tế muốn tìm nhà cung cấp. Trang hiện tại viết cho nhà máy Việt, nhưng
   lại dùng tiếng Anh ở headline. Không phục vụ trọn ai.
3. **Vexim Trade không tồn tại như một sản phẩm trên site.** Người đọc được kể về "sàn B2B"
   nhưng không bấm vào đâu để xem sàn. Không có route, không có ảnh chụp, không có danh mục.

---

## 1. Đúc rút từ 4 nguồn

### LG Việt Nam — thương mại điện tử tối ưu chuyển đổi

LG là **cực đối lập** với mọi trang trước đó. Không kể chuyện thương hiệu ở trang chủ.
Trang chủ là một cỗ máy bán hàng:

- **7 banner carousel** đều có: tên chương trình, thời gian hiệu lực (`01.10 - 30.11.2026`),
  mức giảm cụ thể (`Giảm đến 56%`), giá trị quà tặng (`tới 51.000.000 VNĐ`), nút "Mua ngay".
- **Ma trận giá 4 tầng** — đây là điểm đáng học nhất về UX giá:

  ```
  Giảm 4.300.000 ₫
  15.690.000 ₫  ~~19.990.000 ₫~~        ← giá hiện tại, giá gốc gạch ngang
  Ưu đãi thành viên 15.376.200 ₫         ← giá thấp hơn cho member
  Chỉ 1.307.500₫/tháng (12 tháng) 0% lãi suất   ← quy ra tiền/tháng
  ```

  Bốn con số, bốn mức cam kết khác nhau, người mua tự chọn tầng mình muốn.

- **6 tab lọc nhu cầu** thay vì bộ lọc thông số:
  `Dành riêng cho bạn / Phổ biến nhất / Được đánh giá cao / Ưu đãi hot`.
  Đặt tên theo *trạng thái tâm lý người mua*, không theo thuộc tính sản phẩm.

- **Số đánh giá hiển thị ngay trên thẻ**: `(339)`, `(460)`, `(392)`.
- **8 lối vào hỗ trợ** đặt cuối trang, mỗi lối một kênh khác nhau: chat, Zalo, email,
  gọi, đăng ký sản phẩm, hỗ trợ đặt hàng, yêu cầu sửa chữa, chat trực tiếp.
- **"Thông báo có hàng"** — thu email khi hết hàng, kèm checkbox đồng ý điều khoản.
- Footnote `(*)` cho điều kiện áp dụng, luôn có.

**Điều LG thắng:** không nói một câu nào về thương hiệu, nhưng bán được. Vì mọi thứ đo được,
có thời hạn, có giá, có số người xác nhận.

**Điều LG đánh đổi:** trang chủ dài vô tận, không có câu chuyện, mệt mắt. Không phù hợp
với một công ty đang xây định vị.

### Panasonic VN — phân tầng người đọc

- Tách ba khối: Sản phẩm / Doanh nghiệp / Về chúng tôi, mỗi khối chân dung riêng.
- Claim mạnh nhất ("số 1 Nhật Bản") đặt trong lời CEO **kèm footnote** ghi nguồn, ấn bản,
  định nghĩa, đơn vị, năm dữ liệu.
- Trang chi tiết: H1 là lợi ích (`Giặt sạch hơn, giặt thông minh`), không phải mã model.
- Bộ lọc danh mục chia theo *việc người dùng quan tâm*: "Vệ sinh", "Thân thiện".
- FAQ 6 câu, viết như người dùng thật hỏi.

### Nhật thuần (itochu, keyence, freee, muratec, monotaro, goodpatch)

- **keyence:** thanh tìm kiếm đặt trên cùng, phân loại theo *loại tài liệu*
  (カタログ / 技術資料 / CAD / マニュアル). Người dùng đến để tải, không để đọc.
- **itochu:** trang chủ là thể chế — triết lý, lãnh đạo, tin tức, PDF tài chính.
- **freee:** hero một câu, một nút, sáu khối danh mục.
- **muratec:** câu ngắn xuống dòng có chủ ý, ảnh sản phẩm tách nền trắng.
- Chung: **mọi con số có mốc thời gian hoặc đơn vị**, không có số trần trụi.
- Chung: **màu tiết chế**, dùng để phân biệt chức năng, không để trang trí.

### MONA — bằng chứng thay lời

- Ảnh chụp thật có nhãn thời gian (`Search Console 12 tháng`, `Zalo OA 07/2026`).
- Poster số to: `100% từ khoá lên top sau 10 tháng`, `800% doanh thu sau 5 tháng`.
- Số vận hành theo ngày: `935.119 lượt xem`, `103 video`, `42 ngày`.
- Đối tác có **link xác minh thật** (thư OpenAI, hồ sơ Google Partner Finder).
- Nhưng: tím-vàng, linh vật gấu, ký tự `✦ _ ♥` — không dùng cho B2B quốc tế.

### Agentcy PR — giọng

- Tiêu đề là câu khẳng định, không phải danh từ ghép.
- Nói thẳng giới hạn của chính mình (`a person approves before anything is sent`).
- Không tính từ hoa mỹ.

---

## 2. Nguyên tắc thiết kế mới

Rút ra từ đối chiếu 13 trang. Đây là hiến chương, mọi quyết định sau phải tuân.

### N1. Ai đọc trang này — hỏi trước khi viết một chữ

Hai người đọc, hai giọng, hai lối vào:

| | Nhà sản xuất Việt | Người mua quốc tế |
|---|---|---|
| Ngôn ngữ | Tiếng Việt tại `/` | Tiếng Anh tại `/en` |
| Câu hỏi trong đầu | "Làm sao bán được giá tốt hơn?" | "Nhà máy này có thật không, có đủ năng lực không?" |
| Cần thấy gì | Chi phí, thời gian, ai đã làm, được gì | Giấy tờ, chứng nhận, thông số, năng lực, giá |
| Không cần | Giải thích sàn là gì | Triết lý của Vexim |

Hiện tại `/` viết cho nhà máy Việt nhưng headline tiếng Anh. Đây là lỗi cần sửa đầu tiên.

### N2. Không có bằng chứng thì không có claim

Ba mức, dùng đúng mức mình có:

1. **Có số + có nguồn** → đưa lên hero (Panasonic, Euromonitor)
2. **Có số + nguồn là chính mình** → đưa vào mục riêng có nhãn thời gian (MONA, Search Console)
3. **Không có số** → không đưa số, dùng mô tả cơ chế (Agentcy)

Cấm: số không nguồn, "hàng nghìn khách hàng", "top đầu thị trường", "uy tín số 1".

### N3. Mỗi mục trả lời đúng một câu hỏi

Cấu trúc mỗi khối: **tiêu đề = câu trả lời** → một câu giải thích → bằng chứng → một link.

### N4. Màu để phân biệt chức năng, không để trang trí

Giữ navy hiện tại. Mỗi trụ cột một màu nhấn, dùng nhất quán ở: viền thẻ, icon, nhãn số.
Không gradient loang, không hiệu ứng nền.

### N5. Ảnh là bằng chứng hoặc không có ảnh

Ưu tiên: ảnh chụp thật > ảnh sản phẩm tách nền > hình vector tự vẽ > (không dùng stock).

### N6. Con số phải có đơn vị hoặc thời hạn

`20 năm` / `4 trụ cột` / `12 tháng` / `tính đến 11/2026`. Không có "nhiều", "hàng trăm".

---

## 3. Kế hoạch UX/UI

### 3.1 Kiến trúc thông tin mới

```
/                          → dành cho NHÀ MÁY VIỆT (tiếng Việt)
/en                        → dành cho NGƯỜI MUA QUỐC TẾ (tiếng Anh)
/san                       → Vexim Trade: danh mục ngành hàng, nhà cung cấp
/en/marketplace            → bản tiếng Anh của /san  ← hiện chưa có
/services/*                → 12 trang dịch vụ (giữ nguyên URL)
/blog                      → giữ nguyên
```

**Thay đổi then chốt: tách `/` và `/en` thành hai trang khác nhau, không phải bản dịch.**

Hiện tại `/en` là bản dịch của `/`. Đây là gốc của vấn đề "không phục vụ trọn ai".
Người mua quốc tế vào `/en` cần thấy *danh mục nhà cung cấp*, không phải *lời mời hợp tác
xây kênh bán hàng*.

### 3.2 Bố cục trang chủ `/` (nhà máy Việt)

| # | Khối | Nội dung | Nguồn cảm hứng |
|---|---|---|---|
| 1 | Hero | Một câu khẳng định + 1 dòng phụ + 2 nút + **3 số có đơn vị** | freee + Panasonic |
| 2 | Dải ngành hàng | Marquee 8 ngành Việt Nam mạnh, mỗi ngành link tới `/san?nganh=...` | MONA (nhưng bỏ ký tự trang trí) |
| 3 | Bốn trụ cột | Giữ nguyên 4 thẻ bento hiện tại, thêm **ảnh chụp thật** cho mỗi thẻ | Hiện có |
| 4 | Bằng chứng | **Ảnh chụp thật + nhãn thời gian.** Nếu chưa có: bỏ khối này, không bịa | MONA |
| 5 | Vấn đề phụ thuộc | Giữ nguyên, đã tốt | Hiện có |
| 6 | Ba gói | Thêm bảng so sánh thay vì 3 thẻ rời | LG (ma trận giá) |
| 7 | FAQ | 6–8 câu, viết như nhà máy thật hỏi | Panasonic |
| 8 | Tuân thủ | Giữ nguyên, đã tốt | Hiện có |
| 9 | CTA | Giữ nguyên | Hiện có |

### 3.3 Bố cục `/en` (người mua quốc tế) — **xây mới**

| # | Khối | Nội dung |
|---|---|---|
| 1 | Hero | "Verified Vietnamese suppliers, by product." + ô tìm kiếm ngành hàng |
| 2 | Danh mục | 8 ngành hàng, mỗi ngành: số nhà cung cấp, số mặt hàng |
| 3 | Cách xác minh | 4 bước Vexim kiểm tra nhà cung cấp — **đây là thứ người mua cần** |
| 4 | Nhà cung cấp nổi bật | 6 thẻ: ảnh nhà máy, ngành hàng, chứng nhận, năm thành lập |
| 5 | Tài liệu | Link tải catalogue mẫu, spec sheet, chứng nhận (kiểu keyence) |
| 6 | FAQ người mua | "Làm sao biết nhà máy có thật?", "MOQ tối thiểu?", "Ai chịu phí vận chuyển?" |
| 7 | Liên hệ | Form ngắn: ngành hàng + thị trường + sản lượng |

### 3.4 Thành phần UI cần xây

| Thành phần | Đặc tả | Lý do |
|---|---|---|
| `StatBand` | 3 số, mỗi số có số chính + nhãn + đơn vị/thời hạn | Panasonic + freee |
| `Marquee` | Dải chạy ngang, dừng khi hover, `prefers-reduced-motion` | MONA, nhưng sạch |
| `ProofStrip` | Ảnh chụp + nhãn thời gian + một dòng giải thích | MONA |
| `CompareTable` | Bảng 3 gói × 6 hạng mục, có tick/chéo | LG |
| `FaqList` | Accordion, câu hỏi viết như người thật hỏi | Panasonic |
| `DocList` | Danh sách tài liệu: tên, định dạng, dung lượng, ngày | keyence |
| `CategoryTile` | Ảnh ngành + tên + số nhà cung cấp | LG |
| `PriceMatrix` | (chỉ nếu có giá công khai) giá, giá gốc, giá member, quy ra tháng | LG |

### 3.5 Kỹ thuật — giữ nguyên những gì đang tốt

Đang tốt, **không đụng**:

- CLS 0.0000 (đã kiểm 320→1920px)
- SSR hai ngôn ngữ, hreflang đối xứng
- Font Be Vietnam Pro self-host
- Middleware auto-switch theo `accept-language`
- Bento grid + 4 hình vector
- Schema.org đầy đủ
- `verify-homepage.mjs` 19 assertion

Cần thêm:

- `StatBand` phải render số từ **một nguồn duy nhất** (`lib/proof.ts`) để không lệch giữa
  các trang, và để dễ xoá khi số hết hạn.
- Mỗi ảnh proof phải có `date` trong data, hiển thị thành nhãn.

---

## 4. Kế hoạch nội dung

### 4.1 Giọng

Giữ giọng Agentcy đã chốt ở PR #18: câu ngắn, khẳng định, nói thẳng giới hạn.

Bổ sung từ Panasonic: **claim mạnh phải kèm nguồn**. Nếu không dẫn được nguồn, hạ cấp
claim xuống thành mô tả cơ chế (Agentcy).

### 4.2 Từ vựng

Đã chốt (PR #17): dùng từ nhà cung cấp — hàng, đơn, mẫu, giá, chứng từ, người mua, nhà máy.
Không dùng: từ khoá, SEO, lập chỉ mục, lưu lượng, thứ hạng.

Bổ sung: **không dùng từ của nghề thiết kế** trong nội dung người đọc —
"trải nghiệm người dùng", "hành trình khách hàng", "điểm chạm", "chuyển đổi".
Những từ này chỉ dùng trong tài liệu nội bộ.

### 4.3 Nội dung cần viết mới

| Hạng mục | Số lượng | Ghi chú |
|---|---|---|
| Trang chủ `/en` mới | 1 trang | Viết cho người mua, không dịch từ tiếng Việt |
| Trang `/san` (Vexim Trade) | 1 trang | Danh mục ngành hàng thật |
| FAQ trang chủ | 8 câu | Nhà máy hỏi |
| FAQ `/en` | 6 câu | Người mua hỏi |
| Mô tả 8 ngành hàng | 8 × 2 ngôn ngữ | Mỗi ngành 60–80 từ, nêu thế mạnh cụ thể |
| Trang xác minh nhà cung cấp | 1 trang | 4 bước, nói rõ cái gì kiểm, cái gì không |
| Bảng so sánh 3 gói | 1 bảng | 6 hạng mục × 3 gói |

### 4.4 Nội dung phải lấy từ bạn

Không thể tự viết, cần dữ liệu thật:

1. **Ba con số cho hero** — số ngành hàng Vexim Trade đang có, số nhà cung cấp đã duyệt,
   số thị trường đang làm. Nếu chưa có thì dùng: `4 trụ cột`, `12 nhóm dịch vụ`, `20 năm`.
2. **Ảnh chụp thật** — trang Vexim Trade đang chạy, form liên hệ, một trang sản phẩm mẫu.
3. **Bốn bước xác minh nhà cung cấp** — Vexim thực sự kiểm gì? (giấy phép, chứng nhận,
   công suất, mẫu?) Cần đúng thực tế, không được mô tả quá.
4. **Tài liệu mẫu** — có sẵn PDF spec sheet hay catalogue nào chưa?

---

## 5. Thứ tự thực hiện

Chia 5 giai đoạn, mỗi giai đoạn tự đứng được (không để site hỏng giữa đường).

### Giai đoạn 1 — Nền đo lường (1 buổi)
- [ ] Tạo `lib/proof.ts`: nguồn duy nhất cho mọi con số, mỗi số có `value`, `label`,
      `unit`, `asOf`, `source?`.
- [ ] Tạo `components/home/stat-band.tsx`.
- [ ] Thêm vào hero, dùng số đã kiểm chứng được.
- [ ] Cập nhật `verify-homepage.mjs`: assert số khớp giữa hero và các trang khác.

**Xong khi:** hero có 3 số, không số nào mâu thuẫn, test pass.

### Giai đoạn 2 — Tách hai người đọc (lớn nhất)
- [ ] Viết `/en` mới cho người mua quốc tế (không dịch từ `/`).
- [ ] Tách `HOME_MESSAGES.en` khỏi cấu trúc VI, giữ chung component.
- [ ] Đổi H1 `/` về tiếng Việt thuần.
- [ ] Giữ hreflang đối xứng và middleware hiện tại.

**Xong khi:** hai trang phục vụ hai câu hỏi khác nhau, test hreflang vẫn pass.

### Giai đoạn 3 — Vexim Trade thành sản phẩm (trung bình)
- [ ] Route `/san` + `/en/marketplace`, không chỉ là trang dịch vụ.
- [ ] 8 ngành hàng, mỗi ngành một thẻ có số nhà cung cấp.
- [ ] Trang xác minh nhà cung cấp, 4 bước.
- [ ] Nối `/` và `/en` vào đây thay vì link thẳng ra `veximtrade.com`.

**Xong khi:** người đọc bấm được vào sàn ngay trên site.

### Giai đoạn 4 — Bằng chứng (cần tư liệu từ bạn)
- [ ] `ProofStrip`: ảnh chụp thật + nhãn thời gian.
- [ ] `DocList`: tài liệu tải được.
- [ ] Thay ảnh stock bằng ảnh thật, ưu tiên hero và dải ảnh.
- [ ] Xoá mọi claim không dẫn được nguồn.

**Xong khi:** không còn ảnh stock nào ở vị trí chính; mọi claim có nguồn hoặc đã hạ cấp.

### Giai đoạn 5 — Hoàn thiện (nhỏ)
- [ ] `CompareTable` thay 3 thẻ gói rời.
- [ ] FAQ 8 câu (VI) + 6 câu (EN).
- [ ] `Marquee` dải ngành hàng.
- [ ] Rà lại toàn bộ theo 6 nguyên tắc N1–N6.

---

## 6. Những gì KHÔNG làm

| Không làm | Vì sao |
|---|---|
| Màu tím-vàng, linh vật | Người mua Âu/Mỹ đọc trang này; phá định vị B2B |
| Menu 40 liên kết | LG và Panasonic đều mắc lỗi này; Vexim đang gọn, giữ gọn |
| Carousel 7 banner khuyến mại | Vexim không bán lẻ, không có flash sale |
| Trang chủ dài vô tận | LG phải làm vì bán 200 mặt hàng; Vexim bán 4 dịch vụ |
| Chữ động SVG phức tạp | Đang giữ CLS 0.0, không đánh đổi |
| Triết lý doanh nghiệp dài | Chưa đủ vị thế như itochu |
| Số liệu không nguồn | Nguyên tắc N2 |

---

## 7. Rủi ro

| Rủi ro | Mức | Cách xử |
|---|---|---|
| Tách `/` và `/en` làm mất SEO hiện có | Cao | Giữ nguyên URL, chỉ đổi nội dung; hreflang không đổi |
| Không có ảnh thật → giai đoạn 4 tắc | Cao | Làm giai đoạn 1–3 trước, 4 chờ tư liệu |
| Số liệu đưa lên rồi lỗi thời | Trung bình | `lib/proof.ts` có `asOf`, hiển thị nhãn thời gian |
| 53 route, đụng vào dễ vỡ | Trung bình | Chỉ sửa 2 trang + thêm 2 route; không refactor rộng |
| Bản tiếng Anh chưa có nội dung thật | Cao | Viết mới, không dịch máy; cần bạn duyệt |

---

## 8. Việc cần bạn quyết trước khi bắt đầu

1. **Giai đoạn 1 dùng số nào?** Có số thật (ngành hàng, nhà cung cấp, thị trường) hay
   dùng tạm `4 trụ cột / 12 nhóm dịch vụ / 20 năm`?
2. **Giai đoạn 2 làm ngay không?** Đây là thay đổi lớn nhất và có rủi ro SEO thấp
   (không đổi URL), nhưng cần bạn duyệt nội dung `/en` mới.
3. **Giai đoạn 3 có làm được không?** Cần biết Vexim Trade hiện có bao nhiêu ngành hàng,
   bao nhiêu nhà cung cấp thật, để không hiển thị số 0.
