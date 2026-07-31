'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Link from 'next/link'
import { api } from '@/lib/api'
import useCartStore from '@/stores/cartStore'
import { ThinkingOrbWrapper } from '@/components/ThinkingOrbWrapper'

function CheckoutForm({ clientSecret }) {
  const { t } = useTranslation()
  const stripe = useStripe()
  const elements = useElements()
  const items = useCartStore((s) => s.items)
  const total = items.reduce((sum, i) => sum + i.prezzo * i.quantita, 0)
  const clear = useCartStore((s) => s.clear)
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setProcessing(true)
    setError('')

    const { error: submitError } = await elements.submit()
    if (submitError) {
      setError(submitError.message)
      setProcessing(false)
      return
    }

    try {
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/success`,
        },
      })

      if (confirmError) {
        setError(confirmError.message)
        setProcessing(false)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Errore di pagamento')
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <PaymentElement />
      {error && <p className="checkout-error">{error}</p>}
      <button type="submit" className="btn btn-primary btn-full" disabled={!stripe || processing || !clientSecret}>
        {processing ? t('ecommerce.processing') : `${t('ecommerce.pay')} — €${total.toFixed(2)}`}
      </button>
    </form>
  )
}

function CustomerForm({ onSubmit }) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({ nome: '', email: '', telefono: '', indirizzo: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!formData.nome.trim()) newErrors.nome = t('ecommerce.name_required')
    if (!formData.email.trim()) newErrors.email = t('ecommerce.email_required')
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t('ecommerce.email_invalid')
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <h3>{t('ecommerce.customer_info')}</h3>
      <div className="form-field">
        <label htmlFor="ck-nome">{t('ecommerce.name')} *</label>
        <input id="ck-nome" name="nome" type="text" className="form-input" value={formData.nome} onChange={handleChange} placeholder={t('ecommerce.name_placeholder')} />
        {errors.nome && <span className="field-error">{errors.nome}</span>}
      </div>
      <div className="form-field">
        <label htmlFor="ck-email">{t('ecommerce.email')} *</label>
        <input id="ck-email" name="email" type="email" className="form-input" value={formData.email} onChange={handleChange} placeholder={t('ecommerce.email_placeholder')} />
        {errors.email && <span className="field-error">{errors.email}</span>}
      </div>
      <div className="form-field">
        <label htmlFor="ck-telefono">{t('ecommerce.phone')}</label>
        <input id="ck-telefono" name="telefono" type="tel" className="form-input" value={formData.telefono} onChange={handleChange} placeholder={t('ecommerce.phone_placeholder')} />
      </div>
      <div className="form-field">
        <label htmlFor="ck-indirizzo">{t('ecommerce.address')}</label>
        <input id="ck-indirizzo" name="indirizzo" type="text" className="form-input" value={formData.indirizzo} onChange={handleChange} placeholder={t('ecommerce.address_placeholder')} />
      </div>
      <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
        {submitting ? t('admin.loading') : t('ecommerce.continue_to_payment')}
      </button>
    </form>
  )
}

export default function Checkout() {
  const { t } = useTranslation()
  const items = useCartStore((s) => s.items)
  const total = items.reduce((sum, i) => sum + i.prezzo * i.quantita, 0)
  const [stripePromise, setStripePromise] = useState(null)
  const [clientSecret, setClientSecret] = useState('')
  const [loading, setLoading] = useState(true)
  const [payError, setPayError] = useState('')
  const [creatingPayment, setCreatingPayment] = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        const { data: config } = await api.get('/config/public')
        const key = config.stripePublishableKey
        if (!key) {
          setLoading(false)
          return
        }
        setStripePromise(loadStripe(key))
      } catch (err) {
        setPayError(err.response?.data?.message || err.message || 'Errore di pagamento')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const handleCustomerSubmit = async (clienteData) => {
    setCreatingPayment(true)
    setPayError('')
    try {
      const { data } = await api.post('/checkout/create-payment-intent', {
        items: items.map((i) => ({ prodotto: i._id, quantita: i.quantita })),
        clienteData,
      })
      setClientSecret(data.clientSecret)
    } catch (err) {
      setPayError(err.response?.data?.message || err.message || 'Errore di pagamento')
    } finally {
      setCreatingPayment(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container" style={{ paddingTop: 180, paddingBottom: 80, textAlign: 'center' }}>
          <h1>{t('ecommerce.cart')}</h1>
          <p style={{ color: 'var(--text-light)', marginTop: 16 }}>{t('ecommerce.empty_cart')}</p>
          <Link href="/menu" className="btn btn-primary" style={{ marginTop: 24 }}>{t('ecommerce.continue_shopping')}</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="container" style={{ paddingTop: 140, paddingBottom: 80 }}>
        <h1 className="checkout-title">{t('ecommerce.checkout')}</h1>
        <div className="checkout-layout">
          <div className="checkout-summary">
            <h3>{t('ecommerce.order_summary')}</h3>
            {items.map((item) => (
              <div key={item._id} className="checkout-item">
                <span>{item.nome} × {item.quantita}</span>
                <span>€{(item.prezzo * item.quantita).toFixed(2)}</span>
              </div>
            ))}
            <div className="checkout-total">
              <strong>{t('ecommerce.total')}</strong>
              <strong>€{total.toFixed(2)}</strong>
            </div>
          </div>
          <div className="checkout-payment">
            {loading ? (
              <p>{t('admin.loading')}</p>
            ) : payError ? (
              <p className="checkout-error">{payError}</p>
            ) : !stripePromise ? (
              <>
                <h3>Stripe non configurato</h3>
                <p style={{ color: 'var(--text-light)', marginTop: 16 }}>Contatta l'amministratore.</p>
              </>
             ) : !clientSecret ? (
               creatingPayment ? (
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '24px 0' }}>
                   <ThinkingOrbWrapper state="working" size={64} />
                   <p style={{ color: 'var(--text-light)', fontSize: '.85rem' }}>Creando sesión de pago…</p>
                 </div>
               ) : (
                 <CustomerForm onSubmit={handleCustomerSubmit} />
               )
            ) : (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm clientSecret={clientSecret} />
              </Elements>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
