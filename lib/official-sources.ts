/**
 * Nguồn chính thống theo danh mục — dùng cho panel "Nguồn & tham chiếu" trong trình soạn thảo.
 *
 * Vì sao cần: blog Vexim viết về quy định xuất khẩu (FDA, GACC, MFDS…) — nội dung ảnh hưởng
 * trực tiếp tới quyết định kinh doanh của người đọc. Google xếp nhóm này vào diện cần độ tin cậy
 * cao (E-E-A-T/YMYL); dẫn nguồn gốc cũng là cách hiệu quả nhất để được AI Overviews trích dẫn.
 */

export interface OfficialSource {
  title: string
  url: string
  note?: string
}

const FDA_SOURCES: OfficialSource[] = [
  {
    title: "FDA — Registration of Food Facilities",
    url: "https://www.fda.gov/food/food-facility-registration",
    note: "Đăng ký cơ sở sản xuất thực phẩm",
  },
  {
    title: "FDA — Food Safety Modernization Act (FSMA)",
    url: "https://www.fda.gov/food/food-safety-modernization-act-fsma",
    note: "Quy định an toàn thực phẩm hiện hành",
  },
  {
    title: "FDA — Prior Notice of Imported Food",
    url: "https://www.fda.gov/food/importing-food-products-united-states/prior-notice-imported-food-shipments",
    note: "Khai báo trước khi nhập khẩu",
  },
  {
    title: "FDA — Food Labeling Guide",
    url: "https://www.fda.gov/food/food-labeling-nutrition",
    note: "Yêu cầu nhãn theo 21 CFR",
  },
]

const GACC_SOURCES: OfficialSource[] = [
  {
    title: "GACC — Tổng cục Hải quan Trung Quốc",
    url: "http://www.customs.gov.cn/",
    note: "Cơ quan quản lý đăng ký xuất khẩu vào Trung Quốc",
  },
  {
    title: "GACC — Hệ thống đăng ký doanh nghiệp xuất khẩu (CIFER)",
    url: "https://cifer.singlewindow.cn/",
    note: "Nộp hồ sơ đăng ký trực tuyến",
  },
  {
    title: "Bộ Nông nghiệp & Nông thôn Trung Quốc",
    url: "http://www.moa.gov.cn/",
    note: "Quy định về thực phẩm nguồn gốc động/thực vật",
  },
]

const MFDS_SOURCES: OfficialSource[] = [
  {
    title: "MFDS — Bộ An toàn Thực phẩm và Dược phẩm Hàn Quốc",
    url: "https://www.mfds.go.kr/eng/",
    note: "Cổng thông tin chính thức (tiếng Anh)",
  },
  {
    title: "MFDS — Imported Food Information (Food Safety Korea)",
    url: "https://www.foodsafetykorea.go.kr/",
    note: "Khai báo và tra cứu sản phẩm nhập khẩu",
  },
  {
    title: "MFDS — Cosmetics Regulation",
    url: "https://www.mfds.go.kr/eng/wpge/m_27/de010035l001.do",
    note: "Quy định mỹ phẩm nhập khẩu",
  },
]

const GENERAL_SOURCES: OfficialSource[] = [
  {
    title: "Tổng cục Hải quan Việt Nam",
    url: "https://www.customs.gov.vn/",
    note: "Biểu thuế, thủ tục hải quan",
  },
  {
    title: "Bộ Công Thương — Cổng thông tin xuất nhập khẩu",
    url: "https://moit.gov.vn/",
    note: "Chính sách thương mại, hiệp định",
  },
  {
    title: "Bộ Y tế — An toàn thực phẩm",
    url: "https://moh.gov.vn/",
    note: "Quy định trong nước về an toàn thực phẩm",
  },
]

/** Gợi ý nguồn theo danh mục bài viết (khớp slug trong lib/blog-categories.ts). */
export function getOfficialSources(category: string): OfficialSource[] {
  if (/FDA/i.test(category)) return FDA_SOURCES
  if (/GACC/i.test(category)) return GACC_SOURCES
  if (/MFDS/i.test(category)) return MFDS_SOURCES
  return GENERAL_SOURCES
}
