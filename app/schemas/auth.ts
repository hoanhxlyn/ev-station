import { z } from 'zod'

export const loginSchema = z.object({
  accountName: z
    .string()
    .min(1, { message: 'Account name is required' })
    .max(100, {
      message: 'Password length exceeded 100 characters',
    }),
  password: z.string().min(1, { message: 'Password is required' }).max(12, {
    message: 'Password length exceeded 12 characters',
  }),
  remember: z.boolean().optional(),
})

export type LoginValues = z.infer<typeof loginSchema>
