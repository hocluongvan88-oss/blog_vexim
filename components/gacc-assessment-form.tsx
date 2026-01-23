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
import { FileUploader } from "@/components/file-uploader"

interface FileUploadInfo {
  file: File
  url?: string
  uploading: boolean
  error?: string
}

interface Step1Data {
  companyName: string
  email: string
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

// Step 2: Cơ sở vật chất & Hạ tầng
interface Step2Data {
  // Mục 2: Vị trí DN và Bố trí Xưởng
  siteSelection: string
  workshopLayout: string
  // Mục 3: Cơ sở vật chất và thiết bị
  productionEquipment: string
  storageFacility: string
  // Mục 4: Nước/Nước đá/Hơi nước
  waterSource: string
  waterMonitoring: string
  boilerAdditives: string
}

// Step 3: Nguyên liệu & Quy trình sản xuất
interface Step3Data {
  // Mục 5: Nguyên liệu thô và phụ trợ
  rawMaterialAcceptance: string
  rawMaterialSource: string
  foodAdditives: string
  packagingMaterials: string
  productLabels: string
  // Mục 6: Kiểm soát sản xuất và chế biến
  productionProcess: string
  haccpSystem: string
  mycotoxinsControl: string
  // Mục 7: Làm sạch và sát trùng
  cleaningProcedures: string
}

// Step 4: Quản lý chất lượng & Kiểm soát
interface Step4Data {
  // Mục 8: Kiểm soát Hóa chất, Chất thải và Côn trùng
  chemicalControl: string
  physicalContamination: string
  pestControl: string
  wasteManagement: string
  // Mục 9: Truy xuất nguồn gốc
  traceabilityProcedure: string
  warehouseManagement: string
  // Mục 10: Quản lý và đào tạo nhân sự
  healthManagement: string
  personnelTraining: string
  managementTraining: string
  // Mục 11: Tự kiểm tra và tự kiểm soát
  productInspection: string
  laboratoryQualification: string
  // Mục 12: Kiểm soát Dịch hại
  quarantinePests: string
  pestIdentification: string
  pestControlMeasures: string
  fumigationTreatment: string
}

export function GACCAssessmentForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [attachments, setAttachments] = useState<Record<string, FileUploadInfo[]>>({})

  // Step 1 data
  const [step1Data, setStep1Data] = useState<Step1Data>({
    companyName: "",
    email: "",
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
    siteSelection: "",
    workshopLayout: "",
    productionEquipment: "",
    storageFacility: "",
    waterSource: "",
    waterMonitoring: "",
    boilerAdditives: "",
  })

  // Step 3 data
  const [step3Data, setStep3Data] = useState<Step3Data>({
    rawMaterialAcceptance: "",
    rawMaterialSource: "",
    foodAdditives: "",
    packagingMaterials: "",
    productLabels: "",
    productionProcess: "",
    haccpSystem: "",
    mycotoxinsControl: "",
    cleaningProcedures: "",
  })

  // Step 4 data
  const [step4Data, setStep4Data] = useState<Step4Data>({
    chemicalControl: "",
    physicalContamination: "",
    pestControl: "",
    wasteManagement: "",
    traceabilityProcedure: "",
    warehouseManagement: "",
    healthManagement: "",
    personnelTraining: "",
    managementTraining: "",
    productInspection: "",
    laboratoryQualification: "",
    quarantinePests: "",
    pestIdentification: "",
    pestControlMeasures: "",
    fumigationTreatment: "",
  })

  const validateStep1 = (): boolean => {
    const required = ["companyName", "email", "phone", "taxCode", "productionAddress", "productName", "hsCode"]
    const isEmpty = required.some((field) => !step1Data[field as keyof Step1Data])

    if (isEmpty) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc")
      return false
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(step1Data.email)) {
      toast.error("Email không hợp lệ")
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

  const handleStepNavigation = (nextStep: number) => {
    setCurrentStep(nextStep)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleFinalSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Prepare attachments data
      const attachmentsData = Object.entries(attachments).flatMap(([fieldId, files]) =>
        files.map((file) => ({
          field: fieldId,
          fileName: file.file.name,
          fileUrl: file.url || "",
          fileSize: file.file.size,
          uploadedAt: new Date().toISOString(),
        }))
      )

      const submissionData = {
        ...step1Data,
        ...step2Data,
        ...step3Data,
        ...step4Data,
        attachments: attachmentsData,
        submittedAt: new Date().toISOString(),
      }

      const response = await fetch("/api/gacc/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      })

      if (!response.ok) {
        throw new Error("Failed to submit")
      }

      setSubmitSuccess(true)
      toast.success("Đánh giá đã được gửi thành công! Chúng tôi sẽ liên hệ bạn trong 24-48 giờ.")
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (error) {
      console.error("[v0] GACC submission error:", error)
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi gửi form")
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = (currentStep / 4) * 100

  const steps = [
    { number: 1, title: "Thông tin cơ bản", subtitle: "Doanh nghiệp & Sản phẩm" },
    { number: 2, title: "Cơ sở vật chất", subtitle: "Hạ tầng & Thiết bị" },
    { number: 3, title: "Nguyên liệu & Sản xuất", subtitle: "Quy trình & Kiểm soát" },
    { number: 4, title: "Quản lý chất lượng", subtitle: "Đào tạo & Kiểm soát" },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress indicator */}
      <Card>
        <CardContent className="pt-6 pb-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                        currentStep >= step.number
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {currentStep > step.number ? <CheckCircle2 className="w-5 h-5" /> : step.number}
                    </div>
                    <div className="mt-2 text-center hidden md:block">
                      <div
                        className={`text-xs font-medium ${currentStep >= step.number ? "text-primary" : "text-muted-foreground"}`}
                      >
                        {step.title}
                      </div>
                      <div className="text-xs text-muted-foreground">{step.subtitle}</div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 transition-colors ${
                        currentStep > step.number ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <Progress value={progress} className="h-2" />
            <div className="text-center text-sm text-muted-foreground">
              Bước {currentStep} / 4 ({Math.round(progress)}% hoàn thành)
            </div>
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
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={step1Data.email}
                    onChange={(e) => setStep1Data({ ...step1Data, email: e.target.value })}
                    placeholder="example@company.com"
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

      {/* Step 2: Infrastructure */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Bước 2: Cơ sở vật chất và Hạ tầng</CardTitle>
            <CardDescription>
              Vui lòng cung cấp thông tin về vị trí nhà máy, bố trí xưởng, thiết bị sản xuất và hệ thống nước
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Lưu ý:</strong> Các hồ sơ, SSOP và quy trình phải được thực hiện thường xuyên và lưu giữ ít nhất 2 năm.
              </AlertDescription>
            </Alert>

            {/* Detailed Questions - Mapped from document sections */}
            <div className="space-y-8">
              {/* Section 2: Vị trí Doanh nghiệp và Bố trí Xưởng */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-primary border-b pb-2">2. Vị trí Doanh nghiệp và Bố trí Xưởng</h3>
                
                <div>
                  <Label htmlFor="siteSelection" className="text-base font-semibold">
                    2.1. Lựa chọn địa điểm và môi trường nhà máy
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                    Cung cấp hình ảnh về môi trường khu vực đặt nhà máy, thông tin về môi trường xung quanh (khu vực nội thành, ngoại thành, khu công nghiệp, nông nghiệp và dân cư)
                  </p>
                  <Textarea
                    id="siteSelection"
                    value={step2Data.siteSelection}
                    onChange={(e) => setStep2Data({ ...step2Data, siteSelection: e.target.value })}
                    placeholder="Mô tả vị trí nhà máy, môi trường xung quanh, các nguồn ô nhiễm tiềm tàng..."
                    rows={3}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="workshopLayout" className="text-base font-semibold">
                    2.2. Bố trí Xưởng
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                    Cung cấp sơ đồ phân xưởng, chỉ ra dòng người, dòng nguyên liệu, dòng nước, dòng xử lý và các khu vực làm sạch khác nhau
                  </p>
                  <Textarea
                    id="workshopLayout"
                    value={step2Data.workshopLayout}
                    onChange={(e) => setStep2Data({ ...step2Data, workshopLayout: e.target.value })}
                    placeholder="Mô tả layout xưởng, dòng chảy sản xuất, phân vùng sạch/bẩn..."
                    rows={3}
                    className="mt-1.5"
                  />
                </div>

                {/* Upload for Section 2 */}
                <div className="pt-4 border-t">
                  <FileUploader
                    fieldId="section_2"
                    fieldLabel="Tài liệu Mục 2: Vị trí DN và Bố trí Xưởng"
                    maxFiles={3}
                    compact={false}
                    onFilesChange={(files) => setAttachments({ ...attachments, section_2: files })}
                  />
                </div>
              </div>

              {/* Section 3: Cơ sở vật chất và thiết bị */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-primary border-b pb-2">3. Cơ sở vật chất và thiết bị</h3>
                
                <div>
                  <Label htmlFor="productionEquipment" className="text-base font-semibold">
                    3.1. Thiết bị sản xuất và chế biến
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                    Cung cấp danh sách các trang thiết bị chính và công suất xử lý thiết kế
                  </p>
                  <Textarea
                    id="productionEquipment"
                    value={step2Data.productionEquipment}
                    onChange={(e) => setStep2Data({ ...step2Data, productionEquipment: e.target.value })}
                    placeholder="Liệt kê thiết bị chính, công suất, năm sản xuất..."
                    rows={3}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="storageFacility" className="text-base font-semibold">
                    3.2. Cơ sở lưu trữ
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                    Trình bày các yêu cầu kiểm soát nhiệt độ và phương pháp giám sát nếu có kho lạnh
                  </p>
                  <Textarea
                    id="storageFacility"
                    value={step2Data.storageFacility}
                    onChange={(e) => setStep2Data({ ...step2Data, storageFacility: e.target.value })}
                    placeholder="Mô tả kho lưu trữ, kiểm soát nhiệt độ, độ ẩm..."
                    rows={3}
                    className="mt-1.5"
                  />
                </div>

                {/* Upload for Section 3 */}
                <div className="pt-4 border-t">
                  <FileUploader
                    fieldId="section_3"
                    fieldLabel="Tài liệu Mục 3: Cơ sở vật chất và thiết bị"
                    maxFiles={3}
                    compact={false}
                    onFilesChange={(files) => setAttachments({ ...attachments, section_3: files })}
                  />
                </div>
              </div>

              {/* Section 4: Nước/Nước đá/Hơi nước */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-primary border-b pb-2">4. Nước / Nước đá / Hơi nước</h3>
                
                <div>
                  <Label htmlFor="waterSource" className="text-base font-semibold">
                    4.1. Nguồn nước và biện pháp bảo vệ
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                    Cung cấp ảnh chụp các nguồn nước tự cung cấp hoặc các công trình cấp nước thứ cấp và giải thích các biện pháp bảo vệ
                  </p>
                  <Textarea
                    id="waterSource"
                    value={step2Data.waterSource}
                    onChange={(e) => setStep2Data({ ...step2Data, waterSource: e.target.value })}
                    placeholder="Mô tả nguồn nước, hệ thống xử lý, biện pháp bảo vệ..."
                    rows={3}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="waterMonitoring" className="text-base font-semibold">
                    4.2. Kế hoạch giám sát nước
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                    Đưa ra kế hoạch giám sát đối với nước được sử dụng trong sản xuất, bao gồm các hạng mục kiểm tra vi khuẩn, phương pháp, tần suất, hồ sơ, kết quả kiểm tra
                  </p>
                  <Textarea
                    id="waterMonitoring"
                    value={step2Data.waterMonitoring}
                    onChange={(e) => setStep2Data({ ...step2Data, waterMonitoring: e.target.value })}
                    placeholder="Mô tả tần suất kiểm tra, các chỉ tiêu kiểm tra, phương pháp..."
                    rows={3}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="boilerAdditives" className="text-base font-semibold">
                    4.3. Chất phụ gia cho lò hơi (nếu có)
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                    Cung cấp các chất phụ gia cho lò hơi dùng trong sản xuất hơi nước tiếp xúc trực tiếp với thực phẩm
                  </p>
                  <Textarea
                    id="boilerAdditives"
                    value={step2Data.boilerAdditives}
                    onChange={(e) => setStep2Data({ ...step2Data, boilerAdditives: e.target.value })}
                    placeholder="Liệt kê các chất phụ gia sử dụng, tính an toàn thực phẩm..."
                    rows={3}
                    className="mt-1.5"
                  />
                </div>

                {/* Upload for Section 4 */}
                <div className="pt-4 border-t">
                  <FileUploader
                    fieldId="section_4"
                    fieldLabel="Tài liệu Mục 4: Nước/Nước đá/Hơi nước"
                    maxFiles={3}
                    compact={false}
                    onFilesChange={(files) => setAttachments({ ...attachments, section_4: files })}
                  />
                </div>
              </div>
            </div>

            {/* Step 2 Navigation */}
            <div className="flex justify-between pt-6 border-t">
              <Button onClick={() => handleStepNavigation(1)} variant="outline" size="lg">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại
              </Button>
              <Button onClick={() => handleStepNavigation(3)} size="lg">
                Tiếp tục
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Materials & Production */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Bước 3: Nguyên liệu và Quy trình sản xuất</CardTitle>
            <CardDescription>
              Vui lòng cung cấp thông tin về nguyên liệu, phụ gia, quy trình sản xuất và kiểm soát vệ sinh
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Lưu ý:</strong> Các hồ sơ HACCP, CCP và quy trình vệ sinh phải được lưu giữ ít nhất 2 năm.
              </AlertDescription>
            </Alert>

            <div className="space-y-8">
              {/* Section 5: Nguyên liệu thô và phụ trợ */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-primary border-b pb-2">5. Nguyên liệu thô và phụ trợ</h3>
                
                <div>
                  <Label htmlFor="rawMaterialAcceptance" className="text-base font-semibold">
                    5.1. Chấp nhận và kiểm soát nguyên liệu thô
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                    Đưa ra các biện pháp chấp nhận đối với nguyên liệu và phụ gia, bao gồm các tiêu chuẩn và phương pháp chấp nhận
                  </p>
                  <Textarea
                    id="rawMaterialAcceptance"
                    value={step3Data.rawMaterialAcceptance}
                    onChange={(e) => setStep3Data({ ...step3Data, rawMaterialAcceptance: e.target.value })}
                    placeholder="Mô tả quy trình nghiệm thu, tiêu chuẩn chất lượng..."
                    rows={3}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="rawMaterialSource" className="text-base font-semibold">
                    5.2. Nguồn nguyên liệu
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                    Cung cấp nguyên liệu để chứng minh rằng nguyên liệu thô đến từ khu vực không có báo cáo về dịch hại kiểm dịch, nhà cung cấp có đủ tiêu chuẩn
                  </p>
                  <Textarea
                    id="rawMaterialSource"
                    value={step3Data.rawMaterialSource}
                    onChange={(e) => setStep3Data({ ...step3Data, rawMaterialSource: e.target.value })}
                    placeholder="Liệt kê nhà cung cấp, vùng nguồn, chứng nhận an toàn..."
                    rows={3}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="foodAdditives" className="text-base font-semibold">
                    5.3. Phụ gia thực phẩm (nếu có)
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                    Danh mục phụ gia thực phẩm được sử dụng trong sản xuất, chế biến (bao gồm tên, mục đích và lượng bổ sung)
                  </p>
                  <Textarea
                    id="foodAdditives"
                    value={step3Data.foodAdditives}
                    onChange={(e) => setStep3Data({ ...step3Data, foodAdditives: e.target.value })}
                    placeholder="Liệt kê phụ gia, mục đích sử dụng, liều lượng..."
                    rows={3}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="packagingMaterials" className="text-base font-semibold">
                    5.4. Vật liệu đóng gói
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                    Cung cấp bằng chứng chứng minh rằng vật liệu đóng gói bên trong và bên ngoài phù hợp để đóng gói sản phẩm
                  </p>
                  <Textarea
                    id="packagingMaterials"
                    value={step3Data.packagingMaterials}
                    onChange={(e) => setStep3Data({ ...step3Data, packagingMaterials: e.target.value })}
                    placeholder="Mô tả loại bao bì, chứng nhận an toàn thực phẩm..."
                    rows={3}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="productLabels" className="text-base font-semibold">
                    5.5. Nhãn sản phẩm
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                    Cung cấp kiểu nhãn cho thành phẩm xuất khẩu sang Trung Quốc
                  </p>
                  <Textarea
                    id="productLabels"
                    value={step3Data.productLabels}
                    onChange={(e) => setStep3Data({ ...step3Data, productLabels: e.target.value })}
                    placeholder="Mô tả nội dung nhãn, ngôn ngữ, thông tin bắt buộc..."
                    rows={3}
                    className="mt-1.5"
                  />
                </div>

                {/* Upload for Section 5 */}
                <div className="pt-4 border-t">
                  <FileUploader
                    fieldId="section_5"
                    fieldLabel="Tài liệu Mục 5: Nguyên liệu thô và phụ trợ"
                    maxFiles={3}
                    compact={false}
                    onFilesChange={(files) => setAttachments({ ...attachments, section_5: files })}
                  />
                </div>
              </div>

              {/* Section 6: Kiểm soát sản xuất và chế biến */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-primary border-b pb-2">6. Kiểm soát sản xuất và chế biến</h3>
                
                <div>
                  <Label htmlFor="productionProcess" className="text-base font-semibold">
                    6.1. Quy trình sản xuất và điểm kiểm soát tới hạn (CCP)
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                    Cung cấp quy trình sản xuất, chỉ ra các điểm kiểm soát tới hạn (CCP) và các biện pháp kiểm soát mối nguy đang được thực hiện
                  </p>
                  <Textarea
                    id="productionProcess"
                    value={step3Data.productionProcess}
                    onChange={(e) => setStep3Data({ ...step3Data, productionProcess: e.target.value })}
                    placeholder="Mô tả quy trình từng bước, xác định CCP, biện pháp kiểm soát..."
                    rows={4}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="haccpSystem" className="text-base font-semibold">
                    6.2. Hệ thống HACCP (nếu có)
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                    Cung cấp bảng phân tích mối nguy và Lịch trình HACCP, hồ sơ giám sát CCP, hồ sơ hiệu chỉnh sai lệch và xác minh
                  </p>
                  <Textarea
                    id="haccpSystem"
                    value={step3Data.haccpSystem}
                    onChange={(e) => setStep3Data({ ...step3Data, haccpSystem: e.target.value })}
                    placeholder="Mô tả hệ thống HACCP, bảng phân tích nguy, giám sát CCP..."
                    rows={3}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="mycotoxinsControl" className="text-base font-semibold">
                    6.3. Kiểm soát độc tố nấm mốc
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                    Cung cấp báo cáo kiểm tra lấy mẫu rằng độc tố nấm mốc trong các sản phẩm đáp ứng các tiêu chuẩn an toàn thực phẩm quốc gia của Trung Quốc
                  </p>
                  <Textarea
                    id="mycotoxinsControl"
                    value={step3Data.mycotoxinsControl}
                    onChange={(e) => setStep3Data({ ...step3Data, mycotoxinsControl: e.target.value })}
                    placeholder="Mô tả biện pháp phòng ngừa, tần suất kiểm tra, kết quả..."
                    rows={3}
                    className="mt-1.5"
                  />
                </div>

                {/* Upload for Section 6 */}
                <div className="pt-4 border-t">
                  <FileUploader
                    fieldId="section_6"
                    fieldLabel="Tài liệu Mục 6: Kiểm soát sản xuất và chế biến"
                    maxFiles={3}
                    compact={false}
                    onFilesChange={(files) => setAttachments({ ...attachments, section_6: files })}
                  />
                </div>
              </div>

              {/* Section 7: Làm sạch và sát trùng */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-primary border-b pb-2">7. Làm sạch và sát trùng</h3>
                
                <div>
                  <Label htmlFor="cleaningProcedures" className="text-base font-semibold">
                    7.1. Biện pháp làm sạch và khử trùng
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                    Cung cấp các biện pháp làm sạch và khử trùng, bao gồm các phương pháp và tần suất, và xác minh hiệu quả
                  </p>
                  <Textarea
                    id="cleaningProcedures"
                    value={step3Data.cleaningProcedures}
                    onChange={(e) => setStep3Data({ ...step3Data, cleaningProcedures: e.target.value })}
                    placeholder="Mô tả SSOP, phương pháp vệ sinh, tần suất, kiểm tra hiệu quả..."
                    rows={4}
                    className="mt-1.5"
                  />
                </div>

                {/* Upload for Section 7 */}
                <div className="pt-4 border-t">
                  <FileUploader
                    fieldId="section_7"
                    fieldLabel="Tài liệu Mục 7: Làm sạch và sát trùng"
                    maxFiles={3}
                    compact={false}
                    onFilesChange={(files) => setAttachments({ ...attachments, section_7: files })}
                  />
                </div>
              </div>

            </div>

            {/* Step 3 Navigation */}
            <div className="flex justify-between pt-6 border-t">
              <Button onClick={() => handleStepNavigation(2)} variant="outline" size="lg">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại
              </Button>
              <Button onClick={() => handleStepNavigation(4)} size="lg">
                Tiếp tục
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Quality Management */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Bước 4: Quản lý chất lượng và Kiểm soát</CardTitle>
            <CardDescription>
              Vui lòng cung cấp thông tin về kiểm soát hóa chất, truy xuất nguồn gốc, đào tạo nhân sự và kiểm soát dịch hại
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Lưu ý:</strong> Các hồ sơ đào tạo, kiểm nghiệm và xử lý dịch hại phải được lưu giữ ít nhất 2 năm.
              </AlertDescription>
            </Alert>

            <div className="space-y-8">
              {/* Section 8: Kiểm soát Hóa chất, Chất thải và Côn trùng */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-primary border-b pb-2">8. Kiểm soát Hóa chất, Chất thải và Côn trùng</h3>
                
                <div>
                  <Label htmlFor="chemicalControl" className="text-base font-semibold">
                    8.1. Kiểm soát hóa chất
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                    Mô tả ngắn gọn về các yêu cầu thu thập và bảo quản hóa chất
                  </p>
                  <Textarea
                    id="chemicalControl"
                    value={step4Data.chemicalControl}
                    onChange={(e) => setStep4Data({ ...step4Data, chemicalControl: e.target.value })}
                    placeholder="Mô tả nơi lưu trữ, danh sách hóa chất, biện pháp an toàn..."
                    rows={3}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="physicalContamination" className="text-base font-semibold">
                    8.2. Quản lý ô nhiễm vật lý
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                    Cung cấp hệ thống quản lý để ngăn ngừa ô nhiễm vật lý và các hồ sơ xử lý có liên quan
                  </p>
                  <Textarea
                    id="physicalContamination"
                    value={step4Data.physicalContamination}
                    onChange={(e) => setStep4Data({ ...step4Data, physicalContamination: e.target.value })}
                    placeholder="Mô tả biện pháp phòng ngừa kim loại, thủy tinh, nhựa..."
                    rows={3}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="pestControl" className="text-base font-semibold">
                    8.3. Kiểm soát thiệt hại do côn trùng và chuột
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                    Cung cấp các phương pháp kiểm soát và kế hoạch bố trí. Nếu ủy thác bên thứ ba, cung cấp bằng cấp của bên thứ ba
                  </p>
                  <Textarea
                    id="pestControl"
                    value={step4Data.pestControl}
                    onChange={(e) => setStep4Data({ ...step4Data, pestControl: e.target.value })}
                    placeholder="Mô tả biện pháp kiểm soát, hợp đồng dịch vụ..."
                    rows={3}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="wasteManagement" className="text-base font-semibold">
                    8.4. Quản lý chất thải
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                    Cung cấp hệ thống quản lý chất thải và các hồ sơ xử lý có liên quan
                  </p>
                  <Textarea
                    id="wasteManagement"
                    value={step4Data.wasteManagement}
                    onChange={(e) => setStep4Data({ ...step4Data, wasteManagement: e.target.value })}
                    placeholder="Mô tả phân loại rác thải, xử lý, hợp đồng thu gom..."
                    rows={3}
                    className="mt-1.5"
                  />
                </div>

                {/* Upload for Section 8 */}
                <div className="pt-4 border-t">
                  <FileUploader
                    fieldId="section_8"
                    fieldLabel="Tài liệu Mục 8: Kiểm soát Hóa chất, Chất thải và Côn trùng"
                    maxFiles={3}
                    compact={false}
                    onFilesChange={(files) => setAttachments({ ...attachments, section_8: files })}
                  />
                </div>
              </div>

              {/* Section 9: Truy xuất nguồn gốc */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-primary border-b pb-2">9. Truy xuất nguồn gốc sản phẩm</h3>
                
                <div>
                  <Label htmlFor="traceabilityProcedure" className="text-base font-semibold">
                    9.1. Quy trình truy xuất nguồn gốc và thu hồi
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                    Mô tả quy trình truy xuất nguồn gốc sản phẩm và lấy số lô làm ví dụ minh họa cách truy xuất nguyên liệu từ thành phẩm
                  </p>
                  <Textarea
                    id="traceabilityProcedure"
                    value={step4Data.traceabilityProcedure}
                    onChange={(e) => setStep4Data({ ...step4Data, traceabilityProcedure: e.target.value })}
                    placeholder="Mô tả hệ thống mã số lô, cách truy xuất ngược, quy trình thu hồi..."
                    rows={4}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="warehouseManagement" className="text-base font-semibold">
                    9.2. Quản lý kho - vào và ra
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                    Cung cấp quản lý kho sản phẩm vào và xuất kho
                  </p>
                  <Textarea
                    id="warehouseManagement"
                    value={step4Data.warehouseManagement}
                    onChange={(e) => setStep4Data({ ...step4Data, warehouseManagement: e.target.value })}
                    placeholder="Mô tả hệ thống quản lý kho, phương pháp FIFO/FEFO..."
                    rows={3}
                    className="mt-1.5"
                  />
                </div>

                {/* Upload for Section 9 */}
                <div className="pt-4 border-t">
                  <FileUploader
                    fieldId="section_9"
                    fieldLabel="Tài liệu Mục 9: Truy xuất nguồn gốc sản phẩm"
                    maxFiles={3}
                    compact={false}
                    onFilesChange={(files) => setAttachments({ ...attachments, section_9: files })}
                  />
                </div>
              </div>

              {/* Section 10: Quản lý và đào tạo nhân sự */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-primary border-b pb-2">10. Quản lý và đào tạo nhân sự</h3>
                
                <div>
                  <Label htmlFor="healthManagement" className="text-base font-semibold">
                    10.1. Quản lý vệ sinh và sức khỏe nhân sự
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                    Đưa ra các yêu cầu về quản lý sức khỏe trước khi làm việc và khám sức khỏe cho nhân viên
                  </p>
                  <Textarea
                    id="healthManagement"
                    value={step4Data.healthManagement}
                    onChange={(e) => setStep4Data({ ...step4Data, healthManagement: e.target.value })}
                    placeholder="Mô tả quy trình khám sức khỏe, tần suất, yêu cầu vệ sinh cá nhân..."
                    rows={3}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="personnelTraining" className="text-base font-semibold">
                    10.2. Đào tạo nhân sự
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                    Cung cấp kế hoạch, nội dung, đánh giá và hồ sơ đào tạo hàng năm cho nhân viên
                  </p>
                  <Textarea
                    id="personnelTraining"
                    value={step4Data.personnelTraining}
                    onChange={(e) => setStep4Data({ ...step4Data, personnelTraining: e.target.value })}
                    placeholder="Mô tả chương trình đào tạo ATTP, GMP, tần suất đào tạo..."
                    rows={3}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="managementTraining" className="text-base font-semibold">
                    10.3. Yêu cầu đối với nhân viên quản lý
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                    Cung cấp hồ sơ đào tạo của cán bộ quản lý về các quy định liên quan của pháp luật và quy định về kiểm dịch thực vật và an toàn thực phẩm
                  </p>
                  <Textarea
                    id="managementTraining"
                    value={step4Data.managementTraining}
                    onChange={(e) => setStep4Data({ ...step4Data, managementTraining: e.target.value })}
                    placeholder="Mô tả đào tạo cán bộ quản lý, chứng chỉ, kiến thức chuyên môn..."
                    rows={3}
                    className="mt-1.5"
                  />
                </div>

                {/* Upload for Section 10 */}
                <div className="pt-4 border-t">
                  <FileUploader
                    fieldId="section_10"
                    fieldLabel="Tài liệu Mục 10: Quản lý và đào tạo nhân sự"
                    maxFiles={3}
                    compact={false}
                    onFilesChange={(files) => setAttachments({ ...attachments, section_10: files })}
                  />
                </div>
              </div>

              {/* Section 11: Tự kiểm tra và tự kiểm soát */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-primary border-b pb-2">11. Tự kiểm tra và tự kiểm soát</h3>
                
                <div>
                  <Label htmlFor="productInspection" className="text-base font-semibold">
                    11.1. Kiểm tra thành phẩm
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                    Cung cấp các hạng mục, chỉ tiêu, phương pháp và tần suất kiểm tra thành phẩm
                  </p>
                  <Textarea
                    id="productInspection"
                    value={step4Data.productInspection}
                    onChange={(e) => setStep4Data({ ...step4Data, productInspection: e.target.value })}
                    placeholder="Mô tả các chỉ tiêu kiểm tra, phương pháp, tần suất, tiêu chuẩn..."
                    rows={3}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="laboratoryQualification" className="text-base font-semibold">
                    11.2. Năng lực phòng thí nghiệm
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                    Nếu có phòng thí nghiệm riêng, nộp chứng chỉ năng lực; nếu ủy thác bên thứ ba, cung cấp chứng chỉ của phòng thí nghiệm được ủy thác
                  </p>
                  <Textarea
                    id="laboratoryQualification"
                    value={step4Data.laboratoryQualification}
                    onChange={(e) => setStep4Data({ ...step4Data, laboratoryQualification: e.target.value })}
                    placeholder="Mô tả năng lực lab, chứng chỉ ISO 17025, thiết bị..."
                    rows={3}
                    className="mt-1.5"
                  />
                </div>

                {/* Upload for Section 11 */}
                <div className="pt-4 border-t">
                  <FileUploader
                    fieldId="section_11"
                    fieldLabel="Tài liệu Mục 11: Tự kiểm tra và tự kiểm soát"
                    maxFiles={3}
                    compact={false}
                    onFilesChange={(files) => setAttachments({ ...attachments, section_11: files })}
                  />
                </div>
              </div>

              {/* Section 12: Kiểm soát Dịch hại */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-primary border-b pb-2">12. Kiểm soát Dịch hại</h3>
                
                <div>
                  <Label htmlFor="quarantinePests" className="text-base font-semibold">
                    12.1. Phòng ngừa và kiểm soát dịch hại kiểm dịch mà Trung Quốc quan tâm
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                    Cung cấp danh sách các loài gây hại kiểm dịch mà Trung Quốc quan tâm và hệ thống giám sát hồ sơ
                  </p>
                  <Textarea
                    id="quarantinePests"
                    value={step4Data.quarantinePests}
                    onChange={(e) => setStep4Data({ ...step4Data, quarantinePests: e.target.value })}
                    placeholder="Liệt kê các dịch hại kiểm dịch, biện pháp giám sát..."
                    rows={3}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="pestIdentification" className="text-base font-semibold">
                    12.2. Xác định sinh vật gây hại
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                    Cung cấp hồ sơ về sinh vật gây hại được tìm thấy trong quá trình sản xuất và bảo quản cũng như hồ sơ nhận dạng do các tổ chức chuyên môn thực hiện
                  </p>
                  <Textarea
                    id="pestIdentification"
                    value={step4Data.pestIdentification}
                    onChange={(e) => setStep4Data({ ...step4Data, pestIdentification: e.target.value })}
                    placeholder="Mô tả quy trình phát hiện và nhận dạng sâu bệnh..."
                    rows={3}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="pestControlMeasures" className="text-base font-semibold">
                    12.3. Biện pháp kiểm soát dịch hại
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                    Cung cấp hồ sơ về việc thực hiện các biện pháp phòng trừ dịch hại trong khu vực sản xuất và bảo quản
                  </p>
                  <Textarea
                    id="pestControlMeasures"
                    value={step4Data.pestControlMeasures}
                    onChange={(e) => setStep4Data({ ...step4Data, pestControlMeasures: e.target.value })}
                    placeholder="Mô tả biện pháp phòng ngừa và xử lý sâu bệnh..."
                    rows={3}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="fumigationTreatment" className="text-base font-semibold">
                    12.4. Xử lý hun trùng (nếu cần)
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">
                    Cung cấp phương pháp xử lý hun trùng cũng như trình độ của tổ chức hun trùng và nhân viên
                  </p>
                  <Textarea
                    id="fumigationTreatment"
                    value={step4Data.fumigationTreatment}
                    onChange={(e) => setStep4Data({ ...step4Data, fumigationTreatment: e.target.value })}
                    placeholder="Mô tả phương pháp hun trùng, đơn vị thực hiện, chứng chỉ..."
                    rows={3}
                    className="mt-1.5"
                  />
                </div>

                {/* Upload for Section 12 */}
                <div className="pt-4 border-t">
                  <FileUploader
                    fieldId="section_12"
                    fieldLabel="Tài liệu Mục 12: Kiểm soát Dịch hại"
                    maxFiles={3}
                    compact={false}
                    onFilesChange={(files) => setAttachments({ ...attachments, section_12: files })}
                  />
                </div>
              </div>

              {/* Additional Documents Section */}
              <div className="space-y-4 pt-8 mt-8 border-t-2 border-primary/20">
                <div className="bg-accent/10 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-primary mb-2">📎 Tài liệu bổ sung</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload thêm các tài liệu hỗ trợ như: chứng chỉ ISO, giấy phép, hợp đồng, báo cáo, ảnh nhà máy, sơ đồ chi tiết...
                  </p>
                  <FileUploader
                    fieldId="additionalDocuments"
                    fieldLabel="Tài liệu bổ sung"
                    maxFiles={5}
                    compact={false}
                    onFilesChange={(files) => setAttachments({ ...attachments, additionalDocuments: files })}
                  />
                </div>
              </div>
            </div>

            {/* Step 4 Navigation */}
            <div className="flex justify-between pt-6 border-t">
              <Button onClick={() => handleStepNavigation(3)} variant="outline" size="lg">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại
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

      {/* Success Submission Card */}
      {submitSuccess && (
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
      )}
    </div>
  )
}
