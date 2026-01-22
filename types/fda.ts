// FDA API Types & Schemas

export type FDACategory = "food" | "drug" | "cosmetic" | "device"

export type FDAEndpoint = "enforcement" | "event" | "shortages" | "label" | "ndc"

// Normalized FDA Data Structure
export interface FDAItem {
  id: string
  title: string
  category: FDACategory
  criticalInfo: string
  date: string
  status: string
  classification?: string
  distributionPattern?: string
  recallNumber?: string
  productDescription?: string
  reasonForRecall?: string
  manufacturer?: string
  aiSummary?: string // Vietnamese summary from Groq
  rawData?: any // Original FDA response
}

// FDA API Response Types
export interface FDAEnforcementResult {
  recalling_firm?: string
  product_description?: string
  reason_for_recall?: string
  classification?: string
  distribution_pattern?: string
  recall_number?: string
  report_date?: string
  status?: string
}

export interface FDAEventResult {
  product_name?: string
  manufacturer_name?: string
  date_received?: string
  adverse_event_flag?: string
  outcomes?: string[]
  product_type?: string
}

export interface FDAShortageResult {
  generic_name?: string
  brand_name?: string
  manufacturer?: string
  current_status?: string
  shortage_reason?: string
  estimated_resolution_date?: string
}

export interface FDAApiResponse {
  meta: {
    disclaimer: string
    terms: string
    license: string
    last_updated: string
    results: {
      skip: number
      limit: number
      total: number
    }
  }
  results: any[]
}

// Filter Options
export interface FDAFilters {
  category: FDACategory
  endpoint: FDAEndpoint
  dateFrom?: string
  dateTo?: string
  classification?: string
  status?: string
  searchTerm?: string
}

// Lead Magnet Subscription
export interface FDASubscription {
  email: string
  categories: FDACategory[]
  frequency: "daily" | "weekly" | "immediate"
  createdAt: string
}
