import type {
  FDAApiResponse,
  FDACategory,
  FDAEndpoint,
  FDAEnforcementResult,
  FDAEventResult,
  FDAFilters,
  FDAItem,
  FDAShortageResult,
} from "@/types/fda"

const FDA_BASE_URL = "https://api.fda.gov"

export class FDAApiService {
  // Build query string cho FDA API
  private buildSearchQuery(filters: Partial<FDAFilters>): string {
    const queries: string[] = []

    // Date range filter
    if (filters.dateFrom && filters.dateTo) {
      queries.push(`report_date:[${filters.dateFrom} TO ${filters.dateTo}]`)
    }

    // Classification filter (cho enforcement)
    if (filters.classification) {
      queries.push(`classification:"${filters.classification}"`)
    }

    // Status filter
    if (filters.status) {
      queries.push(`status:"${filters.status}"`)
    }

    // Search term (full text search)
    if (filters.searchTerm) {
      queries.push(`${filters.searchTerm}`)
    }

    return queries.length > 0 ? queries.join("+AND+") : ""
  }

  // Tạo URL endpoint đầy đủ
  private buildEndpointUrl(category: FDACategory, endpoint: FDAEndpoint, filters: Partial<FDAFilters>, limit = 10) {
    let url = `${FDA_BASE_URL}/${category}/${endpoint}.json`

    const params = new URLSearchParams()
    params.append("limit", limit.toString())
    params.append("sort", "report_date:desc")

    const searchQuery = this.buildSearchQuery(filters)
    if (searchQuery) {
      params.append("search", searchQuery)
    }

    // Thêm filter mặc định cho từng loại
    if (endpoint === "enforcement") {
      // Ưu tiên các recall nationwide
      if (!searchQuery) {
        params.set("search", 'distribution_pattern:"nationwide"')
      }
    }

    if (endpoint === "shortages") {
      // Chỉ lấy các shortage đang active
      if (!searchQuery) {
        params.set("search", 'current_status:"Currently in Shortage"')
      }
    }

    return `${url}?${params.toString()}`
  }



  // Fetch data từ FDA API with retry mechanism
  async fetchFDAData(category: FDACategory, endpoint: FDAEndpoint, filters: Partial<FDAFilters> = {}, limit = 10, retryCount = 0): Promise<FDAApiResponse | null> {
    const MAX_RETRIES = 3
    const RETRY_DELAY_MS = 1000

    try {
      const url = this.buildEndpointUrl(category, endpoint, filters, limit)

      console.log(`[v0] Fetching FDA data from: ${url} (attempt ${retryCount + 1}/${MAX_RETRIES + 1})`)

      const response = await fetch(url, {
        headers: {
          "User-Agent": "VeximGlobal/1.0",
        },
        cache: "default",
      })

      if (!response.ok) {
        if (response.status === 429 && retryCount < MAX_RETRIES) {
          // Rate limited - retry with exponential backoff
          const delay = RETRY_DELAY_MS * Math.pow(2, retryCount)
          console.log(`[v0] FDA API rate limited (429). Retrying in ${delay}ms...`)
          await new Promise(resolve => setTimeout(resolve, delay))
          return this.fetchFDAData(category, endpoint, filters, limit, retryCount + 1)
        }
        
        console.error(`[v0] FDA API error: ${response.status} ${response.statusText}`)
        return null
      }

      const data: FDAApiResponse = await response.json()

      console.log(`[v0] FDA API returned ${data.results.length} results (Total: ${data.meta.results.total})`)

      return data
    } catch (error) {
      if (retryCount < MAX_RETRIES) {
        const delay = RETRY_DELAY_MS * Math.pow(2, retryCount)
        console.log(`[v0] Error fetching FDA data. Retrying in ${delay}ms... (${error})`)
        await new Promise(resolve => setTimeout(resolve, delay))
        return this.fetchFDAData(category, endpoint, filters, limit, retryCount + 1)
      }
      
      console.error("[v0] Error fetching FDA data after all retries:", error)
      return null
    }
  }

  // Normalize dữ liệu từ các endpoint khác nhau
  normalizeEnforcementData(result: FDAEnforcementResult, category: FDACategory): FDAItem {
    return {
      id: result.recall_number || `enforcement-${Date.now()}`,
      title: result.product_description?.substring(0, 100) || "Unknown Product",
      category,
      criticalInfo: result.reason_for_recall || "No reason provided",
      date: result.report_date || new Date().toISOString().split("T")[0],
      status: result.status || "Unknown",
      classification: result.classification,
      distributionPattern: result.distribution_pattern,
      recallNumber: result.recall_number,
      productDescription: result.product_description,
      reasonForRecall: result.reason_for_recall,
      manufacturer: result.recalling_firm,
      rawData: result,
    }
  }

  normalizeEventData(result: FDAEventResult, category: FDACategory): FDAItem {
    return {
      id: `event-${Date.now()}-${Math.random()}`,
      title: result.product_name || "Unknown Product",
      category,
      criticalInfo: result.outcomes?.join(", ") || result.adverse_event_flag || "Adverse event reported",
      date: result.date_received || new Date().toISOString().split("T")[0],
      status: result.adverse_event_flag || "Reported",
      manufacturer: result.manufacturer_name,
      productDescription: `${result.product_type || ""} - ${result.product_name || ""}`,
      rawData: result,
    }
  }

  normalizeShortageData(result: FDAShortageResult, category: FDACategory): FDAItem {
    return {
      id: `shortage-${Date.now()}-${Math.random()}`,
      title: result.brand_name || result.generic_name || "Unknown Drug",
      category,
      criticalInfo: result.shortage_reason || "Shortage reported",
      date: result.estimated_resolution_date || new Date().toISOString().split("T")[0],
      status: result.current_status || "In Shortage",
      manufacturer: result.manufacturer,
      productDescription: `${result.generic_name || ""} (${result.brand_name || ""})`,
      rawData: result,
    }
  }

  // Main normalization method
  normalizeData(results: any[], category: FDACategory, endpoint: FDAEndpoint): FDAItem[] {
    return results.map((result) => {
      switch (endpoint) {
        case "enforcement":
          return this.normalizeEnforcementData(result, category)
        case "event":
          return this.normalizeEventData(result, category)
        case "shortages":
          return this.normalizeShortageData(result, category)
        default:
          // Fallback generic normalization
          return {
            id: `${endpoint}-${Date.now()}-${Math.random()}`,
            title: result.product_name || result.product_description || "Unknown",
            category,
            criticalInfo: JSON.stringify(result).substring(0, 200),
            date: result.report_date || result.date_received || new Date().toISOString().split("T")[0],
            status: result.status || "Unknown",
            rawData: result,
          }
      }
    })
  }

  // Tổng hợp: Fetch → Normalize (caching handled in API route layer)
  async getFDAItems(
    category: FDACategory,
    endpoint: FDAEndpoint,
    filters: Partial<FDAFilters> = {},
    limit = 10,
  ): Promise<{ items: FDAItem[]; total: number } | null> {
    const response = await this.fetchFDAData(category, endpoint, filters, limit)

    if (!response) {
      return null
    }

    const items = this.normalizeData(response.results, category, endpoint)
    const total = response.meta.results.total

    return {
      items,
      total,
    }
  }
}

// Singleton instance
export const fdaApi = new FDAApiService()
