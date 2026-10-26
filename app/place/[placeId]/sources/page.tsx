import { AgendaDecoder } from '@/components/AgendaDecoder'
import { bodyOf, requireBundle } from '@/lib/registry'
import { pageMeta } from '@/lib/site'
import { clock, count, fullDate } from '@/lib/format'

export async function generateMetadata({ params }: { params: Promise<{ placeId: string }> }) {
  const { placeId } = await params
  const bundle = requireBundle(placeId)
  return pageMeta({
    title: `Document sources for ${bundle.place.shortName}`,
    description: 'Every public document behind these pages: agenda packets, ordinance listings, adopted budgets, and the county tax rate table, with the last time each was checked.',
    path: `/place/${placeId}/sources`,
    image: `/place/${placeId}/opengraph-image`,
    keywords: ['public records', 'open data', 'agenda packets', bundle.place.shortName]
  })
}

const KIND: Record<string, string> = {
  'agenda-pdf': 'Agenda packets (PDF)',
  'minutes-pdf': 'Minutes (PDF)',
  'budget-pdf': 'Budget filing (PDF)',
  'ordinance-index': 'Ordinance listing',
  'open-data': 'State open data',
  'tax-table': 'Tax rate table'
}

export default async function SourcesPage({ params }: { params: Promise<{ placeId: string }> }) {
  const { placeId } = await params
  const bundle = requireBundle(placeId)

  return (
    <>
      <div className="screen__head">
        <p className="screen__eyebrow">Behind every screen</p>
        <h1 className="screen__title">Document sources</h1>
        <p className="screen__sub">
          Nobody in {bundle.place.shortName} government had to buy anything for this app to exist. Every record comes from a document that is already public.
        </p>
      </div>

      <ul className="list card" style={{ padding: 0 }}>
        {bundle.sources.map((s) => (
          <li key={s.id}>
            <a className="row" href={s.url} target="_blank" rel="noreferrer">
              <span className="row__main">
                <span className="row__title">{s.label}</span>
                <span className="row__meta">
                  {bodyOf(bundle, s.bodyId).name} <span aria-hidden="true">&middot;</span> {KIND[s.kind]}
                </span>
                <span className="row__meta">
                  Checked {fullDate(s.lastRead)}, {clock(s.lastRead)} <span aria-hidden="true">&middot;</span> {s.cadence.toLowerCase()}
                </span>
              </span>
              <span className="row__value">
                {count(s.recordsFound)}
                <span className="row__meta">items</span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <section className="band-inline" aria-labelledby="decoder-title">
        <div className="section-head">
          <h2 id="decoder-title" className="h2">Try the agenda reader</h2>
          <p className="section-head__note">
            This is the same step that runs on every new agenda packet. It splits the document into items, spots the action being taken, files each item under a part of daily life, and flags terms that need explaining.
          </p>
        </div>
        <AgendaDecoder />
      </section>
    </>
  )
}
