import type { Lens, LensId } from './types'

export const LENSES: Lens[] = [
  {
    id: 'getting-around',
    label: 'Getting around',
    verb: 'Road maintenance',
    covers: 'Repaving, potholes, sidewalks, bus routes, bike lanes, traffic signals, snow and storm clearing.',
    officialEquivalent: 'Public Works, Transportation, Transit Authority'
  },
  {
    id: 'where-i-live',
    label: 'Where I live',
    verb: 'Keeping a roof over my head',
    covers: 'Rent rules, what can be built on my block, permits, inspections, eviction help, first-time buyer programs.',
    officialEquivalent: 'Planning and Zoning, Housing, Code Enforcement'
  },
  {
    id: 'staying-safe',
    label: 'Staying safe',
    verb: 'Emergency services',
    covers: 'Police staffing, fire stations, ambulances, 911 dispatch, jails, courts, emergency response.',
    officialEquivalent: 'Public Safety, Sheriff, Fire and Rescue, Judicial'
  },
  {
    id: 'water-and-waste',
    label: 'Water and waste',
    verb: 'What comes out of my tap',
    covers: 'Drinking water, sewers, trash and recycling pickup, storm drains, flooding, landfills.',
    officialEquivalent: 'Water Utility, Sanitation, Stormwater Enterprise Fund'
  },
  {
    id: 'learning',
    label: 'Learning and gathering',
    verb: 'Where my kid goes after school',
    covers: 'Libraries, community centers, after-school programs, workforce training, senior services.',
    officialEquivalent: 'Library System, Parks and Recreation Programming, Workforce Board'
  },
  {
    id: 'parks',
    label: 'Parks and open space',
    verb: 'Somewhere to take the dog',
    covers: 'Parks, trails, pools, ball fields, street trees, conservation land, playground repairs.',
    officialEquivalent: 'Parks Department, Capital Improvement Program'
  },
  {
    id: 'health',
    label: 'Health and shelter',
    verb: 'Help when things go wrong',
    covers: 'Public clinics, mental health response, shelter beds, food assistance, restaurant inspections.',
    officialEquivalent: 'Health and Human Services, Homeless Response System'
  },
  {
    id: 'money',
    label: 'Money and taxes',
    verb: 'What I actually pay',
    covers: 'Property tax rates, fees, borrowing, debt payments, reserves, and the cost of running government itself.',
    officialEquivalent: 'Finance, Debt Service, General Government'
  }
]

const byId = new Map<LensId, Lens>(LENSES.map((l) => [l.id, l]))

export function lens(id: LensId): Lens {
  const found = byId.get(id)
  if (!found) throw new Error(`Unknown lens: ${id}`)
  return found
}

export function lensLabel(id: LensId): string {
  return lens(id).label
}

export const LENS_ORDER: LensId[] = LENSES.map((l) => l.id)
