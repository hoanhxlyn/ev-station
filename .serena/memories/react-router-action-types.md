# React Router Action Types

## Action Signature

Use React Router's built-in types for actions:

```typescript
import type { Route } from './+types/page'

export async function loginAction({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  // ...
}
```

The types are auto-generated in `.react-router/types/app/routes/[route-name]/+types/page.ts`.

## Key Points

- Import `Route` from `./+types/page` (not from a separate file)
- Use `Route.ActionArgs` for action parameters
- Always extract formData via `await request.formData()`
- Export action from page.tsx: `export { loginAction as action } from './actions'`
