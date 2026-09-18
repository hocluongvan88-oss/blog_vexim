import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /client-portal/ là khu đăng nhập của khách hàng — không có nội dung cho search engine
        disallow: ["/admin/", "/api/", "/client-portal/"],
      },
    ],
    sitemap: "https://www.veximglobal.com/sitemap.xml",
  }
}
