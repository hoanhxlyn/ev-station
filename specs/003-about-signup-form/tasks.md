# Tasks: Signup Form Validation Improvements

**Input**: Design documents from `/specs/003-about-signup-form/`
**Prerequisites**: plan.md, spec.md

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup (No tasks required)

This feature requires no setup - existing registration flow is fully functional.

---

## Phase 2: Foundational (No tasks required)

This feature requires no foundational changes - all infrastructure exists.

---

## Phase 3: User Story 1 - Inline form validation errors (Priority: P1) 🎯 MVP

**Goal**: Display email/username already exists errors as inline field errors instead of toast notifications

**Independent Test**: Submit registration form with existing email/username and verify error messages appear next to the relevant fields

### Tests for User Story 1 ⚠️

> **NOTE: Write tests FIRST, ensure they FAIL before implementation**

- [x] T001 [P] [US1] Unit test for username uniqueness check in app/routes/signup/actions.test.ts
- [x] T002 [P] [US1] Integration test for inline field errors in app/routes/signup/check-email.test.tsx

### Implementation for User Story 1

- [x] T003 [US1] Add email already exists error to validation constants in app/constants/validation.ts
- [x] T004 [US1] Add username already exists error to validation constants in app/constants/validation.ts
- [x] T005 [US1] Modify email exists check in app/routes/signup/actions.ts to return field-level error instead of redirectFail
- [x] T006 [US1] Add username uniqueness check in app/routes/signup/actions.ts with field-level error
- [x] T007 [US1] Display field errors from fetcher in app/routes/signup/signup-panel.tsx using Mantine TextInput error prop

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - OAuth registration without password field (Priority: P2)

**Goal**: Ensure password field is hidden when registering via OAuth provider

**Independent Test**: Initiate OAuth registration flow and verify form displays without password input

### Tests for User Story 2 ⚠️

> **NOTE: Tests already exist for OAuth completion flow**

- [x] T008 [P] [US2] Verify OAuth password hidden test in app/routes/signup/check-email.test.tsx

### Implementation for User Story 2

> **NOTE**: Password field hiding already implemented (signup-panel.tsx line 136-147). Verify and add any missing error handling.

- [x] T009 [US2] Verify OAuth signup flow handles missing password gracefully in app/routes/signup/actions.ts

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T010 [P] Run lint:fix and lint to verify code quality in app/routes/signup/
- [x] T011 [P] Run typecheck to verify TypeScript types
- [x] T012 Run pnpm test to verify all tests pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - not applicable for this feature
- **Foundational (Phase 2)**: No dependencies - not applicable for this feature
- **User Stories (Phase 3+)**: Can proceed immediately since infrastructure exists
- **Polish (Final Phase)**: Depends on user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies - implement first (MVP)
- **User Story 2 (P2)**: No dependencies - can implement in parallel with US1

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Constants before usage
- Actions modification before UI update
- Core implementation before polish

### Parallel Opportunities

- T001 and T002 can run in parallel (different test files)
- T003 and T004 can run in parallel (different constants)
- T005 and T006 can run in parallel (different checks in actions.ts)
- T008 and T009 can run in parallel with US1 tasks

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Unit test for username uniqueness check in app/routes/signup/actions.test.ts"
Task: "Integration test for inline field errors in app/routes/signup/check-email.test.tsx"

# Launch constants additions in parallel:
Task: "Add email already exists error to validation constants in app/constants/validation.ts"
Task: "Add username already exists error to validation constants in app/constants/validation.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 3: User Story 1
2. **STOP and VALIDATE**: Test User Story 1 independently
3. Deploy/demo if ready

### Incremental Delivery

1. Complete User Story 1 → Test independently → Deploy/Demo (MVP!)
2. Complete User Story 2 → Test independently → Deploy/Demo
3. Complete Polish phase → Final verification

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
