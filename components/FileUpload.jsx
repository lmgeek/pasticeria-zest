'use client'

import { useState, useRef, useCallback } from 'react'

export default function FileUpload({ value, onChange }) {
  const [dragOver, setDragOver] = useState(false)
  const [hasFile, setHasFile] = useState(!!value)
  const inputRef = useRef(null)

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      onChange(ev.target.result)
      setHasFile(true)
    }
    reader.readAsDataURL(file)
  }, [onChange])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    handleFile(file)
  }, [handleFile])

  const onDragOver = (e) => { e.preventDefault(); setDragOver(true) }
  const onDragLeave = () => setDragOver(false)

  const onInputChange = (e) => {
    const file = e.target.files?.[0]
    handleFile(file)
  }

  const remove = () => {
    onChange('')
    setHasFile(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="fileupload-wrap">
      <label className="form-label">Immagine</label>
      <div
        className={`fileupload-zone ${dragOver ? 'fileupload-dragover' : ''} ${hasFile ? 'fileupload-hasfile' : ''}`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => !hasFile && inputRef.current?.click()}
      >
        <div className="fileupload-corners">
          <span /><span /><span /><span />
        </div>

        {hasFile && value ? (
          <div className="fileupload-preview">
            <img src={value} alt="preview" />
            <div className="fileupload-preview-overlay">
              <span className="fileupload-preview-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </span>
              <span>Cambia immagine</span>
            </div>
            <button type="button" className="fileupload-remove" onClick={(e) => { e.stopPropagation(); remove() }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="fileupload-check">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
        ) : (
          <div className="fileupload-placeholder">
            <div className="fileupload-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <div className="fileupload-text">
              <strong>Trascina qui un&apos;immagine</strong>
              <span>oppure <em>clicca per sfogliare</em></span>
            </div>
            <span className="fileupload-hint">PNG, JPG · Max 5MB</span>
          </div>
        )}

        <input ref={inputRef} type="file" accept="image/*" onChange={onInputChange} className="fileupload-input" />
      </div>
    </div>
  )
}
