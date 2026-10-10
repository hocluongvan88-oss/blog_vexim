/**
 * Kiểm thử lớp gọi model AI (lib/ai-chat.ts).
 *
 * Chạy:
 *   npx esbuild scripts/verify-chat/ai-providers.test.ts --bundle --platform=node \
 *     --format=cjs --alias:@=. --alias:groq-sdk=./scripts/verify-chat/groq-stub.ts \
 *     --outfile=/tmp/providers.cjs && node /tmp/providers.cjs
 *
 * Vì sao cần: đã từng xảy ra thật — admin xoá GROQ_API_KEY (hoặc Groq khai tử
 * model) là chatbot im lặng hoàn toàn. Bộ này bảo đảm chỉ cần MỘT trong hai key
 * là bot vẫn trả lời, và tự chuyển nhà cung cấp khi bên kia lỗi.
 */
import { readFileSync } from "fs"
import {
  DEFAULT_AI_REQUEST_TIMEOUT_MS,
  DEFAULT_GEMINI_MODEL,
  NO_CHAT_PROVIDER_MESSAGE,
  getAiRequestTimeoutMs,
  callGeminiGenerate,
  callGeminiWithFallback,
  describeChatConfig,
  extractGeminiText,
  generateChatText,
  getChatProviders,
  isProviderUnavailableError,
  providerForModel,
  resolveGeminiChain,
} from "@/lib/ai-chat"
import { DEFAULT_GROQ_MODEL } from "@/lib/ai-models"

let pass = 0
let fail = 0
const check = (ok: boolean, msg: string) => {
  ok ? pass++ : fail++
  console.log(`${ok ? "PASS" : "FAIL"} ${msg}`)
}

const savedEnv = {
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  CHAT_PROVIDER: process.env.CHAT_PROVIDER,
}
function setEnv(env: Record<string, string | undefined>) {
  for (const key of ["GROQ_API_KEY", "GEMINI_API_KEY", "GOOGLE_API_KEY", "CHAT_PROVIDER"]) {
    delete (process.env as any)[key]
  }
  for (const [key, value] of Object.entries(env)) {
    if (value !== undefined) (process.env as any)[key] = value
  }
}

/* ---------- 1. Chỉ có GEMINI_API_KEY vẫn chạy được ---------- */
setEnv({ GEMINI_API_KEY: "gemini-key" })
check(
  JSON.stringify(getChatProviders()) === JSON.stringify(["gemini"]),
  "Chỉ có GEMINI_API_KEY -> chatbot dùng Gemini (không cần Groq)",
)
check(
  getChatProviders("openai/gpt-oss-120b").includes("gemini"),
  "CSDL còn ghi model Groq nhưng thiếu key Groq -> vẫn trả lời bằng Gemini",
)

/* ---------- 2. Chỉ có GROQ_API_KEY cũng chạy được ---------- */
setEnv({ GROQ_API_KEY: "groq-key" })
check(
  JSON.stringify(getChatProviders()) === JSON.stringify(["groq"]),
  "Chỉ có GROQ_API_KEY -> vẫn chạy như trước",
)

/* ---------- 3. Có cả hai: Groq chính, Gemini dự phòng ---------- */
setEnv({ GROQ_API_KEY: "groq-key", GEMINI_API_KEY: "gemini-key" })
check(
  JSON.stringify(getChatProviders()) === JSON.stringify(["groq", "gemini"]),
  "Có cả hai key -> Groq chính, Gemini dự phòng",
)
check(
  JSON.stringify(getChatProviders("gemini-3.8-flash")) === JSON.stringify(["gemini", "groq"]),
  "CSDL ghi model Gemini -> Gemini chính, Groq dự phòng",
)
process.env.CHAT_PROVIDER = "gemini"
check(
  JSON.stringify(getChatProviders()) === JSON.stringify(["gemini", "groq"]),
  "CHAT_PROVIDER=gemini -> đổi thứ tự ưu tiên",
)
delete process.env.CHAT_PROVIDER

/* ---------- 4. Không có key nào: báo lỗi rõ ràng ---------- */
setEnv({})
check(getChatProviders().length === 0, "Không có key nào -> không có nhà cung cấp")
check(NO_CHAT_PROVIDER_MESSAGE.includes("GROQ_API_KEY") && NO_CHAT_PROVIDER_MESSAGE.includes("GEMINI_API_KEY"),
  "Thông báo lỗi chỉ rõ cần key nào")
check(describeChatConfig().hint === NO_CHAT_PROVIDER_MESSAGE, "Log khởi động nói thẳng thiếu key")

/* ---------- 5. Đoán nhà cung cấp theo tên model ---------- */
check(providerForModel("gemini-3.8-flash") === "gemini", "gemini-3.8-flash -> Gemini")
check(providerForModel("openai/gpt-oss-120b") === "groq", "openai/gpt-oss-120b -> Groq")
check(providerForModel("") === null, "Không có model -> để hệ thống tự chọn")

/* ---------- 6. Chuỗi model Gemini ---------- */
const gemChain = resolveGeminiChain("openai/gpt-oss-120b")
check(!gemChain.includes("openai/gpt-oss-120b"), "Không gửi model Groq sang API Google")
check(gemChain[0] === DEFAULT_GEMINI_MODEL, `Model Gemini mặc định: ${gemChain[0]}`)
check(gemChain.length === new Set(gemChain).size, `Chuỗi Gemini không lặp: ${gemChain.join(" → ")}`)

/* ---------- 7. Đọc phản hồi Gemini ---------- */
check(
  extractGeminiText({ candidates: [{ content: { parts: [{ text: "Dạ em chào" }, { text: " anh/chị ạ!" }] } }] }) ===
    "Dạ em chào anh/chị ạ!",
  "Ghép các phần chữ trong phản hồi Gemini",
)
check(
  extractGeminiText({
    candidates: [{ content: { parts: [{ text: "suy luận nội bộ", thought: true }, { text: "Câu trả lời thật" }] } }],
  }) === "Câu trả lời thật",
  "Bỏ phần suy luận nội bộ (thought) của Gemini 3",
)
check(extractGeminiText({ candidates: [] }) === "", "Phản hồi rỗng -> chuỗi rỗng, không vỡ")

async function runAsync() {
  /* ---------- 8. Gọi Gemini: đúng URL/header/body ---------- */
  const captured: any = {}
  const okFetch: any = async (url: string, init: any) => {
    captured.url = url
    captured.init = init
    return {
      ok: true,
      status: 200,
      json: async () => ({ candidates: [{ content: { parts: [{ text: "Dạ em hỗ trợ được ạ." }] } }] }),
    }
  }
  const gemResult = await callGeminiGenerate({
    apiKey: "gemini-key",
    model: DEFAULT_GEMINI_MODEL,
    systemPrompt: "Bạn là trợ lý Vexim",
    messages: [
      { role: "assistant", content: "Dạ em chào anh/chị" },
      { role: "user", content: "xin chào" },
    ],
    temperature: 0.7,
    maxTokens: 512,
    fetchImpl: okFetch,
  })
  check(captured.url.includes(DEFAULT_GEMINI_MODEL) && captured.url.includes(":generateContent"),
    `Gọi đúng endpoint: ${captured.url.split("/models/")[1]}`)
  check(captured.init.headers["x-goog-api-key"] === "gemini-key", "Gửi key qua header x-goog-api-key")
  const sentBody = JSON.parse(captured.init.body)
  check(sentBody.systemInstruction.parts[0].text === "Bạn là trợ lý Vexim", "Gửi system prompt vào systemInstruction")
  check(sentBody.contents[0].role === "model" && sentBody.contents[1].role === "user",
    "Đổi role assistant -> model cho đúng chuẩn Gemini")
  check(sentBody.generationConfig.maxOutputTokens >= 2048, "Để dư token cho phần suy luận nội bộ của Gemini 3")
  check(gemResult.text.includes("hỗ trợ"), "Đọc được câu trả lời của Gemini")

  /* ---------- 9. Lỗi thật (400) không được che ---------- */
  let badRequestThrew = false
  try {
    await callGeminiGenerate({
      apiKey: "gemini-key",
      model: DEFAULT_GEMINI_MODEL,
      systemPrompt: "x",
      messages: [{ role: "user", content: "x" }],
      temperature: 0.7,
      maxTokens: 512,
      fetchImpl: (async () => ({ ok: false, status: 400, json: async () => ({ error: { message: "Invalid JSON payload" } }) })) as any,
    })
  } catch (error: any) {
    badRequestThrew = error.status === 400
  }
  check(badRequestThrew, "Lỗi 400 của Gemini vẫn ném ra ngoài")

  /* ---------- 10. Model Gemini không tồn tại -> thử model kế tiếp ---------- */
  const triedModels: string[] = []
  const chainFetch: any = async (url: string) => {
    const model = url.split("/models/")[1].split(":")[0]
    triedModels.push(model)
    if (triedModels.length === 1) {
      return { ok: false, status: 404, json: async () => ({ error: { message: "model not found" } }) }
    }
    return { ok: true, status: 200, json: async () => ({ candidates: [{ content: { parts: [{ text: "Xin chào anh/chị" }] } }] }) }
  }
  const chainResult = await callGeminiWithFallback({
    apiKey: "gemini-key",
    systemPrompt: "x",
    messages: [{ role: "user", content: "xin chào" }],
    temperature: 0.7,
    maxTokens: 512,
    fetchImpl: chainFetch,
  })
  check(chainResult.model !== DEFAULT_GEMINI_MODEL && chainResult.text.includes("chào"),
    `Model Gemini chết -> tự dùng "${chainResult.model}" (đã gọi: ${triedModels.join(", ")})`)

  /* ---------- 11. Groq chết -> Gemini trả lời (đúng sự cố thật) ---------- */
  setEnv({ GEMINI_API_KEY: "gemini-key" })
  const onlyGemini = await generateChatText({
    systemPrompt: "x",
    message: "xin chào",
    fetchImpl: okFetch,
  })
  check(onlyGemini.provider === "gemini", `Thiếu GROQ_API_KEY -> Gemini trả lời (${onlyGemini.provider}/${onlyGemini.model})`)

  setEnv({ GROQ_API_KEY: "groq-key", GEMINI_API_KEY: "gemini-key" })
  const groqDead = await generateChatText({
    systemPrompt: "x",
    message: "xin chào",
    fetchImpl: okFetch,
    groqClientFactory: () => ({
      chat: {
        completions: {
          create: async () => {
            throw Object.assign(new Error("The model does not exist or you do not have access to it."), { status: 404 })
          },
        },
      },
    }),
  })
  check(groqDead.provider === "gemini", `Groq lỗi 404 -> tự chuyển sang ${groqDead.provider}/${groqDead.model}`)

  const groqRateLimited = await generateChatText({
    systemPrompt: "x",
    message: "xin chào",
    fetchImpl: okFetch,
    groqClientFactory: () => ({
      chat: { completions: { create: async () => { throw Object.assign(new Error("rate limit reached"), { status: 429 }) } } },
    }),
  })
  check(groqRateLimited.provider === "gemini", "Groq hết hạn mức -> chuyển sang Gemini")

  /* ---------- 12. Groq còn sống thì vẫn là bên trả lời chính ---------- */
  let geminiCalled = false
  const spyFetch: any = async () => {
    geminiCalled = true
    return { ok: true, status: 200, json: async () => ({ candidates: [{ content: { parts: [{ text: "gemini" }] } }] }) }
  }
  const groqAlive = await generateChatText({
    systemPrompt: "x",
    message: "xin chào",
    fetchImpl: spyFetch,
    groqClientFactory: () => ({
      chat: {
        completions: {
          create: async () => ({ choices: [{ message: { content: "Dạ em chào anh/chị ạ!" } }] }),
        },
      },
    }),
  })
  check(groqAlive.provider === "groq" && !geminiCalled, "Groq còn sống -> Groq trả lời, không gọi Gemini")

  /* ---------- 13. Lỗi 400 của Groq không bị che bằng Gemini ---------- */
  let groqBadRequestThrew = false
  try {
    await generateChatText({
      systemPrompt: "x",
      message: "xin chào",
      fetchImpl: spyFetch,
      groqClientFactory: () => ({
        chat: { completions: { create: async () => { throw Object.assign(new Error("invalid request"), { status: 400 }) } } },
      }),
    })
  } catch {
    groqBadRequestThrew = true
  }
  check(groqBadRequestThrew, "Lỗi 400 của Groq vẫn ném ra ngoài, không giấu lỗi thật")

  /* ---------- 14. Nhận diện lỗi 'nhà cung cấp không dùng được' ---------- */
  check(isProviderUnavailableError({ status: 429 }) === true, "429 -> thử nhà cung cấp khác")
  check(isProviderUnavailableError({ status: 401 }) === true, "401 key sai -> thử nhà cung cấp khác")
  check(isProviderUnavailableError({ status: 404 }) === true, "404 model bị khai tử -> thử nhà cung cấp khác")
  check(isProviderUnavailableError({ status: 400 }) === false, "400 lỗi request -> không che")

  /* ---------- 16. Giới hạn thời gian: nhà cung cấp treo không làm khách chờ mãi ---------- */
  const savedTimeout = process.env.AI_REQUEST_TIMEOUT_MS
  process.env.AI_REQUEST_TIMEOUT_MS = "1000"
  check(getAiRequestTimeoutMs() === 1000, "Đọc AI_REQUEST_TIMEOUT_MS hợp lệ")
  process.env.AI_REQUEST_TIMEOUT_MS = "abc"
  check(getAiRequestTimeoutMs() === DEFAULT_AI_REQUEST_TIMEOUT_MS, "Giá trị lỗi -> dùng mặc định 15 giây")
  process.env.AI_REQUEST_TIMEOUT_MS = "50"
  check(getAiRequestTimeoutMs() === DEFAULT_AI_REQUEST_TIMEOUT_MS, "Quá nhỏ (<1 giây) -> dùng mặc định, tránh tự cắt sai")
  process.env.AI_REQUEST_TIMEOUT_MS = "1000"

  // Gemini treo: fetch không bao giờ trả lời, chỉ dừng khi bị huỷ (AbortSignal)
  let hangCalls = 0
  let hangAborted = false
  const hangFetch: any = (_url: string, init: any) => {
    hangCalls++
    return new Promise((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => {
        hangAborted = true
        reject(Object.assign(new Error("aborted"), { name: "AbortError" }))
      })
    })
  }
  const hangStart = Date.now()
  let geminiTimeoutErr: any = null
  try {
    await callGeminiWithFallback({
      apiKey: "gemini-key",
      systemPrompt: "x",
      messages: [{ role: "user", content: "xin chào" }],
      temperature: 0.7,
      maxTokens: 512,
      fetchImpl: hangFetch,
    })
  } catch (error: any) {
    geminiTimeoutErr = error
  }
  check(geminiTimeoutErr?.timeout === true && geminiTimeoutErr?.status === 408,
    "Gemini treo -> báo lỗi timeout (408) thay vì chờ mãi")
  check(Date.now() - hangStart < 4000, `Hết giờ đúng hạn (${Date.now() - hangStart} ms)`)
  check(hangAborted, "Request bị huỷ khi hết giờ")
  check(hangCalls === 1, "Gemini treo -> không thử tiếp các model Gemini khác (tránh chậm thêm)")

  // Gemini treo, Groq còn sống -> Groq trả lời
  setEnv({ GROQ_API_KEY: "groq-key", GEMINI_API_KEY: "gemini-key" })
  const geminiHungGroqUp = await generateChatText({
    systemPrompt: "x",
    message: "xin chào",
    preferredModel: DEFAULT_GEMINI_MODEL,
    fetchImpl: hangFetch,
    groqClientFactory: () => ({
      chat: { completions: { create: async () => ({ choices: [{ message: { content: "Dạ em chào anh/chị ạ!" } }] }) } },
    }),
  })
  check(geminiHungGroqUp.provider === "groq", "Gemini treo -> tự chuyển sang Groq trả lời")

  // Groq treo, Gemini còn sống -> Gemini trả lời
  const groqHung = await generateChatText({
    systemPrompt: "x",
    message: "xin chào",
    preferredModel: "openai/gpt-oss-120b",
    fetchImpl: okFetch,
    groqClientFactory: () => ({
      chat: { completions: { create: () => new Promise(() => {}) } },
    }),
  })
  check(groqHung.provider === "gemini", "Groq treo -> tự chuyển sang Gemini trả lời")

  // Cả hai đều treo -> báo lỗi timeout rõ ràng (không treo vô hạn)
  let bothHungErr: any = null
  try {
    await generateChatText({
      systemPrompt: "x",
      message: "xin chào",
      preferredModel: DEFAULT_GEMINI_MODEL,
      fetchImpl: hangFetch,
      groqClientFactory: () => ({
        chat: { completions: { create: () => new Promise(() => {}) } },
      }),
    })
  } catch (error: any) {
    bothHungErr = error
  }
  check(bothHungErr?.timeout === true, "Cả hai nhà cung cấp đều treo -> báo lỗi timeout")

  // Trả lời nhanh không bị ảnh hưởng bởi giới hạn thời gian
  const fastResult = await generateChatText({
    systemPrompt: "x",
    message: "xin chào",
    fetchImpl: okFetch,
    groqClientFactory: () => ({
      chat: { completions: { create: async () => ({ choices: [{ message: { content: "nhanh" } }] }) } },
    }),
  })
  check(fastResult.text === "nhanh", "Trả lời nhanh -> không bị cắt bởi giới hạn thời gian")

  setEnv({ GEMINI_API_KEY: undefined, GROQ_API_KEY: undefined })
  if (savedTimeout === undefined) delete process.env.AI_REQUEST_TIMEOUT_MS
  else process.env.AI_REQUEST_TIMEOUT_MS = savedTimeout
}

/* ---------- 15. Không còn chỗ nào bắt buộc phải có GROQ_API_KEY ---------- */
const aiService = readFileSync("lib/ai-service.ts", "utf8")
check(!aiService.includes("Groq client is not initialized"),
  "ai-service không còn bắt buộc khởi tạo Groq")
check(aiService.includes("generateChatText as callChatModel"), "ai-service dùng lớp gọi AI chung")
const blogRoute = readFileSync("app/api/blog/ai-assistant/route.ts", "utf8")
check(!blogRoute.includes("import Groq from"), "Trợ lý viết bài không còn gắn cứng vào Groq")
check(blogRoute.includes("getChatProviders"), "Trợ lý viết bài kiểm tra khoá AI khả dụng")

runAsync().then(() => {
  setEnv(savedEnv as any)
  console.log(`\n${pass} PASS / ${fail} FAIL`)
  if (fail) process.exit(1)
})
