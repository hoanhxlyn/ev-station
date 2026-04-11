# Implementation Plan: EV Station Management System

**Branch**: `002-ev-station-management` | **Date**: 2026-04-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/002-ev-station-management/spec.md`

## Summary

Build a full-stack EV Station Management System enabling users to authenticate (email/password + GitHub OAuth with email verification), manage charging sessions via a simulated station API (manual start/end, no auto-completion timer), top up credits (with mock Stripe-style payment flow), manage vehicles and profiles, and view dashboards withCharts. Admins oversee KPIs, cash flow, and user accounts. The system uses React Router 7 SSR with Better Auth, Drizzle ORM (SQLite), Mantine v9 UI, and Zod validation — all within the existing codebase conventions. Authenticated routes share a sidebar navigation layout with a "Sign out" action. Dashboard chart filtering uses URL query parameters (`?period=day|week|month|year`). Session expiry redirects to login with a toast notification.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: React Router 7.13.2, Mantine v9, Better Auth 1.5.6, Drizzle ORM 0.45.2, Zod 3.24.2, Recharts 3.8.1, Vitest 4.1.2, Stripe.js (test mode for mock payment flow)
**Storage**: SQLite via better-sqlite3 (existing Drizzle setup)
**Testing**: Vitest with Testing Library; test files colocated with source (`*.test.{ts,tsx}`)
**Target Platform**: Web (SSR via React Router 7)
**Project Type**: Web application (full-stack SSR)
**Performance Goals**: Dashboard loads < 3s; top-up/debt updates < 2s; form error feedback < 1s
**Constraints**: Existing codebase conventions (route module pattern, barrel imports, constants-first, Mantine theme, Zod schemas in `app/schemas/`); `pnpm typecheck` + `pnpm lint` + `pnpm test` must pass
**Scale/Scope**: Prototype/demo scale; single-server SQLite; ~100 concurrent users

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| #    | Principle                                    | Status  | Notes                                                                                                        |
| ---- | -------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------ |
| I    | Type Safety (NON-NEGOTIABLE)                 | ✅ PASS | TypeScript strict mode; `pnpm typecheck` enforced                                                            |
| II   | Test-First Development (NON-NEGOTIABLE)      | ✅ PASS | Vitest + Testing Library; test files next to source                                                          |
| III  | Form Validation with Zod (NON-NEGOTIABLE)    | ✅ PASS | All forms use Zod schemas in `app/schemas/` + Mantine `useForm` with `zodResolver`                           |
| IV   | Route Module Convention                      | ✅ PASS | `page.tsx` + `actions.ts` + `loader.ts` per route                                                            |
| V    | Code Quality Gates (NON-NEGOTIABLE)          | ✅ PASS | `pnpm lint` → `pnpm typecheck` → `pnpm format` → `pnpm test`                                                 |
| VI   | Mantine-First UI (NON-NEGOTIABLE)            | ✅ PASS | Mantine v9 components + CSS Modules only; theme configured in `app/theme/mantine-theme.ts`; no inline styles |
| VII  | Observability                                | ✅ PASS | Server logging via Consola; structured errors from actions                                                   |
| VIII | Constants-First Development (NON-NEGOTIABLE) | ✅ PASS | Route paths, validation rules, messages, and feature constants in `app/constants/`                           |
| IX   | Barrel Import Convention                     | ✅ PASS | Barrel imports from `~/lib/db/schema`, `~/schemas/auth`, etc.                                                |
| X    | Skill-Driven Development                     | ✅ PASS | Load `vercel-react-best-practices` skill before React/Router changes                                         |

All gates pass. No violations to justify.

## Project Structure

### Documentation (this feature)

```text
specs/002-ev-station-management/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── auth.md
│   ├── charging-session.md
│   ├── transaction.md
│   ├── vehicle.md
│   └── admin.md
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
app/
├── constants/
│   ├── routes.ts              # Route paths (existing, extend)
│   ├── validation.ts          # Validation constraints (existing, extend)
│   ├── messages.ts            # UI messages (existing, extend)
│   └── dashboard.ts           # Dashboard constants (existing, extend)
├── schemas/
│   ├── auth.ts                # Auth validation schemas (existing)
│   ├── vehicle.ts             # NEW: Vehicle CRUD validation
│   ├── transaction.ts         # NEW: Top-up/debt repayment validation
│   ├── charging-session.ts    # NEW: Charging session validation
│   ├── admin.ts               # NEW: Admin action validation
│   └── index.ts               # Barrel export
├── lib/
│   ├── db/
│   │   ├── schema/
│   │   │   ├── user.ts            # Existing (extended with role, balance, status)
│   │   │   ├── account.ts         # Existing
│   │   │   ├── session.ts         # Existing
│   │   │   ├── verification.ts    # Existing
│   │   │   ├── vehicle.ts         # NEW
│   │   │   ├── transaction.ts     # NEW
│   │   │   ├── charging-session.ts # NEW
│   │   │   ├── station.ts         # NEW
│   │   │   ├── relations.ts       # Updated with new relations
│   │   │   └── index.ts           # Barrel export (updated)
│   │   └── index.ts               # DB client (existing)
│   ├── auth.server.ts            # Existing (extended with role field exposure)
│   ├── auth-client.ts            # Existing
│   ├── auth-guards.ts            # NEW: requireAuth, requireVerified, requireAdmin
│   ├── action-utils.ts           # Existing
│   └── logger.server.ts          # Existing
├── providers/
│   └── mantine-provider.tsx      # Existing
├── theme/
│   └── mantine-theme.ts          # Existing
├── components/
│   └── app-sidebar.tsx           # NEW: Sidebar navigation for authenticated routes
├── routes/
│   ├── home/                     # Existing
│   ├── login/                    # Existing
│   ├── signup/                   # Existing
│   ├── dashboard/                # Existing (extend)
│   ├── wallet/                   # NEW: Top-up & debt repayment
│   │   ├── page.tsx
│   │   ├── loader.ts
│   │   ├── actions.ts
│   │   └── page.module.css
│   ├── charging/                 # NEW: Charging sessions
│   │   ├── page.tsx
│   │   ├── loader.ts
│   │   ├── actions.ts
│   │   └── page.module.css
│   ├── vehicles/                # NEW: Vehicle management
│   │   ├── page.tsx
│   │   ├── loader.ts
│   │   ├── actions.ts
│   │   └── page.module.css
│   ├── profile/                 # NEW: User profile
│   │   ├── page.tsx
│   │   ├── loader.ts
│   │   ├── actions.ts
│   │   └── page.module.css
│   ├── admin/                   # NEW: Admin section
│   │   ├── page.tsx
│   │   ├── loader.ts
│   │   └── page.module.css
│   │   ├── users/
│   │   │   ├── page.tsx
│   │   │   ├── loader.ts
│   │   │   └── actions.ts
│   │   └── users.$userId/
│   │       ├── page.tsx
│   │       └── loader.ts
│   └── api.auth.ts              # Existing
├── routes.ts                     # Existing (extend)
├── root.tsx                      # Existing (extend with sidebar layout)
└── app.css                       # Existing
drizzle/
├── seed.ts                       # NEW: Seed script for admin + stations
└── (existing migrations)
```

**Structure Decision**: Single monolithic React Router 7 app following existing conventions. No separate frontend/backend split needed since React Router 7 provides both SSR routes and server-side data loading in a single codebase. Authenticated routes share a sidebar layout component (`app/components/app-sidebar.tsx`) containing navigation links and a "Sign out" action.

## New Clarifications (Session 2026-04-11 #2)

These clarifications were resolved after initial planning and affect the implementation:

1. **Mock payment gateway for top-ups (FR-007)**: Top-up flow uses a mock Stripe-style payment form. User enters amount, goes through a simulated card payment form (Stripe test mode), credits are added on payment completion. Add `@stripe/stripe-js` and `stripe` as dev/test dependencies for client-side payment element rendering and server-side test mode validation.

2. **Charging session lifecycle**: Manual end only. User clicks "End Session" to complete. No server-side auto-completion timer. `SIMULATED_SESSION_DURATION` constant removed. Energy and cost calculated at session end based on actual elapsed duration and station `powerOutput`/`pricePerKwh`.

3. **Sidebar navigation with logout (FR-003b)**: All authenticated routes share a sidebar layout component with navigation links (Dashboard, Wallet, Charging, Vehicles, Profile, Admin) and a "Sign out" action. New component: `app/components/app-sidebar.tsx`.

4. **Dashboard chart filtering (FR-005)**: Uses URL query parameters (`?period=day|week|month|year`). Dashboard loader reads the `period` query param and returns aggregated data for the selected time range.

5. **Session expiry handling**: Redirect to login with a toast notification ("Session expired, please log in again"). Form state is not preserved in v1.

## Complexity Tracking

> No constitution violations to justify.
