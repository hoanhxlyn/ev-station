# EV Station Constitution

## Core Principles

### I. Type Safety (NON-NEGOTIABLE)

TypeScript strict mode is enabled; all code MUST pass type checking before commit. Run `pnpm typecheck` (React Router typegen + tsc) after every task. Never use `@ts-ignore` or `ignoreDeprecations` — fix root causes instead. This ensures runtime reliability in a full-stack SSR application where type errors can cause production failures.

### II. Test-First Development

Every feature modification MUST include tests. Use Vitest with Testing Library; place test files next to source files using `*.test.{ts,tsx}` naming. Tests validate business logic, validation rules, and authentication flows. Run `pnpm test` before finishing any task affecting business rules.

### III. Form Validation with Zod (NON-NEGOTIABLE)

All forms MUST use Zod schemas for validation. Use Mantine's `useForm` with `mode: 'uncontrolled'` and `zodResolver` for performance. Validation schemas MUST be centralized in `app/schemas/`. Never skip client-side validation even if server-side validation exists.

### IV. Route Module Convention

Every route MUST follow the `page.tsx` + `actions.ts` + `loader.ts` split pattern. Default export is the page component; named exports for meta, action, and loader. Components are named exports (PascalCase). This enforces separation of concerns between UI, server actions, and data loading.

### V. Code Quality Gates (NON-NEGOTIABLE)

Before finishing ANY task, run these checks in order: `pnpm lint` → `pnpm typecheck` → `pnpm format`. All MUST pass. This prevents quality regressions in a shared codebase. Use `pnpm lint:fix` for auto-fixable issues.

### VI. Simplicity and Minimal Edits

Keep edits minimal; preserve existing template structure unless redesign explicitly requested. Use Mantine style props (`p="md"`, `gap="lg"`) for layout/spacing instead of custom CSS. Start simple, apply YAGNI principles. Avoid organizational-only abstractions.

### VII. Observability

All server-side operations MUST log via Consola logger (`app/lib/logger.server.ts`). Use React Router's built-in `ErrorBoundary` in `root.tsx` for error handling. Structured errors MUST be returned from actions as `{ errors: { field: [...] } }`. This enables debugging in SSR environments where client DevTools are unavailable.

## Technology Stack

- **Framework**: React Router 7 (SSR mode) with TypeScript strict mode
- **UI Library**: Mantine v9 with teal primary color and `lg` default radius
- **Authentication**: Better Auth with `drizzleAdapter` and `username()` plugin; email verification required
- **Database**: Drizzle ORM over `better-sqlite3`; schema in `app/lib/db/schema/`
- **Validation**: Zod for all form and API validation
- **Styling**: CSS Modules + Mantine style props (Tailwind present but unused)
- **Testing**: Vitest with Testing Library; tests alongside source files
- **Path Alias**: `~/*` maps to `app/*`

## Development Workflow

### Pre-commit Quality Gates

1. Write/modify code
2. Run `pnpm lint:fix` to auto-fix issues
3. Run `pnpm lint` to verify
4. Run `pnpm typecheck` to verify types
5. Run `pnpm format` to format code
6. Run `pnpm test` if changing business logic
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

This constitution supersedes all other development practices. Any conflict between AGENTS.md/quickstart.md and this constitution MUST be resolved in favor of this document.

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
- Tests pass (`pnpm test`)
- New features have corresponding tests
- Route modules follow `page.tsx` + `actions.ts` + `loader.ts` convention
- Validation uses Zod schemas from `app/schemas/`

### Runtime Guidance

AGENTS.md contains detailed runtime guidance for development. This constitution establishes principles; AGENTS.md provides implementation specifics.

**Version**: 1.0.0 | **Ratified**: 2026-04-07 | **Last Amended**: 2026-04-07
