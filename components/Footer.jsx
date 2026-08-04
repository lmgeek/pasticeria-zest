'use client'

import { usePathname } from 'next/navigation'

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
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Zest Pasticceria. Tutti i diritti riservati. | P.IVA in corso</p>
        </div>
      </div>
    </footer>
  )
}
