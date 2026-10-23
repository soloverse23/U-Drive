# Progress

Current phase: **Phase 0 — Foundation** (plan approved 2026-10-23)

## Done

- **0.1 Repo bootstrap.** git, pnpm + Turborepo, strict TS, ESLint, Prettier, Vitest. Empty workspaces `apps/web` and `packages/{core,db,i18n,ui-tokens,api-contract}`. `ConfigValue` shape and brand config in `packages/core`. CLAUDE.md, DECISIONS.md, PROGRESS.md.

- **0.2 CI + deploys (code side).** GitHub Actions CI (format, lint, typecheck, test, build) on PRs and on pushes to `main`/`staging`. Minimal Next.js 16 app in `apps/web` (brand name only), so Vercel has something to deploy. `.env.example`. Repo pushed to GitHub with `main` and `staging` branches.

- **0.3 Design tokens.** `packages/ui-tokens`: palette, status colors, semantic roles (light + `.dark-section`), type scale, spacing, control heights, radius, layout, breakpoints, overlay shadow, motion. A generated Tailwind v4 theme (`theme.css`) resets every Tailwind default, so off-system values don't exist. 41 tests: WCAG AA for every allowed pair in both modes, and a freshness check on `theme.css`. The web app uses the tokens.

- **0.4 i18n.** next-intl 4 with `/ro` (default) and `/en`, always prefixed. `/` redirects by browser language. Next 16 `proxy.ts`. Messages live in `packages/i18n/messages/{ro,en}/<feature>.json` and are type-checked keys. A locale switcher keeps the current path. There is a localized 404. `packages/core` has formatting helpers: `formatMoney` (RON always shown as "lei", EUR), `formatDate` (dd.mm.yyyy in ro, Bucharest time) and `ronToEur` (flags estimates). Tests: ro/en key parity, no cedilla ş/ţ, no banned phrases (§3.8). The lint rule `react/jsx-no-literals` blocks hard-coded JSX text.

- **0.5 Font comparison page** at `/{ro,en}/design/fonts`. It shows Manrope, Figtree, Instrument Sans and Inter, each with the same headline, paragraph, weight samples, price table, calculator result and diacritics line. Fonts are self-hosted through `next/font/google` (downloaded at build). All four were checked with fontTools: comma-below ș/ț and ă/î/â are present, and `tnum` is supported. `/design/*` returns 404 in production (`src/lib/env.ts`) and is marked `noindex`.

- **Font chosen: Instrument Sans** (founder, 2026-10-23). Exposed as `--font-brand` on `<html>` in `apps/web/src/app/fonts.ts`. The comparison page stays as the record of the decision, with the chosen font marked.
- **0.6 Components I + `/design`.** Components: `Button` (primary/secondary/tertiary/destructive; compact/default/large; full and mobile-full width; loading), `TextInput`, `Select` (native), `DateInput` (native), `FileInput` (translated text), `Tabs` and `SegmentedControl` (Radix), `StatusBadge`. Every state is shown on `/{ro,en}/design` with tokens (palette, status, roles, type, spacing, radius) and a dark section. `ui-hover`/`ui-active`/`ui-focus`/`ui-focus-visible` variants also match `data-preview` so states can be shown statically. The page was checked with screenshots, and there's no page-level horizontal scroll at 390px.

- **0.7 Components II.** Layout: `TopNav` (desktop nav from xl, full-screen menu below), `AppShell` (desktop sidebar, mobile bottom tab bar with at most 5 tabs), text `Wordmark`. UI: `Card` (bordered/filled, padding none), `DataTable` (right-aligned tabular numbers), `Stepper`, `Timeline`, `EmptyState`, `ToastProvider`/`useToast`, `Modal`, `BottomSheet` (Radix Dialog), `CalculatorShell` (inputs, result, breakdown, assumptions with estimate badges, disclaimer). Public pages now sit in the `(public)` route group with `TopNav`. Demos are on `/design` and `/design/app-shell/*`. Browser-checked: Escape closes the menu, focus moves into the modal, the calculator updates live, the active tab is correct, and nothing overflows at 390/1024/1280/1440.

- **0.8 Wordmark + icons.** Founder picked **C · Lane**: `U▬DRIVE`, Instrument Sans Bold capitals with a slanted bar. It is outlined to SVG paths by `tools/brand/build_wordmark.py`, which reads the name from `brand.ts`, and used by `WordmarkSvg` (currentColor) in the nav and sidebar. The icon is a black tile with a white `U▬`: `app/icon.svg` (favicon), `app/apple-icon.png` (180), `public/icons/icon-192.png` and `icon-512.png` (PWA, maskable-safe), `app/opengraph-image.png` (1200×630 base). `metadataBase` comes from `siteUrl()`. Options page `/design/brand` marks the choice.

- **0.9 Schema + RLS (local).** Supabase CLI in `packages/db`. Migration `20261023000000_initial_schema.sql`:
  - `profiles` (name, locale, onboarded_at; no email/phone/CNP copies)
  - `user_roles` (multi-role; users can self-assign only driver/owner_*)
  - `vehicles` (minimal), `documents` (metadata; status reviewed by admins only; path bound to owner)
  - append-only `audit_log` (role grants/revokes and document reviews are logged by triggers)
  - private `documents` storage bucket (PDF/JPG/PNG, 10 MB, per-user folders)

  30 pgTAP tests (cross-user isolation, privilege escalation, audit immutability, anon access), plus a CI `database` job. Generated types are in `@u-drive/db`.

## In progress

- **0.9 remote:** link the Supabase staging and production projects and push the migration (founder runs `supabase login`/`link`; commands are in the chat).

- **0.2 Vercel linking (founder).** Import the GitHub repo in Vercel with Root Directory `apps/web`. Production branch: `main`. `staging` gets a stable preview URL. Every PR gets a preview.

## Next

- 0.9 Schema + RLS · 0.10 API skeleton · 0.11 Auth · 0.12 Onboarding + role areas
- 0.13 Consent, monitoring, legal placeholders · 0.14 E2E + acceptance

## Open questions

- **Romanian native review:** every ro string is unreviewed until the founder (or a native reviewer) confirms it. Before launch we need a review tracker (Phase 1).
- **BNR EUR/RON rate:** `ronToEur` exists. The config value itself is added in Phase 1 with `verified: false` until the founder confirms the source and date.

- Trademark check for "U-Drive" (OSIM / EUIPO), done by the founder.
- SMS provider for phone OTP (cost per SMS). Until then, Supabase test numbers only.
- Payment provider and e-signature provider: decide before Phase 3.
