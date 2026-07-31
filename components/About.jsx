'use client'

import { useTranslation, Trans } from 'react-i18next'

export default function About() {
  const { t } = useTranslation()

  return (
    <div className="about">
      <div className="container">
        <div className="section-header">
          <span className="section-label">{t('about.label')}</span>
          <h2 className="section-title"><Trans i18nKey="about.title" components={{ italic: <span className="italic" /> }} /></h2>
        </div>
        <div className="about-grid">
          <div className="about-text">
            <p className="about-paragraph"><Trans i18nKey="about.p1" components={{ strong: <strong /> }} /></p>
            <p className="about-paragraph"><Trans i18nKey="about.p2" components={{ strong: <strong /> }} /></p>
            <p className="about-paragraph"><Trans i18nKey="about.p3" components={{ strong: <strong /> }} /></p>
            <div className="about-signature">
              <span className="about-signature-name">{t('about.signature_name')}</span>
              <span className="about-signature-role">{t('about.signature_role')}</span>
            </div>
          </div>
          <div className="about-image-frame">
            <div className="about-image-placeholder">
              <img src="/assets/about-bakery.jpg" alt="Zest Pasticceria" />
            </div>
            <div className="about-image-decor" />
            <div className="about-stats">
              {[
                { num: '70+', label: t('about.stat_products') },
                { num: '15+', label: t('about.stat_years') },
                { num: '5000+', label: t('about.stat_clients') },
              ].map((s) => (
                <div key={s.label} className="stat">
                  <span className="stat-number">{s.num}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
