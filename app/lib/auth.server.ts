import { betterAuth } from 'better-auth'
import { username } from 'better-auth/plugins'
import { magicLink } from 'better-auth/plugins'
import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { eq } from 'drizzle-orm'
import { db } from '~/lib/db'
import { logger } from '~/lib/logger.server'
import * as schema from '~/lib/db/schema'

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:5173',
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema,
  }),
  plugins: [
    username(),
    magicLink({
      expiresIn: 600,
      sendMagicLink: async ({ email, url }) => {
        logger.info(`[MAGIC LINK EMAIL] To: ${email} Link: ${url}`)
      },
    }),
  ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      logger.info(`[VERIFICATION EMAIL] To: ${user.email} Verify: ${url}`)
    },
    sendOnSignIn: true,
    async afterEmailVerification(user) {
      await db
        .update(schema.user)
        .set({ isNew: false })
        .where(eq(schema.user.id, user.id))
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
})
