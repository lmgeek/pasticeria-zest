import React, { useState } from 'react'
import { menuData } from '../data/menuData'

const CATS = Object.keys(menuData)
const LABELS = { lievitati: 'Lievitati', cornetteria: 'Cornetteria', pasticceria: 'Pasticceria', pizza: 'Pizza & Salato', bevande: 'Bevande' }

export default function Menu() {
  const [cat, setCat] = useState('lievitati')
  const items = menuData[cat] || []

  return (
    <div className="menu">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Il Nostro Menu</span>
          <h2 className="section-title">Dolci <span className="italic">straordinari</span>, ogni giorno</h2>
        </div>
        <div className="menu-tabs">
          {CATS.map(c => (
            <button key={c} className={`menu-tab${cat === c ? ' active' : ''}`} onClick={() => setCat(c)}>
              {LABELS[c] || c}
            </button>
          ))}
        </div>
        <div className="menu-grid">
          {items.map((item, i) => (
            <div key={i} className="menu-item">
              <h4>{item.name}</h4>
              <p>{item.desc}</p>
              <span className="price">{item.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
