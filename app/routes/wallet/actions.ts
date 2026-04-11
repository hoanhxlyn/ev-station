import { eq } from 'drizzle-orm'
import { WALLET_MESSAGES } from '~/constants/messages'
import { redirectSuccess, redirectFail } from '~/lib/action-utils'
import { requireVerified } from '~/lib/auth-guards'
import { db } from '~/lib/db'
import { user, transaction } from '~/lib/db/schema'
import { createPaymentIntent, confirmPaymentIntent } from '~/lib/stripe.server'
import { topUpIntent, repayIntent } from '~/schemas/transaction'
import { ROUTES } from '~/constants/routes'
import type { Route } from './+types/page'

export async function walletAction({ request }: Route.ActionArgs) {
  const session = await requireVerified(request)
  const userId = session.user.id
  const formData = await request.formData()
  const intent = formData.get('intent')?.toString()

  try {
    if (intent === 'topup') {
      return await handleTopUp(formData, userId)
    }

    if (intent === 'repay') {
      return await handleRepay(formData, userId)
    }

    return redirectFail(ROUTES.WALLET, 'Invalid action')
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : WALLET_MESSAGES.TOP_UP_FAIL
    return redirectFail(ROUTES.WALLET, message)
  }
}

async function handleTopUp(formData: FormData, userId: string) {
  const rawAmount = Number(formData.get('amount')?.toString() ?? '0')

  const result = topUpIntent.safeParse({
    intent: 'topup',
    amount: rawAmount,
  })

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  const amountInCents = result.data.amount

  const paymentIntent = await createPaymentIntent(amountInCents)

  const confirmed = await confirmPaymentIntent(paymentIntent.id)
  if (confirmed.status !== 'succeeded') {
    throw new Error(WALLET_MESSAGES.TOP_UP_FAIL)
  }

  const userData = await db.query.user.findFirst({
    where: eq(user.id, userId),
    columns: { creditBalance: true },
  })

  if (!userData) {
    throw new Error('User not found')
  }

  await db
    .update(user)
    .set({ creditBalance: userData.creditBalance + amountInCents })
    .where(eq(user.id, userId))

  await db.insert(transaction).values({
    id: crypto.randomUUID(),
    userId,
    type: 'top-up',
    amount: amountInCents,
    description: `Top-up via Stripe (${paymentIntent.id})`,
  })

  return redirectSuccess(ROUTES.WALLET, WALLET_MESSAGES.TOP_UP_SUCCESS)
}

async function handleRepay(formData: FormData, userId: string) {
  const rawAmount = Number(formData.get('amount')?.toString() ?? '0')

  const result = repayIntent.safeParse({
    intent: 'repay',
    amount: rawAmount,
  })

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  const userData = await db.query.user.findFirst({
    where: eq(user.id, userId),
    columns: { creditBalance: true },
  })

  if (!userData) {
    throw new Error('User not found')
  }

  if (userData.creditBalance >= 0) {
    throw new Error(WALLET_MESSAGES.REPAY_FAIL)
  }

  const debtAmount = Math.abs(userData.creditBalance)
  if (result.data.amount > debtAmount) {
    throw new Error('Repayment amount exceeds current debt')
  }

  await db
    .update(user)
    .set({ creditBalance: userData.creditBalance + result.data.amount })
    .where(eq(user.id, userId))

  await db.insert(transaction).values({
    id: crypto.randomUUID(),
    userId,
    type: 'debt-repayment',
    amount: result.data.amount,
    description: 'Debt repayment',
  })

  return redirectSuccess(ROUTES.WALLET, WALLET_MESSAGES.REPAY_SUCCESS)
}
