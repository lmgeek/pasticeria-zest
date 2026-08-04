'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import useCartStore from '@/stores/cartStore'
import CartDrawer from './CartDrawer'

export default function Navbar() {
  const { t } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantita, 0))
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (sectionId) => {
    setOpen(false)
    if (isHome) {
      const el = document.getElementById(sectionId)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.location.href = '/#' + sectionId
    }
  }

  return (
    <>
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="container">
        <Link href="/" className="nav-logo">
          <img src="/logo.png" alt="Zest Pasticceria" className="nav-logo-img" />
        </Link>
        <div className="nav-right">
          <ul className={`nav-links${open ? ' open' : ''}`}>
            {['home','about','gallery','menu','designer','contact'].map(id => (
              <li key={id}>
                <a onClick={() => handleNavClick(id)}>{t(`nav.${id}`)}</a>
              </li>
            ))}
            <li>
              <Link href="/menu" className={pathname === '/menu' ? 'active' : ''} onClick={() => setOpen(false)}>
                {t('nav.shop')}
              </Link>
            </li>
          </ul>
          <button className="nav-cart-btn desktop-only" onClick={() => setCartOpen(true)} aria-label={t('ecommerce.cart')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            {cartCount > 0 && <span className="nav-cart-badge">{cartCount}</span>}
          </button>
          <button className="nav-cart-btn mobile-only" onClick={() => setCartOpen(true)} aria-label={t('ecommerce.cart')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            {cartCount > 0 && <span className="nav-cart-badge">{cartCount}</span>}
          </button>
          <button className={`nav-toggle${open ? ' open' : ''}`} onClick={() => setOpen(!open)} aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
