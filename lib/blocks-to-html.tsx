import type { Block } from "@/components/block-editor/types"

/**
 * Map of common LaTeX commands to their Unicode equivalents.
 * Used to display inline math symbols (e.g. "$\ge$ 98%") that appear in
 * AI-generated content as proper characters instead of raw LaTeX source.
 */
const LATEX_SYMBOLS: Record<string, string> = {
  ge: "≥",
  geq: "≥",
  le: "≤",
  leq: "≤",
  neq: "≠",
  ne: "≠",
  approx: "≈",
  equiv: "≡",
  times: "×",
  div: "÷",
  pm: "±",
  mp: "∓",
  cdot: "·",
  ast: "∗",
  star: "⋆",
  bullet: "•",
  infty: "∞",
  partial: "∂",
  nabla: "∇",
  sum: "∑",
  prod: "∏",
  int: "∫",
  sqrt: "√",
  propto: "∝",
  forall: "∀",
  exists: "∃",
  in: "∈",
  notin: "∉",
  subset: "⊂",
  subseteq: "⊆",
  supset: "⊃",
  supseteq: "⊇",
  cup: "∪",
  cap: "∩",
  emptyset: "∅",
  rightarrow: "→",
  Rightarrow: "⇒",
  leftarrow: "←",
  Leftarrow: "⇐",
  leftrightarrow: "↔",
  Leftrightarrow: "⇔",
  uparrow: "↑",
  downarrow: "↓",
  degree: "°",
  circ: "°",
  percent: "%",
  alpha: "α",
  beta: "β",
  gamma: "γ",
  delta: "δ",
  epsilon: "ε",
  theta: "θ",
  lambda: "λ",
  mu: "µ",
  pi: "π",
  sigma: "σ",
  phi: "φ",
  omega: "ω",
  Delta: "Δ",
  Sigma: "Σ",
  Omega: "Ω",
  Phi: "Φ",
  Pi: "Π",
  ldots: "…",
  dots: "…",
  to: "→",
  leq_slant: "⩽",
}

/**
 * Replace LaTeX backslash commands within a string with Unicode characters.
 */
function replaceLatexCommands(input: string): string {
  let result = input
  // Replace \command (longest names first to avoid partial matches)
  const names = Object.keys(LATEX_SYMBOLS).sort((a, b) => b.length - a.length)
  for (const name of names) {
    const re = new RegExp(`\\\\${name}\\b`, "g")
    result = result.replace(re, LATEX_SYMBOLS[name])
  }
  // Remove any leftover LaTeX spacing/formatting helpers
  result = result.replace(/\\,/g, " ").replace(/\\;/g, " ").replace(/\\!/g, "").replace(/\\ /g, " ")
  // Strip a trailing/leading backslash that has no known command
  return result
}

/**
 * Convert inline ($...$) and display ($$...$$) LaTeX math expressions found in
 * text content into readable Unicode. Falls back to stripping the delimiters
 * so users never see raw "$\ge$" markup in the rendered article.
 */
export function renderInlineMath(text: string): string {
  if (!text || text.indexOf("$") === -1) return text

  // Display math: $$ ... $$
  let result = text.replace(/\$\$([^$]+)\$\$/g, (_m, expr) => replaceLatexCommands(expr).trim())
  // Inline math: $ ... $
  result = result.replace(/\$([^$]+)\$/g, (_m, expr) => replaceLatexCommands(expr).trim())

  return result
}

/**
 * Convert block editor blocks to HTML string for display
 */
export function blocksToHTML(blocks: Block[]): string {
  if (!blocks || blocks.length === 0) {
    return ""
  }

  return blocks
    .map((block) => {
      const { type, data } = block

      const alignmentClass = {
        left: "text-left",
        center: "text-center",
        right: "text-right",
        justify: "text-justify",
      }[data.align || "left"]

      switch (type) {
        case "heading": {
          const level = data.level || 2
          const sizeClass =
            level === 1
              ? "text-4xl md:text-5xl"
              : level === 2
                ? "text-3xl md:text-4xl"
                : level === 3
                  ? "text-2xl md:text-3xl"
                  : level === 4
                    ? "text-xl md:text-2xl"
                    : level === 5
                      ? "text-lg md:text-xl"
                      : "text-base md:text-lg"

          return `<h${level} class="${sizeClass} font-bold text-primary mb-4 mt-8 first:mt-0 ${alignmentClass}">${renderInlineMath(data.text || "")}</h${level}>`
        }

        case "paragraph": {
          return `<p class="text-base leading-relaxed mb-4 ${alignmentClass}">${renderInlineMath(data.text || "")}</p>`
        }

        case "image": {
          const imageAlign = {
            left: "justify-start",
            center: "justify-center",
            right: "justify-end",
          }[data.align || "center"]

          const widthClass =
            data.width === "100%" ? "w-full" : data.width === "80%" ? "w-4/5 mx-auto" : "w-3/5 mx-auto"

          const caption = data.caption ? `<figcaption class="text-center text-sm text-gray-600 italic mt-3">${data.caption}</figcaption>` : ""

          return `<figure class="${widthClass} my-8"><img src="${data.url || ""}" alt="${data.caption || ""}" class="w-full rounded-lg shadow-md" />${caption}</figure>`
        }

        case "quote": {
          const author = data.author
            ? `<footer class="mt-2 text-sm font-semibold text-gray-700">— ${data.author}</footer>`
            : ""

          return `<blockquote class="border-l-4 border-primary pl-4 py-2 my-6 italic ${alignmentClass}"><p class="text-lg text-gray-600">${renderInlineMath(data.text || "")}</p>${author}</blockquote>`
        }

        case "list": {
          const items = (data.items || [])
            .map((item: string) => `<li class="mb-2">${renderInlineMath(item)}</li>`)
            .join("")
          
          const listTag = data.style === "ordered" ? "ol" : "ul"
          const listClass = data.style === "ordered" 
            ? "list-decimal list-inside my-4 space-y-2" 
            : "list-disc list-inside my-4 space-y-2"
          
          return `<${listTag} class="${listClass} ${alignmentClass}">${items}</${listTag}>`
        }

        case "table": {
          if (!data.content || !Array.isArray(data.content)) {
            return ""
          }

          const rows = data.content
            .map((row: string[], rowIndex: number) => {
              const cells = row
                .map((cell: string, colIndex: number) => {
                  const tag = rowIndex === 0 ? "th" : "td"
                  const className = rowIndex === 0 ? "border p-3 bg-gray-100 font-semibold" : "border p-3"
                  return `<${tag} class="${className}">${renderInlineMath(cell)}</${tag}>`
                })
                .join("")
              return `<tr>${cells}</tr>`
            })
            .join("")

          return `<div class="my-6 overflow-x-auto"><table class="border-collapse w-full border"><tbody>${rows}</tbody></table></div>`
        }

        default:
          return ""
      }
    })
    .join("\n")
}

/**
 * Parse HTML content and convert to blocks
 * Automatically detects H1-H6 headings and converts them to heading blocks
 */
export function htmlToBlocks(html: string): Block[] {
  const blocks: Block[] = []
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, "text/html")

  let blockCounter = 0

  // Process all child nodes
  const processNode = (node: Node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement
      const tagName = element.tagName.toLowerCase()

      // Check for headings H1-H6
      const headingMatch = tagName.match(/^h([1-6])$/)
      if (headingMatch) {
        const level = Number.parseInt(headingMatch[1])
        blocks.push({
          id: `block_${blockCounter++}_${Math.random().toString(36).substr(2, 9)}`,
          type: "heading",
          data: {
            level,
            text: element.innerHTML,
            align: "left",
          },
        })
        return
      }

      // Check for paragraphs
      if (tagName === "p") {
        const text = element.innerHTML.trim()
        if (text) {
          blocks.push({
            id: `block_${blockCounter++}_${Math.random().toString(36).substr(2, 9)}`,
            type: "paragraph",
            data: {
              text,
              align: "justify",
            },
          })
        }
        return
      }

      // Check for blockquote
      if (tagName === "blockquote") {
        blocks.push({
          id: `block_${blockCounter++}_${Math.random().toString(36).substr(2, 9)}`,
          type: "quote",
          data: {
            text: element.innerHTML,
            author: "",
            align: "left",
          },
        })
        return
      }

      // Check for lists (ul/ol)
      if (tagName === "ul" || tagName === "ol") {
        const items: string[] = []
        const lis = element.querySelectorAll("li")
        lis.forEach((li) => {
          const text = li.innerHTML.trim()
          if (text) {
            items.push(text)
          }
        })

        if (items.length > 0) {
          blocks.push({
            id: `block_${blockCounter++}_${Math.random().toString(36).substr(2, 9)}`,
            type: "list",
            data: {
              style: tagName === "ol" ? "ordered" : "unordered",
              items,
              align: "left",
            },
          })
        }
        return
      }

      // Check for images
      if (tagName === "img") {
        blocks.push({
          id: `block_${blockCounter++}_${Math.random().toString(36).substr(2, 9)}`,
          type: "image",
          data: {
            url: element.getAttribute("src") || "",
            caption: element.getAttribute("alt") || "",
            align: "center",
            width: "100%",
          },
        })
        return
      }

      // Check for tables
      if (tagName === "table") {
        const rows: string[][] = []
        const trs = element.querySelectorAll("tr")
        trs.forEach((tr) => {
          const cells: string[] = []
          const tds = tr.querySelectorAll("th, td")
          tds.forEach((td) => {
            cells.push(td.innerHTML)
          })
          if (cells.length > 0) {
            rows.push(cells)
          }
        })

        if (rows.length > 0) {
          blocks.push({
            id: `block_${blockCounter++}_${Math.random().toString(36).substr(2, 9)}`,
            type: "table",
            data: {
              rows: rows.length,
              cols: rows[0]?.length || 0,
              content: rows,
              align: "left",
            },
          })
        }
        return
      }

      // Process child nodes recursively
      node.childNodes.forEach(processNode)
    } else if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim()
      if (text) {
        // Create paragraph for standalone text
        blocks.push({
          id: `block_${blockCounter++}_${Math.random().toString(36).substr(2, 9)}`,
          type: "paragraph",
          data: {
            text,
            align: "justify",
          },
        })
      }
    }
  }

  // Start processing from body
  doc.body.childNodes.forEach(processNode)

  // If no blocks were created, fallback to plain text paragraphs
  if (blocks.length === 0) {
    const text = html.trim()
    if (text) {
      const lines = text.split(/\n+/)
      lines.forEach((line) => {
        const trimmed = line.trim()
        if (trimmed) {
          blocks.push({
            id: `block_${blockCounter++}_${Math.random().toString(36).substr(2, 9)}`,
            type: "paragraph",
            data: {
              text: trimmed,
              align: "justify",
            },
          })
        }
      })
    }
  }

  return blocks
}
