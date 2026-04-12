import { count, eq, sql, gte } from 'drizzle-orm'
import { requireAdmin } from '~/lib/auth-guards'
import { db } from '~/lib/db'
import { user, station, transaction } from '~/lib/db/schema'
import type { Route } from './+types/page'

function getPeriodStart(period: string): Date {
  const now = new Date()
  switch (period) {
    case 'week':
      now.setDate(now.getDate() - 7)
      return now
    case 'month':
      now.setMonth(now.getMonth() - 1)
      return now
    case 'year':
      now.setFullYear(now.getFullYear() - 1)
      return now
    default:
      now.setDate(now.getDate() - 7)
      return now
  }
}

export async function adminLoader({ request }: Route.LoaderArgs) {
  await requireAdmin(request)

  const url = new URL(request.url)
  const period = url.searchParams.get('period') || 'week'
  const periodStart = getPeriodStart(period)

  const totalUsers = await db
    .select({ count: count() })
    .from(user)
    .where(eq(user.role, 'user'))

  const totalStations = await db.select({ count: count() }).from(station)

  const dailyTransactions = await db
    .select({ count: count() })
    .from(transaction)
    .where(gte(transaction.createdAt, periodStart))

  const cashFlowData = await db
    .select({
      date: sql<string>`date(${transaction.createdAt} / 1000, 'unixepoch')`,
      topUps: sql<number>`sum(case when ${transaction.type} = 'top-up' then ${transaction.amount} else 0 end)`,
      payments: sql<number>`sum(case when ${transaction.type} = 'charging-payment' then ${transaction.amount} else 0 end)`,
    })
    .from(transaction)
    .where(gte(transaction.createdAt, periodStart))
    .groupBy(sql`date(${transaction.createdAt} / 1000, 'unixepoch')`)
    .orderBy(sql`date(${transaction.createdAt} / 1000, 'unixepoch')`)

  return {
    totalUsers: totalUsers[0]?.count ?? 0,
    totalStations: totalStations[0]?.count ?? 0,
    dailyTransactions: dailyTransactions[0]?.count ?? 0,
    cashFlowData,
    period,
  }
}
