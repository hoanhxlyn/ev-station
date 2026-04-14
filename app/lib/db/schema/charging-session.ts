import { sql } from 'drizzle-orm'
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core'
import { user } from './user'
import { station } from './station'
import { vehicle } from './vehicle'

export const chargingSession = sqliteTable(
  'charging_session',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    stationId: text('station_id')
      .notNull()
      .references(() => station.id),
    vehicleId: text('vehicle_id')
      .notNull()
      .references(() => vehicle.id),
    status: text('status', {
      enum: ['in-progress', 'completed', 'cancelled'],
    })
      .default('in-progress')
      .notNull(),
    startAt: integer('start_at', { mode: 'timestamp_ms' })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    endAt: integer('end_at', { mode: 'timestamp_ms' }),
    energyConsumed: integer('energy_consumed'),
    cost: integer('cost'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('chargingSession_userId_idx').on(table.userId),
    index('chargingSession_stationId_idx').on(table.stationId),
    index('chargingSession_status_idx').on(table.status),
  ],
)
