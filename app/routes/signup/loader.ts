import { eq } from 'drizzle-orm'
import { auth } from '~/lib/auth.server'
import { db } from '~/lib/db'
import { user } from '~/lib/db/schema'
import type { Route } from './+types/page'

export async function signupLoader({ request }: Route.LoaderArgs) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session?.user?.id) {
    return null
  }

  const dbUser = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
  })

  if (!dbUser) {
    return null
  }

  return {
    email: dbUser.email ?? '',
    name: dbUser.name ?? '',
  }
}
