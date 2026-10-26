import { bodyOf } from './registry'
import { STAGES } from './stages'
import { lens } from './lenses'
import { shortDate } from './format'
import type { PlaceBundle } from './types'

export type DocKind = 'measure' | 'meeting' | 'budget' | 'official' | 'page' | 'topic'

export interface SearchDoc {
  id: string
  kind: DocKind
  title: string
  detail: string
  href: string
  terms: string
  rank: number
}

const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim()

export function buildIndex(bundle: PlaceBundle): SearchDoc[] {
  const base = `/place/${bundle.place.id}`
  const docs: SearchDoc[] = []

  for (const m of bundle.measures) {
    const body = bodyOf(bundle, m.bodyId)
    docs.push({
      id: m.id,
      kind: 'measure',
      title: m.plainTitle,
      detail: `${body.shortName} ${m.fileNumber} ${STAGES[m.stage].label}`,
      href: `${base}/measures/${m.id}`,
      terms: clean([m.plainTitle, m.plainSummary, m.officialTitle, m.fileNumber, body.name, ...m.whatChanges, ...m.neighborhoods, m.whoNotices].join(' ')),
      rank: STAGES[m.stage].open ? 5 : 2
    })
  }

  for (const mt of bundle.meetings) {
    const body = bodyOf(bundle, mt.bodyId)
    docs.push({
      id: mt.id,
      kind: 'meeting',
      title: `${body.shortName}: ${mt.title}`,
      detail: `${shortDate(mt.startsAt)} at ${mt.location}`,
      href: `${base}/meetings/${mt.id}`,
      terms: clean([body.name, mt.title, mt.location, ...mt.agenda.map((a) => `${a.plainTitle} ${a.officialTitle}`)].join(' ')),
      rank: mt.status === 'upcoming' ? 3 : 1
    })
  }

  for (const l of bundle.budget) {
    const body = bodyOf(bundle, l.bodyId)
    docs.push({
      id: l.id,
      kind: 'budget',
      title: l.plainLabel,
      detail: `${body.shortName} budget line`,
      href: `${base}/budget#${l.id}`,
      terms: clean([l.plainLabel, l.officialLabel, l.note, body.name, ...l.neighborhoods].join(' ')),
      rank: 2
    })
  }

  for (const o of bundle.officials) {
    const body = bodyOf(bundle, o.bodyId)
    docs.push({
      id: o.id,
      kind: 'official',
      title: o.name,
      detail: `${o.role}, ${body.name}`,
      href: `${base}/officials#${o.id}`,
      terms: clean([o.name, o.role, o.seat, body.name].join(' ')),
      rank: 2
    })
  }

  for (const id of ['getting-around', 'where-i-live', 'staying-safe', 'water-and-waste', 'learning', 'parks', 'health', 'money'] as const) {
    const l = lens(id)
    docs.push({
      id: `lens-${id}`,
      kind: 'topic',
      title: l.verb,
      detail: l.covers,
      href: `${base}/measures?lens=${id}`,
      terms: clean([l.verb, l.label, l.covers, l.officialEquivalent].join(' ')),
      rank: 1
    })
  }

  const pages: [string, string, string][] = [
    ['This week', 'Deadlines, meetings, and budget changes', base],
    ['Proposals and votes', 'Every ordinance, resolution, and policy', `${base}/measures`],
    ['Meetings', 'All agendas, with estimated times', `${base}/meetings`],
    ['Money allocation', 'Sorted by where it goes', `${base}/budget`],
    ['Your tax receipt', 'What your property tax bill buys', `${base}/receipt`],
    ['Who decides?', 'Members, terms, and recorded votes', `${base}/officials`],
    ['Get alerts', 'Follow topics and your neighborhood', `${base}/follow`],
    ['Document sources', 'Sources behind every page', `${base}/sources`],
    ['How we read the records', 'Methods, limits, and glossary', '/about']
  ]

  for (const [title, detail, href] of pages) {
    docs.push({ id: `page-${href}`, kind: 'page', title, detail, href, terms: clean(`${title} ${detail}`), rank: 1 })
  }

  return docs
}

export function runSearch(docs: SearchDoc[], query: string, limit = 12): SearchDoc[] {
  const needle = clean(query)
  if (!needle) return []
  const words = needle.split(' ')

  return docs
    .map((doc) => {
      let score = 0
      for (const w of words) {
        const inTitle = clean(doc.title).includes(w)
        const inTerms = doc.terms.includes(w)
        if (!inTitle && !inTerms) return { doc, score: -1 }
        if (inTitle) score += 6
        if (clean(doc.title).split(' ').includes(w)) score += 3
        if (clean(doc.title).startsWith(w)) score += 4
        if (inTerms) score += 2
      }
      return { doc, score: score + doc.rank }
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.doc)
}
