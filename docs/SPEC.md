# PROJECT SPEC: [BRAND] — Ridesharing Car Rental, Rent-to-Own & PFA Services Platform (Romania)

## 0. Your role and how to work with me

You are the lead engineer and product designer on this project. I am the founder.
I am building a web application first, designed so it can later become a mobile app
(iOS/Android) without a rewrite.

Working rules (follow these in every phase):
1. Work strictly phase by phase. Never start a new phase until I explicitly approve the current one.
2. At the start of each phase: read this spec and docs/PROGRESS.md, enter plan mode, ask me
   clarifying questions, and propose a step-by-step plan (steps of roughly 1–2 hours each).
   Do not write code until I approve the plan.
3. After each step: run lint, type-check and tests; tell me exactly how to check the result
   in the browser; make one focused git commit with a clear message.
4. Update docs/PROGRESS.md at the end of every step (done / in progress / next / open questions)
   and record architecture choices in docs/DECISIONS.md.
5. Never present invented numbers as facts. All market data, fees, tax rates and prices live in
   config files with a source, a date and a `verified` flag (see section 5). Anything unverified
   is visibly labeled as an estimate in the UI.
6. Every user-facing string comes from translation files (Romanian + English). No hard-coded text.
7. If something touches law, tax, payments, personal data or third-party trademarks, flag it and
   ask me before implementing. Romanian legal and tax rules must be confirmed by a local lawyer
   or accountant; build them as configurable, never hard-coded.
8. Prefer boring, well-documented technology. Explain trade-offs briefly when you choose.
9. Follow the design system in section 3 exactly. If a screen needs something the design system
   does not cover, propose an addition to the design system first, then use it.

## 1. Business context (read carefully)

Market: Romania, ride-hailing (Bolt, Uber, others). Drivers must operate through an authorized
"operator de transport alternativ" (a PFA or a company) holding an ARR authorization, plus one
"copie conformă" and badges ("ecusoane") per car. A copie conformă is issued to the operator for
a car the operator holds by ownership, rental, leasing or (currently) comodat.

Today most cars (~68% per ARR data, mid-2026) are used by fleets via "comodat" (free loan of a car
to a fleet company). A pending bill (B424/2026) proposes banning comodat, leaving ownership,
rental and leasing. In parallel, many drivers are leaving fleets to work as their own PFA after
ANAF tax crackdowns.

Our product connects three sides:
- DRIVERS (PFA or becoming PFA): need a car, paperwork help, accounting, financing.
- SUPPLY (car dealers / used-car lots, fleets, individual owners): want to rent cars to verified
  drivers with guaranteed weekly payments.
- PARTNERS: leasing companies, banks, insurers, licensed accountants.

Core flow (8 steps):
1. Owner lists a car (photos, weekly price).
2. Car verification (ITP, RCA, photo inspection, ride-hailing eligibility).
3. Driver applies (license, atestat, PFA status).
4. Driver verification (documents, criminal record certificate, ride history — with consent
   and a documented legal basis).
5. Match + standard rental contract between the OWNER and the DRIVER'S PFA (the operator),
   so the PFA can obtain the copie conformă. Deposit held via a licensed payment provider.
6. Weekly rent collected automatically (card / direct debit — method to be confirmed legally).
7. Owner paid weekly: rent minus our commission. Rent invoicing handled correctly
   (e-Factura where required — to be confirmed with an accountant).
8. Rent-to-own: after X months of on-time payments, the driver can buy the car via a leasing
   partner; the dealer sells the car to the leasing company.

Revenue: rental commission (% TBD), optional damage cover, leasing referral commission per
contract, AI-assisted accounting subscription, partner referrals.

Competitors (do not copy their branding or wording): Pick.ride (Bolt-only PFA + accounting
subscription), DriverHub (free rental listings), Bolt's own rental marketplace.
Our differentiation: trust layer (verification, deposits, guaranteed payouts, standard
contracts), Bolt AND Uber, fleets/dealers as allies, rent-to-own via leasing, AI-assisted
accounting with a licensed accountant in the loop.

Important: we are independent. We are not affiliated with Uber or Bolt. Platform names appear
only as plain text facts (e.g. "works with Bolt and Uber"), never as logos, and never in a way
that suggests endorsement. Ask me before using any third-party logo.

## 2. Technical requirements

Suggested stack (propose changes in Phase 0 if you disagree, with reasons):
- Monorepo (pnpm + Turborepo):
  - apps/web: Next.js (App Router) + TypeScript + Tailwind CSS. Use shadcn/ui primitives only as
    an unstyled base, fully restyled to our design system (section 3).
  - packages/core: pure TypeScript business logic (calculators, pricing, eligibility rules,
    tax estimates, rent-to-own engine). No framework code, so a mobile app can reuse it.
  - packages/db: database schema + migrations.
  - packages/i18n: shared translation files (ro, en).
  - packages/ui-tokens: design tokens (colors, type, spacing, radius) as the single source of
    truth, exported for Tailwind now and React Native later.
  - apps/mobile (Phase 7 only): Expo / React Native reusing packages/core, ui-tokens and the API.
- API: every business operation is exposed through a versioned, typed HTTP API (Next.js route
  handlers, REST or tRPC — justify the choice) that calls packages/core. Server actions may be
  used only as thin wrappers for web forms, never as the only path, because the mobile app
  must call the same API.
- Database + auth + file storage: Supabase (Postgres, Row Level Security, Storage) hosted in an
  EU region, or an equivalent you justify.
- i18n: next-intl. Locales: `ro` (default) and `en`, locale in URL (/ro/..., /en/...).
  Correct Romanian diacritics with comma-below (ș, ț — never ş, ţ).
  Currency: RON by default with ro-RO formatting; car purchase prices may also show EUR using a
  configurable exchange rate (source: BNR, with date). Dates: dd.mm.yyyy in ro.
- Payments: a licensed provider (e.g. Stripe Connect). We never hold user funds ourselves.
  Build behind an interface so the provider can be swapped.
- AI: Claude API (Anthropic) for document extraction and the accounting assistant, behind a
  service interface, with usage limits. Always human-in-the-loop for anything filed with
  authorities.
- Email (transactional) and SMS (OTP, reminders) providers behind interfaces.
- Error monitoring (e.g. Sentry) and privacy-friendly product analytics, both behind a
  GDPR-compliant cookie/consent banner.
- Environments: local, staging, production. Secrets only in environment variables, never in
  the repo. Seed scripts for demo data clearly flagged as demo.
- PWA support (installable, offline-friendly basics) from Phase 1.
- Testing: Vitest for packages/core (calculators and eligibility rules must have thorough unit
  tests), Playwright for key user flows in both languages.
- Accessibility: WCAG 2.1 AA. Mobile-first responsive design.
- Security & privacy: GDPR compliance, encrypted document storage, RLS on every table, audit log
  for sensitive actions. Treat the Romanian personal numeric code (CNP), ID documents and
  criminal record certificates as highly sensitive (least-privilege access, retention policy,
  GDPR Article 10 considerations for criminal-record data — ask me before storing it).

Roles: `driver`, `owner_individual`, `owner_fleet`, `owner_dealer`, `partner`, `accountant`, `admin`.
One account can hold multiple roles.

## 3. Design system

### 3.1 Direction
Inspired by Uber's product design language: black and white, high contrast, utilitarian, bold
typography, generous white space, photography-led, everything feels fast and functional.
It must look like a serious mobility/fintech product designed by a human team — NOT like a
generic AI-generated website.

Inspiration only. Do NOT use Uber's logo, the Uber Move typeface (proprietary, not licensed),
Uber's illustrations, photography, icons, product names or exact layouts. Our identity must be
clearly our own. You may study Uber's publicly documented "Base" design system for patterns
and principles, not assets.

### 3.2 Color tokens (no brand accent color — black is the accent)
- black: #000000 (primary actions, headlines, dark sections)
- white: #FFFFFF (page background)
- gray-50: #F6F6F6 (subtle section background, filled inputs)
- gray-100: #EEEEEE (secondary button background, dividers on gray)
- gray-200: #E2E2E2 (borders, dividers)
- gray-300: #CBCBCB (disabled borders)
- gray-400: #AFAFAF (disabled text, placeholders on dark)
- gray-500: #757575 (secondary text — minimum for text on white)
- gray-600: #545454 (body secondary text)
- gray-700: #333333
- gray-800: #1F1F1F (dark section surfaces)
- Status colors, used ONLY for status (badges, alerts, validation), never for decoration,
  each muted and paired with an icon + text so color is never the only signal:
  success #05944F, warning #C77700, error #E11900, info #276EF1.
All text/background pairs must pass WCAG AA contrast. Provide a dark-section variant
(black background, white text) used for alternating landing sections and footer.

### 3.3 Typography
- One sans-serif family for the whole product. Requirements: free/open license (e.g. SIL OFL),
  full Romanian support (ș ț ă î â, comma-below), weights 400/500/700, tabular numbers.
- In Phase 0, build a /design/fonts comparison page rendering the same headline, paragraph,
  price table and calculator result in 3–4 candidates with a clean geometric-grotesk feel
  (for example: Manrope, Figtree, Instrument Sans, Inter). I will pick one. Self-host the font.
- Type scale (size/line-height, px):
  display 56/64 (700, letter-spacing -0.02em, desktop) · 40/48 on mobile
  h1 40/48 (700) · h2 32/40 (700) · h3 24/32 (700) · h4 20/28 (500)
  body-lg 18/28 (400) · body 16/24 (400) · body-sm 14/20 (400)
  label 16/20 (500) · caption 12/16 (500)
- Headlines short and large, left-aligned. Use tabular numbers in all prices, calculators,
  tables and charts.

### 3.4 Layout, spacing, shape
- 4px base unit; spacing scale 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- Max content width 1280px; 12-column grid on desktop, 4-column on mobile.
- Section vertical padding: 96px desktop, 64px mobile.
- Radius: 8px buttons and inputs, 12px cards and images, full pill for chips/tags only.
- Elevation: flat. Separate with 1px gray-200 borders or gray-50 backgrounds. Shadows only for
  overlays (menus, modals, sheets).
- Prefer asymmetric, editorial layouts (e.g. text left / image right, big numbers) over centered
  stacks.

### 3.5 Components (define each with states: default, hover, focus, active, disabled, loading)
- Buttons: primary (black bg, white text), secondary (gray-100 bg, black text), tertiary
  (text only, underline on hover), destructive (error). Heights 48px default, 56px large,
  36px compact. Full-width on mobile forms.
- Inputs: gray-50 filled background, no visible border at rest, 2px black border on focus,
  label above, helper/error text below. Same style for select, date, file upload.
- Navigation: white top bar, wordmark left, links, language switcher (RO/EN), "Log in" tertiary
  and "Sign up" primary on the right. Mobile: full-screen menu. Logged-in apps: left sidebar on
  desktop, bottom tab bar on mobile (max 5 tabs).
- Tabs with black underline indicator; segmented control for 2–3 options.
- Cards: white with 1px gray-200 border or gray-50 fill; no colored backgrounds.
- Tables: dense, zebra-free, gray-200 row dividers, right-aligned numbers.
- Status badges, progress stepper (for onboarding and rent-to-own), timeline, empty states with
  a one-line explanation and one action, toasts, modals, bottom sheets (mobile).
- Calculator pattern: inputs left, large result on the right (or below on mobile) with the
  breakdown table and an "Assumptions" expandable list showing source and estimate badges.

### 3.6 Icons, imagery, charts, motion
- Icons: one consistent set, 24px, single stroke weight, black (e.g. Phosphor). No icons inside
  colored circles. No decorative icons in feature grids.
- Imagery: real, licensed photography of cars, drivers and Romanian cities (Bucharest, Cluj,
  Timișoara, Iași), natural or black-and-white treatment. No 3D illustrations, no AI-generated
  images, no stock handshake/laptop clichés. Use neutral placeholders until I provide photos.
- Charts: black and grays only, thin lines, direct labels instead of legends where possible,
  source line under every chart, no gradients, no 3D.
- Motion: minimal and fast (150–200ms, ease-out) for state changes only. No parallax,
  no scroll-triggered fly-ins, no bouncing.

### 3.7 Anti-"AI look" rules (hard rules)
Never use: gradients (backgrounds, text or buttons), purple/blue glow, glassmorphism, blurred
blobs, sparkle/magic-wand icons, emoji in the UI, "AI-powered" badges, the default
"three centered cards with icons" feature grid, rounded-2xl everything, heavy drop shadows,
centered-everything layouts, lorem ipsum, fake testimonials, fake logos, fake user counts.
The AI accounting assistant is presented as a practical tool ("Scan receipt", "Check my
taxes"), not as magic.

### 3.8 Voice and copy
- Short, direct, concrete. Verbs first: "Închiriază o mașină" / "Rent a car",
  "Listează mașina" / "List your car".
- Prefer real numbers with sources over adjectives. Never promise earnings; say "estimate".
- Banned phrases (both languages): "revolutionary", "unlock", "seamless", "game-changer",
  "next-level", "supercharge", "effortless", "AI-powered", and Romanian equivalents.
- Romanian copy must read as written by a native speaker (formal "dumneavoastră" vs informal
  "tu": ask me; default to friendly "tu" for drivers, formal for dealers/partners).
  Flag every Romanian string for native review before launch.

### 3.9 Deliverables
- packages/ui-tokens with all tokens above.
- A /design route (staging only) showing every token and component in all states, in RO and EN,
  plus the font comparison page.

## 4. Information architecture (high level)
Public: Home, For drivers, For owners (dealers & fleets), For partners, Cars (listings),
Calculators, How it works, FAQ, Legal.
Driver app: Overview, My company (PFA), Documents, Car & rental, Payments, Rent-to-own,
Accounting, Requests, Partner services, Settings.
Owner app: Overview, Cars, Applications, Rentals & contracts, Payments & payouts,
Rent-to-own, Ride-hailing readiness, Settings.
Accountant workspace, Partner portal, Admin back-office.

## 5. Data and configuration rules

Create config files (e.g. packages/core/config/*.ts), each value shaped like:
{ value, unit, source, sourceUrl, date, verified }

Seed with these data points (show source on the landing page; mark unofficial ones):
- Authorized ridesharing cars (copii conforme, ARR): 9,110 (Jan 2020); 55,877 (May 2025);
  66,166 (mid-2026). No public national data for 2021–2024 — show as a gap, never interpolate.
- Mid-2026 split by holding type (ARR via StartupCafe): comodat 45,255 (68.4%); rental 12,688;
  owned 5,094; leasing 3,129.
- Authorized operators: 1,622 (2020) -> 15,127 (May 2025) (ARR via ZF).
- ~29,000 entities incl. ~17,000 PFA (mid-2026) — UNOFFICIAL (Snoop), label as such.
- New ride-hailing entities H1 2026: 9,335, ~76% PFA (SOLO/Bolt — interested parties, label).
- ARR badges 30 May 2025: Bolt 54,480; Uber 51,422 (affiliations, cars can be on both).
- Example net income at 8,000 RON gross/month: independent PFA 5,569 RON vs PFA via fleet
  4,921 RON (SOLO/Bolt calculation — interested parties, label it).
- Market rental benchmark: ~700–715 RON/week for a Toyota Corolla hybrid (competitor listings).
- Platform commissions, ARR fees, ITP frequency, vehicle age limit (<15 years at copie conformă
  expiry), PFA tax rates (income tax, CAS, CASS), VAT rate, BNR exchange rate: put in config
  with verified=false until I confirm them. Ask me before treating any as verified.

## 6. Phases

Each phase: Goal, Features, Acceptance criteria, Out of scope.

### PHASE 0 — Foundation
Goal: a deployable skeleton with the design system in place.
Features:
- Monorepo, linting, formatting, type-check, CI (GitHub Actions), preview deployments,
  staging/production environments, error monitoring.
- packages/ui-tokens + Tailwind config from tokens; font comparison page; /design route with
  all core components and states.
- next-intl with ro/en, language switcher, translation files per feature.
- Auth: email + phone OTP; role selection at onboarding; protected route groups per role.
- API skeleton (versioned, typed) + initial schema and RLS: users, profiles, roles, vehicles,
  documents, audit_log.
- Cookie/consent banner; legal page placeholders (Terms, Privacy/GDPR, Cookies) in ro/en.
- CLAUDE.md, docs/PROGRESS.md, docs/DECISIONS.md.
Acceptance: deployed preview; ro/en switch works everywhere; sign-up -> role -> empty dashboard;
/design page complete; CI green.
Out of scope: business features.

### PHASE 1 — Public landing site + calculators + listings preview
Goal: explain the opportunity, build trust, capture leads from drivers, owners and partners.
Features:
- Home: hero (one sentence for drivers, one for owners, two primary actions), how it works
  (8-step flow diagram in our style), market data section with charts from config (sources
  shown, unofficial data marked), audience benefits, rent-to-own explanation, partners
  (placeholder, no fake logos), FAQ, lead forms, footer (dark section).
- Audience pages: /drivers, /owners (dealers & fleets), /partners.
- Calculators (logic in packages/core, unit-tested, assumptions editable and visible):
  a) Driver: rent vs fleet vs own car — weekly gross, platform commission, rent, fuel,
     PFA costs/taxes estimate -> net per week/month.
  b) Owner/dealer: rental ROI — car price (RON/EUR), weekly rent, utilization %, our commission,
     insurance, maintenance, depreciation -> monthly net, payback period, yield.
  c) Rent-to-own preview: illustrative path from rental to ownership.
  Each result shows "Estimate — not financial or tax advice".
- Car listings preview (demo cars clearly marked "example") with filters: city, price/week,
  fuel type, year, eligible platform category.
- SEO: metadata per locale, hreflang, sitemap, Open Graph images in our style.
Acceptance: all content in ro/en; calculators match unit tests; charts render from config;
Lighthouse mobile performance & accessibility >= 90; leads stored and visible to admin;
passes the anti-AI-look checklist (3.7).
Out of scope: real bookings, payments.

### PHASE 2 — Driver portal
Goal: everything a driver (current or future PFA) needs in one place.
Features:
- Onboarding wizard (stepper) to become a legal ride-hailing PFA: atestat, PFA registration,
  ARR authorization, copie conformă & badges, SPV/ANAF access, intra-community VAT code,
  platform accounts (Bolt and Uber), cash register if required. Each step: explanation,
  required documents, upload, status, "request help".
- My company dashboard: PFA status, authorization status, document validity, upcoming
  deadlines and obligations, alerts.
- Document vault: upload, categorize, expiry dates, reminders (email, SMS, in-app) for ITP,
  RCA, passenger insurance, medical certificate, atestat, copie conformă, etc.
- Requests center: structured requests with status tracking and messaging.
- Calculators with the driver's own data pre-filled.
- Car marketplace: browse, save, apply; application status.
- My rental: contract, payment schedule and history, handover photos, report damage.
- Rent-to-own progress tracker (UI; logic in Phase 4).
- Partner services: offers (financing, insurance, fuel, service) with consented "request offer".
Acceptance: test driver completes the wizard end-to-end with admin mock review; reminders fire
in staging; all screens mobile-first and bilingual.
Out of scope: real payments, AI accounting.

### PHASE 3 — Owner side (dealers, fleets, individual owners) + rental marketplace
Goal: give supply partners the tools to rent cars safely and profitably.
Features:
- Owner onboarding by type, company details, payout setup (KYC via payment provider).
- Vehicle management: single add + bulk CSV for fleets/dealers, photos, documents, pricing,
  availability calendar, city.
- Ride-hailing eligibility checker per car (age vs copie conformă expiry, doors, seats, AC,
  ITP frequency, category requirements) — rules in config.
- "Get your car ride-hailing ready" assistant for dealers: checklist (ITP, insurance,
  inspection, branding conditions), explanation that the driver's PFA obtains the copie conformă
  based on our rental contract, inspection booking.
- Comodat-to-rental conversion tool for fleets: inventory, guided conversion to rental contracts,
  cost/tax impact estimate (estimate label, accountant review).
- Driver applications: verified profiles, accept/decline.
- Contracts: bilingual rental contract generation (PDF) between owner and the driver's PFA,
  e-signature integration (provider TBD). Templates marked DRAFT until lawyer-approved.
- Handover check-in/check-out with timestamped photos and damage notes.
- Payments via provider: deposit, weekly rent charge, owner payouts minus commission, failed
  payment handling, statements; rent invoicing with e-Factura support where required (confirm).
- Owner dashboard: utilization, earnings, upcoming expiries, fines/damage log.
Acceptance: full test-mode path — list car -> driver applies -> contract signed -> deposit +
first weekly rent -> owner payout recorded; failure paths tested.
Out of scope: leasing, AI accounting.

### PHASE 4 — Rent-to-own & leasing
Goal: turn rental history into car ownership via partners.
Features:
- Program configuration per car/owner: eligibility, months required, purchase price rules,
  leasing partner.
- Eligibility engine (packages/core): on-time payment streak, months active, missed payments.
- Driver view: progress, next steps, illustrative monthly lease (partner parameters).
- Consented lead handoff to leasing partner (payment-history export), status tracking,
  referral commission ledger.
- Dealer view: cars in rent-to-own, sale pipeline (dealer -> leasing company -> driver).
Acceptance: unit-tested rules; consented export; commission ledger correct.
Out of scope: issuing credit ourselves (we never lend).

### PHASE 5 — AI accounting & document assistant
Goal: cut the cost of PFA accounting with AI, with a licensed accountant (CECCAR) in the loop.
Features:
- Import platform earnings: Bolt/Uber weekly statements (CSV/PDF) -> AI extraction ->
  validation; direct integrations later if official APIs exist.
- Receipt & invoice capture: photo -> AI extraction (date, supplier, amount, VAT, category)
  -> user confirms.
- PFA single-entry ledger, monthly summaries.
- Tax estimate dashboard (config rates, verified flag shown), yearly declaration preparation
  checklist, deadline calendar with reminders.
- e-Factura / SPV guidance and document tracking (no automatic filing in v1).
- Accountant workspace: review queue per client, approve/correct, notes, sign-off.
  Nothing is filed without accountant approval.
- Assistant chat (ro/en) grounded in the user's data and a curated knowledge base; shows
  sources and a disclaimer; escalates to a human accountant.
- AI usage/cost controls and audit logs.
Acceptance: extraction accuracy measured on a sample test set; AI-produced entries marked until
confirmed; accountant approval flow works.
Out of scope: fully automated filing with ANAF.

### PHASE 6 — Admin back-office & partners
Verification queues (drivers, cars, documents), disputes, partner management (offers, leads,
commissions), CMS for landing/FAQ in ro/en, config editor for market data (source + verified),
analytics (funnel, utilization, payments, churn), audit log viewer, role management.

### PHASE 7 — Mobile app
PWA polish first (push notifications, camera upload, offline document view). Then Expo app for
drivers (documents, rental, payments, receipt capture, assistant) reusing packages/core,
ui-tokens and the API, following the same design system. Owner app later if needed.

## 7. Definition of done (every step)
- Works in ro and en, on mobile and desktop.
- Follows the design system and the anti-AI-look rules.
- Lint, type-check, tests pass; new logic in packages/core has unit tests.
- No hard-coded strings, secrets or unverified numbers presented as facts.
- PROGRESS.md updated; one clear commit.

## 8. Open questions — ask me these in Phase 0 before coding
1. Brand name, domain, wordmark.
2. Font choice (after the comparison page).
3. Hosting/cloud preference and budget.
4. Payment provider and whether weekly direct debit in RON is feasible (legal check).
5. E-signature provider.
6. Launch city.
7. Bolt only, Uber only, or both from day one in onboarding flows.
8. Formal vs informal Romanian tone per audience.
9. My technical level, so you adjust how much you explain.