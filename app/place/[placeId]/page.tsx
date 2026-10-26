import Link from 'next/link'
import { JsonLd } from '@/components/JsonLd'
import { SaveButton } from '@/components/SaveButton'
import { SignalFeed } from '@/components/SignalFeed'
import { SplitFlap } from '@/components/SplitFlap'
import { StageTrack } from '@/components/StageTrack'
import { bodyOf, requireBundle } from '@/lib/registry'
import { signalsFor } from '@/lib/signals'
import { buildReceipt } from '@/lib/receipt'
import { timeline } from '@/lib/agenda'
import { STAGES } from '@/lib/stages'
import { breadcrumbs } from '@/lib/schema'
import { pageMeta } from '@/lib/site'
import { clock, daysBetween, longDate, money, relativeDay } from '@/lib/format'

export async function generateMetadata({ params }: { params: Promise<{ placeId: string }> }) {
  const { placeId } = await params
  const bundle = requireBundle(placeId)
  const { place } = bundle
  const open = bundle.measures.filter((m) => m.commentClosesOn && m.commentClosesOn >= place.asOf).length
  return pageMeta({
    title: `What's happening in ${place.shortName}`,
    description: `${open} decisions are open for public comment in ${place.name}, ${place.county}. Deadlines, meeting agendas, budget changes, and who to write to, in plain English.`,
    path: `/place/${placeId}`,
    image: `/place/${placeId}/opengraph-image`,
    keywords: [place.shortName, place.county, 'public meetings', 'local government', ...place.zips]
  })
}

export default async function PlaceOverview({ params }: { params: Promise<{ placeId: string }> }) {
  const { placeId } = await params
  const bundle = requireBundle(placeId)
  const { place } = bundle
  const signals = signalsFor(bundle)

  const open = bundle.measures
    .filter((m) => STAGES[m.stage].open && m.commentClosesOn && daysBetween(place.asOf, m.commentClosesOn) >= 0)
    .sort((a, b) => a.commentClosesOn!.localeCompare(b.commentClosesOn!))

  const upcoming = bundle.meetings.filter((m) => m.status === 'upcoming' && daysBetween(place.asOf, m.startsAt) >= 0).sort((a, b) => a.startsAt.localeCompare(b.startsAt))
  const next = upcoming.find((m) => daysBetween(place.asOf, m.startsAt) >= 1) ?? upcoming[0]
  const nextBody = next ? bodyOf(bundle, next.bodyId) : null
  const speakable = next ? timeline(next).filter((t) => t.item.commentAllowed && t.item.measureId) : []

  const receipt = buildReceipt(bundle, place.medianAssessedValue)

  return (
    <div className="overview">
      <JsonLd
        data={breadcrumbs([
          { name: 'Civicly', path: '/' },
          { name: place.name, path: `/place/${place.id}` }
        ])}
      />

      <h1 className="sr-only">{place.name}</h1>

      {next && nextBody ? (
        <section className="panel panel--brand" aria-labelledby="next-title">
          <div className="next">
            <p className="next__label">Next public meeting</p>
            <h2 id="next-title" className="next__title">{nextBody.name}</h2>
            <div className="countdown">
              <SplitFlap value={String(daysBetween(place.asOf, next.startsAt)).padStart(2, '0')} label={relativeDay(place.asOf, next.startsAt)} />
              <span className="countdown__unit">days away</span>
            </div>
            <p className="next__line">
              {longDate(next.startsAt)} at {clock(next.startsAt)}, {next.location}
            </p>
            {speakable.length ? (
              <ul className="next__list">
                {speakable.map((t) => (
                  <li key={t.item.id}>
                    <span className="next__time">about {clock(t.startsAt.toISOString())}</span>
                    <span>{t.item.plainTitle}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            <Link href={`/place/${place.id}/meetings/${next.id}`} className="btn btn--gold btn--block">
              Read the agenda
            </Link>
            <SaveButton
              placeId={place.id}
              item={{ id: next.id, title: `${nextBody.shortName} meeting`, href: `/place/${place.id}/meetings/${next.id}`, kind: 'meeting', note: `${longDate(next.startsAt)}, ${clock(next.startsAt)}` }}
              size="full"
            />
          </div>
        </section>
      ) : null}

      <div className="overview__grid">
        <div className="stack">
          <SignalFeed placeId={place.id} placeName={place.shortName} signals={signals} neighborhoods={place.neighborhoods} />

          <section className="band-inline" aria-labelledby="open-title">
            <div className="section-head">
              <h2 id="open-title" className="h2">Closing soon</h2>
              <Link href={`/place/${place.id}/measures`} className="section-head__link">
                All proposals and votes
              </Link>
            </div>
            <ol className="deadlines">
              {open.map((m) => {
                const d = daysBetween(place.asOf, m.commentClosesOn!)
                return (
                  <li key={m.id} className="deadlines__row">
                    <div className={`deadlines__when${d <= 1 ? ' is-urgent' : ''}`}>
                      <span className="deadlines__day">{d === 0 ? 'Today' : d === 1 ? 'Tomorrow' : `${d} days left`}</span>
                      <span className="deadlines__date">{longDate(m.commentClosesOn!)}</span>
                    </div>
                    <div className="deadlines__body">
                      <Link href={`/place/${place.id}/measures/${m.id}`} className="deadlines__title">
                        {m.plainTitle}
                      </Link>
                      <p className="deadlines__meta">
                        {bodyOf(bundle, m.bodyId).shortName} <span aria-hidden="true">&middot;</span> {m.fileNumber} <span aria-hidden="true">&middot;</span> {m.nextActionLabel}
                      </p>
                    </div>
                    <StageTrack stage={m.stage} history={m.history} compact />
                  </li>
                )
              })}
            </ol>
          </section>
        </div>

        <aside className="overview__side">
          <section className="panel" aria-labelledby="receipt-title">
            <p className="panel__eyebrow">Your share</p>
            <h2 id="receipt-title" className="panel__title">{money(receipt.total)} a year</h2>
            <p className="panel__muted">Property tax on a home assessed at {money(place.medianAssessedValue)}, the {place.shortName} median.</p>
            <ul className="share-list">
              {receipt.sections.slice(0, 3).map((s) => (
                <li key={s.body.id}>
                  <span>{s.body.shortName}</span>
                  <span className="num">{money(s.dollars)}</span>
                </li>
              ))}
            </ul>
            <Link href={`/place/${place.id}/receipt`} className="btn btn--secondary btn--block">
              Use my own assessment
            </Link>
          </section>

          <section className="panel panel--paper" aria-labelledby="more-title">
            <h2 id="more-title" className="panel__title">Additional features</h2>
            <ul className="list">
              <li>
                <Link href={`/place/${place.id}/budget`} className="row">
                  <span className="row__main">
                    <span className="row__title">Money allocation</span>
                    <span className="row__meta">Every budget, sorted by where it goes</span>
                  </span>
                </Link>
              </li>
              <li>
                <Link href={`/place/${place.id}/officials`} className="row">
                  <span className="row__main">
                    <span className="row__title">Who decides?</span>
                    <span className="row__meta">Members, terms, recorded votes</span>
                  </span>
                </Link>
              </li>
              <li>
                <Link href={`/place/${place.id}/sources`} className="row">
                  <span className="row__main">
                    <span className="row__title">Document sources</span>
                    <span className="row__meta">Every source document</span>
                  </span>
                </Link>
              </li>
            </ul>
          </section>
        </aside>
      </div>

      {place.sampleData ? (
        <p className="note">
          <strong>Demonstration records.</strong> Names, votes, and dollar figures are realistic samples. Contact addresses end in .example and will not deliver.
        </p>
      ) : null}
    </div>
  )
}
