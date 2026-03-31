import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const dbUrl = process.env.DATABASE_URL
const dbPath = dbUrl
  ? dbUrl.startsWith('file:')
    ? dbUrl.slice(5)
    : dbUrl
  : resolve(__dirname, '..', '..', 'dev.db')

const sqlite = new Database(dbPath)

export const db = drizzle(sqlite, { schema })
