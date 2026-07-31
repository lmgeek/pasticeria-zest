'use client'

import { useEffect, Suspense, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import useCartStore from '@/stores/cartStore'
import { api } from '@/lib/api'

function SuccessContent() {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const clear = useCartStore((s) => s.clear)
  const [emailSent, setEmailSent] = useState(null)
  const paymentIntent = searchParams.get('payment_intent')

  useEffect(() => {
    clear()
  }, [clear])

  useEffect(() => {
    if (paymentIntent) {
      api.get(`/check/email-status?payment_intent=${paymentIntent}`)
        .then(({ data }) => setEmailSent(data.emailSent))
        .catch(() => setEmailSent(null))
    }
  }, [paymentIntent])

  return (
    <div className="success-page">
      <div className="container" style={{ paddingTop: 180, paddingBottom: 80, textAlign: 'center' }}>
        <div className="success-icon">✓</div>
        <h1 className="success-title">{t('ecommerce.success_title')}</h1>
        <p className="success-message">{t('ecommerce.success_message')}</p>
        {paymentIntent && (
          <p className="success-transaction">
            Transazione: <code>{paymentIntent}</code>
          </p>
        )}
        {emailSent === true && (
          <p style={{ color: 'var(--accent-green)', marginTop: 16, fontSize: '.9rem' }}>
            ✓ La factura è stata inviata al tuo indirizzo email.
          </p>
        )}
        {emailSent === false && (
          <p style={{ color: 'var(--accent-rose)', marginTop: 16, fontSize: '.9rem' }}>
            ⚠ Impossibile inviare la factura via email. Contatta l'amministratore.
          </p>
        )}
        {emailSent === null && paymentIntent && (
          <p style={{ color: 'var(--text-light)', marginTop: 16, fontSize: '.85rem' }}>
            Verifica dello stato dell&apos;email in corso…
          </p>
        )}
        <Link href="/menu" className="btn btn-primary" style={{ marginTop: 32 }}>
          {t('ecommerce.continue_shopping')}
        </Link>
      </div>
    </div>
  )
}

export default function Success() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  )
}
