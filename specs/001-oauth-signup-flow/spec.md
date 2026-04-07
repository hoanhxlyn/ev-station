# Feature Specification: OAuth Signup Flow with Pre-filled Fields

**Feature Branch**: `001-oauth-signup-flow`
**Created**: 2026-04-07
**Status**: Draft
**Input**: User description: "User signin through oauth provider has to check the db for existence. If user doesn't signup before, they need to go through signup step but with some fields being filed for them. After that when the submission success, they don;t need to receive a magic link and can proceed to the signin immediately. For user that create manually, they have to confirm by click the magic link that sent to them"

## Clarifications

### Session 2026-04-07

- Q: OAuth provider returns no email → A: Reject signup with message explaining provider didn't provide email; user must sign up manually or use different provider.
- Q: Magic link expiry time → A: 10 minutes.
- Q: OAuth provider service outage handling → A: Show user-friendly error message; sign-in with GitHub unavailable, try later or use manual signup.
- Q: User account state lifecycle → A: Two states: Unverified (cannot sign in), Verified (full access).
- Q: Feature scope boundaries → A: Mobile app OAuth not in scope; only GitHub provider; no social sharing or OAuth account linking.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - OAuth User Signs Up for First Time (Priority: P1)

A user clicks "Sign in with GitHub", authenticates with GitHub OAuth, but has no account yet. The system redirects them to signup with their GitHub email and name pre-filled. Upon submitting the signup form, the system creates the account and immediately signs them in—no magic link email required.

**Why this priority**: This is the core OAuth signup flow that enables frictionless account creation for OAuth users.

**Independent Test**: Can be fully tested by simulating a new OAuth user (unverified email in database) completing signup and verifying they are signed in without receiving a magic link email.

**Acceptance Scenarios**:

1. **Given** a user authenticates via OAuth provider with email "user@example.com" and name "Jane Doe", **When** the system checks the database and finds no existing account, **Then** the user is redirected to signup with email "user@example.com" and name "Jane Doe" pre-filled.

2. **Given** a new OAuth user is on the pre-filled signup page, **When** they submit the form, **Then** an account is created and the user is immediately signed in without sending a magic link email.

3. **Given** a new OAuth user completes signup, **When** they are signed in, **Then** they can access protected dashboard content immediately.

---

### User Story 2 - OAuth User Signs In (Priority: P1)

A user who already has an account (created via OAuth signup) clicks "Sign in with GitHub". The system verifies their account exists and signs them in directly.

**Why this priority**: Returning OAuth users should have seamless signin without unnecessary steps.

**Independent Test**: Can be fully tested by simulating an existing OAuth user completing signin and verifying they are redirected to the protected area.

**Acceptance Scenarios**:

1. **Given** a user with an existing OAuth account authenticates via the same OAuth provider, **When** the system checks the database and finds the existing account, **Then** the user is signed in directly.

2. **Given** a signed-in OAuth user, **When** they visit the login page, **Then** they are redirected to the protected dashboard (already authenticated).

---

### User Story 3 - Manual Signup with Email Verification (Priority: P2)

A user creates an account manually by entering email and password. The system sends a magic link to verify their email. Upon clicking the link, their account is activated and they can sign in.

**Why this priority**: Manual signup users require email verification for account security—this is a standard practice.

**Independent Test**: Can be fully tested by simulating a manual signup, receiving a magic link, clicking it, and verifying account activation.

**Acceptance Scenarios**:

1. **Given** a user submits the manual signup form with email "manual@example.com", **When** the system creates the account, **Then** a magic link email is sent to "manual@example.com" and the account is marked unverified.

2. **Given** a manual signup user receives the magic link email, **When** they click the link within 10 minutes, **Then** their account is activated and they are redirected to the login page.

3. **Given** a manual signup user tries to sign in before clicking the magic link, **When** they attempt to authenticate, **Then** the system denies access and prompts them to verify their email.

---

### Edge Cases

- What happens when the OAuth provider returns an email that is already registered via manual signup? → FR-008 applies (prevent OAuth signup)
- How does the system handle expired or invalid magic links? → Show error; user can request new magic link
- What happens when an OAuth user tries to signup but the pre-filled email is already taken? → FR-008 applies (conflict prevented)
- How does the system handle OAuth provider service outages during signin? → FR-010 applies (user-friendly error)

---

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST check for existing user account when OAuth authentication completes, using email from OAuth provider as the unique identifier.

- **FR-002**: System MUST redirect new OAuth users to signup page with email and name pre-filled from the OAuth provider.

- **FR-003**: System MUST create account and sign in OAuth users immediately upon signup form submission without sending verification email.

- **FR-004**: System MUST send magic link email to users who sign up manually (email/password).

- **FR-005**: System MUST require manual signup users to click magic link before allowing signin.

- **FR-006**: System MUST mark OAuth accounts as pre-verified (no email verification required).

- **FR-007**: System MUST allow existing OAuth users to sign in directly without additional steps.

- **FR-008**: System MUST prevent OAuth signup when the email address already exists via manual account; user must continue using their manual credentials.

- **FR-009**: System MUST reject OAuth signup and display error message when OAuth provider does not return email address; user must sign up manually or use different provider.

- **FR-010**: System MUST display user-friendly error when OAuth provider is unavailable; user may retry or use manual signup instead.

### Key Entities _(include if feature involves data)_

- **User**: Represents an authenticated user. Attributes: id, email, name, signupMethod ("oauth" | "manual"), isEmailVerified (true for OAuth accounts on creation; false for manual accounts until verified), state ("unverified" | "verified"), createdAt, updatedAt.

- **OAuthAccount**: Links OAuth provider identity to a user. Attributes: id, userId (FK), provider, providerUserId, createdAt.

---

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: New OAuth users can complete account creation and access protected content in under 30 seconds from clicking "Sign in with GitHub".

- **SC-002**: Returning OAuth users can sign in and access protected content in under 5 seconds.

- **SC-003**: Manual signup users receive magic link within 60 seconds of form submission.

- **SC-004**: 100% of manual signup accounts are email-verified before allowing signin access.

- **SC-005**: OAuth signup flow produces zero bounce rate due to email verification friction (users are not asked to verify email).

---

## Out of Scope

- Mobile app OAuth (web app only)
- OAuth providers other than GitHub
- Social sharing features
- OAuth account linking to existing manual accounts
- Account recovery via OAuth

## Assumptions

- OAuth provider used is GitHub (as configured in existing project).
- Magic link emails are logged to console in development environment.
- Magic link tokens expire after 10 minutes.
- OAuth provider returns email and name scope permissions.
- Email uniqueness is enforced at the database level.
- Session management is handled by the existing Better Auth implementation.
