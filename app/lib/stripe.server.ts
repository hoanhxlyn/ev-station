import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_mock'

export const stripe = new Stripe(stripeSecretKey, {
  typescript: true,
})

export async function createPaymentIntent(
  amount: number,
  currency: string = 'usd',
) {
  return stripe.paymentIntents.create({
    amount,
    currency,
    automatic_payment_methods: { enabled: true },
  })
}

export async function confirmPaymentIntent(paymentIntentId: string) {
  return stripe.paymentIntents.confirm(paymentIntentId, {
    payment_method: 'pm_card_visa',
    return_url: 'https://example.com/return',
  })
}

export function getStripePublicKey(): string {
  return process.env.STRIPE_PUBLIC_KEY || 'pk_test_mock'
}
