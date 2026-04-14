# Feature Specification: EV Station Management System

**Feature Branch**: `002-ev-station-management`
**Created**: 2026-04-11
**Status**: Draft
**Input**: User description: "EV Station Management System — web application for managing EV charging stations, enabling users to track charging history, manage spending, top up balances and repay debt, while providing admins with oversight of cash flow, station data, and user information."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Registration & Login (Priority: P1)

A new or returning user accesses the platform. They can register with email and password (email verification required before dashboard access), or sign in via GitHub OAuth. After authenticating and verifying email, the system assigns them a USER role (or ADMIN for seed-created accounts) and redirects them to their respective dashboard.

**Why this priority**: Authentication is the gateway to every other feature. Without it, no user-specific actions are possible. This must work first.

**Independent Test**: Sign up a new account, log in, verify the session persists, verify role assignment, and log out.

**Acceptance Scenarios**:

1. **Given** a visitor on the login page, **When** they register with a valid email and password, **Then** an account is created with USER role and a verification email is sent; the user cannot access the dashboard until they verify their email.
2. **Given** a registered user on the login page, **When** they enter correct credentials, **Then** they are authenticated and redirected to their role-based dashboard.
3. **Given** a visitor on the login page, **When** they click "Sign in with GitHub" and authorize, **Then** a linked account is created or existing session resumed and they reach the dashboard.
4. **Given** an authenticated user, **When** they click "Sign out" in the sidebar, **Then** their session is terminated and they are redirected to the login page.

---

### User Story 2 - User Dashboard & Charging History (Priority: P2)

A logged-in user can start a charging session at a station via a simulated station API, selecting which of their vehicles is being charged. Session status updates in real time (in-progress, completed). The dashboard displays current balance, total top-up, active and completed charging sessions, and a filterable usage chart (day/week/month/year).

**Why this priority**: This is the core value proposition for users — seeing their charging data, live session status, and spending at a glance. It is the primary reason users visit the application after logging in.

**Independent Test**: Log in as a user, start a charging session via the simulated station API, verify session status updates in real time, then verify the dashboard displays balance, charging history, and filterable chart.

**Acceptance Scenarios**:

1. **Given** a logged-in user at a station, **When** they initiate a charging session by selecting a station and one of their vehicles, **Then** the session appears as "in-progress" on their dashboard with real-time status updates.
2. **Given** a charging session in progress, **When** the user clicks "End Session", **Then** the session status updates to "completed", energy consumed and cost are calculated and recorded, and the balance is deducted.
3. **Given** a logged-in user with existing transactions, **When** they open the dashboard, **Then** they see their current balance, total top-up amount, and a list of recent charging sessions.
4. **Given** a user on the dashboard with charging history, **When** they select a time filter (day/week/month/year), **Then** the usage chart updates to display charging statistics for the selected period.

---

### User Story 3 - Top-up & Debt Repayment (Priority: P3)

A user tops up their wallet with platform credits to pay for charging sessions. If their credit balance is negative (in debt), the system prominently displays a repayment option. Top-ups and repayments update the user's credit balance in real time. All monetary values are internal credits, not real currency.

**Why this priority**: Monetization and billing are essential for the system to be viable, but they depend on users already being authenticated and having visibility into their charges.

**Independent Test**: Log in as a user with zero or negative balance, perform a top-up, verify the balance updates, and if negative, verify the debt repayment flow is available and functional.

**Acceptance Scenarios**:

1. **Given** a logged-in user with a credit balance of zero, **When** they submit a top-up for a valid amount of credits, **Then** the credit balance increases by that amount and a transaction record is created.
2. **Given** a logged-in user with a negative credit balance, **When** they view their wallet, **Then** a debt repayment option is prominently displayed.
3. **Given** a user with outstanding debt (negative credits), **When** they initiate a debt repayment for the full or partial amount, **Then** the credit balance updates accordingly and the debt indicator is cleared if fully repaid.

---

### User Story 4 - Profile & Vehicle Management (Priority: P4)

A user updates their personal information (name, phone, email, avatar) and manages their EV vehicles — adding, editing, or deleting vehicle entries (license plate, brand, model, battery capacity). A user can have multiple vehicles registered.

**Why this priority**: Personalization and vehicle data enrich the user experience but are not blocking for core functionality (authentication, dashboard, billing).

**Independent Test**: Log in as a user, update profile fields, add a new vehicle, edit it, then delete it, and verify changes persist.

**Acceptance Scenarios**:

1. **Given** a logged-in user on the profile page, **When** they update their name and phone number and save, **Then** the changes persist and are reflected across the application.
2. **Given** a logged-in user on the vehicle management page, **When** they add a vehicle with license plate, brand, model, and battery capacity, **Then** the vehicle appears in their vehicle list.
3. **Given** a user with a registered vehicle, **When** they edit the vehicle details or delete it, **Then** the changes are saved or the vehicle is removed from their list.
4. **Given** a user with multiple vehicles, **When** they view their vehicle list, **Then** all vehicles are displayed and manageable independently.

---

### User Story 5 - Admin Dashboard & User Management (Priority: P5)

An admin (pre-created via database seed script) views a high-level dashboard with KPI cards (total users, total stations, daily transactions) and a cash flow chart. They can also browse all users, view individual user profiles (including vehicles, balance, debt, charging history), and lock or unlock user accounts.

**Why this priority**: Admin features are critical for operations but depend on user data existing from prior stories. This is the last priority because the system must have user-generated data before admin oversight adds value.

**Independent Test**: Log in as an admin, verify KPI cards display correct counts, verify the cash flow chart renders, browse user list, view a specific user's detail, lock and unlock a user account.

**Acceptance Scenarios**:

1. **Given** an admin on the admin dashboard, **When** they view the KPI section, **Then** correct counts for total users, total stations, and daily transactions are displayed.
2. **Given** an admin on the admin dashboard, **When** they view the cash flow chart, **Then** a chart showing money flowing into and out of the system is rendered for a selectable period.
3. **Given** an admin on the user management page, **When** they search for or browse users, **Then** a paginated list of all users is displayed with key summary info.
4. **Given** an admin viewing a specific user's detail, **When** they click to lock or unlock the account, **Then** the user's account status changes and the action is recorded.

---

### Edge Cases

- What happens when a user tops up with zero or negative credit amounts? The system MUST reject invalid amounts with a clear error message.
- What happens when a user's session expires while filling out a form? The system MUST redirect to the login page with a toast notification indicating the session expired. Form state is not preserved in v1.
- What happens if GitHub OAuth is unavailable? The system MUST display a fallback message and still allow email/password login.
- What happens when an admin tries to lock an already locked account? The system MUST indicate the account is already locked and not produce an error.
- What happens if a user registers with an email that already exists? The system MUST inform the user without revealing whether the email is registered (security best practice).
- What happens if a user does not verify their email? The system MUST block dashboard access and allow resending the verification email.
- What happens when the wallet reaches an excessively negative credit balance? The system MUST cap charging to prevent unlimited debt (assumption: a configurable debt limit).
- What happens if a user loses connection during an active charging session? The system MUST persist the session state and resume or auto-complete on reconnection.
- What happens if a user attempts to start a charging session with insufficient balance? The system MUST warn the user and optionally redirect to the top-up flow, but allow the session if debt is within the configured limit.
- What happens if a user with no registered vehicles attempts to start a charging session? The system MUST prompt the user to add a vehicle first before proceeding.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST allow users to register with email and password, requiring email verification before granting dashboard access.
- **FR-002**: System MUST allow users to log in via email/password and GitHub OAuth.
- **FR-003**: System MUST assign USER role to self-registered accounts and ADMIN role only to seed-created accounts, and enforce role-based access control on all routes.
- **FR-003b**: System MUST provide a sidebar navigation layout for all authenticated routes, containing links to Dashboard, Wallet, Charging, Vehicles, Profile (and Admin for admin users), plus a "Sign out" action that terminates the session and redirects to login.
- **FR-004**: System MUST display a user dashboard showing current balance, total top-up, active and completed charging sessions with real-time status, and charging history.
- **FR-005**: System MUST provide a filterable usage chart (day/week/month/year) for charging statistics, using URL query parameters (`?period=day|week|month|year`) that the dashboard loader reads to return aggregated data for the selected period.
- **FR-006**: System MUST allow users to start and end charging sessions via a simulated station API, requiring selection of a station and a registered vehicle, with real-time status updates (in-progress, completed). Sessions are ended manually by the user (no auto-completion).
- **FR-007**: System MUST allow users to top up their wallet with platform credits (internal currency, not real money) through a top-up form with a mock payment gateway flow (simulated card payment using a free library like Stripe test mode).
- **FR-008**: System MUST detect negative credit balance and display a debt repayment option.
- **FR-009**: System MUST allow users to update their profile (name, phone, email, avatar).
- **FR-010**: System MUST allow users to manage multiple vehicles (add, edit, delete) with license plate, brand, model, and battery capacity.
- **FR-011**: System MUST display an admin dashboard with KPI cards (total users, total stations, daily transactions) and a cash flow chart.
- **FR-012**: System MUST allow admins to view all users, inspect individual user profiles, and lock/unlock user accounts.
- **FR-013**: System MUST validate all form inputs on the client side and return structured error messages.

### Key Entities

- **User**: Represents a system account. Attributes include name, email, phone, avatar, role (USER/ADMIN), credit balance (internal currency, not real money), and account status (active/locked). Has many Vehicles and Transactions.
- **Vehicle**: Represents a user's EV. Attributes include license plate, brand, model, battery capacity. Belongs to a User.
- **Transaction**: Represents a financial event (credit top-up, charging payment, debt repayment) in platform credits. Attributes include type, credit amount, timestamp, and related user/session. Belongs to a User.
- **ChargingSession**: Represents a charging event at a station. Attributes include station reference, vehicle reference (user's selected vehicle), start time, end time, energy consumed, cost in credits, and status (in-progress, completed). Users can start/end sessions via the simulated station API. Belongs to a User.
- **Station**: Represents a charging station. Attributes include location, status (available, occupied, offline). Referenced by ChargingSession. Station data is seeded; CRUD is out of scope for v1.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can complete registration and log in within 2 minutes.
- **SC-002**: Dashboard loads and displays balance, history, and chart within 3 seconds for typical data volumes.
- **SC-003**: Credit top-up and debt repayment updates reflect in the user's credit balance within 2 seconds of submission.
- **SC-004**: Admin dashboard KPI data is accurate and reflects the current state of the system.
- **SC-005**: 90% of form submissions with invalid inputs receive clear, actionable error messages on the first attempt.
- **SC-006**: Role-based access blocks unauthorized users from admin routes and actions 100% of the time.

## Clarifications

### Session 2026-04-11

- Q: How should charging sessions be initiated and recorded in the system? → A: Charging sessions start/end via a simulated station API with real-time status updates
- Q: Should the wallet balance function as a closed internal currency or map to a real currency? → A: Closed internal currency (platform credits) — no real money involved
- Q: What minimum information does a user need to provide when starting a charging session? → A: Station + vehicle — user selects station and which of their vehicles is charging
- Q: How should admin accounts be created in the system? → A: Database seed script — admins are pre-created via seed data at setup time
- Q: Should email verification be required before accessing the dashboard? → A: Required before access — user must verify email before seeing the dashboard

### Session 2026-04-11 (2)

- Q: How should the wallet top-up flow work in v1? → A: Mock payment gateway using a free Stripe-like library (e.g., Stripe test mode) — user enters amount, goes through a simulated payment form, credits added on payment completion
- Q: How should the simulated charging session lifecycle work in v1? → A: Manual end only — user clicks "End Session" to complete; no server-side auto-completion timer; SIMULATED_SESSION_DURATION constant removed
- Q: How should logout be handled? → A: Sidebar navigation component with "Sign out" option; sidebar is the primary app layout for all authenticated routes (dashboard, wallet, charging, vehicles, profile, admin)
- Q: How should the dashboard chart data be filtered by time period (FR-005)? → A: URL query parameter — loader reads `?period=day|week|month|year` and returns aggregated data for that period; frontend updates URL via navigation
- Q: How should session expiry be handled in v1? → A: Redirect to login with a toast notification ("Session expired, please log in again"); form state is not preserved

## Assumptions

- Users have stable internet connectivity (web application assumes always-online access).
- Payment integration for top-up uses a mock payment gateway (e.g., Stripe test mode) for initial development; the user flow includes a simulated payment form (card number, etc.) before credits are added. Top-up credits are internal currency, not real money. No real payment provider charges occur in v1.
- GitHub OAuth is the only social login provider for the initial release.
- Admin accounts are created exclusively via database seed script at setup time; self-registration and admin invite flows are out of scope for v1.
- Charging station data is seeded; this system reads station data but does not manage station CRUD in v1. Charging sessions are started and ended manually by the user (no server-side auto-completion timer).
- A configurable debt limit exists to prevent excessive negative balances.
- Mobile-responsive design is expected but native mobile apps are out of scope for v1.
