import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Pagina non trovata</p>
      <Link href="/">Torna alla home</Link>
    </div>
  )
}
