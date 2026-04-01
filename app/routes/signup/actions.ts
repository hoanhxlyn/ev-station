import { eq } from 'drizzle-orm'
import { redirect } from 'react-router'
import { success, fail } from '~/constants/messages'
import { ROUTES } from '~/constants/routes'
import { redirectFail, redirectSuccess } from '~/lib/action-utils'
import { auth } from '~/lib/auth.server'
import { db } from '~/lib/db'
import { user } from '~/lib/db/schema'
import { signupSchema, signupWithPasswordSchema } from '~/schemas/auth'
import type { Route } from './+types/page'

export async function signupAction({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  const signupMode =
    formData.get('signupMode') === 'oauth' ? 'oauth' : 'password'

  const values = {
    email: formData.get('email')?.toString() ?? '',
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
          isNew: false,
        })
        .where(eq(user.id, session.user.id))

      return redirectSuccess(ROUTES.HOME, success('Account created'))
    }

    const result = signupWithPasswordSchema.safeParse(values)
    if (!result.success) {
      return {
        errors: result.error.flatten().fieldErrors,
      }
    }

    const response = await auth.api.signUpEmail({
      body: {
        email: result.data.email,
        password: result.data.password,
        name: result.data.name,
        callbackURL: ROUTES.LOGIN,
      },
      asResponse: true,
      headers: request.headers,
    })

    if (!response.ok) {
      let message: string = fail('Account creation')

      try {
        const payload = (await response.clone().json()) as {
          message?: string
          error?: {
            message?: string
          }
        }
        message = payload.error?.message ?? payload.message ?? message
      } catch {
        // Fallback to default signup error message when response body isn't JSON.
      }

      return redirectFail(ROUTES.SIGNUP, message)
    }

    await db
      .update(user)
      .set({
        dateOfBirth: result.data.dateOfBirth,
      })
      .where(eq(user.email, result.data.email))

    return redirect(
      `${ROUTES.SIGNUP_CHECK_EMAIL}?email=${encodeURIComponent(result.data.email)}`,
    )
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : fail('Account creation')

    return redirectFail(ROUTES.SIGNUP, message)
  }
}
