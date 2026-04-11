import { createClient } from "@supabase/supabase-js"

// Initialize Supabase admin client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupNewsTables() {
  try {
    console.log("[Setup] Starting database setup for news crawler...")

    // Create news_articles table
    const { error: createNewsError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS news_articles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          source TEXT NOT NULL,
          title TEXT NOT NULL,
          url TEXT NOT NULL UNIQUE,
          published_date DATE,
          content TEXT,
          summary TEXT,
          category TEXT,
          relevance_score INTEGER DEFAULT 0,
          filter_layer TEXT,
          keywords TEXT[],
          status TEXT DEFAULT 'pending',
          raw_html TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `,
    })

    if (createNewsError && !createNewsError.message.includes("already exists")) {
      throw createNewsError
    }

    console.log("[Setup] ✓ news_articles table created")

    // Create crawl_logs table
    const { error: createLogsError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS crawl_logs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          source TEXT NOT NULL,
          status TEXT DEFAULT 'running',
          articles_found INTEGER DEFAULT 0,
          articles_filtered INTEGER DEFAULT 0,
          error_message TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          completed_at TIMESTAMPTZ
        );
      `,
    })

    if (createLogsError && !createLogsError.message.includes("already exists")) {
      throw createLogsError
    }

    console.log("[Setup] ✓ crawl_logs table created")

    // Create indexes
    console.log("[Setup] Creating indexes...")
    const indexQueries = [
      "CREATE INDEX IF NOT EXISTS idx_news_articles_source ON news_articles(source)",
      "CREATE INDEX IF NOT EXISTS idx_news_articles_status ON news_articles(status)",
      "CREATE INDEX IF NOT EXISTS idx_news_articles_published_date ON news_articles(published_date DESC)",
      "CREATE INDEX IF NOT EXISTS idx_news_articles_relevance ON news_articles(relevance_score DESC)",
      "CREATE INDEX IF NOT EXISTS idx_crawl_logs_source ON crawl_logs(source)",
      "CREATE INDEX IF NOT EXISTS idx_crawl_logs_created ON crawl_logs(created_at DESC)",
    ]

    for (const query of indexQueries) {
      await supabase.rpc("exec_sql", { sql: query })
    }

    console.log("[Setup] ✓ Indexes created")
    console.log("[Setup] Database setup completed successfully!")
  } catch (error: any) {
    console.error("[Setup] Error during setup:", error)
    process.exit(1)
  }
}

setupNewsTables()
