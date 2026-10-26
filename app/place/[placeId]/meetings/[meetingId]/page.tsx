import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ContactPanel } from '@/components/ContactPanel'
import { Decoded } from '@/components/Decoded'
import { JsonLd } from '@/components/JsonLd'
import { SaveButton } from '@/components/SaveButton'
import { bodyOf, getBundle, listPlaceIds, measureOf, meetingOf, requireBundle } from '@/lib/registry'
import { roundToQuarter, runtimeMinutes, timeline } from '@/lib/agenda'
import { ACTIONS, STAGES } from '@/lib/stages'
import { planContacts } from '@/lib/contacts'
import { lensLabel } from '@/lib/lenses'
import { breadcrumbs, meetingGraph } from '@/lib/schema'
import { pageMeta } from '@/lib/site'
import { clock, daysBetween, longDate, relativeDay, shortDate } from '@/lib/format'

export function generateStaticParams() {
  return listPlaceIds().flatMap((placeId) => requireBundle(placeId).meetings.map((m) => ({ placeId, meetingId: m.id })))
}

export async function generateMetadata({ params }: { params: Promise<{ placeId: string; meetingId: string }> }) {
  const { placeId, meetingId } = await params
  const bundle = getBundle(placeId)
  const m = bundle ? meetingOf(bundle, meetingId) : null
  if (!bundle || !m) return pageMeta({ title: 'Meeting not found', description: 'This meeting may have been rescheduled.', path: `/place/${placeId}/meetings` })
  const body = bodyOf(bundle, m.bodyId)
  const speakable = m.agenda.filter((a) => a.commentAllowed).length
  return pageMeta({
    title: `${body.shortName} meeting, ${longDate(m.startsAt)}`,
    description: `${body.name} meets ${longDate(m.startsAt)} at ${clock(m.startsAt)}, ${m.location}. ${m.agenda.length} agenda items in plain English${speakable ? `, ${speakable} open to public comment` : ''}.`,
    path: `/place/${placeId}/meetings/${m.id}`,
    image: `/place/${placeId}/opengraph-image`,
    keywords: [body.shortName, 'agenda', 'public comment', bundle.place.shortName]
  })
}

export default async function MeetingPage({ params }: { params: Promise<{ placeId: string; meetingId: string }> }) {
  const { placeId, meetingId } = await params
  const bundle = requireBundle(placeId)
  const meeting = meetingOf(bundle, meetingId)
  if (!meeting) notFound()

  const { place } = bundle
  const body = bodyOf(bundle, meeting.bodyId)
  const slots = timeline(meeting)
  const held = meeting.status === 'held'
  const d = daysBetween(place.asOf, meeting.startsAt)
  const contacts = planContacts(bundle, body, { meeting })
  const end = new Date(new Date(meeting.startsAt).getTime() + runtimeMinutes(meeting) * 60000)

  return (
    <article className="meeting">
      <JsonLd
        data={[
          meetingGraph(bundle, meeting),
          breadcrumbs([
            { name: 'Civicly', path: '/' },
            { name: place.name, path: `/place/${place.id}` },
            { name: 'Meetings', path: `/place/${place.id}/meetings` },
            { name: `${body.shortName}, ${shortDate(meeting.startsAt)}`, path: `/place/${place.id}/meetings/${meeting.id}` }
          ])
        ]}
      />
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href={`/place/${place.id}/meetings`}>Meetings</Link>
      </nav>

      <header className="meeting__head">
        <p className="measure__file">{body.name}</p>
        <h1 className="h1">
          {meeting.title}, {longDate(meeting.startsAt)}
        </h1>
        <dl className="figures figures--wide">
          <div>
            <dt>{held ? 'Held' : relativeDay(place.asOf, meeting.startsAt)}</dt>
            <dd>
              {clock(meeting.startsAt)} to about {clock(roundToQuarter(end).toISOString())}
            </dd>
          </div>
          <div>
            <dt>Where</dt>
            <dd>{meeting.location}</dd>
          </div>
          <div>
            <dt>Watch</dt>
            <dd>{meeting.watch}</dd>
          </div>
        </dl>
        {!held ? (
          <div className="meeting__actions">
            <a href={`/api/calendar/${place.id}/${meeting.id}`} className="btn btn--primary">
              Add to my calendar
            </a>
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(meeting.location)}`} className="btn btn--secondary" target="_blank" rel="noreferrer">
              Get directions
            </a>
            <a href="#contact" className="btn btn--secondary">
              Who to contact
            </a>
            <SaveButton
              placeId={place.id}
              item={{ id: meeting.id, title: `${body.shortName} meeting`, href: `/place/${place.id}/meetings/${meeting.id}`, kind: 'meeting', note: `${longDate(meeting.startsAt)}, ${clock(meeting.startsAt)}` }}
            />
          </div>
        ) : null}
      </header>

      {held && meeting.outcome ? (
        <section className="outcome" aria-labelledby="outcome-title">
          <h2 id="outcome-title" className="h3">What happened</h2>
          <p className="body-text">{meeting.outcome}</p>
        </section>
      ) : null}

      <div className="meeting__grid">
        <section aria-labelledby="agenda-title">
          <h2 id="agenda-title" className="h3">
            {held ? 'What was on the agenda' : 'What will be discussed'}
          </h2>
          {!held ? <p className="body-text body-text--small">All times are estimates based on typical times.</p> : null}
          <ol className="rail">
            {slots.map(({ item, startsAt }, i) => {
              const measure = item.measureId ? measureOf(bundle, item.measureId) : null
              return (
                <li key={item.id} className={`rail__item${item.commentAllowed ? ' rail__item--speak' : ''}`} style={{ ['--i' as string]: i }}>
                  <span className="rail__time">{held ? `Item ${item.order}` : clock(roundToQuarter(startsAt).toISOString())}</span>
                  <div className="rail__body">
                    <p className="rail__action">
                      {ACTIONS[item.action]}
                      {item.commentAllowed ? <span className="rail__speak">Public can speak</span> : null}
                    </p>
                    <h3 className="rail__title">{measure ? <Link href={`/place/${place.id}/measures/${measure.id}`}>{item.plainTitle}</Link> : item.plainTitle}</h3>
                    {measure ? (
                      <p className="rail__summary">
                        {measure.plainSummary} <span className="rail__stage">Currently: {STAGES[measure.stage].label.toLowerCase()}.</span>
                      </p>
                    ) : null}
                    <details className="rail__official">
                      <summary>Official agenda wording</summary>
                      <Decoded text={item.officialTitle} />
                    </details>
                    <p className="rail__lens">{lensLabel(item.lens)}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </section>

        <aside className="meeting__side">
          <div className="panel">
            <ContactPanel plan={contacts} placeId={place.id} defaultNeed={held ? 'question' : 'attend'} />
          </div>
          <div className="panel">
            <p className="panel__eyebrow">How to speak</p>
            <p className="panel__line">{meeting.commentInstructions}</p>
            {meeting.commentSignupClosesAt && !held ? (
              <p className={`panel__deadline${d <= 1 ? ' is-urgent' : ''}`}>
                Sign up by {clock(meeting.commentSignupClosesAt)} on {longDate(meeting.commentSignupClosesAt)}
              </p>
            ) : null}
            <p className="panel__subhead">Cannot attend?</p>
            <p className="panel__line">
              Email {body.clerkName.toLowerCase()} at <a href={`mailto:${body.clerkEmail}?subject=${encodeURIComponent(`Public comment for ${longDate(meeting.startsAt)} meeting`)}`}>{body.clerkEmail}</a> and ask for it to be read into the record.
            </p>
          </div>
          <div className="panel panel--paper">
            <p className="panel__eyebrow">First time going?</p>
            <ul className="plain-list">
              <li>You do not need to live in town to attend. You usually do need to give your name and street to speak.</li>
              <li>Speak to the whole board, not one member. Say your name, your street, and the item.</li>
              <li>Members rarely answer questions during public comment. Ask for a written reply.</li>
              <li>Consent items pass together in one vote. Ask before the meeting if you want one discussed on its own.</li>
            </ul>
          </div>
        </aside>
      </div>
    </article>
  )
}
