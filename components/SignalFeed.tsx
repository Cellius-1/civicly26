'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { lensLabel } from '@/lib/lenses'
import { shortDate } from '@/lib/format'
import type { Signal } from '@/lib/types'
import { usePrefs } from './usePrefs'

const KIND: Record<Signal['kind'], string> = {
  'comment-closing': 'Deadline',
  'meeting-soon': 'Meeting',
  'budget-change': 'Budget',
  'newly-filed': 'New proposal',
  adopted: 'Decided',
  'vote-scheduled': 'Vote set'
}

export function SignalFeed({ placeId, placeName, signals, neighborhoods }: { placeId: string; placeName: string; signals: Signal[]; neighborhoods: string[] }) {
  const { prefs, update, previousVisit, ready } = usePrefs(placeId, true)
  const [onlyNew, setOnlyNew] = useState(false)

  const shown = useMemo(() => {
    let list = signals
    if (prefs.neighborhood) {
      list = [...list].sort((a, b) => Number(b.neighborhoods.includes(prefs.neighborhood!)) - Number(a.neighborhoods.includes(prefs.neighborhood!)))
    }
    if (prefs.lenses.length) list = list.filter((s) => prefs.lenses.includes(s.lens))
    if (onlyNew && previousVisit) list = list.filter((s) => s.date > previousVisit)
    return list
  }, [signals, prefs, onlyNew, previousVisit])

  return (
    <section aria-labelledby="feed-title" className="feed">
      <div className="feed__head">
        <h2 id="feed-title" className="h2">What&apos;s happening this week</h2>
        <div className="feed__controls">
          <label className="field field--inline">
            <span className="field__label">My neighborhood</span>
            <select className="select" value={prefs.neighborhood ?? ''} onChange={(e) => update({ neighborhood: e.target.value || null })}>
              <option value="">All of {placeName}</option>
              {neighborhoods.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          {ready && previousVisit ? (
            <label className="check">
              <input type="checkbox" checked={onlyNew} onChange={(e) => setOnlyNew(e.target.checked)} />
              <span>Only since my last visit</span>
            </label>
          ) : null}
        </div>
      </div>
      {prefs.lenses.length ? (
        <p className="feed__filtering">
          Showing the topics you follow: {prefs.lenses.map(lensLabel).join(', ')}.{' '}
          <button type="button" className="linkish" onClick={() => update({ lenses: [] })}>
            Show everything
          </button>
        </p>
      ) : null}
      {shown.length === 0 ? (
        <p className="empty">Nothing new here since your last visit.</p>
      ) : (
        <ol className="feed__list">
          {shown.map((s, i) => {
            const local = prefs.neighborhood && s.neighborhoods.includes(prefs.neighborhood)
            return (
              <li key={s.id} className="feed__item" style={{ ['--i' as string]: i }}>
                <div className="feed__meta">
                  <span className={`kind kind--${s.kind}`}>{KIND[s.kind]}</span>
                  <span className="feed__date">{shortDate(s.date)}</span>
                </div>
                <div>
                  <Link href={s.href} className="feed__headline">
                    {s.headline}
                  </Link>
                  <p className="feed__detail">{s.detail}</p>
                  <p className="feed__tags">
                    {lensLabel(s.lens)}
                    {local ? <span className="feed__local">Affects {prefs.neighborhood}</span> : null}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}
