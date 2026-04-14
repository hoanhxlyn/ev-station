# ev-station Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-04-12

## Active Technologies

- TypeScript 5.x (strict mode) + React Router 7, Mantine v9, Better Auth 1.5.6, Drizzle ORM 0.45.2, Zod 3.24.2 (003-about-signup-form)
- SQLite via better-sqlite3 (existing schema unchanged) (003-about-signup-form)

- TypeScript 5.x (strict mode) + React Router 7.13.2, Mantine v9, Better Auth 1.5.6, Drizzle ORM 0.45.2, Zod 3.24.2, Recharts 3.8.1, Vitest 4.1.2, Stripe.js (test mode for mock payment flow) (002-ev-station-management)
- SQLite via better-sqlite3 (existing Drizzle setup) (002-ev-station-management)

## Project Structure

```text
app/
  constants/
  lib/
  providers/
  routes/
  schemas/
  test/
  theme/
  app.css
  root.module.css
  root.tsx
  routes.ts
```

## Commands

pnpm dev; pnpm build; pnpm test; pnpm lint; pnpm typecheck; pnpm format

## Code Style

TypeScript 5.x (strict mode): Follow standard conventions

## Recent Changes

- 003-about-signup-form: Added TypeScript 5.x (strict mode) + React Router 7, Mantine v9, Better Auth 1.5.6, Drizzle ORM 0.45.2, Zod 3.24.2

- 002-ev-station-management: Added TypeScript 5.x (strict mode) + React Router 7.13.2, Mantine v9, Better Auth 1.5.6, Drizzle ORM 0.45.2, Zod 3.24.2, Recharts 3.8.1, Vitest 4.1.2, Stripe.js (test mode for mock payment flow)

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
