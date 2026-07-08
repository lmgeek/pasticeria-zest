import React, { useRef, useState, useCallback, useEffect } from 'react'
import SendModal from './SendModal'
import './CakeDesigner.css'

if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    if (r > w / 2) r = w / 2
    if (r > h / 2) r = h / 2
    this.moveTo(x + r, y)
    this.arcTo(x + w, y, x + w, y + h, r)
    this.arcTo(x + w, y + h, x, y + h, r)
    this.arcTo(x, y + h, x, y, r)
    this.arcTo(x, y, x + w, y, r)
    return this
  }
}

const SHAPES = ['round', 'square', 'heart', 'oval', 'hexagon']
const SIZES = ['small', 'medium', 'large', 'xlarge']
const TIERS = [1, 2, 3]
const COLORS = [
  '#F5E6CC','#D4A853','#E8A87C','#8B5E3C','#7A8B6E','#C94C4C',
  '#6B3A5A','#2C1810','#F0C4A0','#A8C0A0','#B8A0C0','#E8C4A0',
  '#F5D0D0','#C0D4E8','#D4DDCB','#F0E0C0'
]
const DECOS = [
  { id: 'cream', label: '🥄 Glassa' }, { id: 'cherry', label: '🍒 Ciliegie' },
  { id: 'berry', label: '🫐 Frutti Bosco' }, { id: 'chocolate', label: '🍫 Scaglie' },
  { id: 'flowers', label: '🌸 Fiori' }, { id: 'sprinkles', label: '✨ Codette' },
  { id: 'gold', label: '✨ Oro' }, { id: 'macaron', label: '🟣 Macarons' },
  { id: 'candle', label: '🕯️ Candeline' }, { id: 'meringue', label: '🍬 Meringhe' },
  { id: 'nuts', label: '🥜 Frutta Secca' }, { id: 'lemon', label: '🍋 Limone' },
]
const FONTS = ['Playfair Display', 'Dancing Script', 'DM Sans', 'Georgia', 'Courier New']
const PATTERNS = [
  { id: 'none', label: 'Nessuno' }, { id: 'dots', label: 'Puntini' },
  { id: 'stripes', label: 'Strisce' }, { id: 'waves', label: 'Onde' },
]

export default function CakeDesigner() {
  const canvasRef = useRef(null)
  const [shape, setShape] = useState('round')
  const [size, setSize] = useState('medium')
  const [tiers, setTiers] = useState(1)
  const [color, setColor] = useState('#F5E6CC')
  const [pattern, setPattern] = useState('none')
  const [decos, setDecos] = useState([])
  const [texts, setTexts] = useState([])
  const [images, setImages] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [history, setHistory] = useState([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const [zoom, setZoom] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [nextText, setNextText] = useState({ text: '', color: '#2C1810', font: 'Playfair Display', size: 28 })
  const dragRef = useRef(null)
  const fileRef = useRef(null)

  const getSize = useCallback(() => {
    const map = { small: 100, medium: 160, xlarge: 240 }
    return map[size] || 160
  }, [size])

  const pushHistory = useCallback((decosNew, textsNew, imagesNew) => {
    const state = { decos: [...(decosNew || decos)], texts: [...(textsNew || texts)], images: [...(imagesNew || images)] }
    setHistory(prev => [...prev.slice(0, historyIdx + 1), state])
    setHistoryIdx(prev => prev + 1)
  }, [decos, texts, images, historyIdx])

  const undo = () => {
    if (historyIdx <= 0) return
    const prev = history[historyIdx - 1]
    setDecos(prev.decos)
    setTexts(prev.texts)
    setImages(prev.images)
    setHistoryIdx(i => i - 1)
  }
  const redo = () => {
    if (historyIdx >= history.length - 1) return
    const next = history[historyIdx + 1]
    setDecos(next.decos)
    setTexts(next.texts)
    setImages(next.images)
    setHistoryIdx(i => i + 1)
  }

  const addDeco = (type) => {
    const s = getSize()
    const cx = 250 + (Math.random() - 0.5) * s * 0.8
    const cy = 250 + (Math.random() - 0.5) * s * 0.6
    const newDecos = [...decos, { id: Date.now(), type, x: cx, y: cy }]
    setDecos(newDecos)
    pushHistory(newDecos, texts, images)
  }

  const addText = () => {
    if (!nextText.text.trim()) return
    const newTexts = [...texts, { ...nextText, id: Date.now(), x: 250, y: 260 + texts.length * 45 }]
    setTexts(newTexts)
    setNextText(s => ({ ...s, text: '' }))
    pushHistory(decos, newTexts, images)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        const newImages = [...images, { id: Date.now(), img, x: 200, y: 200, w: 80, h: 80 }]
        setImages(newImages)
        pushHistory(decos, texts, newImages)
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
  }

  const clearAll = () => {
    setDecos([])
    setTexts([])
    setImages([])
    setHistory([])
    setHistoryIdx(-1)
  }

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const mx = (e.clientX - rect.left) * (500 / rect.width)
    const my = (e.clientY - rect.top) * (500 / rect.height)
    if (e.shiftKey) {
      const newDecos = decos.filter(d => Math.abs(d.x - mx) >= 20 || Math.abs(d.y - my) >= 20)
      const newTexts = texts.filter(t => Math.abs(t.x - mx) >= 40 || Math.abs(t.y - my) >= 25)
      setDecos(newDecos)
      setTexts(newTexts)
      pushHistory(newDecos, newTexts, images)
      return
    }
    setSelectedId(null)
    for (const d of decos) { if (Math.abs(d.x - mx) < 20 && Math.abs(d.y - my) < 20) { setSelectedId('d' + d.id); return }}
    for (const t of texts) { if (Math.abs(t.x - mx) < 60 && Math.abs(t.y - my) < 25) { setSelectedId('t' + t.id); return }}
    for (const im of images) { if (mx > im.x && mx < im.x + im.w && my > im.y && my < im.y + im.h) { setSelectedId('i' + im.id); return }}
  }

  const startDrag = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const mx = ((e.clientX || (e.touches && e.touches[0].clientX)) - rect.left) * (500 / rect.width)
    const my = ((e.clientY || (e.touches && e.touches[0].clientY)) - rect.top) * (500 / rect.height)
    for (let i = decos.length - 1; i >= 0; i--) {
      if (Math.abs(decos[i].x - mx) < 20 && Math.abs(decos[i].y - my) < 20) {
        dragRef.current = { type: 'deco', idx: i, ox: decos[i].x - mx, oy: decos[i].y - my }
        return
      }
    }
    for (let i = texts.length - 1; i >= 0; i--) {
      if (Math.abs(texts[i].x - mx) < 60 && Math.abs(texts[i].y - my) < 25) {
        dragRef.current = { type: 'text', idx: i, ox: texts[i].x - mx, oy: texts[i].y - my }
        return
      }
    }
    for (let i = images.length - 1; i >= 0; i--) {
      const im = images[i]
      if (mx > im.x && mx < im.x + im.w && my > im.y && my < im.y + im.h) {
        dragRef.current = { type: 'image', idx: i, ox: im.x - mx, oy: im.y - my }
        return
      }
    }
  }

  const doDrag = (e) => {
    if (!dragRef.current) return
    e.preventDefault()
    const rect = canvasRef.current.getBoundingClientRect()
    const mx = ((e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0].clientX)) - rect.left) * (500 / rect.width)
    const my = ((e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0].clientY)) - rect.top) * (500 / rect.height)
    const dr = dragRef.current
    if (dr.type === 'deco') {
      setDecos(prev => { const copy = [...prev]; copy[dr.idx] = { ...copy[dr.idx], x: mx + dr.ox, y: my + dr.oy }; return copy })
    } else if (dr.type === 'text') {
      setTexts(prev => { const copy = [...prev]; copy[dr.idx] = { ...copy[dr.idx], x: mx + dr.ox, y: my + dr.oy }; return copy })
    } else if (dr.type === 'image') {
      setImages(prev => { const copy = [...prev]; copy[dr.idx] = { ...copy[dr.idx], x: mx + dr.ox, y: my + dr.oy }; return copy })
    }
  }

  const endDrag = () => { dragRef.current = null }

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    ctx.clearRect(0, 0, 500, 500)
    ctx.fillStyle = '#FDF8F3'
    ctx.fillRect(0, 0, 500, 500)
    drawCake(ctx, shape, getSize(), tiers, color, pattern, decos, texts, images, selectedId)
  }, [shape, size, tiers, color, pattern, decos, texts, images, selectedId, getSize])

  return (
    <div className="designer">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Crea il tuo Dolce</span>
          <h2 className="section-title">Dai vita alla tua <span className="italic">creatività</span></h2>
          <p className="section-desc">
            Scegli forma, colori e decorazioni per creare il dolce dei tuoi sogni.
            Carica immagini, aggiungi testo, e personalizza ogni dettaglio.
          </p>
        </div>
        <div className="designer-layout">
          <div className="designer-controls">
            {/* Shape */}
            <div className="ctrl-section"><h4>Forma</h4>
              <div className="shape-grid">
                {SHAPES.map(s => (
                  <button key={s} className={`shape-btn${shape === s ? ' active' : ''}`} onClick={() => setShape(s)}>
                    <ShapeIcon type={s} /><span>{s === 'round' ? 'Tonda' : s === 'square' ? 'Quadrata' : s === 'heart' ? 'Cuore' : s === 'oval' ? 'Ovale' : 'Esagonale'}</span>
                  </button>
                ))}
              </div>
            </div>
            {/* Size & Tiers */}
            <div className="ctrl-section"><h4>Dimensione</h4>
              <div className="inline-options">
                {SIZES.map(s => (
                  <button key={s} className={`sm-btn${size === s ? ' active' : ''}`} onClick={() => setSize(s)}>
                    {s === 'small' ? 'Piccolo' : s === 'medium' ? 'Medio' : s === 'large' ? 'Grande' : 'Extra'}
                  </button>
                ))}
              </div>
            </div>
            <div className="ctrl-section"><h4>Piani</h4>
              <div className="inline-options">
                {TIERS.map(t => (
                  <button key={t} className={`sm-btn${tiers === t ? ' active' : ''}`} onClick={() => setTiers(t)}>{t}</button>
                ))}
              </div>
            </div>
            {/* Color */}
            <div className="ctrl-section"><h4>Colore Base</h4>
              <div className="color-grid">
                {COLORS.map(c => (
                  <button key={c} className={`color-btn${color === c ? ' active' : ''}`}
                    style={{ background: c }} onClick={() => setColor(c)} />
                ))}
              </div>
            </div>
            {/* Pattern */}
            <div className="ctrl-section"><h4>Motivo di Fondo</h4>
              <div className="inline-options">
                {PATTERNS.map(p => (
                  <button key={p.id} className={`sm-btn${pattern === p.id ? ' active' : ''}`} onClick={() => setPattern(p.id)}>{p.label}</button>
                ))}
              </div>
            </div>
            {/* Decorations */}
            <div className="ctrl-section"><h4>Decorazioni</h4>
              <div className="deco-grid">
                {DECOS.map(d => (
                  <button key={d.id} className="deco-btn" onClick={() => addDeco(d.id)}>{d.label}</button>
                ))}
              </div>
            </div>
            {/* Image upload */}
            <div className="ctrl-section"><h4>Carica Immagine</h4>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              <button className="btn btn-outline btn-small" onClick={() => fileRef.current.click()}>+ Aggiungi Immagine</button>
            </div>
            {/* Text */}
            <div className="ctrl-section"><h4>Testo</h4>
              <input className="text-input" value={nextText.text} onChange={e => setNextText(s => ({ ...s, text: e.target.value }))}
                placeholder="Scrivi un messaggio..." maxLength={30} />
              <div className="text-options">
                <input type="color" value={nextText.color} onChange={e => setNextText(s => ({ ...s, color: e.target.value }))} />
                <select value={nextText.font} onChange={e => setNextText(s => ({ ...s, font: e.target.value }))}>
                  {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                <select value={nextText.size} onChange={e => setNextText(s => ({ ...s, size: Number(e.target.value) }))}>
                  <option value={20}>Piccolo</option><option value={28}>Medio</option><option value={36}>Grande</option><option value={48}>Maxi</option>
                </select>
              </div>
              <button className="btn btn-small btn-primary" onClick={addText}>Aggiungi Testo</button>
            </div>
            {/* Undo/Redo */}
            <div className="ctrl-undo">
              <button className="btn btn-outline btn-small" onClick={undo} disabled={historyIdx <= 0}>↩ Annulla</button>
              <button className="btn btn-outline btn-small" onClick={redo} disabled={historyIdx >= history.length - 1}>↪ Ripeti</button>
            </div>
            {/* Actions */}
            <div className="ctrl-actions">
              <button className="btn btn-outline btn-small" onClick={clearAll}>Cancella Tutto</button>
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>Invia per Valutazione</button>
            </div>
          </div>
          <div className="designer-canvas-area">
            <div className="canvas-wrap" style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
              <canvas ref={canvasRef} width={500} height={500}
                onClick={handleCanvasClick}
                onMouseDown={startDrag} onMouseMove={doDrag} onMouseUp={endDrag} onMouseLeave={endDrag}
                onTouchStart={startDrag} onTouchMove={doDrag} onTouchEnd={endDrag}
                style={{ cursor: dragRef.current ? 'grabbing' : 'default' }} />
              <div className="canvas-hint">Click: seleziona | Shift+Click: rimuovi | Trascina: sposta</div>
            </div>
            <div className="canvas-zoom">
              <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}>−</button>
              <span>{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(z => Math.min(2, z + 0.1))}>+</button>
            </div>
          </div>
        </div>
      </div>
      {showModal && <SendModal canvasRef={canvasRef} onClose={() => setShowModal(false)} />}
    </div>
  )
}

function ShapeIcon({ type }) {
  const props = { viewBox: '0 0 60 60', width: 28, height: 28, style: { color: 'currentColor' } }
  if (type === 'round') return <svg {...props}><circle cx="30" cy="30" r="22" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
  if (type === 'square') return <svg {...props}><rect x="8" y="12" width="44" height="36" rx="3" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
  if (type === 'heart') return <svg {...props}><path d="M30 48 C30 48 8 34 8 22 C8 14 15 8 22 8 C27 8 30 13 30 13 C30 13 33 8 38 8 C45 8 52 14 52 22 C52 34 30 48 30 48Z" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
  if (type === 'oval') return <svg {...props}><ellipse cx="30" cy="30" rx="26" ry="18" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
  if (type === 'hexagon') return <svg {...props}><polygon points="30,6 50,18 50,42 30,54 10,42 10,18" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
  return null
}

/* ====== Canvas drawing engine ====== */
function drawCake(ctx, shape, baseSize, tiers, color, pattern, decos, texts, images, selectedId) {
  const cx = 250, cy = 250
  const tierH = Math.min(baseSize * 0.6 / tiers + 40, 120)
  const tierW = baseSize + 40

  for (let t = 0; t < tiers; t++) {
    const scale = 1 - t * 0.12
    const yOff = (tiers - 1 - t) * tierH * 0.7 - (tiers - 1) * tierH * 0.35
    const w = tierW * scale
    const h = tierH * scale

    ctx.save()
    ctx.shadowColor = 'rgba(44,24,16,0.1)'
    ctx.shadowBlur = 15
    ctx.shadowOffsetY = 5

    if (shape === 'round' || shape === 'oval') {
      const rx = w / 2
      const ry = shape === 'oval' ? h * 0.5 : h * 0.4
      ctx.beginPath()
      ctx.ellipse(cx, cy + yOff - h * 0.45, rx, ry, 0, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()
      ctx.strokeStyle = darken(color, 12)
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(cx - rx, cy + yOff - h * 0.45)
      ctx.lineTo(cx - rx, cy + yOff + h * 0.4)
      ctx.quadraticCurveTo(cx - rx, cy + yOff + h * 0.5, cx, cy + yOff + h * 0.45)
      ctx.quadraticCurveTo(cx + rx, cy + yOff + h * 0.5, cx + rx, cy + yOff + h * 0.4)
      ctx.lineTo(cx + rx, cy + yOff - h * 0.45)
      ctx.fillStyle = darken(color, 8)
      ctx.fill()
    } else if (shape === 'square') {
      drawRect(ctx, cx, cy + yOff, w, h, color)
    } else if (shape === 'heart') {
      drawHeartShape(ctx, cx, cy + yOff, w * 0.35, color)
    } else if (shape === 'hexagon') {
      drawHexagon(ctx, cx, cy + yOff, w * 0.4, color)
    }
    ctx.restore()

    // Pattern overlay
    if (pattern !== 'none') {
      drawPattern(ctx, cx, cy + yOff, w, h, pattern, shape)
    }
  }

  // Decorations
  decos.forEach(d => {
    ctx.save()
    ctx.translate(d.x, d.y)
    drawDecoration(ctx, d.type)
    if (selectedId === 'd' + d.id) {
      ctx.strokeStyle = '#D4A853'
      ctx.lineWidth = 2
      ctx.setLineDash([3, 3])
      ctx.beginPath()
      ctx.arc(0, 0, 16, 0, Math.PI * 2)
      ctx.stroke()
      ctx.setLineDash([])
    }
    ctx.restore()
  })

  // Texts
  texts.forEach(t => {
    ctx.save()
    ctx.font = `${t.size}px "${t.font}", serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.shadowColor = 'rgba(255,255,255,0.6)'
    ctx.shadowBlur = 4
    ctx.fillStyle = t.color
    ctx.fillText(t.text, t.x, t.y)
    if (selectedId === 't' + t.id) {
      const m = ctx.measureText(t.text)
      ctx.strokeStyle = '#D4A853'
      ctx.lineWidth = 1
      ctx.setLineDash([3, 3])
      ctx.strokeRect(t.x - m.width / 2 - 4, t.y - t.size / 2 - 4, m.width + 8, t.size + 8)
      ctx.setLineDash([])
    }
    ctx.restore()
  })

  // Uploaded images
  images.forEach(im => {
    ctx.save()
    ctx.drawImage(im.img, im.x, im.y, im.w, im.h)
    if (selectedId === 'i' + im.id) {
      ctx.strokeStyle = '#D4A853'
      ctx.lineWidth = 2
      ctx.setLineDash([3, 3])
      ctx.strokeRect(im.x - 2, im.y - 2, im.w + 4, im.h + 4)
      ctx.setLineDash([])
    }
    ctx.restore()
  })
}

function drawRect(ctx, cx, cy, w, h, color) {
  ctx.beginPath()
  ctx.roundRect(cx - w / 2, cy - h / 2, w, h, 6)
  ctx.fillStyle = color
  ctx.fill()
  ctx.strokeStyle = darken(color, 12)
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.fillStyle = darken(color, 15)
  ctx.fillRect(cx - w / 2, cy + h / 2, w, 20)
}

function drawHeartShape(ctx, cx, cy, s, color) {
  ctx.save()
  ctx.translate(cx, cy + s * 0.3)
  ctx.beginPath()
  ctx.moveTo(0, -s * 0.7)
  ctx.bezierCurveTo(-s * 0.35, -s * 1.1, -s * 1.1, -s * 0.4, 0, s * 0.2)
  ctx.moveTo(0, -s * 0.7)
  ctx.bezierCurveTo(s * 0.35, -s * 1.1, s * 1.1, -s * 0.4, 0, s * 0.2)
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()
  ctx.strokeStyle = darken(color, 12)
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.restore()
}

function drawHexagon(ctx, cx, cy, r, color) {
  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2
    ctx[i === 0 ? 'moveTo' : 'lineTo'](cx + r * Math.cos(a), cy + r * Math.sin(a))
  }
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()
  ctx.strokeStyle = darken(color, 12)
  ctx.lineWidth = 1
  ctx.stroke()
}

function drawPattern(ctx, cx, cy, w, h, type, shape) {
  ctx.save()
  ctx.globalAlpha = 0.12
  if (type === 'dots') {
    for (let x = -w / 2; x < w / 2; x += 18)
      for (let y = -h / 2; y < h / 2; y += 18) {
        ctx.beginPath(); ctx.arc(cx + x, cy + y, 3, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill()
      }
  } else if (type === 'stripes') {
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2
    for (let x = -w / 2; x < w / 2; x += 12) {
      ctx.beginPath(); ctx.moveTo(cx + x, cy - h / 2); ctx.lineTo(cx + x + 20, cy + h / 2); ctx.stroke()
    }
  } else if (type === 'waves') {
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2
    for (let y = -h / 2; y < h / 2; y += 14) {
      ctx.beginPath()
      for (let x = -w / 2; x < w / 2; x += 2) {
        ctx.lineTo(cx + x, cy + y + Math.sin(x * 0.08) * 5)
      }
      ctx.stroke()
    }
  }
  ctx.restore()
}

function drawDecoration(ctx, type) {
  switch (type) {
    case 'cream':
      ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.fill(); break
    case 'cherry':
      ctx.beginPath(); ctx.arc(0, -4, 8, 0, Math.PI * 2); ctx.fillStyle = '#C94C4C'; ctx.fill()
      ctx.beginPath(); ctx.arc(-2, -6, 2, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fill()
      ctx.beginPath(); ctx.moveTo(0, -12); ctx.lineTo(2, -18); ctx.strokeStyle = '#4A6B3A'; ctx.lineWidth = 2; ctx.stroke()
      break
    case 'berry':
      ctx.beginPath(); ctx.arc(-4, 2, 6, 0, Math.PI * 2); ctx.fillStyle = '#3B4A6B'; ctx.fill()
      ctx.beginPath(); ctx.arc(4, -2, 6, 0, Math.PI * 2); ctx.fillStyle = '#4A5A7B'; ctx.fill()
      ctx.beginPath(); ctx.arc(0, -6, 5, 0, Math.PI * 2); ctx.fillStyle = '#5A6A8B'; ctx.fill(); break
    case 'chocolate':
      for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.arc(i * 7, i * 3, 4 + Math.random() * 2, 0, Math.PI * 2); ctx.fillStyle = `hsl(30,40%,${20 + i * 4}%)`; ctx.fill() }
      break
    case 'flowers':
      for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2 - Math.PI / 2; ctx.beginPath(); ctx.ellipse(Math.cos(a) * 6, Math.sin(a) * 6, 5, 3, a, 0, Math.PI * 2); ctx.fillStyle = ['#E8A87C','#D4A0A0','#F5E6CC','#D4A853','#E8C4A0'][i]; ctx.fill() }
      ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI * 2); ctx.fillStyle = '#D4A853'; ctx.fill(); break
    case 'sprinkles':
      const sc = ['#D4A853','#E8A87C','#C94C4C','#7A8B6E','#B8A0C0','#D4A0A0']
      for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; ctx.save(); ctx.translate(Math.cos(a) * 11, Math.sin(a) * 11); ctx.rotate(a); ctx.fillStyle = sc[i % 6]; ctx.fillRect(-2, -5, 4, 10); ctx.restore() }
      break
    case 'gold':
      ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 2); ctx.fillStyle = '#D4A853'; ctx.fill()
      ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI * 2); ctx.fillStyle = '#E8D5A3'; ctx.fill(); break
    case 'macaron':
      ctx.beginPath(); ctx.arc(0, -3, 8, Math.PI, 0); ctx.fillStyle = '#B8A0C0'; ctx.fill()
      ctx.beginPath(); ctx.arc(0, 3, 8, 0, Math.PI); ctx.fillStyle = '#B8A0C0'; ctx.fill()
      ctx.fillStyle = '#E8D5A3'; ctx.fillRect(-7, -2, 14, 4); break
    case 'candle':
      ctx.fillStyle = '#F0C4A0'; ctx.fillRect(-3, -14, 6, 16)
      ctx.beginPath(); ctx.arc(0, -14, 3, 0, Math.PI * 2); ctx.fillStyle = '#FFD700'; ctx.fill()
      ctx.beginPath(); ctx.arc(0, -14, 1.5, 0, Math.PI * 2); ctx.fillStyle = '#FF6B35'; ctx.fill()
      ctx.fillStyle = '#FFF'; ctx.fillRect(-0.5, -17, 1, 4); break
    case 'meringue':
      ctx.beginPath(); ctx.moveTo(0, -12); ctx.quadraticCurveTo(8, -8, 8, 0); ctx.quadraticCurveTo(8, 8, 0, 10); ctx.quadraticCurveTo(-8, 8, -8, 0); ctx.quadraticCurveTo(-8, -8, 0, -12)
      ctx.fillStyle = '#F5E6CC'; ctx.fill(); ctx.strokeStyle = '#E8D5A3'; ctx.lineWidth = 1; ctx.stroke(); break
    case 'nuts':
      for (let i = 0; i < 3; i++) { const a = (i / 3) * Math.PI * 2; ctx.beginPath(); ctx.ellipse(Math.cos(a) * 6, Math.sin(a) * 6, 4, 3, a, 0, Math.PI * 2); ctx.fillStyle = '#8B5E3C'; ctx.fill() }
      break
    case 'lemon':
      ctx.beginPath(); ctx.ellipse(0, 0, 10, 7, 0, 0, Math.PI * 2); ctx.fillStyle = '#E8D44D'; ctx.fill()
      ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI * 2); ctx.fillStyle = '#F0E68C'; ctx.fill(); break
  }
}

function darken(hex, amt) {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.max(0, (n >> 16) - amt)
  const g = Math.max(0, ((n >> 8) & 0xFF) - amt)
  const b = Math.max(0, (n & 0xFF) - amt)
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}
