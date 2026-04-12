import { count, eq, like, and, desc } from 'drizzle-orm'
import { requireAdmin } from '~/lib/auth-guards'
import { db } from '~/lib/db'
import { user } from '~/lib/db/schema'
import { PAGINATION } from '~/constants/dashboard'
import type { Route } from './+types/page'

export async function adminUsersLoader({ request }: Route.LoaderArgs) {
  await requireAdmin(request)

  const url = new URL(request.url)
  const search = url.searchParams.get('search') || ''
  const status = url.searchParams.get('status') || 'all'
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10))

  const whereConditions = [eq(user.role, 'user')]

  if (search) {
    whereConditions.push(like(user.name, `%${search}%`))
  }

  if (status !== 'all') {
    whereConditions.push(eq(user.status, status as 'active' | 'locked'))
  }

  const totalCount = await db
    .select({ count: count() })
    .from(user)
    .where(and(...whereConditions))

  const users = await db.query.user.findMany({
    where: and(...whereConditions),
    columns: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      creditBalance: true,
      createdAt: true,
    },
    with: {
      vehicles: {
        columns: { id: true },
      },
    },
    orderBy: [desc(user.createdAt)],
    limit: PAGINATION.ADMIN_USERS_PAGE_SIZE,
    offset: (page - 1) * PAGINATION.ADMIN_USERS_PAGE_SIZE,
  })

  const usersWithStats = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.status,
    creditBalance: u.creditBalance,
    createdAt: u.createdAt,
    vehicleCount: u.vehicles.length,
  }))

  return {
    users: usersWithStats,
    totalCount: totalCount[0]?.count ?? 0,
    page,
    pageSize: PAGINATION.ADMIN_USERS_PAGE_SIZE,
    search,
    status,
  }
}
