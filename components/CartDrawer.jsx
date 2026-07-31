'use client'

import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import useCartStore from '@/stores/cartStore'

export default function CartDrawer({ open, onClose }) {
  const { t } = useTranslation()
  const items = useCartStore((s) => s.items)
  const total = items.reduce((sum, i) => sum + i.prezzo * i.quantita, 0)
  const { removeItem, updateQuantity } = useCartStore()
  const pathname = usePathname()

  return (
    <>
      {open && <div className="cart-overlay" onClick={onClose} />}
      <div className={`cart-drawer${open ? ' open' : ''}`}>
        <div className="cart-drawer-header">
          <h3>{t('ecommerce.cart')}</h3>
          <button className="cart-drawer-close" onClick={onClose}>×</button>
        </div>
        <div className="cart-drawer-body">
          {items.length === 0 ? (
            <p className="cart-drawer-empty">{t('ecommerce.empty_cart')}</p>
          ) : (
            items.map((item) => (
              <div key={item._id} className="cart-drawer-item">
                <div className="cart-item-info">
                  <h4>{item.nome}</h4>
                  <span className="cart-item-price">€{(item.prezzo * item.quantita).toFixed(2)}</span>
                </div>
                <div className="cart-item-actions">
                  <button onClick={() => updateQuantity(item._id, item.quantita - 1)}>−</button>
                  <span>{item.quantita}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantita + 1)}>+</button>
                  <button className="cart-item-remove" onClick={() => removeItem(item._id)}>{t('ecommerce.remove')}</button>
                </div>
              </div>
            ))
          )}
        </div>
        {items.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-drawer-total">
              <span>{t('ecommerce.total')}</span>
              <strong>€{total.toFixed(2)}</strong>
            </div>
            {pathname === '/checkout' ? (
              <button className="btn btn-primary btn-full" onClick={onClose}>{t('common.back')}</button>
            ) : (
              <Link href="/checkout" className="btn btn-primary btn-full" onClick={onClose}>
                {t('ecommerce.checkout')}
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  )
}
