'use client'

import { useMemo, useState } from 'react'
import { NEEDS, draftMessage, type Contact, type ContactNeed, type ContactPlan } from '@/lib/contacts'
import { toast } from '@/lib/toast'

function initials(name: string) {
  const words = name.replace(/^(Office of the|Clerk of the)\s+/i, '').split(/\s+/).filter(Boolean)
  return (words[0]?.[0] ?? '') + (words.length > 1 ? words[words.length - 1][0] : '')
}

const tel = (phone: string) => `tel:${phone.replace(/[^\d]/g, '')}`

export function ContactPanel({ plan, defaultNeed = 'view', placeId }: { plan: ContactPlan; defaultNeed?: ContactNeed; placeId: string }) {
  const [need, setNeed] = useState<ContactNeed>(defaultNeed)
  const [picked, setPicked] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [note, setNote] = useState('')

  const list = plan.byNeed[need]
  const target: Contact = list.find((c) => c.key === picked) ?? list[0]
  const others = list.filter((c) => c.key !== target.key)
  const draft = useMemo(() => draftMessage(plan.subject, target, need, { name, note }), [plan.subject, target, need, name, note])

  const copy = async (text: string, what: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast(`${what} copied`)
    } catch {
      toast('Could not copy. Select the text and copy it instead.')
    }
  }

  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="contact__head">
        <h2 id="contact-title" className="h3">Who to contact</h2>
      </div>

      <fieldset className="contact__needs">
        <legend className="field__label">What do you need?</legend>
        <div className="chips">
          {NEEDS.map((n) => (
            <label key={n.id} className={`chip${need === n.id ? ' is-on' : ''}`} title={n.hint}>
              <input
                type="radio"
                name="contact-need"
                value={n.id}
                checked={need === n.id}
                onChange={() => {
                  setNeed(n.id)
                  setPicked(null)
                }}
                className="sr-only"
              />
              {n.label}
            </label>
          ))}
        </div>
        <p className="field__help">{NEEDS.find((n) => n.id === need)?.hint}.</p>
      </fieldset>

      <div className="contact__best" aria-live="polite">
        <p className="contact__eyebrow">{picked ? 'You picked' : 'Best person to reach'}</p>
        <div className="contact__who">
          <span className={`contact__avatar${target.officialId ? '' : ' contact__avatar--staff'}`} aria-hidden="true">
            {initials(target.name)}
          </span>
          <div className="contact__id">
            <p className="contact__name">
              {target.officialId ? <a href={`/place/${placeId}/officials#${target.officialId}`}>{target.name}</a> : target.name}
            </p>
            <p className="contact__title">{target.title}</p>
          </div>
        </div>
        {target.tags.length ? (
          <ul className="contact__tags">
            {target.tags.map((t) => (
              <li key={t} className={`contact__tag${/voted no/i.test(t) ? ' is-no' : /voted yes/i.test(t) ? ' is-yes' : ''}`}>
                {t}
              </li>
            ))}
          </ul>
        ) : null}
        <p className="contact__reason">{target.reason}</p>

        <div className="contact__compose">
          <label className="field">
            <span className="field__label">{need === 'question' ? 'Your question' : need === 'agenda' ? 'What you are asking for' : 'What you want to say'}</span>
            <textarea className="input input--area" rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
          </label>
          <label className="field">
            <span className="field__label">Your name and street</span>
            <input className="input" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <details className="preview">
            <summary>Preview the email</summary>
            <pre className="preview__text">
              {`Subject: ${draft.subject}\n\n${draft.text}`}
            </pre>
          </details>
        </div>

        <div className="contact__actions">
          <a className="btn btn--primary" href={draft.href}>
            Email {target.officialId ? target.name.split(' ')[0] : 'the clerk'}
          </a>
          <a className="btn btn--secondary" href={tel(target.phone)}>
            Call {target.phone}
          </a>
          <button type="button" className="btn btn--quiet" onClick={() => copy(`Subject: ${draft.subject}\n\n${draft.text}`, 'Email text')}>
            Copy text
          </button>
        </div>
        {target.officialId && need !== 'question' ? <p className="field__help">The clerk is copied so your message becomes part of the public record.</p> : null}
      </div>

      {others.length ? (
        <div className="contact__more">
          <p className="contact__eyebrow">Also worth reaching</p>
          <ul className="contact__list">
            {others.map((c) => (
              <li key={c.key} className="contact__row">
                <button type="button" className="contact__pick" onClick={() => setPicked(c.key)} aria-label={`Write to ${c.name} instead`}>
                  <span className={`contact__avatar contact__avatar--small${c.officialId ? '' : ' contact__avatar--staff'}`} aria-hidden="true">
                    {initials(c.name)}
                  </span>
                  <span className="contact__row-main">
                    <span className="contact__row-name">{c.name}</span>
                    <span className="contact__row-meta">
                      {c.title}
                      {c.tags.length ? ` · ${c.tags.join(' · ')}` : ''}
                    </span>
                    <span className="contact__row-reason">{c.reason}</span>
                  </span>
                </button>
                <button type="button" className="contact__copy" onClick={() => copy(c.email, `${c.name.split(' ')[0]}'s email`)} aria-label={`Copy ${c.name}'s email address`}>
                  {c.email}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  )
}
