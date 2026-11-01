import assert from "node:assert/strict"
import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import path from "node:path"
import sharp from "sharp"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const source = path.join(root, "public/logo.png")
const sourceBytes = readFileSync(source)
const metadata = await sharp(source).metadata()
assert.equal(metadata.width, 824, "Review the crop if the original Vexim logo changes")
assert.equal(metadata.height, 543)
// The uploaded logo has the V symbol above the VEXIM wordmark. Keep the original
// symbol/color, without the tiny lettering that becomes unreadable in search.
const top = await sharp(source).extract({ left: 0, top: 0, width: 824, height: 370 }).png().toBuffer()
const mark = await sharp(top).trim().toBuffer()

async function icon(size, fraction) {
  const inner = Math.round(size * fraction)
  const margin = Math.floor((size - inner) / 2)
  return sharp(mark)
    .resize(inner, inner, { fit: "contain", background: "#ffffff" })
    .extend({
      top: margin,
      left: margin,
      bottom: size - inner - margin,
      right: size - inner - margin,
      background: "#ffffff",
    })
    .flatten({ background: "#ffffff" })
    .png({ compressionLevel: 9 })
    .toBuffer()
}

for (const [file, size, fraction] of [
  ["favicon.png", 96, 0.84],
  ["apple-icon.png", 180, 0.8],
  // The manifest declares any+maskable: keep the entire mark inside the
  // central 80%-diameter safe circle, not just inside a square inset.
  ["icon-192.png", 192, 0.64],
  ["icon-512.png", 512, 0.64],
  ["icon-dark-32x32.png", 32, 0.84],
  ["icon-light-32x32.png", 32, 0.84],
]) {
  const bytes = await icon(size, fraction)
  writeFileSync(path.join(root, "public", file), bytes)
  console.log(`${file}: PNG ${size}×${size}, ${bytes.length} bytes`)
}

// Legacy /favicon.ico fallback with real 32/48px PNG frames. The homepage's
// explicit, stable /favicon.png remains the primary Google Search candidate.
const frames = await Promise.all([32, 48].map((size) => icon(size, 0.84)))
const header = Buffer.alloc(6 + 16 * frames.length)
header.writeUInt16LE(1, 2)
header.writeUInt16LE(frames.length, 4)
let offset = header.length
for (let i = 0; i < frames.length; i++) {
  const start = 6 + 16 * i
  header[start] = header[start + 1] = [32, 48][i]
  header.writeUInt16LE(1, start + 4)
  header.writeUInt16LE(32, start + 6)
  header.writeUInt32LE(frames[i].length, start + 8)
  header.writeUInt32LE(offset, start + 12)
  offset += frames[i].length
}
writeFileSync(path.join(root, "public/favicon.ico"), Buffer.concat([header, ...frames]))
// Keep public/logo.png, the manifest's admin identity and Trade-specific icons unchanged.
assert.deepEqual(readFileSync(source), sourceBytes)
