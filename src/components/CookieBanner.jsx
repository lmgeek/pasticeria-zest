import React, { useState, useEffect } from 'react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('zest_cookie_consent')
    if (!consent) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem('zest_cookie_consent', 'accepted')
    setVisible(false)
  }

  const reject = () => {
    localStorage.setItem('zest_cookie_consent', 'rejected')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="cookie-banner">
      <div className="cookie-banner-content">
        <div className="cookie-banner-text">
          <strong>🍪 Questo sito utilizza cookie</strong>
          <p>Utilizziamo cookie tecnici e di analytics per migliorare la tua esperienza di navigazione. 
          Cliccando "Accetta" acconsenti all'uso di tutti i cookie.</p>
        </div>
        <div className="cookie-banner-actions">
          <button className="cookie-btn cookie-btn-accept" onClick={accept}>Accetta</button>
          <button className="cookie-btn cookie-btn-reject" onClick={reject}>Rifiuta</button>
        </div>
      </div>
    </div>
  )
}
