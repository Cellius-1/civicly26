'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Icon } from './Icon'

export function LookupForm({ initial = '', size = 'large' }: { initial?: string; size?: 'large' | 'small' }) {
  const router = useRouter()
  const [q, setQ] = useState(initial)
  const [busy, setBusy] = useState(false)

  return (
    <form
      className={`lookup lookup--${size}`}
      role="search"
      onSubmit={(e) => {
        e.preventDefault()
        if (!q.trim()) return
        setBusy(true)
        router.push(`/lookup?q=${encodeURIComponent(q.trim())}`)
      }}
    >
      <label htmlFor={`lookup-${size}`} className="lookup__label">
        Where do you live?
      </label>
      <div className="lookup__row">
        <span className="input-wrap">
          <span className="input-wrap__icon">
            <Icon name="search" size={20} />
          </span>
          <input
            id={`lookup-${size}`}
            className="lookup__input"
            name="q"
            inputMode="text"
            autoComplete="postal-code"
            placeholder="ZIP code, town, or county"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </span>
        <button className="btn btn--primary lookup__go" type="submit" disabled={busy}>
          {busy ? 'Opening' : 'Open my town'}
        </button>
      </div>
    </form>
  )
}
