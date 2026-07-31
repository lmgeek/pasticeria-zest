'use client'

import { useTranslation, Trans } from 'react-i18next'
import Link from 'next/link'

export default function Menu() {
  const { t } = useTranslation()

  return (
    <div className="menu-banner">
      <div className="menu-banner-bg">
        <img src="/assets/gallery-torte.jpg" alt="" />
        <div className="menu-banner-overlay" />
      </div>
      <div className="container menu-banner-content">
        <div className="section-header">
          <span className="section-label">{t('menu_section.label')}</span>
          <h2 className="section-title"><Trans i18nKey="menu_section.title" components={{ italic: <span className="italic" /> }} /></h2>
          <p className="menu-banner-desc">{t('menu_section.description')}</p>
        </div>
        <Link href="/menu" className="btn menu-banner-cta">{t('menu_section.cta_shop')}</Link>
      </div>
    </div>
  )
}
