'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { lensLabel, LENSES } from '@/lib/lenses'
import { shortDate } from '@/lib/format'
import { toast } from '@/lib/toast'
import type { Signal } from '@/lib/types'
import { usePrefs } from './usePrefs'

const READERS = [
  { name: 'NetNewsWire', note: 'Free on iPhone, iPad, and Mac' },
  { name: 'Feedly or Inoreader', note: 'Work in any browser and on Android' },
  { name: 'Thunderbird', note: 'Reads feeds next to your email on a computer' }
]

export function FeedPanel({ placeId, placeName, signals, meetings }: { placeId: string; placeName: string; signals: Signal[]; meetings: { id: string; label: string }[] }) {
  const { prefs, ready } = usePrefs(placeId)
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const path = useMemo(() => {
    const q = new URLSearchParams()
    if (prefs.lenses.length) q.set('topics', prefs.lenses.join(','))
    if (prefs.neighborhood) q.set('neighborhood', prefs.neighborhood)
    const s = q.toString()
    return `/api/feed/${placeId}${s ? `?${s}` : ''}`
  }, [placeId, prefs])

  const address = `${origin}${path}`

  const entries = useMemo(
    () =>
      signals
        .filter((s) => !prefs.lenses.length || prefs.lenses.includes(s.lens))
        .filter((s) => !prefs.neighborhood || !s.neighborhoods.length || s.neighborhoods.includes(prefs.neighborhood))
        .slice(0, 8),
    [signals, prefs]
  )

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address)
      toast('Feed address copied')
    } catch {
      toast('Select the address and copy it')
    }
  }

  return (
    <div className="stack">
      <section className="card" aria-labelledby="address-title">
        <h2 id="address-title" className="h3">Your feed address</h2>
        <p className="body-text body-text--small">
          {ready && prefs.lenses.length
            ? `Filtered to ${prefs.lenses.map(lensLabel).join(', ').toLowerCase()}${prefs.neighborhood ? `, near ${prefs.neighborhood}` : ''}.`
            : `Everything happening in ${placeName}. Choose topics on the alerts screen to narrow it.`}
        </p>
        <input className="input input--mono" readOnly value={address} aria-label="Feed address" onFocus={(e) => e.currentTarget.select()} />
        <div className="cta__row">
          <button type="button" className="btn btn--primary" onClick={copy}>
            Copy address
          </button>
          <Link href={`/place/${placeId}/follow`} className="btn btn--secondary">
            Change topics
          </Link>
        </div>
      </section>

      <section className="card" aria-labelledby="how-title">
        <h2 id="how-title" className="h3">How to use it</h2>
        <p className="body-text body-text--small">
          A feed reader checks this address for you and shows new entries as they appear. Nothing is sent to us, and no account or email address is involved.
        </p>
        <ul className="list">
          {READERS.map((r) => (
            <li key={r.name}>
              <div className="row">
                <span className="row__main">
                  <span className="row__title">{r.name}</span>
                  <span className="row__meta">{r.note}</span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="entries-title">
        <div className="section-head">
          <h2 id="entries-title" className="h2">In the feed right now</h2>
          <p className="section-head__note">{entries.length} entries match your choices.</p>
        </div>
        {entries.length ? (
          <ol className="feed__list">
            {entries.map((s, i) => (
              <li key={s.id} className="feed__item" style={{ ['--i' as string]: i }}>
                <div className="feed__meta">
                  <span className={`kind kind--${s.kind}`}>{lensLabel(s.lens)}</span>
                  <span className="feed__date">{shortDate(s.date)}</span>
                </div>
                <Link href={s.href} className="feed__headline">
                  {s.headline}
                </Link>
                <p className="feed__detail">{s.detail}</p>
              </li>
            ))}
          </ol>
        ) : (
          <div className="empty">
            <p>Nothing matches these topics today. The feed stays quiet until something does.</p>
            <Link href={`/place/${placeId}/follow`} className="btn btn--secondary">
              Widen my topics
            </Link>
          </div>
        )}
      </section>

      <section className="card card--paper" aria-labelledby="also-title">
        <h2 id="also-title" className="h3">Other ways to get this</h2>
        <ul className="list">
          {meetings.map((m) => (
            <li key={m.id}>
              <a className="row" href={`/api/calendar/${placeId}/${m.id}`}>
                <span className="row__main">
                  <span className="row__title">{m.label}</span>
                  <span className="row__meta">Calendar file with the agenda and a reminder the day before</span>
                </span>
              </a>
            </li>
          ))}
          <li>
            <a className="row" href={path}>
              <span className="row__main">
                <span className="row__title">Raw XML</span>
                <span className="row__meta">The same feed as your reader sees it, for developers</span>
              </span>
            </a>
          </li>
        </ul>
      </section>

      <p className="body-text body-text--small">
        Topics available: {LENSES.map((l) => l.label.toLowerCase()).join(', ')}.
      </p>
    </div>
  )
}
