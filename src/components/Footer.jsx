import React from 'react'

const LINKS = [
  { id: 'home', label: 'Home' }, { id: 'about', label: 'Chi Siamo' },
  { id: 'gallery', label: 'Galleria' }, { id: 'menu', label: 'Menu' },
  { id: 'designer', label: 'Crea il tuo Dolce' }, { id: 'contact', label: 'Contatti' },
]

export default function Footer({ scrollTo }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-logo">✦ Zest</span>
            <p>Pasticceria Artigianale – Pomezia, RM</p>
          </div>
          <div className="footer-links">
            {LINKS.map(l => (
              <a key={l.id} onClick={() => scrollTo(l.id)}>{l.label}</a>
            ))}
          </div>
          <div className="footer-social">
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
