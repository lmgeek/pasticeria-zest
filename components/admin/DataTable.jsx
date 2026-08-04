'use client'

import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function DataTable({ columns, data, searchKey, onSearch, loading, onRowClick, actions }) {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const perPage = 10

  const handleSearch = (val) => {
    setSearch(val)
    setPage(1)
    if (onSearch) onSearch(val)
  }

  const filtered = useMemo(() => {
    if (!search || !searchKey) return data
    return data.filter((row) => {
      const val = row[searchKey]
      return val && val.toString().toLowerCase().includes(search.toLowerCase())
    })
  }, [data, search, searchKey])

  const totalPages = Math.ceil(filtered.length / perPage)
  const paged = filtered.slice((page - 1) * perPage, page * perPage)

  return (
    <div className="datatable">
      {searchKey && (
        <div className="datatable-toolbar">
          <input type="text" className="datatable-search" placeholder={t('admin.search')} value={search} onChange={(e) => handleSearch(e.target.value)} />
        </div>
      )}
      <div className="datatable-table-wrapper">
        <table className="datatable-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} style={col.width ? { width: col.width } : undefined}>{col.label}</th>
              ))}
              {actions && <th style={{ width: 180 }}></th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={columns.length + (actions ? 1 : 0)} className="datatable-empty">{t('admin.loading')}</td></tr>
            ) : paged.length === 0 ? (
              <tr><td colSpan={columns.length + (actions ? 1 : 0)} className="datatable-empty">{t('admin.no_results')}</td></tr>
            ) : (
              paged.map((row, i) => (
                <tr key={row._id || i} onClick={() => onRowClick?.(row)} className={onRowClick ? 'clickable' : ''}>
                  {columns.map((col) => (
                    <td key={col.key}>{col.render ? col.render(row[col.key], row) : row[col.key]}</td>
                  ))}
                  {actions && <td className="datatable-actions" onClick={(e) => e.stopPropagation()}>{actions(row)}</td>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="datatable-pagination">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>‹</button>
          <span>{page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>›</button>
        </div>
      )}
    </div>
  )
}
