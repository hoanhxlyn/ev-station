# AGENTS.md - EV Station Project Guidelines

## Overview

EV Station is a React Router 7 (SSR) application with Mantine v9 UI, Better Auth for authentication, Drizzle ORM over SQLite, and TypeScript strict mode. Zod validates all forms; route modules follow a `page.tsx` + `actions.ts` + `loader.ts` split.

---

## Build Commands

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server (react-router-serve)

# Testing
pnpm test             # Run tests once
pnpm test:watch       # Run tests in watch mode

# Type checking
pnpm typecheck        # Run React Router typegen + tsc

# Code quality
pnpm format           # Format code with oxfmt
pnpm format:check     # Check formatting without modifying
pnpm lint             # Run oxlint linter
pnpm lint:fix         # Fix linting issues automatically
pnpm spell            # Run cspell for spell checking

# Database (Drizzle)
pnpm db:generate      # Generate SQL migration files → /drizzle/
pnpm db:push          # Apply schema changes to dev database directly
pnpm db:studio        # Open Drizzle Studio (browser DB viewer)

# Release
pnpm release          # Semantic release (conventional commits → CHANGELOG + tag)

# Pre-commit hooks (runs automatically via lefthook)
pnpm prepare          # Install lefthook hooks
```

---

## Project Structure

```
app/
├── routes/
│   ├── api.auth.ts           # Better Auth handler (/api/auth/*)
│   ├── home.tsx              # Home route (/)
│   ├── login/
│   │   ├── page.tsx          # Login route (exports meta, action)
│   │   ├── actions.ts        # Server-side actions
│   │   ├── left-panel.tsx    # Login left panel component
│   │   ├── right-panel.tsx   # Login right panel component
│   │   └── page.module.css   # Route-specific styles
│   ├── signup/
│   │   ├── page.tsx          # Signup route (exports meta, action)
│   │   ├── actions.ts        # Server-side actions
│   │   ├── signup-panel.tsx  # Signup form component
│   │   ├── check-email.tsx   # Email verification confirmation (/signup/check-email)
│   │   └── page.module.css
│   └── dashboard/
│       ├── page.tsx          # Protected dashboard (/app)
│       ├── loader.ts         # Auth check → redirects to /login if unauthenticated
│       └── page.module.css
├── lib/
│   ├── db/
│   │   ├── index.ts          # Drizzle ORM instance (better-sqlite3)
│   │   └── schema/
│   │       ├── index.ts      # Barrel export
│   │       ├── user.ts       # user table
│   │       ├── account.ts    # account table (OAuth tokens, password)
│   │       ├── session.ts    # session table
│   │       ├── verification.ts # email verification tokens
│   │       └── relations.ts  # Drizzle relations (no circular deps)
│   ├── auth.server.ts        # Better Auth server config (email, GitHub OAuth, username plugin)
│   ├── auth-client.ts        # Better Auth client config
│   ├── logger.server.ts      # Consola logger
│   └── action-utils.ts       # Toast/redirect helpers (remix-toast)
├── schemas/
│   └── auth.ts               # Zod validation schemas
├── constants/
│   ├── messages.ts           # Centralized user-facing strings
│   ├── validation.ts         # Validation rules & error messages
│   ├── routes.ts             # Route path constants (ROUTES object)
│   └── dashboard.ts          # Dashboard mock data & messages
├── providers/
│   └── mantine-provider.tsx  # MantineProvider + DatesProvider + Notifications
├── theme/
│   └── mantine-theme.ts      # Global Mantine theme config
├── test/
│   └── setup.ts              # Vitest setup (jest-dom, ResizeObserver, matchMedia mocks)
├── root.tsx                  # Root layout + ErrorBoundary + toast handler
├── routes.ts                 # Route configuration
└── app.css                   # Global styles
```

---

## TypeScript Configuration

- **Strict mode**: Enabled (`strict: true`)
- **Module resolution**: `bundler`
- **JSX**: `react-jsx`
- **Path alias**: `~/*` maps to `app/*`
- **Types**: Auto-generated in `.react-router/types/`

Always run `pnpm typecheck` before finishing any task.

---

## React Router Patterns

### Route Modules
Each route directory contains:
- `page.tsx` - Default export is the page component, exports `meta()` and `action`
- `actions.ts` - Server-side actions (optional)
- `loader.ts` - Server-side data loading / auth guards (optional)
- Components are named exports (e.g., `LoginLeftPanel`)

### Loader Types
Use `Route.LoaderArgs` for loaders; auth guard pattern used in dashboard:

```typescript
import type { Route } from './+types/page'
import { auth } from '~/lib/auth.server'
import { redirect } from 'react-router'

export async function loader({ request }: Route.LoaderArgs) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) throw redirect('/login')
  return { user: session.user }
}
```

### Action Types
Use `Route.ActionArgs` from the auto-generated types:

```typescript
import type { Route } from './+types/page'

export async function loginAction({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  // ...
}
```

### Using Actions in Components
Use `fetcher.Form` for forms that don't navigate:

```typescript
import { useFetcher } from 'react-router'

const fetcher = useFetcher()
<fetcher.Form method="post">...</fetcher.Form>
```

---

## Mantine UI Guidelines

### Form Handling
- Use `useForm` with `mode: 'uncontrolled'` for performance
- Use `zodResolver` from `@mantine/form` to connect Zod schemas

```typescript
import { useForm } from '@mantine/form'
import { zodResolver } from 'mantine-form-zod-resolver'
import { loginSchema } from '~/schemas/auth'

const form = useForm({
  mode: 'uncontrolled',
  initialValues: { accountName: '', password: '', remember: false },
  zodResolver: zodResolver(loginSchema),
})
```

### Provider Architecture
- `app/providers/mantine-provider.tsx` — `MantineAppProvider` wrapping children; also mounts `DatesProvider`
- `app/theme/mantine-theme.ts` — global theme config: teal primary color, `lg` default radius, `"Roboto Variable", sans-serif` typography
- `app/root.tsx` — document shell only: `mantineHtmlProps`, `ColorSchemeScript`, font import (`@fontsource-variable/roboto/wght.css`), dayjs plugin init

### Styling Approach
- **CSS Modules** via `className`/`classNames` for static styles
- **Mantine style props** (e.g., `p="md"`, `gap="lg"`) for layout/spacing
- **Inline `style`** only for truly dynamic values
- **Mantine theme** for component defaults (avoid repeating `size`, `radius`)

### Color Usage
- Use Mantine's built-in color system with opacity variants: `c="white.7"`, `c="dimmed"`
- Avoid hardcoded rgba values - they don't adapt to dark mode
- Configure global defaults in `app/theme/mantine-theme.ts`

---

## Code Style

### Imports
- Prefer direct imports over barrel files
- Use path alias `~/*` for app imports: `import { loginSchema } from '~/schemas/auth'`
- Order imports: React → external libs → app imports → styles

### Naming Conventions
- **Components**: PascalCase (e.g., `LoginLeftPanel`)
- **Functions**: camelCase (e.g., `loginAction`)
- **Constants**: UPPER_SNAKE_CASE for config objects (e.g., `LOGIN_MESSAGES`)
- **Files**: kebab-case (e.g., `left-panel.tsx`)

### Validation & Messages
- Centralize validation schemas in `app/schemas/`
- Centralize user-facing messages in `app/constants/messages.ts`
- Use Zod for all form validation

### Error Handling
- Use React Router's built-in `ErrorBoundary` in `root.tsx`
- Return structured errors from actions: `{ errors: { field: [...] } }`
- Use `isRouteErrorResponse` for route-specific errors

---

## Database & Drizzle

- **ORM**: Drizzle over `better-sqlite3`; schema lives in `app/lib/db/schema/`
- **Schema path** in `drizzle.config.ts`: `./app/lib/db/schema/index.ts`
- **Migrations folder**: `/drizzle/` — run `pnpm db:generate` to create it
- Use `pnpm db:push` for quick dev changes (no migration file); use `pnpm db:generate` for tracked migrations
- Import tables directly from sub-files or the barrel: `import { user } from '~/lib/db/schema'`
- **Relations** are isolated in `relations.ts` to prevent circular import issues

---

## Authentication (Better Auth)

- **Library**: `better-auth` with `drizzleAdapter` and `username()` plugin
- **Server config**: `app/lib/auth.server.ts` — email/password + GitHub OAuth; requires email verification
- **Client config**: `app/lib/auth-client.ts` — use in client components for auth state
- **Auth API route**: `app/routes/api.auth.ts` handles all `/api/auth/*` requests
- **Env vars required** (see `.env.example`):
  - `BETTER_AUTH_SECRET` — at least 32 chars (generate: `openssl rand -base64 32`)
  - `BETTER_AUTH_URL` — callback URL (default: `http://localhost:5173`)
  - `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` — GitHub OAuth
  - `DATABASE_URL` — SQLite path (default: `./dev.db`)
- **Email verification**: Currently logs to console only — production needs an email provider

---

## Gotchas & Pitfalls

- **`/drizzle/` folder doesn't exist** until you run `pnpm db:generate` for the first time
- **Email verification emails are console-logged** in dev — check terminal output, not inbox
- **Tailwind CSS is installed** (`tailwindcss@^4`) but not actively used — use Mantine style props instead
- **`app/routes/home/`** folder exists but is empty — reserved, don't add files without a route entry in `routes.ts`
- **`isNew` user flag** is set to `false` on first email verification (handled in `auth.server.ts` `sendVerificationEmail` callback) — don't reset it manually

---

## Best Practices

1. **Run typecheck and lint before finishing any task**
2. **Run tests when modifying validation logic or business rules**
3. **Run `pnpm build` when changes could affect runtime bundling or route loading**
4. **Keep edits minimal** - preserve existing template structure unless redesign requested
5. **Use functional components** with simple module-level helpers
6. **Export route helpers as named exports** (e.g., `export { loginAction as action }`)
7. **Avoid magic strings** - use constants from `app/constants/messages.ts`
8. **Configure component defaults globally** in Mantine theme to avoid repetition
9. **Never use `@ts-ignore` or `ignoreDeprecations`** - fix the root cause instead
10. **Always prefer Serena tools over CLI commands** for code exploration, reading, editing, and searching. Use Serena's symbolic tools (`find_symbol`, `get_symbols_overview`, `replace_symbol_body`, `insert_after_symbol`, `search_for_pattern`, `list_dir`, `find_file`) instead of terminal commands like `grep`, `find`, `rg`, `cat`, `sed`, etc. Only use CLI for package management (`pnpm`), build/test/lint commands, and git operations.

---

## Testing

- **Framework**: Vitest with Testing Library
- **Test location**: `app/**/*.test.{ts,tsx}`
- **Setup file**: `app/test/setup.ts`
- **Run tests**: `pnpm test` or `pnpm test:watch`

### Test File Naming
- Place test files next to the source file: `auth.ts` → `auth.test.ts`
- Use `describe` blocks to organize test suites
- Test edge cases and validation logic thoroughly

---

## Vercel React Best Practices

- Always load the `vercel-react-best-practices` skill before making React/Next.js changes
- **Derive state during render** - do not use `useEffect` to set state from prop/data changes
- Use `validateInputOnBlur: true` with Mantine `useForm` for form validation
- Follow `rerender-*` rules to minimize unnecessary re-renders
