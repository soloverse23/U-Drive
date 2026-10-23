# Decisions

Newest at the bottom. Each entry: date, decision, reason.

## 2026-10-23 — Phase 0 open questions (founder answers)

| #   | Question         | Answer                                                                                                                                            |
| --- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Brand / domain   | **U-Drive**. Domain not registered yet. Claude designs a type-only wordmark. Trademark search (OSIM, EUIPO) recommended before buying the domain. |
| 2   | Font             | Pending: chosen after the `/design/fonts` comparison (step 0.5).                                                                                  |
| 3   | Hosting          | Vercel (web, preview deploys) + Supabase EU / Frankfurt (Postgres, Auth, Storage).                                                                |
| 4   | Payment provider | Undecided. Research and legal check of weekly RON collection before Phase 3.                                                                      |
| 5   | E-signature      | Undecided. Decide in Phase 3.                                                                                                                     |
| 6   | Launch city      | National from day one. City is a filter with no default.                                                                                          |
| 7   | Platforms        | Bolt and Uber from day one, as plain text only.                                                                                                   |
| 8   | Romanian tone    | Informal "tu" for **all** audiences (overrides the spec default of formal for dealers and partners).                                              |
| 9   | Founder's level  | Some technical: brief trade-off explanations, exact steps to check results.                                                                       |

## 2026-10-23 — Monorepo tooling

- pnpm 10 via Corepack (version pinned in `packageManager`) + Turborepo 2. This is the stack the spec suggests. It is widely documented.
- Internal packages export TS source and have no build step. Next.js and Vitest compile them directly, which keeps the workspace simple. If the Expo app needs it, we revisit in Phase 7.
- TypeScript strict, with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`. ESLint 9 flat config with `typescript-eslint` strict. Prettier 3. Vitest 3.
- The folder `Docs/SPEC.MD` was renamed to `docs/SPEC.md`, so paths match the spec on case-sensitive systems (CI).

## 2026-10-23 — API style (proposed in plan, approved)

REST under `/api/v1` with zod contracts in `packages/api-contract`, rather than tRPC. The Expo app and partners can call plain HTTP, versioning sits in the URL, and OpenAPI plus a typed client are generated from the same schemas.

## 2026-10-23 — Environments and CI

- **Production** = the `main` branch on Vercel. **Staging** = the `staging` branch: a Vercel preview with its own branch URL and its own env vars (a staging Supabase project from step 0.9). **Previews** = every PR. `NEXT_PUBLIC_APP_ENV` tells them apart, and it gates staging-only routes such as `/design`.
- CI uses GitHub Actions: `pnpm install --frozen-lockfile` → format check → lint → typecheck → test → build. Vercel builds deploys and GitHub runs the checks. This keeps CI independent of the hosting provider.
- The Next.js 16 app consumes workspace packages through `transpilePackages`. Next's lint command was removed in Next 16, so ESLint runs directly with `@next/eslint-plugin-next`.

## 2026-10-23 — Status colors are icon-only (founder approved)

The contrast check showed that spec status colors fail AA as normal text. Success is 3.92 on white and warning is 3.46. Error and info fall below 4.5 on gray-50. Decision: status colors keep their spec values and are used **only** for icons, borders and indicator bars (non-text, 3:1, which all pass on `bg` and `surface`). Status message text uses `fg`. This makes "color is never the only signal" automatic. No new tokens were added.

## 2026-10-23 — Token architecture

- TS tokens in `packages/ui-tokens/src` are the single source. `pnpm --filter @u-drive/ui-tokens generate` writes `theme.css` (committed). A test fails if it is stale.
- `theme.css` starts with `--*: initial`, which removes every Tailwind default (colors, radii, shadows, spacing multipliers). Only spec values can be used: `rounded-control`, `rounded-card`, `rounded-pill`, `shadow-overlay`, spacing keys 1/2/3/4/6/8/12/16/24/32, `h-control(-compact|-large)`, `max-w-content`.
- **Semantic roles** (`bg`, `surface`, `surface-strong`, `border`, `fg`, `fg-muted`, `fg-subtle`, `fg-disabled`, `inverse-bg`, `inverse-fg`) are CSS variables. Wrapping any block in `.dark-section` flips them for the dark landing sections and the footer. Components should use roles, not raw grays.
- `fg-muted` is gray-600, because gray-500 fails AA on gray-50 and gray-100. `fg-subtle` (gray-500) is allowed only on the page background.
- **Additions not in the spec** (proposed here): breakpoints are Tailwind's defaults (sm 640, md 768, lg 1024, xl 1280). Gutters are 16px on mobile and 24px on desktop. The overlay shadow is `0 8px 24px rgba(0,0,0,.16)`. Ease-out is `cubic-bezier(0,0,.2,1)`. Font sizes and line heights are in rem so browser zoom and font settings work.

## 2026-10-23 — i18n

- next-intl 4 with `localePrefix: "always"`. Every URL carries `/ro` or `/en`. `/` redirects by `Accept-Language` or the `NEXT_LOCALE` cookie, with `ro` as the fallback.
- Message files are split per feature (`common`, `nav`, …) and registered in `packages/i18n/src/index.ts`. `Messages` is typed from the ro files, so a missing key is a type error and a ro/en mismatch fails a test.
- English dates are dd/mm/yyyy (`en-GB`). The spec only fixes the ro formats. All dates render in `Europe/Bucharest`.
- `react/jsx-no-literals` blocks hard-coded text in JSX. Brand name and locale codes also come from config or messages.

## 2026-10-23 — RON is always "lei" (founder decision)

RON amounts are written **"lei" after the number, in every locale and on every screen**: `1.234,50 lei` (ro) and `1,234.50 lei` (en). This is implemented once in `formatMoney` (`packages/core/src/format.ts`). Never write "RON" in the UI. EUR keeps the standard Intl format.

## 2026-10-23 — Font loading and internal routes

- Fonts load with `next/font/google`, using the `latin` + `latin-ext` subsets and weights 400/500/700. Files are fetched at **build time** and served from our domain, so browsers never contact Google (this matters for GDPR). It is the boring, documented Next.js path, and the spec's "self-host" requirement is met. Fallback metrics are generated automatically to limit layout shift.
- Internal routes (`/design/*`) are gated by `showInternalRoutes()` in `apps/web/src/lib/env.ts`. `NEXT_PUBLIC_APP_ENV` takes priority. If it is unset, Vercel's `VERCEL_ENV=production` counts as production, so a forgotten variable can't expose `/design`.
- Playwright was added early (planned for 0.14) so that design pages can be screenshot-checked.

## 2026-10-23 — Brand font: Instrument Sans (founder pick)

Instrument Sans (SIL OFL 1.1), weights 400/500/700, latin + latin-ext. It was chosen from the `/design/fonts` comparison. It is loaded once in `apps/web/src/app/fonts.ts` as `--font-brand`.

## 2026-10-23 — Component decisions (step 0.6)

- **State layer:** hover and pressed states overlay the button's own text color at 8% and 16% (`before:bg-current`). One rule works for every variant and on dark sections. Focus is a 2px `fg` outline with a 2px offset.
- **Native `<select>` and `<input type="date">`:** best on mobile and with assistive tech, and the boring choice. The date display format follows the browser's locale. A custom picker can come later if needed.
- **File input:** the native input stays (visually hidden) for accessibility. Our translated label replaces the browser's untranslated "No file chosen".
- **Radix** (Tabs, ToggleGroup) supplies unstyled, accessible behavior (keyboard, ARIA). All styling is ours. No tailwind-merge, because it would drop token classes it doesn't know.
- **Design-system additions (please confirm):** 16px icons are allowed inside compact elements (badges, compact buttons, field errors; standard is 24px). A loading spinner rotates at 1s, linear, and is disabled under `prefers-reduced-motion`.

## 2026-10-23 — Components II decisions (step 0.7)

- **Top nav switches at `xl` (1280px), not `lg`:** the Romanian labels ("Pentru proprietari", "Cum funcționează") don't fit on one line at 1024px. Below 1280 the full-screen menu is used.
- **Design-system additions (please confirm):** `--container-sidebar` 256px for the app sidebar and `--container-dialog` 560px for the max width of modals and toasts. The overlay backdrop is black at 50%. The bottom sheet's max height is 85% of the viewport. The mobile tab bar has a 2px black top indicator on the active tab.
- Overlays open without animation for now. The spec allows only minimal motion, and Radix unmounts closed dialogs. A 150ms fade can be added later.
- The toast has a dark surface (`inverse-bg`), and status icons keep their color (all pass 3:1 on black). It auto-dismisses after 5s and is announced through a Radix live region.
- Phosphor icons are React components and can't cross the server→client boundary. App-shell menus are defined in small client wrappers (see `design/_components/demo-app-shell.tsx`), which is the pattern for the role shells in 0.12.

## 2026-10-23 — Logo: "Lane" (founder pick, option C)

- `U▬DRIVE`: Instrument Sans Bold capitals, letter-spacing 0.01em. The hyphen is replaced by a bar 0.6em wide and 0.15em tall, skewed −24° and set 0.24em above the baseline (a lane line). It is type-only, with no symbol. It stays clear of Uber's title-case wordmark and app tile.
- Source of truth: `tools/brand/build_wordmark.py`. It outlines the glyphs with fontTools and HarfBuzz kerning, using the name from `packages/core/src/config/brand.ts`, so a rename only requires rerunning it plus `node tools/brand/rasterize.mjs`. Generated files are committed and excluded from Prettier.
- Compact mark `U▬`: white on a black tile for the favicon (rounded 6/32) and app icons (full bleed, mark at 56% width, inside the maskable safe zone).
- The Open Graph base is the wordmark in white on black, left-aligned. Per-page OG images come in Phase 1.
- `siteUrl()` (`apps/web/src/lib/env.ts`): `NEXT_PUBLIC_SITE_URL`, otherwise the Vercel production domain or deployment URL. It feeds `metadataBase`.

## 2026-10-23 — Initial schema and data minimisation (step 0.9)

- **Personal data:** `profiles` stores only the full name, locale and an onboarding timestamp. Email and phone stay in `auth.users` (no copies). **No CNP, ID numbers or criminal-record data** until there is a documented legal basis (spec §2, GDPR art. 10). The founder was asked and did not object.
- **Roles:** users can give themselves only `driver`, `owner_individual`, `owner_fleet` and `owner_dealer`. `partner`, `accountant` and `admin` need verification and are granted by an admin. This is enforced in RLS and tested. Role checks use the `security definer` functions `has_role()` and `is_admin()` to avoid RLS recursion.
- **Documents:** owners add documents only as `pending`, and only admins change the status. The storage path must start with the owner's id, which matches the storage policy (`documents/<uid>/...`). Supabase Storage encrypts at rest. A retention policy will be defined with the lawyer before real uploads (Phase 2).
- **Audit log:** append-only, readable by admins only, and nobody can update or delete it. Writes go through `log_audit()` (actor is always `auth.uid()`) and triggers on role and document-status changes.
- **Tests:** pgTAP via `supabase test db`, run locally and in a separate CI job (`supabase db start`, Postgres only). A Vitest check keeps `selfAssignableRoles` in sync with the SQL.
- **Environments:** two Supabase projects in Frankfurt, `u-drive-staging` and `u-drive-production`. Migrations are pushed with the Supabase CLI. Keys live only in Vercel and local `.env.local`.
