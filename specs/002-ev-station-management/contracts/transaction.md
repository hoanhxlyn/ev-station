# Transaction Contract

**Branch**: `002-ev-station-management`

## Overview

Transactions track all credit movements: top-ups, charging payments, and debt repayments. All amounts are stored as integers in cents (internal credits, not real currency).

## Routes

| Path      | Method | Auth  | Description                                                            |
| --------- | ------ | ----- | ---------------------------------------------------------------------- |
| `/wallet` | GET    | USER+ | Wallet page with balance display, top-up form, and transaction history |

## Loaders

### Wallet Page Loader (`/wallet` GET)

**Auth**: Required (USER or ADMIN role, verified email, active status)

**Response**:

```typescript
{
  balance: number;          // Current credit balance in cents
  isInDebt: boolean;        // Whether balance < 0
  transactions: Transaction[];  // Paginated transaction history
}
```

## Actions

### Top-Up Credits (`/wallet` POST, intent: "topup")

**Request**:

```typescript
{
  amount: number // Zod: positive integer, >= MIN_TOP_UP (1000 cents = 10 credits)
}
```

**Flow**:

1. User enters amount on wallet page
2. Stripe Payment Element renders (test mode — no real charges)
3. On "payment complete" confirmation from Stripe test mode, credits are added
4. Server validates amount, atomically updates `creditBalance`, creates Transaction record

**Side effects**:

- Atomically update `user.creditBalance = creditBalance + amount`
- Create `Transaction` record: `{ type: 'top-up', amount, userId, description: 'Wallet top-up' }`

**Response (success)**: Redirect to `/wallet` with success toast
**Response (validation error)**: `{ errors: { amount: ["Minimum top-up is 10 credits"] } }`

### Debt Repayment (`/wallet` POST, intent: "repay")

**Request**:

```typescript
{
  amount: number // Zod: positive integer, <= abs(currentDebt)
}
```

**Pre-conditions**:

- User's `creditBalance < 0` (in debt)
- `amount <= abs(creditBalance)` (cannot over-repay)

**Side effects**:

- Atomically update `user.creditBalance = creditBalance + amount`
- Create `Transaction` record: `{ type: 'debt-repayment', amount, userId, description: 'Debt repayment' }`

**Response (success)**: Redirect to `/wallet` with success toast
**Response (validation error)**: `{ errors: { amount: ["Repayment amount exceeds current debt"] } }`

## Transaction Types

| Type               | Amount   | Direction       | Description                            |
| ------------------ | -------- | --------------- | -------------------------------------- |
| `top-up`           | Positive | Credit added    | User adds credits to wallet            |
| `charging-payment` | Negative | Credit deducted | Payment for completed charging session |
| `debt-repayment`   | Positive | Credit added    | User repays debt (negative balance)    |

## Zod Schema Location

`app/schemas/transaction.ts`
