import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ROUTES } from '~/constants/routes'

// --- Mocks ---

const mockDb = {
  update: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
  where: vi.fn().mockResolvedValue(undefined),
}

vi.mock('~/lib/db', () => ({
  db: {
    update: (...args: unknown[]) => mockDb.update(...args),
  },
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

vi.mock('~/lib/action-utils', () => ({
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
}))

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
const { signupAction } = await import('./actions')

describe('signupAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockDb.update.mockReturnThis()
    mockDb.set.mockReturnThis()
    mockDb.where.mockResolvedValue(undefined)
  })

  describe('password mode', () => {
    it('returns validation errors for invalid input', async () => {
      const request = buildRequest({
        signupMode: 'password',
        email: '',
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

    it('does NOT set isNew to false on password signup', async () => {
      mockSignUpEmail.mockResolvedValue({
        ok: true,
        clone: () => ({ json: () => Promise.resolve({}) }),
      })

      const request = buildRequest({
        signupMode: 'password',
        email: 'test@example.com',
        password: 'secure123',
        name: 'Test User',
        dateOfBirth: '2000-01-15',
      })

      await signupAction({ request } as never)

      const setArg = mockDb.set.mock.calls[0][0]
      expect(setArg).not.toHaveProperty('isNew')
      expect(setArg).toHaveProperty('dateOfBirth', '2000-01-15')
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
        password: 'secure123',
        name: 'Test User',
        dateOfBirth: '2000-01-15',
      })

      const result = (await signupAction({ request } as never)) as Response
      expect(result).toBeInstanceOf(Response)
      expect(result.headers.get('Location')).toBe(ROUTES.SIGNUP)
      expect(result.headers.get('X-Error')).toBe('Email already exists')
    })
  })

  describe('oauth mode', () => {
    it('sets isNew to false for oauth completion', async () => {
      mockGetSession.mockResolvedValue({
        user: { id: 'user-123' },
      })

      const request = buildRequest({
        signupMode: 'oauth',
        email: 'oauth@example.com',
        password: '',
        name: 'OAuth User',
        dateOfBirth: '1995-06-20',
      })

      const result = (await signupAction({ request } as never)) as Response
      expect(result).toBeInstanceOf(Response)
      expect(result.headers.get('Location')).toBe(ROUTES.HOME)

      const setArg = mockDb.set.mock.calls[0][0]
      expect(setArg).toHaveProperty('isNew', false)
    })

    it('redirects to login when no session exists', async () => {
      mockGetSession.mockResolvedValue(null)

      const request = buildRequest({
        signupMode: 'oauth',
        email: 'oauth@example.com',
        password: '',
        name: 'OAuth User',
        dateOfBirth: '1995-06-20',
      })

      const result = (await signupAction({ request } as never)) as Response
      expect(result).toBeInstanceOf(Response)
      expect(result.headers.get('Location')).toBe(ROUTES.LOGIN)
    })
  })
})
