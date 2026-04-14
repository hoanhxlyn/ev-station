import { eq } from 'drizzle-orm'
import { redirectSuccess, redirectFail } from '~/lib/action-utils'
import { requireVerified } from '~/lib/auth-guards'
import { db } from '~/lib/db'
import { logger } from '~/lib/logger.server'
import { user } from '~/lib/db/schema'
import { updateProfileIntent } from '~/schemas/profile'
import { ROUTES } from '~/constants/routes'
import type { Route } from './+types/page'

export async function profileAction({ request }: Route.ActionArgs) {
  const session = await requireVerified(request)
  const userId = session.user.id
  const formData = await request.formData()
  const intent = formData.get('intent')?.toString()

  try {
    if (intent !== 'update') {
      logger.warn('[PROFILE] Invalid action intent', { userId, intent })
      return redirectFail(ROUTES.PROFILE, 'Invalid action')
    }

    const result = updateProfileIntent.safeParse({
      intent: 'update',
      name: formData.get('name')?.toString() ?? '',
      phone: formData.get('phone')?.toString() ?? '',
      image: formData.get('image')?.toString() ?? '',
    })

    if (!result.success) {
      logger.warn('[PROFILE] Update validation failed', {
        userId,
        errors: result.error.flatten().fieldErrors,
      })
      return { errors: result.error.flatten().fieldErrors }
    }

    const updateData: {
      name: string
      phone: string | null
      image: string | null
    } = {
      name: result.data.name,
      phone: result.data.phone || null,
      image: result.data.image || null,
    }

    await db.update(user).set(updateData).where(eq(user.id, userId))

    logger.info('[PROFILE] Profile updated', { userId })
    return redirectSuccess(ROUTES.PROFILE, 'Profile updated successfully')
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'Profile update failed'
    logger.error('[PROFILE] Update failed', { userId, error: message })
    return redirectFail(ROUTES.PROFILE, message)
  }
}
