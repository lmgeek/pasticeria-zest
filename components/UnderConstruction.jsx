'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function UnderConstruction() {
  const { t } = useTranslation()

  const [hours, setHours] = useState({ h: '– –', m: '– –', s: '– –' })

  useEffect(() => {
    const tick = () => {
      const target = new Date()
      target.setHours(23, 59, 59, 999)
      let diff = target.getTime() - Date.now()
      if (diff < 0) diff = 0
      const h = String(Math.floor(diff / 3600000)).padStart(2, '0')
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0')
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0')
      setHours({ h, m, s })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const [daysLeft, setDaysLeft] = useState('')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('zest_open_date')
      if (!saved) {
        const d = new Date()
        d.setDate(d.getDate() + 14)
        localStorage.setItem('zest_open_date', d.toISOString())
        setDaysLeft('14')
      } else {
        const open = new Date(saved)
        const diff = Math.ceil((open.getTime() - Date.now()) / 86400000)
        setDaysLeft(String(Math.max(diff, 0)))
      }
    } catch {
      setDaysLeft('14')
    }
  }, [])

  return (
    <div className="uc">
      <div className="uc-bg" />
      <div className="uc-pattern" />
      <div className="uc-content">
        <span className="uc-eyebrow">{t('uc.badge')}</span>
        <h1 className="uc-title">
          <span className="uc-title-main">{t('uc.title')}</span>
          <span className="uc-title-accent">{t('uc.title_accent')}</span>
        </h1>
        <p className="uc-sub">{t('uc.subtitle')}</p>

        <div className="uc-whisk" aria-hidden="true">
          <span className="uc-whisk-ball" />
          <span className="uc-whisk-ring" />
          <span className="uc-whisk-stem" />
        </div>

        <div className="uc-progress" aria-hidden="true">
          <span className="uc-progress-bar" />
        </div>

        <div className="uc-countdown">
          <div className="uc-count-cell"><span className="uc-count-num">{hours.h}</span><span className="uc-count-label">ore</span></div>
          <span className="uc-count-sep">:</span>
          <div className="uc-count-cell"><span className="uc-count-num">{hours.m}</span><span className="uc-count-label">min</span></div>
          <span className="uc-count-sep">:</span>
          <div className="uc-count-cell"><span className="uc-count-num">{hours.s}</span><span className="uc-count-label">sec</span></div>
        </div>

        <div className="uc-days">
          <span className="uc-days-badge">{daysLeft}</span>
          <span>{t('uc.days_left')}</span>
        </div>

        <div className="uc-contact">
          <a href={`mailto:${t('uc.email')}`}>{t('uc.email')}</a>
          <span className="uc-contact-sep">·</span>
          <span>{t('uc.phone')}</span>
        </div>
      </div>
    </div>
  )
}
