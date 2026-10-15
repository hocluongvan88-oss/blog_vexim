// Compile the small, pure email dependency graph for previews/tests without Next or SMTP.
import ts from "typescript"
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { createRequire } from "node:module"
import { fileURLToPath } from "node:url"
import path from "node:path"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const files = ["contact-info.ts", "business-profile.ts", "email-layout.ts", "email-templates.tsx", "email-gacc.tsx", "email-fda-registration.tsx", "email-consultation.tsx"]

export function loadEmailTemplates() {
  const dir = mkdtempSync(path.join(tmpdir(), "vexim-email-"))
  const require = createRequire(import.meta.url)
  try {
    for (const name of files) {
      const result = ts.transpileModule(readFileSync(path.join(root, "lib", name), "utf8"), {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
      })
      writeFileSync(path.join(dir, name.replace(/\.tsx?$/, ".js")), result.outputText)
    }
    const templates = Object.assign({}, ...files.map((name) => require(path.join(dir, name.replace(/\.tsx?$/, ".js")))))
    return { templates, cleanup: () => rmSync(dir, { recursive: true, force: true }) }
  } catch (error) {
    rmSync(dir, { recursive: true, force: true })
    throw error
  }
}
