import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { rbac } from '@/lib/rbac'
import Product from '@/models/Product'

const slugify = (text) =>
  text.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
    .replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-')

export async function GET(request) {
  try {
    const user = await verifyToken(request)
    const { searchParams } = new URL(request.url)

    const filter = {}
    if (searchParams.has('categoria')) filter.categoria = searchParams.get('categoria')
    if (searchParams.has('attivo')) filter.attivo = searchParams.get('attivo') === 'true'
    if (!user || (user.ruolo !== 'admin' && user.ruolo !== 'staff')) {
      filter.attivo = true
    }

    const sort = {}
    const sortParam = searchParams.get('sort')
    if (sortParam === 'prezzo') sort.prezzo = 1
    else if (sortParam === '-prezzo') sort.prezzo = -1
    else if (sortParam === 'nome') sort.nome = 1
    else sort.createdAt = -1

    await connectDB()
    const products = await Product.find(filter).populate('categoria', 'nome slug').sort(sort)
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ message: 'Accesso negato. Token mancante.' }, { status: 401 })
    }
    const { allowed, message } = rbac(user, 'admin', 'staff')
    if (!allowed) {
      return NextResponse.json({ message }, { status: 403 })
    }

    const data = await request.json()
    if (!data.nome || data.prezzo === undefined || !data.categoria) {
      return NextResponse.json({ message: 'Nome, prezzo e categoria obbligatori' }, { status: 400 })
    }
    if (!data.slug) data.slug = slugify(data.nome)

    await connectDB()
    const product = await Product.create(data)
    const populated = await product.populate('categoria', 'nome slug')
    return NextResponse.json(populated, { status: 201 })
  } catch (error) {
    if (error.code === 11000) return NextResponse.json({ message: 'Slug già esistente' }, { status: 400 })
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
