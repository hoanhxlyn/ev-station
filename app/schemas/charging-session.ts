import { z } from 'zod'

export const startSessionIntent = z.object({
  intent: z.literal('start'),
  stationId: z.string().min(1, 'Station is required'),
  vehicleId: z.string().min(1, 'Vehicle is required'),
})

export const endSessionIntent = z.object({
  intent: z.literal('end'),
  sessionId: z.string().min(1, 'Session ID is required'),
})

export const cancelSessionIntent = z.object({
  intent: z.literal('cancel'),
  sessionId: z.string().min(1, 'Session ID is required'),
})

export type StartSessionValues = z.infer<typeof startSessionIntent>
export type EndSessionValues = z.infer<typeof endSessionIntent>
export type CancelSessionValues = z.infer<typeof cancelSessionIntent>
