import Stripe from 'stripe'

let cached = null

export default async function getStripe() {
  if (cached) return cached

  let key = process.env.STRIPE_SECRET_KEY

  if (!key || key.includes('placeholder')) {
    try {
      const { default: connectDB } = await import('./db')
      const { default: StoreConfig } = await import('@/models/StoreConfig')
      await connectDB()
      const config = await StoreConfig.findOne({ chiave: 'stripeSecretKey' })
      if (config?.valore) {
        key = config.valore
      }
    } catch (e) {
      console.warn('Could not load Stripe key from DB:', e.message)
    }
  }

  if (!key) {
    console.warn('STRIPE_SECRET_KEY non configurata. Vai in Admin > Configurazione > Stripe.')
    return null
  }

  cached = new Stripe(key)
  return cached
}
