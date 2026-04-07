# Tasks: OAuth Signup Flow with Pre-filled Fields

**Input**: Design documents from `/specs/001-oauth-signup-flow/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Test tasks included per Constitution (Principle II: Test-First Development)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify existing project structure and prepare for database changes

- [x] T001 Verify existing route structure in app/routes/login/ and app/routes/signup/
- [x] T002 Review existing auth.server.ts configuration
- [x] T003 Review existing schema files in app/lib/db/schema/

**Checkpoint**: Project structure verified, ready for database changes

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database schema changes required before any user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Add signupMethod column to user table in app/lib/db/schema/user.ts
- [x] T005 Run pnpm db:generate to create migration for signupMethod column
- [x] T006 Run pnpm db:push to apply migration to development database
- [x] T007 [P] Configure magic link plugin in auth.server.ts with expiresIn: 600 (10 minutes)
- [x] T008 [P] Add magicLinkClient plugin to auth-client.ts

**Checkpoint**: Foundation ready - database schema updated, auth configured

---

## Phase 3: User Story 1 - OAuth User Signs Up for First Time (Priority: P1) 🎯 MVP

**Goal**: New OAuth users are redirected to signup with pre-filled email/name, create account, and immediately sign in without email verification

**Independent Test**: Can be fully tested by simulating a new OAuth user completing signup and verifying they are signed in without receiving a magic link email

### Tests for User Story 1 (write tests FIRST, ensure they FAIL before implementation) ⚠️

- [x] T009 [P] [US1] Write test for OAuth signup redirect in app/test/auth.test.ts
- [x] T010 [P] [US1] Write test for pre-filled signup form in app/test/auth.test.ts
- [x] T011 [P] [US1] Write test for immediate signin without magic link in app/test/auth.test.ts

### Implementation for User Story 1

- [x] T012 [US1] Create loader.ts in app/routes/signup/loader.ts to check OAuth session state via authClient.getSession()
- [x] T013 [US1] Modify app/routes/signup/page.tsx to render pre-filled email/name fields from OAuth session
- [x] T014 [US1] Modify app/routes/signup/actions.ts to handle OAuth signup: create user with emailVerified=true, signupMethod='oauth', immediately sign in
- [x] T015 [US1] Handle FR-008 conflict: check if email exists with signupMethod='manual', reject OAuth signup if true
- [x] T016 [US1] Handle FR-009: validate email presence from OAuth provider, reject if missing
- [x] T017 [US1] Handle FR-010: add user-friendly error handling for OAuth provider outages

**Checkpoint**: User Story 1 complete - OAuth signup flow works with pre-filled fields and immediate signin

---

## Phase 4: User Story 2 - OAuth User Signs In (Priority: P1)

**Goal**: Returning OAuth users can sign in directly without additional steps

**Independent Test**: Can be fully tested by simulating an existing OAuth user completing signin and verifying they are redirected to the protected area

### Tests for User Story 2 (write tests FIRST, ensure they FAIL before implementation) ⚠️

- [ ] T018 [P] [US2] Write test for existing OAuth user direct signin in app/test/auth.test.ts
- [ ] T019 [P] [US2] Write test for authenticated user redirect from login page in app/test/auth.test.ts

### Implementation for User Story 2

- [ ] T020 [US2] Modify app/routes/login/page.tsx to add GitHub OAuth button with authClient.signIn.social()
- [ ] T021 [US2] Implement OAuth callback handling: check if user exists by email, sign in directly if found
- [ ] T022 [US2] Modify dashboard loader to handle authenticated OAuth session redirect

**Checkpoint**: User Story 2 complete - existing OAuth users can sign in directly

---

## Phase 5: User Story 3 - Manual Signup with Email Verification (Priority: P2)

**Goal**: Manual signup users receive magic link, click to verify, then can sign in

**Independent Test**: Can be fully tested by simulating a manual signup, receiving a magic link, clicking it, and verifying account activation

### Tests for User Story 3 (write tests FIRST, ensure they FAIL before implementation) ⚠️

- [ ] T023 [P] [US3] Write test for manual signup creates unverified user in app/test/auth.test.ts
- [ ] T024 [P] [US3] Write test for magic link email sent in app/test/auth.test.ts
- [ ] T025 [P] [US3] Write test for magic link verification activates account in app/test/auth.test.ts
- [ ] T026 [P] [US3] Write test for unverified user cannot sign in in app/test/auth.test.ts

### Implementation for User Story 3

- [ ] T027 [US3] Modify app/routes/signup/actions.ts to handle manual signup: create user with emailVerified=false, signupMethod='manual', send magic link
- [ ] T028 [US3] Modify app/routes/signup/page.tsx to support both OAuth pre-filled and manual signup modes
- [ ] T029 [US3] Add Zod validation schema for manual signup in app/schemas/auth.ts
- [ ] T030 [US3] Handle expired/invalid magic link (show error, allow re-request)

**Checkpoint**: User Story 3 complete - manual signup with magic link verification works

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Quality gates and documentation updates

- [x] T031 [P] Run pnpm lint across all modified files
- [x] T032 [P] Run pnpm typecheck across all modified files
- [x] T033 [P] Run pnpm format across all modified files
- [x] T034 Run pnpm test for full test suite
- [x] T035 [P] Update AGENTS.md if new auth patterns need documentation
- [x] T036 Verify quickstart.md testing flows work correctly

**Checkpoint**: All quality gates pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - US1 and US2 can proceed in parallel after Foundational
  - US3 can proceed in parallel with US1 and US2
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories (OAuth button independent of signup)
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Independent of US1/US2

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Tests for same story marked [P] can run in parallel
- Implementation tasks depend on tests passing
- Story complete before moving to Polish phase

### Parallel Opportunities

- T007 and T008 (auth.server.ts config) can run in parallel
- T009, T010, T011 (US1 tests) can run in parallel
- T018, T019 (US2 tests) can run in parallel
- T023, T024, T025, T026 (US3 tests) can run in parallel
- T031, T032, T033 (Polish quality gates) can run in parallel
- US1, US2, US3 can be developed in parallel by different developers

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: T009 - Write test for OAuth signup redirect
Task: T010 - Write test for pre-filled signup form
Task: T011 - Write test for immediate signin without magic link

# Launch implementation after tests fail:
Task: T012 - Create loader.ts in app/routes/signup/loader.ts
Task: T013 - Modify app/routes/signup/page.tsx
Task: T014 - Modify app/routes/signup/actions.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Polish phase → Final validation
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. All complete → Polish phase together

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (TDD approach)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
