import { redirect } from 'react-router'
import { auth } from '~/lib/auth.server'
import { ROUTES } from '~/constants/routes'

export async function requireAuth(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })

  if (!session?.user) {
    throw redirect(`${ROUTES.LOGIN}?reason=session_expired`)
  }

  return session
}

export async function requireVerified(request: Request) {
  const session = await requireAuth(request)

  if (!session.user.emailVerified) {
    throw redirect(ROUTES.SIGNUP_CHECK_EMAIL)
  }

  if ((session.user as Record<string, unknown>).status === 'locked') {
    throw new Response('Account locked', { status: 403 })
  }

  return session
}

export async function requireAdmin(request: Request) {
  const session = await requireVerified(request)

  if ((session.user as Record<string, unknown>).role !== 'admin') {
    throw new Response('Forbidden', { status: 403 })
  }

  return session
}
