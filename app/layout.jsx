import './globals.css'
import I18nProvider from '@/components/I18nProvider'
import LayoutWrapper from '@/components/LayoutWrapper'
import CookieBanner from '@/components/CookieBanner'

export const metadata = {
  title: 'Zest Pasticceria',
  description: 'Pasticceria Artigianale – Pomezia, RM. Dove la tradizione incontra l\'innovazione.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=DM+Serif+Display:ital@0;1&family=Playfair+Display:wght@400;600;700&family=Dancing+Script:wght@400;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <I18nProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
          <CookieBanner />
        </I18nProvider>
      </body>
    </html>
  )
}
