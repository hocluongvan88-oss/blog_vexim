import { NewsCrawlerDashboard } from "@/components/admin/news-crawler-dashboard"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

export const dynamic = "force-dynamic"

export default function NewsCrawlerPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Tin tức FDA/GACC</h1>
        <p className="text-muted-foreground">Tự động thu thập và lọc tin tức từ FDA và GACC với AI filtering 3 lớp</p>
      </div>

      <NewsCrawlerDashboard />

      <Card className="mt-8">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            Setup Cron Job (Chạy tự động mỗi ngày)
          </h3>

          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-2">Bước 1: Thêm Environment Variable</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Vào phần <strong>Vars</strong> trong sidebar chat, thêm:
              </p>
              <code className="block p-3 bg-muted rounded text-sm font-mono">
                CRON_SECRET=your_random_secret_key_here_123xyz
              </code>
            </div>

            <div>
              <h4 className="font-medium mb-2">Bước 2: Setup Vercel Cron (Khuyên dùng)</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Vercel Cron đã được cấu hình trong file{" "}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">vercel.json</code>:
              </p>
              <Alert>
                <AlertDescription>
                  <div className="font-mono text-xs space-y-1">
                    <div>
                      ✅ Path: <code>/api/news/cron</code>
                    </div>
                    <div>✅ Schedule: Mỗi ngày lúc 2:00 AM (UTC)</div>
                    <div>✅ Tự động chạy sau khi deploy lên Vercel</div>
                  </div>
                </AlertDescription>
              </Alert>
            </div>

            <div>
              <h4 className="font-medium mb-2">Bước 3: Kiểm tra (Test Manual)</h4>
              <p className="text-sm text-muted-foreground mb-2">Bạn có thể test bằng cách gọi API thủ công:</p>
              <code className="block p-3 bg-muted rounded text-sm font-mono whitespace-pre">
                {`GET https://your-domain.com/api/news/cron
Authorization: Bearer your_random_secret_key_here_123xyz`}
              </code>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2 text-muted-foreground">Tùy chọn khác: External Cron Service</h4>
              <p className="text-sm text-muted-foreground">
                Nếu không dùng Vercel Cron, bạn có thể dùng{" "}
                <a href="https://cron-job.org" target="_blank" className="underline" rel="noreferrer">
                  cron-job.org
                </a>{" "}
                hoặc{" "}
                <a href="https://easycron.com" target="_blank" className="underline" rel="noreferrer">
                  easycron.com
                </a>{" "}
                để gọi endpoint trên theo lịch.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
