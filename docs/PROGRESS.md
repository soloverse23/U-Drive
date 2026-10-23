# Progress

Current phase: **Phase 0 — Foundation** (plan approved 2026-10-23)

## Done

- **0.1 Repo bootstrap.** git, pnpm + Turborepo, strict TS, ESLint, Prettier, Vitest. Empty workspaces `apps/web` and `packages/{core,db,i18n,ui-tokens,api-contract}`. `ConfigValue` shape and brand config in `packages/core`. CLAUDE.md, DECISIONS.md, PROGRESS.md.

- **0.2 CI + deploys (code side).** GitHub Actions CI (format, lint, typecheck, test, build) on PRs and on pushes to `main`/`staging`. Minimal Next.js 16 app in `apps/web` (brand name only), so Vercel has something to deploy. `.env.example`. Repo pushed to GitHub with `main` and `staging` branches.

## In progress

- **0.2 Vercel linking (founder).** Import the GitHub repo in Vercel with Root Directory `apps/web`. Production branch: `main`. `staging` gets a stable preview URL. Every PR gets a preview.

## Next

- 0.3 Design tokens + contrast tests
- 0.4 i18n (next-intl, ro/en)
- 0.5 Font comparison page (founder picks the font)
- 0.6–0.7 Components and the `/design` route
- 0.8 Wordmark + icons (founder picks one)
- 0.9 Schema + RLS · 0.10 API skeleton · 0.11 Auth · 0.12 Onboarding + role areas
- 0.13 Consent, monitoring, legal placeholders · 0.14 E2E + acceptance

## Open questions

- Trademark check for "U-Drive" (OSIM / EUIPO), done by the founder.
- SMS provider for phone OTP (cost per SMS). Until then, Supabase test numbers only.
- Payment provider and e-signature provider: decide before Phase 3.
