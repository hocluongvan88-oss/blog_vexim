/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      // Ép toàn bộ traffic từ bản KHÔNG www -> bản CÓ www (chuẩn SEO, đồng nhất sitemap)
      // permanent: true => trả về HTTP 308 (Google xử lý tương đương 301 cho việc canonical).
      // Chỉ áp dụng đúng host "veximglobal.com", nên không ảnh hưởng *.vercel.app hay localhost.
      {
        source: "/:path*",
        has: [{ type: "host", value: "veximglobal.com" }],
        destination: "https://www.veximglobal.com/:path*",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
