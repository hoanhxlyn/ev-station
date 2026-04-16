import { describe, it, expect, vi, beforeEach } from 'vitest'
import { z } from 'zod'
import { ROUTES } from '~/constants/routes'
import { VALIDATION_MESSAGES } from '~/constants/validation'

// --- Mocks ---

const mockDb = {
  update: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
  where: vi.fn().mockResolvedValue(undefined),
  query: {
    user: {
      findFirst: vi.fn(),
    },
  },
}

vi.mock('~/lib/db', () => ({
  db: mockDb,
}))

vi.mock('~/lib/db/schema', () => ({
  user: Symbol('user-table'),
}))

const mockGetSession = vi.fn()
const mockSignUpEmail = vi.fn()

vi.mock('~/lib/auth.server', () => ({
  auth: {
    api: {
      getSession: (...args: unknown[]) => mockGetSession(...args),
      signUpEmail: (...args: unknown[]) => mockSignUpEmail(...args),
    },
  },
}))

vi.mock('~/lib/action-utils', () => {
  const schema = z.object({
    message: z.string().optional(),
    error: z.object({ message: z.string().optional() }).optional(),
  })
  return {
    extractErrorMessage: async (response: Response, fallback: string) => {
      try {
        const result = schema.safeParse(await response.clone().json())
        if (!result.success) return fallback
        return result.data.error?.message ?? result.data.message ?? fallback
      } catch {
        return fallback
      }
    },
    redirectFail: (url: string, msg: string) =>
      new Response(null, {
        status: 302,
        headers: { Location: url, 'X-Error': msg },
      }),
    redirectSuccess: (url: string, msg: string) =>
      new Response(null, {
        status: 302,
        headers: { Location: url, 'X-Success': msg },
      }),
  }
})

function buildFormData(entries: Record<string, string>): FormData {
  const fd = new FormData()
  for (const [k, v] of Object.entries(entries)) {
    fd.append(k, v)
  }
  return fd
}

function buildRequest(entries: Record<string, string>): Request {
  const fd = buildFormData(entries)
  return new Request('http://localhost/signup', { method: 'POST', body: fd })
}

// Dynamic import so mocks are in place
const { signupAction } = await import('../actions')

describe('signupAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockDb.update.mockReturnThis()
    mockDb.set.mockReturnThis()
    mockDb.where.mockResolvedValue(undefined)
    mockDb.query.user.findFirst.mockResolvedValue(null)
  })

  describe('password mode', () => {
    it('returns validation errors for invalid input', async () => {
      const request = buildRequest({
        signupMode: 'password',
        email: '',
        username: '',
        password: '',
        name: '',
        dateOfBirth: '',
      })

      const result = await signupAction({ request } as never)
      expect(result).toHaveProperty('errors')
    })

    it('redirects to check-email page on successful signup', async () => {
      mockSignUpEmail.mockResolvedValue({
        ok: true,
        clone: () => ({ json: () => Promise.resolve({}) }),
      })

      const request = buildRequest({
        signupMode: 'password',
        email: 'test@example.com',
        username: 'testuser',
        password: 'secure123',
        name: 'Test User',
        dateOfBirth: '2000-01-15',
      })

      const result = (await signupAction({ request } as never)) as Response
      expect(result.status).toBe(302)
      const location = result.headers.get('Location')
      expect(location).toContain(ROUTES.SIGNUP_CHECK_EMAIL)
      expect(location).toContain('test%40example.com')
    })

    it('sets signupMethod to manual on password signup', async () => {
      mockSignUpEmail.mockResolvedValue({
        ok: true,
        clone: () => ({ json: () => Promise.resolve({}) }),
      })

      const request = buildRequest({
        signupMode: 'password',
        email: 'test@example.com',
        username: 'testuser',
        password: 'secure123',
        name: 'Test User',
        dateOfBirth: '2000-01-15',
      })

      await signupAction({ request } as never)

      const setArg = mockDb.set.mock.calls[0][0]
      expect(setArg).toHaveProperty('signupMethod', 'manual')
    })

    it('returns field-level error when email already exists via OAuth', async () => {
      mockDb.query.user.findFirst.mockResolvedValue({
        email: 'oauth@example.com',
        signupMethod: 'oauth',
      })

      const request = buildRequest({
        signupMode: 'password',
        email: 'oauth@example.com',
        username: 'testuser',
        password: 'secure123',
        name: 'Test User',
        dateOfBirth: '2000-01-15',
      })

      const result = (await signupAction({ request } as never)) as {
        errors: { fieldErrors: { email?: string[] } }
      }
      expect(result).toHaveProperty('errors')
      expect(result.errors.fieldErrors?.email).toContain(
        VALIDATION_MESSAGES.EMAIL_ALREADY_EXISTS,
      )
    })

    it('redirects to signup with error on failed signUpEmail', async () => {
      mockSignUpEmail.mockResolvedValue({
        ok: false,
        clone: () => ({
          json: () =>
            Promise.resolve({ error: { message: 'Email already exists' } }),
        }),
      })

      const request = buildRequest({
        signupMode: 'password',
        email: 'dup@example.com',
        username: 'dupuser',
        password: 'secure123',
        name: 'Test User',
        dateOfBirth: '2000-01-15',
      })

      const result = (await signupAction({ request } as never)) as Response
      expect(result).toBeInstanceOf(Response)
      expect(result.headers.get('Location')).toBe(ROUTES.SIGNUP)
      expect(result.headers.get('X-Error')).toBe('Email already exists')
    })

    it('calls signUpEmail with correct params for valid registration (role defaults to user)', async () => {
      mockSignUpEmail.mockResolvedValue({
        ok: true,
        clone: () => ({ json: () => Promise.resolve({}) }),
      })

      const request = buildRequest({
        signupMode: 'password',
        email: 'newuser@example.com',
        username: 'newuser',
        password: 'secure123',
        name: 'New User',
        dateOfBirth: '1995-05-10',
      })

      await signupAction({ request } as never)

      expect(mockSignUpEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            email: 'newuser@example.com',
            password: 'secure123',
            name: 'New User',
            username: 'newuser',
          }),
        }),
      )
      expect(mockSignUpEmail).toHaveBeenCalledTimes(1)
    })

    it('includes callbackURL pointing to login in signUpEmail call', async () => {
      mockSignUpEmail.mockResolvedValue({
        ok: true,
        clone: () => ({ json: () => Promise.resolve({}) }),
      })

      const request = buildRequest({
        signupMode: 'password',
        email: 'newuser2@example.com',
        username: 'newuser2',
        password: 'secure123',
        name: 'New User 2',
        dateOfBirth: '1990-01-01',
      })

      await signupAction({ request } as never)

      expect(mockSignUpEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            callbackURL: ROUTES.LOGIN,
          }),
        }),
      )
    })

    it('returns field-level error for duplicate email (manual signup)', async () => {
      mockDb.query.user.findFirst.mockResolvedValue({
        email: 'existing@example.com',
        signupMethod: 'manual',
      })

      const request = buildRequest({
        signupMode: 'password',
        email: 'existing@example.com',
        username: 'newuser3',
        password: 'secure123',
        name: 'New User 3',
        dateOfBirth: '1990-01-01',
      })

      const result = (await signupAction({ request } as never)) as {
        errors: { fieldErrors: { email?: string[] } }
      }
      expect(result).toHaveProperty('errors')
      expect(result.errors.fieldErrors?.email).toContain(
        VALIDATION_MESSAGES.EMAIL_ALREADY_EXISTS,
      )
    })

    it('returns field-level error for duplicate username', async () => {
      mockDb.query.user.findFirst
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({
          email: 'other@example.com',
          username: 'existinguser',
          signupMethod: 'manual',
        })

      const request = buildRequest({
        signupMode: 'password',
        email: 'newuser@example.com',
        username: 'existinguser',
        password: 'secure123',
        name: 'New User',
        dateOfBirth: '1990-01-01',
      })

      const result = (await signupAction({ request } as never)) as {
        errors: { fieldErrors: { username?: string[] } }
      }
      expect(result).toHaveProperty('errors')
      expect(result.errors.fieldErrors?.username).toContain(
        VALIDATION_MESSAGES.USERNAME_ALREADY_EXISTS,
      )
    })
  })

  describe('oauth mode', () => {
    it('sets isNew to false and signupMethod to oauth for oauth completion', async () => {
      mockGetSession.mockResolvedValue({
        user: { id: 'user-123' },
      })

      const request = buildRequest({
        signupMode: 'oauth',
        email: 'oauth@example.com',
        username: 'oauthuser',
        password: '',
        name: 'OAuth User',
        dateOfBirth: '1995-06-20',
      })

      const result = (await signupAction({ request } as never)) as Response
      expect(result).toBeInstanceOf(Response)
      expect(result.headers.get('Location')).toBe(ROUTES.APP)

      const setArg = mockDb.set.mock.calls[0][0]
      expect(setArg).toHaveProperty('isNew', false)
      expect(setArg).toHaveProperty('signupMethod', 'oauth')
    })

    it('redirects to login when no session exists', async () => {
      mockGetSession.mockResolvedValue(null)

      const request = buildRequest({
        signupMode: 'oauth',
        email: 'oauth@example.com',
        username: 'oauthuser',
        password: '',
        name: 'OAuth User',
        dateOfBirth: '1995-06-20',
      })

      const result = (await signupAction({ request } as never)) as Response
      expect(result).toBeInstanceOf(Response)
      expect(result.headers.get('Location')).toBe(ROUTES.LOGIN)
    })

    it('returns field-level error when email exists via manual signup in OAuth mode', async () => {
      mockDb.query.user.findFirst.mockResolvedValue({
        email: 'manual@example.com',
        signupMethod: 'manual',
      })

      const request = buildRequest({
        signupMode: 'oauth',
        email: 'manual@example.com',
        username: 'oauthuser',
        password: '',
        name: 'OAuth User',
        dateOfBirth: '1995-06-20',
      })

      const result = (await signupAction({ request } as never)) as {
        errors: { fieldErrors: { email?: string[] } }
      }
      expect(result).toHaveProperty('errors')
      expect(result.errors.fieldErrors?.email).toContain(
        VALIDATION_MESSAGES.EMAIL_ALREADY_EXISTS,
      )
    })
  })
})
