export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: "FDA" | "GACC" | "MFDS" | "Tin tức thị trường" | "Xuất nhập khẩu" | "Kiến thức pháp lý"
  featuredImage: string
  metaTitle: string
  metaDescription: string
  author: string
  date: string
  status: "draft" | "published"
}

// Mock data cho blog posts
export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "huong-dan-dang-ky-fda-2026",
    title: "Hướng dẫn mới nhất về đăng ký FDA năm 2026",
    excerpt:
      "Cập nhật các quy định mới của FDA cho doanh nghiệp xuất khẩu thực phẩm và mỹ phẩm sang thị trường Mỹ trong năm 2026.",
    content: `
      <h2>Tổng quan về đăng ký FDA 2026</h2>
      <p>Cơ quan Quản lý Thực phẩm và Dược phẩm Hoa Kỳ (FDA) đã công bố một loạt các quy định mới có hiệu lực từ đầu năm 2026...</p>
      
      <h3>Những thay đổi quan trọng</h3>
      <p>Các doanh nghiệp xuất khẩu thực phẩm, mỹ phẩm và thiết bị y tế cần lưu ý những điểm sau:</p>
      <ul>
        <li>Thời gian xử lý hồ sơ được rút ngắn từ 60 xuống 45 ngày</li>
        <li>Yêu cầu bổ sung thông tin về nguồn gốc nguyên liệu</li>
        <li>Tăng cường kiểm tra về an toàn thực phẩm theo FSMA 204</li>
      </ul>
      
      <h3>Cách thức tuân thủ</h3>
      <p>Vexim Global khuyến nghị doanh nghiệp nên chuẩn bị hồ sơ sớm và đảm bảo đầy đủ các yêu cầu mới...</p>
    `,
    category: "FDA",
    featuredImage: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1200",
    metaTitle: "Hướng dẫn đăng ký FDA 2026 - Cập nhật quy định mới nhất",
    metaDescription:
      "Tìm hiểu các quy định mới của FDA năm 2026 và cách thức tuân thủ cho doanh nghiệp xuất khẩu Việt Nam.",
    author: "Vexim Global",
    date: "15/01/2026",
    status: "published",
  },
  {
    id: "2",
    slug: "thay-doi-quy-trinh-gacc",
    title: "Thay đổi trong quy trình đăng ký mã GACC Trung Quốc",
    excerpt:
      "Tổng cục Hải quan Trung Quốc công bố các điều chỉnh quan trọng trong quy trình cấp mã số GACC cho doanh nghiệp nước ngoài.",
    content: `
      <h2>Quy trình GACC mới 2026</h2>
      <p>Tổng cục Hải quan Trung Quốc (GACC) đã thực hiện nhiều thay đổi quan trọng nhằm đơn giản hóa quy trình đăng ký...</p>
    `,
    category: "GACC",
    featuredImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200",
    metaTitle: "Thay đổi quy trình đăng ký mã GACC Trung Quốc 2026",
    metaDescription:
      "Cập nhật các thay đổi mới nhất trong quy trình cấp mã GACC cho doanh nghiệp xuất khẩu vào thị trường Trung Quốc.",
    author: "Vexim Global",
    date: "12/01/2026",
    status: "published",
  },
  {
    id: "3",
    slug: "xu-huong-xuat-khau-eu-2026",
    title: "Xu hướng xuất khẩu sang thị trường EU 2026",
    excerpt:
      "Phân tích các cơ hội và thách thức cho doanh nghiệp Việt Nam khi xuất khẩu sản phẩm sang thị trường châu Âu.",
    content: `
      <h2>Thị trường EU - Cơ hội và thách thức</h2>
      <p>Liên minh châu Âu tiếp tục là một trong những thị trường xuất khẩu tiềm năng nhất cho doanh nghiệp Việt Nam...</p>
    `,
    category: "Tin tức thị trường",
    featuredImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200",
    metaTitle: "Xu hướng xuất khẩu EU 2026 - Cơ hội cho doanh nghiệp Việt",
    metaDescription:
      "Phân tích chi tiết về xu hướng xuất khẩu sang thị trường EU và cách thức tận dụng hiệp định EVFTA.",
    author: "Vexim Global",
    date: "08/01/2026",
    status: "published",
  },
]

export function getBlogPosts(category?: string): BlogPost[] {
  if (category && category !== "all") {
    return blogPosts.filter((post) => post.category === category && post.status === "published")
  }
  return blogPosts.filter((post) => post.status === "published")
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}
