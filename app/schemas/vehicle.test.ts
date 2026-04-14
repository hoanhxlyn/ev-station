import { describe, it, expect } from 'vitest'
import {
  addVehicleIntent,
  editVehicleIntent,
  deleteVehicleIntent,
} from '~/schemas/vehicle'
import {
  VALIDATION_CONSTRAINTS,
  VALIDATION_MESSAGES,
} from '~/constants/validation'

describe('addVehicleIntent', () => {
  describe('intent', () => {
    it('accepts intent=add', () => {
      const result = addVehicleIntent.safeParse({
        intent: 'add',
        licensePlate: 'ABC123',
        brand: 'Tesla',
        model: 'Model 3',
        batteryCapacity: 75,
      })
      expect(result.success).toBe(true)
    })

    it('rejects non-add intent', () => {
      const result = addVehicleIntent.safeParse({
        intent: 'edit',
        licensePlate: 'ABC123',
        brand: 'Tesla',
        model: 'Model 3',
        batteryCapacity: 75,
      })
      expect(result.success).toBe(false)
    })
  })

  describe('licensePlate', () => {
    it('accepts valid license plate (min length)', () => {
      const result = addVehicleIntent.safeParse({
        intent: 'add',
        licensePlate: 'ABCD',
        brand: 'Tesla',
        model: 'Model 3',
        batteryCapacity: 75,
      })
      expect(result.success).toBe(true)
    })

    it('accepts valid license plate (max length)', () => {
      const result = addVehicleIntent.safeParse({
        intent: 'add',
        licensePlate: 'A'.repeat(
          VALIDATION_CONSTRAINTS.VEHICLE_LICENSE_PLATE_MAX_LENGTH,
        ),
        brand: 'Tesla',
        model: 'Model 3',
        batteryCapacity: 75,
      })
      expect(result.success).toBe(true)
    })

    it('accepts license plate with numbers', () => {
      const result = addVehicleIntent.safeParse({
        intent: 'add',
        licensePlate: 'ABC123',
        brand: 'Tesla',
        model: 'Model 3',
        batteryCapacity: 75,
      })
      expect(result.success).toBe(true)
    })

    it('accepts license plate with hyphen', () => {
      const result = addVehicleIntent.safeParse({
        intent: 'add',
        licensePlate: 'ABC-123',
        brand: 'Tesla',
        model: 'Model 3',
        batteryCapacity: 75,
      })
      expect(result.success).toBe(true)
    })

    it('rejects empty license plate', () => {
      const result = addVehicleIntent.safeParse({
        intent: 'add',
        licensePlate: '',
        brand: 'Tesla',
        model: 'Model 3',
        batteryCapacity: 75,
      })
      expect(result.success).toBe(false)
    })

    it('rejects license plate below min length', () => {
      const result = addVehicleIntent.safeParse({
        intent: 'add',
        licensePlate: 'AB',
        brand: 'Tesla',
        model: 'Model 3',
        batteryCapacity: 75,
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          VALIDATION_MESSAGES.VEHICLE_LICENSE_PLATE_MIN_LENGTH,
        )
      }
    })

    it('rejects license plate exceeding max length', () => {
      const result = addVehicleIntent.safeParse({
        intent: 'add',
        licensePlate: 'A'.repeat(
          VALIDATION_CONSTRAINTS.VEHICLE_LICENSE_PLATE_MAX_LENGTH + 1,
        ),
        brand: 'Tesla',
        model: 'Model 3',
        batteryCapacity: 75,
      })
      expect(result.success).toBe(false)
    })
  })

  describe('brand', () => {
    it('accepts valid brand', () => {
      const result = addVehicleIntent.safeParse({
        intent: 'add',
        licensePlate: 'ABC123',
        brand: 'Tesla',
        model: 'Model 3',
        batteryCapacity: 75,
      })
      expect(result.success).toBe(true)
    })

    it('rejects empty brand', () => {
      const result = addVehicleIntent.safeParse({
        intent: 'add',
        licensePlate: 'ABC123',
        brand: '',
        model: 'Model 3',
        batteryCapacity: 75,
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          VALIDATION_MESSAGES.VEHICLE_BRAND_REQUIRED,
        )
      }
    })

    it('rejects brand exceeding max length', () => {
      const result = addVehicleIntent.safeParse({
        intent: 'add',
        licensePlate: 'ABC123',
        brand: 'B'.repeat(VALIDATION_CONSTRAINTS.VEHICLE_BRAND_MAX_LENGTH + 1),
        model: 'Model 3',
        batteryCapacity: 75,
      })
      expect(result.success).toBe(false)
    })
  })

  describe('model', () => {
    it('accepts valid model', () => {
      const result = addVehicleIntent.safeParse({
        intent: 'add',
        licensePlate: 'ABC123',
        brand: 'Tesla',
        model: 'Model 3',
        batteryCapacity: 75,
      })
      expect(result.success).toBe(true)
    })

    it('rejects empty model', () => {
      const result = addVehicleIntent.safeParse({
        intent: 'add',
        licensePlate: 'ABC123',
        brand: 'Tesla',
        model: '',
        batteryCapacity: 75,
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          VALIDATION_MESSAGES.VEHICLE_MODEL_REQUIRED,
        )
      }
    })
  })

  describe('batteryCapacity', () => {
    it('accepts valid battery capacity (within range)', () => {
      const result = addVehicleIntent.safeParse({
        intent: 'add',
        licensePlate: 'ABC123',
        brand: 'Tesla',
        model: 'Model 3',
        batteryCapacity: 75,
      })
      expect(result.success).toBe(true)
    })

    it('accepts minimum valid battery capacity', () => {
      const result = addVehicleIntent.safeParse({
        intent: 'add',
        licensePlate: 'ABC123',
        brand: 'Tesla',
        model: 'Model 3',
        batteryCapacity: VALIDATION_CONSTRAINTS.VEHICLE_BATTERY_CAPACITY_MIN,
      })
      expect(result.success).toBe(true)
    })

    it('accepts maximum valid battery capacity', () => {
      const result = addVehicleIntent.safeParse({
        intent: 'add',
        licensePlate: 'ABC123',
        brand: 'Tesla',
        model: 'Model 3',
        batteryCapacity: VALIDATION_CONSTRAINTS.VEHICLE_BATTERY_CAPACITY_MAX,
      })
      expect(result.success).toBe(true)
    })

    it('rejects battery capacity below minimum', () => {
      const result = addVehicleIntent.safeParse({
        intent: 'add',
        licensePlate: 'ABC123',
        brand: 'Tesla',
        model: 'Model 3',
        batteryCapacity:
          VALIDATION_CONSTRAINTS.VEHICLE_BATTERY_CAPACITY_MIN - 1,
      })
      expect(result.success).toBe(false)
    })

    it('rejects battery capacity above maximum', () => {
      const result = addVehicleIntent.safeParse({
        intent: 'add',
        licensePlate: 'ABC123',
        brand: 'Tesla',
        model: 'Model 3',
        batteryCapacity:
          VALIDATION_CONSTRAINTS.VEHICLE_BATTERY_CAPACITY_MAX + 1,
      })
      expect(result.success).toBe(false)
    })

    it('rejects non-integer battery capacity', () => {
      const result = addVehicleIntent.safeParse({
        intent: 'add',
        licensePlate: 'ABC123',
        brand: 'Tesla',
        model: 'Model 3',
        batteryCapacity: 75.5,
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Battery capacity must be a whole number',
        )
      }
    })

    it('rejects missing battery capacity', () => {
      const result = addVehicleIntent.safeParse({
        intent: 'add',
        licensePlate: 'ABC123',
        brand: 'Tesla',
        model: 'Model 3',
      })
      expect(result.success).toBe(false)
    })
  })
})

describe('editVehicleIntent', () => {
  it('accepts valid edit intent', () => {
    const result = editVehicleIntent.safeParse({
      intent: 'edit',
      vehicleId: 'vehicle-123',
      licensePlate: 'XYZ789',
      brand: 'Tesla',
      model: 'Model Y',
      batteryCapacity: 100,
    })
    expect(result.success).toBe(true)
  })

  it('rejects non-edit intent', () => {
    const result = editVehicleIntent.safeParse({
      intent: 'delete',
      vehicleId: 'vehicle-123',
      licensePlate: 'XYZ789',
      brand: 'Tesla',
      model: 'Model Y',
      batteryCapacity: 100,
    })
    expect(result.success).toBe(false)
  })

  it('rejects missing vehicleId', () => {
    const result = editVehicleIntent.safeParse({
      intent: 'edit',
      licensePlate: 'XYZ789',
      brand: 'Tesla',
      model: 'Model Y',
      batteryCapacity: 100,
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty vehicleId', () => {
    const result = editVehicleIntent.safeParse({
      intent: 'edit',
      vehicleId: '',
      licensePlate: 'XYZ789',
      brand: 'Tesla',
      model: 'Model Y',
      batteryCapacity: 100,
    })
    expect(result.success).toBe(false)
  })
})

describe('deleteVehicleIntent', () => {
  it('accepts valid delete intent', () => {
    const result = deleteVehicleIntent.safeParse({
      intent: 'delete',
      vehicleId: 'vehicle-123',
    })
    expect(result.success).toBe(true)
  })

  it('rejects non-delete intent', () => {
    const result = deleteVehicleIntent.safeParse({
      intent: 'edit',
      vehicleId: 'vehicle-123',
    })
    expect(result.success).toBe(false)
  })

  it('rejects missing vehicleId', () => {
    const result = deleteVehicleIntent.safeParse({
      intent: 'delete',
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty vehicleId', () => {
    const result = deleteVehicleIntent.safeParse({
      intent: 'delete',
      vehicleId: '',
    })
    expect(result.success).toBe(false)
  })
})
