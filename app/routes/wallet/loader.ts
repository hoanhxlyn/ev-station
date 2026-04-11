import { desc, eq } from 'drizzle-orm'
import { requireVerified } from '~/lib/auth-guards'
import { db } from '~/lib/db'
import { user, transaction } from '~/lib/db/schema'
import { getStripePublicKey } from '~/lib/stripe.server'
import { CREDIT_UNIT } from '~/constants/dashboard'
import type { Route } from './+types/page'

export async function walletLoader({ request }: Route.LoaderArgs) {
  const session = await requireVerified(request)
  const userId = session.user.id

  const userData = await db.query.user.findFirst({
    where: eq(user.id, userId),
    columns: {
      id: true,
      name: true,
      email: true,
      creditBalance: true,
    },
  })

  if (!userData) {
    throw new Response('User not found', { status: 404 })
  }

  const transactions = await db.query.transaction.findMany({
    where: eq(transaction.userId, userId),
    orderBy: [desc(transaction.createdAt)],
    limit: 50,
  })

  const isInDebt = userData.creditBalance < 0

  return {
    user: {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      creditBalance: userData.creditBalance,
    },
    transactions,
    isInDebt,
    creditUnit: CREDIT_UNIT,
    stripePublicKey: getStripePublicKey(),
  }
}
