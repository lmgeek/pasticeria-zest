import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import getStripe from '@/lib/stripe'
import Sale from '@/models/Sale'
import StoreConfig from '@/models/StoreConfig'
import { sendInvoiceEmail } from '@/lib/email'

export async function POST(request) {
  const sig = request.headers.get('stripe-signature')
  const text = await request.text()

  const stripe = await getStripe()
  if (!stripe) {
    return NextResponse.json({ message: 'Stripe non configurato' }, { status: 500 })
  }

  try {
    await connectDB()
    const configs = await StoreConfig.find({ chiave: 'stripeWebhookSecret' })
    const webhookSecret = configs[0]?.valore || process.env.STRIPE_WEBHOOK_SECRET

    if (!webhookSecret) {
      return NextResponse.json({ message: 'Webhook secret non configurato' }, { status: 400 })
    }

    const event = stripe.webhooks.constructEvent(text, sig, webhookSecret)

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object
      const sale = await Sale.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntent.id },
        { stato: 'pagato' },
        { new: true }
      ).populate('cliente', 'email nome').populate('items')

      if (sale && sale.cliente?.email) {
        console.log(`[EMAIL] Sending invoice for sale ${sale._id} to ${sale.cliente.email}`)
        const emailResult = await sendInvoiceEmail(sale, sale.cliente.email)
        if (emailResult) {
          console.log(`[EMAIL] Invoice sent successfully for sale ${sale._id}`)
        } else {
          console.log(`[EMAIL] Failed to send invoice for sale ${sale._id}`)
        }
      } else {
        console.log(`[EMAIL] No client email for sale ${sale?._id}, skipping invoice email`)
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err.message)
    return NextResponse.json({ message: `Webhook Error: ${err.message}` }, { status: 400 })
  }
}
