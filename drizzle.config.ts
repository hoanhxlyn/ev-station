import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './app/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DATABASE_URL || './dev.db',
  },
})
