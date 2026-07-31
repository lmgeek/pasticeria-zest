'use client'

export default function FormField({ label, name, type, value, onChange, error, options, required, placeholder }) {
  const id = `field-${name}`

  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select id={id} name={name} value={value || ''} onChange={onChange} className="form-input">
            <option value="">Seleccionar...</option>
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        )
      case 'textarea':
        return (
          <textarea id={id} name={name} value={value || ''} onChange={onChange} className="form-input form-textarea" placeholder={placeholder} />
        )
      case 'switch':
        return (
          <label className="form-switch">
            <input type="checkbox" name={name} checked={!!value} onChange={onChange} />
            <span className="form-switch-slider"></span>
          </label>
        )
      default:
        return (
          <input id={id} type={type || 'text'} name={name} value={value || ''} onChange={onChange} className="form-input" placeholder={placeholder} required={required} />
        )
    }
  }

  return (
    <div className="form-field">
      {label && type !== 'switch' && <label htmlFor={id} className="form-label">{label}</label>}
      {type === 'switch' && <span className="form-label">{label}</span>}
      {renderInput()}
      {error && <span className="form-error">{error}</span>}
    </div>
  )
}
