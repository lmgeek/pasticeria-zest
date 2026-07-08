import React from 'react'

const GALLERY = [
  { cls: 'gallery-item--1', img: '/assets/gallery-cornetti.jpg', title: 'Cornetti', desc: 'Sfogliatura perfetta' },
  { cls: 'gallery-item--2', img: '/assets/gallery-panettone.jpg', title: 'Panettoni', desc: 'Lievitazione naturale' },
  { cls: 'gallery-item--3', img: '/assets/gallery-pasticcini.jpg', title: 'Pasticcini', desc: 'Eleganza in miniatura' },
  { cls: 'gallery-item--4', img: '/assets/gallery-veneziane.jpg', title: 'Veneziane', desc: 'Morbidezza unica' },
  { cls: 'gallery-item--5', img: '/assets/gallery-torte.jpg', title: 'Torte', desc: 'Creatività senza limiti' },
  { cls: 'gallery-item--6', img: '/assets/gallery-pizza.jpg', title: 'Pizza', desc: 'Croccante e leggera' },
  { cls: 'gallery-item--7', img: '/assets/gallery-colomba.jpg', title: 'Colombe', desc: 'Pasqua artigianale' },
  { cls: 'gallery-item--8', img: '/assets/gallery-biscotti.jpg', title: 'Biscotteria', desc: 'Piccoli tesori' },
]

export default function Gallery() {
  return (
    <div className="gallery">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Galleria</span>
          <h2 className="section-title">I nostri <span className="italic">capolavori</span></h2>
        </div>
      </div>
      <div className="gallery-grid">
        {GALLERY.map((g, i) => (
          <div key={i} className={`gallery-item ${g.cls}`}>
            <div className="gallery-card">
              <div className="gallery-card-bg" style={{ backgroundImage: `url(${g.img})` }} />
              <div className="gallery-card-content">
                <h3>{g.title}</h3>
                <span>{g.desc}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
