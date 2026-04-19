import { redirect } from 'react-router'
import { loginSchema, looksLikeEmail } from '~/schemas/auth'
import { LOGIN_MESSAGES, fail } from '~/constants/messages'
import { extractErrorMessage, redirectFail } from '~/lib/action-utils'
import { auth } from '~/lib/auth.server'
import { logger } from '~/lib/logger.server'
import { ROUTES } from '~/constants/routes'
import type { Route } from './+types/page'
import z from 'zod'

export async function loginAction({ request }: Route.ActionArgs) {
  const formData = await request.formData()

  const values = {
    accountName: formData.get('accountName')?.toString() ?? '',
    password: formData.get('password')?.toString() ?? '',
    remember: formData.get('remember') === 'on',
  }

  const result = loginSchema.safeParse(values)
  if (!result.success) {
    const errors = z.flattenError(result.error)
    logger.warn('[AUTH] Login validation failed', errors)
    return { errors }
  }

  const { accountName, password, remember } = result.data

  try {
    const response = await signIn(accountName, password, remember, request)

    if (!response.ok) {
      const message = await extractErrorMessage(
        response,
        LOGIN_MESSAGES.INVALID_CREDENTIALS,
      )
      logger.warn('[AUTH] Login failed', {
        accountName,
        reason: 'invalid_credentials',
      })
      return redirectFail(ROUTES.LOGIN, message)
    }

    const session = await auth.api.getSession({
      headers: response.headers,
    })

    if (session?.user) {
      logger.info('[AUTH] Login successful', {
        userId: session.user.id,
        emailVerified: session.user.emailVerified,
      })
      if (!session.user.emailVerified) {
        return redirect(ROUTES.SIGNUP_CHECK_EMAIL, {
          headers: response.headers,
        })
      }

      const userRole = (session.user as Record<string, unknown>).role
      if (userRole === 'admin') {
        return redirect(ROUTES.ADMIN, { headers: response.headers })
      }
    }

    return redirect(ROUTES.APP, { headers: response.headers })
  } catch (error) {
    const message =
      error instanceof Error && error.message ? error.message : fail('Login')
    logger.error('[AUTH] Login error', { accountName, error: message })

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
