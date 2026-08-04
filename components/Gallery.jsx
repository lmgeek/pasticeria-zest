'use client'

import { useState, useEffect } from 'react'
import { useTranslation, Trans } from 'react-i18next'

const GALLERY_ITEMS = [
  { id: 1, img: '/assets/gallery-torte.jpg', title: 'Torte Artigianali', span: 'gallery-item--1' },
  { id: 2, img: '/assets/gallery-panettone.jpg', title: 'Panettoni', span: 'gallery-item--2' },
  { id: 3, img: '/assets/gallery-colomba.jpg', title: 'Colombe', span: 'gallery-item--3' },
  { id: 4, img: '/assets/gallery-cornetti.jpg', title: 'Cornetti', span: 'gallery-item--4' },
  { id: 5, img: '/assets/gallery-veneziane.jpg', title: 'Veneziane', span: 'gallery-item--5' },
  { id: 6, img: '/assets/gallery-biscotti.jpg', title: 'Biscotti', span: 'gallery-item--6' },
  { id: 7, img: '/assets/gallery-pasticcini.jpg', title: 'Pasticcini', span: 'gallery-item--7' },
  { id: 8, img: '/assets/gallery-pizza.jpg', title: 'Pizza', span: 'gallery-item--8' },
]

export default function Gallery() {
  const { t } = useTranslation()
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    if (!selected) return
    const onKey = (e) => { if (e.key === 'Escape') setSelected(null) }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [selected])

  return (
    <div className="gallery">
      <div className="section-header">
        <span className="section-label">{t('gallery.label')}</span>
        <h2 className="section-title"><Trans i18nKey="gallery.title" components={{ italic: <span className="italic" /> }} /></h2>
      </div>
      <div className="gallery-grid">
        {GALLERY_ITEMS.map((item) => (
          <div key={item.id} className={`gallery-card ${item.span}`} onClick={() => setSelected(item)} role="button" aria-label={item.title}>
            <div className="gallery-card-bg" style={{ backgroundImage: `url(${item.img})` }} />
            <div className="gallery-card-content">
              <h3>{item.title}</h3>
            </div>
          </div>
        ))}
      </div>
      {selected && (
        <div className="gallery-lightbox" onClick={() => setSelected(null)}>
          <button className="gallery-lightbox-close" onClick={() => setSelected(null)} aria-label="Close">×</button>
          <img src={selected.img} alt={selected.title} className="gallery-lightbox-img" />
          <div className="gallery-lightbox-caption">
            <h3>{selected.title}</h3>
          </div>
        </div>
      )}
    </div>
  )
}
