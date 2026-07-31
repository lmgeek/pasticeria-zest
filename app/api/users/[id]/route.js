import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { rbac } from '@/lib/rbac'
import User from '@/models/User'

export async function PUT(request, { params }) {
  try {
    const currentUser = await verifyToken(request)
    if (!currentUser) return NextResponse.json({ message: 'Accesso negato. Token mancante.' }, { status: 401 })
    const { allowed, message } = rbac(currentUser, 'admin')
    if (!allowed) return NextResponse.json({ message }, { status: 403 })

    const { nome, ruolo, attivo } = await request.json()
    await connectDB()
    const user = await User.findByIdAndUpdate(
      params.id,
      { nome, ruolo, attivo },
      { new: true, runValidators: true }
    )
    if (!user) return NextResponse.json({ message: 'Utente non trovato' }, { status: 404 })
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const currentUser = await verifyToken(request)
    if (!currentUser) return NextResponse.json({ message: 'Accesso negato. Token mancante.' }, { status: 401 })
    const { allowed, message } = rbac(currentUser, 'admin')
    if (!allowed) return NextResponse.json({ message }, { status: 403 })

    if (params.id === currentUser._id.toString()) {
      return NextResponse.json({ message: 'Non puoi eliminare te stesso' }, { status: 400 })
    }

    await connectDB()
    const user = await User.findByIdAndDelete(params.id)
    if (!user) return NextResponse.json({ message: 'Utente non trovato' }, { status: 404 })
    return NextResponse.json({ message: 'Utente eliminato' })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
