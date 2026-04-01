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

const DOB_DEFAULT = '1987-01-01'

const dateOfBirthSchema = z
  .string()
  .refine(
    (val) => val === '' || !isNaN(Date.parse(val)),
    VALIDATION_MESSAGES.DOB_INVALID,
  )
  .refine((val) => {
    if (val === '') return true
    const dob = new Date(val)
    const today = new Date()
    const age =
      today.getFullYear() -
      dob.getFullYear() -
      (today.getMonth() < dob.getMonth() ||
      (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
        ? 1
        : 0)
    return age >= VALIDATION_CONSTRAINTS.MIN_AGE
  }, VALIDATION_MESSAGES.DOB_MIN_AGE)
  .transform((val) => (val === '' ? DOB_DEFAULT : val))

const signupPasswordSchema = z
  .string()
  .min(
    VALIDATION_CONSTRAINTS.PASSWORD_MIN_LENGTH,
    VALIDATION_MESSAGES.PASSWORD_REQUIRED,
  )
  .max(
    VALIDATION_CONSTRAINTS.PASSWORD_MAX_LENGTH,
    VALIDATION_MESSAGES.PASSWORD_MAX_LENGTH,
  )

const usernameSchema = z
  .string()
  .min(
    VALIDATION_CONSTRAINTS.USERNAME_MIN_LENGTH,
    VALIDATION_MESSAGES.USERNAME_MIN_LENGTH,
  )
  .max(
    VALIDATION_CONSTRAINTS.USERNAME_MAX_LENGTH,
    VALIDATION_MESSAGES.USERNAME_MAX_LENGTH,
  )
  .regex(usernameRegex, VALIDATION_MESSAGES.USERNAME_INVALID_FORMAT)

export const signupSchema = z.object({
  email: z
    .string()
    .min(1, VALIDATION_MESSAGES.EMAIL_REQUIRED)
    .email(VALIDATION_MESSAGES.EMAIL_INVALID),
  username: usernameSchema,
  password: signupPasswordSchema.optional(),
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
  dateOfBirth: z.preprocess((val) => val ?? '', dateOfBirthSchema),
})

export const signupWithPasswordSchema = signupSchema.extend({
  password: signupPasswordSchema,
})

export type SignupValues = z.infer<typeof signupSchema>

export type LoginValues = z.infer<typeof loginSchema>
