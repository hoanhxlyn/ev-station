# Implementation Plan: Signup Form Validation Improvements

**Branch**: `003-about-signup-form` | **Date**: 2026-04-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-about-signup-form/spec.md`

## Summary

Add inline form validation errors for email/username already exists errors (replacing toast notifications) and hide password field when registering via OAuth. Changes are confined to the registration form UI and validation flow.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)  
**Primary Dependencies**: React Router 7, Mantine v9, Better Auth 1.5.6, Drizzle ORM 0.45.2, Zod 3.24.2  
**Storage**: SQLite via better-sqlite3 (existing schema unchanged)  
**Testing**: Vitest with Testing Library (unit tests mandatory per constitution)  
**Target Platform**: Web (React Router 7 SSR mode)  
**Project Type**: Full-stack web application  
**Performance Goals**: Inline validation errors display within 1 second of submission  
**Constraints**: Reuse existing validation logic; use existing constants files for messages  
**Scale/Scope**: Registration form changes only; no schema or API changes required

## Constitution Check

| Principle                     | Status  | Notes                                                            |
| ----------------------------- | ------- | ---------------------------------------------------------------- |
| I. Type Safety                | ✅ PASS | TypeScript strict mode; no @ts-ignore                            |
| II. Test-First Development    | ✅ PASS | Unit tests required for validation logic                         |
| III. Form Validation with Zod | ✅ PASS | Zod schemas in app/schemas/                                      |
| IV. Route Module Convention   | ✅ PASS | Registration form uses page.tsx + actions.ts pattern             |
| V. Code Quality Gates         | ✅ PASS | lint → typecheck → format → test                                 |
| VI. Mantine-First UI          | ✅ PASS | Use Mantine TextInput with error prop; no inline styles          |
| VII. Observability            | ✅ PASS | Structured errors from actions as `{ errors: { field: [...] } }` |
| VIII. Constants-First         | ✅ PASS | Error messages in app/constants/validation.ts                    |
| IX. Barrel Import Convention  | ✅ PASS | Import from ~/schemas/auth                                       |
| X. Skill-Driven Development   | ✅ PASS | Load vercel-react-best-practices for React Router 7 patterns     |

## Project Structure

### Documentation (this feature)

```text
specs/003-about-signup-form/
├── plan.md              # This file
├── research.md          # Not needed - no unknowns
├── data-model.md        # Not needed - no entity changes
├── quickstart.md        # Not needed - UI-only changes
├── contracts/           # Not needed - no external interfaces
└── tasks.md             # Created by /speckit.tasks
```

### Source Code (repository root)

```text
app/
├── routes/
│   └── auth/
│       └── register.tsx        # Registration form page (modify)
│       └── register.actions.ts # Registration actions (modify error format)
├── schemas/
│   └── auth/
│       └── index.ts            # Barrel export for auth schemas
│       └── register-schema.ts   # Zod schema for registration
├── constants/
│   └── validation.ts           # Error messages for validation
└── lib/
    └── logger.server.ts        # Server-side logging
```

**Structure Decision**: Single project structure with modifications to existing registration route module. No new projects, packages, or external interfaces required.

## Complexity Tracking

> No constitution violations requiring justification.

## Phase 0: Research

**Status**: Not required - all unknowns resolved in spec.

No NEEDS CLARIFICATION markers in the specification. The feature is a UI modification that:

- Reuses existing email/username uniqueness validation (already implemented)
- Hides password field based on OAuth registration context (already available)
- Replaces toast errors with inline field errors in the form component

## Phase 1: Design

### Data Model

No changes required - User and RegistrationAttempt entities are unchanged.

### Interface Contracts

No external interfaces added or modified - this is a UI change within existing form.

### Key Changes

1. **Registration Form (register.tsx)**:
   - Add inline error display using Mantine's `TextInput` with `error` prop
   - Conditionally hide password field when OAuth registration detected
   - Clear field errors on user input

2. **Registration Actions (register.actions.ts)**:
   - Return structured errors in `{ errors: { field: [...] } }` format per constitution
   - Ensure email/username exists errors use field-specific keys

3. **Validation Constants (app/constants/validation.ts)**:
   - Add error constants for inline display if not already present

4. **Register Schema (app/schemas/auth/register-schema.ts)**:
   - Ensure Zod schema supports field-level error returns

## Phase 2 Planning

Deferred to /speckit.tasks command.
