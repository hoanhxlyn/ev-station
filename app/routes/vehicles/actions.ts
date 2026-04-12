import { and, eq } from 'drizzle-orm'
import { VEHICLE_MESSAGES } from '~/constants/messages'
import { redirectSuccess, redirectFail } from '~/lib/action-utils'
import { requireVerified } from '~/lib/auth-guards'
import { db } from '~/lib/db'
import { logger } from '~/lib/logger.server'
import { vehicle, chargingSession } from '~/lib/db/schema'
import {
  addVehicleIntent,
  editVehicleIntent,
  deleteVehicleIntent,
} from '~/schemas/vehicle'
import { ROUTES } from '~/constants/routes'
import type { Route } from './+types/page'

export async function vehiclesAction({ request }: Route.ActionArgs) {
  const session = await requireVerified(request)
  const userId = session.user.id
  const formData = await request.formData()
  const intent = formData.get('intent')?.toString()

  try {
    if (intent === 'add') {
      return await handleAddVehicle(formData, userId)
    }

    if (intent === 'edit') {
      return await handleEditVehicle(formData, userId)
    }

    if (intent === 'delete') {
      return await handleDeleteVehicle(formData, userId)
    }

    logger.warn('[VEHICLES] Invalid action intent', { userId, intent })
    return redirectFail(ROUTES.VEHICLES, 'Invalid action')
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : (VEHICLE_MESSAGES[
            `${intent === 'add' ? 'ADD' : intent === 'edit' ? 'EDIT' : 'DELETE'}_FAIL` as keyof typeof VEHICLE_MESSAGES
          ] ?? 'Action failed')
    logger.error('[VEHICLES] Action failed', { userId, intent, error: message })
    return redirectFail(ROUTES.VEHICLES, message)
  }
}

async function handleAddVehicle(formData: FormData, userId: string) {
  const rawBattery = Number(formData.get('batteryCapacity')?.toString() ?? '0')

  const result = addVehicleIntent.safeParse({
    intent: 'add',
    licensePlate: formData.get('licensePlate')?.toString() ?? '',
    brand: formData.get('brand')?.toString() ?? '',
    model: formData.get('model')?.toString() ?? '',
    batteryCapacity: rawBattery,
  })

  if (!result.success) {
    logger.warn('[VEHICLES] Add vehicle validation failed', {
      userId,
      errors: result.error.flatten().fieldErrors,
    })
    return { errors: result.error.flatten().fieldErrors }
  }

  const vehicleId = crypto.randomUUID()
  await db.insert(vehicle).values({
    id: vehicleId,
    userId,
    licensePlate: result.data.licensePlate,
    brand: result.data.brand,
    model: result.data.model,
    batteryCapacity: result.data.batteryCapacity,
  })

  logger.info('[VEHICLES] Vehicle added', {
    userId,
    vehicleId,
    licensePlate: result.data.licensePlate,
  })
  return redirectSuccess(ROUTES.VEHICLES, VEHICLE_MESSAGES.ADD_SUCCESS)
}

async function handleEditVehicle(formData: FormData, userId: string) {
  const rawBattery = Number(formData.get('batteryCapacity')?.toString() ?? '0')
  const vehicleId = formData.get('vehicleId')?.toString() ?? ''

  const result = editVehicleIntent.safeParse({
    intent: 'edit',
    vehicleId,
    licensePlate: formData.get('licensePlate')?.toString() ?? '',
    brand: formData.get('brand')?.toString() ?? '',
    model: formData.get('model')?.toString() ?? '',
    batteryCapacity: rawBattery,
  })

  if (!result.success) {
    logger.warn('[VEHICLES] Edit vehicle validation failed', {
      userId,
      errors: result.error.flatten().fieldErrors,
    })
    return { errors: result.error.flatten().fieldErrors }
  }

  const existingVehicle = await db.query.vehicle.findFirst({
    where: and(
      eq(vehicle.id, result.data.vehicleId),
      eq(vehicle.userId, userId),
    ),
  })

  if (!existingVehicle) {
    logger.warn('[VEHICLES] Vehicle not found for edit', {
      userId,
      vehicleId: result.data.vehicleId,
    })
    throw new Error('Vehicle not found')
  }

  await db
    .update(vehicle)
    .set({
      licensePlate: result.data.licensePlate,
      brand: result.data.brand,
      model: result.data.model,
      batteryCapacity: result.data.batteryCapacity,
    })
    .where(eq(vehicle.id, result.data.vehicleId))

  logger.info('[VEHICLES] Vehicle updated', {
    userId,
    vehicleId: result.data.vehicleId,
  })
  return redirectSuccess(ROUTES.VEHICLES, VEHICLE_MESSAGES.EDIT_SUCCESS)
}

async function handleDeleteVehicle(formData: FormData, userId: string) {
  const result = deleteVehicleIntent.safeParse({
    intent: 'delete',
    vehicleId: formData.get('vehicleId')?.toString() ?? '',
  })

  if (!result.success) {
    logger.warn('[VEHICLES] Delete vehicle validation failed', {
      userId,
      errors: result.error.flatten().fieldErrors,
    })
    return { errors: result.error.flatten().fieldErrors }
  }

  const existingVehicle = await db.query.vehicle.findFirst({
    where: and(
      eq(vehicle.id, result.data.vehicleId),
      eq(vehicle.userId, userId),
    ),
  })

  if (!existingVehicle) {
    logger.warn('[VEHICLES] Vehicle not found for delete', {
      userId,
      vehicleId: result.data.vehicleId,
    })
    throw new Error('Vehicle not found')
  }

  const activeSession = await db.query.chargingSession.findFirst({
    where: and(
      eq(chargingSession.vehicleId, result.data.vehicleId),
      eq(chargingSession.status, 'in-progress'),
    ),
  })

  if (activeSession) {
    logger.warn('[VEHICLES] Cannot delete vehicle with active session', {
      userId,
      vehicleId: result.data.vehicleId,
      activeSessionId: activeSession.id,
    })
    throw new Error(VEHICLE_MESSAGES.DELETE_ACTIVE_SESSION)
  }

  await db.delete(vehicle).where(eq(vehicle.id, result.data.vehicleId))

  logger.info('[VEHICLES] Vehicle deleted', {
    userId,
    vehicleId: result.data.vehicleId,
  })
  return redirectSuccess(ROUTES.VEHICLES, VEHICLE_MESSAGES.DELETE_SUCCESS)
}
