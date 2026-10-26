'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { LENSES } from '@/lib/lenses'
import { compactMoney, fullDate, percentChange, signedPercent } from '@/lib/format'
import type { BudgetLine, Snapshot } from '@/lib/types'

export interface BudgetRow {
  line: BudgetLine
  bodyShort: string
  bodyKind: string
  clerkEmail: string
  snapshots: Snapshot[]
  related: { id: string; title: string; href: string }[]
}

type SortId = 'size' | 'change'

export function BudgetExplorer({ placeName, rows, bodies }: { placeName: string; rows: BudgetRow[]; bodies: { id: string; shortName: string }[] }) {
  const [body, setBody] = useState('')
  const [sort, setSort] = useState<SortId>('size')
  const [text, setText] = useState('')
  const [official, setOfficial] = useState(false)
  const [open, setOpen] = useState<string[]>([])

  const filtered = useMemo(() => {
    const needle = text.trim().toLowerCase()
    return rows
      .filter((r) => !body || r.line.bodyId === body)
      .filter((r) => !needle || [r.line.plainLabel, r.line.officialLabel, r.line.note, r.bodyShort].some((f) => f.toLowerCase().includes(needle)))
  }, [rows, body, text])

  const groups = useMemo(() => {
    return LENSES.map((lens) => {
      const lines = filtered
        .filter((r) => r.line.lensId === lens.id)
        .sort((a, b) =>
          sort === 'size'
            ? b.line.amount - a.line.amount
            : percentChange(b.line.amount, b.line.priorAmount) - percentChange(a.line.amount, a.line.priorAmount)
        )
      return { lens, lines, total: lines.reduce((s, r) => s + r.line.amount, 0), prior: lines.reduce((s, r) => s + r.line.priorAmount, 0) }
    }).filter((g) => g.lines.length)
  }, [filtered, sort])

  const biggest = Math.max(1, ...filtered.map((r) => r.line.amount))
  const total = filtered.reduce((s, r) => s + r.line.amount, 0)
  const prior = filtered.reduce((s, r) => s + r.line.priorAmount, 0)

  return (
    <div className="budget">
      <div className="filters">
        <div className="filters__row filters__row--budget">
          <label className="field">
            <span className="field__label">Search the budget</span>
            <input className="input" type="search" placeholder="Snow, buses, insurance" value={text} onChange={(e) => setText(e.target.value)} />
          </label>
          <label className="field">
            <span className="field__label">Government</span>
            <select className="select" value={body} onChange={(e) => setBody(e.target.value)}>
              <option value="">All five</option>
              {bodies.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.shortName}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="field__label">Order</span>
            <select className="select" value={sort} onChange={(e) => setSort(e.target.value as SortId)}>
              <option value="size">Largest amount</option>
              <option value="change">Biggest change from last year</option>
            </select>
          </label>
          <label className="check check--switch">
            <input type="checkbox" checked={official} onChange={(e) => setOfficial(e.target.checked)} />
            <span>Show official budget wording</span>
          </label>
        </div>
      </div>

      <div className="browser__bar">
        <p className="browser__count" aria-live="polite">
          {filtered.length} lines, {compactMoney(total)} in total, {signedPercent(percentChange(total, prior)).toLowerCase()} from last year
        </p>
      </div>

      <nav className="chipbar" aria-label="Jump to topic">
        {groups.map((g) => (
          <a key={g.lens.id} href={`#lens-${g.lens.id}`} className="chip">
            {g.lens.verb}
          </a>
        ))}
      </nav>

      {groups.length === 0 ? (
        <div className="empty">
          <p>No budget lines match that search.</p>
          <button type="button" className="btn btn--secondary" onClick={() => { setText(''); setBody('') }}>
            Show the whole budget
          </button>
        </div>
      ) : null}

      {groups.map((g) => {
        const change = percentChange(g.total, g.prior)
        return (
          <section key={g.lens.id} id={`lens-${g.lens.id}`} className="budget-group" aria-labelledby={`h-${g.lens.id}`}>
            <header className="budget-group__head">
              <div>
                <h2 id={`h-${g.lens.id}`} className="h2">{g.lens.verb}</h2>
                <p className="budget-group__covers">{g.lens.covers}</p>
              </div>
              <p className="budget-group__total">
                <span className="num">{compactMoney(g.total)}</span>
                <span className={`delta${change > 0.05 ? ' delta--up' : change < -0.05 ? ' delta--down' : ''}`}>{signedPercent(change)}</span>
              </p>
            </header>

            <ul className="lines">
              {g.lines.map((r, i) => {
                const l = r.line
                const pct = percentChange(l.amount, l.priorAmount)
                const expanded = open.includes(l.id)
                const ask = `mailto:${r.clerkEmail}?subject=${encodeURIComponent(`Question about ${l.plainLabel}`)}&body=${encodeURIComponent(`Hello,\n\nI am a ${placeName} resident with a question about the budget line "${l.officialLabel}" (${compactMoney(l.amount)}).\n\n[Your question]\n\nThank you,\n`)}`
                return (
                  <li key={l.id} id={l.id} className="line" style={{ ['--i' as string]: i }}>
                    <div className="line__main">
                      <p className="line__who">{r.bodyShort}</p>
                      <h3 className="line__label">{l.plainLabel}</h3>
                      {official ? <p className="line__official">{l.officialLabel}</p> : null}
                      <div className="line__bar" aria-hidden="true">
                        <span className={`line__fill line__fill--${r.bodyKind}`} style={{ ['--w' as string]: `${Math.max(0.6, (l.amount / biggest) * 100).toFixed(2)}%` }} />
                      </div>
                      {l.note ? <p className="line__note">{l.note}</p> : null}
                      {r.snapshots.length > 1 || r.related.length ? (
                        <button
                          type="button"
                          className="ledger__toggle"
                          aria-expanded={expanded}
                          aria-controls={`trail-${l.id}`}
                          onClick={() => setOpen(expanded ? open.filter((x) => x !== l.id) : [...open, l.id])}
                        >
                          {expanded ? 'Hide the trail' : 'How this number got here'}
                        </button>
                      ) : null}
                      <div id={`trail-${l.id}`} hidden={!expanded}>
                        {r.snapshots.length > 1 ? (
                          <ol className="snaps" aria-label="How this number changed">
                            {r.snapshots.map((s) => (
                              <li key={s.capturedOn}>
                                <span className="snaps__date">{fullDate(s.capturedOn)}</span>
                                <span>{s.label}</span>
                                <span className="num">{compactMoney(s.amount)}</span>
                              </li>
                            ))}
                          </ol>
                        ) : null}
                        {r.related.length ? (
                          <p className="line__related">
                            Decisions that move this number:{' '}
                            {r.related.map((m, j) => (
                              <span key={m.id}>
                                {j ? ', ' : ''}
                                <Link href={m.href}>{m.title}</Link>
                              </span>
                            ))}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <div className="line__side">
                      <p className="line__amount num">{compactMoney(l.amount)}</p>
                      <p className={`delta${pct > 0.05 ? ' delta--up' : pct < -0.05 ? ' delta--down' : ''}`}>{signedPercent(pct)}</p>
                      <p className="line__prior">from {compactMoney(l.priorAmount)}</p>
                      <a href={ask} className="line__ask">
                        Ask about this
                      </a>
                      <a href={`mailto:${r.clerkEmail}?subject=${encodeURIComponent(`Problem report: ${l.plainLabel}`)}`} className="line__ask">
                        Report a problem
                      </a>
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
