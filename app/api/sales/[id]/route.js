import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { rbac } from '@/lib/rbac'
import Sale from '@/models/Sale'
import SaleItem from '@/models/SaleItem'
import Client from '@/models/Client'
import mongoose from 'mongoose'

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id)
}

export async function GET(request, { params }) {
  try {
    const user = await verifyToken(request)
    if (!user) return NextResponse.json({ message: 'Accesso negato. Token mancante.' }, { status: 401 })
    const { allowed, message } = rbac(user, 'admin', 'staff')
    if (!allowed) return NextResponse.json({ message }, { status: 403 })

    if (!isValidId(params.id)) {
      return NextResponse.json({ message: 'ID venduta non valido' }, { status: 400 })
    }

    await connectDB()
    const sale = await Sale.findById(params.id)
      .populate('cliente', 'nome email telefono')
      .populate('items')
    if (!sale) return NextResponse.json({ message: 'Vendita non trovata' }, { status: 404 })
    return NextResponse.json(sale)
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const user = await verifyToken(request)
    if (!user) return NextResponse.json({ message: 'Accesso negato. Token mancante.' }, { status: 401 })
    const { allowed, message } = rbac(user, 'admin', 'staff')
    if (!allowed) return NextResponse.json({ message }, { status: 403 })

    if (!isValidId(params.id)) {
      return NextResponse.json({ message: 'ID venduta non valido' }, { status: 400 })
    }

    const { stato } = await request.json()
    if (!['pendente', 'pagato', 'cancellato'].includes(stato)) {
      return NextResponse.json({ message: 'Stato non valido' }, { status: 400 })
    }

    await connectDB()
    const sale = await Sale.findByIdAndUpdate(params.id, { stato }, { new: true })
      .populate('cliente', 'nome email')
      .populate('items')
    if (!sale) return NextResponse.json({ message: 'Vendita non trovata' }, { status: 404 })
    return NextResponse.json(sale)
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
