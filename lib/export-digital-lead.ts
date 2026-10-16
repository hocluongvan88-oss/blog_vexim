import { z } from "zod"
import { EXPORT_CHANNELS, EXPORT_MARKETS } from "./export-digital-content"

/** We only collect the public URL; never fetch or crawl user-provided URLs in the API. */
export function normalizeCompanyWebsite(value: string): string {
  const input = value.trim()
  if (!input || input.length > 500) throw new Error("Vui lòng nhập website doanh nghiệp hợp lệ.")
  const url = new URL(/^[a-z][a-z\d+.-]*:/i.test(input) ? input : `https://${input}`)
  const host = url.hostname.toLowerCase()
  if (
    !["https:", "http:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.port ||
    !host.includes(".") ||
    /(^|\.)(localhost|local|internal|test|invalid)$/.test(host) ||
    /^[\d.]+$/.test(host) ||
    host.includes(":") ||
    !/^[a-z\d.-]+\.[a-z]{2,}$/i.test(host) ||
    host.split(".").some((label) => !/^[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?$/i.test(label))
  ) {
    throw new Error("Vui lòng nhập website công khai, ví dụ doanhnghiep.com.")
  }
  url.hash = ""
  url.search = ""
  return url.href
}

export const exportDigitalLeadSchema = z
  .object({
    website: z.string().max(500).default(""),
    noWebsite: z.boolean().default(false),
    company: z.string().trim().min(2, "Vui lòng nhập tên doanh nghiệp.").max(180),
    product: z.string().trim().min(2, "Vui lòng nhập sản phẩm chính.").max(240),
    markets: z
      .array(z.enum(EXPORT_MARKETS))
      .min(1, "Vui lòng chọn ít nhất một thị trường.")
      .max(8)
      .transform((values) => [...new Set(values)]),
    name: z.string().trim().min(2, "Vui lòng nhập họ tên liên hệ.").max(120),
    phone: z
      .string()
      .trim()
      .max(30)
      .refine(
        (value) => /^\+?\d{8,15}$/.test(value.replace(/[\s().-]/g, "")),
        "Vui lòng nhập số điện thoại/Zalo hợp lệ.",
      ),
    email: z
      .union([z.literal(""), z.string().trim().email("Email chưa hợp lệ.").max(254)])
      .optional()
      .default(""),
    channels: z
      .array(z.enum(EXPORT_CHANNELS))
      .max(5)
      .default([])
      .transform((values) => [...new Set(values)]),
    honeypot: z.string().max(200).default(""),
  })
  .superRefine((value, context) => {
    if (!value.noWebsite) {
      try {
        normalizeCompanyWebsite(value.website)
      } catch {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["website"],
          message: "Nhập website hợp lệ hoặc chọn “Chưa có website”.",
        })
      }
    }
  })

export type ExportDigitalLead = z.infer<typeof exportDigitalLeadSchema>
