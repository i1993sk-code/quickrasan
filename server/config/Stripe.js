import Stripe from 'stripe'

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder')

export default stripeInstance