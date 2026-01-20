"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bell, BellOff, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { usePushNotification } from "@/hooks/use-push-notification"
import { toast } from "sonner"

export function PushNotificationSettings() {
  const {
    isSupported,
    permission,
    isSubscribed,
    isRegistering,
    subscribeToPush,
    unsubscribeFromPush,
    testNotification,
  } = usePushNotification()

  const [testing, setTesting] = useState(false)

  const handleSubscribe = async () => {
    try {
      await subscribeToPush()
      toast.success("Đã bật thông báo push thành công!")
    } catch (error) {
      console.error("[v0] Subscribe error:", error)
      toast.error("Không thể bật thông báo push")
    }
  }

  const handleUnsubscribe = async () => {
    try {
      await unsubscribeFromPush()
      toast.success("Đã tắt thông báo push")
    } catch (error) {
      console.error("[v0] Unsubscribe error:", error)
      toast.error("Không thể tắt thông báo push")
    }
  }

  const handleTest = () => {
    setTesting(true)
    testNotification()
    setTimeout(() => {
      setTesting(false)
      toast.success("Đã gửi thông báo test!")
    }, 1000)
  }

  if (!isSupported) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <BellOff className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Thông Báo Push</h3>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Trình duyệt của bạn không hỗ trợ thông báo push. Vui lòng sử dụng Chrome, Firefox, hoặc Edge phiên bản mới nhất.
          </AlertDescription>
        </Alert>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="h-5 w-5 text-orange-600" />
        <h3 className="text-lg font-semibold">Thông Báo Push</h3>
        {isSubscribed && (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Đang bật
          </Badge>
        )}
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Nhận thông báo ngay lập tức khi có khách hàng mới, ngay cả khi bạn không mở tab admin
      </p>

      <div className="space-y-4">
        {/* Permission Status */}
        <div className="p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Trạng thái quyền:</p>
              <div className="flex items-center gap-2">
                {permission === "granted" && (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Đã cấp quyền</span>
                  </>
                )}
                {permission === "denied" && (
                  <>
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-600">Đã từ chối</span>
                  </>
                )}
                {permission === "default" && (
                  <>
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <span className="text-sm text-amber-600">Chưa quyết định</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {!isSubscribed ? (
            <Button
              onClick={handleSubscribe}
              disabled={isRegistering || permission === "denied"}
              className="flex-1"
            >
              <Bell className="h-4 w-4 mr-2" />
              {isRegistering ? "Đang bật..." : "Bật thông báo push"}
            </Button>
          ) : (
            <>
              <Button
                onClick={handleTest}
                disabled={testing}
                variant="outline"
                className="flex-1 bg-transparent"
              >
                {testing ? "Đang gửi..." : "Gửi thông báo test"}
              </Button>
              <Button
                onClick={handleUnsubscribe}
                variant="destructive"
                className="flex-1"
              >
                <BellOff className="h-4 w-4 mr-2" />
                Tắt thông báo
              </Button>
            </>
          )}
        </div>

        {permission === "denied" && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Bạn đã từ chối quyền thông báo. Để bật lại, vui lòng vào cài đặt trình duyệt và cho phép thông báo cho trang web này.
            </AlertDescription>
          </Alert>
        )}

        {/* Features */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-900 mb-2">Tính năng:</p>
          <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
            <li>Thông báo ngay lập tức khi có khách hàng mới</li>
            <li>Hoạt động ngay cả khi đóng tab</li>
            <li>Có thể nhấn để mở trực tiếp cuộc hội thoại</li>
            <li>Hỗ trợ trên cả desktop và mobile</li>
          </ul>
        </div>

        {/* Browser Compatibility */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-900 mb-2">Trình duyệt hỗ trợ:</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Chrome</Badge>
            <Badge variant="secondary">Firefox</Badge>
            <Badge variant="secondary">Edge</Badge>
            <Badge variant="secondary">Opera</Badge>
            <Badge variant="secondary">Safari (macOS 16.1+)</Badge>
          </div>
        </div>
      </div>
    </Card>
  )
}
