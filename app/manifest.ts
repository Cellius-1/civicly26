import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name}: ${SITE.tagline}`,
    short_name: SITE.name,
    description: SITE.description,
    start_url: '/place/bridgewater-nj',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#f5f4ef',
    theme_color: '#162e51',
    lang: 'en-US',
    categories: ['government', 'news', 'utilities'],
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' }
    ],
    shortcuts: [
      { name: 'What changed this week', url: '/place/bridgewater-nj' },
      { name: 'Next meeting agenda', url: '/place/bridgewater-nj/meetings' },
      { name: 'My tax receipt', url: '/place/bridgewater-nj/receipt' }
    ]
  }
}
