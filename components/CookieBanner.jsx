'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function CookieBanner() {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setVisible(false)
  }

  const reject = () => {
    localStorage.setItem('cookie-consent', 'rejected')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="cookie-banner">
      <div className="cookie-banner-content">
        <div className="cookie-banner-text">
          <strong>{t('cookie.title')}</strong>
          <p>{t('cookie.desc')}</p>
        </div>
        <div className="cookie-banner-actions">
          <button className="cookie-btn cookie-btn-accept" onClick={accept}>{t('cookie.accept')}</button>
          <button className="cookie-btn cookie-btn-reject" onClick={reject}>{t('cookie.reject')}</button>
        </div>
      </div>
    </div>
  )
}
