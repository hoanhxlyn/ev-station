# Quickstart: EV Station Management System

**Branch**: `002-ev-station-management`
**Date**: 2026-04-11

## Prerequisites

- Node.js 20+
- pnpm 9+
- SQLite3 (bundled via better-sqlite3)

## Setup

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env
# Edit .env with your values (see Environment Variables below)

# Initialize database schema
pnpm db:generate
pnpm db:migrate

# Seed admin account and station data
pnpm db:seed

# Start development server
pnpm dev
```

## Environment Variables

| Variable               | Required | Description                                       |
| ---------------------- | -------- | ------------------------------------------------- |
| `BETTER_AUTH_URL`      | Yes      | Base URL for auth (e.g., `http://localhost:5173`) |
| `GITHUB_CLIENT_ID`     | Yes      | GitHub OAuth app client ID                        |
| `GITHUB_CLIENT_SECRET` | Yes      | GitHub OAuth app client secret                    |
| `STRIPE_PUBLIC_KEY`    | Yes      | Stripe publishable key (test mode)                |
| `STRIPE_SECRET_KEY`    | Yes      | Stripe secret key (test mode)                     |
| `DATABASE_URL`         | No       | SQLite path (defaults to `./data/db.sqlite`)      |

## Development Workflow

```bash
# Start dev server (React Router + Drizzle Studio)
pnpm dev

# Type checking
pnpm typecheck

# Linting and formatting
pnpm lint
pnpm lint:fix
pnpm format

# Run tests
pnpm test
pnpm test:watch

# Database changes (quick dev)
pnpm db:push

# Database changes (tracked migrations)
pnpm db:generate
```

## Key Routes

| Path                   | Description                                        |
| ---------------------- | -------------------------------------------------- |
| `/`                    | Home page                                          |
| `/login`               | Login (email/password + GitHub OAuth)              |
| `/signup`              | Registration (email verification required)         |
| `/signup/check-email`  | Post-registration verification notice              |
| `/app` or `/dashboard` | User dashboard (balance, charging history, charts) |
| `/wallet`              | Top-up credits and debt repayment                  |
| `/charging`            | Start/end charging sessions                        |
| `/vehicles`            | Vehicle management (CRUD)                          |
| `/profile`             | Profile editing                                    |
| `/admin`               | Admin dashboard (KPIs, cash flow)                  |
| `/admin/users`         | Admin user management                              |
| `/admin/users/:userId` | Admin user detail                                  |

## Architecture Notes

- **Framework**: React Router 7 (SSR mode) with TypeScript strict mode
- **Auth**: Better Auth with email verification, GitHub OAuth, role-based access
- **Payments**: Stripe test mode for mock payment flow (top-ups)
- **Database**: Drizzle ORM over better-sqlite3
- **UI**: Mantine v9 with teal theme, CSS Modules for custom styles, AppShell sidebar layout
- **Validation**: Zod schemas in `app/schemas/`, integrated with Mantine Form
- **Constants**: All magic values in `app/constants/` (routes, validation, messages, dashboard)
- **Imports**: Use barrel imports (`~/lib/db/schema`, `~/schemas/auth`, etc.)

## Constitution Compliance

Before every commit, run:

```bash
pnpm lint:fix && pnpm lint && pnpm typecheck && pnpm format && pnpm test
```

All gates must pass. See `.specify/memory/constitution.md` for full principles.
