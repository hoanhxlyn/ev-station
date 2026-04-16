# EV Station Management System

A full-stack EV charging station management application with user authentication, payment processing, and admin dashboards.

## Quickstart

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

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

## Commands

| Command           | Description                    |
| ----------------- | ------------------------------ |
| `pnpm dev`        | Start dev server              |
| `pnpm build`      | Production build              |
| `pnpm test`       | Run tests                     |
| `pnpm lint`       | Lint code                     |
| `pnpm typecheck`  | Type check                    |
| `pnpm format`     | Format code                   |
| `pnpm db:generate` | Generate database migration files |
| `pnpm db:migrate`  | Run database migrations           |
| `pnpm db:push`    | Push database schema (dev only)   |
| `pnpm db:seed`    | Seed database with test data     |
| `pnpm db:studio`  | Open Drizzle Studio              |

## Key Routes

| Path                   | Description                                        |
| ---------------------- | -------------------------------------------------- |
| `/`                    | Home page                                          |
| `/login`               | Login (email/password + GitHub OAuth)              |
| `/signup`              | Registration                                       |
| `/dashboard`           | User dashboard (balance, charging history)        |
| `/wallet`              | Top-up credits                                     |
| `/charging`            | Start/end charging sessions                        |
| `/vehicles`            | Vehicle management                                 |
| `/admin`               | Admin dashboard (KPIs, cash flow)                  |
| `/admin/users`         | Admin user management                              |

## Tech Stack

- **Framework**: React Router 7 (SSR) + TypeScript
- **UI**: Mantine v9
- **Auth**: Better Auth (email + GitHub OAuth)
- **Database**: Drizzle ORM + SQLite (better-sqlite3)
- **Validation**: Zod
- **Charts**: Recharts
- **Testing**: Vitest

## Learn More

See [specs/002-ev-station-management/quickstart.md](specs/002-ev-station-management/quickstart.md) for full setup details.