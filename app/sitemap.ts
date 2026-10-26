import type { MetadataRoute } from 'next'
import { absolute } from '@/lib/site'
import { listPlaceIds, requireBundle } from '@/lib/registry'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = [
    { url: absolute('/'), lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: absolute('/about'), lastModified: now, changeFrequency: 'monthly', priority: 0.5 }
  ]

  for (const placeId of listPlaceIds()) {
    const bundle = requireBundle(placeId)
    const base = `/place/${placeId}`
    const asOf = new Date(`${bundle.place.asOf}T12:00:00-04:00`)

    for (const path of ['', '/measures', '/meetings', '/budget', '/receipt', '/officials', '/follow', '/sources']) {
      entries.push({
        url: absolute(`${base}${path}`),
        lastModified: asOf,
        changeFrequency: path === '' || path === '/measures' ? 'daily' : 'weekly',
        priority: path === '' ? 0.9 : 0.7
      })
    }

    for (const m of bundle.measures) {
      entries.push({
        url: absolute(`${base}/measures/${m.id}`),
        lastModified: new Date(`${m.history[m.history.length - 1].date}T12:00:00-04:00`),
        changeFrequency: 'weekly',
        priority: 0.8
      })
    }

    for (const mt of bundle.meetings) {
      entries.push({ url: absolute(`${base}/meetings/${mt.id}`), lastModified: asOf, changeFrequency: 'weekly', priority: mt.status === 'upcoming' ? 0.8 : 0.4 })
    }
  }

  return entries
}
