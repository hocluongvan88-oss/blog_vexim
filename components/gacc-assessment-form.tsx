"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Step1Data {
  companyName: string
  phone: string
  taxCode: string
  productionAddress: string
  productName: string
  hsCode: string
  plantingAreaCode: string
  // Mục 1-4 tổng quan
  generalInfo: {
    hasBusinessLicense: boolean
    hasProductionPermit: boolean
    hasQualitySystem: boolean
    hasFoodSafety: boolean
  }
}

interface Step2Data {
  // 13 mục chi tiết trong mục 4
  productionEnvironment: string
  equipmentCleaning: string
  processControl: string
  recordKeeping: string
  employeeTraining: string
  pestControl: string
  waterQuality: string
  rawMaterialControl: string
  packagingMaterial: string
  productTesting: string
  traceabilitySystem: string
  complaintHandling: string
  documentRetention: string
}

export function GACCAssessmentForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Step 1 data
  const [step1Data, setStep1Data] = useState<Step1Data>({
    companyName: "",
    phone: "",
    taxCode: "",
    productionAddress: "",
    productName: "",
    hsCode: "",
    plantingAreaCode: "",
    generalInfo: {
      hasBusinessLicense: false,
      hasProductionPermit: false,
      hasQualitySystem: false,
      hasFoodSafety: false,
    },
  })

  // Step 2 data
  const [step2Data, setStep2Data] = useState<Step2Data>({
    productionEnvironment: "",
    equipmentCleaning: "",
    processControl: "",
    recordKeeping: "",
    employeeTraining: "",
    pestControl: "",
    waterQuality: "",
    rawMaterialControl: "",
    packagingMaterial: "",
    productTesting: "",
    traceabilitySystem: "",
    complaintHandling: "",
    documentRetention: "",
  })

  const validateStep1 = (): boolean => {
    const required = ["companyName", "phone", "taxCode", "productionAddress", "productName", "hsCode"]
    const isEmpty = required.some((field) => !step1Data[field as keyof Step1Data])

    if (isEmpty) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc")
      return false
    }

    // Validate phone number
    const phoneRegex = /^[0-9]{10,11}$/
    if (!phoneRegex.test(step1Data.phone)) {
      toast.error("Số điện thoại không hợp lệ (10-11 số)")
      return false
    }

    return true
  }

  const handleStep1Submit = () => {
    if (validateStep1()) {
      setCurrentStep(2)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleFinalSubmit = async () => {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/gacc/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...step1Data,
          ...step2Data,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Có lỗi xảy ra")
      }

      setSubmitSuccess(true)
      toast.success("Gửi đánh giá thành công! Chúng tôi sẽ liên hệ bạn trong thời gian sớm nhất.")
    } catch (error) {
      console.error("[v0] GACC submission error:", error)
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi gửi form")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-8 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-primary mb-2">Gửi đánh giá thành công!</h3>
          <p className="text-muted-foreground mb-6">
            Chuyên viên của chúng tôi sẽ đánh giá hồ sơ và liên hệ với bạn trong thời gian sớm nhất.
          </p>
          <Button onClick={() => window.location.reload()}>Gửi đánh giá mới</Button>
        </CardContent>
      </Card>
    )
  }

  const progress = currentStep === 1 ? 50 : 100

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress indicator */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span className={currentStep === 1 ? "text-primary" : "text-muted-foreground"}>Bước 1: Thông tin cơ bản</span>
              <span className={currentStep === 2 ? "text-primary" : "text-muted-foreground"}>Bước 2: Chi tiết đánh giá</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Basic Information */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Bước 1: Thông tin cơ bản</CardTitle>
            <CardDescription>Vui lòng cung cấp thông tin về doanh nghiệp và sản phẩm đăng ký</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Company Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Thông tin doanh nghiệp</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="companyName">
                    Tên doanh nghiệp <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="companyName"
                    value={step1Data.companyName}
                    onChange={(e) => setStep1Data({ ...step1Data, companyName: e.target.value })}
                    placeholder="Công ty TNHH ABC"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">
                    Số điện thoại <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={step1Data.phone}
                    onChange={(e) => setStep1Data({ ...step1Data, phone: e.target.value })}
                    placeholder="0912345678"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="taxCode">
                    Mã số thuế <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="taxCode"
                    value={step1Data.taxCode}
                    onChange={(e) => setStep1Data({ ...step1Data, taxCode: e.target.value })}
                    placeholder="0123456789"
                    className="mt-1.5"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="productionAddress">
                    Địa chỉ sản xuất <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="productionAddress"
                    value={step1Data.productionAddress}
                    onChange={(e) => setStep1Data({ ...step1Data, productionAddress: e.target.value })}
                    placeholder="123 Đường ABC, Phường XYZ, Quận/Huyện, Tỉnh/Thành phố"
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>

            {/* Product Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Thông tin sản phẩm</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="productName">
                    Tên sản phẩm đăng ký <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="productName"
                    value={step1Data.productName}
                    onChange={(e) => setStep1Data({ ...step1Data, productName: e.target.value })}
                    placeholder="VD: Cà phê rang xay, Gạo thơm, Rau củ tươi..."
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="hsCode">
                    Mã HS <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="hsCode"
                    value={step1Data.hsCode}
                    onChange={(e) => setStep1Data({ ...step1Data, hsCode: e.target.value })}
                    placeholder="09011100"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="plantingAreaCode">Mã vùng trồng (nếu có)</Label>
                  <Input
                    id="plantingAreaCode"
                    value={step1Data.plantingAreaCode}
                    onChange={(e) => setStep1Data({ ...step1Data, plantingAreaCode: e.target.value })}
                    placeholder="VD: VN01234"
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>

            {/* General Overview Checklist */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Tổng quan hồ sơ</h3>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Vui lòng xác nhận doanh nghiệp đã có đầy đủ các tài liệu sau:</AlertDescription>
              </Alert>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="hasBusinessLicense"
                    checked={step1Data.generalInfo.hasBusinessLicense}
                    onCheckedChange={(checked) =>
                      setStep1Data({
                        ...step1Data,
                        generalInfo: { ...step1Data.generalInfo, hasBusinessLicense: checked === true },
                      })
                    }
                  />
                  <Label htmlFor="hasBusinessLicense" className="font-normal cursor-pointer leading-relaxed">
                    1. Giấy phép kinh doanh và đăng ký doanh nghiệp hợp lệ
                  </Label>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="hasProductionPermit"
                    checked={step1Data.generalInfo.hasProductionPermit}
                    onCheckedChange={(checked) =>
                      setStep1Data({
                        ...step1Data,
                        generalInfo: { ...step1Data.generalInfo, hasProductionPermit: checked === true },
                      })
                    }
                  />
                  <Label htmlFor="hasProductionPermit" className="font-normal cursor-pointer leading-relaxed">
                    2. Giấy chứng nhận cơ sở đủ điều kiện sản xuất thực phẩm
                  </Label>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="hasQualitySystem"
                    checked={step1Data.generalInfo.hasQualitySystem}
                    onCheckedChange={(checked) =>
                      setStep1Data({
                        ...step1Data,
                        generalInfo: { ...step1Data.generalInfo, hasQualitySystem: checked === true },
                      })
                    }
                  />
                  <Label htmlFor="hasQualitySystem" className="font-normal cursor-pointer leading-relaxed">
                    3. Hệ thống quản lý chất lượng (ISO 22000, HACCP hoặc tương đương)
                  </Label>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="hasFoodSafety"
                    checked={step1Data.generalInfo.hasFoodSafety}
                    onCheckedChange={(checked) =>
                      setStep1Data({
                        ...step1Data,
                        generalInfo: { ...step1Data.generalInfo, hasFoodSafety: checked === true },
                      })
                    }
                  />
                  <Label htmlFor="hasFoodSafety" className="font-normal cursor-pointer leading-relaxed">
                    4. Báo cáo đánh giá an toàn thực phẩm và kết quả kiểm nghiệm sản phẩm
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={handleStep1Submit} size="lg" className="min-w-[160px]">
                Tiếp tục <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Detailed Assessment */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Bước 2: Chi tiết đánh giá</CardTitle>
            <CardDescription>Vui lòng mô tả chi tiết các yêu cầu về quản lý chất lượng và an toàn thực phẩm</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Lưu ý:</strong> Các hồ sơ, SSOP và quy trình phải được thực hiện thường xuyên và lưu giữ ít nhất 2 năm.
              </AlertDescription>
            </Alert>

            {/* Detailed Questions */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="productionEnvironment" className="text-base font-semibold">
                  1. Môi trường sản xuất và vệ sinh cơ sở
                </Label>
                <p className="text-sm text-muted-foreground mt-1 mb-2">
                  Mô tả quy trình vệ sinh nhà xưởng, khu vực sản xuất, phân vùng sạch/bẩn
                </p>
                <Textarea
                  id="productionEnvironment"
                  value={step2Data.productionEnvironment}
                  onChange={(e) => setStep2Data({ ...step2Data, productionEnvironment: e.target.value })}
                  placeholder="VD: Nhà xưởng được vệ sinh hàng ngày, có hệ thống thoát nước riêng biệt, khu vực sản xuất được phân vùng rõ ràng..."
                  rows={4}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="equipmentCleaning" className="text-base font-semibold">
                  2. Quy trình vệ sinh thiết bị và dụng cụ
                </Label>
                <p className="text-sm text-muted-foreground mt-1 mb-2">
                  Mô tả SSOP cho vệ sinh thiết bị, tần suất, phương pháp kiểm tra
                </p>
                <Textarea
                  id="equipmentCleaning"
                  value={step2Data.equipmentCleaning}
                  onChange={(e) => setStep2Data({ ...step2Data, equipmentCleaning: e.target.value })}
                  placeholder="VD: Thiết bị được vệ sinh sau mỗi ca sản xuất theo quy trình SSOP, có nhật ký ghi chép và kiểm tra định kỳ..."
                  rows={4}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="processControl" className="text-base font-semibold">
                  3. Kiểm soát quá trình sản xuất
                </Label>
                <p className="text-sm text-muted-foreground mt-1 mb-2">
                  Mô tả các điểm kiểm soát quan trọng (CCP), nhiệt độ, thời gian, pH...
                </p>
                <Textarea
                  id="processControl"
                  value={step2Data.processControl}
                  onChange={(e) => setStep2Data({ ...step2Data, processControl: e.target.value })}
                  placeholder="VD: Kiểm soát nhiệt độ sấy, thời gian lên men, pH trong quá trình chế biến với các điểm CCP được xác định rõ ràng..."
                  rows={4}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="recordKeeping" className="text-base font-semibold">
                  4. Hệ thống ghi chép và lưu trữ hồ sơ
                </Label>
                <p className="text-sm text-muted-foreground mt-1 mb-2">Mô tả cách ghi chép, lưu trữ và tra cứu hồ sơ sản xuất</p>
                <Textarea
                  id="recordKeeping"
                  value={step2Data.recordKeeping}
                  onChange={(e) => setStep2Data({ ...step2Data, recordKeeping: e.target.value })}
                  placeholder="VD: Tất cả hồ sơ được ghi chép hàng ngày, lưu trữ trong kho lưu trữ an toàn, lưu giữ tối thiểu 2 năm..."
                  rows={4}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="employeeTraining" className="text-base font-semibold">
                  5. Đào tạo nhân viên về ATTP
                </Label>
                <p className="text-sm text-muted-foreground mt-1 mb-2">Mô tả chương trình đào tạo, tần suất, nội dung</p>
                <Textarea
                  id="employeeTraining"
                  value={step2Data.employeeTraining}
                  onChange={(e) => setStep2Data({ ...step2Data, employeeTraining: e.target.value })}
                  placeholder="VD: Đào tạo ATTP cho nhân viên mới và đào tạo lại 6 tháng/lần, có giấy chứng nhận đào tạo..."
                  rows={4}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="pestControl" className="text-base font-semibold">
                  6. Kiểm soát côn trùng và động vật gây hại
                </Label>
                <p className="text-sm text-muted-foreground mt-1 mb-2">Mô tả biện pháp phòng ngừa và xử lý sâu bệnh</p>
                <Textarea
                  id="pestControl"
                  value={step2Data.pestControl}
                  onChange={(e) => setStep2Data({ ...step2Data, pestControl: e.target.value })}
                  placeholder="VD: Có hợp đồng với đơn vị diệt côn trùng chuyên nghiệp, kiểm tra định kỳ, lưu giữ nhật ký..."
                  rows={4}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="waterQuality" className="text-base font-semibold">
                  7. Kiểm soát chất lượng nước
                </Label>
                <p className="text-sm text-muted-foreground mt-1 mb-2">
                  Mô tả nguồn nước, xử lý nước, kiểm nghiệm định kỳ
                </p>
                <Textarea
                  id="waterQuality"
                  value={step2Data.waterQuality}
                  onChange={(e) => setStep2Data({ ...step2Data, waterQuality: e.target.value })}
                  placeholder="VD: Nước sản xuất được lọc qua hệ thống RO, kiểm nghiệm vi sinh và hóa học 3 tháng/lần..."
                  rows={4}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="rawMaterialControl" className="text-base font-semibold">
                  8. Kiểm soát nguyên liệu đầu vào
                </Label>
                <p className="text-sm text-muted-foreground mt-1 mb-2">
                  Mô tả quy trình lựa chọn nhà cung cấp, kiểm tra nguyên liệu
                </p>
                <Textarea
                  id="rawMaterialControl"
                  value={step2Data.rawMaterialControl}
                  onChange={(e) => setStep2Data({ ...step2Data, rawMaterialControl: e.target.value })}
                  placeholder="VD: Nhà cung cấp được đánh giá và kiểm tra định kỳ, nguyên liệu được kiểm tra chất lượng trước khi nhập kho..."
                  rows={4}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="packagingMaterial" className="text-base font-semibold">
                  9. Kiểm soát bao bì, vật liệu tiếp xúc thực phẩm
                </Label>
                <p className="text-sm text-muted-foreground mt-1 mb-2">Mô tả tiêu chuẩn bao bì, giấy chứng nhận an toàn</p>
                <Textarea
                  id="packagingMaterial"
                  value={step2Data.packagingMaterial}
                  onChange={(e) => setStep2Data({ ...step2Data, packagingMaterial: e.target.value })}
                  placeholder="VD: Bao bì đạt chuẩn an toàn thực phẩm, có chứng nhận từ nhà cung cấp uy tín..."
                  rows={4}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="productTesting" className="text-base font-semibold">
                  10. Kiểm nghiệm sản phẩm và giám sát chất lượng
                </Label>
                <p className="text-sm text-muted-foreground mt-1 mb-2">
                  Mô tả tần suất kiểm nghiệm, các chỉ tiêu kiểm tra
                </p>
                <Textarea
                  id="productTesting"
                  value={step2Data.productTesting}
                  onChange={(e) => setStep2Data({ ...step2Data, productTesting: e.target.value })}
                  placeholder="VD: Kiểm nghiệm vi sinh, tồn dư hóa chất, kim loại nặng định kỳ theo quy định..."
                  rows={4}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="traceabilitySystem" className="text-base font-semibold">
                  11. Hệ thống truy xuất nguồn gốc
                </Label>
                <p className="text-sm text-muted-foreground mt-1 mb-2">
                  Mô tả khả năng truy xuất từ nguyên liệu đến thành phẩm
                </p>
                <Textarea
                  id="traceabilitySystem"
                  value={step2Data.traceabilitySystem}
                  onChange={(e) => setStep2Data({ ...step2Data, traceabilitySystem: e.target.value })}
                  placeholder="VD: Mỗi lô sản phẩm có mã truy xuất, có thể truy xuất ngược từ sản phẩm về nguyên liệu và quy trình sản xuất..."
                  rows={4}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="complaintHandling" className="text-base font-semibold">
                  12. Xử lý khiếu nại và thu hồi sản phẩm
                </Label>
                <p className="text-sm text-muted-foreground mt-1 mb-2">Mô tả quy trình xử lý khiếu nại và kế hoạch thu hồi</p>
                <Textarea
                  id="complaintHandling"
                  value={step2Data.complaintHandling}
                  onChange={(e) => setStep2Data({ ...step2Data, complaintHandling: e.target.value })}
                  placeholder="VD: Có quy trình tiếp nhận và xử lý khiếu nại trong 24h, kế hoạch thu hồi sản phẩm được lập sẵn..."
                  rows={4}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="documentRetention" className="text-base font-semibold">
                  13. Lưu trữ hồ sơ và tài liệu
                </Label>
                <p className="text-sm text-muted-foreground mt-1 mb-2">
                  Xác nhận thời gian lưu trữ hồ sơ (tối thiểu 2 năm)
                </p>
                <Textarea
                  id="documentRetention"
                  value={step2Data.documentRetention}
                  onChange={(e) => setStep2Data({ ...step2Data, documentRetention: e.target.value })}
                  placeholder="VD: Tất cả hồ sơ được lưu trữ an toàn tối thiểu 2 năm, có sổ sách theo dõi và dễ dàng truy xuất khi cần..."
                  rows={4}
                  className="mt-1.5"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button onClick={() => setCurrentStep(1)} variant="outline" size="lg">
                <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
              </Button>
              <Button onClick={handleFinalSubmit} size="lg" disabled={isSubmitting} className="min-w-[160px]">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  "Gửi đánh giá"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
