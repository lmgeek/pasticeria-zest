'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { api } from '@/lib/api'

const LABEL_MAP = {
  storeName: 'Nome Negozio',
  storeEmail: 'Email Negozio',
  storePhone: 'Telefono',
  storeAddress: 'Indirizzo',
  storeVat: 'Partita IVA',
  storeCurrency: 'Valuta',
  defaultLanguage: 'Lingua',
  smtpHost: 'SMTP Host',
  smtpPort: 'SMTP Porta',
  smtpUser: 'SMTP Utente',
  smtpPass: 'SMTP Password',
  smtpSecure: 'SMTP Sicuro',
  storeEmail: 'Email Mittente',
  stripePublishableKey: 'Chiave Pubblica',
  stripeSecretKey: 'Chiave Segreta',
  stripeWebhookSecret: 'Webhook Secret',
}

export default function Configuracion() {
  const { t } = useTranslation()
  const [config, setConfig] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    api.get('/config').then(({ data }) => setConfig(data)).catch(console.error).finally(() => setLoading(false))
  }, [])

  const loadTestConfig = async () => {
    setTesting(true)
    try {
      const { data } = await api.post('/config/stripe-test')
      const res = await api.get('/config')
      setConfig(res.data)
      setToast(data.message)
      setTimeout(() => setToast(''), 4000)
    } catch (err) {
      setToast(err.response?.data?.message || 'Errore')
      setTimeout(() => setToast(''), 4000)
    } finally {
      setTesting(false)
    }
  }

  const handleChange = (key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.put('/config', config)
      setToast('Configurazione salvata!')
      setTimeout(() => setToast(''), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const renderField = (key) => {
    const value = config[key] || ''
    const commonProps = { className: 'config-input', value, onChange: (e) => handleChange(key, e.target.value) }

    if (key === 'stripeSecretKey' || key === 'stripeWebhookSecret' || key === 'smtpPass') {
      return <input type="password" {...commonProps} />
    }
    if (key === 'storeCurrency') {
      return (
        <select className="config-input" value={value || 'eur'} onChange={(e) => handleChange(key, e.target.value)}>
          <option value="eur">EUR (€)</option>
          <option value="usd">USD ($)</option>
          <option value="gbp">GBP (£)</option>
        </select>
      )
    }
    if (key === 'defaultLanguage') {
      return (
        <select className="config-input" value={value || 'it'} onChange={(e) => handleChange(key, e.target.value)}>
          <option value="it">Italiano</option>
          <option value="es">Español</option>
          <option value="en">English</option>
        </select>
      )
    }
    if (key === 'smtpPort') {
      return <input type="number" className="config-input" value={value || '587'} onChange={(e) => handleChange(key, e.target.value)} />
    }
    if (key === 'smtpSecure') {
      return (
        <select className="config-input" value={value || 'false'} onChange={(e) => handleChange(key, e.target.value)}>
          <option value="false">STARTTLS (porta 587)</option>
          <option value="true">SSL/TLS (porta 465)</option>
        </select>
      )
    }
    if (key === 'storeEmail') {
      return <input type="email" className="config-input" value={value} onChange={(e) => handleChange(key, e.target.value)} />
    }
    return <input className="config-input" {...commonProps} />
  }

  if (loading) return <p className="page-loading">{t('admin.loading')}</p>

  const sections = [
    {
      title: 'Informazioni Negozio',
      keys: ['storeName', 'storeEmail', 'storePhone', 'storeAddress', 'storeVat', 'storeCurrency'],
    },
    {
      title: 'Lingue',
      keys: ['defaultLanguage'],
    },
    {
      title: 'Email (SMTP)',
      keys: ['smtpHost', 'smtpPort', 'smtpUser', 'smtpPass', 'smtpSecure', 'storeEmail'],
    },
    {
      title: 'Stripe',
      keys: ['stripePublishableKey', 'stripeSecretKey', 'stripeWebhookSecret'],
      guide: true,
    },
  ]

  return (
    <div className="config-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>{t('admin.config')}</h1>
        <button className="btn btn-primary btn-small" onClick={handleSave} disabled={saving}>
          {saving ? t('admin.loading') : t('admin.save')}
        </button>
      </div>
      {toast && <div className="config-toast"><span>{toast}</span><button onClick={() => setToast('')}>×</button></div>}

      {sections.map((section) => (
        <div key={section.title} className="config-section">
          <h3 className="config-section-title">{section.title}</h3>
          {section.guide && (
            <div className="config-stripe-guide">
              <h4>⚡ Modalità sviluppo — configurazione automatica</h4>
              <ol>
                <li>Assicurati di avere <a href="https://stripe.com/docs/stripe-cli" target="_blank" rel="noopener">Stripe CLI</a> installato: <code>brew install stripe/stripe-cli/stripe</code></li>
                <li>Esegui: <code>stripe listen --forward-to {window.location.origin}/api/checkout/webhook</code></li>
                <li>Copia il <strong>webhook signing secret</strong> (whsec_...) che appare nel terminale</li>
              </ol>
              <div style={{ marginTop: 12 }}>
                <p style={{ fontSize: '.85rem', color: 'var(--text-light)', marginBottom: 8 }}>
                  Poi imposta nel file <code>.env.local</code>:
                </p>
                <pre style={{ background: 'var(--warm-beige)', padding: 12, borderRadius: 8, fontSize: '.8rem', lineHeight: 1.6 }}>
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...</pre>
              </div>
              <div style={{ marginTop: 16 }}>
                <button className="btn btn-primary btn-small" onClick={loadTestConfig} disabled={testing}>
                  {testing ? 'Caricamento...' : 'Carica configurazioni test da .env.local'}
                </button>
              </div>
            </div>
          )}
          <div className="config-grid">
            {section.keys.map((key) => (
              <div key={key} className="config-field">
                <label className="config-label">{LABEL_MAP[key] || key}</label>
                {renderField(key)}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}