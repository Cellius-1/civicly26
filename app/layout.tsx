import type { Metadata, Viewport } from 'next'
import { Archivo, IBM_Plex_Mono, Petrona } from 'next/font/google'
import { JsonLd } from '@/components/JsonLd'
import { ServiceWorker } from '@/components/ServiceWorker'
import { ToastHost } from '@/components/ToastHost'
import { siteGraph } from '@/lib/schema'
import { SITE } from '@/lib/site'
import './globals.css'

const ui = Archivo({ subsets: ['latin'], variable: '--font-archivo', display: 'swap' })
const record = Petrona({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-petrona', display: 'swap' })
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-plex-mono', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} | ${SITE.tagline}`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: ['local government app', 'city council agenda', 'property tax receipt', 'public meetings', 'municipal budget', 'Bridgewater NJ', 'Somerset County'],
  authors: [{ name: SITE.name }],
  alternates: { canonical: SITE.url, types: { 'application/rss+xml': [{ url: '/api/feed/bridgewater-nj', title: 'Bridgewater public record' }] } },
  openGraph: {
    type: 'website',
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
    locale: SITE.locale
  },
  twitter: { card: 'summary_large_image', title: `${SITE.name} | ${SITE.tagline}`, description: SITE.description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  appleWebApp: { capable: true, title: SITE.name, statusBarStyle: 'black-translucent' },
  category: 'government',
  formatDetection: { telephone: true, address: false, email: false }
}

export const viewport: Viewport = {
  themeColor: '#0e3b43',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US" className={`${ui.variable} ${record.variable} ${mono.variable}`}>
      <body>
        <JsonLd data={siteGraph()} />
        <a className="skip" href="#main">Skip to main content</a>
        <div id="main">{children}</div>
        <ToastHost />
        <ServiceWorker />
      </body>
    </html>
  )
}
