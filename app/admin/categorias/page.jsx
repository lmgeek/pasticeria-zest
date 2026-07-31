'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { api } from '@/lib/api'
import DataTable from '@/components/admin/DataTable'
import ModalForm from '@/components/admin/ModalForm'
import FormField from '@/components/admin/FormField'

export default function Categorias() {
  const { t } = useTranslation()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ nome: '', slug: '', descrizione: '', ordine: 0, attivo: true })
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    try { const { data } = await api.get('/categories'); setCategories(data) }
    catch (err) { console.error(err) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setEditing(null); setForm({ nome: '', slug: '', descrizione: '', ordine: 0, attivo: true }); setModalOpen(true) }
  const openEdit = (cat) => { setEditing(cat); setForm({ nome: cat.nome, slug: cat.slug, descrizione: cat.descrizione || '', ordine: cat.ordine, attivo: cat.attivo }); setModalOpen(true) }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = { ...form, ordine: parseInt(form.ordine) || 0 }
      if (editing) await api.put(`/categories/${editing._id}`, payload)
      else await api.post('/categories', payload)
      setModalOpen(false); setLoading(true); await load()
    } catch (err) { console.error(err) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm(t('admin.confirm_delete'))) return
    try { await api.delete(`/categories/${id}`); await load() }
    catch (err) { console.error(err) }
  }

  const columns = [
    { key: 'nome', label: t('admin.categories') },
    { key: 'slug', label: 'Slug' },
    { key: 'ordine', label: 'Ordine' },
    { key: 'attivo', label: t('admin.active'), render: (val) => (val ? '✓' : '✗') },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>{t('admin.categories')}</h1>
        <button className="btn btn-primary btn-small" onClick={openCreate}>{t('admin.create')}</button>
      </div>
      <DataTable columns={columns} data={categories} searchKey="nome" loading={loading} onRowClick={openEdit}
        actions={(row) => <button className="btn btn-small btn-outline" onClick={() => handleDelete(row._id)}>{t('admin.delete')}</button>}
      />
      <ModalForm isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifica Categoria' : 'Nuova Categoria'} onSubmit={handleSave} loading={saving}>
        <FormField label="Nome" name="nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
        <FormField label="Slug" name="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="Lasciare vuoto per auto-generare" />
        <FormField label="Descrizione" name="descrizione" type="textarea" value={form.descrizione} onChange={(e) => setForm({ ...form, descrizione: e.target.value })} />
        <FormField label="Ordine" name="ordine" type="number" value={form.ordine} onChange={(e) => setForm({ ...form, ordine: e.target.value })} />
        <FormField label={t('admin.active')} name="attivo" type="switch" value={form.attivo} onChange={(e) => setForm({ ...form, attivo: e.target.checked })} />
      </ModalForm>
    </div>
  )
}
