import { loginSchema } from '~/schemas/auth'
import { LOGIN_MESSAGES, success } from '~/constants/messages'
import { respondSuccess, respondFail } from '~/lib/action-utils'
import type { Route } from './+types/page'

export async function loginAction({ request }: Route.ActionArgs) {
  const formData = await request.formData()

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
    return respondSuccess({ success: true }, success('Login'))
  }

  return respondFail(
    {
      errors: {
        accountName: [LOGIN_MESSAGES.INVALID_CREDENTIALS],
        password: [LOGIN_MESSAGES.CHECK_CREDENTIALS],
      },
    },
    LOGIN_MESSAGES.INVALID_CREDENTIALS,
  )
}
