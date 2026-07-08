import React, { useState } from 'react'

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'Chi Siamo' },
  { id: 'gallery', label: 'Galleria' },
  { id: 'menu', label: 'Menu' },
  { id: 'designer', label: 'Crea il tuo Dolce' },
  { id: 'contact', label: 'Contatti' },
]

export default function Navbar({ activeSection, scrolled, scrollTo }) {
  const [open, setOpen] = useState(false)

  const handleClick = (id) => {
    setOpen(false)
    scrollTo(id)
  }

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="container">
        <a href="#home" className="nav-logo" onClick={(e) => { e.preventDefault(); scrollTo('home') }}>
          <img src="/logo.png" alt="Zest Pasticceria" className="nav-logo-img" />
        </a>
        <div className="nav-right">
          <ul className={`nav-links${open ? ' open' : ''}`}>
            {NAV_ITEMS.map(item => (
              <li key={item.id}>
                <a className={activeSection === item.id ? 'active' : ''}
                   onClick={() => handleClick(item.id)}>
                  {item.label}
                </a>
              </li>
            ))}
            <li className="nav-mobile-social">
              <a href="https://www.instagram.com/zest_pasticceria_" target="_blank" rel="noopener" aria-label="Instagram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                <span>Seguici su Instagram</span>
              </a>
            </li>
          </ul>
          <a href="https://www.instagram.com/zest_pasticceria_" target="_blank" rel="noopener" className="nav-social" aria-label="Instagram">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          </a>
        </div>
        <button className={`nav-toggle${open ? ' open' : ''}`} onClick={() => setOpen(!open)} aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  )
}
