import { z } from 'zod'
import {
  VALIDATION_CONSTRAINTS,
  VALIDATION_MESSAGES,
} from '~/constants/validation'

export const addVehicleIntent = z.object({
  intent: z.literal('add'),
  licensePlate: z
    .string()
    .min(
      VALIDATION_CONSTRAINTS.VEHICLE_LICENSE_PLATE_MIN_LENGTH,
      VALIDATION_MESSAGES.VEHICLE_LICENSE_PLATE_MIN_LENGTH,
    )
    .max(
      VALIDATION_CONSTRAINTS.VEHICLE_LICENSE_PLATE_MAX_LENGTH,
      VALIDATION_MESSAGES.VEHICLE_LICENSE_PLATE_MAX_LENGTH,
    ),
  brand: z
    .string()
    .min(1, VALIDATION_MESSAGES.VEHICLE_BRAND_REQUIRED)
    .max(
      VALIDATION_CONSTRAINTS.VEHICLE_BRAND_MAX_LENGTH,
      `Brand must be at most ${VALIDATION_CONSTRAINTS.VEHICLE_BRAND_MAX_LENGTH} characters`,
    ),
  model: z
    .string()
    .min(1, VALIDATION_MESSAGES.VEHICLE_MODEL_REQUIRED)
    .max(
      VALIDATION_CONSTRAINTS.VEHICLE_MODEL_MAX_LENGTH,
      `Model must be at most ${VALIDATION_CONSTRAINTS.VEHICLE_MODEL_MAX_LENGTH} characters`,
    ),
  batteryCapacity: z
    .number({
      required_error: VALIDATION_MESSAGES.VEHICLE_BATTERY_CAPACITY_REQUIRED,
    })
    .int('Battery capacity must be a whole number')
    .min(
      VALIDATION_CONSTRAINTS.VEHICLE_BATTERY_CAPACITY_MIN,
      VALIDATION_MESSAGES.VEHICLE_BATTERY_CAPACITY_MIN,
    )
    .max(
      VALIDATION_CONSTRAINTS.VEHICLE_BATTERY_CAPACITY_MAX,
      VALIDATION_MESSAGES.VEHICLE_BATTERY_CAPACITY_MAX,
    ),
})

export const editVehicleIntent = z.object({
  intent: z.literal('edit'),
  vehicleId: z.string().min(1, 'Vehicle ID is required'),
  licensePlate: z
    .string()
    .min(
      VALIDATION_CONSTRAINTS.VEHICLE_LICENSE_PLATE_MIN_LENGTH,
      VALIDATION_MESSAGES.VEHICLE_LICENSE_PLATE_MIN_LENGTH,
    )
    .max(
      VALIDATION_CONSTRAINTS.VEHICLE_LICENSE_PLATE_MAX_LENGTH,
      VALIDATION_MESSAGES.VEHICLE_LICENSE_PLATE_MAX_LENGTH,
    ),
  brand: z
    .string()
    .min(1, VALIDATION_MESSAGES.VEHICLE_BRAND_REQUIRED)
    .max(
      VALIDATION_CONSTRAINTS.VEHICLE_BRAND_MAX_LENGTH,
      `Brand must be at most ${VALIDATION_CONSTRAINTS.VEHICLE_BRAND_MAX_LENGTH} characters`,
    ),
  model: z
    .string()
    .min(1, VALIDATION_MESSAGES.VEHICLE_MODEL_REQUIRED)
    .max(
      VALIDATION_CONSTRAINTS.VEHICLE_MODEL_MAX_LENGTH,
      `Model must be at most ${VALIDATION_CONSTRAINTS.VEHICLE_MODEL_MAX_LENGTH} characters`,
    ),
  batteryCapacity: z
    .number({
      required_error: VALIDATION_MESSAGES.VEHICLE_BATTERY_CAPACITY_REQUIRED,
    })
    .int('Battery capacity must be a whole number')
    .min(
      VALIDATION_CONSTRAINTS.VEHICLE_BATTERY_CAPACITY_MIN,
      VALIDATION_MESSAGES.VEHICLE_BATTERY_CAPACITY_MIN,
    )
    .max(
      VALIDATION_CONSTRAINTS.VEHICLE_BATTERY_CAPACITY_MAX,
      VALIDATION_MESSAGES.VEHICLE_BATTERY_CAPACITY_MAX,
    ),
})

export const deleteVehicleIntent = z.object({
  intent: z.literal('delete'),
  vehicleId: z.string().min(1, 'Vehicle ID is required'),
})

export type AddVehicleValues = z.infer<typeof addVehicleIntent>
export type EditVehicleValues = z.infer<typeof editVehicleIntent>
export type DeleteVehicleValues = z.infer<typeof deleteVehicleIntent>
