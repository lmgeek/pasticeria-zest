import React from 'react'

export default function Contact() {
  return (
    <div className="contact">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Contatti</span>
          <h2 className="section-title">Venite a <span className="italic">trovarci</span></h2>
        </div>
        <div className="contact-grid">
          <div className="contact-info">
            <ContactCard icon={<PinIcon />} title="Indirizzo" text="Calle Rattazzi\n00040 Pomezia RM, Italia" />
            <ContactCard icon={<PhoneIcon />} title="Telefono" link="tel:+393738676326" linkText="+39 373 867 6326" />
            <ContactCard icon={<MailIcon />} title="Email" link="mailto:info@zestpasticceria.it" linkText="info@zestpasticceria.it" />
            <ContactCard icon={<ClockIcon />} title="Orari" text="Lun–Sab: 07:00–20:00\nDom: 08:00–13:00" />
            <a href="https://www.instagram.com/zest_pasticceria_" target="_blank" rel="noopener" className="contact-social">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              Seguici su Instagram
            </a>
          </div>
          <div className="contact-map">
            <div className="map-placeholder">
              <img src="/assets/contact-street.jpg" alt="Zest Pasticceria" className="map-img" />
              <div className="map-overlay" />
              <div className="map-pin">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3" fill="white"/></svg>
              </div>
              <p>Zest Pasticceria<br />Calle Rattazzi – Pomezia</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ContactCard({ icon, title, text, link, linkText }) {
  return (
    <div className="contact-card">
      <div className="contact-icon">{icon}</div>
      <div>
        <h4>{title}</h4>
        {text && text.split('\n').map((t, i) => <p key={i}>{t}</p>)}
        {link && <a href={link} className="contact-link">{linkText}</a>}
      </div>
    </div>
  )
}

function PinIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
}
function PhoneIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
}
function MailIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
}
function ClockIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
}
