'use client'

import { usePathname } from 'next/navigation'
import LanguageSwitcher from './LanguageSwitcher'

export default function Footer() {
  const pathname = usePathname()
  const isHome = pathname === '/'

  const handleClick = (sectionId) => {
    if (isHome) {
      const el = document.getElementById(sectionId)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.location.href = '/#' + sectionId
    }
  }

  const links = ['home','about','gallery','menu','designer','contact']

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-logo">✦ Zest</span>
            <p>Pasticceria Artigianale – Pomezia, RM</p>
          </div>
          <div className="footer-links">
            {links.map(id => (
              <a key={id} onClick={() => handleClick(id)}>{id.charAt(0).toUpperCase() + id.slice(1)}</a>
            ))}
          </div>
          <div className="footer-social">
            <LanguageSwitcher />
            <a href="https://www.instagram.com/zest_pasticceria_" target="_blank" rel="noopener" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Zest Pasticceria. Tutti i diritti riservati. | P.IVA in corso</p>
        </div>
      </div>
    </footer>
  )
}
