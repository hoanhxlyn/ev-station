import { and, desc, eq } from 'drizzle-orm'
import { requireVerified } from '~/lib/auth-guards'
import { db } from '~/lib/db'
import { chargingSession, station, vehicle } from '~/lib/db/schema'
import type { Route } from './+types/page'

export async function chargingLoader({ request }: Route.LoaderArgs) {
  const session = await requireVerified(request)
  const userId = session.user.id

  const activeSession = await db.query.chargingSession.findFirst({
    where: and(
      eq(chargingSession.userId, userId),
      eq(chargingSession.status, 'in-progress'),
    ),
    with: {
      station: true,
      vehicle: true,
    },
  })

  const recentSessions = await db.query.chargingSession.findMany({
    where: eq(chargingSession.userId, userId),
    orderBy: [desc(chargingSession.createdAt)],
    limit: 10,
    with: {
      station: true,
      vehicle: true,
    },
  })

  const stations = await db.query.station.findMany({
    where: eq(station.status, 'available'),
    orderBy: [station.name],
  })

  const vehicles = await db.query.vehicle.findMany({
    where: eq(vehicle.userId, userId),
    orderBy: [vehicle.brand, vehicle.model],
  })

  return {
    activeSession,
    recentSessions,
    stations,
    vehicles,
  }
}
