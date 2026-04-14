# UI Code Review Checklist

## 🧪 1. Testing Coverage

- [ ] **Missing Tests:** Are all new or modified files (components, hooks, utils, loaders, actions) adequately covered by unit or integration tests?
- [ ] **Test Quality:** Do the tests accurately verify the expected behavior and edge cases?

## 📏 2. Code Conventions

- [ ] **Coding Standards:** Does the code strictly adhere to the established project conventions and linter rules?
- [ ] **Readability:** Are variables, functions, and hooks named clearly and descriptively?

## 🔢 3. Hardcoded Values

- [ ] **Magic Numbers:** Have all magic numbers been extracted into meaningful constant variables?
- [ ] **Hardcoded Strings:** Are all text strings properly extracted to constants, configuration files, or localization (i18n) dictionaries?

## 🎨 4. UI Component Standards

See [ui-standard.md](./ui-standard.md) for full details.

- [ ] **Mantine-First:** Are all UI elements built with Mantine v9 components (no raw `<div>`, `<span>`, etc. where a Mantine equivalent exists)?
- [ ] **Theme Defaults:** Are `size="sm"`, `radius="lg"`, and `color="teal"` omitted when they match theme defaults? Are `defaultProps`-registered components not repeating those props?
- [ ] **Style Priority:** Is every styling property applied using Mantine style props (`p`, `m`, `gap`, `fw`, `c`, `bg`, etc.) first? Are CSS Modules used only for styles Mantine props cannot express? Is inline `style={{ }}` absent?
- [ ] **Form Fields:** Is `name` omitted on form fields that use `useForm`? Is `key={form.key('fieldName')}` and `{...form.getInputProps('fieldName')}` used correctly?
- [ ] **Constants-First:** Are there zero hardcoded strings or magic numbers in UI code?
- [ ] **Separation of Concerns:** Is the presentation layout cleanly separated from complex business logic?
