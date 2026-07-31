import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { rbac } from '@/lib/rbac'
import Client from '@/models/Client'

export async function GET(request) {
  try {
    const user = await verifyToken(request)
    if (!user) return NextResponse.json({ message: 'Accesso negato. Token mancante.' }, { status: 401 })
    const { allowed, message } = rbac(user, 'admin', 'staff')
    if (!allowed) return NextResponse.json({ message }, { status: 403 })

    const { searchParams } = new URL(request.url)
    const filter = {}
    if (searchParams.has('search')) {
      const regex = new RegExp(searchParams.get('search'), 'i')
      filter.$or = [{ nome: regex }, { email: regex }, { telefono: regex }]
    }

    await connectDB()
    const clients = await Client.find(filter).sort({ createdAt: -1 })
    return NextResponse.json(clients)
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const user = await verifyToken(request)
    if (!user) return NextResponse.json({ message: 'Accesso negato. Token mancante.' }, { status: 401 })
    const { allowed, message } = rbac(user, 'admin', 'staff')
    if (!allowed) return NextResponse.json({ message }, { status: 403 })

    const data = await request.json()
    await connectDB()
    const client = await Client.create(data)
    return NextResponse.json(client, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
