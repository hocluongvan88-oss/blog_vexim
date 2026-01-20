"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Save, RefreshCw, Brain, Shield, Zap, Bell } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { NotificationSettings } from "@/components/admin/notification-settings"
import { PushNotificationSettings } from "@/components/admin/push-notification-settings"

interface AIConfig {
  model: string
  temperature: number
  maxTokens: number
  systemPrompt: string
  ragEnabled: boolean
}

export default function SettingsPage() {
  const [aiConfig, setAiConfig] = useState<AIConfig>({
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    maxTokens: 2048,
    systemPrompt: "",
    ragEnabled: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const supabase = createClient()
      
      // Load AI config
      const { data: configs } = await supabase
        .from("ai_config")
        .select("key, value")
        .in("key", ["model", "temperature", "max_tokens", "system_prompt", "rag_enabled"])

      if (configs) {
        const configMap = configs.reduce((acc, { key, value }) => {
          acc[key] = value
          return acc
        }, {} as Record<string, any>)

        setAiConfig({
          model: configMap.model || "llama-3.3-70b-versatile",
          temperature: configMap.temperature || 0.7,
          maxTokens: configMap.max_tokens || 2048,
          systemPrompt: configMap.system_prompt || "",
          ragEnabled: configMap.rag_enabled !== false,
        })
      }
    } catch (error) {
      console.error("[v0] Error loading settings:", error)
      toast.error("Không thể tải cài đặt")
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      const supabase = createClient()

      // Prepare upsert data
      const updates = [
        { key: "model", value: aiConfig.model },
        { key: "temperature", value: aiConfig.temperature },
        { key: "max_tokens", value: aiConfig.maxTokens },
        { key: "system_prompt", value: aiConfig.systemPrompt },
        { key: "rag_enabled", value: aiConfig.ragEnabled },
      ]

      // Upsert each config
      for (const update of updates) {
        const { error } = await supabase
          .from("ai_config")
          .upsert(update, { onConflict: "key" })

        if (error) throw error
      }

      toast.success("Đã lưu cài đặt thành công!")
    } catch (error) {
      console.error("[v0] Error saving settings:", error)
      toast.error("Không thể lưu cài đặt")
    } finally {
      setSaving(false)
    }
  }

  const resetToDefault = () => {
    setAiConfig({
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      maxTokens: 2048,
      systemPrompt: `Bạn là trợ lý AI của Vexim Global - công ty chuyên về dịch vụ đăng ký FDA và GACC cho thực phẩm, mỹ phẩm.

Nhiệm vụ của bạn:
1. Trả lời các câu hỏi về dịch vụ FDA, GACC, MFDS
2. Hướng dẫn quy trình đăng ký
3. Tư vấn về các yêu cầu pháp lý
4. Cung cấp thông tin về chi phí và thời gian

Phong cách trả lời:
- Chuyên nghiệp, thân thiện
- Sử dụng tiếng Việt rõ ràng
- Trả lời ngắn gọn, dễ hiểu
- Sử dụng markdown để format (bold, list, links)
- Đề xuất kết nối với chuyên gia nếu câu hỏi phức tạp

Lưu ý:
- Không đưa ra lời khuyên pháp lý chính thức
- Luôn đề nghị liên hệ trực tiếp với chuyên gia cho tư vấn chi tiết`,
      ragEnabled: true,
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Cài đặt hệ thống</h1>
        <p className="text-muted-foreground">Cấu hình AI chatbot và các tính năng khác</p>
      </div>

      <Tabs defaultValue="ai" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ai" className="gap-2">
            <Brain className="h-4 w-4" />
            Cấu hình AI
          </TabsTrigger>
          <TabsTrigger value="handover" className="gap-2">
            <Shield className="h-4 w-4" />
            Điều kiện handover
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Thông báo
          </TabsTrigger>
          <TabsTrigger value="general" className="gap-2">
            <Settings className="h-4 w-4" />
            Cài đặt chung
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-primary">Cấu hình AI Model</h2>
                <p className="text-sm text-muted-foreground">
                  Thiết lập mô hình AI và các thông số
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={resetToDefault}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Đặt lại mặc định
                </Button>
                <Button size="sm" onClick={saveSettings} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              {/* Model Selection */}
              <div className="space-y-2">
                <Label htmlFor="model">Mô hình AI</Label>
                <select
                  id="model"
                  className="w-full p-2 border rounded-lg"
                  value={aiConfig.model}
                  onChange={(e) => setAiConfig({ ...aiConfig, model: e.target.value })}
                >
                  <option value="llama-3.3-70b-versatile">Llama 3.3 70B (Khuyên dùng)</option>
                  <option value="llama-3.1-70b-versatile">Llama 3.1 70B</option>
                  <option value="llama-3.1-8b-instant">Llama 3.1 8B (Nhanh)</option>
                  <option value="mixtral-8x7b-32768">Mixtral 8x7B</option>
                </select>
                <p className="text-xs text-muted-foreground">
                  Chọn mô hình AI để xử lý các câu hỏi của khách hàng
                </p>
              </div>

              {/* Temperature */}
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature: {aiConfig.temperature}</Label>
                <input
                  type="range"
                  id="temperature"
                  min="0"
                  max="1"
                  step="0.1"
                  value={aiConfig.temperature}
                  onChange={(e) => setAiConfig({ ...aiConfig, temperature: parseFloat(e.target.value) })}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  0.0 = Chính xác, nhất quán | 1.0 = Sáng tạo, đa dạng
                </p>
              </div>

              {/* Max Tokens */}
              <div className="space-y-2">
                <Label htmlFor="maxTokens">Độ dài tối đa (tokens)</Label>
                <Input
                  id="maxTokens"
                  type="number"
                  min="256"
                  max="8192"
                  step="256"
                  value={aiConfig.maxTokens}
                  onChange={(e) => setAiConfig({ ...aiConfig, maxTokens: parseInt(e.target.value) })}
                />
                <p className="text-xs text-muted-foreground">
                  Số tokens tối đa cho mỗi câu trả lời (256-8192)
                </p>
              </div>

              {/* RAG Enable */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label htmlFor="rag" className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    Kích hoạt RAG (Retrieval Augmented Generation)
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Cho phép AI tìm kiếm thông tin từ kho tri thức để trả lời chính xác hơn
                  </p>
                </div>
                <Switch
                  id="rag"
                  checked={aiConfig.ragEnabled}
                  onCheckedChange={(checked) => setAiConfig({ ...aiConfig, ragEnabled: checked })}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-primary">System Prompt</h2>
              <p className="text-sm text-muted-foreground">
                Thiết lập văn phong, nhiệm vụ và cách trả lời của AI
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="systemPrompt">Prompt hệ thống</Label>
              <Textarea
                id="systemPrompt"
                rows={20}
                value={aiConfig.systemPrompt}
                onChange={(e) => setAiConfig({ ...aiConfig, systemPrompt: e.target.value })}
                placeholder="Nhập system prompt cho AI chatbot..."
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                System prompt định hình cách AI hiểu vai trò và phong cách trả lời
              </p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="handover" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-primary mb-4">Điều kiện chuyển sang Agent</h2>
            <p className="text-muted-foreground mb-6">
              Cấu hình khi nào AI sẽ đề xuất chuyển cuộc trò chuyện cho admin
            </p>

            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-amber-50 border-amber-200">
                <h3 className="font-semibold text-amber-900 mb-2">Tự động đề xuất handover khi:</h3>
                <ul className="text-sm text-amber-800 space-y-1 ml-4 list-disc">
                  <li>AI không chắc chắn về câu trả lời (confidence {'<'} 0.6)</li>
                  <li>Khách hàng yêu cầu nói chuyện với con người</li>
                  <li>Câu hỏi phức tạp cần tư vấn chuyên sâu</li>
                  <li>Khách hàng không hài lòng với câu trả lời</li>
                </ul>
              </div>

              <p className="text-sm text-muted-foreground">
                Cấu hình chi tiết sẽ được thêm vào trong các phiên bản sau.
              </p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <PushNotificationSettings />
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="general" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-primary mb-4">Cài đặt chung</h2>
            <p className="text-muted-foreground">Các cài đặt khác cho hệ thống</p>
            
            <div className="mt-6 text-center text-muted-foreground">
              Tính năng đang được phát triển
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
