import { bridgewater } from './data/bridgewater'
import { COUNTIES } from './data/counties'
import type { Body, BudgetLine, CountyEntry, Measure, Meeting, Official, PlaceBundle } from './types'

const BUNDLES = new Map<string, PlaceBundle>([[bridgewater.place.id, bridgewater]])

export type LookupResult =
  | { kind: 'place'; placeId: string; matchedBy: 'zip' | 'name' | 'partial-zip' }
  | { kind: 'county'; county: CountyEntry }
  | { kind: 'uncovered'; label: string; county: CountyEntry | null }
  | { kind: 'unknown'; query: string }

export function listPlaceIds(): string[] {
  return [...BUNDLES.keys()]
}

export function getBundle(placeId: string): PlaceBundle | null {
  return BUNDLES.get(placeId) ?? null
}

export function requireBundle(placeId: string): PlaceBundle {
  const bundle = getBundle(placeId)
  if (!bundle) throw new Error(`No records for ${placeId}`)
  return bundle
}

const normalize = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\b(county|township|twp|borough|city|nj|new jersey)\b/g, ' ').replace(/\s+/g, ' ').trim()

export function lookup(raw: string): LookupResult {
  const query = raw.trim()
  if (!query) return { kind: 'unknown', query }

  const zip = query.match(/^\d{5}/)?.[0]
  if (zip) {
    for (const bundle of BUNDLES.values()) {
      if (bundle.place.zips.includes(zip)) return { kind: 'place', placeId: bundle.place.id, matchedBy: 'zip' }
    }
    for (const bundle of BUNDLES.values()) {
        if (bundle.place.partialZips.includes(zip)) return { kind: 'place', placeId: bundle.place.id, matchedBy: 'partial-zip' }
    }
    for (const county of COUNTIES) {
      const hit = county.municipalities.find((m) => m.zips.includes(zip))
      if (hit) return { kind: 'uncovered', label: hit.name, county }
    }
    return { kind: 'unknown', query }
  }

  const needle = normalize(query)
  if (!needle) return { kind: 'unknown', query }

  for (const bundle of BUNDLES.values()) {
    const names = [bundle.place.name, bundle.place.shortName, ...bundle.place.neighborhoods].map(normalize)
    if (names.some((n) => n === needle || n.startsWith(needle))) return { kind: 'place', placeId: bundle.place.id, matchedBy: 'name' }
  }

  const county = COUNTIES.find((c) => normalize(c.name) === needle || normalize(c.name).startsWith(needle))
  if (county) return { kind: 'county', county }

  for (const c of COUNTIES) {
    const m = c.municipalities.find((x) => normalize(x.name).startsWith(needle))
    if (m) return m.placeId ? { kind: 'place', placeId: m.placeId, matchedBy: 'name' } : { kind: 'uncovered', label: m.name, county: c }
  }

  return { kind: 'unknown', query }
}

export function bodyOf(bundle: PlaceBundle, bodyId: string): Body {
  const body = bundle.bodies.find((b) => b.id === bodyId)
  if (!body) throw new Error(`Unknown body ${bodyId}`)
  return body
}

export function officialsOf(bundle: PlaceBundle, ids: string[]): Official[] {
  return ids.map((id) => bundle.officials.find((o) => o.id === id)).filter((o): o is Official => Boolean(o))
}

export function measureOf(bundle: PlaceBundle, id: string): Measure | null {
  return bundle.measures.find((m) => m.id === id) ?? null
}

export function meetingOf(bundle: PlaceBundle, id: string): Meeting | null {
  return bundle.meetings.find((m) => m.id === id) ?? null
}

export function linesFor(bundle: PlaceBundle, ids: string[]): BudgetLine[] {
  return bundle.budget.filter((b) => ids.includes(b.id))
}

export function meetingFor(bundle: PlaceBundle, measureId: string): Meeting | null {
  return (
    bundle.meetings
      .filter((mt) => mt.status === 'upcoming' && mt.agenda.some((a) => a.measureId === measureId))
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt))[0] ?? null
  )
}

export function measuresFor(bundle: PlaceBundle, lineId: string): Measure[] {
  return bundle.measures.filter((m) => m.budgetLineIds.includes(lineId))
}
