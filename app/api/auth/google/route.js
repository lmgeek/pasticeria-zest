import { NextResponse } from 'next/server'
import { getAppBaseUrl } from '@/lib/urls'

export async function GET(request) {
  const baseUrl = getAppBaseUrl(request)
  const redirectUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  redirectUrl.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID)
  redirectUrl.searchParams.set('redirect_uri', `${baseUrl}/api/auth/google/callback`)
  redirectUrl.searchParams.set('response_type', 'code')
  redirectUrl.searchParams.set('scope', 'profile email')

  return NextResponse.redirect(redirectUrl.toString())
}
