'use client'

import { useTranslation, Trans } from 'react-i18next'

export default function Contact() {
  const { t } = useTranslation()

  return (
    <div className="contact">
      <div className="container">
        <div className="section-header">
          <span className="section-label">{t('contact.label')}</span>
          <h2 className="section-title"><Trans i18nKey="contact.title" components={{ italic: <span className="italic" /> }} /></h2>
        </div>
        <div className="contact-grid">
          <div className="contact-info">
            {[{ titleKey: 'address_title', text: t('contact.address'), icon: '📍' },
              { titleKey: 'phone_title', text: '+39 331 791 2107', icon: '📞' },
              { titleKey: 'email_title', text: 'info@zestpasticceria.com', icon: '✉️' },
              { titleKey: 'hours_title', text: `${t('contact.hours_week')}\n${t('contact.hours_weekend')}`, icon: '🕐' },
            ].map((c) => (
              <div key={c.titleKey} className="contact-card">
                <div className="contact-icon">{c.icon}</div>
                <div>
                  <h4>{t(`contact.${c.titleKey}`)}</h4>
                  <p style={{ whiteSpace: 'pre-line' }}>{c.text}</p>
                </div>
              </div>
            ))}
          </div>
          <a href="https://maps.google.com/?q=Via+Urbano+Rattazzi,+21,+00040+Pomezia+RM" target="_blank" rel="noopener" className="map-placeholder">
            <img src="/assets/contact-street.jpg" alt="Mappa" className="map-img" />
            <div className="map-overlay" />
            <div className="map-pin">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3" fill="white"/></svg>
            </div>
            <p>{t('contact.map_label')}</p>
          </a>
        </div>
      </div>
    </div>
  )
}
