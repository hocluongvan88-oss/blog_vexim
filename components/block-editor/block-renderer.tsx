import type { Block } from "./types"
import { JSX } from "react";

interface BlockRendererProps {
  blocks: Block[]
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
  const renderBlock = (block: Block) => {
    const { type, data } = block

    const alignmentClass = {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify max-md:text-left", // Căn đều desktop, trái mobile
    }

    switch (type) {
      case "heading": {
        const HeadingTag = `h${data.level}` as keyof JSX.IntrinsicElements
        const sizeClass = data.level === 2 ? "text-3xl" : "text-2xl"
        return (
          <HeadingTag
            key={block.id}
            className={`${sizeClass} font-bold text-primary mb-4 ${alignmentClass[data.align || "left"]}`}
            dangerouslySetInnerHTML={{ __html: data.text }}
          />
        )
      }

      case "paragraph": {
        return (
          <p
            key={block.id}
            className={`text-base leading-relaxed mb-4 ${alignmentClass[data.align || "justify"]}`}
            dangerouslySetInnerHTML={{ __html: data.text }}
          />
        )
      }

      case "image": {
        const imageAlign = {
          left: "justify-start",
          center: "justify-center",
          right: "justify-end",
        }[data.align || "center"]

        const widthClass = data.width === "100%" ? "w-full" : data.width === "80%" ? "w-4/5" : "w-3/5"

        return (
          <div key={block.id} className={`flex ${imageAlign} my-8`}>
            <figure className={widthClass}>
              <img src={data.url || "/placeholder.svg"} alt={data.caption || ""} className="w-full rounded-lg shadow-md" />
              {data.caption && (
                <figcaption className="text-center text-sm text-muted-foreground italic mt-3">
                  {data.caption}
                </figcaption>
              )}
            </figure>
          </div>
        )
      }

      case "quote": {
        return (
          <blockquote
            key={block.id}
            className={`border-l-4 border-primary pl-4 py-2 my-6 italic ${alignmentClass[data.align || "left"]}`}
          >
            <p className="text-lg text-muted-foreground" dangerouslySetInnerHTML={{ __html: data.text }} />
            {data.author && <footer className="mt-2 text-sm font-semibold">— {data.author}</footer>}
          </blockquote>
        )
      }

      case "list": {
        const ListTag = data.style === "ordered" ? "ol" : "ul"
        const listClass = data.style === "ordered" ? "list-decimal" : "list-disc"
        
        return (
          <ListTag
            key={block.id}
            className={`${listClass} pl-6 space-y-2 my-4 ${alignmentClass[data.align || "left"]}`}
          >
            {(data.items || []).map((item: string, index: number) => (
              <li
                key={index}
                className="leading-relaxed"
                dangerouslySetInnerHTML={{ __html: item }}
              />
            ))}
          </ListTag>
        )
      }

      case "table": {
        return (
          <div key={block.id} className="my-6 overflow-x-auto">
            <table className="border-collapse w-full border">
              <tbody>
                {data.content.map((row: string[], rowIndex: number) => (
                  <tr key={rowIndex}>
                    {row.map((cell: string, colIndex: number) => {
                      const CellTag = rowIndex === 0 ? "th" : "td"
                      return (
                        <CellTag
                          key={colIndex}
                          className={`border p-3 ${rowIndex === 0 ? "bg-secondary font-semibold" : ""}`}
                          dangerouslySetInnerHTML={{ __html: cell }}
                        />
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }

      default:
        return null
    }
  }

  return <div className="prose prose-lg max-w-none">{blocks.map(renderBlock)}</div>
}
