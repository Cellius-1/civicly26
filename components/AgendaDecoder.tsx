'use client'

import { useMemo, useState } from 'react'
import { parseAgendaText } from '@/lib/ingest/agenda-parser'
import { GLOSSARY } from '@/lib/glossary'
import { lensLabel } from '@/lib/lenses'
import { ACTIONS } from '@/lib/stages'

const SAMPLE = `1. Call to Order and Open Public Meetings Act Statement
2. Consent Agenda: Resolutions 26-230 through 26-241, including approval of the bill list
3. Public Hearing and Second Reading, Ordinance 26-19, Bond Ordinance appropriating $840,000 for the acquisition of a new snow plow and dump truck
4. First Reading, Ordinance 26-20, amending Chapter 126, Land Use, to permit accessory dwelling units in the R-40 zone
5. Resolution authorizing a change order to the Vosseller Avenue sidewalk contract
6. Public Comment`

export function AgendaDecoder() {
  const [text, setText] = useState(SAMPLE)
  const items = useMemo(() => parseAgendaText(text), [text])

  return (
    <div className="decoder">
      <label className="field">
        <span className="field__label">Paste agenda text from any New Jersey town, county, or school board</span>
        <textarea className="input input--area input--mono" rows={10} value={text} onChange={(e) => setText(e.target.value)} spellCheck={false} />
      </label>
      <ol className="decoder__out" aria-live="polite">
        {items.map((it) => (
          <li key={it.order}>
            <p className="decoder__meta">
              <span>{ACTIONS[it.action]}</span>
              <span>{lensLabel(it.lens)}</span>
              {it.reference ? <span>{it.reference}</span> : null}
              {it.commentAllowed ? <span className="rail__speak">Public can speak</span> : null}
            </p>
            <p className="decoder__raw">{it.raw}</p>
            {it.jargon.length ? (
              <ul className="decoder__terms">
                {it.jargon.map((k) => (
                  <li key={k}>
                    <strong>{k}</strong>: {GLOSSARY.find((g) => g.key === k)?.plain}
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  )
}
