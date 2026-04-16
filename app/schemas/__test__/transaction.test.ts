import { describe, it, expect } from 'vitest'
import { topUpIntent, repayIntent } from '~/schemas/transaction'
import {
  VALIDATION_CONSTRAINTS,
  VALIDATION_MESSAGES,
} from '~/constants/validation'

describe('topUpIntent', () => {
  describe('intent', () => {
    it('accepts intent=topup', () => {
      const result = topUpIntent.safeParse({
        intent: 'topup',
        amount: 5000,
      })
      expect(result.success).toBe(true)
    })

    it('rejects non-topup intent', () => {
      const result = topUpIntent.safeParse({
        intent: 'repay',
        amount: 5000,
      })
      expect(result.success).toBe(false)
    })
  })

  describe('amount', () => {
    it('accepts minimum valid top-up amount', () => {
      const result = topUpIntent.safeParse({
        intent: 'topup',
        amount: VALIDATION_CONSTRAINTS.TRANSACTION_MIN_TOP_UP,
      })
      expect(result.success).toBe(true)
    })

    it('accepts amount above minimum', () => {
      const result = topUpIntent.safeParse({
        intent: 'topup',
        amount: 50000,
      })
      expect(result.success).toBe(true)
    })

    it('accepts large amount', () => {
      const result = topUpIntent.safeParse({
        intent: 'topup',
        amount: 1000000,
      })
      expect(result.success).toBe(true)
    })

    it('rejects amount below minimum', () => {
      const result = topUpIntent.safeParse({
        intent: 'topup',
        amount: VALIDATION_CONSTRAINTS.TRANSACTION_MIN_TOP_UP - 1,
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          VALIDATION_MESSAGES.TRANSACTION_MIN_TOP_UP,
        )
      }
    })

    it('rejects zero amount', () => {
      const result = topUpIntent.safeParse({
        intent: 'topup',
        amount: 0,
      })
      expect(result.success).toBe(false)
    })

    it('rejects negative amount', () => {
      const result = topUpIntent.safeParse({
        intent: 'topup',
        amount: -1000,
      })
      expect(result.success).toBe(false)
    })

    it('rejects non-integer amount', () => {
      const result = topUpIntent.safeParse({
        intent: 'topup',
        amount: 5000.5,
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Amount must be a whole number',
        )
      }
    })

    it('rejects missing amount', () => {
      const result = topUpIntent.safeParse({
        intent: 'topup',
      })
      expect(result.success).toBe(false)
    })
  })
})

describe('repayIntent', () => {
  describe('intent', () => {
    it('accepts intent=repay', () => {
      const result = repayIntent.safeParse({
        intent: 'repay',
        amount: 5000,
      })
      expect(result.success).toBe(true)
    })

    it('rejects non-repay intent', () => {
      const result = repayIntent.safeParse({
        intent: 'topup',
        amount: 5000,
      })
      expect(result.success).toBe(false)
    })
  })

  describe('amount', () => {
    it('accepts positive amount', () => {
      const result = repayIntent.safeParse({
        intent: 'repay',
        amount: 5000,
      })
      expect(result.success).toBe(true)
    })

    it('accepts small positive amount', () => {
      const result = repayIntent.safeParse({
        intent: 'repay',
        amount: 1,
      })
      expect(result.success).toBe(true)
    })

    it('rejects zero amount', () => {
      const result = repayIntent.safeParse({
        intent: 'repay',
        amount: 0,
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          VALIDATION_MESSAGES.TRANSACTION_AMOUNT_POSITIVE,
        )
      }
    })

    it('rejects negative amount', () => {
      const result = repayIntent.safeParse({
        intent: 'repay',
        amount: -1000,
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          VALIDATION_MESSAGES.TRANSACTION_AMOUNT_POSITIVE,
        )
      }
    })

    it('rejects non-integer amount', () => {
      const result = repayIntent.safeParse({
        intent: 'repay',
        amount: 5000.5,
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Amount must be a whole number',
        )
      }
    })

    it('rejects missing amount', () => {
      const result = repayIntent.safeParse({
        intent: 'repay',
      })
      expect(result.success).toBe(false)
    })
  })
})
