import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { rbac } from '@/lib/rbac'
import Client from '@/models/Client'
import Sale from '@/models/Sale'

export async function GET(request, { params }) {
  try {
    const user = await verifyToken(request)
    if (!user) return NextResponse.json({ message: 'Accesso negato. Token mancante.' }, { status: 401 })
    const { allowed, message } = rbac(user, 'admin', 'staff')
    if (!allowed) return NextResponse.json({ message }, { status: 403 })

    await connectDB()
    const client = await Client.findById(params.id)
    if (!client) return NextResponse.json({ message: 'Cliente non trovato' }, { status: 404 })

    const sales = await Sale.find({ cliente: client._id }).populate('items').sort({ createdAt: -1 })
    return NextResponse.json({ client, sales })
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

    const data = await request.json()
    await connectDB()
    const client = await Client.findByIdAndUpdate(params.id, data, { new: true, runValidators: true })
    if (!client) return NextResponse.json({ message: 'Cliente non trovato' }, { status: 404 })
    return NextResponse.json(client)
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
