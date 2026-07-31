'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { api } from '@/lib/api'
import DataTable from '@/components/admin/DataTable'

const STATUS_FILTERS = ['tutti', 'pendente', 'pagato', 'cancellato']

export default function Ventas() {
  const { t } = useTranslation()
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('tutti')
  const [detail, setDetail] = useState(null)
  const [resendLoading, setResendLoading] = useState(null)
  const [toast, setToast] = useState('')

  const load = useCallback(async () => {
    try {
      const params = statusFilter !== 'tutti' ? { stato: statusFilter } : {}
      const { data } = await api.get('/sales', { params })
      setSales(data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }, [statusFilter])

  useEffect(() => { load() }, [load])

  const openDetail = async (sale) => {
    try { const { data } = await api.get(`/sales/${sale._id}`); setDetail(data) }
    catch (err) { console.error(err) }
  }

  const changeStatus = async (id, stato) => {
    try {
      await api.put(`/sales/${id}`, { stato })
      setDetail(null); setLoading(true); await load()
    } catch (err) { console.error(err) }
  }

  const resendInvoice = async (sale) => {
    setResendLoading(sale._id)
    try {
      const { data } = await api.post('/admin/email-resend', { saleId: sale._id })
      setToast(data.message || 'Email enviado')
      setTimeout(() => setToast(''), 4000)
    } catch (err) {
      setToast(err.response?.data?.message || 'Error al reenviar')
      setTimeout(() => setToast(''), 4000)
    } finally {
      setResendLoading(null)
    }
  }

  const columns = [
    { key: '_id', label: 'ID', render: (val) => <span className="dashboard-id">#{val.slice(-6)}</span> },
    { key: 'cliente', label: t('admin.clients'), render: (val) => val?.nome || '-' },
    { key: 'totale', label: 'Totale', render: (val) => `€${val?.toFixed(2)}` },
    { key: 'stato', label: 'Stato', render: (val) => <span className={`dashboard-status status-${val}`}>{t(`admin.status_${val}`)}</span> },
    { key: 'createdAt', label: 'Data', render: (val) => new Date(val).toLocaleDateString() },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>{t('admin.sales')}</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          {STATUS_FILTERS.map((f) => (
            <button key={f} className={`btn btn-small ${statusFilter === f ? 'btn-primary' : 'btn-outline'}`} onClick={() => { setStatusFilter(f); setLoading(true) }}>
              {f === 'tutti' ? 'Tutti' : t(`admin.status_${f}`)}
            </button>
          ))}
        </div>
      </div>
      {toast && (
        <div className="config-toast" style={{ marginBottom: 16 }}>
          <span>{toast}</span>
          <button onClick={() => setToast('')}>×</button>
        </div>
      )}
      <DataTable columns={columns} data={sales} loading={loading} searchKey={null} onRowClick={openDetail} />
      {detail && (
        <div className="modal-overlay" onClick={() => setDetail(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div className="modal-header">
              <h3 className="modal-title">Dettaglio Vendita #{detail._id.slice(-6)}</h3>
              <button className="modal-close" onClick={() => setDetail(null)}>×</button>
            </div>
            <div className="modal-body">
              <p><strong>Cliente:</strong> {detail.cliente?.nome || '-'}</p>
              <p><strong>Email:</strong> {detail.cliente?.email || '-'}</p>
              <p><strong>Totale:</strong> €{detail.totale?.toFixed(2)}</p>
              <p><strong>Stato:</strong> <span className={`dashboard-status status-${detail.stato}`}>{t(`admin.status_${detail.stato}`)}</span></p>
              <p><strong>Stripe ID:</strong> <code>{detail.stripePaymentIntentId || '-'}</code></p>
              <div style={{ marginTop: 16 }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: 8 }}>Articoli</h4>
                {detail.items?.map((item) => (
                  <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--warm-beige)', fontSize: '0.85rem' }}>
                    <span>{item.nome} × {item.quantita}</span>
                    <span>€{item.subtotale?.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              {detail.stato === 'pendente' && (
                <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                  <button className="btn btn-small btn-primary" onClick={() => changeStatus(detail._id, 'pagato')}>Segna Pagato</button>
                  <button className="btn btn-small btn-outline" onClick={() => changeStatus(detail._id, 'cancellato')}>Annulla</button>
                </div>
              )}
              {detail.cliente?.email && (
                <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                  <button className="btn btn-small" onClick={() => resendInvoice(detail)} disabled={resendLoading === detail._id}>
                    {resendLoading === detail._id ? 'Inviando...' : 'Reenviar Factura'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
