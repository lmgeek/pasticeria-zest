import nodemailer from 'nodemailer'
import connectDB from './db'
import StoreConfig from '@/models/StoreConfig'

function InvoiceEmail({ sale }) {
  const items = sale.items || []
  const subtotal = items.reduce((sum, item) => sum + (item.subtotale || 0), 0)
  const tax = subtotal * 0.22
  const total = subtotal + tax
  const date = new Date(sale.createdAt).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div style={{ fontFamily: 'Helvetica, Arial, sans-serif', maxWidth: 680, margin: '0 auto', padding: 0, color: '#333' }}>
      <div style={{ backgroundColor: '#f9f3eb', padding: '20px 32px', borderBottom: '4px solid #c4956a' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#2c2c2c', fontFamily: 'Georgia, serif' }}>Zest Pasticceria</h1>
            <p style={{ margin: '4px 0 0', fontSize: '.85rem', color: '#666' }}>Tienda de Pastelería Artesanal</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '.75rem', color: '#888', textTransform: 'uppercase' }}>Factura #</span>
            <h2 style={{ margin: '4px 0 0', fontSize: '1.2rem', color: '#2c2c2c' }}>{String(sale._id).slice(-8).toUpperCase()}</h2>
            <p style={{ margin: '4px 0 0', fontSize: '.8rem', color: '#666' }}>{date}</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 32px', display: 'flex', gap: '32px' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '.75rem', textTransform: 'uppercase', color: '#999', marginBottom: '8px', letterSpacing: '.5px' }}>Datos del Cliente</h3>
          <p style={{ margin: '4px 0', fontSize: '.9rem' }}><strong>{sale.cliente?.nome || 'N/A'}</strong></p>
          <p style={{ margin: '2px 0', fontSize: '.85rem', color: '#555' }}>{sale.cliente?.email || 'N/A'}</p>
          {sale.cliente?.telefono && <p style={{ margin: '2px 0', fontSize: '.85rem', color: '#555' }}>{sale.cliente.telefono}</p>}
          {sale.cliente?.indirizzo && <p style={{ margin: '2px 0', fontSize: '.85rem', color: '#555' }}>{sale.cliente.indirizzo}</p>}
        </div>
        <div style={{ flex: 1, textAlign: 'right' }}>
          <h3 style={{ fontSize: '.75rem', textTransform: 'uppercase', color: '#999', marginBottom: '8px', letterSpacing: '.5px' }}>Detalles de Pago</h3>
          <p style={{ margin: '4px 0', fontSize: '.85rem' }}>Método: <strong>Stripe</strong></p>
          <p style={{ margin: '2px 0', fontSize: '.8rem', color: '#888' }}>ID: {sale.stripePaymentIntentId || '-'}</p>
          <p style={{ margin: '2px 0', fontSize: '.85rem' }}>Estado: <span style={{ color: sale.stato === 'pagato' ? '#2a7d2a' : '#c4956a', fontWeight: 600, textTransform: 'uppercase' }}>{sale.stato === 'pagato' ? 'Pagado' : sale.stato}</span></p>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f9f3eb' }}>
            <th style={{ textAlign: 'left', padding: '10px 16px', fontSize: '.75rem', textTransform: 'uppercase', color: '#999', borderBottom: '2px solid #c4956a' }}>Producto</th>
            <th style={{ textAlign: 'center', padding: '10px 16px', fontSize: '.75rem', textTransform: 'uppercase', color: '#999', borderBottom: '2px solid #c4956a' }}>Cant.</th>
            <th style={{ textAlign: 'right', padding: '10px 16px', fontSize: '.75rem', textTransform: 'uppercase', color: '#999', borderBottom: '2px solid #c4956a' }}>Precio Unit.</th>
            <th style={{ textAlign: 'right', padding: '10px 16px', fontSize: '.75rem', textTransform: 'uppercase', color: '#999', borderBottom: '2px solid #c4956a' }}>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id} style={{ borderBottom: '1px solid #f0e8dc' }}>
              <td style={{ padding: '10px 16px', fontSize: '.9rem' }}>{item.nome}</td>
              <td style={{ textAlign: 'center', padding: '10px 16px', fontSize: '.9rem' }}>{item.quantita}</td>
              <td style={{ textAlign: 'right', padding: '10px 16px', fontSize: '.9rem' }}>€{(item.prezzoUnitario || 0).toFixed(2)}</td>
              <td style={{ textAlign: 'right', padding: '10px 16px', fontSize: '.9rem' }}>€{(item.subtotale || 0).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} style={{ textAlign: 'right', padding: '10px 16px', fontSize: '.9rem', color: '#666' }}>Subtotal</td>
            <td style={{ textAlign: 'right', padding: '10px 16px', fontSize: '.9rem' }}>€{subtotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td colSpan={3} style={{ textAlign: 'right', padding: '6px 16px', fontSize: '.85rem', color: '#666' }}>IVA (22%)</td>
            <td style={{ textAlign: 'right', padding: '6px 16px', fontSize: '.85rem' }}>€{tax.toFixed(2)}</td>
          </tr>
          <tr style={{ borderTop: '2px solid #c4956a' }}>
            <td colSpan={3} style={{ textAlign: 'right', padding: '10px 16px', fontSize: '1rem', fontWeight: 'bold' }}>Total</td>
            <td style={{ textAlign: 'right', padding: '10px 16px', fontSize: '1rem', fontWeight: 'bold' }}>€{total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>

      <div style={{ padding: '16px 32px', backgroundColor: '#f9f3eb', borderTop: '1px solid #e8dcc8', marginTop: '24px', textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: '.8rem', color: '#888' }}>
          Gracias por su compra en <strong>Zest Pasticceria</strong>. Para cualquier consulta, contacte a{' '}
          <a href="mailto:hello@zestpasticceria.com" style={{ color: '#c4956a', textDecoration: 'none' }}>hello@zestpasticceria.com</a>
        </p>
      </div>
    </div>
  )
}

function getSmtpConfig(fromStore) {
  return {
    host: fromStore.smtpHost || process.env.SMTP_HOST,
    port: parseInt(fromStore.smtpPort || process.env.SMTP_PORT, 10) || 587,
    user: fromStore.smtpUser || process.env.SMTP_USER,
    pass: fromStore.smtpPass || process.env.SMTP_PASS,
    secure: (fromStore.smtpSecure || process.env.SMTP_SECURE) === 'true',
    from: fromStore.storeEmail || process.env.STORE_EMAIL || 'hello@zestpasticceria.com',
  }
}

export async function sendInvoiceEmail(sale, clientEmail) {
  let smtpConfig = null

  try {
    await connectDB()
    const configs = await StoreConfig.find({
      chiave: { $in: ['smtpHost', 'smtpPort', 'smtpUser', 'smtpPass', 'smtpSecure', 'storeEmail'] },
    })
    const fromStore = {}
    configs.forEach((c) => { fromStore[c.chiave] = c.valore })

    const host = fromStore.smtpHost || process.env.SMTP_HOST
    if (!host) {
      console.warn('[EMAIL] SMTP_HOST no configurado en DB ni en .env.local. Email no enviado.')
      return null
    }
    smtpConfig = getSmtpConfig(fromStore)
    console.log(`[EMAIL] SMTP configurado para host ${smtpConfig.host}:${smtpConfig.port} (${smtpConfig.secure ? 'SSL' : 'STARTTLS'})`)
  } catch (e) {
    console.warn('[EMAIL] Could not load SMTP config from DB:', e.message)
    smtpConfig = getSmtpConfig({})
  }

  if (!smtpConfig.host) {
    console.warn('[EMAIL] SMTP no configurado. Email no enviado.')
    return null
  }

  const transporter = nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.secure,
    auth: {
      user: smtpConfig.user,
      pass: smtpConfig.pass,
    },
    tls: { rejectUnauthorized: true },
  })

  try {
    console.log(`[EMAIL] Enviando factura venta ${String(sale._id).slice(-8).toUpperCase()} a ${clientEmail}...`)
    const ReactDOMServer = require('react-dom/server')
    const htmlContent = ReactDOMServer.renderToString(InvoiceEmail({ sale }))
    const total = sale.totale != null ? sale.totale : (sale.items || []).reduce((sum, i) => sum + (i.subtotale || 0), 0) * 1.22
    const info = await transporter.sendMail({
      from: `"${sale.cliente?.nome || 'Zest Pasticceria'}" <${smtpConfig.from}>`,
      to: clientEmail,
      subject: `Factura de Venta #${String(sale._id).slice(-8).toUpperCase()} — €${total.toFixed(2)}`,
      html: htmlContent,
    })
    console.log(`[EMAIL] Factura enviada correctamente para venta ${String(sale._id).slice(-8).toUpperCase()}. MessageId: ${info.messageId}`)
    return info
  } catch (err) {
    console.error(`[EMAIL] Error enviando factura para venta ${String(sale._id).slice(-8).toUpperCase()}:`, err.message)
    return null
  }
}
