import { loginSchema } from '~/schemas/auth'

type LoginActionResponse =
  | { errors: Record<string, string[]>; success?: never }
  | { success: true; message: string; errors?: never }

export async function loginAction(
  formData: FormData,
): Promise<LoginActionResponse> {
  const values = {
    accountName: formData.get('accountName')?.toString() ?? '',
    password: formData.get('password')?.toString() ?? '',
    remember: formData.get('remember') === 'on',
  }

  const result = loginSchema.safeParse(values)
  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }

  if (
    result.data.accountName === 'admin' &&
    result.data.password === '12081998'
  ) {
    return { success: true, message: 'Login Successful' }
  }

  return {
    errors: {
      accountName: ['Invalid credentials'],
      password: ['Check your account name and password'],
    },
  }
}
