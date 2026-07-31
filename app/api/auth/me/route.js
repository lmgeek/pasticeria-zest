import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function GET(request) {
  const user = await verifyToken(request)
  if (!user) {
    return NextResponse.json({ message: 'Accesso negato. Token mancante.' }, { status: 401 })
  }
  return NextResponse.json(user)
}
