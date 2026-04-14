# EV Station Codebase Guide

## Project Overview

EV Station is a React Router 7 application for managing EV charging sessions. It uses:

- **React Router 7** (file-based routing with route config)
- **Mantine v9** for UI components
- **Better Auth 1.5.6** for authentication
- **Drizzle ORM 0.45.2** with SQLite (better-sqlite3)
- **Zod 3.24.2** for validation
- **Vitest 4.1.2** for testing
- **Recharts 3.8.1** for data visualization

## Directory Structure

```
app/
├── components/          # Shared React components
│   ├── app-layout.tsx  # Layout with sidebar (used in routes.ts)
│   └── app-sidebar.tsx  # Navigation sidebar
├── constants/          # Application constants
│   ├── messages.ts     # UI messages and notifications
│   ├── routes.ts       # Route path constants
│   └── validation.ts   # Validation constraints and messages
├── lib/                # Utilities and server-side code
│   ├── auth.server.ts  # Better Auth configuration
│   ├── auth-guards.ts  # requireAuth, requireVerified, requireAdmin
│   ├── auth-client.ts  # Client-side auth
│   ├── action-utils.ts # redirectSuccess/Fail, respondSuccess/Fail
│   ├── format-utils.ts # formatCurrency, formatDate helpers
│   ├── logger.server.ts
│   ├── stripe.server.ts
│   └── db/
│       ├── index.ts    # Database connection
│       └── schema/     # Drizzle schema tables
├── providers/          # React context providers
│   └── mantine-provider.tsx
├── routes/             # Route components and actions
│   ├── home/
│   ├── login/
│   ├── signup/
│   ├── dashboard/
│   ├── wallet/
│   ├── charging/
│   ├── vehicles/
│   ├── profile/
│   └── admin/
├── schemas/            # Zod validation schemas
│   ├── auth.ts
│   ├── vehicle.ts
│   ├── transaction.ts
│   └── ...
├── test/
│   └── setup.ts        # Vitest setup with jest-dom
├── root.tsx            # Root component
└── routes.ts           # Route configuration
```

## Route System

Routes are defined in `app/routes.ts` using React Router 7's route config:

```typescript
import {
  type RouteConfig,
  index,
  route,
  layout,
} from '@react-router/dev/routes'

export default [
  index('routes/home/page.tsx'),
  route('login', 'routes/login/page.tsx'),
  layout('components/app-layout.tsx', [
    route('app', 'routes/dashboard/page.tsx'),
    // ... protected routes
  ]),
] satisfies RouteConfig
```

### Route Pattern

Each route folder typically contains:

- `page.tsx` - Main route component (default export)
- `page.module.css` - Route-specific styles
- `loader.ts` - Data loading function (export { loader })
- `actions.ts` - Form actions (export { actionName as action })
- `__test__/` - Test files (new convention)
- `*.test.ts` - Legacy test files at route root

## Creating a New Screen

### 1. Create Route Files

Create a new folder under `app/routes/` (e.g., `new-screen/`):

```
app/routes/new-screen/
├── page.tsx           # Route component
├── page.module.css    # Styles
├── loader.ts          # Data loader (optional)
├── actions.ts         # Form actions (optional)
└── __test__/
    └── page.test.tsx  # Tests (new convention)
```

### 2. Define the Route Component

```typescript
import { Box, Container } from '@mantine/core'
import type { Route } from './+types/page'

// Export loader if you need server-side data
export { myLoader as loader } from './loader'

// Meta function for SEO
export function meta() {
  return [
    { title: 'EV Station | New Screen' },
    { name: 'description', content: 'Description here' },
  ]
}

// Main component
export default function NewScreen({ loaderData }: Route.ComponentProps) {
  return (
    <Box>
      <Container size="xl">
        {/* Your content */}
      </Container>
    </Box>
  )
}
```

### 3. Register the Route

Add to `app/routes.ts`:

```typescript
route('new-screen', 'routes/new-screen/page.tsx'),
```

Or inside the layout for protected routes:

```typescript
layout('components/app-layout.tsx', [
  route('app', 'routes/dashboard/page.tsx'),
  route('new-screen', 'routes/new-screen/page.tsx'), // Protected
])
```

### 4. Create a Loader

```typescript
import { requireVerified } from '~/lib/auth-guards'
import { db } from '~/lib/db'
import { someTable } from '~/lib/db/schema'
import type { Route } from './+types/page'

export async function myLoader({ request }: Route.LoaderArgs) {
  const session = await requireVerified(request)

  const data = await db.query.someTable.findMany({
    where: eq(someTable.userId, session.user.id),
  })

  return { data }
}
```

### 5. Create Actions

```typescript
import { redirectSuccess, redirectFail } from '~/lib/action-utils'
import { requireVerified } from '~/lib/auth-guards'
import { ROUTES } from '~/constants/routes'
import type { Route } from './+types/page'

export async function myAction({ request }: Route.ActionArgs) {
  const session = await requireVerified(request)
  const formData = await request.formData()

  // Validate with Zod schema
  const result = mySchema.safeParse(Object.fromEntries(formData))
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  // Process action...
  return redirectSuccess(ROUTES.NEW_SCREEN, 'Success message')
}
```

## Creating Utils/Functions

### Server Utilities

Add to `app/lib/` (e.g., `app/lib/my-utils.ts`):

```typescript
export function myUtility(input: string): string {
  return input.trim()
}
```

### Client Utilities

Add to `app/lib/` with `.client.ts` suffix (e.g., `app/lib/my-utils.client.ts`):

```typescript
export function clientUtility() {
  // Client-only code
}
```

### Format Utilities

For formatting functions, add to `app/lib/format-utils.ts`:

```typescript
export function formatCurrency(amount: number, divisor: number): string {
  return (amount / divisor).toFixed(2)
}
```

## Creating Zod Schemas

Add to `app/schemas/` (e.g., `app/schemas/my-entity.ts`):

```typescript
import { z } from 'zod'
import {
  VALIDATION_CONSTRAINTS,
  VALIDATION_MESSAGES,
} from '~/constants/validation'

export const myEntitySchema = z.object({
  field1: z.string().min(VALIDATION_CONSTRAINTS.MIN, VALIDATION_MESSAGES.ERROR),
  field2: z.number().positive(),
})

export type MyEntityValues = z.infer<typeof myEntitySchema>
```

## Creating Components

Create in `app/components/` (e.g., `app/components/my-component.tsx`):

```typescript
import { Box } from '@mantine/core'
import type { ReactNode } from 'react'

interface MyComponentProps {
  children: ReactNode
  title?: string
}

export function MyComponent({ children, title }: MyComponentProps) {
  return (
    <Box>
      {title && <h2>{title}</h2>}
      {children}
    </Box>
  )
}
```

## Creating Constants

### Route Constants

Update `app/constants/routes.ts`:

```typescript
export const ROUTES = {
  // ... existing routes
  NEW_SCREEN: '/new-screen',
} as const
```

### Message Constants

Update `app/constants/messages.ts`:

```typescript
export const NEW_SCREEN_MESSAGES = {
  SUCCESS: 'Operation successful',
  ERROR: 'Operation failed',
} as const
```

### Validation Constants

Update `app/constants/validation.ts`:

```typescript
export const VALIDATION_CONSTRAINTS = {
  // ... existing
  NEW_CONSTRAINT: 100,
} as const

export const VALIDATION_MESSAGES = {
  // ... existing
  NEW_ERROR: 'Error message',
} as const
```

## Database Schema

Schema files are in `app/lib/db/schema/`:

```typescript
// app/lib/db/schema/my-table.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const myTable = sqliteTable('my_table', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }),
})
```

Export from `app/lib/db/schema/index.ts`:

```typescript
export * from './my-table'
```

## Authentication Guards

Located in `app/lib/auth-guards.ts`:

```typescript
import { requireAuth }     // Redirects to login if not authenticated
import { requireVerified }  // Requires email verification
import { requireAdmin }    // Requires admin role
```

Use in loaders/actions:

```typescript
export async function myLoader({ request }: Route.LoaderArgs) {
  const session = await requireVerified(request)
  // session.user is guaranteed to exist and be verified
}
```

## Testing

### Test Setup

Tests use Vitest with jsdom environment. Setup is in `app/test/setup.ts`.

### Test Location

**New convention**: Tests go in `__test__` folder within the route folder:

```
app/routes/my-route/__test__/
├── loader.test.ts
├── actions.test.ts
└── page.test.tsx
```

**Legacy convention**: Tests at route root (still exist, needs refactor):

```
app/routes/my-route/
├── actions.test.ts  # Legacy - should be moved to __test__/
```

### Writing Tests

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock dependencies
vi.mock('~/lib/db', () => ({
  db: mockDb,
}))

// Dynamic import for mocks to apply
const { myAction } = await import('./actions')

describe('myAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does something', async () => {
    const result = await myAction({ request: mockRequest } as never)
    expect(result).toHaveProperty('expected')
  })
})
```

### Running Tests

```bash
pnpm test           # Run all tests
pnpm test:watch     # Watch mode
```

## Database Operations

### Using Drizzle ORM

```typescript
import { db } from '~/lib/db'
import { user, transaction } from '~/lib/db/schema'
import { eq, desc, and } from 'drizzle-orm'

// Query
const users = await db.query.user.findMany({
  where: eq(user.role, 'user'),
  orderBy: [desc(user.createdAt)],
})

// Insert
await db.insert(user).values({
  id: crypto.randomUUID(),
  email: 'test@example.com',
  name: 'Test',
})

// Update
await db.update(user).set({ name: 'New Name' }).where(eq(user.id, userId))

// Delete
await db.delete(user).where(eq(user.id, userId))
```

### Database Commands

```bash
pnpm db:generate    # Generate migrations
pnpm db:push        # Push schema to database
pnpm db:seed        # Seed database
pnpm db:studio      # Open Drizzle Studio
```

## Development Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm typecheck    # Run TypeScript checks
pnpm lint         # Run linter
pnpm format       # Format code
pnpm test         # Run tests
```

## Toast Notifications

Use `redirectSuccess`/`redirectFail` from `~/lib/action-utils` for toast notifications on redirect:

```typescript
import { redirectSuccess, redirectFail } from '~/lib/action-utils'

// In action:
return redirectSuccess(ROUTES.SOME_ROUTE, 'Operation successful')
return redirectFail(ROUTES.SOME_ROUTE, 'Operation failed')
```

For inline responses without redirect:

```typescript
import { respondSuccess, respondFail } from '~/lib/action-utils'

return respondSuccess({ data: 'value' }, 'Operation successful')
return respondFail({ error: 'value' }, 'Operation failed')
```

## Key Libraries

- **Mantine**: UI component library (import from `@mantine/core`, `@mantine/charts`, etc.)
- **Tabler Icons**: Icon library (import from `@tabler/icons-react`)
- **Better Auth**: Authentication (configured in `app/lib/auth.server.ts`)
- **Remix Toast**: Toast notifications (via `remix-toast`)
- **Recharts**: Charts (used via Mantine Charts wrapper)

## Performance Best Practices

### Server-Side Performance

| Rule | Description |
| ---- | ----------- |
| `server-auth-actions` | Authenticate server actions like API routes |
| `server-parallel-fetching` | Restructure components to parallelize fetches |
| `server-parallel-nested-fetching` | Chain nested fetches per item in Promise.all |
| `server-serialization` | Minimize data passed to client components |
| `server-hoist-static-io` | Hoist static I/O (fonts, logos) to module level |
| `server-no-shared-module-state` | Avoid module-level mutable request state |

**Parallel Fetches with Promise.all:**

```typescript
// ❌ Prohibited — sequential execution, 3 round trips
const user = await fetchUser()
const posts = await fetchPosts()
const comments = await fetchComments()

// ✅ Correct — parallel execution, 1 round trip
const [user, posts, comments] = await Promise.all([
  fetchUser(),
  fetchPosts(),
  fetchComments()
])
```

**Hoist Static I/O to Module Level:**

```typescript
// ❌ Prohibited — reads config on every call
export async function processRequest(data: Data) {
  const config = JSON.parse(await fs.readFile('./config.json', 'utf-8'))
  return render(data, config)
}

// ✅ Correct — hoists to module level
const configPromise = fs.readFile('./config.json', 'utf-8').then(JSON.parse)

export async function processRequest(data: Data) {
  const config = await configPromise
  return render(data, config)
}
```

**Minimize Serialization at RSC Boundaries:**

```typescript
// ❌ Prohibited — serializes all 50 fields
const user = await fetchUser()  // 50 fields
return <Profile user={user} />

// ✅ Correct — serializes only needed field
const user = await fetchUser()
return <Profile name={user.name} />
```

### Authentication in Loaders/Actions

Always authenticate inside loaders and actions — do not rely solely on route guards:

```typescript
export async function myLoader({ request }: Route.LoaderArgs) {
  // ✅ Always check auth inside the loader
  const session = await requireVerified(request)
  
  const data = await db.query.someTable.findMany({
    where: eq(someTable.userId, session.user.id),
  })
  return { data }
}
```

### Bundle Size Optimization

| Rule | Description |
| ---- | ----------- |
| `bundle-barrel-imports` | Import directly when possible, avoid deep barrel imports |
| `bundle-dynamic-imports` | Use dynamic imports for heavy components |
| `bundle-conditional` | Load modules only when feature is activated |

**Dynamic Imports for Heavy Components:**

```typescript
// For heavy components like Monaco Editor
const MonacoEditor = dynamic(
  () => import('./monaco-editor').then(m => m.MonacoEditor),
  { ssr: false }
)
```

**Preload on User Intent:**

```typescript
function EditorButton({ onClick }: { onClick: () => void }) {
  const preload = () => {
    if (typeof window !== 'undefined') {
      void import('./monaco-editor')
    }
  }
  return (
    <Button onMouseEnter={preload} onFocus={preload} onClick={onClick}>
      Open Editor
    </Button>
  )
}
```
