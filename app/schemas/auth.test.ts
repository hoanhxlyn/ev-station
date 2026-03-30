import { describe, it, expect } from 'vitest'
import { loginSchema } from '../schemas/auth'

describe('loginSchema', () => {
  describe('accountName validation', () => {
    describe('username format (no @)', () => {
      it('accepts valid username with letters only', () => {
        const result = loginSchema.safeParse({
          accountName: 'admin',
          password: 'password123',
        })
        expect(result.success).toBe(true)
      })

      it('accepts valid username with letters and numbers', () => {
        const result = loginSchema.safeParse({
          accountName: 'admin123',
          password: 'password123',
        })
        expect(result.success).toBe(true)
      })

      it('accepts valid username with underscore', () => {
        const result = loginSchema.safeParse({
          accountName: 'admin_user',
          password: 'password123',
        })
        expect(result.success).toBe(true)
      })

      it('rejects username with special characters', () => {
        const result = loginSchema.safeParse({
          accountName: 'admin!',
          password: 'password123',
        })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            'Enter a valid email or username (letters, numbers, underscores only)',
          )
        }
      })

      it('rejects username with spaces', () => {
        const result = loginSchema.safeParse({
          accountName: 'admin user',
          password: 'password123',
        })
        expect(result.success).toBe(false)
      })

      it('rejects username with @ symbol (treated as invalid email)', () => {
        const result = loginSchema.safeParse({
          accountName: 'admin@test',
          password: 'password123',
        })
        expect(result.success).toBe(false)
      })
    })

    describe('email format (contains @)', () => {
      it('accepts valid email', () => {
        const result = loginSchema.safeParse({
          accountName: 'admin@example.com',
          password: 'password123',
        })
        expect(result.success).toBe(true)
      })

      it('accepts email with subdomain', () => {
        const result = loginSchema.safeParse({
          accountName: 'admin@sub.example.com',
          password: 'password123',
        })
        expect(result.success).toBe(true)
      })

      it('rejects email without domain', () => {
        const result = loginSchema.safeParse({
          accountName: 'admin@',
          password: 'password123',
        })
        expect(result.success).toBe(false)
      })

      it('rejects email without @', () => {
        const result = loginSchema.safeParse({
          accountName: 'user@invalid',
          password: 'password123',
        })
        expect(result.success).toBe(false)
      })

      it('rejects multiple @ symbols', () => {
        const result = loginSchema.safeParse({
          accountName: 'admin@@example.com',
          password: 'password123',
        })
        expect(result.success).toBe(false)
      })

      it('rejects email without TLD', () => {
        const result = loginSchema.safeParse({
          accountName: 'admin@example',
          password: 'password123',
        })
        expect(result.success).toBe(false)
      })

      it('rejects email with spaces', () => {
        const result = loginSchema.safeParse({
          accountName: 'admin @example.com',
          password: 'password123',
        })
        expect(result.success).toBe(false)
      })
    })

    describe('edge cases', () => {
      it('rejects empty string', () => {
        const result = loginSchema.safeParse({
          accountName: '',
          password: 'password123',
        })
        expect(result.success).toBe(false)
      })

      it('rejects only @ symbols', () => {
        const result = loginSchema.safeParse({
          accountName: '@@@@@',
          password: 'password123',
        })
        expect(result.success).toBe(false)
      })

      it('rejects username exceeding max length', () => {
        const result = loginSchema.safeParse({
          accountName: 'a'.repeat(101),
          password: 'password123',
        })
        expect(result.success).toBe(false)
      })
    })
  })

  describe('password validation', () => {
    it('accepts valid password', () => {
      const result = loginSchema.safeParse({
        accountName: 'admin',
        password: 'password123',
      })
      expect(result.success).toBe(true)
    })

    it('rejects empty password', () => {
      const result = loginSchema.safeParse({
        accountName: 'admin',
        password: '',
      })
      expect(result.success).toBe(false)
    })

    it('rejects password exceeding max length', () => {
      const result = loginSchema.safeParse({
        accountName: 'admin',
        password: 'a'.repeat(13),
      })
      expect(result.success).toBe(false)
    })
  })

  describe('remember field', () => {
    it('accepts remember as boolean true', () => {
      const result = loginSchema.safeParse({
        accountName: 'admin',
        password: 'password123',
        remember: true,
      })
      expect(result.success).toBe(true)
    })

    it('accepts remember as boolean false', () => {
      const result = loginSchema.safeParse({
        accountName: 'admin',
        password: 'password123',
        remember: false,
      })
      expect(result.success).toBe(true)
    })

    it('accepts remember as undefined', () => {
      const result = loginSchema.safeParse({
        accountName: 'admin',
        password: 'password123',
      })
      expect(result.success).toBe(true)
    })
  })
})
