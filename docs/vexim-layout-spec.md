# Đặc tả bố cục & giao diện Vexim Global

Ngày lập: 2026-11-18. Đi kèm `docs/vexim-rebuild-plan.md` (phần chiến lược) —
tài liệu này là phần **thi công**: lưới, khoảng cách, chữ, màu, và bố cục từng màn.

## 0. Chẩn đoán thiết kế hiện tại

Đo từ `components/home/home.module.css`:

| Chỉ số | Hiện tại | Vấn đề |
|---|---|---|
| Container | `min(100% - 80px, 1220px)` | Tốt, giữ nguyên |
| **Gradient** | **33 chỗ** | Loang màu khắp nơi, ngược với kết luận "màu tiết chế" của cả 13 trang đã đọc |
| **`border-radius: 999px`** | **14 chỗ** | Mọi thứ đều là viên thuốc: nút, badge, chip, tag |
| Border radius khác | 9 / 14 / 16 / 20 / 22 / 24 / 26 / 30 / 32px | 9 giá trị khác nhau, không có thang |
| Cỡ chữ tiêu đề | 12 giá trị `clamp()` khác nhau | Không có thang, mỗi mục tự chọn |
| Khoảng cách dọc | `112px 0 120px`, `50px`, `36px`, `27px`… | Không theo bội số chung |

**Kết luận chẩn đoán:** giao diện hiện tại được làm theo kiểu "mỗi mục tự trang trí".
Nó đẹp riêng lẻ nhưng không có hệ thống. So với 13 trang đã đọc: Panasonic dùng 4 giá trị
radius, LG dùng 3, keyence dùng 2. Không trang nào dùng 9.

Đây là gốc của cảm giác "chưa thành sản phẩm" — không phải thiếu hiệu ứng, mà **thừa hiệu ứng
không có quy tắc**.

---

## 1. Hệ thống thiết kế (design tokens)

Xây một lớp token, mọi component chỉ được dùng token, không viết số thô.

### 1.1 Thang khoảng cách — bội số 4

```css
--space-1: 4px;   --space-2: 8px;   --space-3: 12px;  --space-4: 16px;
--space-5: 20px;  --space-6: 24px;  --space-8: 32px;  --space-10: 40px;
--space-12: 48px; --space-16: 64px; --space-20: 80px; --space-24: 96px;
--space-32: 128px;
```

Khoảng cách dọc giữa các mục: **chỉ dùng 4 giá trị**

| Ngữ cảnh | Token | Giá trị |
|---|---|---|
| Trong một khối (giữa chữ và nút) | `--space-6` | 24px |
| Giữa các phần tử cùng cấp | `--space-8` | 32px |
| Giữa các mục lớn (desktop) | `--space-24` | 96px |
| Giữa các mục lớn (mobile) | `--space-16` | 64px |

Hiện tại là 112/120px — quá lớn, làm trang dài 6.700px. Giảm còn 96px tiết kiệm ~10% chiều dài
mà không chật.

### 1.2 Thang chữ — 8 bậc, không hơn

```css
--text-display: clamp(38px, 4.6vw, 60px);   /* H1 hero */
--text-h2:      clamp(28px, 3.2vw, 42px);   /* tiêu đề mục */
--text-h3:      clamp(19px, 1.7vw, 23px);   /* tiêu đề thẻ */
--text-lead:    clamp(17px, 1.4vw, 19px);   /* đoạn mở đầu mục */
--text-body:    16px;                        /* thân bài */
--text-small:   14px;                        /* chú thích, nhãn */
--text-micro:   12.5px;                      /* footnote, ngày tháng */
--text-eyebrow: 11px;                        /* nhãn mục, letter-spacing .12em */
```

Hiện tại có 12 giá trị clamp rời rạc. Gom còn 8.

**Line-height theo bậc:**

| Bậc | line-height | letter-spacing |
|---|---|---|
| display | 1.06 | -.045em |
| h2 | 1.1 | -.038em |
| h3 | 1.28 | -.02em |
| lead | 1.68 | 0 |
| body | 1.72 | 0 |
| small | 1.6 | 0 |
| micro | 1.5 | 0 |
| eyebrow | 1.4 | .12em |

### 1.3 Thang bo góc — 4 bậc

```css
--radius-sm: 8px;     /* input, chip nhỏ, tag */
--radius-md: 14px;    /* thẻ nhỏ, ảnh, banner trong */
--radius-lg: 22px;    /* thẻ bento, khối lớn */
--radius-pill: 999px; /* CHỈ dùng cho nút hành động và badge trạng thái */
```

Quy tắc: `999px` chỉ được dùng cho **phần tử bấm được** (nút, chip lọc) và **badge**.
Không dùng cho thẻ nội dung, ảnh, hay khối bao. Hiện tại 14 chỗ dùng, phải giảm còn ~6.

### 1.4 Bảng màu — 6 màu, không hơn

```css
/* Nền và chữ */
--ink:        #0b1a2b;   /* chữ chính, navy hiện tại — giữ */
--ink-soft:   #46566a;   /* chữ phụ */
--paper:      #ffffff;   /* nền chính */
--paper-alt:  #f6f8fb;   /* nền mục xen kẽ */

/* Nhấn — mỗi trụ cột một màu, dùng đúng một lần mỗi mục */
--accent-blue:   #1466f0;   /* 01 Sàn B2B */
--accent-teal:   #0d9488;   /* 02 Tiếp cận */
--accent-amber:  #b45309;   /* 03 Website */
--accent-slate:  #475569;   /* 04 Vận hành */
--line:          #e3e8f0;   /* viền, đường kẻ */
```

**Bỏ gradient ở mọi nơi trừ 2 chỗ:**
1. Viền trên của header (1px, 4 màu nhấn) — dấu nhận diện, giữ.
2. Nền hero (1 gradient rất nhạt, độ tương phản < 4%).

Mọi gradient khác chuyển thành màu phẳng `--paper-alt` hoặc màu nhấn với opacity.

### 1.5 Bóng đổ — 3 mức

```css
--shadow-1: 0 1px 2px rgb(11 26 43 / 6%);                    /* viền thay thế */
--shadow-2: 0 8px 24px rgb(11 26 43 / 7%);                   /* thẻ */
--shadow-3: 0 16px 40px rgb(11 26 43 / 10%);                 /* nổi, menu, dialog */
```

Hiện tại thẻ bento dùng `0 14px 36px ... / 7%` — gần `--shadow-2`, chỉ cần đổi sang token.

### 1.6 Lưới

Giữ container 1220px. Thêm lưới 12 cột có gutter cố định:

```css
--gutter: 24px;    /* desktop */
--gutter-sm: 16px; /* mobile */
```

Bento hiện tại dùng `gap: 20px` (lệch thang). Đổi về 24px.

---

## 2. Bố cục từng màn

### 2.1 Trang chủ `/` — nhà sản xuất Việt

```
┌─────────────────────────────────────────────────────────┐
│ HEADER 68px sticky · nav · lang · CTA                   │
├─────────────────────────────────────────────────────────┤
│ HERO                                                     │
│  ┌──────────────────────┬─────────────────────────┐     │
│  │ eyebrow (11px)       │  mosaic 2×3             │     │
│  │ H1 (display)         │  ┌───────┬───────┐      │     │
│  │ lead (17–19px)       │  │ ảnh   │ ảnh   │      │     │
│  │ [CTA] [CTA phụ]      │  ├───────┼───────┤      │     │
│  │ footnote (12.5px)    │  │ ảnh   │ ảnh   │      │     │
│  │                      │  ├───────┴───────┤      │     │
│  │                      │  │ vector map    │      │     │
│  │                      │  └───────────────┘      │     │
│  └──────────────────────┴─────────────────────────┘     │
│  ── stat band: 3 số ────────────────────────────────    │
│  pathway: 3 mũi tên ▸ ▸ ▸                               │
├─────────────────────────────────────────────────────────┤
│ MARQUEE 8 ngành hàng · dải tối · 40px                    │
├─────────────────────────────────────────────────────────┤
│ 01 / BỐN TRỤ CỘT                                        │
│  intro: H2 trái (1.17fr) + lead phải (.83fr)            │
│  ┌───────────────────────┬────────────────┐             │
│  │ bentoLead span 7      │ bentoPair span5│             │
│  ├───────────────────────┴────────────────┤             │
│  │ bentoWide span 12                      │             │
│  ├────────────────────────────────────────┤             │
│  │ bentoWideAlt span 12 (ảnh trái)        │             │
│  └────────────────────────────────────────┘             │
├─────────────────────────────────────────────────────────┤
│ PROOF STRIP · ảnh chụp thật + nhãn thời gian            │
├─────────────────────────────────────────────────────────┤
│ 02 / VẤN ĐỀ PHỤ THUỘC · 2 cột + ảnh rộng               │
├─────────────────────────────────────────────────────────┤
│ 03 / BA GÓI · bảng so sánh 3 cột × 6 dòng              │
├─────────────────────────────────────────────────────────┤
│ FAQ 8 câu · accordion                                   │
├─────────────────────────────────────────────────────────┤
│ TUÂN THỦ · dải hẹp, link 4 dịch vụ                      │
├─────────────────────────────────────────────────────────┤
│ CTA cuối · nền tối · 2 nút                              │
├─────────────────────────────────────────────────────────┤
│ FOOTER 4 cột                                            │
└─────────────────────────────────────────────────────────┘
```

Thay đổi so với hiện tại:
- **Thêm stat band** dưới hero (Giai đoạn 1).
- **Thêm marquee** sau hero (Giai đoạn 5).
- **Thêm proof strip** (Giai đoạn 4).
- **Đổi 3 thẻ gói → bảng so sánh** (Giai đoạn 5).
- **Thêm FAQ** (Giai đoạn 5).
- Giảm padding dọc 112/120px → 96px.

### 2.2 Trang `/en` — người mua quốc tế (xây mới)

Cố ý **khác cấu trúc** với `/`, không phải bản dịch:

```
┌─────────────────────────────────────────────────────────┐
│ HEADER · nav EN · search icon · CTA "Browse suppliers"  │
├─────────────────────────────────────────────────────────┤
│ HERO — KHÔNG ảnh mosaic                                  │
│  H1: "Verified Vietnamese suppliers, by product."        │
│  lead: 1 câu                                             │
│  ┌────────────────────────────────────────────────┐     │
│  │ [ Tìm ngành hàng…              ]  [ Tìm ]      │     │
│  └────────────────────────────────────────────────┘     │
│  3 gợi ý: cashew · spices · coffee                       │
├─────────────────────────────────────────────────────────┤
│ DANH MỤC 8 ngành · lưới 4×2 · CategoryTile              │
│  mỗi thẻ: ảnh · tên ngành · N nhà cung cấp · N mặt hàng │
├─────────────────────────────────────────────────────────┤
│ CÁCH XÁC MINH · 4 bước ngang, đánh số 01–04             │
├─────────────────────────────────────────────────────────┤
│ NHÀ CUNG CẤP NỔI BẬT · lưới 3×2 · SupplierCard          │
│  ảnh nhà máy · tên · ngành · chứng nhận · năm thành lập │
├─────────────────────────────────────────────────────────┤
│ TÀI LIỆU · DocList 4 dòng, có định dạng + dung lượng    │
├─────────────────────────────────────────────────────────┤
│ FAQ 6 câu người mua hỏi                                 │
├─────────────────────────────────────────────────────────┤
│ CTA · form ngắn: ngành hàng + thị trường + sản lượng    │
└─────────────────────────────────────────────────────────┘
```

**Điểm khác biệt có chủ ý:** `/en` đặt **tìm kiếm lên hero**, `/` đặt **câu chuyện + ảnh**.
Người mua quốc tế cần tìm; nhà máy Việt cần thuyết phục.

### 2.3 Trang `/san` — Vexim Trade

```
HEADER (dùng chung)
├─ Breadcrumb: Trang chủ › Vexim Trade
├─ H1: "Danh mục hàng xuất khẩu"
├─ Bộ lọc ngang: [Ngành hàng ▾] [Thị trường ▾] [Chứng nhận ▾]
│   tab nhu cầu: Tất cả · Mới duyệt · Đang chào hàng
├─ Lưới 3 cột SupplierCard (mobile 1 cột)
│   phân trang hoặc "Tải thêm"
└─ CTA nhà cung cấp: "Đăng hồ sơ nhà máy"
```

Bộ lọc đặt tên theo **việc người mua quan tâm** (Panasonic), không theo thuộc tính kỹ thuật.

---

## 3. Thư viện component

| Component | Kích thước | Ghi chú |
|---|---|---|
| `Header` | cao 68px, sticky | Giữ nguyên, chỉ đổi token |
| `StatBand` | 3 cột, mobile 1×3 | Số `--text-h2`, nhãn `--text-micro` |
| `Marquee` | cao 44px, chạy 40s | Dừng khi hover; `prefers-reduced-motion` → tĩnh |
| `BentoCard` | radius `--radius-lg`, `--shadow-2` | Giữ 4 thẻ, bỏ gradient nền |
| `ProofStrip` | ảnh 16:10, nhãn dưới | Mỗi ảnh có `date` |
| `CompareTable` | 3 cột × 6 dòng | Sticky header cột, mobile → 3 thẻ |
| `FaqList` | accordion, `--radius-md` | `<details>` gốc, không JS |
| `DocList` | mỗi dòng: icon · tên · định dạng · dung lượng · ngày | |
| `CategoryTile` | ảnh 4:3 + 3 dòng chữ | |
| `SupplierCard` | ảnh 16:9 + 4 dòng | |
| `SearchField` | cao 52px, `--radius-pill` | Chỉ ở `/en` và `/san` |

### Quy tắc responsive

Ba mốc, không hơn (hiện tại có 4–5 mốc rời rạc):

| Mốc | Áp dụng |
|---|---|
| `≤ 720px` | mobile: mọi lưới về 1 cột, padding dọc 64px, container `100% - 36px` |
| `721–1024px` | tablet: lưới 2 cột, bento giữ span nhưng wide xếp dọc |
| `> 1024px` | desktop: lưới 12 cột, container 1220px |

---

## 4. Chữ — quy tắc trình bày

### 4.1 Độ dài dòng
- Thân bài: `max-width: 68ch` (hiện tại 390px ở cột phụ — hơi hẹp, nâng lên 430–460px)
- Lead: `max-width: 60ch`
- Tiêu đề: `text-wrap: balance` (đã có, giữ)

### 4.2 Nhịp đoạn
Đoạn tối đa 3 câu. Câu dài hơn 22 từ thì tách. Đây là quy tắc từ giọng Agentcy đã chốt.

### 4.3 Số liệu
Mọi con số trong `StatBand` render theo cấu trúc:

```
┌──────────────┐
│ 20           │  ← --text-h2, weight 700, tabular-nums
│ năm          │  ← đơn vị, --text-small, --ink-soft
│ làm chứng từ │  ← nhãn, --text-micro
└──────────────┘
```

Không viết "20+ năm kinh nghiệm" trong một dòng — tách số ra để mắt bắt được.

### 4.4 Nhãn thời gian
Mọi ảnh proof, mọi số liệu động đều có nhãn `tính đến 11/2026` ở `--text-micro`, màu `--ink-soft`.

---

## 5. Chuyển đổi từ hiện tại — theo thứ tự an toàn

Việc đổi 33 gradient và 14 pill cùng lúc sẽ vỡ giao diện. Làm theo 4 bước, mỗi bước
build + verify xong mới sang bước sau:

| Bước | Việc | Rủi ro | Kiểm tra |
|---|---|---|---|
| 1 | Thêm file `styles/tokens.css`, khai báo token, **chưa dùng** | Không | Build |
| 2 | Đổi thang chữ + padding dọc sang token | Thấp | Visual diff 1440px |
| 3 | Bỏ gradient ở bento và solutions, đổi sang màu phẳng | Trung bình | Visual diff cả 2 ngôn ngữ |
| 4 | Gom radius 999px, chỉ giữ ở nút và badge | Trung bình | Visual diff + mobile 390px |

Sau mỗi bước: `verify-homepage.mjs` phải vẫn 19/19 PASS, CLS vẫn 0.0000.

---

## 6. Những gì giữ nguyên tuyệt đối

Đã kiểm chứng tốt, không được đụng:

- Bento grid 7/5 + wide + wideAlt — bố cục đã đúng nhịp
- Container 1220px
- Font Be Vietnam Pro self-host
- Header sticky 68px + dropdown ngôn ngữ có bàn phím
- Vector map ở hero
- Màu navy `#0b1a2b` làm màu chữ chính
- Toàn bộ logic SSR/hreflang/middleware

---

## 7. Câu hỏi cần chốt

1. **Bỏ gradient — bạn có đồng ý không?** Đây là thay đổi thị giác lớn nhất. Hiện 33 chỗ;
   mình đề xuất giữ 2 (viền header, nền hero nhạt). Nếu bạn thích gradient ở bento thì giữ,
   nhưng phải thống nhất một hướng: hoặc loang màu toàn trang, hoặc phẳng toàn trang.
2. **Giảm padding dọc 112 → 96px?** Trang hiện dài 6.700px, giảm được ~600px.
3. **Bảng so sánh 3 gói thay 3 thẻ rời?** Hiện 3 thẻ chiếm gần 1 màn hình mà không so sánh được.
