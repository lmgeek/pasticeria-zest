'use client'

import { useTranslation } from 'react-i18next'

const FLAGS = { it: '🇮🇹', es: '🇪🇸', en: '🇬🇧' }

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const current = i18n.language?.slice(0, 2) || 'it'

  const changeLang = (lng) => {
    i18n.changeLanguage(lng)
  }

  return (
    <div className="lang-switcher">
      {['it', 'es', 'en'].map((lng) => (
        <button
          key={lng}
          className={`lang-btn${current === lng ? ' active' : ''}`}
          onClick={() => changeLang(lng)}
          title={lng.toUpperCase()}
        >
          {FLAGS[lng]}
        </button>
      ))}
    </div>
  )
}
