import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ROUTES } from '~/constants/routes'

const mockSignInEmail = vi.fn()
const mockSignInUsername = vi.fn()
const mockGetSession = vi.fn()

vi.mock('~/lib/auth.server', () => ({
  auth: {
    api: {
      signInEmail: (...args: unknown[]) => mockSignInEmail(...args),
      signInUsername: (...args: unknown[]) => mockSignInUsername(...args),
      getSession: (...args: unknown[]) => mockGetSession(...args),
    },
  },
}))

vi.mock('~/lib/action-utils', () => ({
  extractErrorMessage: async (_response: Response, fallback: string) =>
    fallback,
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
  return new Request('http://localhost/login', { method: 'POST', body: fd })
}

const { loginAction } = await import('../actions')

describe('loginAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('valid credentials with email', () => {
    it('redirects to dashboard on successful email login', async () => {
      mockSignInEmail.mockResolvedValue(
        new Response(null, {
          status: 200,
          headers: { 'Set-Cookie': 'session=abc123' },
        }),
      )

      const request = buildRequest({
        accountName: 'test@example.com',
        password: 'secure123',
      })

      const result = (await loginAction({ request } as never)) as Response
      expect(result).toBeInstanceOf(Response)
    })

    it('calls signInEmail when accountName looks like email', async () => {
      mockSignInEmail.mockResolvedValue(
        new Response(null, {
          status: 200,
          headers: { 'Set-Cookie': 'session=abc123' },
        }),
      )

      const request = buildRequest({
        accountName: 'user@example.com',
        password: 'password123',
        remember: 'on',
      })

      await loginAction({ request } as never)

      expect(mockSignInEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            email: 'user@example.com',
            password: 'password123',
            rememberMe: true,
          }),
        }),
      )
    })
  })

  describe('valid credentials with username', () => {
    it('calls signInUsername when accountName does not look like email', async () => {
      mockSignInUsername.mockResolvedValue(
        new Response(null, {
          status: 200,
          headers: { 'Set-Cookie': 'session=abc123' },
        }),
      )

      const request = buildRequest({
        accountName: 'testuser',
        password: 'password123',
      })

      await loginAction({ request } as never)

      expect(mockSignInUsername).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            username: 'testuser',
            password: 'password123',
          }),
        }),
      )
    })
  })

  describe('invalid credentials', () => {
    it('redirects to login with error when credentials are wrong', async () => {
      mockSignInEmail.mockResolvedValue(
        new Response(
          JSON.stringify({ error: { message: 'Invalid credentials' } }),
          { status: 401 },
        ),
      )

      const request = buildRequest({
        accountName: 'test@example.com',
        password: 'wrongpwd',
      })

      const result = (await loginAction({ request } as never)) as Response
      expect(result.status).toBe(302)
      expect(result.headers.get('Location')).toBe(ROUTES.LOGIN)
    })

    it('redirects to login with error when response is not ok', async () => {
      mockSignInUsername.mockResolvedValue(new Response(null, { status: 500 }))

      const request = buildRequest({
        accountName: 'testuser',
        password: 'pwd123',
      })

      const result = (await loginAction({ request } as never)) as Response
      expect(result.status).toBe(302)
      expect(result.headers.get('Location')).toBe(ROUTES.LOGIN)
    })
  })

  describe('validation errors', () => {
    it('returns validation errors for empty fields', async () => {
      const request = buildRequest({
        accountName: '',
        password: '',
      })

      const result = (await loginAction({
        request,
      } as never)) as Record<string, unknown>
      expect(result).toHaveProperty('errors')
    })

    it('returns validation errors for invalid account name format', async () => {
      const request = buildRequest({
        accountName: 'user!name',
        password: 'password123',
      })

      const result = (await loginAction({
        request,
      } as never)) as Record<string, unknown>
      expect(result).toHaveProperty('errors')
    })
  })

  describe('remember me', () => {
    it('passes remember=false when remember is not checked', async () => {
      mockSignInEmail.mockResolvedValue(
        new Response(null, {
          status: 200,
          headers: { 'Set-Cookie': 'session=abc123' },
        }),
      )

      const request = buildRequest({
        accountName: 'test@example.com',
        password: 'password123',
      })

      await loginAction({ request } as never)

      expect(mockSignInEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            rememberMe: false,
          }),
        }),
      )
    })

    it('passes remember=true when remember is checked', async () => {
      mockSignInEmail.mockResolvedValue(
        new Response(null, {
          status: 200,
          headers: { 'Set-Cookie': 'session=abc123' },
        }),
      )

      const request = buildRequest({
        accountName: 'test@example.com',
        password: 'password123',
        remember: 'on',
      })

      await loginAction({ request } as never)

      expect(mockSignInEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            rememberMe: true,
          }),
        }),
      )
    })
  })

  describe('email verification and admin redirect', () => {
    it('redirects to check-email when email is not verified', async () => {
      mockSignInEmail.mockResolvedValue(
        new Response(null, {
          status: 200,
          headers: { 'Set-Cookie': 'session=abc123' },
        }),
      )
      mockGetSession.mockResolvedValue({
        user: { id: 'user-1', emailVerified: false },
      })

      const request = buildRequest({
        accountName: 'test@example.com',
        password: 'password123',
      })

      const result = (await loginAction({ request } as never)) as Response
      expect(result).toBeInstanceOf(Response)
      expect(result.headers.get('Location')).toBe(ROUTES.SIGNUP_CHECK_EMAIL)
      expect(result.headers.get('Set-Cookie')).toBe('session=abc123')
    })

    it('redirects to admin when user has admin role', async () => {
      mockSignInEmail.mockResolvedValue(
        new Response(null, {
          status: 200,
          headers: { 'Set-Cookie': 'session=abc123' },
        }),
      )
      mockGetSession.mockResolvedValue({
        user: { id: 'admin-1', emailVerified: true, role: 'admin' },
      })

      const request = buildRequest({
        accountName: 'admin@example.com',
        password: 'password123',
      })

      const result = (await loginAction({ request } as never)) as Response
      expect(result).toBeInstanceOf(Response)
      expect(result.headers.get('Location')).toBe(ROUTES.ADMIN)
      expect(result.headers.get('Set-Cookie')).toBe('session=abc123')
    })

    it('redirects to app when user is verified and not admin', async () => {
      mockSignInEmail.mockResolvedValue(
        new Response(null, {
          status: 200,
          headers: { 'Set-Cookie': 'session=abc123' },
        }),
      )
      mockGetSession.mockResolvedValue({
        user: { id: 'user-1', emailVerified: true, role: 'user' },
      })

      const request = buildRequest({
        accountName: 'test@example.com',
        password: 'password123',
      })

      const result = (await loginAction({ request } as never)) as Response
      expect(result).toBeInstanceOf(Response)
      expect(result.headers.get('Location')).toBe(ROUTES.APP)
    })
  })
})
