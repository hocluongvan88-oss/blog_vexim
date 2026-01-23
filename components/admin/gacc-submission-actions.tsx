"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface GACCSubmissionActionsProps {
  submissionId: string
  currentStatus: string
}

export function GACCSubmissionActions({ submissionId, currentStatus }: GACCSubmissionActionsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isUpdating, setIsUpdating] = useState(false)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)

  const updateStatus = async (newStatus: string, actionLabel: string) => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/gacc/submissions/${submissionId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update status")
      }

      toast({
        title: "Thành công",
        description: `Đã ${actionLabel.toLowerCase()} hồ sơ`,
      })

      router.refresh()
    } catch (error) {
      console.error("[v0] Error updating status:", error)
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật trạng thái hồ sơ",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
      setShowApproveDialog(false)
      setShowRejectDialog(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Hành động</CardTitle>
          <CardDescription>Cập nhật trạng thái hồ sơ</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button
              variant="default"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => setShowApproveDialog(true)}
              disabled={isUpdating || currentStatus === "approved"}
            >
              {isUpdating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              Phê duyệt
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowRejectDialog(true)}
              disabled={isUpdating || currentStatus === "rejected"}
            >
              {isUpdating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="mr-2 h-4 w-4" />
              )}
              Từ chối
            </Button>
            <Button
              variant="outline"
              onClick={() => updateStatus("needs_info", "Yêu cầu bổ sung")}
              disabled={isUpdating}
            >
              Yêu cầu bổ sung
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Approve Confirmation Dialog */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận phê duyệt</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn phê duyệt hồ sơ này? Khách hàng sẽ nhận được email thông báo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => updateStatus("approved", "Phê duyệt")}
              disabled={isUpdating}
              className="bg-green-600 hover:bg-green-700"
            >
              {isUpdating ? "Đang xử lý..." : "Phê duyệt"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Confirmation Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận từ chối</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn từ chối hồ sơ này? Khách hàng sẽ nhận được email thông báo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => updateStatus("rejected", "Từ chối")}
              disabled={isUpdating}
              className="bg-red-600 hover:bg-red-700"
            >
              {isUpdating ? "Đang xử lý..." : "Từ chối"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
