import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { rbac } from '@/lib/rbac'
import Product from '@/models/Product'

const slugify = (text) =>
  text.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
    .replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-')

export async function GET(request, { params }) {
  try {
    await connectDB()
    const product = await Product.findById(params.id).populate('categoria', 'nome slug')
    if (!product) return NextResponse.json({ message: 'Prodotto non trovato' }, { status: 404 })
    return NextResponse.json(product)
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
    if (data.nome && !data.slug) data.slug = slugify(data.nome)

    await connectDB()
    const product = await Product.findByIdAndUpdate(params.id, data, { new: true, runValidators: true })
      .populate('categoria', 'nome slug')
    if (!product) return NextResponse.json({ message: 'Prodotto non trovato' }, { status: 404 })
    return NextResponse.json(product)
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
    const product = await Product.findByIdAndDelete(params.id)
    if (!product) return NextResponse.json({ message: 'Prodotto non trovato' }, { status: 404 })
    return NextResponse.json({ message: 'Prodotto eliminato' })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
