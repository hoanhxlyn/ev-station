import { eq } from 'drizzle-orm'
import { requireVerified } from '~/lib/auth-guards'
import { db } from '~/lib/db'
import { vehicle } from '~/lib/db/schema'
import type { Route } from './+types/page'

export async function vehiclesLoader({ request }: Route.LoaderArgs) {
  const session = await requireVerified(request)
  const userId = session.user.id

  const vehicles = await db.query.vehicle.findMany({
    where: eq(vehicle.userId, userId),
    orderBy: [vehicle.brand, vehicle.model],
  })

  return {
    vehicles,
  }
}
