import Link from 'next/link'
import { JsonLd } from '@/components/JsonLd'
import { requireBundle } from '@/lib/registry'
import { breadcrumbs } from '@/lib/schema'
import { pageMeta } from '@/lib/site'
import { fullDate } from '@/lib/format'

export async function generateMetadata({ params }: { params: Promise<{ placeId: string }> }) {
  const { placeId } = await params
  const bundle = requireBundle(placeId)
  return pageMeta({
    title: `Who decides? ${bundle.place.shortName}`,
    description: `The ${bundle.bodies.length} public bodies that make decisions for ${bundle.place.name}: members, terms, how to reach them, and how each one has voted on the record.`,
    path: `/place/${placeId}/officials`,
    image: `/place/${placeId}/opengraph-image`,
    keywords: ['council members', 'commissioners', 'board of education', bundle.place.shortName]
  })
}

export default async function OfficialsPage({ params }: { params: Promise<{ placeId: string }> }) {
  const { placeId } = await params
  const bundle = requireBundle(placeId)
  const { place } = bundle

  return (
    <>
      <JsonLd
        data={breadcrumbs([
          { name: 'Civicly', path: '/' },
          { name: place.name, path: `/place/${place.id}` },
          { name: 'Who decides?', path: `/place/${place.id}/officials` }
        ])}
      />
      <div className="screen__head">
        <p className="screen__eyebrow">{place.county}</p>
        <h1 className="screen__title">Who decides?</h1>
        <p className="screen__sub">
          {bundle.bodies.length} public bodies reach your address. Each has its own members, its own meetings, and its own slice of your tax bill.
        </p>
      </div>

      <div className="stack">
        {bundle.bodies.map((body) => {
          const members = bundle.officials.filter((o) => o.bodyId === body.id)
          const decided = bundle.measures.filter((m) => m.bodyId === body.id)
          return (
            <section key={body.id} className="body-block" aria-labelledby={`b-${body.id}`}>
              <div className="body-block__head">
                <h2 id={`b-${body.id}`} className="h2">{body.name}</h2>
                <p className="body-text">{body.governs}</p>
              </div>
              <dl className="body-block__facts">
                <div>
                  <dt>Meets</dt>
                  <dd>{body.cadence}</dd>
                </div>
                <div>
                  <dt>Where</dt>
                  <dd>{body.meetsWhere}</dd>
                </div>
                <div>
                  <dt>Contact</dt>
                  <dd>
                    <a href={`mailto:${body.clerkEmail}`}>{body.clerkName}</a>, <a href={`tel:${body.clerkPhone.replace(/[^\d]/g, '')}`}>{body.clerkPhone}</a>
                  </dd>
                </div>
              </dl>

              {members.length ? (
                <ul className="list">
                  {members.map((o) => {
                    const ballots = bundle.measures.flatMap((m) => (m.vote ? m.vote.ballots.filter((b) => b.officialId === o.id).map((b) => ({ m, b })) : []))
                    const dissents = ballots.filter(({ m, b }) => {
                      const yes = m.vote!.ballots.filter((x) => x.vote === 'yes').length
                      const majority = yes > m.vote!.ballots.length / 2 ? 'yes' : 'no'
                      return b.vote !== majority && b.vote !== 'absent'
                    })
                    return (
                      <li key={o.id} id={o.id}>
                        <div className="row">
                          <span className="row__main">
                            <span className="row__title">{o.name}</span>
                            <span className="row__meta">
                              {o.role} <span aria-hidden="true">&middot;</span> {o.seat}
                            </span>
                            <span className="row__meta">Term ends {fullDate(o.termEnds)}</span>
                            <span className="row__meta">{ballots.length ? `${ballots.length} votes on record` : 'No votes on record yet'}</span>
                            {dissents.length ? (
                              <span className="row__meta">
                                Voted against the majority on{' '}
                                {dissents.map(({ m }, i) => (
                                  <span key={m.id}>
                                    {i ? ', ' : ''}
                                    <Link href={`/place/${place.id}/measures/${m.id}`}>{m.fileNumber}</Link>
                                  </span>
                                ))}
                              </span>
                            ) : null}
                          </span>
                          <a href={`mailto:${o.email}`} className="btn btn--secondary btn--small">
                            Email
                          </a>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="body-text body-text--small">Individual members are not listed yet. Reach the whole board through the contact above.</p>
              )}

              <p className="body-block__foot">
                <Link href={`/place/${place.id}/measures?body=${body.id}`}>
                  {decided.length} {decided.length === 1 ? 'proposal' : 'proposals'} on record
                </Link>
                <span aria-hidden="true">&middot;</span>
                <span>{body.ratePer100.toFixed(3)} per $100 of assessed value</span>
              </p>
            </section>
          )
        })}
      </div>
    </>
  )
}
