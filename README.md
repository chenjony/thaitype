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
2. **Authentication → Providers**: enable **Google** and **Facebook**. Add your OAuth client IDs/secrets. Set redirect URL to your app origin (e.g. `http://localhost:5173`).
3. **SQL Editor**: paste and run [`supabase/schema.sql`](supabase/schema.sql).
4. Copy **Project URL** and **anon public** key from **Project Settings → API**.
5. Create `.env` from the example:

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

6. Restart the dev server after changing env vars.

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
