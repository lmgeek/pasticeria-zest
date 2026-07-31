'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'

const NAV_ITEMS = [
  { href: '/admin', labelKey: 'dashboard', icon: '📊' },
  { href: '/admin/productos', labelKey: 'products', icon: '🍰' },
  { href: '/admin/categorias', labelKey: 'categories', icon: '📁' },
  { href: '/admin/clientes', labelKey: 'clients', icon: '👥' },
  { href: '/admin/ventas', labelKey: 'sales', icon: '💰' },
  { href: '/admin/usuarios', labelKey: 'users', icon: '🔑' },
  { href: '/admin/configuracion', labelKey: 'config', icon: '⚙️' },
]

export default function AdminLayout({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    api.get('/auth/me').then(({ data }) => {
      setUser(data)
      if (data.ruolo !== 'admin' && data.ruolo !== 'staff') {
        router.push('/')
      }
    }).catch(() => {
      localStorage.removeItem('token')
      router.push('/login')
    }).finally(() => setLoading(false))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  if (loading) return <div className="page-loading">Caricamento...</div>
  if (!user) return null

  const currentPage = NAV_ITEMS.find((i) => i.href === pathname)

  return (
    <div className="admin-layout">
      {sidebarOpen && <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />}
      <aside className={`admin-sidebar${sidebarOpen ? ' open' : ' collapsed'}`}>
        <div className="admin-sidebar-header">
          <img src="/logo.png" alt="Zest" className="admin-logo" />
          <span className="admin-sidebar-title">Admin</span>
          <button className="admin-sidebar-collapse" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? '‹' : '›'}
          </button>
        </div>
        <nav className="admin-sidebar-nav" onClick={() => !sidebarOpen && setSidebarOpen(true)}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-sidebar-link${pathname === item.href ? ' active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span>{item.icon}</span>
              <span>{item.labelKey.charAt(0).toUpperCase() + item.labelKey.slice(1)}</span>
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <Link href="/" className="admin-sidebar-link">← Torna al sito</Link>
          <button onClick={handleLogout} className="admin-sidebar-link admin-logout">Esci</button>
        </div>
      </aside>
      <div className="admin-main">
        <div className="admin-topbar">
          <div className="admin-topbar-left">
            <button className="admin-topbar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <span className="admin-topbar-title">{currentPage?.labelKey || 'Admin'}</span>
          </div>
        </div>
        <div className="admin-content">{children}</div>
      </div>
    </div>
  )
}
