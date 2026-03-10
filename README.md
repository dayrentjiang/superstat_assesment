# Superstat

Basketball video analysis tool. Upload game footage, tag events at timestamps, track player stats, and generate AI match summaries.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage (videos, avatars)
- **AI:** OpenAI GPT-4o (match summaries)
- **Styling:** Tailwind CSS 4
- **Deployment:** Vercel (Sydney region)

## Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- An [OpenAI](https://platform.openai.com) API key

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
OPENAI_API_KEY=your-openai-api-key
```

### 3. Set up the database

Go to your Supabase dashboard > **SQL Editor** and run the contents of:

```
supabase/complete_schema.sql
```

This creates all tables (videos, players, events, summaries, player_stats) with RLS policies and indexes.

### 4. Create storage buckets

In your Supabase dashboard > **Storage**, create two public buckets:

- `videos`
- `avatars`

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  app/                  # Next.js routes
    page.tsx            # Home — video library
    upload/             # Video upload page
    players/            # Player roster
    players/[id]/       # Player detail + stats
    videos/[id]/        # Video review + event tagging
  actions/              # Server actions (controllers)
  services/             # Database service layer
  components/
    events/             # Event form, event list, match summary
    players/            # Player manager, player detail, add dialog
    videos/             # Video card, video player, video review
    layout/             # Navbar, sidebar
  hooks/                # Custom hooks (file upload)
  lib/                  # Supabase client, types, constants, OpenAI
supabase/
  migrations/           # Individual migration files (001–006)
  complete_schema.sql   # Full schema for fresh setup
```

## Deployment

Push to a GitHub repo and connect it to [Vercel](https://vercel.com). Add the same environment variables in the Vercel project settings. The `vercel.json` is configured to deploy to the Sydney (`syd1`) region.
