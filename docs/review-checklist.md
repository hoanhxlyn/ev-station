# UI Code Review Checklist

## 🧪 1. Testing Coverage

- [ ] **Missing Tests:** Are all new or modified UI components adequately covered by unit or integration tests?
- [ ] **Test Quality:** Do the tests accurately verify the component's expected behavior and edge cases?

## 📏 2. Code Conventions

- [ ] **Coding Standards:** Does the code strictly adhere to the established project conventions and linter rules?
- [ ] **Readability:** Are variables, functions, and hooks named clearly and descriptively?

## 🔢 3. Hardcoded Values

- [ ] **Magic Numbers:** Have all magic numbers been extracted into meaningful constant variables?
- [ ] **Hardcoded Strings:** Are all text strings properly extracted to constants, configuration files, or localization (i18n) dictionaries?

## 🎨 4. UI Component Standards

- [ ] **Structural Patterns:** Do the UI components follow the correct architectural conventions (e.g., consistent prop naming, proper composition)?
- [ ] **Separation of Concerns:** Is the presentation layout cleanly separated from complex business logic?
- [ ] **Reusability:** Are the components built in a reusable manner without unnecessary tight coupling to specific contexts?
