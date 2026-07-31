import { NextResponse } from 'next/server'

export async function GET() {
  const redirectUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  redirectUrl.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID)
  redirectUrl.searchParams.set('redirect_uri', `${process.env.NEXT_PUBLIC_URL}/api/auth/google/callback`)
  redirectUrl.searchParams.set('response_type', 'code')
  redirectUrl.searchParams.set('scope', 'profile email')

  return NextResponse.redirect(redirectUrl.toString())
}
