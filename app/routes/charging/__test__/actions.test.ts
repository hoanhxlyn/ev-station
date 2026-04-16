import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ROUTES } from '~/constants/routes'
import { CHARGING_MESSAGES } from '~/constants/messages'

// --- Mocks ---

const mockInsert = vi.fn().mockReturnThis()
const mockValues = vi.fn().mockResolvedValue(undefined)
const mockUpdate = vi.fn().mockReturnThis()
const mockSet = vi.fn().mockReturnThis()
const mockWhere = vi.fn().mockResolvedValue(undefined)

const mockDb = {
  insert: (...args: unknown[]) => mockInsert(...args),
  update: (...args: unknown[]) => mockUpdate(...args),
  query: {
    user: {
      findFirst: vi.fn(),
    },
    chargingSession: {
      findFirst: vi.fn(),
    },
    station: {
      findFirst: vi.fn(),
    },
    vehicle: {
      findFirst: vi.fn(),
    },
  },
}

vi.mock('~/lib/db', () => ({
  db: mockDb,
}))

vi.mock('~/lib/db/schema', () => ({
  user: Symbol('user-table'),
  chargingSession: Symbol('charging-session-table'),
  station: Symbol('station-table'),
  vehicle: Symbol('vehicle-table'),
  transaction: Symbol('transaction-table'),
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

vi.mock('drizzle-orm', () => ({
  and: (...args: unknown[]) => args,
  eq: (col: unknown, val: unknown) => ({ col, val }),
  sql: (strings: TemplateStringsArray, ...values: unknown[]) => ({
    strings,
    values,
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
  return new Request('http://localhost/charging', {
    method: 'POST',
    body: fd,
  })
}

const { chargingAction } = await import('../actions')

describe('chargingAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockInsert.mockReturnThis()
    mockValues.mockResolvedValue(undefined)
    mockUpdate.mockReturnThis()
    mockSet.mockReturnThis()
    mockWhere.mockResolvedValue(undefined)
  })

  describe('start session', () => {
    it('starts a session when all conditions are met', async () => {
      mockDb.query.user.findFirst.mockResolvedValue({
        creditBalance: 5000,
        status: 'active',
      })
      mockDb.query.chargingSession.findFirst.mockResolvedValue(null)
      mockDb.query.station.findFirst.mockResolvedValue({
        id: 'station-1',
        status: 'available',
      })
      mockDb.query.vehicle.findFirst.mockResolvedValue({
        id: 'vehicle-1',
      })

      const request = buildRequest({
        intent: 'start',
        stationId: 'station-1',
        vehicleId: 'vehicle-1',
      })
      const result = (await chargingAction({ request } as never)) as Response
      expect(result).toBeInstanceOf(Response)
      expect(result.headers.get('Location')).toBe(ROUTES.CHARGING)
    })

    it('fails when user is locked', async () => {
      mockDb.query.user.findFirst.mockResolvedValue({
        creditBalance: 5000,
        status: 'locked',
      })

      const request = buildRequest({
        intent: 'start',
        stationId: 'station-1',
        vehicleId: 'vehicle-1',
      })
      const result = (await chargingAction({ request } as never)) as Response
      expect(result.headers.get('X-Error')).toBeTruthy()
    })

    it('fails when user balance is at debt limit', async () => {
      mockDb.query.user.findFirst.mockResolvedValue({
        creditBalance: -50000,
        status: 'active',
      })

      const request = buildRequest({
        intent: 'start',
        stationId: 'station-1',
        vehicleId: 'vehicle-1',
      })
      const result = (await chargingAction({ request } as never)) as Response
      expect(result.headers.get('X-Error')).toBeTruthy()
    })

    it('fails when user already has an active session', async () => {
      mockDb.query.user.findFirst.mockResolvedValue({
        creditBalance: 5000,
        status: 'active',
      })
      mockDb.query.chargingSession.findFirst.mockResolvedValue({
        id: 'existing-session',
      })

      const request = buildRequest({
        intent: 'start',
        stationId: 'station-1',
        vehicleId: 'vehicle-1',
      })
      const result = (await chargingAction({ request } as never)) as Response
      expect(result.headers.get('X-Error')).toBeTruthy()
    })

    it('fails when station is not available', async () => {
      mockDb.query.user.findFirst.mockResolvedValue({
        creditBalance: 5000,
        status: 'active',
      })
      mockDb.query.chargingSession.findFirst.mockResolvedValue(null)
      mockDb.query.station.findFirst.mockResolvedValue({
        id: 'station-1',
        status: 'occupied',
      })

      const request = buildRequest({
        intent: 'start',
        stationId: 'station-1',
        vehicleId: 'vehicle-1',
      })
      const result = (await chargingAction({ request } as never)) as Response
      expect(result.headers.get('X-Error')).toBeTruthy()
    })

    it('returns validation errors for missing fields', async () => {
      const request = buildRequest({
        intent: 'start',
        stationId: '',
        vehicleId: '',
      })
      const result = (await chargingAction({ request } as never)) as Record<
        string,
        unknown
      >
      expect(result).toHaveProperty('errors')
    })
  })

  describe('end session', () => {
    it('ends a session and deducts cost', async () => {
      mockDb.query.chargingSession.findFirst.mockResolvedValue({
        id: 'session-1',
        startAt: new Date(Date.now() - 3600000),
        station: {
          id: 'station-1',
          name: 'Station A',
          powerOutput: 50,
          pricePerKwh: 30,
        },
      })
      mockDb.query.station.findFirst.mockResolvedValue(null)

      const request = buildRequest({ intent: 'end', sessionId: 'session-1' })
      const result = (await chargingAction({ request } as never)) as Response
      expect(result).toBeInstanceOf(Response)
      expect(result.headers.get('Location')).toBe(ROUTES.CHARGING)
      expect(mockUpdate).toHaveBeenCalled()
    })

    it('fails when no active session exists', async () => {
      mockDb.query.chargingSession.findFirst.mockResolvedValue(null)

      const request = buildRequest({ intent: 'end', sessionId: 'session-1' })
      const result = (await chargingAction({ request } as never)) as Response
      expect(result.headers.get('X-Error')).toBeTruthy()
    })
  })

  describe('cancel session', () => {
    it('cancels an active session', async () => {
      mockDb.query.chargingSession.findFirst.mockResolvedValue({
        id: 'session-1',
        stationId: 'station-1',
      })

      const request = buildRequest({
        intent: 'cancel',
        sessionId: 'session-1',
      })
      const result = (await chargingAction({ request } as never)) as Response
      expect(result).toBeInstanceOf(Response)
      expect(result.headers.get('Location')).toBe(ROUTES.CHARGING)
    })

    it('fails when no active session to cancel', async () => {
      mockDb.query.chargingSession.findFirst.mockResolvedValue(null)

      const request = buildRequest({
        intent: 'cancel',
        sessionId: 'session-1',
      })
      const result = (await chargingAction({ request } as never)) as Response
      expect(result.headers.get('X-Error')).toBeTruthy()
    })
  })

  describe('invalid intent', () => {
    it('redirects with error for unknown intent', async () => {
      const request = buildRequest({ intent: 'unknown' })
      const result = (await chargingAction({ request } as never)) as Response
      expect(result.headers.get('Location')).toBe(ROUTES.CHARGING)
      expect(result.headers.get('X-Error')).toBe(
        CHARGING_MESSAGES.INVALID_ACTION,
      )
    })
  })
})
