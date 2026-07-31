import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Sale from '@/models/Sale'
import Client from '@/models/Client'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const paymentIntent = searchParams.get('payment_intent')

    if (!paymentIntent) {
      return NextResponse.json({ message: 'payment_intent mancante' }, { status: 400 })
    }

    await connectDB()
    const sale = await Sale.findOne({ stripePaymentIntentId: paymentIntent })
      .populate('cliente', 'email')

    return NextResponse.json({
      emailSent: !!(sale?.cliente?.email),
    })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}