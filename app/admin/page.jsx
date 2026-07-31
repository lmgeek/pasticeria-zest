'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { api } from '@/lib/api'

export default function Dashboard() {
  const { t } = useTranslation()
  const [stats, setStats] = useState({ products: 0, categories: 0, clients: 0, sales: 0, revenue: 0 })
  const [recentSales, setRecentSales] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [products, categories, clients, sales] = await Promise.all([
          api.get('/products'), api.get('/categories'), api.get('/clients'), api.get('/sales'),
        ])
        const allSales = sales.data
        setStats({
          products: products.data.length, categories: categories.data.length,
          clients: clients.data.length, sales: allSales.length,
          revenue: allSales.reduce((sum, s) => sum + (s.stato === 'pagato' ? s.totale : 0), 0),
        })
        setRecentSales(allSales.slice(0, 5))
      } catch (err) {
        console.error('Dashboard load error:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const cards = [
    { label: t('admin.products'), value: stats.products, color: '#1c4c72' },
    { label: t('admin.categories'), value: stats.categories, color: '#ac9458' },
    { label: t('admin.clients'), value: stats.clients, color: '#2d6a9a' },
    { label: t('admin.sales'), value: stats.sales, color: '#c4956a' },
  ]

  return (
    <div className="dashboard">
      <h1>{t('admin.dashboard')}</h1>
      <div className="dashboard-cards">
        {cards.map((c) => (
          <div key={c.label} className="dashboard-card" style={{ borderTopColor: c.color }}>
            <span className="dashboard-card-value">{loading ? '...' : c.value}</span>
            <span className="dashboard-card-label">{c.label}</span>
          </div>
        ))}
        <div className="dashboard-card" style={{ borderTopColor: '#c94c4c' }}>
          <span className="dashboard-card-value">{loading ? '...' : `€${stats.revenue.toFixed(2)}`}</span>
          <span className="dashboard-card-label">Ricavi</span>
        </div>
      </div>
      <div className="dashboard-section">
        <h2 className="dashboard-section-title">Vendite Recenti</h2>
        {loading ? (
          <p className="dashboard-loading">{t('admin.loading')}</p>
        ) : recentSales.length === 0 ? (
          <p className="dashboard-empty">{t('admin.no_results')}</p>
        ) : (
          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead><tr><th>ID</th><th>Totale</th><th>Stato</th><th>Data</th></tr></thead>
              <tbody>
                {recentSales.map((s) => (
                  <tr key={s._id}>
                    <td className="dashboard-id">#{s._id.slice(-6)}</td>
                    <td>€{s.totale.toFixed(2)}</td>
                    <td><span className={`dashboard-status status-${s.stato}`}>{t(`admin.status_${s.stato}`)}</span></td>
                    <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
