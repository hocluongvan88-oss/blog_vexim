import type { MetadataRoute } from "next"
import { createStaticClient } from "@/lib/supabase/server"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://vexim.vn"
  const supabase = createStaticClient()

  let blogPages: MetadataRoute.Sitemap = []

  if (supabase) {
    try {
      const { data: posts } = await supabase
        .from("posts")
        .select("slug, published_at, updated_at")
        .eq("status", "published")
        .order("published_at", { ascending: false })

      blogPages =
        posts?.map((post) => ({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: new Date(post.updated_at || post.published_at),
          changeFrequency: "monthly" as const,
          priority: 0.7,
        })) || []
    } catch (error) {
      console.error("[v0] Error fetching posts for sitemap:", error)
      // Continue with just static pages
    }
  }

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/fda`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/gacc`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/mfds`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/us-agent`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/ai-traceability`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/export-delegation`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ]

  return [...staticPages, ...blogPages]
}
