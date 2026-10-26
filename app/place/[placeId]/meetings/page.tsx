import Link from 'next/link'
import { JsonLd } from '@/components/JsonLd'
import { bodyOf, requireBundle } from '@/lib/registry'
import { breadcrumbs, meetingGraph } from '@/lib/schema'
import { pageMeta } from '@/lib/site'
import { runtimeMinutes } from '@/lib/agenda'
import { clock, daysBetween, longDate, relativeDay } from '@/lib/format'

export async function generateMetadata({ params }: { params: Promise<{ placeId: string }> }) {
  const { placeId } = await params
  const bundle = requireBundle(placeId)
  const upcoming = bundle.meetings.filter((m) => m.status === 'upcoming').length
  return pageMeta({
    title: `Public meetings in ${bundle.place.shortName}`,
    description: `${upcoming} upcoming township, county, school board, and library meetings, each with a plain English agenda, estimated times for every item, and instructions for speaking.`,
    path: `/place/${placeId}/meetings`,
    image: `/place/${placeId}/opengraph-image`,
    keywords: ['public meeting', 'agenda', 'council meeting', bundle.place.shortName]
  })
}

export default async function MeetingsPage({ params }: { params: Promise<{ placeId: string }> }) {
  const { placeId } = await params
  const bundle = requireBundle(placeId)
  const { place } = bundle

  const upcoming = bundle.meetings.filter((m) => m.status === 'upcoming').sort((a, b) => a.startsAt.localeCompare(b.startsAt))
  const held = bundle.meetings.filter((m) => m.status === 'held').sort((a, b) => b.startsAt.localeCompare(a.startsAt))

  return (
    <>
      <JsonLd
        data={[
          ...upcoming.map((m) => meetingGraph(bundle, m)),
          breadcrumbs([
            { name: 'Civicly', path: '/' },
            { name: place.name, path: `/place/${place.id}` },
            { name: 'Meetings', path: `/place/${place.id}/meetings` }
          ])
        ]}
      />
      <div className="screen__head">
        <p className="screen__eyebrow">{place.shortName}</p>
        <h1 className="screen__title">Meetings</h1>
        <p className="screen__sub">
          All agendas, with estimated times.
        </p>
      </div>

      <section aria-labelledby="up-title">
        <h2 id="up-title" className="label-head">Coming up</h2>
        <ol className="calendar">
          {upcoming.map((m) => {
            const body = bodyOf(bundle, m.bodyId)
            const d = daysBetween(place.asOf, m.startsAt)
            const hearings = m.agenda.filter((a) => a.commentAllowed)
            return (
              <li key={m.id} className="calendar__row">
                <div className="calendar__date" aria-hidden="true">
                  <span className="calendar__month">{new Date(m.startsAt).toLocaleDateString('en-US', { month: 'short', timeZone: 'America/New_York' })}</span>
                  <span className="calendar__day">{new Date(m.startsAt).toLocaleDateString('en-US', { day: 'numeric', timeZone: 'America/New_York' })}</span>
                </div>
                <div className="calendar__body">
                  <p className="calendar__when">
                    <span className={d <= 1 ? 'is-urgent' : ''}>{relativeDay(place.asOf, m.startsAt)}</span>, {longDate(m.startsAt)} at {clock(m.startsAt)}
                  </p>
                  <h3 className="calendar__title">
                    <Link href={`/place/${place.id}/meetings/${m.id}`}>{body.name}</Link>
                  </h3>
                  <p className="calendar__sub">{m.title}. About {Math.round(runtimeMinutes(m) / 15) * 15} minutes.</p>
                  <ul className="calendar__items">
                    {m.agenda.filter((a) => a.action !== 'consent').map((a) => (
                      <li key={a.id}>{a.plainTitle}</li>
                    ))}
                  </ul>
                </div>
                <div className="calendar__side">
                  <p className="calendar__speak">{hearings.length ? `${hearings.length} ${hearings.length === 1 ? 'chance' : 'chances'} to speak` : 'No public comment'}</p>
                  <a href={`/api/calendar/${place.id}/${m.id}`} className="btn btn--secondary btn--small">
                    Add to calendar
                  </a>
                </div>
              </li>
            )
          })}
        </ol>
      </section>

      {held.length ? (
        <section aria-labelledby="held-title" className="band-inline">
          <h2 id="held-title" className="label-head">Recently held</h2>
          <ol className="calendar calendar--past">
            {held.map((m) => (
              <li key={m.id} className="calendar__row">
                <div className="calendar__date" aria-hidden="true">
                  <span className="calendar__month">{new Date(m.startsAt).toLocaleDateString('en-US', { month: 'short', timeZone: 'America/New_York' })}</span>
                  <span className="calendar__day">{new Date(m.startsAt).toLocaleDateString('en-US', { day: 'numeric', timeZone: 'America/New_York' })}</span>
                </div>
                <div className="calendar__body">
                  <h3 className="calendar__title">
                    <Link href={`/place/${place.id}/meetings/${m.id}`}>
                      {bodyOf(bundle, m.bodyId).name}, {m.title.toLowerCase()}
                    </Link>
                  </h3>
                  {m.outcome ? <p className="calendar__sub">{m.outcome}</p> : null}
                </div>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </>
  )
}
