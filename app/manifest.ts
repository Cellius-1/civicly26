import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name}: ${SITE.tagline}`,
    short_name: SITE.name,
    description: SITE.description,
    id: '/',
    start_url: '/place/bridgewater-nj?source=pwa',
    scope: '/',
    display: 'standalone',
    display_override: ['standalone', 'minimal-ui'],
    orientation: 'portrait',
    background_color: '#efece4',
    theme_color: '#0e3b43',
    lang: 'en-US',
    categories: ['government', 'news', 'utilities'],
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/pwa-icon/192', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/pwa-icon/512', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/pwa-icon/maskable-192', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/pwa-icon/maskable-512', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
    ],
    shortcuts: [
      { name: "What's happening this week", url: '/place/bridgewater-nj' },
      { name: 'Next meeting agenda', url: '/place/bridgewater-nj/meetings' },
      { name: 'My tax receipt', url: '/place/bridgewater-nj/receipt' }
    ]
  }
}
