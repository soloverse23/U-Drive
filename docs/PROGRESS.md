# Progress

Current phase: **Phase 0 — Foundation** (plan approved 2026-10-23)

## Done

- **0.1 Repo bootstrap.** git, pnpm + Turborepo, strict TS, ESLint, Prettier, Vitest. Empty workspaces `apps/web` and `packages/{core,db,i18n,ui-tokens,api-contract}`. `ConfigValue` shape and brand config in `packages/core`. CLAUDE.md, DECISIONS.md, PROGRESS.md.

- **0.2 CI + deploys (code side).** GitHub Actions CI (format, lint, typecheck, test, build) on PRs and on pushes to `main`/`staging`. Minimal Next.js 16 app in `apps/web` (brand name only), so Vercel has something to deploy. `.env.example`. Repo pushed to GitHub with `main` and `staging` branches.

- **0.3 Design tokens.** `packages/ui-tokens`: palette, status colors, semantic roles (light + `.dark-section`), type scale, spacing, control heights, radius, layout, breakpoints, overlay shadow, motion. A generated Tailwind v4 theme (`theme.css`) resets every Tailwind default, so off-system values don't exist. 41 tests: WCAG AA for every allowed pair in both modes, and a freshness check on `theme.css`. The web app uses the tokens.

- **0.4 i18n.** next-intl 4 with `/ro` (default) and `/en`, always prefixed. `/` redirects by browser language. Next 16 `proxy.ts`. Messages live in `packages/i18n/messages/{ro,en}/<feature>.json` and are type-checked keys. A locale switcher keeps the current path. There is a localized 404. `packages/core` has formatting helpers: `formatMoney` (RON always shown as "lei", EUR), `formatDate` (dd.mm.yyyy in ro, Bucharest time) and `ronToEur` (flags estimates). Tests: ro/en key parity, no cedilla ş/ţ, no banned phrases (§3.8). The lint rule `react/jsx-no-literals` blocks hard-coded JSX text.

## In progress

- **0.2 Vercel linking (founder).** Import the GitHub repo in Vercel with Root Directory `apps/web`. Production branch: `main`. `staging` gets a stable preview URL. Every PR gets a preview.

## Next

- 0.5 Font comparison page (founder picks the font)
- 0.6–0.7 Components and the `/design` route
- 0.8 Wordmark + icons (founder picks one)
- 0.9 Schema + RLS · 0.10 API skeleton · 0.11 Auth · 0.12 Onboarding + role areas
- 0.13 Consent, monitoring, legal placeholders · 0.14 E2E + acceptance

## Open questions

- **Romanian native review:** every ro string is unreviewed until the founder (or a native reviewer) confirms it. Before launch we need a review tracker (Phase 1).
- **BNR EUR/RON rate:** `ronToEur` exists. The config value itself is added in Phase 1 with `verified: false` until the founder confirms the source and date.

- Trademark check for "U-Drive" (OSIM / EUIPO), done by the founder.
- SMS provider for phone OTP (cost per SMS). Until then, Supabase test numbers only.
- Payment provider and e-signature provider: decide before Phase 3.
