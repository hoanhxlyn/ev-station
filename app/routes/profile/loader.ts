import { eq } from 'drizzle-orm'
import { requireVerified } from '~/lib/auth-guards'
import { db } from '~/lib/db'
import { user } from '~/lib/db/schema'
import type { Route } from './+types/page'

export async function profileLoader({ request }: Route.LoaderArgs) {
  const session = await requireVerified(request)
  const userId = session.user.id

  const userData = await db.query.user.findFirst({
    where: eq(user.id, userId),
    columns: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      username: true,
    },
  })

  if (!userData) {
    throw new Response('User not found', { status: 404 })
  }

  return {
    user: userData,
  }
}
