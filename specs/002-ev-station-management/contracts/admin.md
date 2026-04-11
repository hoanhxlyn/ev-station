# Admin Contract

**Branch**: `002-ev-station-management`

## Overview

Admin-only routes for system oversight: dashboard KPIs, cash flow charts, user management, and account lock/unlock.

## Routes

| Path                   | Method | Auth  | Description                                                |
| ---------------------- | ------ | ----- | ---------------------------------------------------------- |
| `/admin`               | GET    | ADMIN | Admin dashboard with KPI cards and cash flow chart         |
| `/admin/users`         | GET    | ADMIN | Paginated user list                                        |
| `/admin/users/:userId` | GET    | ADMIN | User detail (profile, vehicles, balance, charging history) |

## Loaders

### Admin Dashboard Loader (`/admin` GET)

**Auth**: Required (ADMIN role only, verified email)

**Response**:

```typescript
{
  totalUsers: number
  totalStations: number
  dailyTransactions: number
  cashFlowData: Array<{
    date: string
    topups: number
    payments: number
  }>
}
```

### Admin Users Loader (`/admin/users` GET)

**Auth**: Required (ADMIN role only)

**Query params**: `?page=1&search=&status=`

**Response**:

```typescript
{
  users: Array<User & { vehicleCount: number; totalDebt: number }>
  totalCount: number
  currentPage: number
  totalPages: number
}
```

### Admin User Detail Loader (`/admin/users/:userId` GET)

**Auth**: Required (ADMIN role only)

**Response**:

```typescript
{
  user: User;
  vehicles: Vehicle[];
  transactions: Transaction[];
  chargingSessions: ChargingSession[];
  balance: number;
}
```

## Actions

### Lock/Unlock User Account (`/admin/users/:userId` POST, intent: "toggle-lock")

**Request**:

```typescript
{
  userId: string // Zod: required, must exist
}
```

**Pre-conditions**:

- Target user exists
- Target user is not an admin (admins cannot lock other admins)
- Current user is admin

**Side effects**:

- Toggle `user.status` between `'active'` and `'locked'`
- If locking: any active charging sessions are cancelled
- Create log entry (via Consola logger)

**Response (success)**: Redirect to `/admin/users/:userId` with success toast
**Response (error)**: `{ errors: { form: ["Cannot lock admin accounts."] } }`

## Zod Schema Location

`app/schemas/admin.ts`
