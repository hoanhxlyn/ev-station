# Data Model: EV Station Management System

**Branch**: `002-ev-station-management`
**Date**: 2026-04-11

## Entity Relationship Diagram

```text
┌──────────────┐       ┌─────────────┐       ┌─────────────────────┐
│    Station    │       │    Vehicle   │       │     Transaction    │
│──────────────│       │─────────────│       │─────────────────────│
│ id (PK)      │       │ id (PK)     │       │ id (PK)             │
│ name         │       │ licensePlate│       │ userId (FK → User)  │
│ location     │       │ brand       │       │ type                 │
│ status       │       │ model       │       │ amount               │
│ powerOutput  │       │ batteryCap  │       │ description          │
└──────┬───────┘       │ userId (FK) │       │ createdAt            │
       │               └──────┬──────┘       └─────────────────────┘
       │                      │                        │
       │                      │                        │
┌──────┴──────────────────────┴────────────────────────┴──┐
│                         User                              │
│───────────────────────────────────────────────────────────│
│ id (PK)                                                   │
│ name, email, username, phone, image                      │
│ role (USER | ADMIN)                                       │
│ creditBalance (integer, cents)                             │
│ emailVerified, isNew, signupMethod, status (active|locked) │
│ createdAt, updatedAt                                       │
└──────────────────────────────────────────────────────────┘
       │
       │
┌──────┴──────────────────┐
│   ChargingSession       │
│─────────────────────────│
│ id (PK)                 │
│ userId (FK → User)      │
│ stationId (FK → Station)│
│ vehicleId (FK → Vehicle)│
│ status (in-progress|completed|cancelled)│
│ startAt                 │
│ endAt                   │
│ energyConsumed          │
│ cost (integer, cents)   │
│ createdAt               │
│ updatedAt               │
└─────────────────────────┘
```

## Tables

### User (extend existing)

The existing `user` table already has `id`, `name`, `email`, `username`, `displayUsername`, `emailVerified`, `image`, `dateOfBirth`, `isNew`, `signupMethod`, `createdAt`, `updatedAt`.

**New columns to add:**

| Column          | Type      | Constraints                | Notes                                                                      |
| --------------- | --------- | -------------------------- | -------------------------------------------------------------------------- |
| `role`          | `text`    | NOT NULL, DEFAULT 'user'   | Enum: `'user'` or `'admin'`. Seed script sets admin accounts to `'admin'`. |
| `phone`         | `text`    | Nullable                   | User phone number                                                          |
| `creditBalance` | `integer` | NOT NULL, DEFAULT 0        | Internal credits in smallest unit (cents). Negative values indicate debt.  |
| `status`        | `text`    | NOT NULL, DEFAULT 'active' | Enum: `'active'` or `'locked'`. Admin can lock/unlock.                     |

**Note**: `image` field (already exists) stores avatar URL. No file upload needed.

### Vehicle (new)

| Column            | Type                     | Constraints                                            | Notes                                    |
| ----------------- | ------------------------ | ------------------------------------------------------ | ---------------------------------------- |
| `id`              | `text`                   | PK                                                     | UUID-like string                         |
| `licensePlate`    | `text`                   | NOT NULL                                               | Vehicle license plate                    |
| `brand`           | `text`                   | NOT NULL                                               | Vehicle brand (e.g., "Tesla", "VinFast") |
| `model`           | `text`                   | NOT NULL                                               | Vehicle model (e.g., "Model 3", "VF8")   |
| `batteryCapacity` | `integer`                | NOT NULL                                               | Battery capacity in kWh                  |
| `userId`          | `text`                   | FK → `user.id`, ON DELETE CASCADE, NOT NULL            | Owner reference                          |
| `createdAt`       | `integer (timestamp_ms)` | NOT NULL, DEFAULT current timestamp                    |                                          |
| `updatedAt`       | `integer (timestamp_ms)` | NOT NULL, DEFAULT current timestamp, ON UPDATE current |                                          |

**Indexes**: `vehicle_userId_idx` on `userId`

### Transaction (new)

| Column              | Type                     | Constraints                                 | Notes                                                                                 |
| ------------------- | ------------------------ | ------------------------------------------- | ------------------------------------------------------------------------------------- |
| `id`                | `text`                   | PK                                          | UUID-like string                                                                      |
| `userId`            | `text`                   | FK → `user.id`, ON DELETE CASCADE, NOT NULL | Reference user                                                                        |
| `type`              | `text`                   | NOT NULL                                    | Enum: `'top-up'`, `'charging-payment'`, `'debt-repayment'`                            |
| `amount`            | `integer`                | NOT NULL                                    | Credit amount in cents. Positive for top-up/repayment, negative for charging payment. |
| `description`       | `text`                   | Nullable                                    | Human-readable description                                                            |
| `chargingSessionId` | `text`                   | FK → `chargingSession.id`, Nullable         | Reference to charging session (null for top-ups)                                      |
| `createdAt`         | `integer (timestamp_ms)` | NOT NULL, DEFAULT current timestamp         |                                                                                       |

**Indexes**: `transaction_userId_idx` on `userId`, `transaction_createdAt_idx` on `createdAt`

### ChargingSession (new)

| Column           | Type                     | Constraints                                            | Notes                                               |
| ---------------- | ------------------------ | ------------------------------------------------------ | --------------------------------------------------- |
| `id`             | `text`                   | PK                                                     | UUID-like string                                    |
| `userId`         | `text`                   | FK → `user.id`, ON DELETE CASCADE, NOT NULL            | Reference user                                      |
| `stationId`      | `text`                   | FK → `station.id`, NOT NULL                            | Reference station                                   |
| `vehicleId`      | `text`                   | FK → `vehicle.id`, NOT NULL                            | Reference vehicle                                   |
| `status`         | `text`                   | NOT NULL, DEFAULT 'in-progress'                        | Enum: `'in-progress'`, `'completed'`, `'cancelled'` |
| `startAt`        | `integer (timestamp_ms)` | NOT NULL, DEFAULT current timestamp                    | Session start time                                  |
| `endAt`          | `integer (timestamp_ms)` | Nullable                                               | Session end time (null while in-progress)           |
| `energyConsumed` | `integer`                | Nullable                                               | Energy consumed in Wh (set on completion)           |
| `cost`           | `integer`                | Nullable                                               | Cost in credits/cents (set on completion)           |
| `createdAt`      | `integer (timestamp_ms)` | NOT NULL, DEFAULT current timestamp                    |                                                     |
| `updatedAt`      | `integer (timestamp_ms)` | NOT NULL, DEFAULT current timestamp, ON UPDATE current |                                                     |

**Indexes**: `chargingSession_userId_idx` on `userId`, `chargingSession_stationId_idx` on `stationId`, `chargingSession_status_idx` on `status`

### Station (new)

| Column        | Type                     | Constraints                                            | Notes                                          |
| ------------- | ------------------------ | ------------------------------------------------------ | ---------------------------------------------- |
| `id`          | `text`                   | PK                                                     | UUID-like string                               |
| `name`        | `text`                   | NOT NULL                                               | Station display name                           |
| `location`    | `text`                   | NOT NULL                                               | Station address/description                    |
| `status`      | `text`                   | NOT NULL, DEFAULT 'available'                          | Enum: `'available'`, `'occupied'`, `'offline'` |
| `powerOutput` | `integer`                | NOT NULL                                               | Charging power in kW                           |
| `pricePerKwh` | `integer`                | NOT NULL                                               | Price per kWh in credits/cents                 |
| `createdAt`   | `integer (timestamp_ms)` | NOT NULL, DEFAULT current timestamp                    |                                                |
| `updatedAt`   | `integer (timestamp_ms)` | NOT NULL, DEFAULT current timestamp, ON UPDATE current |                                                |

**Seed data**: Stations are seeded and read-only in v1. No CRUD routes for stations.

## Relations

```typescript
// relations.ts additions
userRelations: one user has many:
  - vehicles
  - transactions
  - chargingSessions

vehicleRelations: one vehicle belongs to one user, has many:
  - chargingSessions

stationRelations: one station has many:
  - chargingSessions

chargingSessionRelations: one session belongs to one user, one station, one vehicle, has many:
  - transactions

transactionRelations: one transaction belongs to one user, optionally belongs to one chargingSession
```

## State Transitions

### ChargingSession Status

```text
[none] → in-progress (user starts session)
in-progress → completed (session ends, cost deducted from creditBalance)
in-progress → cancelled (user/admin cancels, no cost deducted)
```

### User Account Status

```text
[created] → active (email verified)
active → locked (admin locks)
locked → active (admin unlocks)
```

### User Role

```text
[created via signup] → role = 'user' (always)
[created via seed] → role = 'admin' (seed script only)
```

Role cannot be changed through the UI in v1.

## Validation Rules

| Entity          | Field           | Rule                                                                                                                                                            |
| --------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| User            | phone           | Optional, 8-15 digits                                                                                                                                           |
| User            | creditBalance   | Read-only on user side; server-side updates only                                                                                                                |
| Vehicle         | licensePlate    | Required, 4-20 chars                                                                                                                                            |
| Vehicle         | brand           | Required, 1-50 chars                                                                                                                                            |
| Vehicle         | model           | Required, 1-50 chars                                                                                                                                            |
| Vehicle         | batteryCapacity | Required, positive integer, 10-500 (kWh)                                                                                                                        |
| Transaction     | type            | Must be one of: `'top-up'`, `'charging-payment'`, `'debt-repayment'`                                                                                            |
| Transaction     | amount          | For top-up: positive integer, min 1000 (10 credits). For debt-repayment: positive, max = abs(current debt). For charging-payment: negative (server-calculated). |
| ChargingSession | stationId       | Must reference an existing station                                                                                                                              |
| ChargingSession | vehicleId       | Must reference a vehicle owned by the user                                                                                                                      |
| Station         | name            | Required, 1-100 chars                                                                                                                                           |
| Station         | location        | Required, 1-200 chars                                                                                                                                           |
| Station         | powerOutput     | Required, positive integer                                                                                                                                      |
| Station         | pricePerKwh     | Required, positive integer                                                                                                                                      |

## Configuration Constants

| Constant      | Location                      | Value                                                           |
| ------------- | ----------------------------- | --------------------------------------------------------------- |
| `DEBT_LIMIT`  | `app/constants/dashboard.ts`  | Max negative credit balance (e.g., -50000 cents = -500 credits) |
| `MIN_TOP_UP`  | `app/constants/validation.ts` | Minimum top-up amount (e.g., 1000 cents = 10 credits)           |
| `CREDIT_UNIT` | `app/constants/dashboard.ts`  | Display label and divisor for credit amounts                    |

## Multi-User Scenarios

- **Concurrent balance updates**: Use SQL atomic updates (`creditBalance = creditBalance + amount`) to prevent race conditions.
- **Station occupancy**: When a charging session starts, station status changes to `'occupied'`. When session ends, station status reverts to `'available'`.
- **Debt check**: Before allowing a charging session, compare `creditBalance` against `DEBT_LIMIT`. If `creditBalance <= DEBT_LIMIT`, block session start.
