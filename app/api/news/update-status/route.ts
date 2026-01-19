import { updateArticleStatus } from "@/lib/news-crawler-db"

export async function POST(req: Request) {
  try {
    const { articleId, status } = await req.json()

    if (!articleId || !status) {
      return Response.json(
        {
          success: false,
          error: "Missing articleId or status",
        },
        { status: 400 },
      )
    }

    if (!["approved", "rejected", "published"].includes(status)) {
      return Response.json(
        {
          success: false,
          error: "Invalid status. Must be approved, rejected, or published",
        },
        { status: 400 },
      )
    }

    await updateArticleStatus(articleId, status)

    return Response.json({
      success: true,
      message: `Article ${status} successfully`,
    })
  } catch (error: any) {
    console.error("[v0] Error updating article status:", error)
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
