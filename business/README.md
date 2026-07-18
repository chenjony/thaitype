# ThaiType for Business

Standalone frontend for `b.thaitypes.com`.

```bash
npm install
npm run dev
npm run build
```

## Pages

- `/` — multilingual B2B product site and trial request.
- `/portal.html` — HR recruitment assessment console.
- `/assessment.html?token=...` — candidate assessment entry.

The first sellable recruitment-assessment MVP includes organization roles, job templates, question bank, recruitment projects, candidate invitations, Thai typing assessment, integrity events, scoring, result center, CSV export and printable reports.

The marketing site, HR console, candidate assessment flow and printable report share the same five-language preference: Simplified Chinese, Traditional Chinese, English, Thai and Russian. Browser language is used on first visit, with English as the fallback.

Stages 13–17 add configurable proctoring and human review, candidate privacy requests and fairness controls, simulated credit packs and billing ledger, notification templates and delivery logs, plus API key, webhook, SSO and ATS integration settings. Camera, payment, email and third-party integrations are intentionally represented by local permission checks or simulations until production providers and credentials are configured.

Stages 18–20 add a release validation matrix, scoring calibration cohorts, four-segment pilot management, structured feedback, production launch gates, operations metrics and a continuous-improvement queue. The console intentionally distinguishes local evidence from real-user, real-enterprise and production-environment acceptance.

The MVP deliberately stores data in browser `localStorage` so the full workflow can be reviewed without external credentials. Before production launch, replace the storage module with authenticated server APIs and configure the production database, email/OTP delivery, object storage, backups and privacy retention jobs.

The trial request form opens a prefilled email to `business@thaitypes.com`; replace this with a CRM/API endpoint when lead volume requires centralized automation.
