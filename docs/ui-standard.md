# UI Standard — EV Station

> Derived from [Constitution v1.1.0](../.specify/memory/constitution.md) Principles VI, VIII, IX and project conventions.

---

## 1. Mantine-First UI

All UI **MUST** be built with Mantine v9 components combined with CSS Modules. The three absolute sub-rules are:

| #   | Rule                    | Details                                                                                                                                                                                                                                                             |
| --- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Theme Configuration** | Mantine theme is configured in `app/theme/mantine-theme.ts`. Never repeat the same `size`, `radius`, or other shared props across multiple components — set them globally in the theme instead.                                                                     |
| 2   | **Style Priority**      | Mantine style props (`p`, `gap`, `m`, `bg`, `fw`, `c`, etc.) **MUST** be used first for layout and spacing. CSS Modules (`*.module.css`) are used only for styles that cannot be expressed through Mantine props. Inline JSX `style` attributes are **PROHIBITED**. |
| 3   | **Component-First**     | Always use Mantine components over raw HTML elements. If Mantine provides a component for the UI pattern, use it. Only create custom components when no Mantine equivalent exists.                                                                                  |

### 1.1 Current Theme Defaults

```ts
// app/theme/mantine-theme.ts
createTheme({
  primaryColor: 'teal',
  defaultRadius: 'lg',
  fontFamily: '"Roboto Variable", sans-serif',
  // Custom spacing tokens
  spacing: { '2xl': '2.5rem', '3xl': '2rem', '4xl': '3rem' },
})
```

- **Primary color**: `teal`
- **Default radius**: `lg`
- **Font family**: Roboto Variable

Do **not** pass `color="teal"` or `radius="lg"` repeatedly — those are already the theme defaults. Only override when deviating from the theme.

### 1.2 Component defaultProps

The `defaultProps` constant in `mantine-theme.ts` sets shared defaults (`size: 'sm'`, `radius: 'lg'`) for registered components. Components configured with `defaultProps` **MUST** consume these defaults — never repeat them as individual props.

```ts
// app/theme/mantine-theme.ts (lines 3-6)
const defaultProps = {
  size: 'sm',
  radius: 'lg',
}

// Applied to: Button, TextInput, NumberInput, DateInput, PasswordInput, Select
```

```tsx
// ❌ Prohibited — repeating defaults already set in theme defaultProps
<TextInput size="sm" radius="lg" label="Email" />

// ✅ Correct — rely on theme defaults
<TextInput label="Email" />
```

---

## 2. Styling Layer Order

When styling a UI element, apply techniques in this **strict** priority order — you **MUST NOT** skip a layer and use a lower-priority one when a higher-priority one can express the style:

1. **Mantine style props** — `p`, `m`, `gap`, `fw`, `c`, `bg`, `pos`, `mih`, `w`, etc. Always try these first.
2. **CSS Modules** — only for styles that Mantine props cannot express (e.g., gradient backgrounds, glass effects, blob decorations, responsive overrides).
3. **Never** use inline `style={{ ... }}` — under no circumstances.

```tsx
// ❌ Prohibited — skipping Mantine props and going straight to CSS Module or inline styles
<Text className={styles.title}>Title</Text>
<Text style={{ fontWeight: 700 }}>Title</Text>

// ✅ Correct — Mantine props first, CSS Module only when needed
<Text fw={700}>Title</Text>
<Text fw={700} className={styles.gradientTitle}>Title</Text>
```

### 2.1 When to Use CSS Modules

- Decorative backgrounds (blobs, gradients, glass overlays)
- Pseudo-elements (`::before`, `::after`)
- Complex responsive overrides beyond Mantine's responsive props
- Animations / transitions
- `backdrop-filter` and `filter` effects

### 2.2 CSS Module Variable Conventions

CSS Modules use PostCSS Simple Variables (`postcss-simple-vars`) for shared tokens. Available variables:

| Variable               | Description                                   |
| ---------------------- | --------------------------------------------- |
| `$auth-gradient-light` | Auth page background gradient                 |
| `$page-gradient-light` | Dashboard page background gradient            |
| `$hero-gradient`       | Hero/credit card gradient                     |
| `$blob-radius`         | Consistent border radius for blob decorations |
| `$teal-glow`           | Primary teal glow color                       |
| `$glass-blur`          | Backdrop-filter blur value                    |
| `$overlay-white-glass` | Semi-transparent white glass overlay          |
| `$overlay-white-dim`   | Dimmed white overlay                          |

---

## 3. Component Patterns

### 3.1 Layout Components

```tsx
// ✅ Preferred — Mantine style props for layout
<Container size="xl" py={{ base: 'lg', sm: '3xl' }}>
  <Stack gap="md">
    <Group justify="space-between" align="center">
      <Text fw={700}>Title</Text>
      <Badge variant="light" color="teal">Status</Badge>
    </Group>
  </Stack>
</Container>

// ❌ Prohibited — inline styles
<div style={{ padding: '16px', display: 'flex' }}>
```

### 3.2 Card Pattern

```tsx
// ✅ Preferred — Card with Mantine props + CSS Module for decorative styles
<Card radius="xl" p="lg" withBorder shadow="sm" className={styles.myCard}>
  <Group justify="space-between" align="flex-start" mb="md">
    <Stack gap={2}>
      <Text fw={700} fz="lg">
        {TITLE}
      </Text>
      <Text c="dimmed" size="sm">
        {SUBTITLE}
      </Text>
    </Stack>
    <ThemeIcon size={42} radius="xl" variant="light" color="teal">
      <IconComponent size={20} />
    </ThemeIcon>
  </Group>
</Card>
```

### 3.3 Form Pattern (with Zod + Mantine useForm)

```tsx
import { useForm } from '@mantine/form'
import { zodResolver } from 'mantine-form-zod-resolver'
import { loginSchema } from '~/schemas/auth'
import { VALIDATION_MESSAGES } from '~/constants/validation'
import { ROUTES } from '~/constants/routes'

const form = useForm({
  mode: 'uncontrolled',
  validate: zodResolver(loginSchema),
  initialValues: { accountName: '', password: '', remember: false },
})
```

Rules:

- Always use `mode: 'uncontrolled'` for performance
- Always use `zodResolver` with schemas from `~/schemas/`
- Never define Zod schemas inline — centralize in `app/schemas/`
- Never hardcode validation messages — use constants from `~/constants/validation`
- Always use `key={form.key('fieldName')}` on every form field in uncontrolled mode — it sets the HTML `name` attribute and provides type safety. Never set `name` manually when using `useForm`; `form.key()` replaces it:

```tsx
// ❌ Prohibited — manual name prop when using useForm
<TextInput label="Email" name="email" {...form.getInputProps('email')} />

// ✅ Correct — form.key() sets name and is type-safe
<TextInput label="Email" key={form.key('email')} {...form.getInputProps('email')} />
```

### 3.4 Data Display Pattern

```tsx
// ✅ Preferred — Table with responsive scroll container
<Table.ScrollContainer minWidth={600}>
  <Table verticalSpacing="sm" highlightOnHover>
    <Table.Thead>
      <Table.Tr>
        <Table.Th>Column</Table.Th>
      </Table.Tr>
    </Table.Thead>
    <Table.Tbody>
      {data.map((item) => (
        <Table.Tr key={item.id}>...</Table.Tr>
      ))}
    </Table.Tbody>
  </Table>
</Table.ScrollContainer>
```

### 3.5 Chart Pattern (Recharts via @mantine/charts)

```tsx
import { BarChart } from '@mantine/charts'
;<BarChart
  h={220}
  data={data}
  dataKey="day"
  series={[{ name: 'sessions', color: 'teal.6' }]}
  barProps={{ radius: 8 }}
  gridAxis="y"
  tickLine="none"
/>
```

---

## 4. Constants-First Development

Magic numbers and hardcoded strings are **PROHIBITED**. All reusable values must be defined in the appropriate constants file:

| Constant Type                     | File                               | Examples                                          |
| --------------------------------- | ---------------------------------- | ------------------------------------------------- |
| User-facing messages              | `app/constants/messages.ts`        | Success/fail messages, auth messages              |
| Validation rules & error messages | `app/constants/validation.ts`      | Min/max lengths, format errors                    |
| Route paths                       | `app/constants/routes.ts`          | `ROUTES.HOME`, `ROUTES.LOGIN`                     |
| Feature-specific constants        | Dedicated file in `app/constants/` | `dashboard.ts` for dashboard messages & mock data |

### 4.1 Pattern

```ts
// ✅ Preferred
export const DASHBOARD_MESSAGES = {
  TITLE: 'Dashboard',
  WELCOME: 'Welcome back',
} as const

// ❌ Prohibited — hardcoded string instead of constant, raw <h1> instead of <Title>
<h1>Dashboard</h1>
```

---

## 5. Barrel Import Convention

Use barrel (index) imports instead of direct file imports:

```ts
// ✅ Preferred
import { loginSchema } from '~/schemas/auth'
import { ROUTES } from '~/constants/routes'
import { VALIDATION_CONSTRAINTS } from '~/constants/validation'
import { user } from '~/lib/db/schema'

// ❌ Prohibited
import { loginSchema } from '~/schemas/auth/login-schema'
import { ROUTES } from '~/constants/routes/routes'
import { user } from '~/lib/db/schema/user'
```

---

## 6. Route Module Convention

Every route MUST follow the `page.tsx` + `actions.ts` + `loader.ts` split pattern:

| File         | Export                                 | Purpose                      |
| ------------ | -------------------------------------- | ---------------------------- |
| `page.tsx`   | `default` (page component), `meta`     | UI rendering                 |
| `actions.ts` | Named export (e.g., `loginAction`)     | Form submissions / mutations |
| `loader.ts`  | Named export (e.g., `dashboardLoader`) | Data fetching + auth guard   |

```tsx
// page.tsx
export { loginAction as action } from './actions'
export { dashboardLoader as loader } from './loader'

export function meta() {
  return [{ title: 'EV Station | Page' }]
}

export default function Page() {
  // JSX with Mantine components
}
```

### 6.1 Type Safety

Use auto-generated types from `.react-router/types/`:

```tsx
import type { Route } from './+types/page'

export default function Page({ loaderData }: Route.ComponentProps) {
  // loaderData is fully typed
}
```

---

## 7. Icon Usage

Icons come from `@tabler/icons-react`. Follow these rules:

- Use `<IconXxx size={20} />` inside `ThemeIcon` wrappers
- `ThemeIcon` size should be `\~2x` the icon size (e.g., icon `20` → ThemeIcon `42`)
- Use `variant="light"` and `color="teal"` for consistency with the theme
- Use `radius="xl"` for circular icon containers

```tsx
<ThemeIcon size={42} radius="xl" variant="light" color="teal">
  <IconBolt size={20} />
</ThemeIcon>
```

---

## 8. Color Palette

Primary palette uses Mantine's `teal` color scale:

| Token                    | Usage                          |
| ------------------------ | ------------------------------ |
| `teal` / `teal.5`        | Primary actions, badges, icons |
| `teal.6`                 | Chart series color             |
| `dimmed`                 | Secondary/muted text           |
| `white`                  | Light-on-dark text             |
| `rgba(255,255,255,0.75)` | Semi-transparent overlay text  |
| `rgba(255,255,255,0.6)`  | Tertiary overlay text          |
| `rgba(20,184,166,0.14)`  | Teal blob backgrounds          |
| `rgba(56,189,248,0.16)`  | Accent blob backgrounds        |

---

## 9. Responsive Design

- Use Mantine responsive props: `py={{ base: 'lg', sm: '3xl', lg: '4xl' }}`
- Use `SimpleGrid` with `cols={{ base: 1, md: 2 }}` for responsive grids
- Use `visibleFrom` / `hiddenFrom` for responsive show/hide
- Use `Table.ScrollContainer` with `minWidth` for horizontal scroll on tables

---

## 10. Animation & Decoration

Decorative elements follow a consistent pattern:

- **Blobs**: Use `$blob-radius` for border radius, position with `inset` absolute positioning
- **Glass morphism**: Use `$overlay-white-glass` background + `$glass-blur` backdrop-filter
- **Gradients**: Use CSS variables (`$hero-gradient`, `$auth-gradient-light`, `$page-gradient-light`)
- **Shadows**: Prefer Mantine `shadow` prop (`shadow="sm"`, `shadow="xl"`)
- **Hover effects**: Use `@mixin hover {}` in CSS Modules (PostCSS Simple Variables syntax)

---

## 11. React Performance

### 11.1 Re-render Optimization

| Rule | Description |
| ---- | ----------- |
| `rerender-memo` | Extract expensive work into memoized components |
| `rerender-defer-reads` | Don't subscribe to state only used in callbacks |
| `rerender-derived-state` | Subscribe to derived booleans, not raw values |
| `rerender-functional-setstate` | Use functional setState for stable callbacks |
| `rerender-lazy-state-init` | Pass function to useState for expensive values |
| `rerender-split-combined-hooks` | Split hooks with independent dependencies |
| `rerender-transitions` | Use startTransition for non-urgent updates |

**Calculate Derived State During Rendering:**

```tsx
// ❌ Prohibited — redundant state and effect
function Form() {
  const [firstName, setFirstName] = useState('First')
  const [lastName, setLastName] = useState('Last')
  const [fullName, setFullName] = useState('')

  useEffect(() => {
    setFullName(firstName + ' ' + lastName)
  }, [firstName, lastName])

  return <p>{fullName}</p>
}

// ✅ Correct — derive during render
function Form() {
  const [firstName, setFirstName] = useState('First')
  const [lastName, setLastName] = useState('Last')
  const fullName = firstName + ' ' + lastName

  return <p>{fullName}</p>
}
```

**Don't Define Components Inside Components:**

```tsx
// ❌ Prohibited — creates new component type on every render
function UserProfile({ user, theme }) {
  const Avatar = () => (
    <img src={user.avatarUrl} className={theme === 'dark' ? 'dark' : 'light'} />
  )
  return <Avatar />
}

// ✅ Correct — define at module level or pass props
function Avatar({ src, theme }: { src: string; theme: string }) {
  return <img src={src} className={theme === 'dark' ? 'dark' : 'light'} />
}
```

**Use Lazy State Initialization:**

```tsx
// ❌ Prohibited — runs on every render
const [searchIndex, setSearchIndex] = useState(buildSearchIndex(items))

// ✅ Correct — runs only on initial render
const [searchIndex, setSearchIndex] = useState(() => buildSearchIndex(items))
```

### 11.2 Rendering Performance

| Rule | Description |
| ---- | ----------- |
| `rendering-hoist-jsx` | Extract static JSX outside components |
| `rendering-content-visibility` | Use content-visibility for long lists |
| `rendering-conditional-render` | Use ternary, not && for conditionals |
| `rendering-usetransition-loading` | Prefer useTransition for loading state |

**Hoist Static JSX:**

```tsx
// ❌ Prohibited — recreates element every render
function LoadingSkeleton() {
  return <div className="animate-pulse h-20 bg-gray-200" />
}

// ✅ Correct — reuses same element
const loadingSkeleton = (
  <div className="animate-pulse h-20 bg-gray-200" />
)
```

**Use Explicit Conditional Rendering:**

```tsx
// ❌ Prohibited — renders "0" when count is 0
{count && <Badge>{count}</Badge>}

// ✅ Correct — renders nothing when count is 0
{count > 0 ? <Badge>{count}</Badge> : null}
```

### 11.3 JavaScript Performance

| Rule | Description |
| ---- | ----------- |
| `js-early-exit` | Return early from functions |
| `js-hoist-regexp` | Hoist RegExp creation outside loops |
| `js-set-map-lookups` | Use Set/Map for O(1) lookups |
| `js-cache-function-results` | Cache function results in module-level Map |
| `js-combine-iterations` | Combine multiple filter/map into one loop |

**Build Index Maps for Repeated Lookups:**

```tsx
// ❌ Prohibited — O(n) per lookup
const user = users.find(u => u.id === order.userId)

// ✅ Correct — O(1) per lookup
const userById = new Map(users.map(u => [u.id, u]))
const user = userById.get(order.userId)
```

**Use Set/Map for O(1) Lookups:**

```tsx
// ❌ Prohibited — O(n) per check
items.filter(item => allowedIds.includes(item.id))

// ✅ Correct — O(1) per check
const allowedSet = new Set(allowedIds)
items.filter(item => allowedSet.has(item.id))
```

---

## 12. Quality Checklist

Before submitting any UI code, verify:

- [ ] All components use Mantine components (no raw `<div>` where Mantine equivalent exists)
- [ ] No inline `style={{ }}` attributes
- [ ] No hardcoded strings or magic numbers — use constants from `~/constants/`
- [ ] Imports use barrel paths (`~/schemas/auth`, not `~/schemas/auth/login-schema`)
- [ ] Validation schemas are in `app/schemas/` with `zodResolver`
- [ ] Route follows `page.tsx` + `actions.ts` + `loader.ts` split
- [ ] Shared `size`, `radius`, `color` values are configured in theme, not repeated per-component
- [ ] CSS Modules only for styles that Mantine props cannot express
- [ ] TypeScript types are inferred from auto-generated Route types
- [ ] No inline component definitions (define at module level instead)
- [ ] Derived state calculated during render, not in useEffect
- [ ] Explicit ternary used for conditionals that may render falsy values
- [ ] `pnpm lint && pnpm typecheck && pnpm format && pnpm test` all pass
