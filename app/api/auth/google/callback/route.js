import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { generateToken } from '@/lib/auth'
import { getAppBaseUrl } from '@/lib/urls'
import User from '@/models/User'

export async function GET(request) {
  const baseUrl = getAppBaseUrl(request)
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/login?error=google_auth_failed`)
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${baseUrl}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    })

    const tokens = await tokenResponse.json()
    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    const profile = await profileResponse.json()

    await connectDB()
    let user = await User.findOne({ googleId: profile.id })

    if (!user) {
      user = await User.findOne({ email: profile.email })
      if (user) {
        user.googleId = profile.id
        user.avatar = profile.picture || user.avatar
        await user.save()
      } else {
        user = await User.create({
          nome: profile.name,
          email: profile.email,
          googleId: profile.id,
          avatar: profile.picture,
          ruolo: 'cliente',
        })
      }
    }

    const token = generateToken(user)
    const response = NextResponse.redirect(`${baseUrl}/login?token=${token}`)
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    })
    return response
  } catch (error) {
    console.error('Google auth error:', error)
    return NextResponse.redirect(`${baseUrl}/login?error=google_auth_failed`)
  }
}
