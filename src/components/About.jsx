import React, { useEffect, useRef, useState } from 'react'

export default function About() {
  const [animated, setAnimated] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !animated) setAnimated(true) },
      { threshold: 0.3 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [animated])

  return (
    <div className="about" ref={ref}>
      <div className="container">
        <div className="about-grid">
          <div className="about-text">
            <span className="section-label">La Nostra Storia</span>
            <h2 className="section-title">Dove nasce la <span className="italic">dolcezza</span></h2>
            <p className="about-paragraph">
              Zest nasce ad Ardea alla fine del 2019 dall'incontro di tre amici accomunati dalla stessa passione:
              <strong> Mario Bartolucci, Simone Barocas e Alessandro Di Lauro</strong>.
              Il nome racconta già tutto — come la scorza di limone che profuma i nostri dolci,
              Zest è l'essenza, la parte più vibrante e autentica della pasticceria.
            </p>
            <p className="about-paragraph">
              Superando le sfide della pandemia, abbiamo continuato a sfornare lievitati di altissima qualità,
              arrivando a produrre oltre <strong>800 panettoni</strong> in un anno. La nostra filosofia è semplice:
              ingredienti selezionati, lavorazione artigianale, e un'attenzione ossessiva per ogni dettaglio.
            </p>
            <p className="about-paragraph">
              Dal mattino presto con i nostri cornetti appena sfornati, fino alla sera con le pizze e gli aperitivi,
              Zest è un luogo dove la qualità artigianale incontra l'accoglienza italiana.
            </p>
            <div className="about-signature">
              <span className="about-signature-name">Mario, Simone & Alessandro</span>
              <span className="about-signature-role">Fondatori</span>
            </div>
          </div>
          <div className="about-visual">
            <div className="about-image-frame">
              <div className="about-image-placeholder">
                <img src="/assets/about-bakery.jpg" alt="La nostra pasticceria" />
                <div className="about-image-decor" />
              </div>
            </div>
            <div className="about-stats">
              <div className="stat">
                <Counter target={2019} animated={animated} />
                <span className="stat-label">Apertura</span>
              </div>
              <div className="stat">
                <Counter target={800} suffix="+" animated={animated} />
                <span className="stat-label">Panettoni/anno</span>
              </div>
              <div className="stat">
                <Counter target={3} animated={animated} />
                <span className="stat-label">Amici Chef</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Counter({ target, suffix = '', animated }) {
  const [count, setCount] = React.useState(0)
  useEffect(() => {
    if (!animated || target === 0) return
    const duration = 1500
    const start = performance.now()
    const frame = (now) => {
      const p = Math.min((now - start) / duration, 1)
      setCount(Math.round(p * target))
      if (p < 1) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }, [animated, target])
  return <span className="stat-number">{count}{suffix}</span>
}
