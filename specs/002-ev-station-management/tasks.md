---
description: 'Task list for EV Station Management System feature implementation'
---

# Tasks: EV Station Management System

**Input**: Design documents from `/specs/002-ev-station-management/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), data-model.md, contracts/, research.md, quickstart.md

**Tests**: Unit tests are mandatory per constitution (Principle II). Test tasks are included for each user story.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app (this project)**: `app/` at repository root (React Router 7 full-stack)
- **Schemas**: `app/schemas/`
- **Constants**: `app/constants/`
- **DB Schema**: `app/lib/db/schema/`
- **Routes**: `app/routes/`
- **Tests**: Colocated with source files (`*.test.{ts,tsx}`)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Extend existing project with new database tables, seed data, and shared infrastructure for all user stories.

- [x] T001 Extend User schema with `role`, `phone`, `creditBalance`, `status` columns in `app/lib/db/schema/user.ts` and update `app/lib/db/schema/relations.ts` — add role (text, default 'user'), phone (text, nullable), creditBalance (integer, default 0), status (text, default 'active')
- [x] T002 [P] Create Station schema in `app/lib/db/schema/station.ts` — id, name, location, status (available/occupied/offline), powerOutput, pricePerKwh, createdAt, updatedAt
- [x] T003 [P] Create Vehicle schema in `app/lib/db/schema/vehicle.ts` — id, licensePlate, brand, model, batteryCapacity, userId (FK→user), createdAt, updatedAt
- [x] T004 [P] Create Transaction schema in `app/lib/db/schema/transaction.ts` — id, userId (FK→user), type (top-up/charging-payment/debt-repayment), amount, description, chargingSessionId (FK→chargingSession, nullable), createdAt
- [x] T005 [P] Create ChargingSession schema in `app/lib/db/schema/charging-session.ts` — id, userId (FK→user), stationId (FK→station), vehicleId (FK→vehicle), status (in-progress/completed/cancelled), startAt, endAt (nullable), energyConsumed (nullable), cost (nullable), createdAt, updatedAt
- [x] T006 Update barrel export in `app/lib/db/schema/index.ts` — add exports for station, vehicle, transaction, charging-session
- [x] T007 Update relations in `app/lib/db/schema/relations.ts` — add user→vehicles, user→transactions, user→chargingSessions, vehicle→chargingSessions, station→chargingSessions, chargingSession→transactions relations
- [x] T008 Run `pnpm db:push` to apply schema changes and verify no migration errors
- [x] T009 Create seed script in `drizzle/seed.ts` — seed admin account (role='admin', emailVerified=true) and 5 charging stations with varying powerOutput and pricePerKwh; add `db:seed` script to `package.json`
- [x] T010 [P] Extend route constants in `app/constants/routes.ts` — add WALLET, CHARGING, VEHICLES, PROFILE, ADMIN, ADMIN_USERS, ADMIN_USER_DETAIL route paths
- [x] T011 [P] Extend validation constants in `app/constants/validation.ts` — add VEHICLE_CONSTRAINTS (licensePlate 4-20, brand 1-50, model 1-50, batteryCapacity 10-500), TRANSACTION_CONSTRAINTS (MIN_TOP_UP 1000, DEBT_LIMIT -50000), CHARGING_SESSION_CONSTRAINTS
- [x] T012 [P] Extend message constants in `app/constants/messages.ts` — add WALLET_MESSAGES, VEHICLE_MESSAGES, CHARGING_MESSAGES, ADMIN_MESSAGES for success/error/notification copy
- [x] T013 [P] Extend dashboard constants in `app/constants/dashboard.ts` — add CREDIT_UNIT label and divisor, DEBT_LIMIT value; remove SIMULATED_SESSION_DURATION (manual end-session per spec clarification)
- [x] T014 [P] Create auth guard utility in `app/lib/auth-guards.ts` — export `requireAuth(request)`, `requireAdmin(request)`, `requireVerified(request)` helper functions that check session, role, and emailVerified status, throwing appropriate redirects/responses
- [x] T015 Extend auth server in `app/lib/auth.server.ts` — add role, phone, creditBalance, status fields via Better Auth `additionalFields`; ensure role is accessible in `session.user.role`
- [x] T016 [P] Create charging-session schema validation in `app/schemas/charging-session.ts` — Zod schemas for startSessionIntent (intent, stationId, vehicleId), endSessionIntent (intent, sessionId), cancelSessionIntent (intent, sessionId) using constants from validation.ts
- [x] T017 [P] Create transaction schema validation in `app/schemas/transaction.ts` — Zod schemas for topUpIntent (intent, amount) and repayIntent (intent, amount) with MIN_TOP_UP constraint
- [x] T018 [P] Create vehicle schema validation in `app/schemas/vehicle.ts` — Zod schemas for addVehicleIntent, editVehicleIntent, deleteVehicleIntent with VEHICLE_CONSTRAINTS
- [x] T019 [P] Create admin schema validation in `app/schemas/admin.ts` — Zod schema for toggleLockIntent (intent, userId) with barrel export from `app/schemas/index.ts`
- [x] T020 Update route config in `app/routes.ts` — add routes for /wallet, /charging, /vehicles, /profile, /admin, /admin/users, /admin/users/:userId

**Checkpoint**: Schema pushed, seed data works, routes registered, all barrel exports updated

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

- [x] T021 [P] Write unit tests for auth guards in `app/lib/auth-guards.test.ts` — test requireAuth redirects unauthenticated, requireAdmin redirects non-admin, requireVerified redirects unverified, requireVerified blocks locked users
- [x] T022 Implement auth guard functions in `app/lib/auth-guards.ts` — ensure all tests pass; fix any issues found in testing
- [x] T023 [P] Write unit tests for Zod schemas in `app/schemas/vehicle.test.ts` — test addVehicleIntent validation (valid/invalid licensePlate, brand, model, batteryCapacity), editVehicleIntent, deleteVehicleIntent
- [x] T024 [P] Write unit tests for Zod schemas in `app/schemas/transaction.test.ts` — test topUpIntent validation (valid/invalid amount, min constraint), repayIntent validation
- [x] T025 [P] Write unit tests for Zod schemas in `app/schemas/charging-session.test.ts` — test startSessionIntent (valid/invalid stationId, vehicleId), endSessionIntent, cancelSessionIntent
- [x] T026 [P] Write unit tests for Zod schemas in `app/schemas/admin.test.ts` — test toggleLockIntent validation
- [x] T027 Write unit tests for seed script in `drizzle/seed.test.ts` — verify admin account and stations are seeded correctly
- [x] T028 Run `pnpm db:seed` and verify admin login works with seeded credentials; run `pnpm test` to ensure all foundational tests pass
- [x] T029 Install Stripe dependencies — `pnpm add @stripe/stripe-js stripe` (runtime) for mock payment flow per spec clarification
- [x] T030 Add Stripe environment variables to `.env.example` — `STRIPE_PUBLIC_KEY` and `STRIPE_SECRET_KEY` (both using test mode keys)

**Checkpoint**: All foundational tests pass — user story implementation can begin in parallel

---

## Phase 3: User Story 1 - Registration & Login (Priority: P1) 🎯 MVP

**Goal**: Users can register with email/password (email verification required) or sign in via GitHub OAuth, and are redirected to role-based dashboards. Sidebar navigation with logout is present on all authenticated routes.

**Independent Test**: Register a new account, verify email, log in, verify session persists, verify role-based redirect, verify sidebar navigation with logout works.

### Tests for User Story 1

- [x] T031 [P] [US1] Write test for signup action in `app/routes/signup/actions.test.ts` — test valid registration creates user with role='user' and sends verification email; test duplicate email gives generic message; test validation errors
- [x] T032 [P] [US1] Write test for login action in `app/routes/login/actions.test.ts` — test valid credentials redirect to dashboard; test unverified email redirects to check-email; test invalid credentials return error
- [x] T033 [P] [US1] Write test for auth guard redirect behavior in `app/lib/auth-guards.test.ts` — test that protected routes redirect unverified users to check-email page; test locked users get 403; test session expiry redirect with toast

### Implementation for User Story 1

- [x] T034 [US1] Extend signup action in `app/routes/signup/actions.ts` — add role='user' on creation, ensure email verification flow works with Better Auth requireEmailVerification config
- [x] T035 [US1] Extend signup page in `app/routes/signup/page.tsx` — use Mantine form components with Zod validation from `app/schemas/auth.ts`; add error display using `SIGNUP_MESSAGES` constants (not LOGIN_MESSAGES)
- [x] T036 [US1] Extend login action in `app/routes/login/actions.ts` — check emailVerified status after login; redirect unverified users to check-email; redirect verified users to role-based dashboard (USER→ROUTES.APP, ADMIN→ROUTES.ADMIN)
- [x] T037 [US1] Update login page in `app/routes/login/page.tsx` — add GitHub OAuth button, use Mantine components, add error display
- [x] T038 [US1] Update signup check-email component in `app/routes/signup/check-email.tsx` — add "resend verification email" functionality with appropriate messages from constants
- [x] T039 [US1] Create AppSidebar component in `app/components/app-sidebar.tsx` — Mantine AppShell with Navbar containing links to Dashboard, Wallet, Charging, Vehicles, Profile (and Admin for admin users); "Sign out" button using Better Auth `signOut`; show/hide Admin link based on `session.user.role`
- [x] T040 [US1] Integrate AppSidebar into authenticated layout in `app/routes/dashboard/page.tsx` — wrap authenticated route content with AppShell layout containing sidebar; apply to dashboard, wallet, charging, vehicles, profile, and admin routes
- [x] T041 [US1] Add session expiry handling — in all route loaders using `requireAuth`, catch expired session and redirect to `/login` with toast notification ("Session expired, please log in again") using Mantine `notifications`; add `SESSION_EXPIRED` message to `app/constants/messages.ts`
- [x] T042 [US1] Add auth guard to all protected route loaders — update `app/routes/dashboard/loader.ts` to use `requireVerified()` from auth-guards; ensure unverified or unauthenticated users are redirected

**Checkpoint**: User Story 1 should be fully functional and testable independently — users can register, verify email, log in, see sidebar, and log out

---

## Phase 4: User Story 2 - User Dashboard & Charging History (Priority: P2)

**Goal**: Logged-in users see a dashboard with credit balance, total top-up, active and completed charging sessions, and a filterable usage chart (day/week/month/year via URL query params).

**Independent Test**: Log in as a user, start a charging session via the simulated station API, verify session status updates, then verify the dashboard displays balance, charging history, and filterable chart.

### Tests for User Story 2

- [x] T043 [P] [US2] Write test for dashboard loader in `app/routes/dashboard/loader.test.ts` — test that loader returns user balance, recent sessions, total top-up amount, stations, and vehicles for the authenticated user; test that `?period=week` query parameter returns aggregated data for that period
- [x] T044 [P] [US2] Write test for charging session actions in `app/routes/charging/actions.test.ts` — test start session (valid station+vehicle, no active session check, debt limit check), end session (valid session, calculates cost, deducts balance), cancel session (sets status to cancelled, no charge)

### Implementation for User Story 2

- [x] T045 [US2] Implement dashboard loader in `app/routes/dashboard/loader.ts` — fetch user's creditBalance, recent transactions (top-ups), active and recent charging sessions, available stations, and user's vehicles; read `?period` query parameter and aggregate transaction data accordingly; return all data for the dashboard page
- [x] T046 [US2] Implement dashboard page in `app/routes/dashboard/page.tsx` — display credit balance (using `CREDIT_UNIT` constant), total top-up, active charging session card, recent sessions table (Mantine Table), filterable usage chart (`@mantine/charts` AreaChart); period selector using `useSearchParams` for `?period=day|week|month|year`; use Mantine style props for layout (p, gap); use `page.module.css` for custom styles only
- [x] T047 [US2] Create charging session route in `app/routes/charging/` — create `page.tsx`, `loader.ts`, `actions.ts` per route module convention; loader returns activeSession, recentSessions, stations, vehicles; page shows start/end session UI
- [x] T048 [US2] Implement charging start action in `app/routes/charging/actions.ts` — validate with `startSessionIntent` schema from `app/schemas/charging-session.ts`; check user has no active session; check creditBalance > DEBT_LIMIT; check station available; check vehicle belongs to user; create ChargingSession record; update station status to 'occupied'; redirect back with success message using `CHARGING_MESSAGES` constants
- [x] T049 [US2] Implement charging end action in `app/routes/charging/actions.ts` — validate with endSessionIntent schema; calculate energyConsumed = powerOutput _ duration_hours and cost = energyConsumed _ pricePerKwh / 1000 (cents); update session to completed; atomically deduct cost from user creditBalance; create Transaction record (type='charging-payment', amount=-cost); update station status to 'available'; redirect with success
- [x] T050 [US2] Implement charging cancel action in `app/routes/charging/actions.ts` — set session to cancelled; update station status to 'available'; no charge deducted
- [x] T051 [US2] Implement charging page in `app/routes/charging/page.tsx` — show active session with real-time status polling via `useRevalidator`; show start session form (station Mantine Select, vehicle Mantine Select); show session history list; use Mantine style props for layout
- [x] T052 [US2] Add dashboard CSS module in `app/routes/dashboard/page.module.css` — custom styles for dashboard that cannot be achieved with Mantine props alone
- [x] T053 [US2] Add charging session CSS module in `app/routes/charging/page.module.css` — custom styles for charging page

**Checkpoint**: User Story 2 should be fully functional and testable independently — users can view dashboard, start/end charging sessions, filter charts by period

---

## Phase 5: User Story 3 - Top-up & Debt Repayment (Priority: P3)

**Goal**: Users can top up platform credits through a mock Stripe payment flow (simulated card form) and repay debt when balance is negative.

**Independent Test**: Log in as a user with zero balance, perform a top-up through the mock payment form, verify the balance updates, and if negative, verify the debt repayment flow is available and functional.

### Tests for User Story 3

- [x] T054 [P] [US3] Write test for wallet loader in `app/routes/wallet/loader.test.ts` — test that loader returns user balance, isInDebt flag, and paginated transaction history
- [x] T055 [P] [US3] Write test for top-up action in `app/routes/wallet/actions.test.ts` — test valid top-up increases creditBalance by amount and creates Transaction record; test amount below MIN_TOP_UP rejected; test zero/negative amount rejected
- [x] T056 [P] [US3] Write test for debt repayment action in `app/routes/wallet/actions.test.ts` — test valid repayment increases creditBalance; test repayment amount exceeds current debt rejected; test repayment when not in debt rejected

### Implementation for User Story 3

- [x] T057 [US3] Create Stripe utility in `app/lib/stripe.server.ts` — initialize Stripe with test mode secret key from env; export helper functions for creating payment intents (test mode) and confirming payments
- [x] T058 [US3] Implement wallet loader in `app/routes/wallet/loader.ts` — fetch user's creditBalance, calculate isInDebt flag (balance < 0), fetch paginated transaction history ordered by createdAt desc; return Stripe public key for client-side Payment Element
- [x] T059 [US3] Implement top-up action in `app/routes/wallet/actions.ts` — validate with topUpIntent schema from `app/schemas/transaction.ts`; create Stripe payment intent (test mode) for the amount; on successful payment confirmation, atomically update creditBalance (`creditBalance = creditBalance + amount`); create Transaction record (type='top-up'); redirect with success message using `WALLET_MESSAGES` constants
- [x] T060 [US3] Implement debt repayment action in `app/routes/wallet/actions.ts` — validate with repayIntent schema; check user is in debt; validate amount ≤ abs(creditBalance); atomically update creditBalance; create Transaction record (type='debt-repayment'); redirect with success
- [x] T061 [US3] Implement wallet page in `app/routes/wallet/page.tsx` — display current balance with CREDIT_UNIT formatting; show prominent debt repayment section if isInDebt is true; Stripe Payment Element (test mode) for top-up form with Mantine NumberInput for amount; transaction history list (Mantine Table with pagination); use Mantine style props for layout (p, gap)
- [x] T062 [US3] Add wallet CSS module in `app/routes/wallet/page.module.css` — custom styles for debt indicator, balance display, payment form spacing

**Checkpoint**: User Stories 1, 2, AND 3 should all work independently — users can top up, repay debt, and see updated balances

---

## Phase 6: User Story 4 - Profile & Vehicle Management (Priority: P4)

**Goal**: Users can update their profile (name, phone, email, avatar) and manage multiple vehicles (add, edit, delete).

**Independent Test**: Log in, update profile fields, add a vehicle, edit it, delete it, verify all changes persist.

### Tests for User Story 4

- [x] T063 [P] [US4] Write test for profile loader in `app/routes/profile/loader.test.ts` — test that loader returns current user data for the profile form
- [x] T064 [P] [US4] Write test for profile update action in `app/routes/profile/actions.test.ts` — test valid name/phone update persists; test validation errors for invalid phone format
- [x] T065 [P] [US4] Write test for vehicle loader in `app/routes/vehicles/loader.test.ts` — test loader returns list of user's vehicles
- [x] T066 [P] [US4] Write test for vehicle actions in `app/routes/vehicles/actions.test.ts` — test add vehicle (valid data creates record), edit vehicle (updates existing), delete vehicle (removes record), delete vehicle with active session (fails with error)

### Implementation for User Story 4

- [x] T067 [US4] Create profile schema validation in `app/schemas/profile.ts` — Zod schemas for updateProfileIntent (name, phone, image URL) using constants from validation.ts; update barrel export in `app/schemas/index.ts`
- [x] T068 [US4] Implement profile loader in `app/routes/profile/loader.ts` — fetch current user data (name, phone, email, image); return for profile form prefill
- [x] T069 [US4] Implement profile update action in `app/routes/profile/actions.ts` — validate with profile schema; update user name, phone (image/avatar URL update for v1: text input for URL); return structured errors on failure; redirect with success message using constants
- [x] T070 [US4] Implement profile page in `app/routes/profile/page.tsx` — Mantine form with TextInput for name, phone; email (read-only display); avatar URL input (TextInput for v1); use Mantine useForm with zodResolver; use Mantine style props for layout
- [x] T071 [US4] Implement vehicle loader in `app/routes/vehicles/loader.ts` — fetch all vehicles for current user; return vehicles list
- [x] T072 [US4] Implement add vehicle action in `app/routes/vehicles/actions.ts` — validate with addVehicleIntent schema; create Vehicle record linked to current user; redirect with success message
- [x] T073 [US4] Implement edit vehicle action in `app/routes/vehicles/actions.ts` — validate with editVehicleIntent schema; verify vehicleId belongs to current user; update Vehicle record; redirect with success
- [x] T074 [US4] Implement delete vehicle action in `app/routes/vehicles/actions.ts` — validate vehicleId belongs to user; check no active charging sessions for vehicle; delete Vehicle record; redirect with success or error using `VEHICLE_MESSAGES` constants
- [x] T075 [US4] Implement vehicles page in `app/routes/vehicles/page.tsx` — list user's vehicles in Mantine Table; add vehicle form (Mantine TextInput/NumberInput); edit/delete buttons per row; Modal for add/edit forms; use Mantine style props for layout
- [x] T076 [US4] Add profile CSS module in `app/routes/profile/page.module.css`
- [x] T077 [US4] Add vehicles CSS module in `app/routes/vehicles/page.module.css`

**Checkpoint**: User Stories 1-4 should all work independently — users can manage profiles and vehicles

---

## Phase 7: User Story 5 - Admin Dashboard & User Management (Priority: P5)

**Goal**: Admins can view KPI dashboard, cash flow charts, browse users, view user details, and lock/unlock accounts.

**Independent Test**: Log in as admin (seeded), verify KPI cards, verify cash flow chart, browse user list, view specific user detail, lock/unlock a user account.

### Tests for User Story 5

- [x] T078 [P] [US5] Write test for admin dashboard loader in `app/routes/admin/loader.test.ts` — test that loader returns totalUsers, totalStations, dailyTransactions, cashFlowData for admin role only; test non-admin is forbidden
- [x] T079 [P] [US5] Write test for admin users loader in `app/routes/admin/users/loader.test.ts` — test paginated user list with search and status filters; test non-admin is forbidden
- [x] T080 [P] [US5] Write test for admin user detail loader in `app/routes/admin/users.$userId/loader.test.ts` — test returns user profile, vehicles, transactions, charging sessions, balance; test non-admin is forbidden; test non-existent user returns 404
- [x] T081 [P] [US5] Write test for admin toggle-lock action in `app/routes/admin/users.$userId/actions.test.ts` — test locking active user sets status='locked'; test unlocking locked user sets status='active'; test cannot lock admin user; test cancelling active charging sessions on lock

### Implementation for User Story 5

- [x] T082 [US5] Implement admin dashboard loader in `app/routes/admin/loader.ts` — use `requireAdmin()` guard; query totalUsers count, totalStations count, dailyTransactions count; query cashFlowData (daily aggregates of top-ups and payments for the selected period); return all data
- [x] T083 [US5] Implement admin dashboard page in `app/routes/admin/page.tsx` — Mantine Card components for KPI metrics (totalUsers, totalStations, dailyTransactions); `@mantine/charts` AreaChart for cash flow; Mantine Grid for layout; style with Mantine props
- [x] T084 [US5] Implement admin users list loader in `app/routes/admin/users/loader.ts` — use `requireAdmin()` guard; paginated query with search and status filters; return users with vehicleCount and totalDebt
- [x] T085 [US5] Implement admin users list page in `app/routes/admin/users/page.tsx` — Mantine Table with user list (name, email, role, balance, status); Mantine Pagination; search TextInput; status filter Select; link to user detail; use Mantine style props
- [x] T086 [US5] Implement admin user detail loader in `app/routes/admin/users.$userId/loader.ts` — use `requireAdmin()` guard; fetch user profile, vehicles, recent transactions, recent charging sessions, balance; return all data
- [x] T087 [US5] Implement admin user detail page in `app/routes/admin/users.$userId/page.tsx` — display user profile info (name, email, role, status, balance); vehicles section; charging history section; lock/unlock button with confirmation Modal; use Mantine style props
- [x] T088 [US5] Implement toggle-lock action in `app/routes/admin/users.$userId/actions.ts` — validate with toggleLockIntent schema; enforce cannot lock admin users; toggle user status between 'active' and 'locked'; if locking, cancel any active charging sessions; log action via Consola; redirect with success message using `ADMIN_MESSAGES` constants
- [x] T089 [US5] Add admin dashboard CSS module in `app/routes/admin/page.module.css`
- [x] T090 [US5] Add admin users CSS module in `app/routes/admin/users/page.module.css`
- [x] T091 [US5] Add admin user detail CSS module in `app/routes/admin/users.$userId/page.module.css`

**Checkpoint**: All 5 user stories should now be independently functional

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T092 [P] Add Mantine theme configuration in `app/theme/mantine-theme.ts` — ensure default size and radius are set globally so they don't need per-component props; add any component-specific theme overrides
- [x] T093 [P] Add error boundary handling in route loaders — ensure all loaders return structured errors `{ errors: { field: [...] } }` per Constitution Principle VII; add ErrorBoundary in `root.tsx` if not present
- [x] T094 [P] Add logging to all server actions via Consola logger in `app/lib/logger.server.ts` — log action name, userId, and outcome (success/failure) for audit trail
- [x] T095 [P] Verify all barrel imports — ensure `app/lib/db/schema/index.ts`, `app/schemas/index.ts`, `app/constants/index.ts` (if created) export all new modules; no direct file imports in route code
- [x] T096 [P] Verify no inline styles — grep all new route files for `style={{` and convert to Mantine props or CSS Modules
- [x] T097 [P] Verify no magic numbers — ensure all values reference constants from `app/constants/`; check for hardcoded strings in route files
- [x] T098 Run full quality gate: `pnpm lint:fix && pnpm lint && pnpm typecheck && pnpm format && pnpm test`
- [x] T099 Update `app/routes.ts` — verify all new routes are registered and route constants match
- [x] T100 Update `AGENTS.md` — ensure Stripe.js is listed in active technologies; verify project structure reflects all new directories

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion — BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Phase 2 completion
  - US1 (Registration & Login) — no dependencies on other stories
  - US2 (Dashboard & Charging) — depends on US1 for auth; schema/seed from Phase 1
  - US3 (Top-up & Debt) — depends on US1 for auth; can start after Phase 2
  - US4 (Profile & Vehicle) — depends on US1 for auth; can start after Phase 2
  - US5 (Admin) — depends on US1 for auth; can start after Phase 2
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 2 — provides auth foundation for all other stories
- **US2 (P2)**: Can start after Phase 2 — needs US1 auth guards but otherwise independent
- **US3 (P3)**: Can start after Phase 2 — needs US1 auth guards but otherwise independent
- **US4 (P4)**: Can start after Phase 2 — needs US1 auth guards but otherwise independent
- **US5 (P5)**: Can start after Phase 2 — needs US1 auth guards but otherwise independent

### Within Each User Story

- Tests MUST pass before implementation begins (Constitution Principle II)
- Schema validations before route actions
- Loaders before pages
- Core implementation before integration

### Parallel Opportunities

- All Phase 1 tasks T002-T005 (schema files) can run in parallel
- All Phase 1 tasks T010-T019 (constants/schemas) can run in parallel
- All Phase 2 test tasks T023-T026 can run in parallel
- Within each user story: test tasks can run in parallel (different test files)
- US3, US4 can run in parallel once US1 is complete (different route files)

---

## Parallel Example: User Story 2

```bash
# Launch all tests for User Story 2 together:
Task: "T043: Write test for dashboard loader"
Task: "T044: Write test for charging session actions"

# Launch schema-dependent implementation tasks in parallel:
Task: "T045: Implement dashboard loader"
Task: "T047: Create charging session route files"

# Then implement pages (depends on loaders and actions):
Task: "T046: Implement dashboard page"
Task: "T051: Implement charging page"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently — register, verify email, log in, see sidebar, log out
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo (charging + dashboard)
4. Add User Story 3 → Test independently → Deploy/Demo (wallet top-up + debt)
5. Add User Story 4 → Test independently → Deploy/Demo (profile + vehicles)
6. Add User Story 5 → Test independently → Deploy/Demo (admin dashboard)

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (auth + sidebar)
3. Once US1 is complete:
   - Developer A: User Story 2 (dashboard + charging)
   - Developer B: User Story 3 (wallet)
   - Developer C: User Story 4 (profile + vehicles)
4. After US2-US4:
   - Developer D: User Story 5 (admin dashboard)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- All routes follow `page.tsx` + `actions.ts` + `loader.ts` convention per Constitution Principle IV
- All forms use Zod + Mantine useForm with zodResolver per Constitution Principle III
- All constants in `app/constants/` per Constitution Principle VIII
- All barrel imports per Constitution Principle IX
- No inline styles; Mantine props first, CSS Modules second per Constitution Principle VI
- Unit tests mandatory per Constitution Principle II
- Stripe test mode is used for mock payment flow (no real charges)
- Sidebar navigation with logout on all authenticated routes per spec clarification FR-003b
- Dashboard chart uses URL query parameters for period filtering per spec clarification FR-005
- Charging sessions are ended manually (no auto-completion timer) per spec clarification
- Session expiry redirects to login with toast notification per spec clarification
