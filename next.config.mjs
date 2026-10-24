/** @type {import('next').NextConfig} */
const nextConfig = {
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
