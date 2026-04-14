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

## 11. Quality Checklist

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
- [ ] `pnpm lint && pnpm typecheck && pnpm format && pnpm test` all pass
