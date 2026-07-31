import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { rbac } from '@/lib/rbac'
import Category from '@/models/Category'

export async function GET(request, { params }) {
  try {
    await connectDB()
    const category = await Category.findById(params.id)
    if (!category) return NextResponse.json({ message: 'Categoria non trovata' }, { status: 404 })
    return NextResponse.json(category)
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
    const category = await Category.findByIdAndUpdate(params.id, data, { new: true, runValidators: true })
    if (!category) return NextResponse.json({ message: 'Categoria non trovata' }, { status: 404 })
    return NextResponse.json(category)
  } catch (error) {
    if (error.code === 11000) return NextResponse.json({ message: 'Slug già esistente' }, { status: 400 })
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await verifyToken(request)
    if (!user) return NextResponse.json({ message: 'Accesso negato. Token mancante.' }, { status: 401 })
    const { allowed, message } = rbac(user, 'admin')
    if (!allowed) return NextResponse.json({ message }, { status: 403 })

    await connectDB()
    const category = await Category.findByIdAndDelete(params.id)
    if (!category) return NextResponse.json({ message: 'Categoria non trovata' }, { status: 404 })
    return NextResponse.json({ message: 'Categoria eliminata' })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
