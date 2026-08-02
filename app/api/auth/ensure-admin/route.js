import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import User from '@/models/User'

export async function POST(request) {
  try {
    const expected = process.env.BOOTSTRAP_SECRET
    if (!expected) {
      return NextResponse.json({ message: 'BOOTSTRAP_SECRET no configurado' }, { status: 500 })
    }

    const auth = request.headers.get('authorization')
    if (auth !== `Bearer ${expected}`) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
    }

    const { email, password, nome } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ message: 'email y password son requeridas' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ message: 'Password minima 6 caracteres' }, { status: 400 })
    }

    await connectDB()

    let user = await User.findOne({ email })
    if (user) {
      if (user.ruolo !== 'admin') {
        user.ruolo = 'admin'
        await user.save()
      }
      return NextResponse.json(
        { message: 'El usuario ya existe, rol admin asegurado', user },
        { status: 200 }
      )
    }

    user = await User.create({ email, password, nome: nome || 'Admin', ruolo: 'admin' })
    return NextResponse.json({ message: 'Admin creado', user }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
