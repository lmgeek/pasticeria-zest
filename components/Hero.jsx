'use client'

export default function Hero() {
  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

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
      </div>
    </div>
  )
}
