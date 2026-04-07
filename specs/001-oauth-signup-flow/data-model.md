# Data Model: OAuth Signup Flow

**Feature**: 001-oauth-signup-flow
**Date**: 2026-04-07

## Entity Changes

### User (existing table, modified)

| Field         | Type                   | Constraints                | Description                             |
| ------------- | ---------------------- | -------------------------- | --------------------------------------- |
| id            | text                   | PK                         | Unique identifier                       |
| name          | text                   | NOT NULL                   | User display name                       |
| email         | text                   | NOT NULL, UNIQUE           | User email address                      |
| username      | text                   | UNIQUE                     | Optional username                       |
| emailVerified | integer (boolean)      | NOT NULL, DEFAULT false    | Email verified status                   |
| isNew         | integer (boolean)      | NOT NULL, DEFAULT true     | First-time user flag                    |
| signupMethod  | text                   | NOT NULL, DEFAULT 'manual' | How user signed up: 'oauth' or 'manual' |
| createdAt     | integer (timestamp_ms) | NOT NULL                   | Creation timestamp                      |
| updatedAt     | integer (timestamp_ms) | NOT NULL                   | Last update timestamp                   |

**State Machine**: User.state derived from emailVerified:

- `unverified`: emailVerified = false (cannot sign in)
- `verified`: emailVerified = true (full access)

### Account (existing table, unchanged)

| Field                 | Type                   | Constraints            | Description                           |
| --------------------- | ---------------------- | ---------------------- | ------------------------------------- |
| id                    | text                   | PK                     | Unique identifier                     |
| accountId             | text                   | NOT NULL               | Provider-specific account ID          |
| providerId            | text                   | NOT NULL               | OAuth provider (e.g., "github")       |
| userId                | text                   | FK → user.id, NOT NULL | Associated user                       |
| accessToken           | text                   |                        | OAuth access token                    |
| refreshToken          | text                   |                        | OAuth refresh token                   |
| idToken               | text                   |                        | OAuth ID token                        |
| accessTokenExpiresAt  | integer (timestamp_ms) |                        | Token expiry                          |
| refreshTokenExpiresAt | integer (timestamp_ms) |                        | Refresh token expiry                  |
| scope                 | text                   |                        | OAuth scopes                          |
| password              | text                   |                        | Hashed password (for manual accounts) |
| createdAt             | integer (timestamp_ms) | NOT NULL               | Creation timestamp                    |
| updatedAt             | integer (timestamp_ms) | NOT NULL               | Last update timestamp                 |

### Session (existing table, unchanged)

Standard session table for authenticated users.

### Verification (existing table, unchanged)

Stores verification tokens including magic link tokens.

## Validation Rules

From Functional Requirements:

| ID     | Rule                                           | Implementation                                              |
| ------ | ---------------------------------------------- | ----------------------------------------------------------- |
| FR-001 | Check existing user by email on OAuth callback | Query user table by email in OAuth callback                 |
| FR-003 | OAuth users signed in immediately              | Set emailVerified = true for OAuth accounts                 |
| FR-005 | Manual users must verify email before signin   | Check emailVerified = true on signin                        |
| FR-006 | OAuth accounts pre-verified                    | Set emailVerified = true when creating via OAuth            |
| FR-008 | Prevent OAuth signup if manual account exists  | Check signupMethod before allowing OAuth signup             |
| FR-009 | Reject OAuth if provider doesn't return email  | Validate email presence in OAuth callback                   |
| FR-010 | Handle OAuth provider outage                   | Catch errors in OAuth callback, display user-friendly error |

## Relationships

- User has many Account (one per OAuth provider)
- User has many Session
- Account belongs to User
- Session belongs to User

## Migration Notes

1. Add `signupMethod` column to user table with default 'manual'
2. Backfill existing users with 'manual' signupMethod
3. Set signupMethod = 'oauth' for users who have OAuth accounts

## Key Queries

### Check if email exists (FR-001, FR-008)

```sql
SELECT * FROM user WHERE email = ?;
```

### Check if OAuth account exists (FR-007)

```sql
SELECT u.* FROM user u
JOIN account a ON u.id = a.userId
WHERE a.providerId = 'github' AND a.accountId = ?;
```

### Create OAuth user with pre-verified email (FR-003, FR-006)

```sql
INSERT INTO user (id, name, email, emailVerified, signupMethod, isNew, createdAt, updatedAt)
VALUES (?, ?, ?, true, 'oauth', false, ?, ?);
```
