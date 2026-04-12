import { eq } from 'drizzle-orm'
import { redirect } from 'react-router'
import { success, fail } from '~/constants/messages'
import { ROUTES } from '~/constants/routes'
import {
  redirectFail,
  redirectSuccess,
  extractErrorMessage,
} from '~/lib/action-utils'
import { auth } from '~/lib/auth.server'
import { db } from '~/lib/db'
import { logger } from '~/lib/logger.server'
import { user } from '~/lib/db/schema'
import { signupSchema, signupWithPasswordSchema } from '~/schemas/auth'
import type { Route } from './+types/page'

export async function signupAction({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  const signupMode =
    formData.get('signupMode') === 'oauth' ? 'oauth' : 'password'

  const values = {
    email: formData.get('email')?.toString() ?? '',
    username: formData.get('username')?.toString() ?? '',
    password: formData.get('password')?.toString() || undefined,
    name: formData.get('name')?.toString() ?? '',
    dateOfBirth: formData.get('dateOfBirth')?.toString() ?? '',
  }

  try {
    if (signupMode === 'oauth') {
      const result = signupSchema.safeParse(values)
      if (!result.success) {
        return {
          errors: result.error.flatten().fieldErrors,
        }
      }

      const existingUser = await db.query.user.findFirst({
        where: eq(user.email, result.data.email),
      })

      if (existingUser) {
        if (existingUser.signupMethod === 'manual') {
          return redirectFail(
            ROUTES.SIGNUP,
            'An account with this email already exists. Please sign in with your password.',
          )
        }
      }

      const session = await auth.api.getSession({
        headers: request.headers,
      })

      if (!session?.user?.id) {
        return redirectFail(
          ROUTES.LOGIN,
          'Please sign in with OAuth before completing your profile',
        )
      }

      await db
        .update(user)
        .set({
          dateOfBirth: result.data.dateOfBirth,
          username: result.data.username,
          signupMethod: 'oauth',
          isNew: false,
        })
        .where(eq(user.id, session.user.id))

      logger.info('[AUTH] OAuth signup completed', {
        userId: session.user.id,
        email: result.data.email,
      })
      return redirectSuccess(ROUTES.APP, success('Account created'))
    }

    const result = signupWithPasswordSchema.safeParse(values)
    if (!result.success) {
      return {
        errors: result.error.flatten().fieldErrors,
      }
    }

    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, result.data.email),
    })

    if (existingUser) {
      if (existingUser.signupMethod === 'oauth') {
        return redirectFail(
          ROUTES.SIGNUP,
          'An account with this email already exists via OAuth. Please sign in with GitHub.',
        )
      }
      return redirectFail(
        ROUTES.SIGNUP,
        'An account with this email already exists.',
      )
    }

    const response = await auth.api.signUpEmail({
      body: {
        email: result.data.email,
        password: result.data.password,
        name: result.data.name,
        username: result.data.username,
        callbackURL: ROUTES.LOGIN,
      },
      asResponse: true,
      headers: request.headers,
    })

    if (!response.ok) {
      const message = await extractErrorMessage(
        response,
        fail('Account creation'),
      )

      return redirectFail(ROUTES.SIGNUP, message)
    }

    await db
      .update(user)
      .set({
        dateOfBirth: result.data.dateOfBirth,
        signupMethod: 'manual',
      })
      .where(eq(user.email, result.data.email))

    logger.info('[AUTH] Password signup initiated', {
      email: result.data.email,
    })
    return redirect(
      `${ROUTES.SIGNUP_CHECK_EMAIL}?email=${encodeURIComponent(result.data.email)}`,
    )
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : fail('Account creation')
    logger.error('[AUTH] Signup error', { error: message })

    return redirectFail(ROUTES.SIGNUP, message)
  }
}
