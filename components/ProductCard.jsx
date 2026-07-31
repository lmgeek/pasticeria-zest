'use client'

import { useTranslation } from 'react-i18next'
import useCartStore from '@/stores/cartStore'

export default function ProductCard({ product }) {
  const { t } = useTranslation()
  const addItem = useCartStore((s) => s.addItem)

  return (
    <div className="product-card">
      <div
        className="product-card-image"
        style={{
          backgroundImage: product.immagine
            ? `url(${product.immagine})`
            : 'linear-gradient(135deg, var(--warm-beige), var(--cream))',
        }}
      >
        {!product.immagine && <span className="product-card-placeholder">🍰</span>}
      </div>
      <div className="product-card-body">
        <h3 className="product-card-name">{product.nome}</h3>
        <p className="product-card-desc">{product.descrizione}</p>
        <div className="product-card-footer">
          <span className="product-card-price">€{product.prezzo.toFixed(2)}</span>
          <button className="btn btn-primary btn-small" onClick={() => addItem(product)}>
            {t('ecommerce.add_to_cart')}
          </button>
        </div>
      </div>
    </div>
  )
}
