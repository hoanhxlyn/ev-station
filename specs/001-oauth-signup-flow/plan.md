# Implementation Plan: OAuth Signup Flow with Pre-filled Fields

**Branch**: `001-oauth-signup-flow` | **Date**: 2026-04-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-oauth-signup-flow/spec.md`

## Summary

Implement OAuth (GitHub) signup flow with pre-filled fields for new users and magic link email verification for manual signups. New OAuth users are created immediately without email verification; manual signup users must click a magic link (10-minute expiry) before signing in.

## Technical Context

**Language/Version**: TypeScript 5 (strict mode via React Router 7)
**Primary Dependencies**: Better Auth, Drizzle ORM, Mantine v9, Zod, react-router v7
**Storage**: SQLite via better-sqlite3 (existing Drizzle setup)
**Testing**: Vitest with Testing Library
**Target Platform**: Web (React Router 7 SSR)
**Project Type**: Web application (full-stack SSR)
**Performance Goals**: OAuth signup <30s (SC-001), returning OAuth user signin <5s (SC-002), magic link delivery <60s (SC-003)
**Constraints**: TypeScript strict mode, route module convention (page.tsx + actions.ts + loader.ts), Zod validation for all forms
**Scale/Scope**: Single-user authentication, web-only (no mobile OAuth)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                                      | Status | Notes                                                                  |
| ---------------------------------------------- | ------ | ---------------------------------------------------------------------- |
| I. Type Safety (NON-NEGOTIABLE)                | PASS   | TypeScript strict mode enabled; all code passes `pnpm typecheck`       |
| II. Test-First Development                     | PASS   | Vitest tests required for OAuth flows, magic link, signup logic        |
| III. Form Validation with Zod (NON-NEGOTIABLE) | PASS   | Manual signup form uses Zod schema from `app/schemas/auth.ts`          |
| IV. Route Module Convention                    | PASS   | OAuth callback + signup pages follow page.tsx + actions.ts + loader.ts |
| V. Code Quality Gates (NON-NEGOTIABLE)         | PASS   | lint → typecheck → format pipeline enforced                            |
| VI. Simplicity and Minimal Edits               | PASS   | Modify existing auth flow; no new abstractions                         |
| VII. Observability                             | PASS   | Consola logger used for auth events (signup, verification, errors)     |

**Gate Result**: ALL PASS — Proceed to Phase 0

### Post-Design Re-check

_Review after Phase 1 (research.md, data-model.md, quickstart.md)_

All principles remain satisfied:

- TypeScript types defined in data-model.md
- Tests specified in research.md approach
- Zod validation schemas referenced in quickstart.md
- Route module structure confirmed in project structure
- Quality gates documented in quickstart.md
- Minimal approach confirmed (modifying existing auth flow only)

**Re-check Result**: ALL PASS — Proceed to Phase 2

## Project Structure

### Documentation (this feature)

```text
specs/001-oauth-signup-flow/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - internal auth flow)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
app/
├── routes/
│   ├── api.auth.ts           # (modified) Better Auth handler
│   ├── login/
│   │   ├── page.tsx          # (modified) Add GitHub OAuth button
│   │   └── actions.ts        # (modified) OAuth callback handling
│   └── signup/
│       ├── page.tsx          # (modified) Pre-fill from OAuth, no verification email
│       ├── actions.ts        # (modified) OAuth account creation + immediate signin
│       └── loader.ts         # (modified) Check OAuth session state
├── lib/
│   ├── db/
│   │   └── schema/
│   │       ├── user.ts       # (modified) Add state field, isEmailVerified
│   │       ├── account.ts    # (modified) OAuthAccount linking
│   │       └── relations.ts  # (modified) Add relations
│   └── auth.server.ts       # (modified) OAuth check + immediate signin logic
├── schemas/
│   └── auth.ts               # (modified) Add OAuth pre-fill validation
└── test/
    └── auth.test.ts          # (new) OAuth signup, manual signup, magic link tests
```

**Structure Decision**: Web application (React Router 7 SSR) - existing structure reused with targeted modifications to authentication routes and database schema.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No complexity violations identified.
