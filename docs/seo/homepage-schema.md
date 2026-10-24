# Schema trang chủ Vexim Global — bản hiện tại

Bản này được sinh từ cấu hình đang dùng trong repository, không lấy lại dữ liệu cũ hoặc tự thêm giá, tọa độ, đánh giá khách hàng.

- Domain: **https://www.veximglobal.com** (khớp canonical/OG/sitemap).
- Email: **contact@veximglobal.com**. Điện thoại: **+84373685634**.
- Địa chỉ: **25/6/51 Ngọa Long, Tây Tựu, Hà Nội**.
- Slogan: **Tử Tế - Tận Tâm - Trách Nhiệm**.
- Giờ làm việc: thứ Hai–thứ Sáu 08:00–18:00; thứ Bảy 08:00–12:00. Chủ nhật nghỉ, không khai lịch mở cửa.
- Facebook/LinkedIn/Zalo: URL doanh nghiệp đã cung cấp; không dùng URL quản trị.
- Logo 824×543; ảnh trang chủ/OG 1200×630.
- Danh mục: 6 dịch vụ, mỗi dịch vụ có URL và @id khớp landing page.

## Cách sử dụng

Trong ứng dụng Next.js này, layout xuất Organization/LocalBusiness, Logo và WebSite; trang chủ xuất WebPage, ảnh và Service. Không chèn thêm nguyên khối bên dưới vào ứng dụng vì sẽ lặp dữ liệu đã có.

Khối bên dưới là bản gộp tương đương để sao chép sang hệ thống khác hoặc đưa vào công cụ kiểm tra. Nếu dùng thay bản cũ, **thay toàn bộ khối cũ**, không giữ đồng thời các URL non-www.

Hai khối JSON-LD khác nhau vẫn liên kết được qua @id; không bắt buộc tất cả nằm trong một thẻ script.

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
      "description": "Vexim Global hỗ trợ doanh nghiệp Việt đăng ký FDA, DUNS, US Agent, FSVP, tuân thủ MoCRA và lập LLC tại Mỹ. Quy trình rõ ràng, tư vấn miễn phí trong 24h.",
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
      "inLanguage": "vi-VN",
      "publisher": {
        "@id": "https://www.veximglobal.com/#organization"
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://www.veximglobal.com/#webpage",
      "url": "https://www.veximglobal.com",
      "name": "Đăng Ký FDA, US Agent & Tư Vấn Xuất Khẩu Sang Mỹ | Vexim Global",
      "description": "Vexim Global hỗ trợ doanh nghiệp Việt đăng ký FDA, DUNS, US Agent, FSVP, tuân thủ MoCRA và lập LLC tại Mỹ. Quy trình rõ ràng, tư vấn miễn phí trong 24h.",
      "inLanguage": "vi-VN",
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
        "streetAddress": "Số 25/6/51 Ngõa Long, Tây Tựu",
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
      "name": "Dịch vụ đăng ký FDA & tư vấn pháp lý xuất khẩu sang Mỹ",
      "serviceType": "Regulatory Compliance & Market Access",
      "description": "Tư vấn và hỗ trợ doanh nghiệp Việt Nam về FDA, DUNS, MoCRA, US Agent, FSVP, thành lập LLC & EIN và hồ sơ nhà cung cấp nông sản trên Vexim Trade.",
      "url": "https://www.veximglobal.com",
      "provider": {
        "@id": "https://www.veximglobal.com/#organization"
      },
      "mainEntityOfPage": {
        "@id": "https://www.veximglobal.com/#webpage"
      },
      "audience": {
        "@type": "BusinessAudience",
        "audienceType": "Doanh nghiệp Việt Nam xuất khẩu sang Mỹ"
      },
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
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "@id": "https://www.veximglobal.com/#offer-catalog",
        "name": "Dịch vụ của Vexim Global",
        "itemListElement": [
          {
            "@type": "Offer",
            "url": "https://www.veximglobal.com/services/fda",
            "itemOffered": {
              "@type": "Service",
              "@id": "https://www.veximglobal.com/#service-fda-registration",
              "name": "Đăng ký FDA & DUNS",
              "serviceType": "FDA Food Facility Registration & DUNS",
              "description": "Hỗ trợ DUNS (UFI), đăng ký cơ sở thực phẩm FDA và US Agent cho doanh nghiệp Việt xuất khẩu sang Mỹ; cơ sở thuộc diện áp dụng gia hạn từ 01/10 đến 31/12 năm chẵn. Đăng ký không đồng nghĩa FDA phê duyệt sản phẩm.",
              "url": "https://www.veximglobal.com/services/fda",
              "provider": {
                "@id": "https://www.veximglobal.com/#organization"
              },
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
              ]
            }
          },
          {
            "@type": "Offer",
            "url": "https://www.veximglobal.com/services/cosmetics/mocra-registration",
            "itemOffered": {
              "@type": "Service",
              "@id": "https://www.veximglobal.com/#service-mocra",
              "name": "Tuân thủ MoCRA",
              "serviceType": "MoCRA Cosmetic Facility Registration & Product Listing",
              "description": "Đăng ký cơ sở sản xuất mỹ phẩm và liệt kê sản phẩm lên FDA theo Đạo luật Hiện đại hóa Mỹ phẩm (MoCRA) 2022, kèm tư vấn Adverse Event.",
              "url": "https://www.veximglobal.com/services/cosmetics/mocra-registration",
              "provider": {
                "@id": "https://www.veximglobal.com/#organization"
              },
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
              ]
            }
          },
          {
            "@type": "Offer",
            "url": "https://www.veximglobal.com/services/us-agent",
            "itemOffered": {
              "@type": "Service",
              "@id": "https://www.veximglobal.com/#service-us-agent",
              "name": "US Agent & Responsible Person",
              "serviceType": "FDA US Agent & MoCRA Responsible Person",
              "description": "Đại diện pháp lý tại Mỹ cho cơ sở thực phẩm (US Agent) và người chịu trách nhiệm cho mỹ phẩm (Responsible Person) theo quy định liên bang.",
              "url": "https://www.veximglobal.com/services/us-agent",
              "provider": {
                "@id": "https://www.veximglobal.com/#organization"
              },
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
              ]
            }
          },
          {
            "@type": "Offer",
            "url": "https://www.veximglobal.com/services/fsvp",
            "itemOffered": {
              "@type": "Service",
              "@id": "https://www.veximglobal.com/#service-fsvp",
              "name": "FSVP Importer & Plan",
              "serviceType": "Foreign Supplier Verification Program (FSVP) Compliance",
              "description": "Đảm nhận vai trò FSVP Importer và xây dựng FSVP Plan, đánh giá nhà cung cấp nước ngoài theo FSMA cho lô thực phẩm nhập vào Mỹ.",
              "url": "https://www.veximglobal.com/services/fsvp",
              "provider": {
                "@id": "https://www.veximglobal.com/#organization"
              },
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
              ]
            }
          },
          {
            "@type": "Offer",
            "url": "https://www.veximglobal.com/services/llc-ein",
            "itemOffered": {
              "@type": "Service",
              "@id": "https://www.veximglobal.com/#service-llc-ein",
              "name": "Thành lập LLC & EIN",
              "serviceType": "US LLC Formation & EIN Registration",
              "description": "Thành lập công ty LLC tại Mỹ và xin mã số thuế EIN để doanh nghiệp Việt tự đứng tên nhập khẩu, mở tài khoản ngân hàng Mỹ.",
              "url": "https://www.veximglobal.com/services/llc-ein",
              "provider": {
                "@id": "https://www.veximglobal.com/#organization"
              },
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
              ]
            }
          },
          {
            "@type": "Offer",
            "url": "https://www.veximglobal.com/services/export-sales",
            "itemOffered": {
              "@type": "Service",
              "@id": "https://www.veximglobal.com/#service-export-sales",
              "name": "Vexim Trade",
              "serviceType": "Danh bạ nhà cung cấp nông sản Việt Nam",
              "description": "Hồ sơ nhà cung cấp nông sản Việt Nam với quy cách chuẩn ngành, xác minh từng bước và yêu cầu báo giá gửi thẳng đến doanh nghiệp.",
              "url": "https://www.veximglobal.com/services/export-sales",
              "provider": {
                "@id": "https://veximtrade.com/#organization"
              },
              "areaServed": "VN",
              "audience": {
                "@type": "BusinessAudience",
                "audienceType": "Doanh nghiệp sản xuất, xuất khẩu nông sản Việt Nam"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Danh mục đang mở",
                "itemListElement": [
                  {
                    "@type": "OfferCatalog",
                    "name": "Hạt điều nhân"
                  },
                  {
                    "@type": "OfferCatalog",
                    "name": "Hồ tiêu"
                  },
                  {
                    "@type": "OfferCatalog",
                    "name": "Quế, hồi"
                  }
                ]
              },
              "potentialAction": {
                "@type": "RegisterAction",
                "target": "https://veximtrade.com/supplier/register",
                "name": "Đăng ký nhà cung cấp"
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

## Ghi chú kiểm tra

- ProfessionalService được Schema.org đánh dấu deprecated; dùng LocalBusiness cho đơn vị có địa chỉ công khai, Service cho dịch vụ được cung cấp.
- openingHoursSpecification thuộc Place; LocalBusiness kế thừa cả Place và Organization.
- provider đặt trên Service; availableLanguage chỉ khai trong ContactPoint, không đặt trực tiếp trên Service.
- Không dùng priceRange “$$” khi chưa có căn cứ; không tự thêm geo, mã bưu chính, số giấy phép, review hoặc aggregateRating.
- sameAs chỉ gồm các hồ sơ mạng xã hội đã xác nhận. Link hồ sơ năng lực fda.veximglobal.com vẫn hiển thị ở phần căn cứ website, không dùng như hồ sơ định danh mạng xã hội.
- Đây là dữ liệu xác minh theo code và HTML local. Chưa kiểm tra production hoặc chạy Rich Results Test/Schema Markup Validator trực tuyến. Schema hợp lệ không đảm bảo Google hiển thị rich results.

Tạo lại sau khi đổi thông tin: `npm run schema:export`. Kiểm tra: `npm run test:schema`.
