# Daily Growth — Next.js + Vercel

This is the recommended version of your previous PHP daily growth app.

It uses:

- Next.js App Router
- TypeScript
- Vercel server-side API Route Handlers
- Mobile-first UI
- Optional PostgreSQL database using `DATABASE_URL`

## Why this is better than PHP for Vercel

Vercel is very optimized for Next.js. In this app, the phone/browser only displays the UI. The process logic runs through server routes:

- `/api/today`
- `/api/task`
- `/api/work-log`
- `/api/progress`

## Features

- Daily checklist:
  - Pray morning
  - 30 mins me time
  - 15 mins book
  - 10 mins recall today
  - Pray night
  - Daily BaZi challenge
- Daily English motivation quote
- BaZi-personality challenge:
  - overthinking → execution
  - comparison → internal standard
  - scattered ideas → one KPI
  - creativity → visible proof
- Work check in / check out
- Area chart:
  - week
  - month
  - YTD
  - year
  - max
- Server-side progress calculation
- Database-ready

## Beginner install

### 1. Install Node.js

Download and install Node.js LTS from the official Node.js website.

After install, open Terminal / CMD and check:

```bash
node -v
npm -v
```

### 2. Open this project folder

```bash
cd daily_growth_nextjs_vercel
```

### 3. Install packages

```bash
npm install
```

### 4. Run locally

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

At first, it runs in demo mode. Your browser stores demo data locally.

## Add database later

For real deployment persistence, use PostgreSQL.

Recommended beginner options:

- Neon Postgres
- Supabase Postgres
- Vercel Marketplace Postgres provider

After you create a database, copy the connection string and create `.env.local`:

```bash
cp .env.example .env.local
```

Then edit `.env.local`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
```

Restart dev server:

```bash
npm run dev
```

The app creates these tables automatically:

```sql
daily_tasks
work_logs
```

## Deploy to Vercel

### Option A: Upload to GitHub, deploy from Vercel dashboard

1. Create GitHub repository.
2. Upload this project.
3. Go to Vercel.
4. Add New Project.
5. Import your GitHub repository.
6. Framework should be detected as Next.js.
7. Add `DATABASE_URL` in Environment Variables if you already have a database.
8. Click Deploy.

### Option B: Deploy with CLI

Install Vercel CLI:

```bash
npm i -g vercel
```

Login:

```bash
vercel login
```

Deploy:

```bash
vercel
```

Production deploy:

```bash
vercel --prod
```

## Important

If you deploy without database, it will be demo mode. Demo mode is okay for testing UI, but real saved data on Vercel needs a database because Vercel serverless functions do not keep local files as permanent storage.

## Main files

```text
app/page.tsx                  Main page
app/components/DailyApp.tsx   Mobile UI
app/components/AreaChart.tsx  SVG area chart
app/api/today/route.ts        Get tasks, quote, challenge
app/api/task/route.ts         Save checklist
app/api/work-log/route.ts     Save check in/out
app/api/progress/route.ts     Calculate chart data
lib/daily-data.ts             Tasks, quote, BaZi challenge
lib/storage.ts                Database operations
lib/db.ts                     Postgres connection
lib/time.ts                   Jakarta date helpers
```
