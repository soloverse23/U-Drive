# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Source of truth

- [docs/SPEC.md](docs/SPEC.md) is the full product spec. Its §0 working rules are binding. Read it, plus [docs/PROGRESS.md](docs/PROGRESS.md), at the start of every phase.
- [docs/DECISIONS.md](docs/DECISIONS.md) records architecture choices and the founder's answers to open questions. Add new decisions there.
- Work phase by phase and step by step. At the start of a phase: plan mode, clarifying questions, plan approval, then code. After each step: run lint, type-check and tests, give browser check instructions, make one focused commit, and update PROGRESS.md.

## Commands

pnpm comes from Corepack (`packageManager` in package.json). Run `corepack enable` once per machine.

```sh
pnpm install
pnpm lint          # turbo → eslint in every workspace
pnpm typecheck     # turbo → tsc --noEmit
pnpm test          # turbo → vitest run
pnpm format:check  # prettier
pnpm --filter @u-drive/core test                          # one package
pnpm --filter @u-drive/core exec vitest run src/config/types.test.ts   # one file
pnpm --filter @u-drive/core exec vitest run -t "isEstimate"            # by test name
```

## Architecture

pnpm + Turborepo monorepo. Internal packages export TypeScript source directly (`exports: ./src/index.ts`) and have no build step.

- `apps/web`: Next.js App Router (scaffolded in later steps). Must not contain business logic.
- `packages/core`: pure TS business logic and config. No framework imports, so the future Expo app can reuse it.
- `packages/api-contract`: zod schemas for the versioned REST API `/api/v1`. They generate OpenAPI and a typed client. Web and mobile both call this API. Server actions may only be thin wrappers around it.
- `packages/db`: Supabase (EU) SQL migrations and generated types. RLS on every table.
- `packages/i18n`: `ro` (default) and `en` message files, one per feature.
- `packages/ui-tokens`: design tokens. This is the only place colors, type and spacing are defined. Tailwind and later React Native consume them.

## Hard rules (from the spec)

- **No invented numbers.** Every market, fee, tax or price value is a `ConfigValue` (`packages/core/src/config/types.ts`): `{ value, unit, source, sourceUrl, date, verified }`. Unverified values are shown as estimates. Ask the founder before setting `verified: true`.
- **No hard-coded UI strings.** All text comes from ro and en translation files. Romanian uses comma-below ș/ț, never cedilla ş/ţ. Tone is informal "tu" for all audiences, and the founder confirms Romanian copy.
- **Money:** RON is always shown as "lei" after the amount, in both languages. Always use `formatMoney` from `@u-drive/core`. Never format money by hand.
- **Brand name** comes only from `packages/core/src/config/brand.ts`. The trademark check is pending.
- **Ask before implementing** anything touching law, tax, payments, personal data (CNP, ID documents, criminal records) or third-party trademarks. Bolt and Uber appear as plain text only: no logos, no implied endorsement.
- **Design system** follows spec §3 exactly, including the §3.7 anti-"AI look" rules. If a screen needs something the design system doesn't cover, propose an addition to the design system first.
