'use client'

import { useId, useMemo, useState } from 'react'
import { decode } from '@/lib/glossary'

export function Decoded({ text, className }: { text: string; className?: string }) {
  const pieces = useMemo(() => decode(text), [text])
  const [open, setOpen] = useState<string | null>(null)
  const base = useId()
  const active = pieces.find((p) => p.term?.key === open)?.term ?? null

  return (
    <div className={className}>
      <p className="decoded">
        {pieces.map((p, i) =>
          p.term ? (
            <button
              key={i}
              type="button"
              className={`term${open === p.term.key ? ' is-open' : ''}`}
              aria-expanded={open === p.term.key}
              aria-controls={`${base}-def`}
              onClick={() => setOpen(open === p.term!.key ? null : p.term!.key)}
            >
              {p.text}
            </button>
          ) : (
            <span key={i}>{p.text}</span>
          )
        )}
      </p>
      <div id={`${base}-def`} className={`definition${active ? ' is-open' : ''}`} aria-live="polite">
        {active ? (
          <p key={active.key}>
            <strong>{active.key.charAt(0).toUpperCase() + active.key.slice(1)}.</strong> {active.plain}
          </p>
        ) : null}
      </div>
      {pieces.some((p) => p.term) ? <p className="hint">Underlined words are government terms. Select one to see what it means.</p> : null}
    </div>
  )
}
