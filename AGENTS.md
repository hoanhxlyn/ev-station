# AGENTS.md - EV Station Project Guidelines

## Overview

EV Station is a React Router 7 application with Mantine v8 UI components. The project uses TypeScript with strict mode, Zod for validation, and follows a route-based file organization pattern.

---

## Build Commands

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Testing
pnpm test             # Run tests once
pnpm test:watch       # Run tests in watch mode

# Type checking
pnpm typecheck        # Run TypeScript typegen + tsc

# Code quality
pnpm format           # Format code with oxfmt
pnpm format:check     # Check formatting without modifying
pnpm lint             # Run oxlint linter
pnpm lint:fix         # Fix linting issues automatically
pnpm spell            # Run cspell for spell checking

# Pre-commit hooks (runs automatically via lefthook)
pnpm prepare          # Install lefthook hooks
```

---

## Project Structure

```
app/
├── routes/
│   ├── home.tsx              # Home route
│   ├── login/
│   │   ├── page.tsx          # Login route (exports meta, action)
│   │   ├── actions.ts        # Server-side actions
│   │   ├── left-panel.tsx    # Login left panel component
│   │   ├── right-panel.tsx   # Login right panel component
│   │   └── page.module.css   # Route-specific styles
├── schemas/
│   └── auth.ts               # Zod validation schemas
├── constants/
│   └── messages.ts           # Centralized messages/strings
├── providers/
│   └── mantine-provider.tsx  # Mantine provider setup
├── theme/
│   └── mantine-theme.ts      # Global Mantine theme config
├── root.tsx                  # Root layout + ErrorBoundary
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
- Components are named exports (e.g., `LoginLeftPanel`)

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
