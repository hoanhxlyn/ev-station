import { redirect } from 'react-router'
import { loginSchema, looksLikeEmail } from '~/schemas/auth'
import { LOGIN_MESSAGES, fail } from '~/constants/messages'
import { extractErrorMessage, redirectFail } from '~/lib/action-utils'
import { auth } from '~/lib/auth.server'
import { ROUTES } from '~/constants/routes'
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
    return { errors: result.error.flatten().fieldErrors }
  }

  const { accountName, password, remember } = result.data

  try {
    const response = await signIn(accountName, password, remember, request)

    if (!response.ok) {
      const message = await extractErrorMessage(
        response,
        LOGIN_MESSAGES.INVALID_CREDENTIALS,
      )
      return redirectFail(ROUTES.LOGIN, message)
    }

    return redirect(ROUTES.HOME, { headers: response.headers })
  } catch (error) {
    const message =
      error instanceof Error && error.message ? error.message : fail('Login')

    return redirectFail(ROUTES.LOGIN, message)
  }
}

function signIn(
  accountName: string,
  password: string,
  rememberMe: boolean | undefined,
  request: Request,
) {
  const opts = { asResponse: true, headers: request.headers } as const

  if (looksLikeEmail(accountName)) {
    return auth.api.signInEmail({
      body: { email: accountName, password, rememberMe },
      ...opts,
    })
  }

  return auth.api.signInUsername({
    body: { username: accountName, password, rememberMe },
    ...opts,
  })
}
