# Research: OAuth Signup Flow with Pre-filled Fields

**Feature**: 001-oauth-signup-flow
**Date**: 2026-04-07
**Status**: Complete

## Research Questions

### RQ1: How does Better Auth handle GitHub OAuth with new user detection?

**Finding**: Better Auth's `signIn.social()` supports `newUserCallbackURL` option which redirects new users to a specific URL. When an OAuth callback completes, Better Auth automatically creates the user if `disableImplicitSignUp` is not set.

**Decision**: Use `newUserCallbackURL: "/signup"` to redirect new OAuth users to the signup page with pre-filled data.

**Rationale**: This aligns with the requirement that new OAuth users should see a pre-filled signup form.

**Alternatives Considered**:

- Custom OAuth callback route: More complex, bypasses Better Auth conventions
- `disableImplicitSignUp: true`: Would require manual account creation, more code

---

### RQ2: How to pass pre-filled OAuth data to the signup page?

**Finding**: Better Auth stores OAuth session state. After OAuth callback, the `authClient.getSession()` can retrieve user info (email, name) from the OAuth provider. The signup page loader should check for existing OAuth session and extract pre-filled data.

**Decision**: In the signup page loader, call `authClient.getSession()` to retrieve OAuth user info and pass to the page as pre-filled values.

**Rationale**: This keeps the OAuth data retrieval in the loader (server-side) rather than exposing tokens to the client.

**Alternatives Considered**:

- URL query parameters: Less secure, exposes data in URLs
- Cookies: More complex session management

---

### RQ3: How to prevent magic link email for OAuth users?

**Finding**: Better Auth's `signUp.email()` sends verification email automatically. For OAuth users, we need to create the account with `isEmailVerified: true` and skip the verification step.

**Decision**: When processing OAuth signup form submission, use `authClient.signUp.email()` with the OAuth user's email/name, but additionally call `authClient.sendVerificationEmail()` and immediately verify if the OAuth provider already verified the email. Actually, for OAuth accounts, the email is already considered verified since the OAuth provider verified it.

**Implementation Note**: Better Auth's internal `user` table has `emailVerified` field. For OAuth accounts created via Better Auth, this is set to `true` automatically because OAuth providers verify email.

**Rationale**: OAuth providers (GitHub) verify email during OAuth flow, so no additional verification needed.

---

### RQ4: How to check if user exists before OAuth signup?

**Finding**: Better Auth creates OAuth accounts automatically via the callback. To check if user exists, we need to either:

1. Query the database directly to check if email exists
2. Use `disableImplicitSignUp` and handle account creation manually

**Decision**: Use `disableImplicitSignUp: true` on the GitHub provider configuration. This prevents automatic account creation. On the callback, check if user exists in database:

- If exists: Sign in directly
- If not: Redirect to `/signup` with OAuth data pre-filled

**Rationale**: Gives us full control over the user existence check and signup flow.

**Alternatives Considered**:

- Default Better Auth behavior with `newUserCallbackURL`: Works but doesn't allow checking for manual account conflicts (FR-008)

---

### RQ5: How to handle magic link for manual signup?

**Finding**: Better Auth's magic link plugin (`better-auth/plugins/magic-link`) supports `expiresIn` configuration (default 300 seconds = 5 minutes). The spec requires 10 minutes.

**Decision**: Configure magic link plugin with `expiresIn: 600` (10 minutes in seconds). Use `sendMagicLink` in the signup action.

**Rationale**: Aligns with the clarification that magic link expires in 10 minutes.

---

## Technical Approach Summary

### OAuth Flow

1. User clicks "Sign in with GitHub" → `authClient.signIn.social({ provider: "github", newUserCallbackURL: "/signup" })`
2. GitHub OAuth completes → Callback at `/api/auth/callback/github`
3. **If `disableImplicitSignUp: true`**: Callback handler checks if user exists:
   - User exists (by email): Sign in directly, redirect to `/dashboard`
   - User doesn't exist: Redirect to `/signup` with OAuth session data
4. **If `disableImplicitSignUp: false`** (default): Better Auth creates account automatically, then redirects to `newUserCallbackURL`

### Signup Page (OAuth pre-filled)

1. Loader calls `authClient.getSession()` to get OAuth user info
2. Page renders form with email/name pre-filled (read-only or editable based on UX choice)
3. On submit:
   - Create account with `isEmailVerified: true` (OAuth email already verified)
   - Immediately sign in via `authClient.signIn.email()`
   - Redirect to `/dashboard`

### Manual Signup Flow

1. User submits email/password form
2. Action calls `authClient.signUp.email()` → triggers verification email
3. User clicks magic link → `authClient.magicLink.verify()` → account activated
4. User can then sign in via `authClient.signIn.email()`

### Account Conflict Handling (FR-008)

When OAuth callback checks user existence:

- If email exists with `signupMethod: "manual"`: Reject OAuth signup, show error message that user must use manual credentials
- If email exists with `signupMethod: "oauth"`: Sign in directly (same OAuth provider)

## Verification

All research questions resolved. Implementation approach defined.

## References

- Better Auth Social Providers: `/better-auth/better-auth` documentation
- Magic Link Plugin: `better-auth/plugins/magic-link`
- OAuth Callback: `/sign-in/oauth2` endpoint
