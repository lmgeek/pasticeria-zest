import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Sale from '@/models/Sale'
import Client from '@/models/Client'
import { sendInvoiceEmail } from '@/lib/email'

export async function POST(request) {
  try {
    const { saleId } = await request.json()

    if (!saleId) {
      return NextResponse.json({ message: 'saleId richiesto' }, { status: 400 })
    }

    await connectDB()
    const sale = await Sale.findById(saleId).populate('cliente', 'email nome').populate('items')

    if (!sale) {
      return NextResponse.json({ message: 'Vendita non trovata' }, { status: 404 })
    }

    if (!sale.cliente?.email) {
      return NextResponse.json({ message: 'Nessuna email cliente per questa vendita' }, { status: 400 })
    }

    const result = await sendInvoiceEmail(sale, sale.cliente.email)

    if (result) {
      console.log(`[EMAIL-RESEND] Factura reenviada para venta ${saleId} a ${sale.cliente.email}`)
      return NextResponse.json({ message: 'Factura reenviada correctamente' })
    }

    console.log(`[EMAIL-RESEND] Error al enviar factura para venta ${saleId}`)
    return NextResponse.json({ message: 'Error al enviar la factura' }, { status: 500 })
  } catch (error) {
    console.error('[EMAIL-RESEND] Error:', error.message)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}