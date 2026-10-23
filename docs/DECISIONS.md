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
