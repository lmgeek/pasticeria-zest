import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { rbac } from '@/lib/rbac'
import Category from '@/models/Category'

const slugify = (text) =>
  text.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
    .replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-')

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = {}
    if (searchParams.has('attivo')) filter.attivo = searchParams.get('attivo') === 'true'

    await connectDB()
    const categories = await Category.find(filter).sort({ ordine: 1, nome: 1 })
    return NextResponse.json(categories)
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
    if (!data.nome) return NextResponse.json({ message: 'Nome obbligatorio' }, { status: 400 })
    if (!data.slug) data.slug = slugify(data.nome)

    await connectDB()
    const category = await Category.create(data)
    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    if (error.code === 11000) return NextResponse.json({ message: 'Slug già esistente' }, { status: 400 })
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
