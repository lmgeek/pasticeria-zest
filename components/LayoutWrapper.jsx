'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'

export default function LayoutWrapper({ children }) {
  const pathname = usePathname()
  const hideLayout = pathname === '/login' || pathname.startsWith('/admin')
  const isHome = pathname === '/'

  return (
    <>
      {!hideLayout && <Navbar />}
      <main className={!hideLayout && !isHome ? 'main-with-nav' : ''}>{children}</main>
      {!hideLayout && <Footer />}
    </>
  )
}
