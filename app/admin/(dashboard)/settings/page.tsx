import { Card } from "@/components/ui/card"
import { Settings } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Cài đặt</h1>
        <p className="text-muted-foreground">Quản lý cấu hình hệ thống</p>
      </div>

      <Card className="p-12 text-center">
        <Settings className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium text-primary mb-2">Tính năng đang phát triển</h3>
        <p className="text-muted-foreground">Trang cài đặt sẽ sớm có sẵn</p>
      </Card>
    </div>
  )
}
