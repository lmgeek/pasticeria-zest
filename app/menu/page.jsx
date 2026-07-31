'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { api } from '@/lib/api'
import ProductCard from '@/components/ProductCard'

export default function MenuEcommerce() {
  const { t } = useTranslation()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCat, setActiveCat] = useState('all')
  const [sort, setSort] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [p, c] = await Promise.all([
          api.get('/products', { params: { attivo: true } }),
          api.get('/categories', { params: { attivo: true } }),
        ])
        setProducts(p.data)
        setCategories(c.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = products
    .filter((p) => activeCat === 'all' || p.categoria?._id === activeCat || p.categoria === activeCat)
    .sort((a, b) => {
      if (sort === 'prezzo') return a.prezzo - b.prezzo
      if (sort === '-prezzo') return b.prezzo - a.prezzo
      if (sort === 'nome') return a.nome.localeCompare(b.nome)
      return 0
    })

  return (
    <div className="ecommerce-page">
      <div className="ecommerce-hero">
        <div className="container">
          <h1 className="ecommerce-title">{t('ecommerce.title')}</h1>
        </div>
      </div>
      <div className="container ecommerce-content">
        <div className="ecommerce-toolbar">
          <div className="ecommerce-categories">
            <button className={`ecommerce-cat-btn${activeCat === 'all' ? ' active' : ''}`} onClick={() => setActiveCat('all')}>Tutti</button>
            {categories.map((cat) => (
              <button key={cat._id} className={`ecommerce-cat-btn${activeCat === cat._id ? ' active' : ''}`} onClick={() => setActiveCat(cat._id)}>
                {cat.nome}
              </button>
            ))}
          </div>
          <select className="ecommerce-sort" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">Ordina per</option>
            <option value="nome">Nome A-Z</option>
            <option value="prezzo">Prezzo crescente</option>
            <option value="-prezzo">Prezzo decrescente</option>
          </select>
        </div>
        {loading ? (
          <p className="ecommerce-loading">{t('admin.loading')}</p>
        ) : filtered.length === 0 ? (
          <p className="ecommerce-empty">{t('admin.no_results')}</p>
        ) : (
          <div className="ecommerce-grid">
            {filtered.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
