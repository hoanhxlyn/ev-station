import { sql } from 'drizzle-orm'
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core'
import { user } from './user'

export const vehicle = sqliteTable(
  'vehicle',
  {
    id: text('id').primaryKey(),
    licensePlate: text('license_plate').notNull(),
    brand: text('brand').notNull(),
    model: text('model').notNull(),
    batteryCapacity: integer('battery_capacity').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('vehicle_userId_idx').on(table.userId)],
)
