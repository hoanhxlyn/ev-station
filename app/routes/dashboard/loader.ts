import { and, desc, eq, gte, sql, count, sum } from 'drizzle-orm'
import { requireVerified } from '~/lib/auth-guards'
import { db } from '~/lib/db'
import {
  user,
  chargingSession,
  transaction,
  station,
  vehicle,
} from '~/lib/db/schema'
import { CREDIT_UNIT, PAGINATION } from '~/constants/dashboard'
import type { Route } from './+types/page'

type Period = 'day' | 'week' | 'month' | 'year'

function getPeriodStart(period: Period): Date {
  const now = new Date()
  switch (period) {
    case 'day':
      now.setHours(0, 0, 0, 0)
      return now
    case 'week':
      now.setDate(now.getDate() - 7)
      return now
    case 'month':
      now.setMonth(now.getMonth() - 1)
      return now
    case 'year':
      now.setFullYear(now.getFullYear() - 1)
      return now
  }
}

export async function dashboardLoader({ request }: Route.LoaderArgs) {
  const session = await requireVerified(request)
  const userId = session.user.id

  const url = new URL(request.url)
  const period = (url.searchParams.get('period') as Period) || 'week'
  const periodStart = getPeriodStart(period)

  const userData = await db.query.user.findFirst({
    where: eq(user.id, userId),
    columns: {
      id: true,
      name: true,
      email: true,
      role: true,
      creditBalance: true,
    },
  })

  if (!userData) {
    throw new Response('User not found', { status: 404 })
  }

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
    limit: PAGINATION.DASHBOARD_SESSIONS_LIMIT,
    with: {
      station: true,
      vehicle: true,
    },
  })

  const totalTopUp = await db
    .select({ total: sum(transaction.amount) })
    .from(transaction)
    .where(and(eq(transaction.userId, userId), eq(transaction.type, 'top-up')))

  const aggregatedData = await db
    .select({
      date: sql<string>`date(${transaction.createdAt} / 1000, 'unixepoch')`,
      transactions: count(),
      amount: sum(transaction.amount),
    })
    .from(transaction)
    .where(
      and(
        eq(transaction.userId, userId),
        gte(transaction.createdAt, periodStart),
      ),
    )
    .groupBy(sql`date(${transaction.createdAt} / 1000, 'unixepoch')`)
    .orderBy(sql`date(${transaction.createdAt} / 1000, 'unixepoch')`)

  const stations = await db.query.station.findMany({
    where: eq(station.status, 'available'),
    orderBy: [station.name],
  })

  const vehicles = await db.query.vehicle.findMany({
    where: eq(vehicle.userId, userId),
    orderBy: [vehicle.brand, vehicle.model],
  })

  return {
    user: {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      creditBalance: userData.creditBalance,
    },
    activeSession,
    recentSessions,
    totalTopUp: Number(totalTopUp[0]?.total ?? 0),
    aggregatedData,
    stations,
    vehicles,
    period,
    creditUnit: CREDIT_UNIT,
  }
}
