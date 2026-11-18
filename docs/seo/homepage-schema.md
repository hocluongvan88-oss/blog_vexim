# Schema trang chủ Vexim Global — định vị B2B Digital Export

Được sinh từ code hiện tại. Không chép lại dữ liệu cũ và không tự thêm giá, tọa độ, số liệu thứ hạng hoặc chứng nhận.

- Trang chủ tiếng Anh: canonical/OG **https://www.veximglobal.com/en**, WebPage **en**.
- Trang chủ tiếng Việt: canonical/OG **https://www.veximglobal.com**, WebPage **vi-VN**; hai trang có hreflang hai chiều và trong sitemap. JSON-LD tiếng Việt nằm tại `homepage-schema-vi.json`.
- WebSite: tiếng Anh và tiếng Việt; blog và trang dịch vụ vẫn chỉ có tiếng Việt cho đến khi có bản dịch được biên tập và duyệt.
- Organization / LocalBusiness: một node chung toàn website, số điện thoại **+84373685634**, email **contact@veximglobal.com**, địa chỉ **25/6/51 Ngọa Long, Tây Tựu, Hà Nội**.
- Slogan doanh nghiệp được giữ như thông tin thương hiệu đã xác nhận; nội dung mỗi trang chủ theo ngôn ngữ của URL.
- Service chính: tìm khách hàng nhập khẩu cho doanh nghiệp thực phẩm; ba dịch vụ hiển thị: sàn B2B Vexim Trade, SEO quốc tế và website xuất khẩu. Không có giá hoặc cam kết thứ hạng.
- FDA, GACC, MoCRA và US Agent là liên kết phụ; 6 định danh service trang dịch vụ trước đây vẫn giữ nguyên trên từng landing page, không còn là catalog chính của trang chủ.
- Ảnh OG cho mỗi ngôn ngữ là tệp thực 1200×630, không chứa số liệu minh họa như hiệu suất thật.

## Cách sử dụng

Root layout xuất Organization/LocalBusiness, Logo và WebSite. Mỗi trang chủ xuất WebPage, ImageObject, Vexim Trade Organization và Service theo ngôn ngữ của mình. Dùng chung @id doanh nghiệp nhưng mỗi WebPage/Service có @id riêng; **không chèn** bản gộp này thêm lần nữa vào Next.js.

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
      "description": "Vexim Global builds the export sales channel for Vietnamese manufacturers: the Vexim Trade B2B marketplace, product websites buyers can check, buyer work in each target market, and monthly content that keeps it current. Regulatory resources remain available separately.",
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
      "@id": "https://www.veximglobal.com/en#webpage",
      "url": "https://www.veximglobal.com/en",
      "name": "Reach International Buyers for Vietnamese Food Exports | Vexim Global",
      "description": "Connect with food importers through the Vexim Trade B2B marketplace, international SEO and an export website. Explore practical support for Vietnamese suppliers.",
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
        "@id": "https://www.veximglobal.com/en#service"
      },
      "primaryImageOfPage": {
        "@id": "https://www.veximglobal.com/en#primaryimage"
      }
    },
    {
      "@type": "ImageObject",
      "@id": "https://www.veximglobal.com/en#primaryimage",
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
      "@id": "https://www.veximglobal.com/en#service",
      "name": "Connect with food importers looking for suppliers in Vietnam",
      "description": "Vexim Global brings together the Vexim Trade B2B marketplace, international SEO and export websites. Help buyers find your business, review your capabilities and request a quote directly.",
      "url": "https://www.veximglobal.com/en",
      "provider": {
        "@id": "https://www.veximglobal.com/#organization"
      },
      "mainEntityOfPage": {
        "@id": "https://www.veximglobal.com/en#webpage"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "@id": "https://www.veximglobal.com/en#offer-catalog",
        "name": "Services for food exporters",
        "itemListElement": [
          {
            "@type": "Offer",
            "url": "https://www.veximglobal.com/en#trade",
            "itemOffered": {
              "@type": "Service",
              "@id": "https://www.veximglobal.com/en#offer-trade",
              "name": "Vexim Trade",
              "description": "A storefront for Vietnam’s food exporters. Importers can review your profile, compare supply capabilities and send quote requests straight to your team.",
              "url": "https://www.veximglobal.com/en#trade",
              "provider": {
                "@id": "https://www.veximglobal.com/#organization"
              }
            }
          },
          {
            "@type": "Offer",
            "url": "https://www.veximglobal.com/en#seo",
            "itemOffered": {
              "@type": "Service",
              "@id": "https://www.veximglobal.com/en#offer-seo",
              "name": "International SEO",
              "description": "Help buyers in your target markets discover accurate supplier information on Google and AI search tools.",
              "url": "https://www.veximglobal.com/en#seo",
              "provider": {
                "@id": "https://www.veximglobal.com/#organization"
              }
            }
          },
          {
            "@type": "Offer",
            "url": "https://www.veximglobal.com/en#website",
            "itemOffered": {
              "@type": "Service",
              "@id": "https://www.veximglobal.com/en#offer-website",
              "name": "Export websites",
              "description": "A multilingual company profile with factory credentials, current documentation and a clear route to a quote.",
              "url": "https://www.veximglobal.com/en#website",
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
