import { NextResponse } from 'next/server'

const ADMIN_PATHS = ['/admin', '/admin/productos', '/admin/categorias', '/admin/clientes', '/admin/ventas', '/admin/usuarios', '/admin/configuracion']

export function middleware(request) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value

  if (ADMIN_PATHS.includes(pathname) && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
