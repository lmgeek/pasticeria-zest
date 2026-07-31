'use client'

import { useTranslation } from 'react-i18next'

export default function CakeDesignerInner() {
  const { t } = useTranslation()

  return (
    <div style={{ padding: '120px 0', background: 'var(--cream)' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-label">{t('designer.label')}</span>
          <h2 className="section-title">
            Il tuo dolce <span className="italic">come lo sogni</span>
          </h2>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))',
          borderRadius: 'var(--radius)',
          padding: '60px 40px',
          textAlign: 'center',
          color: 'white',
        }}>
          <p style={{ fontSize: '1.2rem', marginBottom: 16, opacity: 0.9, fontStyle: 'italic' }}>
            {t('designer.title')}
          </p>
          <p style={{ fontSize: '0.95rem', opacity: 0.7, maxWidth: 500, margin: '0 auto 24px' }}>
            Presto potrai personalizzare ogni dettaglio del tuo dolce in 3D!
          </p>
          <button className="btn btn-primary" style={{ background: 'var(--gold)', color: 'var(--primary-dark)' }} disabled>
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  )
}
