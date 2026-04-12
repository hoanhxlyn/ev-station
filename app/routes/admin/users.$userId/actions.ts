import { eq, and } from 'drizzle-orm'
import { ADMIN_MESSAGES } from '~/constants/messages'
import { redirectSuccess, redirectFail } from '~/lib/action-utils'
import { requireAdmin } from '~/lib/auth-guards'
import { db } from '~/lib/db'
import { user, chargingSession, station } from '~/lib/db/schema'
import { toggleLockIntent } from '~/schemas/admin'
import { logger } from '~/lib/logger.server'
import type { Route } from './+types/page'

export async function adminUserDetailAction({
  request,
  params,
}: Route.ActionArgs) {
  await requireAdmin(request)
  const userId = params.userId
  const formData = await request.formData()
  const intent = formData.get('intent')?.toString()

  try {
    if (intent !== 'toggle-lock') {
      return redirectFail(`/admin/users/${userId}`, 'Invalid action')
    }

    const result = toggleLockIntent.safeParse({
      intent: 'toggle-lock',
      userId: formData.get('userId')?.toString() ?? '',
    })

    if (!result.success) {
      return { errors: result.error.flatten().fieldErrors }
    }

    const targetUser = await db.query.user.findFirst({
      where: eq(user.id, result.data.userId),
      columns: { id: true, role: true, status: true },
    })

    if (!targetUser) {
      throw new Error('User not found')
    }

    if (targetUser.role === 'admin') {
      throw new Error(ADMIN_MESSAGES.CANNOT_LOCK_ADMIN)
    }

    const newStatus = targetUser.status === 'active' ? 'locked' : 'active'

    await db
      .update(user)
      .set({ status: newStatus })
      .where(eq(user.id, result.data.userId))

    if (newStatus === 'locked') {
      const activeSessions = await db.query.chargingSession.findMany({
        where: and(
          eq(chargingSession.userId, result.data.userId),
          eq(chargingSession.status, 'in-progress'),
        ),
        columns: { stationId: true },
      })

      await db
        .update(chargingSession)
        .set({
          status: 'cancelled',
          endAt: new Date(),
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(chargingSession.userId, result.data.userId),
            eq(chargingSession.status, 'in-progress'),
          ),
        )

      await Promise.all(
        activeSessions.map((s) =>
          db
            .update(station)
            .set({ status: 'available' })
            .where(eq(station.id, s.stationId)),
        ),
      )

      logger.info(
        `[ADMIN] Locked user ${result.data.userId} and cancelled ${activeSessions.length} active sessions`,
      )
    } else {
      logger.info(`[ADMIN] Unlocked user ${result.data.userId}`)
    }

    const message =
      newStatus === 'locked'
        ? ADMIN_MESSAGES.LOCK_SUCCESS
        : ADMIN_MESSAGES.UNLOCK_SUCCESS

    return redirectSuccess(`/admin/users/${userId}`, message)
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : ADMIN_MESSAGES.LOCK_FAIL
    return redirectFail(`/admin/users/${userId}`, message)
  }
}
