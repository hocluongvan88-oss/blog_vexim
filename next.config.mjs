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
  async headers() {
    return [
      { source: "/trade/images/:asset(.*[.]webp)", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/trade/fonts/:asset(.*[.]woff2)", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/trade/:asset(trade[.][a-f0-9]+[.]js)", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
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
