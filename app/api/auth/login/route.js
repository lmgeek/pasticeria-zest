import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/db'
import { generateToken } from '@/lib/auth'
import User from '@/models/User'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ message: 'Email e password obbligatorie' }, { status: 400 })
    }

    await connectDB()
    const user = await User.findOne({ email, attivo: true })
    if (!user || !user.password) {
      return NextResponse.json({ message: 'Email non registrata' }, { status: 401 })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return NextResponse.json({ message: 'Password errata' }, { status: 401 })
    }

    const token = generateToken(user)

    const response = NextResponse.json({ token, user })
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    })

    return response
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
