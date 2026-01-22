import { FDATrackerDashboard } from "@/components/fda/fda-tracker-dashboard"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "FDA Tracker - Theo dõi Cảnh báo FDA | Vexim Global",
  description:
    "Theo dõi cảnh báo thu hồi thực phẩm, dược phẩm, mỹ phẩm từ FDA (Mỹ). Cập nhật realtime cho người nhập khẩu và tiêu dùng hàng xách tay.",
  alternates: {
    canonical: "/fda-tracker",
  },
}

export default function FDATrackerPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Trang chủ",
        item: "https://vexim.vn",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "FDA Tracker",
        item: "https://vexim.vn/fda-tracker",
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <main className="min-h-screen bg-slate-50">
        <Header />
        <div className="pt-20">
          <FDATrackerDashboard />
        </div>
        <Footer />
      </main>
    </>
  )
}
