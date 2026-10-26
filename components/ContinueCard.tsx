'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Icon } from './Icon'

interface LastPlace {
  id: string
  name: string
  at: string
}

export const LAST_PLACE_KEY = 'civicly:lastPlace'

export function ContinueCard({ fallback }: { fallback: { id: string; name: string } }) {
  const [place, setPlace] = useState<LastPlace | null>(null)
  const [saved, setSaved] = useState(0)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LAST_PLACE_KEY)
      const stored = raw ? (JSON.parse(raw) as LastPlace) : null
      setPlace(stored)
      const prefs = window.localStorage.getItem(`civicly:${stored?.id ?? fallback.id}:prefs`)
      if (prefs) setSaved((JSON.parse(prefs).saved ?? []).length)
    } catch {
      setPlace(null)
    }
  }, [fallback.id])

  if (!place) return null

  return (
    <Link href={`/place/${place.id}`} className="continue">
      <span className="continue__main">
        <span className="continue__label">Pick up where you left off</span>
        <span className="continue__name">{place.name}</span>
        <span className="continue__meta">{saved ? `${saved} saved on this device` : 'Deadlines, agendas, and your receipt'}</span>
      </span>
      <span className="continue__chev" aria-hidden="true">
        <Icon name="next" />
      </span>
    </Link>
  )
}
