import { z } from 'zod'
import { VALIDATION_MESSAGES } from '~/constants/messages'

export const loginSchema = z.object({
  accountName: z
    .string()
    .min(1, { message: VALIDATION_MESSAGES.ACCOUNT_NAME_REQUIRED })
    .max(100, {
      message: VALIDATION_MESSAGES.ACCOUNT_NAME_MAX_LENGTH,
    }),
  password: z
    .string()
    .min(1, { message: VALIDATION_MESSAGES.PASSWORD_REQUIRED })
    .max(12, {
      message: VALIDATION_MESSAGES.PASSWORD_MAX_LENGTH,
    }),
  remember: z.boolean().optional(),
})

export type LoginValues = z.infer<typeof loginSchema>
