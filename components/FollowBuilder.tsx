'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { LENSES } from '@/lib/lenses'
import type { LensId } from '@/lib/types'
import { usePrefs } from './usePrefs'

export function FollowBuilder({ placeId, placeName, neighborhoods, meetings }: { placeId: string; placeName: string; neighborhoods: string[]; meetings: { id: string; label: string }[] }) {
  const { prefs, update, ready } = usePrefs(placeId)
  const [copied, setCopied] = useState(false)

  const toggle = (id: LensId) => update({ lenses: prefs.lenses.includes(id) ? prefs.lenses.filter((x) => x !== id) : [...prefs.lenses, id] })

  const feedPath = useMemo(() => {
    const q = new URLSearchParams()
    if (prefs.lenses.length) q.set('topics', prefs.lenses.join(','))
    if (prefs.neighborhood) q.set('neighborhood', prefs.neighborhood)
    const s = q.toString()
    return `/api/feed/${placeId}${s ? `?${s}` : ''}`
  }, [placeId, prefs])

  const copyFeed = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${feedPath}`)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2400)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="follow">
      <div className="follow__choose">
        <fieldset className="letter__set">
          <legend className="h3">What do you care about?</legend>
          <ul className="topic-grid">
            {LENSES.map((l) => {
              const on = prefs.lenses.includes(l.id)
              return (
                <li key={l.id}>
                  <label className={`topic${on ? ' is-on' : ''}`}>
                    <input type="checkbox" className="topic__box" checked={on} onChange={() => toggle(l.id)} disabled={!ready} />
                    <span className="topic__verb">{l.verb}</span>
                    <span className="topic__covers">{l.covers}</span>
                  </label>
                </li>
              )
            })}
          </ul>
        </fieldset>

        <label className="field">
          <span className="h3">Where do you live?</span>
          <select className="select" value={prefs.neighborhood ?? ''} onChange={(e) => update({ neighborhood: e.target.value || null })} disabled={!ready}>
            <option value="">Anywhere in {placeName}</option>
            {neighborhoods.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span className="field__help">You will only get notifications for the whole town and your neighborhood specifically.</span>
        </label>

        <section className="follow__channels" aria-labelledby="channels-title">
          <h2 id="channels-title" className="h3">How to get it</h2>
          <ul className="channels">
            <li>
              <div>
                <p className="channels__name">News reader or feed app</p>
                <p className="channels__desc">
                  Copy the feed address and paste it into Feedly, NetNewsWire, or Thunderbird, and it will update automatically.
                </p>
              </div>
              <div className="channels__actions">
                <button type="button" className="btn btn--primary btn--small" onClick={copyFeed}>
                  {copied ? 'Copied' : 'Copy feed address'}
                </button>
                <Link className="btn btn--secondary btn--small" href={`/place/${placeId}/feed`}>
                  How it works
                </Link>
              </div>
            </li>
            <li>
              <div>
                <p className="channels__name">Calendar</p>
                <p className="channels__desc">Add a meeting with the agenda and a reminder the day before.</p>
              </div>
              <ul className="channels__meetings">
                {meetings.map((m) => (
                  <li key={m.id}>
                    <a href={`/api/calendar/${placeId}/${m.id}`}>{m.label}</a>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
          <p className="field__help">Your choices are saved in this browser only. We do not ask for an email address or track what you read.</p>
        </section>
      </div>

    </div>
  )
}
