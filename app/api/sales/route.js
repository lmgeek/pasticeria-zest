import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { rbac } from '@/lib/rbac'
import Sale from '@/models/Sale'
import SaleItem from '@/models/SaleItem'
import Client from '@/models/Client'

export async function GET(request) {
  try {
    const user = await verifyToken(request)
    if (!user) return NextResponse.json({ message: 'Accesso negato. Token mancante.' }, { status: 401 })
    const { allowed, message } = rbac(user, 'admin', 'staff')
    if (!allowed) return NextResponse.json({ message }, { status: 403 })

    const { searchParams } = new URL(request.url)
    const filter = {}
    if (searchParams.has('stato')) filter.stato = searchParams.get('stato')
    if (searchParams.has('cliente')) filter.cliente = searchParams.get('cliente')

    await connectDB()
    const sales = await Sale.find(filter)
      .populate('cliente', 'nome email')
      .populate('items')
      .sort({ createdAt: -1 })
    return NextResponse.json(sales)
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
