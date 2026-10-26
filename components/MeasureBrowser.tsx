'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { LENSES, lensLabel } from '@/lib/lenses'
import { STAGES, STAGE_FILTERS } from '@/lib/stages'
import { daysBetween, shortDate } from '@/lib/format'
import type { LensId, Measure } from '@/lib/types'
import { Icon } from './Icon'
import { SaveButton } from './SaveButton'
import { StageTrack } from './StageTrack'
import { usePrefs } from './usePrefs'

export interface MeasureRow {
  measure: Measure
  bodyShort: string
  costLabel: string
  meeting: { id: string; label: string; itemTime: string | null } | null
}

type SortId = 'soonest' | 'newest' | 'cost'

const SORTS: { id: SortId; label: string }[] = [
  { id: 'soonest', label: 'Soonest deadline' },
  { id: 'newest', label: 'Latest activity' },
  { id: 'cost', label: 'Biggest cost' }
]

export function MeasureBrowser({
  placeId,
  rows,
  bodies,
  neighborhoods,
  asOf
}: {
  placeId: string
  rows: MeasureRow[]
  bodies: { id: string; shortName: string }[]
  neighborhoods: string[]
  asOf: string
}) {
  const params = useSearchParams()
  const router = useRouter()
  const searchRef = useRef<HTMLInputElement>(null)
  const sheetRef = useRef<HTMLDialogElement>(null)
  const [text, setText] = useState('')
  const [sort, setSort] = useState<SortId>('soonest')
  const [open, setOpen] = useState<string[]>([])
  const { prefs, update } = usePrefs(placeId)

  const stageFilter = STAGE_FILTERS.find((f) => f.id === params.get('show')) ?? STAGE_FILTERS[3]
  const lens = (params.get('lens') as LensId | null) ?? null
  const body = params.get('body')
  const near = params.get('near')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (e.key !== '/' || (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return
      if (document.querySelector('dialog[open]')) return
      e.preventDefault()
      searchRef.current?.focus()
      searchRef.current?.select()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const set = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString())
    if (value) next.set(key, value)
    else next.delete(key)
    const qs = next.toString()
    router.replace(qs ? `?${qs}` : '?', { scroll: false })
  }

  const sheetCount = [lens, body, near].filter(Boolean).length + (sort === 'soonest' ? 0 : 1)
  const activeCount = sheetCount + (params.get('show') ? 1 : 0) + (text.trim() ? 1 : 0)

  const visible = useMemo(() => {
    const needle = text.trim().toLowerCase()
    const cost = (r: MeasureRow) => (r.measure.fiscal ? Math.abs(r.measure.fiscal.amount) : 0)
    return rows
      .filter(({ measure: m }) => stageFilter.stages.includes(m.stage))
      .filter(({ measure: m }) => !lens || m.lens === lens || m.alsoTouches.includes(lens))
      .filter(({ measure: m }) => !body || m.bodyId === body)
      .filter(({ measure: m }) => !near || !m.neighborhoods.length || m.neighborhoods.includes(near))
      .filter(({ measure: m }) =>
        !needle ||
        [m.plainTitle, m.plainSummary, m.officialTitle, m.fileNumber, ...m.neighborhoods].some((f) => f.toLowerCase().includes(needle))
      )
      .sort((a, b) => {
        if (sort === 'cost') return cost(b) - cost(a)
        if (sort === 'newest') {
          return b.measure.history[b.measure.history.length - 1].date.localeCompare(a.measure.history[a.measure.history.length - 1].date)
        }
        const ao = STAGES[a.measure.stage].open ? 0 : 1
        const bo = STAGES[b.measure.stage].open ? 0 : 1
        if (ao !== bo) return ao - bo
        const ad = a.measure.commentClosesOn ?? a.measure.nextActionOn ?? '9999'
        const bd = b.measure.commentClosesOn ?? b.measure.nextActionOn ?? '9999'
        return ad.localeCompare(bd)
      })
  }, [rows, stageFilter, lens, body, near, text, sort])

  const clearAll = () => {
    setText('')
    setSort('soonest')
    router.replace('?', { scroll: false })
  }

  return (
    <div className="browser">
      <div className="filters">
        <div className="filters__bar">
          <span className="input-wrap">
            <span className="input-wrap__icon">
              <Icon name="search" size={18} />
            </span>
            <input
              ref={searchRef}
              className="input"
              type="search"
              aria-label="Search proposals"
              placeholder="Street, topic, or file number"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </span>
          <button type="button" className="iconbtn" onClick={() => sheetRef.current?.showModal()} aria-label={`Filters, ${sheetCount} active`}>
            <Icon name="filter" />
            {sheetCount ? <span className="filters__count">{sheetCount}</span> : null}
          </button>
        </div>

        <div className="chipbar" role="radiogroup" aria-label="Status">
          {STAGE_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="radio"
              aria-checked={f.id === stageFilter.id}
              className={`chip${f.id === stageFilter.id ? ' is-on' : ''}`}
              onClick={() => set('show', f.id === 'all' ? null : f.id)}
            >
              {f.label}
              <span className="chip__n">{rows.filter((r) => f.stages.includes(r.measure.stage)).length}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="browser__bar">
        <p className="browser__count" aria-live="polite">
          {visible.length} {visible.length === 1 ? 'result' : 'results'}
          {lens ? `, ${lensLabel(lens).toLowerCase()}` : ''}
          {near ? `, near ${near}` : ''}
        </p>
        <div className="browser__tools">
          <button type="button" className="linkish" onClick={() => setOpen(open.length ? [] : visible.map((v) => v.measure.id))}>
            {open.length ? 'Collapse' : 'Expand all'}
          </button>
          {activeCount ? (
            <button type="button" className="linkish" onClick={clearAll}>
              Clear filters
            </button>
          ) : null}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="empty">
          <p>No proposals match these filters.</p>
          <button type="button" className="btn btn--secondary" onClick={clearAll}>
            Clear filters
          </button>
        </div>
      ) : (
        <ul className="ledger">
          {visible.map(({ measure: m, bodyShort, costLabel, meeting }) => {
            const closes = m.commentClosesOn ? daysBetween(asOf, m.commentClosesOn) : null
            const expanded = open.includes(m.id)
            const href = `/place/${placeId}/measures/${m.id}`
            return (
              <li key={m.id} className={`ledger__row${expanded ? ' is-open' : ''}`}>
                <div className="ledger__main">
                  <p className="ledger__file">
                    <span className={`stamp${STAGES[m.stage].open ? '' : ' stamp--flat'}`}>{STAGES[m.stage].label}</span>
                    {bodyShort} <span aria-hidden="true">&middot;</span> {m.fileNumber}
                    {m.neighborhoods.length ? <span className="ledger__hood">{m.neighborhoods.join(', ')}</span> : null}
                  </p>
                  <h2 className="ledger__title">
                    <Link href={href}>{m.plainTitle}</Link>
                  </h2>
                  <p className="ledger__summary">{m.plainSummary}</p>
                </div>

                <dl className="ledger__facts">
                  <div>
                    <dt>{closes !== null && closes >= 0 ? 'Comment by' : m.nextActionOn ? 'Next step' : 'Last step'}</dt>
                    <dd className={closes !== null && closes >= 0 && closes <= 2 ? 'is-urgent' : ''}>
                      {closes !== null && closes >= 0
                        ? `${shortDate(m.commentClosesOn!)}${closes <= 7 ? ` (${closes === 0 ? 'today' : closes === 1 ? 'tomorrow' : `${closes} days`})` : ''}`
                        : m.nextActionOn
                          ? shortDate(m.nextActionOn)
                          : m.nextActionLabel ?? shortDate(m.history[m.history.length - 1].date)}
                    </dd>
                  </div>
                  <div>
                    <dt>Per household</dt>
                    <dd className="num">{costLabel}</dd>
                  </div>
                  <div>
                    <dt>Progress</dt>
                    <dd>
                      <StageTrack stage={m.stage} history={m.history} compact />
                    </dd>
                  </div>
                </dl>

                <div className="ledger__actions">
                  <button
                    type="button"
                    className="ledger__toggle"
                    aria-expanded={expanded}
                    aria-controls={`peek-${m.id}`}
                    onClick={() => setOpen(expanded ? open.filter((x) => x !== m.id) : [...open, m.id])}
                  >
                    {expanded ? 'Hide details' : 'Quick look'}
                  </button>
                  <SaveButton
                    placeId={placeId}
                    item={{
                      id: m.id,
                      title: m.plainTitle,
                      href,
                      kind: 'measure',
                      note: m.commentClosesOn ? `Comment by ${shortDate(m.commentClosesOn)}` : STAGES[m.stage].label
                    }}
                    labels={['Save', 'Saved']}
                  />
                </div>

                <div id={`peek-${m.id}`} className="peek" hidden={!expanded}>
                  <p className="peek__head">Changes that will happen</p>
                  <ul className="facts-list">
                    {m.whatChanges.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                  {meeting ? (
                    <p className="peek__meeting">
                      Heard at the <Link href={`/place/${placeId}/meetings/${meeting.id}`}>{meeting.label}</Link>
                      {meeting.itemTime ? `, around ${meeting.itemTime}` : ''}.
                    </p>
                  ) : null}
                  <div className="peek__links">
                    <Link href={`${href}#act`} className="btn btn--secondary btn--small">
                      Write to officials
                    </Link>
                    {meeting ? (
                      <a href={`/api/calendar/${placeId}/${meeting.id}`} className="btn btn--secondary btn--small">
                        Add to calendar
                      </a>
                    ) : null}
                    <Link href={href} className="btn btn--secondary btn--small">
                      Full record
                    </Link>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <dialog ref={sheetRef} className="sheet" aria-label="Filter proposals">
        <div className="sheet__inner">
          <span className="sheet__grip" aria-hidden="true" />
          <div className="sheet__head">
            <h2 className="sheet__title">Filters</h2>
            <button type="button" className="sheet__close" onClick={() => sheetRef.current?.close()}>
              Close
            </button>
          </div>
          <div className="sheet__body">
            <label className="field">
              <span className="field__label">Topic</span>
              <select className="select" value={lens ?? ''} onChange={(e) => set('lens', e.target.value || null)}>
                <option value="">All topics</option>
                {LENSES.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.verb}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="field__label">Decided by</span>
              <select className="select" value={body ?? ''} onChange={(e) => set('body', e.target.value || null)}>
                <option value="">All governments</option>
                {bodies.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.shortName}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="field__label">Sort by</span>
              <select className="select" value={sort} onChange={(e) => setSort(e.target.value as SortId)}>
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="filters__near">
              <span className="field__label">My part of town</span>
              <ul className="chips">
                {neighborhoods.map((n) => (
                  <li key={n}>
                    <button
                      type="button"
                      className={`chip${near === n ? ' is-on' : ''}`}
                      aria-pressed={near === n}
                      onClick={() => {
                        const value = near === n ? null : n
                        set('near', value)
                        update({ neighborhood: value })
                      }}
                    >
                      {n}
                    </button>
                  </li>
                ))}
              </ul>
              {prefs.neighborhood && near !== prefs.neighborhood ? (
                <button type="button" className="chip chip--hint" onClick={() => set('near', prefs.neighborhood)}>
                  Use my saved area: {prefs.neighborhood}
                </button>
              ) : null}
            </div>
          </div>
          <div className="sheet__foot">
            <button type="button" className="btn btn--quiet" onClick={clearAll}>
              Reset
            </button>
            <button type="button" className="btn btn--primary" onClick={() => sheetRef.current?.close()}>
              Show {visible.length} {visible.length === 1 ? 'result' : 'results'}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  )
}
