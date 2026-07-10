# ThaiType

Clean, gamified Thai typing practice — Kedmanee layout, timed tests, social auth, and a global leaderboard powered by **Supabase**.

## Features

- **Timed tests**: 30s / 1min / 3min / 5min (lazy-start on first keystroke)
- **Visual Kedmanee keyboard** with Shift-state character swap + IME mismatch warning
- **Thai TTS** pronunciation via `speechSynthesis` (`th-TH`)
- **Modes**: Letters · Words · Custom
- **Guest mode** or **Google / Facebook** sign-in
- **Personal Best** & **Recent Test** widgets (signed-in)
- **Global Ranking** (Top 50) + **“Beat X% of users”** PK percentile
- Celebration modal with count-up, confetti, and certificate PNG

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. **Authentication → Providers**: enable **Google** and **Facebook**. Add your OAuth client IDs/secrets.
3. **Authentication → URL Configuration**:
   - **Site URL**: `https://thaitypes.com`
   - **Redirect URLs**: `https://thaitypes.com/**` and `http://localhost:5173/**` (for local dev)
4. **SQL Editor**: paste and run [`supabase/schema.sql`](supabase/schema.sql).
5. Copy **Project URL** and **anon public** key from **Project Settings → API**.
6. Create env files (this app uses **Vite** `VITE_*` vars, not Next.js `NEXT_PUBLIC_*`):

```bash
cp .env.example .env
cp .env.example .env.production
```

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
VITE_SITE_URL=https://thaitypes.com
```

7. Restart the dev server after changing env vars. Production builds (`npm run build`) read `.env.production`.

Without Supabase credentials the app still runs fully in **guest mode** (practice only; scores are not saved).

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

Set your OS keyboard to **Thai (Kedmanee)** before practicing.
