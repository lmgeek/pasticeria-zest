import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { rbac } from '@/lib/rbac'
import User from '@/models/User'

export async function GET(request) {
  try {
    const user = await verifyToken(request)
    if (!user) return NextResponse.json({ message: 'Accesso negato. Token mancante.' }, { status: 401 })
    const { allowed, message } = rbac(user, 'admin')
    if (!allowed) return NextResponse.json({ message }, { status: 403 })

    await connectDB()
    const users = await User.find().sort({ createdAt: -1 })
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
