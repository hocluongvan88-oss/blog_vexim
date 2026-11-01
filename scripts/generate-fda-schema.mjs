import { mkdirSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import path from "node:path"
import { loadSchemaBuilders } from "./schema-loader.mjs"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const { builders: B, cleanup } = loadSchemaBuilders()
try {
  const data = { "@context": "https://schema.org", "@graph": [...B.buildSiteSchema()["@graph"], ...B.buildFdaPageSchema()["@graph"]] }
  mkdirSync(path.join(root, "docs/seo"), { recursive: true })
  writeFileSync(path.join(root, "docs/seo/fda-schema.json"), JSON.stringify(data, null, 2).replace(/</g, "\\u003c") + "\n")
  console.log("Generated docs/seo/fda-schema.json (matches layout + FDA page; do not inject again)")
} finally {
  cleanup()
}
