"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function ResetClientPasswordPage() {
  const [email, setEmail] = useState("phamgiavietnamjsc@gmail.com")
  const [newPassword, setNewPassword] = useState("Anthai@88")
  const [loading, setLoading] = useState(false)

  const handleReset = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/client-auth/reset-password-temp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password")
      }

      toast.success("Password reset successful!")
      console.log("[v0] Password reset successful for:", email)
    } catch (error) {
      console.error("[v0] Error resetting password:", error)
      toast.error(error instanceof Error ? error.message : "Failed to reset password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-2xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Reset Client Password</CardTitle>
          <CardDescription>
            Temporary tool to reset client account password
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Client Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="text"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <Button onClick={handleReset} disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </Button>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900 font-medium mb-2">
              After resetting the password:
            </p>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Go to <strong>/client-portal</strong> (not /admin/login)</li>
              <li>Enter email: {email}</li>
              <li>Enter password: {newPassword}</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
