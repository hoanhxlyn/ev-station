import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockDb = {
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

vi.mock('~/lib/auth.server', () => ({
  auth: {
    api: {
      getSession: (...args: unknown[]) => mockGetSession(...args),
    },
  },
}))

const { signupLoader } = await import('./loader')

function buildRequest(headers?: Record<string, string>): Request {
  return new Request('http://localhost/signup', { headers })
}

describe('signupLoader', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockDb.query.user.findFirst.mockResolvedValue(null)
  })

  it('returns null when no session exists', async () => {
    mockGetSession.mockResolvedValue(null)

    const result = await signupLoader({ request: buildRequest() } as never)
    expect(result).toBeNull()
  })

  it('returns null when session has no user id', async () => {
    mockGetSession.mockResolvedValue({ user: {} })

    const result = await signupLoader({ request: buildRequest() } as never)
    expect(result).toBeNull()
  })

  it('returns null when session user id exists but no DB user found', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'user-123' } })
    mockDb.query.user.findFirst.mockResolvedValue(null)

    const result = await signupLoader({ request: buildRequest() } as never)
    expect(result).toBeNull()
  })

  it('queries DB user by session user id', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'user-456' } })
    mockDb.query.user.findFirst.mockResolvedValue({
      email: 'test@example.com',
      name: 'Test User',
    })

    await signupLoader({ request: buildRequest() } as never)

    expect(mockDb.query.user.findFirst).toHaveBeenCalledTimes(1)
  })

  it('returns email and name from DB user', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'user-789' } })
    mockDb.query.user.findFirst.mockResolvedValue({
      email: 'oauth@example.com',
      name: 'OAuth User',
    })

    const result = await signupLoader({ request: buildRequest() } as never)
    expect(result).toEqual({
      email: 'oauth@example.com',
      name: 'OAuth User',
    })
  })

  it('defaults to empty string when email or name is null', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'user-null' } })
    mockDb.query.user.findFirst.mockResolvedValue({
      email: null,
      name: null,
    })

    const result = await signupLoader({ request: buildRequest() } as never)
    expect(result).toEqual({
      email: '',
      name: '',
    })
  })
})
