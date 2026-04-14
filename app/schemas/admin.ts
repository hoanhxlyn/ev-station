import { z } from 'zod'

export const toggleLockIntent = z.object({
  intent: z.literal('toggle-lock'),
  userId: z.string().min(1, 'User ID is required'),
})

export type ToggleLockValues = z.infer<typeof toggleLockIntent>
