'use client'

import { useCallback, useEffect, useState } from 'react'
import type { LensId } from '@/lib/types'

export interface SavedItem {
  id: string
  title: string
  href: string
  kind: 'measure' | 'meeting'
  note: string
}

export interface Prefs {
  neighborhood: string | null
  lenses: LensId[]
  lastVisit: string | null
  saved: SavedItem[]
}

const EMPTY: Prefs = { neighborhood: null, lenses: [], lastVisit: null, saved: [] }

const key = (placeId: string) => `civicly:${placeId}:prefs`

export const PREFS_EVENT = 'civicly:prefs'

function read(placeId: string): Prefs {
  try {
    const raw = window.localStorage.getItem(key(placeId))
    return raw ? { ...EMPTY, ...(JSON.parse(raw) as Partial<Prefs>) } : EMPTY
  } catch {
    return EMPTY
  }
}

function write(placeId: string, prefs: Prefs) {
  try {
    window.localStorage.setItem(key(placeId), JSON.stringify(prefs))
    window.dispatchEvent(new CustomEvent(PREFS_EVENT, { detail: placeId }))
  } catch {}
}

export function usePrefs(placeId: string, markVisit = false) {
  const [prefs, setPrefs] = useState<Prefs>(EMPTY)
  const [previousVisit, setPreviousVisit] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stored = read(placeId)
    setPreviousVisit(stored.lastVisit)
    setPrefs(stored)
    if (markVisit) write(placeId, { ...stored, lastVisit: new Date().toISOString() })
    setReady(true)

    const sync = (event: Event) => {
      if ((event as CustomEvent<string>).detail !== placeId) return
      setPrefs(read(placeId))
    }
    window.addEventListener(PREFS_EVENT, sync)
    window.addEventListener('storage', () => setPrefs(read(placeId)))
    return () => window.removeEventListener(PREFS_EVENT, sync)
  }, [placeId, markVisit])

  const update = useCallback(
    (patch: Partial<Prefs>) => {
      setPrefs((current) => {
        const next = { ...current, ...patch }
        write(placeId, { ...read(placeId), ...patch })
        return next
      })
    },
    [placeId]
  )

  const toggleSaved = useCallback(
    (item: SavedItem) => {
      const stored = read(placeId)
      const exists = stored.saved.some((s) => s.id === item.id)
      const saved = exists ? stored.saved.filter((s) => s.id !== item.id) : [item, ...stored.saved].slice(0, 40)
      write(placeId, { ...stored, saved })
      setPrefs({ ...stored, saved })
      return !exists
    },
    [placeId]
  )

  return { prefs, update, toggleSaved, previousVisit, ready }
}
