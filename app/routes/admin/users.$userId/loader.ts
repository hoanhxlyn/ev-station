import { eq, desc } from 'drizzle-orm'
import { requireAdmin } from '~/lib/auth-guards'
import { db } from '~/lib/db'
import { user, vehicle, transaction, chargingSession } from '~/lib/db/schema'
import { PAGINATION } from '~/constants/dashboard'
import type { Route } from './+types/page'

export async function adminUserDetailLoader({
  request,
  params,
}: Route.LoaderArgs) {
  await requireAdmin(request)
  const userId = params.userId

  const userData = await db.query.user.findFirst({
    where: eq(user.id, userId),
    columns: {
      id: true,
      name: true,
      email: true,
      username: true,
      role: true,
      status: true,
      creditBalance: true,
      phone: true,
      createdAt: true,
    },
  })

  if (!userData) {
    throw new Response('User not found', { status: 404 })
  }

  const vehicles = await db.query.vehicle.findMany({
    where: eq(vehicle.userId, userId),
    orderBy: [desc(vehicle.createdAt)],
  })

  const transactions = await db.query.transaction.findMany({
    where: eq(transaction.userId, userId),
    orderBy: [desc(transaction.createdAt)],
    limit: PAGINATION.ADMIN_USER_TRANSACTIONS_LIMIT,
  })

  const sessions = await db.query.chargingSession.findMany({
    where: eq(chargingSession.userId, userId),
    orderBy: [desc(chargingSession.createdAt)],
    limit: PAGINATION.ADMIN_USER_SESSIONS_LIMIT,
    with: {
      station: true,
      vehicle: true,
    },
  })

  return {
    userData,
    vehicles,
    transactions,
    sessions,
  }
}
