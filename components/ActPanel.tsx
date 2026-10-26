'use client'

import { useMemo, useState } from 'react'
import { composeLetter, type Stance } from '@/lib/letter'
import type { Body, Measure, Meeting, Official } from '@/lib/types'

const STANCES: { id: Stance; label: string }[] = [
  { id: 'support', label: 'I support it' },
  { id: 'oppose', label: 'I oppose it' },
  { id: 'question', label: 'I have questions' }
]

export function ActPanel({ measure, body, meeting, members }: { measure: Measure; body: Body; meeting: Meeting | null; members: Official[] }) {
  const [stance, setStance] = useState<Stance>('question')
  const [reason, setReason] = useState('')
  const [name, setName] = useState('')
  const [street, setStreet] = useState('')
  const [to, setTo] = useState<string[]>([])
  const [copied, setCopied] = useState(false)

  const recipients = useMemo(() => members.filter((m) => to.includes(m.id)), [members, to])
  const letter = useMemo(
    () => composeLetter({ measure, body, meeting, recipients, stance, reason, name, street }),
    [measure, body, meeting, recipients, stance, reason, name, street]
  )

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(letter.text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2400)
    } catch {
      setCopied(false)
    }
  }

  return (
    <form className="letter" onSubmit={(e) => e.preventDefault()} aria-labelledby="letter-title">
      <h3 id="letter-title" className="letter__title">
        Write to the {body.shortName.toLowerCase()} {body.kind === 'school' ? 'board' : 'officials'}
      </h3>

      <fieldset className="letter__set">
        <legend className="field__label">Where you stand</legend>
        <div className="seg seg--full">
          {STANCES.map((s) => (
            <label key={s.id} className={`seg__opt${stance === s.id ? ' is-on' : ''}`}>
              <input type="radio" name="stance" value={s.id} checked={stance === s.id} onChange={() => setStance(s.id)} className="sr-only" />
              {s.label}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="field">
        <span className="field__label">Why it matters to you</span>
        <textarea id="letter-reason" className="input input--area" rows={4} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="I walk my kids down this street every morning and..." />
      </label>

      <div className="letter__pair">
        <label className="field">
          <span className="field__label">Your name</span>
          <input className="input" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="field">
          <span className="field__label">Your street</span>
          <input className="input" autoComplete="address-line1" value={street} onChange={(e) => setStreet(e.target.value)} />
        </label>
      </div>

      {members.length ? (
        <fieldset className="letter__set">
          <legend className="field__label">Send to</legend>
          <p className="field__help">Leave all unchecked to send to the clerk, who shares it with every member and adds it to the record.</p>
          <ul className="checks">
            {members.map((m) => (
              <li key={m.id}>
                <label className="check">
                  <input type="checkbox" checked={to.includes(m.id)} onChange={(e) => setTo(e.target.checked ? [...to, m.id] : to.filter((x) => x !== m.id))} />
                  <span>
                    {m.name} <span className="check__muted">{m.role}</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      ) : null}

      <details className="preview">
        <summary>Preview the letter</summary>
        <pre className="preview__text">{letter.text}</pre>
      </details>

      <div className="letter__actions">
        <a className="btn btn--primary" href={letter.href}>
          Open in my email
        </a>
        <button type="button" className="btn btn--secondary" onClick={copy}>
          {copied ? 'Copied' : 'Copy text'}
        </button>
      </div>
      <p className="field__help">
        Or call {body.clerkName} at <a href={`tel:${body.clerkPhone.replace(/[^\d]/g, '')}`}>{body.clerkPhone}</a>.
      </p>
    </form>
  )
}
