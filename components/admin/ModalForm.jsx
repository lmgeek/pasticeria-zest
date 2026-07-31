'use client'

import { useTranslation } from 'react-i18next'

export default function ModalForm({ isOpen, onClose, title, children, onSubmit, loading, submitLabel }) {
  const { t } = useTranslation()

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit?.(e) }}>
          <div className="modal-body">{children}</div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary btn-small" onClick={onClose}>{t('admin.cancel')}</button>
            <button type="submit" className="btn btn-primary btn-small" disabled={loading}>
              {loading ? t('admin.loading') : submitLabel || t('admin.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
