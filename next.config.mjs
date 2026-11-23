/** @type {import('next').NextConfig} */
const nextConfig = {
  // Root layout selects the document language per request. Next 15 otherwise
  // streams dynamic metadata into <body> for ordinary browsers, so Lighthouse
  // (and some parsers) miss the description/canonical. Keep metadata in <head>.
  htmlLimitedBots: /.*/,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  /*
   * Ảnh/font trong /public được Next phục vụ với `Cache-Control: public, max-age=0`
   * (buộc trình duyệt hỏi lại bằng ETag mỗi lần). Lighthouse xếp cả trang chủ vào
   * nhóm "bộ nhớ đệm hiệu dụng ngắn" (~773 KiB) và khách quay lại phải chờ một
   * vòng 304 cho từng ảnh. Các tệp dưới đây là nội dung tĩnh đã đóng băng, nên
   * cho cache dài.
   *
   * Khi thay ảnh mà giữ nguyên tên tệp, phải đổi tên tệp — nếu không trình duyệt
   * cũ sẽ tiếp tục dùng bản cũ tới 1 năm.
   */
  async headers() {
    const immutable = [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }]
    return [
      { source: "/trade/images/:asset(.*[.]webp)", headers: immutable },
      { source: "/trade/fonts/:asset(.*[.]woff2)", headers: immutable },
      { source: "/trade/:asset(trade[.][a-f0-9]+[.]js)", headers: immutable },
      { source: "/home/:path*", headers: immutable },
      { source: "/images/:path*", headers: immutable },
      { source: "/fonts/:path*", headers: immutable },
      // `og-image.jpg`, `og-image-vi.jpg`, `og-image-en.jpg`… (route source của
      // Next không nhận capture group).
      { source: "/og-image.jpg", headers: immutable },
      { source: "/og-image-vi.jpg", headers: immutable },
      { source: "/og-image-en.jpg", headers: immutable },
      { source: "/apple-touch-icon.png", headers: immutable },
    ]
  },
  async redirects() {
    return [
      /*
       * FDA Tracker đã ngừng hoạt động (không còn ai sử dụng). Giữ 301 cho
       * các URL cũ còn nằm trong header cũ, email đã gửi và kết quả tìm kiếm,
       * để người dùng không gặp 404 và Google chuyển tín hiệu về trang FDA.
       */
      {
        source: "/fda-tracker",
        destination: "/services/fda",
        permanent: true,
      },
      {
        source: "/fda-tracker/:path*",
        destination: "/services/fda",
        permanent: true,
      },
      /*
       * Tiếng Việt trở thành ngôn ngữ mặc định ở URL gốc; bản tiếng Anh dời
       * sang /en. Hai URL /vi cũ đã được Google index, nên chuyển 301 (308
       * trong Next) về bản tiếng Việt mới thay vì để 404.
       */
      {
        source: "/vi",
        destination: "/",
        permanent: true,
      },
      {
        source: "/vi/privacy",
        destination: "/privacy",
        permanent: true,
      },
      /*
       * Ép toàn bộ traffic từ bản KHÔNG www -> bản CÓ www (chuẩn SEO, đồng nhất sitemap).
       *
       * `permanent: true` trả về 308, KHÔNG phải 301. Google coi 308 tương đương 301
       * khi hợp nhất canonical, nhưng audit yêu cầu rõ 301 và một số công cụ crawl
       * cũ chỉ nhận 301 — nên khai báo statusCode tường minh.
       *
       * `has: [{ type: "host" }]` giới hạn đúng host "veximglobal.com", nên không ảnh
       * hưởng *.vercel.app hay localhost.
       */
      {
        source: "/:path*",
        has: [{ type: "host", value: "veximglobal.com" }],
        destination: "https://www.veximglobal.com/:path*",
        statusCode: 301,
      },
    ]
  },
}

export default nextConfig
