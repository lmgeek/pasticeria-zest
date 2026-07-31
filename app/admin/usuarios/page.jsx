'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { api } from '@/lib/api'
import DataTable from '@/components/admin/DataTable'
import ModalForm from '@/components/admin/ModalForm'
import FormField from '@/components/admin/FormField'

export default function Usuarios() {
  const { t } = useTranslation()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ nome: '', ruolo: 'staff', attivo: true })
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    try { const { data } = await api.get('/users'); setUsers(data) }
    catch (err) { console.error(err) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const openEdit = (user) => { setEditing(user); setForm({ nome: user.nome, ruolo: user.ruolo, attivo: user.attivo }); setModalOpen(true) }

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.put(`/users/${editing._id}`, form)
      setModalOpen(false); setLoading(true); await load()
    } catch (err) { console.error(err) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm(t('admin.confirm_delete'))) return
    try { await api.delete(`/users/${id}`); await load() }
    catch (err) { console.error(err) }
  }

  const columns = [
    { key: 'nome', label: 'Nome' },
    { key: 'email', label: 'Email' },
    { key: 'ruolo', label: 'Ruolo', render: (val) => t(`admin.role_${val}`) },
    { key: 'attivo', label: t('admin.active'), render: (val) => (val ? '✓' : '✗') },
  ]

  return (
    <div>
      <div style={{ marginBottom: 24 }}><h1>{t('admin.users')}</h1></div>
      <DataTable columns={columns} data={users} searchKey="nome" loading={loading} onRowClick={openEdit}
        actions={(row) => <button className="btn btn-small btn-outline" onClick={() => handleDelete(row._id)}>{t('admin.delete')}</button>}
      />
      <ModalForm isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Modifica Utente" onSubmit={handleSave} loading={saving}>
        <FormField label="Nome" name="nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
        <FormField label="Ruolo" name="ruolo" type="select" value={form.ruolo} onChange={(e) => setForm({ ...form, ruolo: e.target.value })} options={[{ value: 'admin', label: 'Admin' }, { value: 'staff', label: 'Staff' }, { value: 'cliente', label: 'Cliente' }]} />
        <FormField label={t('admin.active')} name="attivo" type="switch" value={form.attivo} onChange={(e) => setForm({ ...form, attivo: e.target.checked })} />
      </ModalForm>
    </div>
  )
}
