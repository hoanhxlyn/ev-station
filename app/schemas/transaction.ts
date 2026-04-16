import { z } from 'zod'
import {
  VALIDATION_CONSTRAINTS,
  VALIDATION_MESSAGES,
} from '~/constants/validation'

export const topUpIntent = z.object({
  intent: z.literal('topup'),
  amount: z
    .number()
    .int('Amount must be a whole number')
    .min(
      VALIDATION_CONSTRAINTS.TRANSACTION_MIN_TOP_UP,
      VALIDATION_MESSAGES.TRANSACTION_MIN_TOP_UP,
    ),
})

export const repayIntent = z.object({
  intent: z.literal('repay'),
  amount: z
    .number()
    .int('Amount must be a whole number')
    .positive(VALIDATION_MESSAGES.TRANSACTION_AMOUNT_POSITIVE),
})

export type TopUpValues = z.infer<typeof topUpIntent>
export type RepayValues = z.infer<typeof repayIntent>
