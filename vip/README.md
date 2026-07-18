# ThaiType VIP

Standalone frontend for `vip.thaitypes.com`.

The current local-first member experience includes the dashboard, adjustable random common-word practice, unlimited custom practice, character-level typing feedback, optional Kedmanee key hints, optional Thai voice feedback, keyboard themes, complete local history, CSV export, progress charts, daily goals, mistake insights, and a certificate preview. Practice data is stored in the browser until the production account backend is connected.

The adaptive VIP coach builds a per-character skill model from accuracy and response time, diagnoses Shift/tone/vowel/adjacent-key/substitution mistakes, explains the result after every session, and generates a one-click drill from Thai words containing the user's weakest characters.

Practice input also verifies Thai Kedmanee output: likely English/QWERTY keystrokes and pasted non-Thai text are blocked before they affect the session, with a localized prompt to switch the system input method.

```bash
npm install
npm run dev
npm run build
```

Before launch: connect authentication, server-verified VIP entitlements, cloud history sync, checkout, and verified certificate generation.
