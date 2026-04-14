import { describe, it, expect } from 'vitest'
import { toggleLockIntent } from '~/schemas/admin'

describe('toggleLockIntent', () => {
  describe('intent', () => {
    it('accepts intent=toggle-lock', () => {
      const result = toggleLockIntent.safeParse({
        intent: 'toggle-lock',
        userId: 'user-123',
      })
      expect(result.success).toBe(true)
    })

    it('rejects non-toggle-lock intent', () => {
      const result = toggleLockIntent.safeParse({
        intent: 'lock',
        userId: 'user-123',
      })
      expect(result.success).toBe(false)
    })

    it('rejects empty intent', () => {
      const result = toggleLockIntent.safeParse({
        intent: '',
        userId: 'user-123',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('userId', () => {
    it('accepts valid userId', () => {
      const result = toggleLockIntent.safeParse({
        intent: 'toggle-lock',
        userId: 'user-123',
      })
      expect(result.success).toBe(true)
    })

    it('accepts UUID-format userId', () => {
      const result = toggleLockIntent.safeParse({
        intent: 'toggle-lock',
        userId: '550e8400-e29b-41d4-a716-446655440000',
      })
      expect(result.success).toBe(true)
    })

    it('rejects empty userId', () => {
      const result = toggleLockIntent.safeParse({
        intent: 'toggle-lock',
        userId: '',
      })
      expect(result.success).toBe(false)
    })

    it('rejects missing userId', () => {
      const result = toggleLockIntent.safeParse({
        intent: 'toggle-lock',
      })
      expect(result.success).toBe(false)
    })

    it('reports userId required error', () => {
      const result = toggleLockIntent.safeParse({
        intent: 'toggle-lock',
        userId: '',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('User ID is required')
      }
    })
  })

  describe('full validation', () => {
    it('accepts valid complete input', () => {
      const result = toggleLockIntent.safeParse({
        intent: 'toggle-lock',
        userId: 'user-123',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual({
          intent: 'toggle-lock',
          userId: 'user-123',
        })
      }
    })

    it('rejects when both fields invalid', () => {
      const result = toggleLockIntent.safeParse({
        intent: 'invalid',
        userId: '',
      })
      expect(result.success).toBe(false)
    })
  })
})
