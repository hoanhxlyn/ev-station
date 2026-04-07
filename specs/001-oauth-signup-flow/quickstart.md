# Quickstart: OAuth Signup Flow with Pre-filled Fields

**Feature**: 001-oauth-signup-flow
**Date**: 2026-04-07

## Overview

This feature modifies the authentication flow to support:

1. GitHub OAuth signup with pre-filled fields for new users
2. Immediate signin for OAuth users (no email verification)
3. Magic link email verification for manual signup users

## Prerequisites

- Node.js 18+
- pnpm
- GitHub OAuth app configured in `.env`:
  ```
  GITHUB_CLIENT_ID=your_client_id
  GITHUB_CLIENT_SECRET=your_client_secret
  BETTER_AUTH_URL=http://localhost:5173
  ```

## Key Changes

### Modified Files

| File                           | Change                                                              |
| ------------------------------ | ------------------------------------------------------------------- |
| `app/lib/auth.server.ts`       | Configure `disableImplicitSignUp` for GitHub, add magic link plugin |
| `app/lib/db/schema/user.ts`    | Add `signupMethod` column                                           |
| `app/routes/login/page.tsx`    | Add GitHub OAuth button                                             |
| `app/routes/signup/page.tsx`   | Handle pre-filled OAuth data                                        |
| `app/routes/signup/actions.ts` | Create OAuth accounts with immediate signin                         |
| `app/routes/signup/loader.ts`  | Check OAuth session state                                           |
| `app/schemas/auth.ts`          | Add OAuth pre-fill validation schema                                |

### New Files

| File                    | Purpose         |
| ----------------------- | --------------- |
| `app/test/auth.test.ts` | Auth flow tests |

## Development Workflow

### 1. Apply Database Migration

```bash
pnpm db:generate
pnpm db:push
```

### 2. Run Tests

```bash
pnpm test
```

### 3. Run Quality Gates

```bash
pnpm lint
pnpm typecheck
pnpm format
```

### 4. Start Development Server

```bash
pnpm dev
```

## Testing the Flows

### OAuth Signup (New User)

1. Click "Sign in with GitHub"
2. Authorize with GitHub
3. Verify redirect to `/signup` with email/name pre-filled
4. Submit form
5. Verify immediate redirect to `/dashboard` (no email sent)

### OAuth Signin (Existing User)

1. Click "Sign in with GitHub"
2. Authorize with GitHub
3. Verify immediate redirect to `/dashboard`

### Manual Signup

1. Fill email/password form on `/signup`
2. Submit form
3. Check console for magic link email
4. Click magic link
5. Verify redirect to login page
6. Sign in with credentials

## Verification Commands

```bash
# Check if migration created correctly
pnpm db:studio

# Run specific test file
pnpm test app/test/auth.test.ts

# Verify types
pnpm typecheck
```

## Common Issues

| Issue                       | Solution                                             |
| --------------------------- | ---------------------------------------------------- |
| OAuth redirect loop         | Check `BETTER_AUTH_URL` matches localhost:5173       |
| Magic link not appearing    | Check console logs (emails logged to console in dev) |
| "User already exists" error | Check if manual account with same email exists       |
