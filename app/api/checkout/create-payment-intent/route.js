import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import getStripe from '@/lib/stripe'
import Product from '@/models/Product'
import Sale from '@/models/Sale'
import SaleItem from '@/models/SaleItem'
import Client from '@/models/Client'

export async function POST(request) {
  try {
    const { items, clienteData } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ message: 'Carrello vuoto' }, { status: 400 })
    }

    await connectDB()
    const productIds = items.map((i) => i.prodotto)
    const products = await Product.find({ _id: { $in: productIds }, attivo: true })

    const productMap = {}
    products.forEach((p) => { productMap[p._id.toString()] = p })

    const saleItems = []
    let totale = 0

    for (const item of items) {
      const product = productMap[item.prodotto]
      if (!product) {
        return NextResponse.json({ message: `Prodotto non trovato: ${item.prodotto}` }, { status: 400 })
      }
      const subtotale = product.prezzo * item.quantita
      totale += subtotale
      const saleItem = await SaleItem.create({
        prodotto: product._id, nome: product.nome,
        quantita: item.quantita, prezzoUnitario: product.prezzo, subtotale,
      })
      saleItems.push(saleItem._id)
    }

    let cliente = null
    if (clienteData && clienteData.email) {
      cliente = await Client.findOne({ email: clienteData.email })
      if (!cliente) {
        cliente = await Client.create(clienteData)
      }
    }

    const stripe = await getStripe()
    if (!stripe) {
      return NextResponse.json({ message: 'Stripe non configurato. Vai in Admin > Configurazione.' }, { status: 500 })
    }

    const totalCents = Math.round(totale * 100)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCents,
      currency: 'eur',
      metadata: { integration_check: 'accept_a_payment' },
    })

    await Sale.create({
      cliente: cliente?._id,
      items: saleItems,
      totale,
      stato: 'pendente',
      stripePaymentIntentId: paymentIntent.id,
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    console.error('Payment intent error:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
