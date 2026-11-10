# Schema trang chủ Vexim Global — định vị B2B Digital Export

Được sinh từ code hiện tại. Không chép lại dữ liệu cũ và không tự thêm giá, tọa độ, số liệu thứ hạng hoặc chứng nhận.

- Canonical / OG / sitemap: **https://www.veximglobal.com**.
- Trang chủ WebPage: **en**; WebSite: tiếng Anh và tiếng Việt (blog/dịch vụ còn bằng tiếng Việt).
- Organization / LocalBusiness: một node chung toàn website, số điện thoại **+84373685634**, email **contact@veximglobal.com**, địa chỉ **25/6/51 Ngọa Long, Tây Tựu, Hà Nội**.
- Slogan doanh nghiệp được giữ như thông tin thương hiệu đã xác nhận; phần chữ nhìn thấy trên trang chủ đều tiếng Anh.
- Service chính: hạ tầng xuất khẩu B2B và Buyer-Intent SEO; ba phạm vi hợp tác được đề xuất: B2B Launchpad, Global Growth Engine, Enterprise Dominance. Không có giá hoặc cam kết thứ hạng.
- FDA, GACC, MoCRA và US Agent là liên kết phụ; 6 định danh service trang dịch vụ trước đây vẫn giữ nguyên trên từng landing page, không còn là catalog chính của trang chủ.
- Ảnh trang chủ/OG là tệp thực 1200×630, không chứa số liệu minh họa như hiệu suất thật.

## Cách sử dụng

Root layout xuất Organization/LocalBusiness, Logo và WebSite. Trang chủ xuất WebPage, ImageObject, Vexim Trade Organization và Service. Dùng chung @id nhưng **không chèn** bản gộp này thêm lần nữa vào Next.js.

## JSON-LD hoàn chỉnh

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": [
        "Organization",
        "LocalBusiness"
      ],
      "@id": "https://www.veximglobal.com/#organization",
      "name": "Vexim Global",
      "alternateName": "Vexim",
      "url": "https://www.veximglobal.com",
      "slogan": "Tử Tế - Tận Tâm - Trách Nhiệm",
      "logo": {
        "@id": "https://www.veximglobal.com/#logo"
      },
      "image": {
        "@id": "https://www.veximglobal.com/#logo"
      },
      "description": "Vexim Global builds digital export foundations for Vietnamese manufacturers: B2B web infrastructure, buyer-intent SEO and connections to the Vexim Trade ecosystem. Regulatory resources remain available separately.",
      "telephone": "+84373685634",
      "email": "contact@veximglobal.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "25/6/51 Ngọa Long, Tây Tựu",
        "addressLocality": "Hà Nội",
        "addressCountry": "VN"
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "https://schema.org/Monday",
            "https://schema.org/Tuesday",
            "https://schema.org/Wednesday",
            "https://schema.org/Thursday",
            "https://schema.org/Friday"
          ],
          "opens": "08:00",
          "closes": "18:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "https://schema.org/Saturday"
          ],
          "opens": "08:00",
          "closes": "12:00"
        }
      ],
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "contactType": "customer support",
          "telephone": "+84373685634",
          "email": "contact@veximglobal.com",
          "areaServed": [
            "VN",
            "US"
          ],
          "availableLanguage": [
            "Vietnamese",
            "English"
          ]
        }
      ],
      "areaServed": [
        {
          "@type": "Country",
          "name": "Việt Nam",
          "identifier": "VN"
        },
        {
          "@type": "Country",
          "name": "Hoa Kỳ",
          "identifier": "US"
        }
      ],
      "sameAs": [
        "https://www.facebook.com/profile.php?id=61568290953268",
        "https://www.linkedin.com/company/143976436/",
        "https://zalo.me/0373685634"
      ]
    },
    {
      "@type": "ImageObject",
      "@id": "https://www.veximglobal.com/#logo",
      "url": "https://www.veximglobal.com/logo.png",
      "contentUrl": "https://www.veximglobal.com/logo.png",
      "width": 824,
      "height": 543,
      "caption": "Vexim Global"
    },
    {
      "@type": "WebSite",
      "@id": "https://www.veximglobal.com/#website",
      "name": "Vexim Global",
      "url": "https://www.veximglobal.com",
      "inLanguage": [
        "en",
        "vi-VN"
      ],
      "publisher": {
        "@id": "https://www.veximglobal.com/#organization"
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://www.veximglobal.com/#webpage",
      "url": "https://www.veximglobal.com",
      "name": "B2B Digital Export Infrastructure | Vexim Global",
      "description": "Vexim Global builds B2B export websites, buyer-intent SEO and Vexim Trade connections for Vietnamese manufacturers entering international markets.",
      "inLanguage": "en",
      "isPartOf": {
        "@id": "https://www.veximglobal.com/#website"
      },
      "about": {
        "@id": "https://www.veximglobal.com/#organization"
      },
      "publisher": {
        "@id": "https://www.veximglobal.com/#organization"
      },
      "mainEntity": {
        "@id": "https://www.veximglobal.com/#service"
      },
      "primaryImageOfPage": {
        "@id": "https://www.veximglobal.com/#primaryimage"
      }
    },
    {
      "@type": "ImageObject",
      "@id": "https://www.veximglobal.com/#primaryimage",
      "url": "https://www.veximglobal.com/og-image.jpg",
      "contentUrl": "https://www.veximglobal.com/og-image.jpg",
      "width": 1200,
      "height": 630
    },
    {
      "@type": "Organization",
      "@id": "https://veximtrade.com/#organization",
      "name": "Vexim Trade",
      "url": "https://veximtrade.com/",
      "logo": "https://www.veximglobal.com/trade/apple-touch-icon.png?v=vexim",
      "description": "Danh bạ nhà cung cấp nông sản Việt Nam dành cho người mua nước ngoài.",
      "parentOrganization": {
        "@id": "https://www.veximglobal.com/#organization"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Số 25/6/51 Ngoạ Long, Tây Tựu",
        "addressLocality": "Bắc Từ Liêm",
        "addressRegion": "Hà Nội",
        "addressCountry": "VN"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+84373685634",
        "email": "contact@veximglobal.com",
        "contactType": "customer service",
        "availableLanguage": [
          "vi",
          "en"
        ]
      }
    },
    {
      "@type": "Service",
      "@id": "https://www.veximglobal.com/#service",
      "name": "Global B2B Digital Infrastructure & Export Acceleration",
      "serviceType": "B2B Digital Export Infrastructure & Buyer-Intent SEO",
      "description": "Vexim Global builds B2B export websites, buyer-intent SEO and Vexim Trade connections for Vietnamese manufacturers entering international markets.",
      "url": "https://www.veximglobal.com",
      "provider": {
        "@id": "https://www.veximglobal.com/#organization"
      },
      "mainEntityOfPage": {
        "@id": "https://www.veximglobal.com/#webpage"
      },
      "audience": {
        "@type": "BusinessAudience",
        "audienceType": "Vietnamese manufacturers exporting to international buyers"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "@id": "https://www.veximglobal.com/#offer-catalog",
        "name": "Digital export infrastructure engagement scopes",
        "itemListElement": [
          {
            "@type": "Offer",
            "url": "https://www.veximglobal.com/#services",
            "itemOffered": {
              "@type": "Service",
              "@id": "https://www.veximglobal.com/#service-core",
              "name": "B2B Launchpad",
              "description": "A focused digital export starting point for one product line.",
              "serviceType": "Digital export infrastructure",
              "url": "https://www.veximglobal.com/#services",
              "provider": {
                "@id": "https://www.veximglobal.com/#organization"
              }
            }
          },
          {
            "@type": "Offer",
            "url": "https://www.veximglobal.com/#services",
            "itemOffered": {
              "@type": "Service",
              "@id": "https://www.veximglobal.com/#service-growth",
              "name": "Global Growth Engine",
              "description": "An ongoing search, content and inquiry operation across a broader catalog.",
              "serviceType": "Digital export infrastructure",
              "url": "https://www.veximglobal.com/#services",
              "provider": {
                "@id": "https://www.veximglobal.com/#organization"
              }
            }
          },
          {
            "@type": "Offer",
            "url": "https://www.veximglobal.com/#services",
            "itemOffered": {
              "@type": "Service",
              "@id": "https://www.veximglobal.com/#service-enterprise",
              "name": "Enterprise Dominance",
              "description": "A tailored export agency retainer aligned with your product and market complexity.",
              "serviceType": "Digital export infrastructure",
              "url": "https://www.veximglobal.com/#services",
              "provider": {
                "@id": "https://www.veximglobal.com/#organization"
              }
            }
          }
        ]
      }
    }
  ]
}
</script>
```

## Giới hạn

Schema phù hợp nội dung hiện tại của code; chưa xác nhận việc Google hiển thị rich results hay kết quả production. Không ngụ ý vị trí SEO hoặc chuyển đổi. Tạo lại bằng `npm run schema:export`, kiểm tra `npm run test:schema`.
