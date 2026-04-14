# Charging Session Contract

**Branch**: `002-ev-station-management`

## Overview

Charging sessions represent a user charging their vehicle at a station. Sessions are started and completed via the simulated station API. The "simulation" means sessions transition from `in-progress` to `completed` after a configurable duration (30–120 seconds) rather than real hardware interaction.

## Routes

| Path        | Method | Auth  | Description                                                   |
| ----------- | ------ | ----- | ------------------------------------------------------------- |
| `/charging` | GET    | USER+ | Charging session dashboard (start, view active, view history) |

## Loaders

### Charging Page Loader (`/charging` GET)

**Auth**: Required (USER or ADMIN role, verified email, active status)

**Response**:

```typescript
{
  activeSession: ChargingSession | null;
  recentSessions: ChargingSession[];
  stations: Station[];
  vehicles: Vehicle[];
}
```

## Actions

### Start Charging Session (`/charging` POST, intent: "start")

**Request**:

```typescript
{
  stationId: string // Zod: required, must reference existing station
  vehicleId: string // Zod: required, must reference vehicle owned by user
}
```

**Pre-conditions**:

- User has no other `in-progress` session
- User status is `active`
- `creditBalance > DEBT_LIMIT` (not at debt limit)
- Station `status === 'available'`
- Vehicle belongs to the current user

**Response (success)**: Redirect to `/charging` with active session displayed
**Response (validation error)**: `{ errors: { field: [message] } }`
**Response (debt limit)**: `{ errors: { form: ["Insufficient credits. Please top up first."] } }`
**Response (no vehicles)**: `{ errors: { vehicleId: ["Please add a vehicle first."] } }`

### End Charging Session (`/charging` POST, intent: "end")

**Request**:

```typescript
{
  sessionId: string // Zod: required, must reference user's active session
}
```

**Side effects**:

- Calculate `energyConsumed` and `cost` based on simulated duration and station `pricePerKwh`
- Set session `status` to `completed`, set `endAt` and `energyConsumed` and `cost`
- Deduct `cost` from user's `creditBalance` (atomic: `creditBalance = creditBalance - cost`)
- Create a `Transaction` record with `type: 'charging-payment'`, `amount: -cost`
- Update station `status` back to `'available'`

**Response (success)**: Redirect to `/charging` with completed session summary
**Response (error)**: `{ errors: { form: ["Failed to end session."] } }`

### Cancel Charging Session (`/charging` POST, intent: "cancel")

**Request**:

```typescript
{
  sessionId: string
}
```

**Side effects**:

- Set session `status` to `cancelled`
- Set `endAt` to current timestamp
- No charge deducted (energy is 0, cost is 0)
- Update station `status` back to `'available'`

**Response (success)**: Redirect to `/charging`

## Simulated Session Logic

When a session starts:

1. Station status changes to `'occupied'`
2. User manually ends the session by clicking "End Session"
3. On completion, `energyConsumed` is calculated based on session duration and station `powerOutput`, and `cost = energyConsumed * pricePerKwh / 1000` (converted to cents)

## Zod Schema Location

`app/schemas/charging-session.ts`
