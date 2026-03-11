import Link from "next/link"
import { ArrowRight, FileCheck, Globe, Shield, Truck, Cpu, Package } from "lucide-react"
import { Card } from "@/components/ui/card"

// Map categories to related services
const categoryToServices: Record<string, Array<{
  title: string
  description: string
  href: string
  icon: React.ElementType
}>> = {
  "FDA": [
    {
      title: "Đăng ký FDA",
      description: "Dịch vụ đăng ký FDA cho thực phẩm, dược phẩm xuất khẩu sang Mỹ",
      href: "/services/fda",
      icon: FileCheck,
    },
    {
      title: "US Agent",
      description: "Dịch vụ đại diện pháp lý tại Mỹ theo yêu cầu FDA",
      href: "/services/us-agent",
      icon: Shield,
    },
  ],
  "GACC": [
    {
      title: "Đăng ký GACC",
      description: "Dịch vụ đăng ký xuất khẩu thực phẩm sang Trung Quốc",
      href: "/services/gacc",
      icon: Globe,
    },
    {
      title: "Đánh giá GACC",
      description: "Kiểm tra mức độ sẵn sàng đăng ký GACC của doanh nghiệp",
      href: "/services/gacc/assessment",
      icon: FileCheck,
    },
  ],
  "MFDS": [
    {
      title: "Đăng ký MFDS",
      description: "Dịch vụ đăng ký xuất khẩu thực phẩm, mỹ phẩm sang Hàn Quốc",
      href: "/services/mfds",
      icon: FileCheck,
    },
  ],
  "Truy xuất nguồn gốc": [
    {
      title: "AI Traceability",
      description: "Nền tảng truy xuất nguồn gốc tích hợp AI và Blockchain",
      href: "/services/ai-traceability",
      icon: Cpu,
    },
  ],
  "Xuất nhập khẩu": [
    {
      title: "Ủy thác xuất khẩu",
      description: "Dịch vụ ủy thác xuất khẩu trọn gói cho doanh nghiệp",
      href: "/services/export-delegation",
      icon: Truck,
    },
    {
      title: "Đăng ký FDA",
      description: "Dịch vụ đăng ký FDA xuất khẩu sang thị trường Mỹ",
      href: "/services/fda",
      icon: FileCheck,
    },
    {
      title: "Đăng ký GACC",
      description: "Dịch vụ đăng ký xuất khẩu sang Trung Quốc",
      href: "/services/gacc",
      icon: Globe,
    },
  ],
  "Kiến thức pháp lý": [
    {
      title: "Tư vấn FDA",
      description: "Tư vấn quy định pháp lý FDA cho xuất khẩu sang Mỹ",
      href: "/services/fda",
      icon: FileCheck,
    },
    {
      title: "Tư vấn GACC",
      description: "Tư vấn quy định Decree 248/249 xuất khẩu Trung Quốc",
      href: "/services/gacc",
      icon: Globe,
    },
    {
      title: "Tư vấn MFDS",
      description: "Tư vấn quy định MFDS xuất khẩu Hàn Quốc",
      href: "/services/mfds",
      icon: Shield,
    },
  ],
  "Tin tức thị trường": [
    {
      title: "Ủy thác xuất khẩu",
      description: "Dịch vụ ủy thác xuất khẩu trọn gói",
      href: "/services/export-delegation",
      icon: Truck,
    },
    {
      title: "AI Traceability",
      description: "Giải pháp truy xuất nguồn gốc hiện đại",
      href: "/services/ai-traceability",
      icon: Cpu,
    },
  ],
}

// Default services if category doesn't match
const defaultServices = [
  {
    title: "Đăng ký FDA",
    description: "Xuất khẩu thực phẩm sang Mỹ",
    href: "/services/fda",
    icon: FileCheck,
  },
  {
    title: "Đăng ký GACC",
    description: "Xuất khẩu sang Trung Quốc",
    href: "/services/gacc",
    icon: Globe,
  },
  {
    title: "Ủy thác xuất khẩu",
    description: "Dịch vụ xuất khẩu trọn gói",
    href: "/services/export-delegation",
    icon: Truck,
  },
]

interface BlogInternalLinksProps {
  category: string
  className?: string
}

export function BlogInternalLinks({ category, className = "" }: BlogInternalLinksProps) {
  const services = categoryToServices[category] || defaultServices

  return (
    <div className={`bg-secondary/30 rounded-lg p-6 ${className}`}>
      <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
        <Package className="w-5 h-5 text-accent" />
        Dịch vụ liên quan
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Vexim Global cung cấp các dịch vụ chuyên nghiệp liên quan đến nội dung bài viết này:
      </p>
      <div className="space-y-3">
        {services.map((service, index) => (
          <Link key={index} href={service.href}>
            <Card className="p-4 hover:shadow-md hover:border-accent/50 transition-all group cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                  <service.icon className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-primary group-hover:text-accent transition-colors text-sm">
                    {service.title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {service.description}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Category Link */}
      <div className="mt-4 pt-4 border-t">
        <Link 
          href={`/blog/category/${encodeURIComponent(category)}`}
          className="text-sm text-accent hover:underline flex items-center gap-1"
        >
          Xem thêm bài viết về {category}
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  )
}

// Compact version for sidebar
export function BlogInternalLinksCompact({ category }: { category: string }) {
  const services = categoryToServices[category] || defaultServices
  const topServices = services.slice(0, 2)

  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-primary text-sm mb-3">Dịch vụ liên quan</h4>
      {topServices.map((service, index) => (
        <Link key={index} href={service.href}>
          <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors py-1">
            <service.icon className="w-4 h-4" />
            <span>{service.title}</span>
            <ArrowRight className="w-3 h-3 ml-auto" />
          </div>
        </Link>
      ))}
      <Link 
        href={`/blog/category/${encodeURIComponent(category)}`}
        className="block text-xs text-accent hover:underline mt-2"
      >
        Xem bài viết về {category} →
      </Link>
    </div>
  )
}
