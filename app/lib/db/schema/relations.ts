import { relations } from 'drizzle-orm'
import { user } from './user'
import { session } from './session'
import { account } from './account'
import { vehicle } from './vehicle'
import { station } from './station'
import { chargingSession } from './charging-session'
import { transaction } from './transaction'

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  vehicles: many(vehicle),
  transactions: many(transaction),
  chargingSessions: many(chargingSession),
}))

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}))

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}))

export const vehicleRelations = relations(vehicle, ({ one, many }) => ({
  user: one(user, {
    fields: [vehicle.userId],
    references: [user.id],
  }),
  chargingSessions: many(chargingSession),
}))

export const stationRelations = relations(station, ({ many }) => ({
  chargingSessions: many(chargingSession),
}))

export const chargingSessionRelations = relations(
  chargingSession,
  ({ one, many }) => ({
    user: one(user, {
      fields: [chargingSession.userId],
      references: [user.id],
    }),
    station: one(station, {
      fields: [chargingSession.stationId],
      references: [station.id],
    }),
    vehicle: one(vehicle, {
      fields: [chargingSession.vehicleId],
      references: [vehicle.id],
    }),
    transactions: many(transaction),
  }),
)

export const transactionRelations = relations(transaction, ({ one }) => ({
  user: one(user, {
    fields: [transaction.userId],
    references: [user.id],
  }),
  chargingSession: one(chargingSession, {
    fields: [transaction.chargingSessionId],
    references: [chargingSession.id],
  }),
}))
