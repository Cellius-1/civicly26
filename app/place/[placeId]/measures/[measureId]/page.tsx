import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ActPanel } from '@/components/ActPanel'
import { ContactPanel } from '@/components/ContactPanel'
import { JsonLd } from '@/components/JsonLd'
import { SaveButton } from '@/components/SaveButton'
import { Decoded } from '@/components/Decoded'
import { StageTrack } from '@/components/StageTrack'
import { bodyOf, getBundle, linesFor, listPlaceIds, measureOf, meetingFor, officialsOf, requireBundle } from '@/lib/registry'
import { lens as lensInfo } from '@/lib/lenses'
import { STAGES } from '@/lib/stages'
import { planContacts } from '@/lib/contacts'
import { costLabel } from '@/lib/receipt'
import { timeline } from '@/lib/agenda'
import { breadcrumbs, measureGraph } from '@/lib/schema'
import { pageMeta } from '@/lib/site'
import { clock, compactMoney, count, daysBetween, fullDate, longDate, percentChange, shortDate, signedPercent } from '@/lib/format'

export function generateStaticParams() {
  return listPlaceIds().flatMap((placeId) => requireBundle(placeId).measures.map((m) => ({ placeId, measureId: m.id })))
}

export async function generateMetadata({ params }: { params: Promise<{ placeId: string; measureId: string }> }) {
  const { placeId, measureId } = await params
  const bundle = getBundle(placeId)
  const m = bundle ? measureOf(bundle, measureId) : null
  if (!bundle || !m) return pageMeta({ title: 'Proposal not found', description: 'This record may have been renumbered or withdrawn.', path: `/place/${placeId}/measures` })
  const body = bodyOf(bundle, m.bodyId)
  return pageMeta({
    title: m.plainTitle,
    description: `${m.fileNumber} before the ${body.name}. ${m.plainSummary}`,
    path: `/place/${placeId}/measures/${m.id}`,
    keywords: [m.fileNumber, body.shortName, bundle.place.shortName, ...m.neighborhoods],
    published: m.history[0]?.date,
    modified: m.history[m.history.length - 1]?.date
  })
}

const DIRECTION: Record<string, string> = {
  spend: 'New spending',
  revenue: 'New money coming in',
  shift: 'Moves existing money',
  borrow: 'Borrowing'
}

export default async function MeasurePage({ params }: { params: Promise<{ placeId: string; measureId: string }> }) {
  const { placeId, measureId } = await params
  const bundle = requireBundle(placeId)
  const m = measureOf(bundle, measureId)
  if (!m) notFound()

  const { place } = bundle
  const body = bodyOf(bundle, m.bodyId)
  const meeting = meetingFor(bundle, m.id)
  const slot = meeting ? timeline(meeting).find((t) => t.item.measureId === m.id) ?? null : null
  const sponsors = officialsOf(bundle, m.sponsorIds)
  const members = bundle.officials.filter((o) => o.bodyId === body.id)
  const lines = linesFor(bundle, m.budgetLineIds)
  const info = STAGES[m.stage]
  const primary = lensInfo(m.lens)
  const contacts = planContacts(bundle, body, { measure: m, meeting: meeting ?? bundle.meetings.find((x) => x.agenda.some((a) => a.measureId === m.id)) ?? null })
  const closes = m.commentClosesOn ? daysBetween(place.asOf, m.commentClosesOn) : null

  const tally = m.vote
    ? m.vote.ballots.reduce<Record<string, number>>((acc, b) => ({ ...acc, [b.vote]: (acc[b.vote] ?? 0) + 1 }), {})
    : null

  const savedItem = {
    id: m.id,
    title: m.plainTitle,
    href: `/place/${place.id}/measures/${m.id}`,
    kind: 'measure' as const,
    note: m.commentClosesOn ? `Comment by ${shortDate(m.commentClosesOn)}` : info.label
  }

  return (
    <article className="measure">
      <JsonLd
        data={[
          measureGraph(bundle, m),
          breadcrumbs([
            { name: 'Civicly', path: '/' },
            { name: place.name, path: `/place/${place.id}` },
            { name: 'Proposals and votes', path: `/place/${place.id}/measures` },
            { name: m.plainTitle, path: `/place/${place.id}/measures/${m.id}` }
          ])
        ]}
      />
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href={`/place/${place.id}/measures`}>Proposals and votes</Link>
        <span aria-hidden="true">/</span>
        <Link href={`/place/${place.id}/measures?lens=${m.lens}`}>{primary.verb}</Link>
      </nav>

      <header className="measure__head">
        <p className="measure__file">
          <span className={`stamp${info.open ? '' : ' stamp--flat'}`}>{info.label}</span>
          {body.shortName} <span aria-hidden="true">&middot;</span> {m.fileNumber}
        </p>
        <h1 className="measure__title">{m.plainTitle}</h1>
        <p className="lede">{m.plainSummary}</p>
        <div className="measure__tools">
          <SaveButton placeId={place.id} item={savedItem} labels={['Save to my list', 'Saved to my list']} />
          <Link href={`/place/${place.id}/measures?show=open`} className="chip">
            Upcoming proposals
          </Link>
          <a href="#contact" className="chip">
            Who to contact
          </a>
        </div>
      </header>

      {closes !== null && closes >= 0 ? (
        <div className="cta">
          <span className="cta__label">
            {closes === 0 ? 'Last day to be heard is today' : closes === 1 ? 'Last day to be heard is tomorrow' : `${closes} days left to be heard`}
          </span>
          <div className="cta__row">
            <a className="btn btn--primary" href="#act">
              Write to officials
            </a>
            {meeting ? (
              <a className="btn btn--secondary" href={`/api/calendar/${place.id}/${meeting.id}`}>
                Add to calendar
              </a>
            ) : null}
          </div>
        </div>
      ) : null}

      <section className="measure__status" aria-labelledby="status-title">
        <div className="measure__status-text">
          <h2 id="status-title" className="h3">Where it stands</h2>
          <p>{info.plain}</p>
        </div>
        <StageTrack stage={m.stage} history={m.history} />
      </section>

      <div className="measure__grid">
        <div className="measure__body">
          <section className="block" aria-labelledby="changes-title">
            <h2 id="changes-title" className="h3">Changes that will happen</h2>
            <ul className="facts-list">
              {m.whatChanges.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </section>

          <section className="block" aria-labelledby="who-title">
            <h2 id="who-title" className="h3">Affected areas</h2>
            <p className="body-text">{m.whoNotices}</p>
            {m.neighborhoods.length ? (
              <p className="places">
                {m.neighborhoods.map((n) => (
                  <span key={n} className="places__name">{n}</span>
                ))}
              </p>
            ) : null}
          </section>

          {m.tension ? (
            <section className="block block--rule" aria-labelledby="tension-title">
              <h2 id="tension-title" className="h3">Major disagreement</h2>
              <p className="body-text">{m.tension}</p>
            </section>
          ) : null}

          <section className="block" aria-labelledby="money-title">
            <h2 id="money-title" className="h3">The money</h2>
            {m.fiscal ? (
              <>
                <dl className="figures">
                  <div>
                    <dt>{DIRECTION[m.fiscal.direction]}</dt>
                    <dd className="num">{m.fiscal.amount === 0 ? '$0' : compactMoney(Math.abs(m.fiscal.amount))}</dd>
                  </div>
                  <div>
                    <dt>For each {place.shortName} household</dt>
                    <dd className="num">{costLabel(bundle, m)}</dd>
                  </div>
                  <div>
                    <dt>How often</dt>
                    <dd>{m.fiscal.recurring ? 'Every year' : 'One time'}</dd>
                  </div>
                </dl>
                <p className="body-text body-text--small">{m.fiscal.note}</p>
              </>
            ) : (
              <p className="body-text">No cost estimate was published with this proposal. You can ask for one in your comment.</p>
            )}
            {lines.length ? (
              <ul className="linked-lines">
                {lines.map((l) => (
                  <li key={l.id}>
                    <Link href={`/place/${place.id}/budget#${l.id}`}>{l.plainLabel}</Link>
                    <span className="num">{compactMoney(l.amount)}</span>
                    <span className="linked-lines__change">{signedPercent(percentChange(l.amount, l.priorAmount))} from last year</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>

          <section className="block" aria-labelledby="official-title">
            <h2 id="official-title" className="h3">Official wording</h2>
            <Decoded text={m.officialTitle} className="official" />
          </section>

          <section className="block" aria-labelledby="history-title">
            <h2 id="history-title" className="h3">Every step so far</h2>
            <ol className="history">
              {[...m.history].reverse().map((h, i) => (
                <li key={`${h.stage}-${h.date}-${i}`}>
                  <span className="history__date">{fullDate(h.date)}</span>
                  <span className="history__stage">{STAGES[h.stage].label}</span>
                  <span className="history__note">{h.note}</span>
                </li>
              ))}
            </ol>
          </section>

          {m.vote && tally ? (
            <section className="block" aria-labelledby="vote-title">
              <h2 id="vote-title" className="h3">
                How they voted on {fullDate(m.vote.date)}
              </h2>
              <p className="tally">
                <span>{tally.yes ?? 0} yes</span>
                <span>{tally.no ?? 0} no</span>
                {tally.abstain ? <span>{tally.abstain} abstained</span> : null}
                {tally.absent ? <span>{tally.absent} absent</span> : null}
              </p>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Member</th>
                    <th scope="col">Role</th>
                    <th scope="col">Vote</th>
                  </tr>
                </thead>
                <tbody>
                  {m.vote.ballots.map((b) => {
                    const o = bundle.officials.find((x) => x.id === b.officialId)
                    return (
                      <tr key={b.officialId}>
                        <th scope="row">
                          <Link href={`/place/${place.id}/officials#${b.officialId}`}>{o?.name ?? b.officialId}</Link>
                        </th>
                        <td>{o?.role}</td>
                        <td>
                          <span className={`vote vote--${b.vote}`}>{b.vote.charAt(0).toUpperCase() + b.vote.slice(1)}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </section>
          ) : null}

          <div className="block">
            <ContactPanel plan={contacts} placeId={place.id} defaultNeed={info.voice === 'none' ? 'question' : 'view'} />
          </div>

          <section className="block" aria-labelledby="docs-title">
            <h2 id="docs-title" className="h3">Original documents</h2>
            <ul className="docs">
              {m.documents.map((d) => (
                <li key={d.label}>
                  <span className="docs__label">{d.label}</span>
                  <span className="docs__meta">
                    {d.kind.charAt(0).toUpperCase() + d.kind.slice(1).replace('-', ' ')}, {d.pages} {d.pages === 1 ? 'page' : 'pages'}
                  </span>
                </li>
              ))}
            </ul>
            {sponsors.length ? <p className="body-text body-text--small">Put forward by {sponsors.map((s) => `${s.role} ${s.name}`).join(' and ')}.</p> : null}
          </section>
        </div>

        <aside className="measure__act" id="act" aria-labelledby="act-title">
          <div className="act">
            <h2 id="act-title" className="act__title">
              {info.voice === 'none' ? 'This one is closed' : info.voice === 'low' ? 'It passed. You can still follow up.' : 'Make your voice count'}
            </h2>

            {closes !== null && closes >= 0 ? (
              <div className={`act__deadline${closes <= 1 ? ' is-urgent' : ''}`}>
                <span className="act__deadline-label">Last day to be heard</span>
                <span className="act__deadline-date">{longDate(m.commentClosesOn!)}</span>
              </div>
            ) : null}

            {meeting && slot ? (
              <div className="act__meeting">
                <p className="act__line">
                  <strong>{m.nextActionLabel}</strong> at the {longDate(meeting.startsAt)} meeting.
                </p>
                <p className="act__line">
                  Meeting starts {clock(meeting.startsAt)}. This item likely comes up around <strong>{clock(slot.startsAt.toISOString())}</strong>.
                </p>
                <p className="act__muted">{meeting.location}</p>
                <div className="act__buttons">
                  <Link href={`/place/${place.id}/meetings/${meeting.id}`} className="btn btn--secondary btn--small">
                    See the agenda
                  </Link>
                  <a href={`/api/calendar/${place.id}/${meeting.id}`} className="btn btn--secondary btn--small">
                    Add to calendar
                  </a>
                </div>
              </div>
            ) : m.nextActionLabel ? (
              <p className="act__line">
                Next: {m.nextActionLabel}
                {m.nextActionOn ? ` on ${longDate(m.nextActionOn)}` : ''}.
              </p>
            ) : null}

            {info.voice !== 'none' ? <ActPanel measure={m} body={body} meeting={meeting} members={members} /> : (
              <p className="act__line">A new version would have to be proposed from scratch. Writing to the sponsors is the usual first step.</p>
            )}
          </div>
        </aside>
      </div>

      <p className="measure__money-foot">
        Per household figures use {count(place.households)} households and are rounded. Township, fire, and library costs are split across {place.shortName} households, county and school costs by {place.shortName}&apos;s share of those budgets.
      </p>
    </article>
  )
}
