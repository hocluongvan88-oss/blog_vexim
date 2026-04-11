#!/bin/bash

# Federal Register Crawler - Setup Script
# This script helps setup the news crawler system

echo "================================"
echo "Federal Register Crawler Setup"
echo "================================"
echo ""

# Check environment variables
echo "📋 Checking environment variables..."

if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "❌ NEXT_PUBLIC_SUPABASE_URL not set"
    exit 1
fi

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ SUPABASE_SERVICE_ROLE_KEY not set"
    exit 1
fi

if [ -z "$CRON_SECRET" ]; then
    echo "⚠️  CRON_SECRET not set - cron job will be blocked"
    echo "   Set it in your environment for production"
fi

echo "✅ Environment variables OK"
echo ""

# Database setup
echo "🗄️  Setting up database..."
echo ""
echo "Option 1: Using Supabase Dashboard"
echo "  1. Go to https://app.supabase.com"
echo "  2. Open your project"
echo "  3. Go to SQL Editor"
echo "  4. Create new query and paste content from:"
echo "     scripts/033_create_news_articles.sql"
echo "  5. Run the query"
echo ""

echo "Option 2: Using Local npm run"
echo "  Run: npm run ts-node scripts/setup-news-db.ts"
echo ""

echo "================================"
echo "✅ Setup Complete!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Run database migration (see options above)"
echo "2. Start your dev server: npm run dev"
echo "3. Go to: http://localhost:3000/admin/news-crawler"
echo "4. Click 'Federal Register (7 ngày)' to test"
echo "5. Monitor the results"
echo ""
echo "📚 Documentation:"
echo "   - FEDERAL_REGISTER_CRAWLER_GUIDE.md - Full guide"
echo "   - FEDERAL_REGISTER_SETUP_SUMMARY.md - Quick overview"
echo ""
echo "For production deployment:"
echo "1. Set CRON_SECRET in Vercel environment"
echo "2. Cron will run automatically at 6:00 AM UTC daily"
echo "3. Monitor via: https://vercel.com/dashboard"
