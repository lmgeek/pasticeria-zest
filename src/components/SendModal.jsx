import React, { useState, useRef, useEffect } from 'react'

export default function SendModal({ canvasRef, onClose }) {
  const previewRef = useRef(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [recipient, setRecipient] = useState('info@zestpasticceria.it')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const pv = previewRef.current
    if (!pv || !canvasRef.current) return
    const ctx = pv.getContext('2d')
    pv.width = 300
    pv.height = 300
    ctx.clearRect(0, 0, 300, 300)
    ctx.drawImage(canvasRef.current, 0, 0, 300, 300)
  }, [canvasRef])

  const handleDownload = () => {
    const link = document.createElement('a')
    link.download = 'Zest_design.png'
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const subj = encodeURIComponent(`Richiesta valutazione dolce da ${name}`)
    const body = encodeURIComponent(
      `Nuova creazione da Zest Pasticceria\n\n` +
      `Nome: ${name}\nEmail mittente: ${email}\n\n` +
      `Messaggio: ${message || 'Nessun messaggio'}\n\n` +
      `Il design è allegato come immagine. Scarica l'immagine e allega questa email.\n\n— Zest Pasticceria`
    )
    window.open(`mailto:${recipient}?subject=${subj}&body=${body}`, '_blank')

    try {
      const designs = JSON.parse(localStorage.getItem('zest_designs') || '[]')
      designs.push({ name, email, message, date: new Date().toISOString(), image: canvasRef.current.toDataURL('image/png') })
      localStorage.setItem('zest_designs', JSON.stringify(designs))
    } catch (e) {}

    alert("Grazie! Verrà aperta la tua email. Allega l'immagine scaricata del tuo design prima di inviare.")
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h3>Invia il tuo dolce per la valutazione</h3>
        <p className="modal-desc">Il tuo design verrà valutato dalla nostra pasticceria. Riceverai un feedback via email.</p>
        <div className="modal-preview">
          <canvas ref={previewRef} width={300} height={300} />
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Il tuo nome</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Mario Rossi" />
          </div>
          <div className="form-group">
            <label>La tua email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="mario@example.com" />
          </div>
          <div className="form-group">
            <label>Email destinatario</label>
            <input type="email" value={recipient} onChange={e => setRecipient(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Messaggio (opzionale)</label>
            <textarea rows={3} value={message} onChange={e => setMessage(e.target.value)} placeholder="Descrivi la tua creazione..." />
          </div>
          <button type="submit" className="btn btn-primary btn-full">Invia Design</button>
        </form>
        <div className="modal-alt">
          <p>In alternativa, scarica il tuo design e inviacelo via email:</p>
          <button className="btn btn-outline btn-small" onClick={handleDownload}>Scarica Design</button>
        </div>
      </div>
    </div>
  )
}
