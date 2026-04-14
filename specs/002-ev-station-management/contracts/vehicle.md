# Vehicle Contract

**Branch**: `002-ev-station-management`

## Overview

Users can manage their registered EV vehicles (add, edit, delete). A user can have multiple vehicles. Vehicles are required to start a charging session.

## Routes

| Path        | Method | Auth  | Description                      |
| ----------- | ------ | ----- | -------------------------------- |
| `/vehicles` | GET    | USER+ | Vehicle list and management page |

## Loaders

### Vehicles Page Loader (`/vehicles` GET)

**Auth**: Required (USER or ADMIN role, verified email, active status)

**Response**:

```typescript
{
  vehicles: Vehicle[];
}
```

## Actions

### Add Vehicle (`/vehicles` POST, intent: "add")

**Request**:

```typescript
{
  licensePlate: string // Zod: required, 4-20 chars
  brand: string // Zod: required, 1-50 chars
  model: string // Zod: required, 1-50 chars
  batteryCapacity: number // Zod: required, integer, 10-500 (kWh)
}
```

**Side effects**: Create `Vehicle` record linked to current user.

**Response (success)**: Redirect to `/vehicles` with success toast
**Response (validation error)**: `{ errors: { field: [message] } }`

### Edit Vehicle (`/vehicles` POST, intent: "edit")

**Request**:

```typescript
{
  vehicleId: string // Zod: required, must belong to current user
  licensePlate: string // Zod: same as add
  brand: string // Zod: same as add
  model: string // Zod: same as add
  batteryCapacity: number // Zod: same as add
}
```

**Pre-conditions**: `vehicleId` must reference a vehicle owned by the current user.

**Side effects**: Update `Vehicle` record.

**Response (success)**: Redirect to `/vehicles` with success toast

### Delete Vehicle (`/vehicles` POST, intent: "delete")

**Request**:

```typescript
{
  vehicleId: string // Zod: required, must belong to current user
}
```

**Pre-conditions**: Vehicle must not have any `in-progress` charging sessions.

**Side effects**: Delete `Vehicle` record (cascade: associated charging sessions retain vehicle reference but vehicle is removed).

**Response (success)**: Redirect to `/vehicles` with success toast
**Response (in-use error)**: `{ errors: { vehicleId: ["Cannot delete vehicle with active charging session."] } }`

## Zod Schema Location

`app/schemas/vehicle.ts`
