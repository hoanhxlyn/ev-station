# Research: EV Station Management System

**Branch**: `002-ev-station-management`
**Date**: 2026-04-11

## 1. Real-Time Charging Session Updates

**Decision**: Use React Router 7 server-sent events (SSE) or simple polling for charging session status updates.

**Rationale**: The spec requires "real-time status updates" for charging sessions. React Router 7 (Remix-based) does not have built-in WebSocket support. For a prototype/demo scale with ~100 concurrent users, simple polling (every 3-5 seconds) from the dashboard loader is sufficient and avoids WebSocket infrastructure complexity. SSE is an alternative if push semantics are needed, but polling keeps the architecture simpler and works within React Router's loader/action model.

**Alternatives considered**:

- **WebSocket**: Would require a separate WebSocket server (e.g., Socket.IO), adding significant infra complexity for prototype scale. Rejected.
- **SSE via resource route**: Viable but adds a streaming route and client-side EventSource management. More complex than polling for equivalent UX at this scale. Rejected for v1, can migrate later.
- **Polling with `useRevalidator`**: Uses existing React Router infrastructure. Re-fetches dashboard data on interval. Simple, reliable, works with SSR. Selected for v1.

## 2. RBAC Implementation with Better Auth

**Decision**: Extend the existing `user` table with a `role` column (enum: `USER` | `ADMIN`) and check roles in route loaders.

**Rationale**: Better Auth does not include built-in RBAC. The simplest approach is adding a `role` field to the user model and checking it in each protected loader. Admin seed script sets `role: 'admin'`. Self-registration always sets `role: 'user'`. This is consistent with the existing schema pattern and avoids additional auth plugin complexity.

**Alternatives considered**:

- **Better Auth `admin` plugin**: Provides admin/impersonation features but is more complex than needed. The plugin adds auth bypass and impersonation, which we don't need. Rejected for v1.
- **Custom middleware**: React Router 7 doesn't have traditional middleware; route loaders serve as the guard point. Checking role in each loader is the idiomatic approach.
- **Access control library (CASL, etc.)**: Overkill for two roles. Rejected.

## 3. Credit Balance Management (Internal Currency)

**Decision**: Store `creditBalance` as an integer column (in cents or smallest unit) on the User table. All transactions are recorded as separate Transaction rows. Balance updates use Drizzle's SQL `UPDATE ... SET creditBalance = creditBalance + amount` to avoid race conditions.

**Rationale**: Using an integer column avoids floating-point precision issues. Storing the balance directly on the User table provides O(1) reads for dashboard display. Using SQL arithmetic (`creditBalance = creditBalance + amount`) via Drizzle's `sql` template ensures atomic updates without needing a separate balance-reconciliation step. Transaction records provide full audit trail.

**Alternatives considered**:

- **Computed balance from transactions**: `SUM(transactions.amount)` on every read. Correct but slow for dashboards. Rejected for performance.
- **Separate Wallet table**: Normalized but over-engineered for 1:1 User:Wallet relationship. Rejected; store on User instead.
- **Decimal type**: SQLite doesn't have native decimal. Integer (cents) is the standard pattern. Selected.

## 4. Chart Library for Dashboards

**Decision**: Use `@mantine/charts` (which wraps Recharts) for all dashboard charts.

**Rationale**: The project already has `@mantine/charts` and `recharts` as dependencies. Mantine Charts provides a consistent API with the Mantine design system and theme integration. This aligns with Constitution Principle VI (Mantine-First UI).

**Alternatives considered**:

- **Raw Recharts**: Already available but requires manual styling. Mantine Charts provides better integration.
- **Chart.js / react-chartjs-2**: Not in dependencies. Would add a new dependency. Rejected.
- **D3**: Too low-level for this use case. Rejected.

## 5. Email Verification Enforcement

**Decision**: Leverage Better Auth's existing `requireEmailVerification: true` and `sendOnSignIn: true` configuration, which already blocks unverified users from accessing protected resources.

**Rationale**: The auth server (`auth.server.ts`) already configures `requireEmailVerification: true`. Better Auth will automatically redirect or block unverified users. The `emailVerified` field on the User schema is already present. The existing `check-email` route handles the post-signup verification flow. We just need to ensure route loaders check the auth session's `emailVerified` status and redirect accordingly.

**Alternatives considered**:

- **Custom middleware**: Not needed — Better Auth handles this natively.
- **Database-level enforcement**: Adding a column is redundant since Better Auth already tracks `emailVerified`.

## 6. Simulated Station API Design

**Decision**: Create a React Router resource route (`/api/stations`) that handles station listing and charging session start/stop. The "simulation" aspect means charging sessions transition from `in-progress` to `completed` based on a timer (configurable via constants, e.g., 30-120 seconds), not real hardware.

**Rationale**: A resource route keeps the simulation within the React Router architecture and uses existing server-side patterns. No external service dependency for v1. The session lifecycle (start → in-progress → completed) mirrors real-world behavior for demonstration purposes.

**Alternatives considered**:

- **External WebSocket service**: Too complex for v1; adds infra dependency.
- **Client-side timer only**: Loses server-side session state persistence. If user disconnects, session is lost. Rejected.

## 7. Database Seeding for Admin and Station Data

**Decision**: Create a `drizzle/seed.ts` script that seeds admin accounts and station data. Use Drizzle's `insert` API directly.

**Rationale**: The spec requires admin accounts to be created via seed script. Station data is read-only for v1. A single seed script handles both. This runs separately from migrations (via `pnpm db:seed` or similar).

**Alternatives considered**:

- **Migration-based seeding**: Drizzle migrations should be schema-only; data seeding is separate. Rejected mixing them.
- **Manual database editing**: Error-prone, not reproducible. Rejected.

## 8. User Profile and Avatar Handling

**Decision**: Use the existing `user` table fields (`name`, `email`, `image`) and add `phone` and `role` columns. Avatar uses URL-based image (stored as text) rather than file upload for v1 simplicity.

**Rationale**: The user schema already has `name`, `email`, `image`. Adding `phone` and extending `role` maintains the pattern. For v1, avatar as URL avoids building a file upload service. Users provide an image URL (or use a default avatar from Mantine).

**Alternatives considered**:

- **File upload for avatar**: Requires storage setup (S3, local disk), image processing, etc. Too complex for v1. Rejected.
- **Gravatar integration**: Adds external dependency. Rejected for v1.

## 9. Mock Payment Gateway for Top-ups

**Decision**: Use Stripe test mode (Stripe.js client + server-side test API keys) for the top-up payment flow. User enters amount, sees a simulated card payment form (Stripe Payment Element), and credits are added on "payment completion". No real charges occur.

**Rationale**: The spec clarification requires a mock payment gateway flow. Stripe's test mode provides realistic card form UX with zero cost. Using `@stripe/stripe-js` on the client and `stripe` server-side in test mode gives us a production-like payment flow without real transactions. The Stripe test API key is the only configuration needed.

**Alternatives considered**:

- **Direct credit (no payment form)**: Simplest but doesn't match the spec requirement for a mock payment flow. Rejected.
- **Custom payment form (fake card fields)**: Mantine TextInput fields for card number, expiry, CVV — easy to build but doesn't simulate real payment UX. Rejected in favor of Stripe's polished test form.
- **PayPal Sandbox**: Adds complexity and a second OAuth flow. Rejected.

## 10. Sidebar Navigation Layout

**Decision**: Create a shared `AppSidebar` component (`app/components/app-sidebar.tsx`) used in all authenticated route layouts. Contains navigation links (Dashboard, Wallet, Charging, Vehicles, Profile, Admin) and a "Sign out" action using Better Auth's `signOut`.

**Rationale**: Spec clarification FR-003b requires a sidebar with logout. Mantine v9 provides `AppShell` with `Navbar` component ideal for this pattern. The sidebar wraps all authenticated routes, avoiding per-page navigation duplication.

**Alternatives considered**:

- **Top navigation bar**: Less suitable for EV dashboard with multiple sections. Sidebar is standard for management apps.
- **Separate layout routes**: React Router 7 layout routes work but add nesting complexity. Using a shared component is simpler.

## 11. Dashboard Chart Filtering via URL Query Parameters

**Decision**: Dashboard loader reads `?period=day|week|month|year` from the URL query string. Aggregates transaction data server-side for the selected period and returns chart-ready data. Frontend uses React Router's `<Link>` or `useSearchParams` to update the URL.

**Rationale**: URL-based filtering is bookmarkable, shareable, and works with SSR. React Router 7 loaders have direct access to `request.url` for parsing query params. Server-side aggregation avoids shipping all transactions to the client.

**Alternatives considered**:

- **Client-side filtering**: Download all-time data and filter in browser. Simpler but doesn't scale and sends unnecessary data.
- **Separate API endpoint**: `/api/chart-data` resource route. Adds a route but no SSR benefit. Loader approach is more idiomatic React Router 7.

## 12. Session Expiry Handling

**Decision**: On session expiry (detected when Better Auth `getSession` returns null or throws), redirect to `/login` with a toast notification ("Session expired, please log in again"). Form state is not preserved.

**Rationale**: Spec clarification chose redirect + toast over form state preservation. React Router 7 loaders naturally detect expired sessions and can redirect. Mantine's `notifications` module provides the toast. Simpler than sessionStorage-based form preservation for v1.

**Alternatives considered**:

- **SessionStorage form preservation**: More user-friendly but adds significant complexity for v1. Defer to future iteration.
- **Silent redirect (no message)**: Poor UX — users may not understand why they were redirected. Rejected.
