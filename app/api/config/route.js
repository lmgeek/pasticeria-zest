import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { rbac } from '@/lib/rbac'
import StoreConfig from '@/models/StoreConfig'

export async function GET(request) {
  try {
    const user = await verifyToken(request)
    if (!user) return NextResponse.json({ message: 'Accesso negato. Token mancante.' }, { status: 401 })
    const { allowed, message } = rbac(user, 'admin')
    if (!allowed) return NextResponse.json({ message }, { status: 403 })

    await connectDB()
    const configs = await StoreConfig.find().sort({ chiave: 1 })
    const result = {}
    configs.forEach((c) => { result[c.chiave] = c.valore })
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const user = await verifyToken(request)
    if (!user) return NextResponse.json({ message: 'Accesso negato. Token mancante.' }, { status: 401 })
    const { allowed, message } = rbac(user, 'admin')
    if (!allowed) return NextResponse.json({ message }, { status: 403 })

    const updates = await request.json()
    const ops = Object.entries(updates).map(([chiave, valore]) => ({
      updateOne: { filter: { chiave }, update: { $set: { valore } }, upsert: true },
    }))

    await connectDB()
    await StoreConfig.bulkWrite(ops)
    const configs = await StoreConfig.find().sort({ chiave: 1 })
    const result = {}
    configs.forEach((c) => { result[c.chiave] = c.valore })
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
