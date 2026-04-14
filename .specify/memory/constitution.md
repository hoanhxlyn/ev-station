<!--
Sync Impact Report
==================
Version change: 1.0.0 → 1.1.0
Bump rationale: MINOR — new principles added (VIII, IX, X) and one
  principle materially expanded (VI renamed from "Simplicity and Minimal
  Edits" to "Mantine-First UI" with comprehensive new rules). Principle II
  strengthened to NON-NEGOTIABLE. No backward-incompatible removals.

Modified principles:
  - II. Test-First Development → II. Test-First Development (NON-NEGOTIABLE)
    (strengthened: unit tests now explicitly mandatory)
  - VI. Simplicity and Minimal Edits → VI. Mantine-First UI (NON-NEGOTIABLE)
    (restructured and expanded with three absolute sub-rules)

Added principles:
  - VIII. Constants-First Development (NON-NEGOTIABLE)
  - IX. Barrel Import Convention
  - X. Skill-Driven Development

Removed principles: None

Sections updated:
  - Technology Stack (styling and testing descriptions)
  - Development Workflow / Pre-commit Quality Gates (test emphasis)
  - Compliance Review (6 new verification items)

Templates requiring updates:
  - .specify/templates/plan-template.md ✅ (no changes needed — Constitution Check is generic)
  - .specify/templates/spec-template.md ✅ (no changes needed)
  - .specify/templates/tasks-template.md ✅ (no changes needed)
  - .specify/templates/agent-file-template.md ✅ (no changes needed)
  - .specify/templates/checklist-template.md ✅ (no changes needed)

Follow-up TODOs: None
-->

# EV Station Constitution

## Core Principles

### I. Type Safety (NON-NEGOTIABLE)

TypeScript strict mode is enabled; all code MUST pass type checking
before commit. Run `pnpm typecheck` (React Router typegen + tsc) after
every task. Never use `@ts-ignore` or `ignoreDeprecations` — fix root
causes instead. This ensures runtime reliability in a full-stack SSR
application where type errors can cause production failures.

### II. Test-First Development (NON-NEGOTIABLE)

Every feature modification MUST include unit tests. Use Vitest with
Testing Library; place test files next to source files using
`*.test.{ts,tsx}` naming. Tests validate business logic, validation
rules, and authentication flows. Run `pnpm test` before finishing any
task. No feature is complete without passing unit tests.

### III. Form Validation with Zod (NON-NEGOTIABLE)

All forms MUST use Zod schemas for validation. Use Mantine's `useForm`
with `mode: 'uncontrolled'` and `zodResolver` for performance.
Validation schemas MUST be centralized in `app/schemas/`. Never skip
client-side validation even if server-side validation exists.

### IV. Route Module Convention

Every route MUST follow the `page.tsx` + `actions.ts` + `loader.ts`
split pattern. Default export is the page component; named exports for
meta, action, and loader. Components are named exports (PascalCase).
This enforces separation of concerns between UI, server actions, and
data loading.

### V. Code Quality Gates (NON-NEGOTIABLE)

Before finishing ANY task, run these checks in order:
`pnpm lint` → `pnpm typecheck` → `pnpm format`. All MUST pass. This
prevents quality regressions in a shared codebase. Use `pnpm lint:fix`
for auto-fixable issues.

### VI. Mantine-First UI (NON-NEGOTIABLE)

All UI MUST be built with Mantine v9 components combined with CSS
Modules for styling. The following rules are absolute:

1. **Theme Configuration**: Mantine theme MUST be configured in
   `app/theme/mantine-theme.ts` to set default `size`, `radius`, and
   other shared props. Never repeat the same `size` or `radius` prop
   across multiple components — configure them globally in the theme
   instead.

2. **Style Priority**: Mantine style props (`p`, `gap`, `m`, `bg`,
   etc.) MUST be used first for layout and spacing. CSS Modules
   (`*.module.css`) are used for styles that cannot be expressed through
   Mantine props. Inline JSX `style` attributes are PROHIBITED.

3. **Component-First**: Always use Mantine components over custom HTML
   elements. If Mantine provides a component for the UI pattern, use
   it. Only create custom components when no Mantine equivalent exists.

This ensures visual consistency across the application and reduces
style duplication.

### VII. Observability

All server-side operations MUST log via Consola logger
(`app/lib/logger.server.ts`). Use React Router's built-in
`ErrorBoundary` in `root.tsx` for error handling. Structured errors
MUST be returned from actions as
`{ errors: { field: [...] } }`. This enables debugging in SSR
environments where client DevTools are unavailable.

### VIII. Constants-First Development (NON-NEGOTIABLE)

Magic numbers and hardcoded strings are PROHIBITED. All reusable
values MUST be defined in the appropriate constants file:

- User-facing messages → `app/constants/messages.ts`
- Validation rules and error messages → `app/constants/validation.ts`
- Route paths → `app/constants/routes.ts`
- Feature-specific constants → dedicated file in `app/constants/`

Never embed raw numbers, color values, or string literals directly in
component or logic code. Always reference a named constant. This
ensures single-source-of-truth for configuration and enables global
changes from one location.

### IX. Barrel Import Convention

Use barrel (index) imports instead of direct file imports. Import from
`~/lib/db/schema` rather than `~/lib/db/schema/user`. Import from
`~/schemas/auth` rather than `~/schemas/auth/login-schema`. This
reduces import coupling to internal file structure and simplifies
refactoring. Barrel files MUST be kept up-to-date when adding new
exports.

### X. Skill-Driven Development

Before making React/Router/SSR changes, the
`vercel-react-best-practices` skill MUST be loaded and followed. This
ensures adherence to proven patterns for React Router 7, including
deriving state during render (no useEffect for prop-derived state) and
using `validateInputOnBlur: true` with Mantine `useForm`. Other
applicable skills MUST be consulted when available.

## Technology Stack

- **Framework**: React Router 7 (SSR mode) with TypeScript strict mode
- **UI Library**: Mantine v9 with teal primary color and `lg` default radius
- **Authentication**: Better Auth with `drizzleAdapter` and `username()` plugin; email verification required
- **Database**: Drizzle ORM over `better-sqlite3`; schema in `app/lib/db/schema/`
- **Validation**: Zod for all form and API validation
- **Styling**: Mantine style props first, then CSS Modules. Inline JSX styles PROHIBITED. Tailwind present but unused.
- **Testing**: Vitest with Testing Library; unit tests MANDATORY; tests alongside source files
- **Path Alias**: `~/*` maps to `app/*`

## Development Workflow

### Pre-commit Quality Gates

1. Write/modify code
2. Run `pnpm lint:fix` to auto-fix issues
3. Run `pnpm lint` to verify
4. Run `pnpm typecheck` to verify types
5. Run `pnpm format` to format code
6. Run `pnpm test` for every code change (unit tests are mandatory)
7. Commit

### Route Development Pattern

1. Create loader for data fetching + auth guard
2. Create action for mutations
3. Create page component with fetcher.Form for non-navigating forms
4. Use Route.LoaderArgs and Route.ActionArgs types from auto-generated `.react-router/types/`
5. Export meta, action, and loader as named exports

### Database Changes

- Quick dev changes: `pnpm db:push` (no migration file)
- Tracked changes: `pnpm db:generate` (creates migration in `/drizzle/`)
- Schema lives in `app/lib/db/schema/` with relations isolated in `relations.ts`

## Governance

### Constitution Authority

This constitution supersedes all other development practices. Any
conflict between AGENTS.md/quickstart.md and this constitution MUST be
resolved in favor of this document.

### Amendment Procedure

1. Propose change with rationale and affected sections
2. Update `CONSTITUTION_VERSION` following semantic versioning:
   - MAJOR: Backward-incompatible governance removals or redefinitions
   - MINOR: New principles or materially expanded guidance
   - PATCH: Clarifications, wording, typo fixes
3. Update `LAST_AMENDED_DATE` to ISO format (YYYY-MM-DD)
4. Update all templates and guidance docs to reflect changes
5. Announce changes in project communication channel

### Compliance Review

All pull requests and reviews MUST verify:

- TypeScript compiles without errors (`pnpm typecheck`)
- Linting passes (`pnpm lint`)
- Tests pass (`pnpm test`) — unit tests are mandatory
- New features have corresponding unit tests
- Route modules follow `page.tsx` + `actions.ts` + `loader.ts` convention
- Validation uses Zod schemas from `app/schemas/`
- UI uses Mantine components (no custom HTML where Mantine exists)
- No inline JSX styles are present
- No magic numbers or hardcoded strings — use constants files
- Imports use barrel files, not direct file paths
- Mantine theme defaults are configured, not repeated per-component

### Runtime Guidance

AGENTS.md contains detailed runtime guidance for development. This
constitution establishes principles; AGENTS.md provides implementation
specifics. When available, skills like `vercel-react-best-practices`
MUST be loaded before making framework-specific changes.

**Version**: 1.1.0 | **Ratified**: 2026-04-07 | **Last Amended**: 2026-04-11
