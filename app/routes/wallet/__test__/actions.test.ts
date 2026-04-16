import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ROUTES } from '~/constants/routes'
import { WALLET_MESSAGES } from '~/constants/messages'

// --- Mocks ---

const mockDb = {
  insert: vi.fn().mockReturnThis(),
  values: vi.fn().mockResolvedValue(undefined),
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
  transaction: Symbol('transaction-table'),
}))

const mockCreatePaymentIntent = vi.fn()
const mockConfirmPaymentIntent = vi.fn()

vi.mock('~/lib/stripe.server', () => ({
  createPaymentIntent: (...args: unknown[]) => mockCreatePaymentIntent(...args),
  confirmPaymentIntent: (...args: unknown[]) =>
    mockConfirmPaymentIntent(...args),
}))

vi.mock('~/lib/auth-guards', () => ({
  requireVerified: vi.fn().mockResolvedValue({
    user: { id: 'user-1', emailVerified: true },
  }),
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
  return new Request('http://localhost/wallet', { method: 'POST', body: fd })
}

const { walletAction } = await import('../actions')

describe('walletAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockDb.update.mockReturnThis()
    mockDb.set.mockReturnThis()
    mockDb.where.mockResolvedValue(undefined)
    mockDb.values.mockResolvedValue(undefined)
    mockDb.insert.mockReturnThis()
  })

  describe('top-up', () => {
    it('credits user after successful payment confirmation', async () => {
      mockDb.query.user.findFirst.mockResolvedValue({
        creditBalance: 5000,
      })
      mockCreatePaymentIntent.mockResolvedValue({ id: 'pi_123' })
      mockConfirmPaymentIntent.mockResolvedValue({ status: 'succeeded' })

      const request = buildRequest({ intent: 'topup', amount: '1000' })
      const result = (await walletAction({ request } as never)) as Response
      expect(result).toBeInstanceOf(Response)
      expect(result.headers.get('Location')).toBe(ROUTES.WALLET)
      expect(mockDb.update).toHaveBeenCalled()
    })

    it('does not credit user when payment confirmation fails', async () => {
      mockDb.query.user.findFirst.mockResolvedValue({
        creditBalance: 5000,
      })
      mockCreatePaymentIntent.mockResolvedValue({ id: 'pi_123' })
      mockConfirmPaymentIntent.mockResolvedValue({ status: 'requires_action' })

      const request = buildRequest({ intent: 'topup', amount: '1000' })
      const result = (await walletAction({ request } as never)) as Response
      expect(result).toBeInstanceOf(Response)
      expect(result.headers.get('X-Error')).toBeTruthy()
      expect(mockDb.update).not.toHaveBeenCalled()
    })

    it('returns validation errors for amount below minimum', async () => {
      const request = buildRequest({ intent: 'topup', amount: '500' })
      const result = (await walletAction({ request } as never)) as Record<
        string,
        unknown
      >
      expect(result).toHaveProperty('errors')
    })

    it('throws when user not found', async () => {
      mockDb.query.user.findFirst.mockResolvedValue(null)
      mockCreatePaymentIntent.mockResolvedValue({ id: 'pi_123' })
      mockConfirmPaymentIntent.mockResolvedValue({ status: 'succeeded' })

      const request = buildRequest({ intent: 'topup', amount: '1000' })
      const result = (await walletAction({ request } as never)) as Response
      expect(result.headers.get('Location')).toBe(ROUTES.WALLET)
      expect(result.headers.get('X-Error')).toBeTruthy()
    })
  })

  describe('repay', () => {
    it('repays debt successfully', async () => {
      mockDb.query.user.findFirst.mockResolvedValue({
        creditBalance: -10000,
      })

      const request = buildRequest({ intent: 'repay', amount: '5000' })
      const result = (await walletAction({ request } as never)) as Response
      expect(result).toBeInstanceOf(Response)
      expect(result.headers.get('Location')).toBe(ROUTES.WALLET)
    })

    it('fails when user is not in debt', async () => {
      mockDb.query.user.findFirst.mockResolvedValue({
        creditBalance: 5000,
      })

      const request = buildRequest({ intent: 'repay', amount: '1000' })
      const result = (await walletAction({ request } as never)) as Response
      expect(result.headers.get('X-Error')).toBeTruthy()
    })

    it('returns validation errors for invalid amount', async () => {
      const request = buildRequest({ intent: 'repay', amount: '0' })
      const result = (await walletAction({ request } as never)) as Record<
        string,
        unknown
      >
      expect(result).toHaveProperty('errors')
    })
  })

  describe('invalid intent', () => {
    it('redirects with error for unknown intent', async () => {
      const request = buildRequest({ intent: 'unknown' })
      const result = (await walletAction({ request } as never)) as Response
      expect(result.headers.get('Location')).toBe(ROUTES.WALLET)
      expect(result.headers.get('X-Error')).toBe(WALLET_MESSAGES.INVALID_ACTION)
    })
  })
})
