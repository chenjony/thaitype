# ThaiType

Clean, gamified Thai typing practice — Kedmanee layout, timed tests, social auth, and a global leaderboard powered by **Supabase**.

## Features

- **Timed tests**: 30s / 1min / 3min / 5min (lazy-start on first keystroke)
- **Visual Kedmanee keyboard** with Shift-state character swap + IME mismatch warning
- **Thai TTS** pronunciation via `speechSynthesis` (`th-TH`)
- **Modes**: Letters · Words · Custom
- **Guest mode**, email/username + password, or Google / Facebook / WeChat / LINE sign-in
- **Personal Best** & **Recent Test** widgets (signed-in)
- **Global Ranking** (Top 50) + **“Beat X% of users”** PK percentile
- Celebration modal with count-up, confetti, and certificate PNG

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. **Authentication → Providers**: enable **Google** and **Facebook**. Add WeChat and LINE as custom OAuth/OIDC providers with the identifiers `wechat` and `line`.
3. **Authentication → URL Configuration**:
   - **Site URL**: `https://thaitypes.com`
   - **Redirect URLs**: `https://thaitypes.com/**` and `http://localhost:5173/**` (for local dev)
4. **SQL Editor**: paste and run [`supabase/schema.sql`](supabase/schema.sql). This creates profiles, country-aware rankings, and the public avatar bucket with owner-only writes.
5. Deploy the username login Edge Function: `supabase functions deploy username-login`. Its JWT check is intentionally disabled in `supabase/config.toml` because it creates the session; keep the service-role key only in server-side function secrets and add rate limiting before a high-traffic launch.
6. Configure SMTP/email templates for signup confirmation and password reset.
7. Copy **Project URL** and **anon public** key from **Project Settings → API**.
8. Create env files (this app uses **Vite** `VITE_*` vars, not Next.js `NEXT_PUBLIC_*`):

```bash
cp .env.example .env
cp .env.example .env.production
```

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
VITE_SITE_URL=https://thaitypes.com
```

9. Restart the dev server after changing env vars. Production builds (`npm run build`) read `.env.production`.

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

## Product sites

This repository contains three independently buildable frontends:

- Root: free practice for `thaitypes.com`
- [`vip/`](vip/): personal membership for `vip.thaitypes.com`
- [`business/`](business/): organization product for `b.thaitypes.com`

The VIP and Business apps have separate package manifests, environment files, builds, and deployment targets. They may share the same Supabase identity project later, but must enforce their own server-verified entitlements and organization permissions.
