import { z } from 'zod'
import {
  VALIDATION_CONSTRAINTS,
  VALIDATION_MESSAGES,
} from '~/constants/validation'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const usernameRegex = /^[a-zA-Z0-9_]+$/

const looksLikeEmail = (val: string) =>
  val.includes('@') && val.indexOf('@') === val.lastIndexOf('@')

const accountNameSchema = z
  .string()
  .min(
    VALIDATION_CONSTRAINTS.ACCOUNT_NAME_MIN_LENGTH,
    VALIDATION_MESSAGES.ACCOUNT_NAME_REQUIRED,
  )
  .max(
    VALIDATION_CONSTRAINTS.ACCOUNT_NAME_MAX_LENGTH,
    VALIDATION_MESSAGES.ACCOUNT_NAME_MAX_LENGTH,
  )

export const loginSchema = z
  .object({
    accountName: accountNameSchema,
    password: z
      .string()
      .min(
        VALIDATION_CONSTRAINTS.PASSWORD_MIN_LENGTH,
        VALIDATION_MESSAGES.PASSWORD_REQUIRED,
      )
      .max(
        VALIDATION_CONSTRAINTS.PASSWORD_MAX_LENGTH,
        VALIDATION_MESSAGES.PASSWORD_MAX_LENGTH,
      ),
    remember: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    const { accountName } = data
    const isValid = looksLikeEmail(accountName)
      ? emailRegex.test(accountName)
      : usernameRegex.test(accountName)

    if (!isValid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: VALIDATION_MESSAGES.ACCOUNT_NAME_INVALID_FORMAT,
        path: ['accountName'],
      })
    }
  })

export type LoginValues = z.infer<typeof loginSchema>
