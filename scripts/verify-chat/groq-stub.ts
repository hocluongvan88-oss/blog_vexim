/**
 * Groq giả cho bộ kiểm thử: máy kiểm thử không có `node_modules` và không gọi
 * mạng, nên khi bundle cần thay `groq-sdk` bằng file này:
 *
 *   --alias:groq-sdk=./scripts/verify-chat/groq-stub.ts
 *
 * Nhờ vậy mới kiểm thử được các hàm thật trong `lib/ai-service.ts` (ví dụ
 * `analyzeIntent` quyết định khi nào chuyển chuyên viên).
 */
export default class GroqStub {
  chat = {
    completions: {
      create: async () => {
        throw new Error("Groq giả: không gọi mạng trong bộ kiểm thử")
      },
    },
  }
  constructor(_options?: unknown) {}
}
