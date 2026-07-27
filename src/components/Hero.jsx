import React from 'react'

export default function Hero({ scrollTo }) {
  return (
    <div className="hero">
      <div className="hero-bg">
        <img src="/assets/hero-bg.jpg" alt="" />
        <div className="hero-pattern" />
        <div className="hero-overlay" />
      </div>
      <div className="hero-content">
        <div className="hero-badge">Pasticceria Artigianale</div>
        <h1 className="hero-title">
          <span className="hero-title-line hero-title-line--small">Benvenuti da</span>
        </h1>
        <p className="hero-subtitle">La dolcezza artigianale nel cuore di Pomezia</p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => scrollTo('menu')}>Scopri il Menu</button>
          <button className="btn btn-secondary" onClick={() => scrollTo('designer')}>Crea il tuo Dolce</button>
        </div>
        <div className="hero-scroll">
          <span>Scopri di più</span>
          <div className="scroll-arrow" />
        </div>
      </div>
      <div className="hero-citrus" style={{top:'10%',left:'5%',fontSize:'5rem',animationDelay:'0s'}}>✦</div>
      <div className="hero-citrus" style={{bottom:'15%',right:'8%',fontSize:'3.5rem',animationDelay:'-4s'}}>✦</div>
      <div className="hero-citrus" style={{top:'40%',right:'3%',fontSize:'2.5rem',animationDelay:'-8s'}}>✦</div>
    </div>
  )
}
