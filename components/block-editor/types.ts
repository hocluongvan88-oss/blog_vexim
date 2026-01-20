export type BlockType = "heading" | "paragraph" | "image" | "quote" | "table"

export type AlignType = "left" | "center" | "right" | "justify"

export interface Block {
  id: string
  type: BlockType
  data: any
}

export interface HeadingData {
  level: 2 | 3
  text: string
  align: "left" | "center" | "right"
}

export interface ParagraphData {
  text: string
  align: AlignType
}

export interface ImageData {
  url: string
  caption: string
  align: "left" | "center" | "right"
  width: string
}

export interface QuoteData {
  text: string
  author?: string
  align: "left" | "center"
}

export interface TableData {
  rows: number
  cols: number
  content: string[][]
  align: "left" | "center" | "right"
}
