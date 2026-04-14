import { sql } from 'drizzle-orm'
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core'
import { user } from './user'
import { chargingSession } from './charging-session'

export const transaction = sqliteTable(
  'transaction',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    type: text('type', {
      enum: ['top-up', 'charging-payment', 'debt-repayment'],
    }).notNull(),
    amount: integer('amount').notNull(),
    description: text('description'),
    chargingSessionId: text('charging_session_id').references(
      () => chargingSession.id,
    ),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
  },
  (table) => [
    index('transaction_userId_idx').on(table.userId),
    index('transaction_createdAt_idx').on(table.createdAt),
  ],
)
