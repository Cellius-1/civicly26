import { getBundle } from '@/lib/registry'
import { signalsFor } from '@/lib/signals'

const xml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export async function GET(request: Request, { params }: { params: Promise<{ placeId: string }> }) {
  const { placeId } = await params
  const bundle = getBundle(placeId)
  if (!bundle) return new Response('Place not found', { status: 404 })

  const url = new URL(request.url)
  const lenses = url.searchParams.get('topics')?.split(',').filter(Boolean) ?? []
  const hood = url.searchParams.get('neighborhood')
  const origin = url.origin

  const items = signalsFor(bundle)
    .filter((s) => !lenses.length || lenses.includes(s.lens))
    .filter((s) => !hood || !s.neighborhoods.length || s.neighborhoods.includes(hood))
    .sort((a, b) => b.date.localeCompare(a.date))

  const self = `${origin}${url.pathname}${url.search}`

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="${origin}/feed.xsl"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${xml(`${bundle.place.name} public record`)}</title>
<link>${origin}/place/${placeId}</link>
<atom:link href="${xml(self)}" rel="self" type="application/rss+xml"/>
<description>${xml('Deadlines, meetings, decisions, and budget changes in plain English.')}</description>
<language>en-US</language>
<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items
  .map(
    (s) => `<item>
<guid isPermaLink="false">${xml(s.id)}</guid>
<title>${xml(s.headline)}</title>
<link>${origin}${xml(s.href)}</link>
<description>${xml(s.detail)}</description>
<pubDate>${new Date(s.date.length === 10 ? `${s.date}T12:00:00-04:00` : s.date).toUTCString()}</pubDate>
</item>`
  )
  .join('\n')}
</channel>
</rss>`

  return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=900' } })
}
