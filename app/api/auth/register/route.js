import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { generateToken } from '@/lib/auth'
import User from '@/models/User'

export async function POST(request) {
  try {
    const { email, password, nome } = await request.json()

    if (!email || !password || !nome) {
      return NextResponse.json({ message: 'Tutti i campi sono obbligatori' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ message: 'Password minima 6 caratteri' }, { status: 400 })
    }

    await connectDB()
    const exists = await User.findOne({ email })
    if (exists) {
      return NextResponse.json({ message: 'Email già registrata' }, { status: 400 })
    }

    const user = await User.create({ email, password, nome })
    const token = generateToken(user)

    return NextResponse.json({ token, user }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
