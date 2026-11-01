import ts from "typescript"
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { createRequire } from "node:module"
import { fileURLToPath } from "node:url"
import path from "node:path"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))

/** Load pure schema builders outside Next, without network/DB side effects. */
export function loadSchemaBuilders() {
  const dir = mkdtempSync(path.join(tmpdir(), "vexim-schema-"))
  const require = createRequire(import.meta.url)
  try {
    for (const name of ["contact-info", "vexim-trade-content", "business-profile", "schema", "fda-page-content", "fda-page-schema", "vexim-trade-assets", "vexim-trade-styles", "vexim-trade-page"]) {
      const result = ts.transpileModule(readFileSync(path.join(root, "lib", `${name}.ts`), "utf8"), {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
      })
      writeFileSync(path.join(dir, `${name}.js`), result.outputText)
    }
    return {
      builders: { ...require(path.join(dir, "schema.js")), ...require(path.join(dir, "fda-page-schema.js")) },
      fdaContent: require(path.join(dir, "fda-page-content.js")),
      profile: require(path.join(dir, "business-profile.js")),
      trade: { ...require(path.join(dir, "vexim-trade-assets.js")), ...require(path.join(dir, "vexim-trade-content.js")), ...require(path.join(dir, "vexim-trade-page.js")) },
      cleanup: () => rmSync(dir, { recursive: true, force: true }),
    }
  } catch (error) {
    rmSync(dir, { recursive: true, force: true })
    throw error
  }
}
