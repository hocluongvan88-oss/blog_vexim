# Phân tích phong cách thiết kế web Nhật Bản

Ghi chép ngày 2026-11-14, đọc trực tiếp 6 trang ở 5 nhóm khác nhau. Mục đích: rút ra
cái gì dùng được cho Vexim, cái gì không, và vì sao.

## Các trang đã đọc

| Trang | Nhóm | Vì sao chọn |
|---|---|---|
| `itochu.co.jp` | Tập đoàn thương mại lớn (sogo shosha) | Chuẩn mực của "uy tín doanh nghiệp Nhật" |
| `keyence.co.jp` | B2B công nghiệp, thiết bị đo | Trang B2B bán thiết bị lớn nhất Nhật, tối ưu cho kỹ sư |
| `monotaro.com` | Sàn B2B vật tư công nghiệp | Đối chiếu trực tiếp với Vexim Trade |
| `muratec.jp` | Nhà sản xuất máy móc | Kiểu "manufacturer corporate site" |
| `freee.co.jp` | SaaS kế toán | Kiểu startup SaaS Nhật hiện đại |
| `goodpatch.com` | Design agency | Kiểu agency thiết kế, để so với MONA |

---

## 1. Năm phong cách khác nhau, không phải một

Điều dễ hiểu sai nhất: "web Nhật" không phải một phong cách. Có ít nhất năm dòng
chạy song song, và chúng trái ngược nhau về mật độ thông tin.

### (a) Sogo shosha — uy tín bằng thể chế
**itochu.co.jp**

- Hero là **một câu triết lý**, không phải mô tả dịch vụ:
  「ひとりの商人、無数の使命」 ("Một thương nhân, vô số sứ mệnh")
- Ngay dưới là đoạn văn xuôi cỡ chữ lớn, viết như văn, không như copy quảng cáo:
  *"Có một thương nhân. Ở đó có vô số sứ mệnh. Vượt qua biên giới, gắn với đời sống,
  từ niềm vui trước mắt đến hy vọng 100 năm sau, chúng tôi buôn đủ thứ."*
- Triết lý kinh doanh 「三方よし」 (ba bên cùng có lợi) đặt thành một mục riêng.
- Tin tức chiếm khối lượng lớn, chia tab: 新着 / プレスリリース / IR / サステナビリティ.
- Ảnh chân dung chủ tịch và CEO, kèm chức danh.
- Mọi thứ có ngày tháng và **file PDF tải được** (báo cáo bán niên, ghi rõ dung lượng).

**Bài học:** với doanh nghiệp lớn, trang chủ không bán hàng. Nó chứng minh sự tồn tại
của một thể chế: triết lý, lãnh đạo, tin tức, tài liệu tài chính.

### (b) B2B công nghiệp — kỹ sư là người đọc
**keyence.co.jp**

- Hero là **carousel 5 sản phẩm mới**, mỗi slide một câu lợi ích cụ thể:
  「6眼カメラで、チョコ停ゼロへ」 ("6 mắt camera, chấm dứt dừng máy lặt vặt")
- Thanh tìm kiếm đặt **ngay trên cùng**, phân loại: 商品カタログ / 技術資料 /
  データシート / CAD・CAE / マニュアル / ソフトウェア.
  Đây là điểm quan trọng nhất: người dùng đến để **tải tài liệu**, không phải để đọc giới thiệu.
- Danh mục sản phẩm liệt kê 22 nhóm, mỗi nhóm một icon, dạng lưới dày.
- Không có testimonial, không có "về chúng tôi" ở trang chủ. Chỉ có sản phẩm và tài liệu.
- Giá không hiển thị (B2B Nhật vẫn theo thoả thuận), nhưng có mục 「価格」 riêng để giải thích.

**Bài học:** với B2B kỹ thuật, sự tiện lợi tra cứu thắng mọi thứ trang trí.

### (c) Sàn B2B — thông tin dày đặc
**monotaro.com**

- Trang chủ là **bảng điều khiển bán hàng**: banner khuyến mại, danh mục phổ biến,
  từng nhóm 3 sản phẩm kèm ảnh nhỏ, giá, số lượng đánh giá.
- Đơn vị giá hiển thị rõ: `税込 ￥751～` (đã gồm thuế, từ giá này).
- Mọi thứ là ảnh PNG/JPG nhỏ, có phiên bản `_sp` cho điện thoại.
- Không có phần "câu chuyện thương hiệu" nào ở trang chủ. Chuyện để chỗ khác.

**Bài học cho Vexim Trade:** đây chính là kiểu đối thủ Vexim phải cạnh tranh. Người mua
Nhật quen với mật độ này. Một sàn B2B "đẹp và thoáng" kiểu châu Âu sẽ bị coi là thiếu hàng.

### (d) Nhà sản xuất — câu chuyện dẫn dắt
**muratec.jp**

- Hero chia dòng ngắn, xuống dòng có chủ ý, kiểu thơ:
  ```
  オートメーションが動かす未来        Tương lai do tự động hoá vận hành
  私たちの自動化技術で 何ができるか     Công nghệ của chúng tôi làm được gì
  一歩先の社会課題を 見据えて          Nhìn trước bài toán xã hội một bước
  お客さまとともに 未来の社会をデザインします
  ```
- Ảnh sản phẩm chụp nền trắng, tách nền hoàn toàn, không bóng đổ.
- Chia 5 mảng kinh doanh, mỗi mảng một ảnh minh hoạ riêng.
- Tin tức dạng dòng ngắn có ngày, nhóm theo công ty con.

**Bài học:** nhà sản xuất Nhật dùng **câu ngắn xuống dòng** thay vì đoạn văn. Nhịp đọc
chậm, trang nghiêm, dễ đọc trên điện thoại.

### (e) SaaS hiện đại — tối giản, một câu
**freee.co.jp**

- Hero chỉ có **một câu**: 「スモールビジネスを、世界の主役に。」
  ("Đưa doanh nghiệp nhỏ lên vị trí chính giữa thế giới.")
  Có dấu phẩy Nhật `、` giữa câu — chi tiết rất Nhật.
- Một nút duy nhất: 「活動をみる」.
- Ảnh nền lớn, chữ trắng đè lên, không gradient, không hiệu ứng.
- Sau đó là 4 khối: NEWS / SERVICES / 会社概要 / パートナー / 採用情報 / ブランド.
- Mỗi khối một ảnh, một câu mô tả 2–3 dòng, một link.

**Bài học:** đây là phong cách gần Vexim nhất về tinh thần — một câu mạnh, ít nút,
phần còn lại là danh mục rõ ràng.

### (f) Agency thiết kế
**goodpatch.com**

- Hero là **chữ động** (SVG animation): "Design to envision".
- Câu định vị dài và trừu tượng: *"Turning unseen potential into futures that move
  people's hearts."* — rất khác kiểu agency Mỹ vốn thích con số.
- Portfolio đặt tên khách hàng thật: Suzuki, KOKUYO, Kubota, DAIKIN.
- Mỗi dự án một câu mô tả kết quả, không phải mô tả quy trình.
- Có nhân vật hoạt hình nhỏ (chara-balloon) làm điểm nhấn — tương tự linh vật Gấu của MONA,
  nhưng tiết chế hơn nhiều.

---

## 2. Sáu đặc điểm chung của web Nhật

Rút ra từ cả 6 trang, đây là thứ khác biệt so với web Việt/Mỹ:

### 2.1 Câu ngắn, xuống dòng có chủ ý
Không viết đoạn văn dài. Mỗi dòng một ý, ngắt bằng `<br>` hoặc chia khối. Đọc trên
điện thoại rất dễ. Ví dụ muratec chia một câu thành 4 dòng.

### 2.2 Thông tin có ngày tháng và đơn vị
Gần như mọi con số đều kèm mốc thời gian hoặc đơn vị:
`2026年11月12日`, `PDF 645KB`, `税込 ￥751～`, `12ヶ月`.
Không có con số nào đứng trơ.

### 2.3 Tài liệu tải được là hạng mục chính
itochu và keyence đều đặt PDF/CAD/catalogue ngang hàng với sản phẩm. Với B2B Nhật,
"có tài liệu để tải" là tiêu chí đánh giá độ tin cậy.

### 2.4 Không dùng ảnh stock nước ngoài
Ảnh là: chân dung lãnh đạo thật, nhà máy thật, sản phẩm chụp tách nền trên trắng,
ảnh poster thiết kế riêng. Không thấy ảnh stock "doanh nhân bắt tay".

### 2.5 Màu tiết chế
Xanh navy (itochu), trắng-xám-đỏ nhấn (keyence), trắng-xanh lá (freee),
trắng-đen (goodpatch). Không có gradient nhiều màu, không có nền loang.
Màu được dùng để phân biệt **nhóm chức năng**, không để trang trí.

### 2.6 Cấu trúc thông tin phân cấp rõ
Thanh điều hướng luôn có nhóm lớn + nhóm con, và thường có mục 会社概要 (về công ty)
tách hẳn khỏi phần sản phẩm. Người đọc biết mình đang ở tầng nào.

---

## 3. Ba điều KHÔNG nên bắt chước

### 3.1 Mật độ kiểu sàn (monotaro)
Nhật đã quen với mật độ này vì họ mua hàng qua sàn từ lâu. Người mua Âu/Mỹ thì không —
họ sẽ thấy rối. Vexim bán cho người mua quốc tế, không phải người mua Nhật.

### 3.2 Chữ Nhật trong hero không dịch được
Kiểu 「オートメーションが動かす未来」 hoạt động vì tiếng Nhật cho phép xuống dòng giữa
cụm danh từ. Tiếng Việt và tiếng Anh xuống dòng kiểu đó sẽ thành câu cụt, mất nghĩa.

### 3.3 Triết lý doanh nghiệp dài ở trang chủ (itochu)
Chỉ làm được khi đã có 100 năm lịch sử và người đọc đến để tra cứu. Vexim chưa có
vị thế đó, và người mua quốc tế đến để tìm nhà cung cấp, không để đọc triết lý.

---

## 4. Áp cho Vexim — cụ thể

### Nên lấy

| Đặc điểm | Áp vào đâu | Vì sao |
|---|---|---|
| Câu ngắn xuống dòng (muratec) | Tiêu đề hero, tiêu đề mục | Đã làm một phần ở bản Agentcy; đẩy xa hơn |
| Số liệu kèm mốc thời gian | Dải số hero, kết quả dự án | Tăng độ tin mà không cần khoe |
| Tài liệu tải được | Trang sản phẩm Vexim Trade | Người mua B2B cần PDF spec, không cần ảnh đẹp |
| Ảnh thật thay stock | Hero, dải ảnh | Ảnh stock hiện tại là điểm yếu lớn nhất |
| Màu tiết chế theo chức năng | Giữ navy, thêm 1 màu nhấn cho mỗi trụ cột | Đã có, chỉ cần kỷ luật hơn |
| Cấu trúc phân cấp rõ | Menu điều hướng | Hiện đã ổn |

### Không nên lấy

- Mật độ sàn kiểu monotaro → người mua Âu/Mỹ sẽ thấy rối.
- Hero chữ động phức tạp kiểu goodpatch → tốn hiệu năng, Vexim đang giữ CLS 0.
- Triết lý dài kiểu itochu → chưa đủ vị thế.

### Việc nên làm trước, theo thứ tự

1. **Ảnh thật.** Thay ảnh stock bằng ảnh chụp thật: trang Vexim Trade đang chạy,
   form liên hệ thật, màn hình Search Console thật. Đây là chênh lệch lớn nhất giữa
   Vexim và cả MONA lẫn web Nhật.
2. **Dải số kèm mốc thời gian.** Không cần số lớn, cần số kiểm chứng được.
3. **Câu ngắn trong hero.** Tách câu dài thành 3–4 dòng, mỗi dòng một ý.
4. **PDF spec mẫu.** Một file thật để tải, chứng minh năng lực làm tài liệu thương mại.

---

## 5. So sánh nhanh ba phong cách đã nghiên cứu

| | MONA (Việt) | Agentcy PR (B2B SaaS) | Nhật (keyence/freee) |
|---|---|---|---|
| Hero | Chữ HOA, vàng-tím, số liệu to | Một câu khẳng định, không số | Một câu hoặc carousel sản phẩm |
| Bằng chứng | Ảnh chụp thật + poster số | Không có ảnh, chỉ mô tả cơ chế | Tài liệu tải được, thông số |
| Giọng | Tự tin, thân mật, dùng "anh chị" | Trung tính, nói thẳng giới hạn | Lịch sự, khiêm tốn (「～します」) |
| Màu | Tím-vàng, tương phản mạnh | Trắng-đen-xanh nhạt | Navy hoặc trắng-xám |
| Cảm giác | Agency tiếp thị | Sản phẩm phần mềm | Thể chế, đáng tin |
| Phù hợp Vexim? | Một phần (bằng chứng) | Nhiều (giọng, cấu trúc) | Nhiều (ảnh thật, tài liệu, màu) |

**Kết luận:** Vexim nên đứng giữa Agentcy (giọng) và Nhật (bằng chứng, màu tiết chế),
không nên ngả sang MONA (màu, linh vật) vì người mua quốc tế đọc trang này.

---

# Bổ sung: Panasonic Việt Nam (panasonic.com/vn)

Ghi chép ngày 2026-11-18. Đọc 5 trang: trang chủ, Tổng quan công ty, trang thương hiệu
`Create Today. Enrich Tomorrow.`, trang danh mục máy giặt, trang chi tiết một model
(NA-V10FA1LVT), và một bài tin tức CSR.

Panasonic khác cả 6 trang Nhật ở trên: đây là **website tập đoàn đa quốc gia bản địa hoá
sang tiếng Việt**. Không phải web Nhật thuần, nhưng vẫn giữ nguyên cấu trúc và kỷ luật
thông tin của web Nhật. Đây là mẫu gần Vexim nhất về **quy mô và cách phân tầng**.

## 1. Kiến trúc: ba thế giới tách rời

Điều đáng học nhất. Trang chủ chia làm ba khối rõ ràng, không lẫn:

| Khối | Nội dung | Người đọc |
|---|---|---|
| **Sản phẩm** | Máy giặt, tủ lạnh, điều hoà, làm đẹp, Technics | Người tiêu dùng cuối |
| **Doanh Nghiệp** | Giải pháp không khí, giải pháp năng lượng | Đại lý, nhà thầu, B2B |
| **Về chúng tôi** | Tổng quan, bền vững, tuyển dụng, tin tức, triết lý | Nhà đầu tư, báo chí, ứng viên |

Mỗi khối có **chân dung người đọc riêng**, không dùng chung giọng. Khối B2B chỉ có 2 mục,
mỗi mục một câu viết HOA toàn bộ:
「GIẢI PHÁP KHÔNG KHÍ TOÀN DIỆN TỪ PANASONIC」

Ngoài ra còn một dải **tiện ích** tách riêng: cửa hàng trực tuyến, danh sách đại lý toàn quốc,
hỗ trợ, ứng dụng My Panasonic, cộng đồng, liên hệ đối tác.

**Bài học cho Vexim:** Vexim đang trộn ba đối tượng (nhà máy Việt, người mua quốc tế, đối tác
tuân thủ) trong một trang. Panasonic tách hẳn. Vexim nên tách ít nhất: *nhà sản xuất Việt*
(muốn bán) và *người mua quốc tế* (muốn tìm nhà cung cấp).

## 2. Trust mark có nguồn, đặt ngay trong lời CEO

Trong thông điệp của Tổng Giám đốc:

> "Panasonic đã giành được sự yêu mến và tin cậy của khách hàng với vị thế là
> thương hiệu điện máy số 1 Nhật Bản\*"
>
> `* Nguồn: Euromonitor International Limited, ấn bản Thiết bị gia dụng 2025, theo định
> nghĩa về Thiết bị gia dụng, số lượng bán lẻ theo đơn vị, dữ liệu năm 2024.`

Đây là chuẩn mực: **claim mạnh nhất trên trang, nhưng có footnote ghi rõ nguồn, ấn bản,
định nghĩa, đơn vị đo và năm dữ liệu.** Không phải "số 1 Việt Nam" trống rỗng.

## 3. Trang thương hiệu: văn xuôi, không bán hàng

`/consumer/create-today-enrich-tomorrow.html`

- Tiêu đề là một câu tiếng Anh không dịch: **"Create Today. Enrich Tomorrow."**
- Bên dưới có phụ đề tiếng Việt chia dòng ngắn, ngắt có chủ ý:

  > Từ Nhật Bản đến bạn
  > Quan tâm đến người khác. Chú trọng từng chi tiết.
  > Tiết giảm lãng phí. Trân trọng thiên nhiên.

- Đoạn giải thích đọc như văn, không như copy:
  > "Những giá trị từ văn hóa Nhật Bản chính là kim chỉ nam cho sự phát triển của chúng tôi."

- Cấu trúc còn lại là **sáu chương ảnh lớn**, mỗi chương một câu tiêu đề:
  `Do con người kiến tạo, được dẫn lối bởi tinh hoa Nhật Bản` →
  `Thiết kế phục vụ cuộc sống hàng ngày` → `Khơi Nguồn Cảm Hứng Cho Thế Hệ Mới`

- Mỗi chương là một dải ảnh full-width, chữ đè, không nút CTA chen giữa.

**Bài học:** đây chính là kiểu "trang câu chuyện" mà MONA làm bằng linh vật + màu tím,
Panasonic làm bằng ảnh thật + văn xuôi + tiết chế. Với Vexim, cách của Panasonic phù hợp hơn.

## 4. Trang danh mục: bộ lọc theo *lợi ích*, không theo thông số

Trang máy giặt có 24 sản phẩm, bộ lọc chia 3 nhóm — và tên nhóm rất đáng chú ý:

| Nhóm lọc | Các lựa chọn |
|---|---|
| Dung tích giặt/sấy | Giặt 12,5–16 kg / 8,5–12 kg / ≤8,2 kg |
| **Vệ sinh/làm sạch** | Diệt khuẩn bằng giặt lạnh – Blue Ag+ / Loại bỏ vi khuẩn bằng giặt nóng / Dễ đánh bay vết bẩn – ActiveFoam |
| **Thân thiện với người dùng** | Gioăng cửa tự làm sạch / Lồng giặt tự làm sạch / Tự định lượng / Tự động sấy khô lồng |

Chỉ **một** nhóm là thông số khô (cân nặng). Hai nhóm còn lại đặt tên theo **việc người dùng
quan tâm**: "vệ sinh", "thân thiện". Không có nhóm nào tên "Công nghệ" hay "Tính năng".

Mỗi thẻ sản phẩm chỉ có: ảnh, dòng sản phẩm, loại, mã model, **3 gạch đầu dòng lợi ích**,
giá tham khảo, và 2 hành động (So sánh / Yêu thích).

Giá ghi rõ: `Giá tham khảo: 12.390.000 đ` + `*Giá trên đã bao gồm VAT`.

## 5. Trang chi tiết: tiêu đề lợi ích, không phải tên model

H1 của trang sản phẩm là **"Giặt sạch hơn, giặt thông minh"** — không phải "Máy giặt
NA-V10FA1". Tên model nằm dưới, cỡ nhỏ.

Cấu trúc trang:
1. Hero: ảnh sản phẩm + 4 gạch đầu dòng lợi ích + 4 icon tính năng
2. Thanh neo dính: `Đầu trang / Tính năng / Thông số kỹ thuật / Hỗ trợ`
3. Mỗi tính năng: tiêu đề lợi ích + ảnh lớn + đoạn 2–3 câu
4. **Khối FAQ 6 câu**, viết như người dùng thật hỏi:
   - "Có cần dùng thêm nước tẩy rửa hoặc lượng nước khi tự động vệ sinh gioăng cửa không?"
   - "Có thể sử dụng hai chức năng cùng lúc không?"
5. Bảng thông số kỹ thuật đầy đủ

Số liệu trong phần tính năng có **chỉ số footnote**:
`99%*¹ tác nhân gây dị ứng`, `99,99%*² vi khuẩn`, nhiệt độ `40°C đến 90°C`.

## 6. Tin tức: bài CSR viết như bài báo, không như thông cáo

Bài "Cùng em sáng tạo STEM mùa 4" dài, có:
- Sapo in đậm tóm tắt toàn bài
- Số liệu cụ thể: `hơn 5.000 video`, `2.300 trường`, `30 tỉnh thành`, `800 học sinh`,
  `120.000 học sinh sau 4 năm`
- Ảnh có **caption in nghiêng** giải thích ảnh chụp gì
- Trích dẫn trực tiếp lời Tổng Giám đốc, in nghiêng, có ngoặc kép
- Tên đối tác đầy đủ: CED, Viện Nghiên cứu Thiết kế trường học (Bộ GD&ĐT)
- Cuối bài: "Recommend Pages" + link fanpage

## 7. Điểm yếu của trang này (đừng bắt chước)

- **Menu quá tải.** Trang chủ có hơn 40 liên kết, nhiều liên kết mở tab mới mà không
  báo trước (chỉ có icon nhỏ).
- **Trùng lặp nội dung.** Khối "Sản phẩm" và trang thương hiệu nói cùng một câu chuyện
  "chất lượng Nhật Bản" theo hai cách khác nhau.
- **Trang chủ không có CTA rõ.** Không biết bấm gì nếu muốn mua — phải tự tìm
  "Cửa hàng trực tuyến" trong dải tiện ích.
- **Ảnh stock doanh nghiệp** ở phần "Về chúng tôi" (ảnh nhà máy, ảnh nhóm) — chất lượng
  thấp hơn hẳn ảnh sản phẩm.
- **Nút "Đọc thông điệp / Đóng"** xuất hiện dưới lời CEO như một modal lỗi.

## 8. Áp cho Vexim — cụ thể

| Đặc điểm Panasonic | Áp vào Vexim thế nào |
|---|---|
| Tách ba khối người đọc | Tách rõ: dành cho nhà máy Việt / dành cho người mua quốc tế |
| Trust mark có footnote nguồn | Claim "20 năm" phải có nguồn; claim nào chưa có nguồn thì bỏ |
| Lọc theo lợi ích, không theo thông số | Vexim Trade lọc theo *ngành hàng* và *thị trường*, không theo "tính năng" |
| H1 là lợi ích, không phải tên | Trang sản phẩm Vexim Trade: H1 là "Hạt điều nhân W320 xuất khẩu", không phải mã SKU |
| FAQ viết như người dùng hỏi | Thêm FAQ thật vào landing: "Vào sàn mất bao lâu?", "Có mất phí duy trì không?" |
| Bài tin có số liệu + caption ảnh | Blog Vexim nên theo chuẩn này, không viết chung chung |
| Trang thương hiệu bằng ảnh lớn + văn xuôi | Thay cho mục "Nơi Vexim bắt đầu" hiện tại |

### Không nên lấy

- Menu 40 liên kết — Vexim đang gọn, giữ gọn.
- Trùng lặp nội dung giữa các trang.
- Ảnh stock ở phần giới thiệu công ty.

## 9. Cập nhật bảng so sánh tổng

| | MONA (Việt) | Agentcy PR | Nhật thuần | Panasonic VN |
|---|---|---|---|---|
| Hero | Chữ HOA, tím-vàng, số to | Một câu khẳng định | Carousel sản phẩm / một câu | Ba khối theo đối tượng |
| Bằng chứng | Ảnh chụp thật + poster số | Mô tả cơ chế | Tài liệu tải được | Footnote nguồn + số liệu có chỉ số |
| Giọng | Thân mật "anh chị" | Trung tính, nói thẳng | Lịch sự, khiêm tốn | Trang trọng, văn xuôi |
| Màu | Tím-vàng | Trắng-đen | Navy / trắng-xám | Xanh Panasonic + trắng |
| Cảm giác | Agency tiếp thị | Sản phẩm phần mềm | Thể chế | Tập đoàn đa quốc gia |
| **Phù hợp Vexim** | Một phần | Nhiều (giọng) | Nhiều (kỷ luật thông tin) | **Nhiều nhất (phân tầng + nguồn)** |

**Kết luận cập nhật:** Vexim nên lấy **cấu trúc phân tầng của Panasonic** + **giọng nói thẳng
của Agentcy** + **kỷ luật dẫn nguồn của Panasonic**. Hai thứ này không xung đột: phân tầng
giải quyết "ai đọc gì", dẫn nguồn giải quyết "tin được không".
