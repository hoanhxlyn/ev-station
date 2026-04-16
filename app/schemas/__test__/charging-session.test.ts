import { describe, it, expect } from 'vitest'
import {
  startSessionIntent,
  endSessionIntent,
  cancelSessionIntent,
} from '~/schemas/charging-session'

describe('startSessionIntent', () => {
  describe('intent', () => {
    it('accepts intent=start', () => {
      const result = startSessionIntent.safeParse({
        intent: 'start',
        stationId: 'station-123',
        vehicleId: 'vehicle-456',
      })
      expect(result.success).toBe(true)
    })

    it('rejects non-start intent', () => {
      const result = startSessionIntent.safeParse({
        intent: 'end',
        stationId: 'station-123',
        vehicleId: 'vehicle-456',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('stationId', () => {
    it('accepts valid stationId', () => {
      const result = startSessionIntent.safeParse({
        intent: 'start',
        stationId: 'station-123',
        vehicleId: 'vehicle-456',
      })
      expect(result.success).toBe(true)
    })

    it('rejects empty stationId', () => {
      const result = startSessionIntent.safeParse({
        intent: 'start',
        stationId: '',
        vehicleId: 'vehicle-456',
      })
      expect(result.success).toBe(false)
    })

    it('rejects missing stationId', () => {
      const result = startSessionIntent.safeParse({
        intent: 'start',
        vehicleId: 'vehicle-456',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('vehicleId', () => {
    it('accepts valid vehicleId', () => {
      const result = startSessionIntent.safeParse({
        intent: 'start',
        stationId: 'station-123',
        vehicleId: 'vehicle-456',
      })
      expect(result.success).toBe(true)
    })

    it('rejects empty vehicleId', () => {
      const result = startSessionIntent.safeParse({
        intent: 'start',
        stationId: 'station-123',
        vehicleId: '',
      })
      expect(result.success).toBe(false)
    })

    it('rejects missing vehicleId', () => {
      const result = startSessionIntent.safeParse({
        intent: 'start',
        stationId: 'station-123',
      })
      expect(result.success).toBe(false)
    })
  })
})

describe('endSessionIntent', () => {
  describe('intent', () => {
    it('accepts intent=end', () => {
      const result = endSessionIntent.safeParse({
        intent: 'end',
        sessionId: 'session-789',
      })
      expect(result.success).toBe(true)
    })

    it('rejects non-end intent', () => {
      const result = endSessionIntent.safeParse({
        intent: 'cancel',
        sessionId: 'session-789',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('sessionId', () => {
    it('accepts valid sessionId', () => {
      const result = endSessionIntent.safeParse({
        intent: 'end',
        sessionId: 'session-789',
      })
      expect(result.success).toBe(true)
    })

    it('rejects empty sessionId', () => {
      const result = endSessionIntent.safeParse({
        intent: 'end',
        sessionId: '',
      })
      expect(result.success).toBe(false)
    })

    it('rejects missing sessionId', () => {
      const result = endSessionIntent.safeParse({
        intent: 'end',
      })
      expect(result.success).toBe(false)
    })
  })
})

describe('cancelSessionIntent', () => {
  describe('intent', () => {
    it('accepts intent=cancel', () => {
      const result = cancelSessionIntent.safeParse({
        intent: 'cancel',
        sessionId: 'session-789',
      })
      expect(result.success).toBe(true)
    })

    it('rejects non-cancel intent', () => {
      const result = cancelSessionIntent.safeParse({
        intent: 'start',
        sessionId: 'session-789',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('sessionId', () => {
    it('accepts valid sessionId', () => {
      const result = cancelSessionIntent.safeParse({
        intent: 'cancel',
        sessionId: 'session-789',
      })
      expect(result.success).toBe(true)
    })

    it('rejects empty sessionId', () => {
      const result = cancelSessionIntent.safeParse({
        intent: 'cancel',
        sessionId: '',
      })
      expect(result.success).toBe(false)
    })

    it('rejects missing sessionId', () => {
      const result = cancelSessionIntent.safeParse({
        intent: 'cancel',
      })
      expect(result.success).toBe(false)
    })
  })
})
