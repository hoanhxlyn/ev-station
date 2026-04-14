# Auth Contract

**Branch**: `002-ev-station-management`

## Overview

Authentication uses Better Auth with email/password and GitHub OAuth. Email verification is required before dashboard access.

## Routes

| Path                  | Method | Auth        | Description                                                 |
| --------------------- | ------ | ----------- | ----------------------------------------------------------- |
| `/login`              | GET    | Public      | Login page with email/password form and GitHub OAuth button |
| `/signup`             | GET    | Public      | Registration page                                           |
| `/signup/check-email` | GET    | Public      | Post-registration email verification notice                 |
| `/api/auth/*`         | ALL    | Better Auth | Better Auth catch-all API route                             |

## Actions

### Signup Action (`/signup` POST)

**Request**:

```typescript
{
  email: string // Zod: email format, required
  password: string // Zod: min 8 chars, required
  name: string // Zod: 1-100 chars, required
  username: string // Zod: 3-30 chars, alphanumeric+underscore
}
```

**Response (success)**: Redirect to `/signup/check-email`
**Response (validation error)**: `{ errors: { field: [message] } }`
**Response (duplicate email)**: Generic message (no email existence disclosure)

### Login Action (`/login` POST)

**Request**:

```typescript
{
  email: string // Zod: email format, required
  password: string // Zod: required
}
```

**Response (success)**: Redirect to `/app` (user) or `/admin` (admin)
**Response (unverified)**: Redirect to `/signup/check-email` with notice
**Response (invalid credentials)**: `{ errors: { email: ["Invalid email or password"] } }`

### Email Verification

Handled by Better Auth magic link mechanism. After verification:

- `user.emailVerified` set to `true`
- `user.isNew` set to `false`
- User can access dashboard routes

### Auth Guards (Route Loaders)

```typescript
// Auth guard pattern for protected routes
if (!session) redirect(ROUTES.LOGIN)
if (!session.user.emailVerified) redirect(ROUTES.SIGNUP_CHECK_EMAIL)
// Role check for admin routes
if (session.user.role !== 'admin') throw new Response(null, { status: 403 })
// Status check
if (session.user.status === 'locked') throw new Response(null, { status: 403 })
```

## Role-Based Access

| Route Pattern                                                         | Required Role | Guard Location |
| --------------------------------------------------------------------- | ------------- | -------------- |
| `/app`, `/dashboard`, `/wallet`, `/charging`, `/vehicles`, `/profile` | USER or ADMIN | Route loader   |
| `/admin/*`                                                            | ADMIN only    | Route loader   |

## Seed Data

Admin accounts created via `drizzle/seed.ts`:

```typescript
{
  name: 'Admin',
  email: 'admin@evstation.local',
  role: 'admin',
  emailVerified: true,
  status: 'active',
  creditBalance: 0
}
```
