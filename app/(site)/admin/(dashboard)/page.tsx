import { createStaticClient } from "@/lib/supabase/server"
import { Card } from "@/components/ui/card"
import { FileText, Eye, TrendingUp, Clock, Users, BarChart3, Globe } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  const supabase = createStaticClient()

  // Fetch statistics
  const { count: totalPosts } = await supabase.from("posts").select("*", { count: "exact", head: true })

  const { count: publishedPosts } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("status", "published")

  const { count: draftPosts } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("status", "draft")

  // Calculate total views this month from all posts
  const { data: viewsData } = await supabase.from("posts").select("views_this_month").eq("status", "published")

  const totalViewsThisMonth = viewsData?.reduce((sum, post) => sum + (post.views_this_month || 0), 0) || 0

  // Get total page views count
  const { count: totalPageViews } = await supabase.from("page_views").select("*", { count: "exact", head: true })

  // Recent posts with analytics
  const { data: recentPosts } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

  const stats = [
    {
      title: "Tổng bài viết",
      value: totalPosts || 0,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Đã xuất bản",
      value: publishedPosts || 0,
      icon: Eye,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Bản nháp",
      value: draftPosts || 0,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Lượt xem (tháng này)",
      value: totalViewsThisMonth > 1000 ? `${(totalViewsThisMonth / 1000).toFixed(1)}K` : totalViewsThisMonth,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Từ dữ liệu thực",
    },
  ]

  const analyticsStats = [
    {
      title: "Tổng lượt xem",
      value: totalPageViews || 0,
      icon: Globe,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      description: "Tất cả thời gian",
    },
    {
      title: "Trung bình/bài viết",
      value: publishedPosts ? Math.round((totalViewsThisMonth || 0) / publishedPosts) : 0,
      icon: BarChart3,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      description: "Tháng này",
    },
    {
      title: "Bài viết phổ biến nhất",
      value: recentPosts?.[0]?.views_count || 0,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: recentPosts?.[0]?.title?.substring(0, 20) + "..." || "Chưa có",
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Tổng quan</h1>
        <p className="text-muted-foreground">Chào mừng bạn đến với Admin Dashboard của Vexim Global</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                {stat.description && <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>}
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Analytics Stats */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-primary mb-4">Phân tích chi tiết</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {analyticsStats.map((stat) => (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-primary">{stat.value}</p>
                  {stat.description && <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>}
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Posts */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-primary">Bài viết gần đây</h2>
          <Link href="/admin/posts" className="text-sm text-primary hover:underline">
            Xem tất cả
          </Link>
        </div>
        <div className="space-y-4">
          {recentPosts && recentPosts.length > 0 ? (
            recentPosts.map((post) => (
              <Link key={post.id} href={`/admin/posts/${post.id}/edit`}>
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer">
                  <div className="flex-1">
                    <h3 className="font-medium text-primary mb-1">{post.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(post.created_at).toLocaleDateString("vi-VN")}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          post.status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {post.status === "published" ? "Đã xuất bản" : "Bản nháp"}
                      </span>
                      <span className="text-xs">{post.category}</span>
                      <span className="flex items-center gap-1 text-xs">
                        <Eye className="w-3 h-3" />
                        {post.views_count || 0} lượt xem
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">Chưa có bài viết nào</p>
          )}
        </div>
      </Card>
    </div>
  )
}
