import { and, eq, sql } from 'drizzle-orm'
import { CHARGING_MESSAGES } from '~/constants/messages'
import {
  VALIDATION_CONSTRAINTS,
  VALIDATION_MESSAGES,
} from '~/constants/validation'
import { redirectSuccess, redirectFail } from '~/lib/action-utils'
import { requireVerified } from '~/lib/auth-guards'
import { db } from '~/lib/db'
import {
  chargingSession,
  station,
  vehicle,
  user,
  transaction,
} from '~/lib/db/schema'
import {
  startSessionIntent,
  endSessionIntent,
  cancelSessionIntent,
} from '~/schemas/charging-session'
import { ROUTES } from '~/constants/routes'
import type { Route } from './+types/page'

export async function chargingAction({ request }: Route.ActionArgs) {
  const session = await requireVerified(request)
  const userId = session.user.id
  const formData = await request.formData()
  const intent = formData.get('intent')?.toString()

  try {
    if (intent === 'start') {
      return await handleStartSession(formData, userId)
    }

    if (intent === 'end') {
      return await handleEndSession(formData, userId)
    }

    if (intent === 'cancel') {
      return await handleCancelSession(formData, userId)
    }

    return redirectFail(ROUTES.CHARGING, 'Invalid action')
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : CHARGING_MESSAGES.START_FAIL
    return redirectFail(ROUTES.CHARGING, message)
  }
}

async function handleStartSession(formData: FormData, userId: string) {
  const result = startSessionIntent.safeParse({
    intent: 'start',
    stationId: formData.get('stationId')?.toString() ?? '',
    vehicleId: formData.get('vehicleId')?.toString() ?? '',
  })

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  const userData = await db.query.user.findFirst({
    where: eq(user.id, userId),
    columns: { creditBalance: true, status: true },
  })

  if (!userData) {
    throw new Error('User not found')
  }

  if (userData.status === 'locked') {
    throw new Error(VALIDATION_MESSAGES.USER_LOCKED)
  }

  if (userData.creditBalance <= VALIDATION_CONSTRAINTS.TRANSACTION_DEBT_LIMIT) {
    throw new Error(CHARGING_MESSAGES.INSUFFICIENT_CREDITS)
  }

  const existingSession = await db.query.chargingSession.findFirst({
    where: and(
      eq(chargingSession.userId, userId),
      eq(chargingSession.status, 'in-progress'),
    ),
  })

  if (existingSession) {
    throw new Error(VALIDATION_MESSAGES.SESSION_ACTIVE)
  }

  const stationData = await db.query.station.findFirst({
    where: eq(station.id, result.data.stationId),
  })

  if (!stationData || stationData.status !== 'available') {
    throw new Error(CHARGING_MESSAGES.STATION_NOT_AVAILABLE)
  }

  const vehicleData = await db.query.vehicle.findFirst({
    where: and(
      eq(vehicle.id, result.data.vehicleId),
      eq(vehicle.userId, userId),
    ),
  })

  if (!vehicleData) {
    throw new Error(VALIDATION_MESSAGES.VEHICLE_NOT_OWNED)
  }

  const sessionId = crypto.randomUUID()

  await db.insert(chargingSession).values({
    id: sessionId,
    userId,
    stationId: result.data.stationId,
    vehicleId: result.data.vehicleId,
    status: 'in-progress',
  })

  await db
    .update(station)
    .set({ status: 'occupied' })
    .where(eq(station.id, result.data.stationId))

  return redirectSuccess(ROUTES.CHARGING, CHARGING_MESSAGES.START_SUCCESS)
}

async function handleEndSession(formData: FormData, userId: string) {
  const result = endSessionIntent.safeParse({
    intent: 'end',
    sessionId: formData.get('sessionId')?.toString() ?? '',
  })

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  const sessionData = await db.query.chargingSession.findFirst({
    where: and(
      eq(chargingSession.id, result.data.sessionId),
      eq(chargingSession.userId, userId),
      eq(chargingSession.status, 'in-progress'),
    ),
    with: { station: true },
  })

  if (!sessionData) {
    throw new Error(CHARGING_MESSAGES.NO_ACTIVE_SESSION)
  }

  const now = Date.now()
  const startAt = sessionData.startAt.getTime()
  const durationHours = (now - startAt) / (1000 * 60 * 60)

  const energyConsumed = Math.round(
    sessionData.station.powerOutput * durationHours * 1000,
  )
  const cost = Math.round(
    sessionData.station.powerOutput *
      durationHours *
      sessionData.station.pricePerKwh,
  )

  await db
    .update(chargingSession)
    .set({
      status: 'completed',
      endAt: new Date(now),
      energyConsumed,
      cost,
      updatedAt: new Date(),
    })
    .where(eq(chargingSession.id, result.data.sessionId))

  await db
    .update(user)
    .set({ creditBalance: sql`credit_balance - ${cost}` })
    .where(eq(user.id, userId))

  await db.insert(transaction).values({
    id: crypto.randomUUID(),
    userId,
    type: 'charging-payment',
    amount: -cost,
    description: `Charging at ${sessionData.station.name}`,
    chargingSessionId: result.data.sessionId,
  })

  await db
    .update(station)
    .set({ status: 'available' })
    .where(eq(station.id, sessionData.stationId))

  return redirectSuccess(ROUTES.CHARGING, CHARGING_MESSAGES.END_SUCCESS)
}

async function handleCancelSession(formData: FormData, userId: string) {
  const result = cancelSessionIntent.safeParse({
    intent: 'cancel',
    sessionId: formData.get('sessionId')?.toString() ?? '',
  })

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  const sessionData = await db.query.chargingSession.findFirst({
    where: and(
      eq(chargingSession.id, result.data.sessionId),
      eq(chargingSession.userId, userId),
      eq(chargingSession.status, 'in-progress'),
    ),
  })

  if (!sessionData) {
    throw new Error(CHARGING_MESSAGES.NO_ACTIVE_SESSION)
  }

  await db
    .update(chargingSession)
    .set({
      status: 'cancelled',
      endAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(chargingSession.id, result.data.sessionId))

  await db
    .update(station)
    .set({ status: 'available' })
    .where(eq(station.id, sessionData.stationId))

  return redirectSuccess(ROUTES.CHARGING, CHARGING_MESSAGES.CANCEL_SUCCESS)
}
