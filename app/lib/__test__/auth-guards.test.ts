import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ROUTES } from '~/constants/routes'

const mockGetSession = vi.fn()

vi.mock('~/lib/auth.server', () => ({
  auth: {
    api: {
      getSession: (...args: unknown[]) => mockGetSession(...args),
    },
  },
}))

function buildRequest(): Request {
  return new Request('http://localhost/test', {
    headers: { 'X-Test': 'true' },
  })
}

const { requireAuth, requireVerified, requireAdmin } =
  await import('../auth-guards')

describe('requireAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns session when user is authenticated', async () => {
    const mockSession = {
      user: { id: 'user-123', email: 'test@example.com' },
    }
    mockGetSession.mockResolvedValue(mockSession)

    const request = buildRequest()
    const result = await requireAuth(request)

    expect(result).toEqual(mockSession)
    expect(mockGetSession).toHaveBeenCalled()
  })

  it('redirects to login when no session exists', async () => {
    mockGetSession.mockResolvedValue(null)

    const request = buildRequest()

    await expect(requireAuth(request)).rejects.toMatchObject({
      status: 302,
      headers: expect.objectContaining({
        get: expect.any(Function),
      }),
    })

    try {
      await requireAuth(request)
    } catch (e) {
      const redirect = e as Response
      expect(redirect.status).toBe(302)
      const location = redirect.headers.get('Location')
      expect(location).toContain(ROUTES.LOGIN)
    }
  })

  it('redirects to login when session has no user', async () => {
    mockGetSession.mockResolvedValue({ user: null })

    const request = buildRequest()

    try {
      await requireAuth(request)
    } catch (e) {
      const redirect = e as Response
      expect(redirect.status).toBe(302)
      const location = redirect.headers.get('Location')
      expect(location).toContain(ROUTES.LOGIN)
    }
  })
})

describe('requireVerified', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns session when user is verified', async () => {
    const mockSession = {
      user: {
        id: 'user-123',
        email: 'test@example.com',
        emailVerified: true,
      },
    }
    mockGetSession.mockResolvedValue(mockSession)

    const request = buildRequest()
    const result = await requireVerified(request)

    expect(result).toEqual(mockSession)
  })

  it('redirects to check-email when email is not verified', async () => {
    const mockSession = {
      user: {
        id: 'user-123',
        email: 'test@example.com',
        emailVerified: false,
      },
    }
    mockGetSession.mockResolvedValue(mockSession)

    const request = buildRequest()

    try {
      await requireVerified(request)
    } catch (e) {
      const redirect = e as Response
      expect(redirect.status).toBe(302)
      expect(redirect.headers.get('Location')).toBe(ROUTES.SIGNUP_CHECK_EMAIL)
    }
  })

  it('returns 403 when user account is locked', async () => {
    const mockSession = {
      user: {
        id: 'user-123',
        email: 'test@example.com',
        emailVerified: true,
        status: 'locked',
      },
    }
    mockGetSession.mockResolvedValue(mockSession)

    const request = buildRequest()

    await expect(requireVerified(request)).rejects.toMatchObject({
      status: 403,
    })

    try {
      await requireVerified(request)
    } catch (e) {
      const response = e as Response
      expect(response.status).toBe(403)
      const body = await response.text()
      expect(body).toBe('Account locked')
    }
  })

  it('returns 403 when status field is locked (via Record access)', async () => {
    const mockSession = {
      user: {
        id: 'user-123',
        email: 'test@example.com',
        emailVerified: true,
        status: 'locked',
      },
    }
    mockGetSession.mockResolvedValue(mockSession)

    const request = buildRequest()

    try {
      await requireVerified(request)
    } catch (e) {
      const response = e as Response
      expect(response.status).toBe(403)
    }
  })

  it('returns session when verified and status is active', async () => {
    const mockSession = {
      user: {
        id: 'user-123',
        email: 'test@example.com',
        emailVerified: true,
        status: 'active',
      },
    }
    mockGetSession.mockResolvedValue(mockSession)

    const request = buildRequest()
    const result = await requireVerified(request)

    expect(result).toEqual(mockSession)
  })
})

describe('requireAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns session when user is admin', async () => {
    const mockSession = {
      user: {
        id: 'admin-123',
        email: 'admin@example.com',
        emailVerified: true,
        role: 'admin',
        status: 'active',
      },
    }
    mockGetSession.mockResolvedValue(mockSession)

    const request = buildRequest()
    const result = await requireAdmin(request)

    expect(result).toEqual(mockSession)
  })

  it('returns 403 when user is not admin', async () => {
    const mockSession = {
      user: {
        id: 'user-123',
        email: 'test@example.com',
        emailVerified: true,
        role: 'user',
        status: 'active',
      },
    }
    mockGetSession.mockResolvedValue(mockSession)

    const request = buildRequest()

    await expect(requireAdmin(request)).rejects.toMatchObject({
      status: 403,
    })

    try {
      await requireAdmin(request)
    } catch (e) {
      const response = e as Response
      expect(response.status).toBe(403)
      const body = await response.text()
      expect(body).toBe('Forbidden')
    }
  })

  it('returns 403 when user role is undefined', async () => {
    const mockSession = {
      user: {
        id: 'user-123',
        email: 'test@example.com',
        emailVerified: true,
        status: 'active',
      },
    }
    mockGetSession.mockResolvedValue(mockSession)

    const request = buildRequest()

    try {
      await requireAdmin(request)
    } catch (e) {
      const response = e as Response
      expect(response.status).toBe(403)
    }
  })

  it('calls requireVerified first (admin is also verified check)', async () => {
    const mockSession = {
      user: {
        id: 'admin-123',
        email: 'admin@example.com',
        emailVerified: true,
        role: 'admin',
        status: 'active',
      },
    }
    mockGetSession.mockResolvedValue(mockSession)

    const request = buildRequest()
    await requireAdmin(request)

    expect(mockGetSession).toHaveBeenCalled()
  })
})

describe('session expiry handling', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('requireAuth redirects to login with session_expired reason when session is expired', async () => {
    mockGetSession.mockResolvedValue(null)

    const request = buildRequest()

    try {
      await requireAuth(request)
    } catch (e) {
      const redirect = e as Response
      expect(redirect.status).toBe(302)
      const location = redirect.headers.get('Location')
      expect(location).toContain(ROUTES.LOGIN)
      expect(location).toContain('reason=session_expired')
    }
  })

  it('requireAuth passes headers to getSession for session validation', async () => {
    const mockSession = {
      user: { id: 'user-123', email: 'test@example.com' },
    }
    mockGetSession.mockResolvedValue(mockSession)

    const request = buildRequest()
    await requireAuth(request)

    expect(mockGetSession).toHaveBeenCalledWith({
      headers: request.headers,
    })
  })

  it('requireVerified redirects to login with session_expired reason for expired session (null)', async () => {
    mockGetSession.mockResolvedValue(null)

    const request = buildRequest()

    try {
      await requireVerified(request)
    } catch (e) {
      const redirect = e as Response
      expect(redirect.status).toBe(302)
      const location = redirect.headers.get('Location')
      expect(location).toContain(ROUTES.LOGIN)
      expect(location).toContain('reason=session_expired')
    }
  })

  it('requireAdmin redirects to login with session_expired reason for expired session (null)', async () => {
    mockGetSession.mockResolvedValue(null)

    const request = buildRequest()

    try {
      await requireAdmin(request)
    } catch (e) {
      const redirect = e as Response
      expect(redirect.status).toBe(302)
      const location = redirect.headers.get('Location')
      expect(location).toContain(ROUTES.LOGIN)
      expect(location).toContain('reason=session_expired')
    }
  })
})
