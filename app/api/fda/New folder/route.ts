import { NextResponse } from "next/server"
import { fdaApi } from "@/lib/fda-api"
import { createServerClient } from "@/lib/supabase-server"
import type { FDACategory, FDAEndpoint, FDAFilters } from "@/types/fda"

const CACHE_DURATION_HOURS = 4

// GET /api/fda/items?category=food&endpoint=enforcement&limit=10
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") as FDACategory
    const endpoint = searchParams.get("endpoint") as FDAEndpoint
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const searchTerm = searchParams.get("searchTerm") || undefined

    if (!category || !endpoint) {
      return NextResponse.json(
        { error: "Missing required parameters: category, endpoint" },
        { status: 400 }
      )
    }

    const filters: Partial<FDAFilters> = {}
    if (searchTerm) {
      filters.searchTerm = searchTerm
    }

    // Generate cache key
    const cacheKey = getCacheKey(category, endpoint, filters)

    // Check cache first
    const cached = await getCachedData(cacheKey)
    if (cached) {
      console.log(`[v0] API Cache HIT for: ${cacheKey}`)
      return NextResponse.json(cached)
    }

    console.log(`[v0] API Cache MISS for: ${cacheKey}`)

    // Fetch from FDA API
    const result = await fdaApi.getFDAItems(category, endpoint, filters, limit)

    if (!result) {
      return NextResponse.json(
        { error: "Failed to fetch FDA data" },
        { status: 500 }
      )
    }

    // Save to cache
    await saveToCache(cacheKey, category, endpoint, result.items, result.total)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Error in FDA items API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Helper functions for caching
function getCacheKey(category: FDACategory, endpoint: FDAEndpoint, filters: Partial<FDAFilters>): string {
  const filterString = JSON.stringify(filters)
  return `${category}-${endpoint}-${Buffer.from(filterString).toString("base64").substring(0, 20)}`
}

async function getCachedData(cacheKey: string): Promise<{ items: any[]; total: number } | null> {
  try {
    const supabase = await createServerClient()
    
    const { data: cached, error } = await supabase
      .from("fda_alerts_cache")
      .select("data, total_count, cached_at")
      .eq("cache_key", cacheKey)
      .gt("expires_at", new Date().toISOString())
      .order("cached_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error || !cached || !cached.data) {
      return null
    }

    return {
      items: cached.data as any[],
      total: cached.total_count || 0,
    }
  } catch (error) {
    console.error("[v0] Error checking cache:", error)
    return null
  }
}

async function saveToCache(
  cacheKey: string,
  category: FDACategory,
  endpoint: FDAEndpoint,
  items: any[],
  total: number
): Promise<void> {
  try {
    const supabase = await createServerClient()
    
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + CACHE_DURATION_HOURS)

    await supabase.from("fda_alerts_cache").upsert(
      {
        cache_key: cacheKey,
        category,
        endpoint,
        data: items,
        total_count: total,
        cached_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
      },
      {
        onConflict: "cache_key",
      }
    )

    console.log(`[v0] Cached ${items.length} items for key: ${cacheKey}`)
  } catch (error) {
    console.error("[v0] Error saving to cache:", error)
  }
}
