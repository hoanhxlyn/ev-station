import { z } from 'zod'
import {
  VALIDATION_CONSTRAINTS,
  VALIDATION_MESSAGES,
} from '~/constants/validation'

export const updateProfileIntent = z.object({
  intent: z.literal('update'),
  name: z
    .string()
    .min(
      VALIDATION_CONSTRAINTS.NAME_MIN_LENGTH,
      VALIDATION_MESSAGES.NAME_REQUIRED,
    )
    .max(
      VALIDATION_CONSTRAINTS.NAME_MAX_LENGTH,
      VALIDATION_MESSAGES.NAME_MAX_LENGTH,
    ),
  phone: z
    .string()
    .max(20, 'Phone must be at most 20 characters')
    .optional()
    .or(z.literal('')),
  image: z.string().url('Enter a valid URL').optional().or(z.literal('')),
})

export type UpdateProfileValues = z.infer<typeof updateProfileIntent>
