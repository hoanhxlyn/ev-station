import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from '../app/lib/db/schema'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { eq } from 'drizzle-orm'
import { createConsola } from 'consola'

const logger = createConsola({ level: 4 })

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const dbPath = process.env.DATABASE_URL
  ? process.env.DATABASE_URL.startsWith('file:')
    ? process.env.DATABASE_URL.slice(5)
    : process.env.DATABASE_URL
  : resolve(__dirname, '..', 'dev.db')

const sqlite = new Database(dbPath)
const db = drizzle(sqlite, { schema })

function seed() {
  logger.info('Seeding database...')

  const existingAdmin = db
    .select()
    .from(schema.user)
    .where(eq(schema.user.email, 'admin@evstation.local'))
    .get()

  if (!existingAdmin) {
    db.insert(schema.user).values({
      id: crypto.randomUUID(),
      name: 'Admin',
      email: 'admin@evstation.local',
      role: 'admin',
      emailVerified: true,
      status: 'active',
      creditBalance: 0,
      isNew: false,
      signupMethod: 'manual',
    })
    logger.info('Admin account seeded: admin@evstation.local')
  } else {
    logger.info('Admin account already exists, skipping.')
  }

  const stations = db.select().from(schema.station).all()

  if (stations.length === 0) {
    db.insert(schema.station).values([
      {
        id: crypto.randomUUID(),
        name: 'Downtown Hub',
        location: '123 Main St, Downtown',
        status: 'available',
        powerOutput: 150,
        pricePerKwh: 30,
      },
      {
        id: crypto.randomUUID(),
        name: 'Riverside Lot',
        location: '456 River Rd, Riverside',
        status: 'available',
        powerOutput: 50,
        pricePerKwh: 25,
      },
      {
        id: crypto.randomUUID(),
        name: 'Airport Express',
        location: '789 Terminal Ave, Airport',
        status: 'available',
        powerOutput: 350,
        pricePerKwh: 35,
      },
      {
        id: crypto.randomUUID(),
        name: 'Central Park Station',
        location: '321 Park Blvd, Central',
        status: 'available',
        powerOutput: 75,
        pricePerKwh: 28,
      },
      {
        id: crypto.randomUUID(),
        name: 'Westside Mall',
        location: '654 Commerce Dr, Westside',
        status: 'offline',
        powerOutput: 22,
        pricePerKwh: 20,
      },
    ])
    logger.info('5 charging stations seeded.')
  } else {
    logger.info('Stations already exist, skipping.')
  }

  logger.info('Seed complete.')
}

try {
  seed()
} catch (error) {
  logger.error('Seed failed:', error)
  process.exit(1)
}
