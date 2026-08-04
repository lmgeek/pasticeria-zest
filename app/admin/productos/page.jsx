'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { api } from '@/lib/api'
import DataTable from '@/components/admin/DataTable'
import ModalForm from '@/components/admin/ModalForm'
import FormField from '@/components/admin/FormField'
import FileUpload from '@/components/FileUpload'

export default function Productos() {
  const { t } = useTranslation()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ nome: '', prezzo: '', categoria: '', descrizione: '', immagine: '', attivo: true, disponibile: true })
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    try {
      const [p, c] = await Promise.all([api.get('/products'), api.get('/categories')])
      setProducts(p.data)
      setCategories(c.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const openCreate = () => {
    setEditing(null)
    setForm({ nome: '', prezzo: '', categoria: '', descrizione: '', immagine: '', attivo: true, disponibile: true })
    setModalOpen(true)
  }

  const openEdit = (product) => {
    setEditing(product)
    setForm({
      nome: product.nome, prezzo: product.prezzo, categoria: product.categoria?._id || product.categoria,
      descrizione: product.descrizione || '', immagine: product.immagine || '',
      attivo: product.attivo, disponibile: product.disponibile,
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = { ...form, prezzo: parseFloat(form.prezzo) }
      if (editing) await api.put(`/products/${editing._id}`, payload)
      else await api.post('/products', payload)
      setModalOpen(false)
      setLoading(true)
      await load()
    } catch (err) { console.error(err) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm(t('admin.confirm_delete'))) return
    try { await api.delete(`/products/${id}`); await load() }
    catch (err) { console.error(err) }
  }

  const columns = [
    { key: 'nome', label: t('admin.products') },
    { key: 'categoria', label: t('admin.categories'), render: (val) => val?.nome || '-' },
    { key: 'prezzo', label: 'Prezzo', render: (val) => `€${val?.toFixed(2)}` },
    { key: 'attivo', label: t('admin.active'), render: (val) => (val ? '✓' : '✗') },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>{t('admin.products')}</h1>
        <button className="btn btn-primary btn-small" onClick={openCreate}>{t('admin.create')}</button>
      </div>
      <DataTable columns={columns} data={products} searchKey="nome" loading={loading} onRowClick={openEdit}
        actions={(row) => (
          <div className="datatable-action-btns">
            <button className="btn btn-small btn-outline" onClick={() => openEdit(row)}>{t('admin.edit')}</button>
            <button className="btn btn-small btn-outline btn-danger" onClick={() => handleDelete(row._id)}>{t('admin.delete')}</button>
          </div>
        )}
      />
      <ModalForm isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifica Prodotto' : 'Nuovo Prodotto'} onSubmit={handleSave} loading={saving}>
        <FormField label="Nome" name="nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
        <FormField label="Prezzo (€)" name="prezzo" type="number" value={form.prezzo} onChange={(e) => setForm({ ...form, prezzo: e.target.value })} required />
        <FormField label="Categoria" name="categoria" type="select" value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} options={categories.map((c) => ({ value: c._id, label: c.nome }))} />
        <FormField label="Descrizione" name="descrizione" type="textarea" value={form.descrizione} onChange={(e) => setForm({ ...form, descrizione: e.target.value })} />
        <FileUpload value={form.immagine} onChange={(val) => setForm({ ...form, immagine: val })} />
        <FormField label={t('admin.active')} name="attivo" type="switch" value={form.attivo} onChange={(e) => setForm({ ...form, attivo: e.target.checked })} />
        <FormField label="Disponibile" name="disponibile" type="switch" value={form.disponibile} onChange={(e) => setForm({ ...form, disponibile: e.target.checked })} />
      </ModalForm>
    </div>
  )
}
