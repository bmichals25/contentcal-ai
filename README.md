# ContentCal AI

> Turn any business website into a full month of content ideas, drafts, and scripts - powered by AI.

## What It Does

1. **Enter any business URL** - paste a website link
2. **AI analyzes the brand** - extracts business name, industry, audience, tone, products
3. **Generates 30 days of content** - across 6 platforms (Instagram, Twitter/X, LinkedIn, TikTok, Blog, YouTube)
4. **Ready-to-use drafts & scripts** - copy-paste social posts, blog outlines, and video scripts with hashtags

## Features

- Website Scraping - Extracts and analyzes any business website
- AI Business Analysis - Identifies brand, audience, tone, and products
- Monthly Calendar View - Visual grid with content items per day
- Draft Content - Ready-to-post copy for each platform
- Video Scripts - Full HOOK > BODY > CTA scripts for TikTok/YouTube
- Hashtag Sets - Platform-specific hashtags with one-click copy
- Platform Filtering - Filter calendar by Instagram, Twitter, LinkedIn, etc.
- Stats Dashboard - Content metrics at a glance

## Tech Stack

- Frontend: React 19, TypeScript, Tailwind CSS v4, Vite
- Backend: Netlify Serverless Functions
- Database: Supabase (PostgreSQL)
- AI: OpenAI GPT-4o-mini
- Hosting: Netlify

## Setup

### 1. Clone and Install

```bash
git clone https://github.com/bmichals25/contentcal-ai.git
cd contentcal-ai
npm install
```

### 2. Environment Variables

Create a `.env` file:

```env
VITE_SUPABASE_URL=https://cfvtatiddqeeknxdrqzp.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
OPENAI_API_KEY=your-openai-api-key
```

### 3. Deploy to Netlify

1. Go to app.netlify.com
2. Connect the GitHub repository bmichals25/contentcal-ai
3. Set environment variables in Netlify: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, OPENAI_API_KEY
4. Deploy!

### 4. Local Development

```bash
npm run dev
```

## Database Schema

All tables are namespaced with `contentcal_` prefix:
- `contentcal_businesses` - Stores analyzed business data
- `contentcal_calendars` - Stores generated calendar metadata
- `contentcal_content_items` - Individual content pieces with drafts/scripts

## Architecture

```
User enters URL
    -> [Netlify Function: /analyze] -> Fetches HTML -> OpenAI analyzes -> Saves to Supabase
    -> [Background Function: /generate-background] -> Generates 60+ content items week-by-week
    -> [Frontend polls Supabase] -> Calendar fills in real-time
```

## Live URL

https://contentcal-ai.netlify.app
