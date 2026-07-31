'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { api } from '@/lib/api'
import DataTable from '@/components/admin/DataTable'
import ModalForm from '@/components/admin/ModalForm'
import FormField from '@/components/admin/FormField'

export default function Clientes() {
  const { t } = useTranslation()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [detail, setDetail] = useState(null)
  const [form, setForm] = useState({ nome: '', email: '', telefono: '', indirizzo: '', note: '' })
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    try { const { data } = await api.get('/clients'); setClients(data) }
    catch (err) { console.error(err) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setEditing(null); setForm({ nome: '', email: '', telefono: '', indirizzo: '', note: '' }); setModalOpen(true) }
  const openEdit = (client) => { setEditing(client); setForm({ nome: client.nome, email: client.email || '', telefono: client.telefono || '', indirizzo: client.indirizzo || '', note: client.note || '' }); setModalOpen(true) }

  const openDetail = async (client) => {
    try { const { data } = await api.get(`/clients/${client._id}`); setDetail(data) }
    catch (err) { console.error(err) }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editing) await api.put(`/clients/${editing._id}`, form)
      else await api.post('/clients', form)
      setModalOpen(false); setLoading(true); await load()
    } catch (err) { console.error(err) }
    finally { setSaving(false) }
  }

  const columns = [
    { key: 'nome', label: t('admin.clients') },
    { key: 'email', label: 'Email' },
    { key: 'telefono', label: 'Telefono' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>{t('admin.clients')}</h1>
        <button className="btn btn-primary btn-small" onClick={openCreate}>{t('admin.create')}</button>
      </div>
      <DataTable columns={columns} data={clients} searchKey="nome" loading={loading} onRowClick={openDetail} />
      <ModalForm isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifica Cliente' : 'Nuovo Cliente'} onSubmit={handleSave} loading={saving}>
        <FormField label="Nome" name="nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
        <FormField label="Email" name="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <FormField label="Telefono" name="telefono" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
        <FormField label="Indirizzo" name="indirizzo" value={form.indirizzo} onChange={(e) => setForm({ ...form, indirizzo: e.target.value })} />
        <FormField label="Note" name="note" type="textarea" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
      </ModalForm>
      {detail && (
        <div className="modal-overlay" onClick={() => setDetail(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div className="modal-header">
              <h3 className="modal-title">{detail.client.nome}</h3>
              <button className="modal-close" onClick={() => setDetail(null)}>×</button>
            </div>
            <div className="modal-body">
              <p><strong>Email:</strong> {detail.client.email || '-'}</p>
              <p><strong>Telefono:</strong> {detail.client.telefono || '-'}</p>
              <p><strong>Indirizzo:</strong> {detail.client.indirizzo || '-'}</p>
              {detail.client.note && <p><strong>Note:</strong> {detail.client.note}</p>}
              <div className="client-sales-history">
                <h4 style={{ fontSize: '0.9rem', marginBottom: 8 }}>Vendite</h4>
                {detail.sales.length === 0 ? (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Nessuna vendita</p>
                ) : (
                  detail.sales.map((s) => (
                    <div key={s._id} className="client-sale-item">
                      <span>#{s._id.slice(-6)} — €{s.totale.toFixed(2)}</span>
                      <span className={`dashboard-status status-${s.stato}`}>{s.stato}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary btn-small" onClick={() => { setDetail(null); openEdit(detail.client) }}>{t('admin.edit')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
