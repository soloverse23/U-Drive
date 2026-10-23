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
