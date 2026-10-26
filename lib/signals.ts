import { compactMoney, daysBetween, longDate, percentChange, relativeDay } from './format'
import { bodyOf } from './registry'
import type { PlaceBundle, Signal } from './types'

const BUDGET_THRESHOLD = 5

const lowerFirst = (s: string) => /^[A-Z][a-z]/.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s

export function signalsFor(bundle: PlaceBundle): Signal[] {
  const { place } = bundle
  const now = place.asOf
  const base = `/place/${place.id}`
  const out: Signal[] = []

  for (const m of bundle.measures) {
    const body = bodyOf(bundle, m.bodyId)

    if (m.commentClosesOn) {
      const d = daysBetween(now, m.commentClosesOn)
      if (d >= 0 && d <= 14) {
        out.push({
          id: `close-${m.id}`,
          kind: 'comment-closing',
          date: m.commentClosesOn,
          headline: `Comments close ${relativeDay(now, m.commentClosesOn).toLowerCase()}: ${m.plainTitle}`,
          detail: `${body.name}, ${m.fileNumber}. ${m.nextActionLabel ?? ''}`.trim(),
          href: `${base}/measures/${m.id}`,
          lens: m.lens,
          neighborhoods: m.neighborhoods,
          weight: 100 - d * 4
        })
      }
    }

    const filed = m.history.find((h) => h.stage === 'filed')
    if (filed && m.stage === 'filed') {
      const age = daysBetween(filed.date, now)
      if (age >= 0 && age <= 30) {
        out.push({
          id: `filed-${m.id}`,
          kind: 'newly-filed',
          date: filed.date,
          headline: `New proposal: ${m.plainTitle}`,
          detail: `${body.shortName} ${m.fileNumber}. ${m.nextActionLabel ? `Next: ${m.nextActionLabel.toLowerCase()}${m.nextActionOn ? ` on ${longDate(m.nextActionOn)}` : ''}.` : ''}`,
          href: `${base}/measures/${m.id}`,
          lens: m.lens,
          neighborhoods: m.neighborhoods,
          weight: 70 - age
        })
      }
    }

    const passed = [...m.history].reverse().find((h) => h.stage === 'adopted' || h.stage === 'in-effect' || h.stage === 'failed')
    if (passed) {
      const age = daysBetween(passed.date, now)
      if (age >= 0 && age <= 60) {
        out.push({
          id: `done-${m.id}`,
          kind: 'adopted',
          date: passed.date,
          headline: `${passed.stage === 'failed' ? 'Voted down' : passed.stage === 'in-effect' ? 'Now in effect' : 'Passed'}: ${m.plainTitle}`,
          detail: passed.note,
          href: `${base}/measures/${m.id}`,
          lens: m.lens,
          neighborhoods: m.neighborhoods,
          weight: 50 - age / 2
        })
      }
    }
  }

  for (const line of bundle.budget) {
    const pct = percentChange(line.amount, line.priorAmount)
    if (Math.abs(pct) < BUDGET_THRESHOLD) continue
    const body = bodyOf(bundle, line.bodyId)
    const snap = bundle.snapshots.filter((s) => s.lineId === line.id).sort((a, b) => b.capturedOn.localeCompare(a.capturedOn))[0]
    const direction = pct > 0 ? 'went up' : 'went down'
    out.push({
      id: `budget-${line.id}`,
      kind: 'budget-change',
      date: snap?.capturedOn ?? now,
      headline: `${body.shortName} money for ${lowerFirst(line.plainLabel)} ${direction} ${Math.abs(pct).toFixed(1)}%`,
      detail: `${compactMoney(line.priorAmount)} last year, ${compactMoney(line.amount)} now.${line.note ? ` ${line.note}` : ''}`,
      href: `${base}/budget#${line.id}`,
      lens: line.lensId,
      neighborhoods: line.neighborhoods,
      weight: 40 + Math.min(Math.abs(pct), 30)
    })
  }

  for (const mt of bundle.meetings) {
    if (mt.status !== 'upcoming') continue
    const d = daysBetween(now, mt.startsAt)
    if (d < 0 || d > 14) continue
    const body = bodyOf(bundle, mt.bodyId)
    const hearings = mt.agenda.filter((a) => a.commentAllowed && a.measureId)
    const votes = mt.agenda.filter((a) => a.measureId && (a.action === 'vote' || a.action === 'public-hearing'))
    out.push({
      id: `meeting-${mt.id}`,
      kind: 'meeting-soon',
      date: mt.startsAt,
      headline: `${relativeDay(now, mt.startsAt)}: ${body.shortName} meeting with ${mt.agenda.length} items`,
      detail: hearings.length
        ? `You can speak on ${hearings.map((h) => lowerFirst(h.plainTitle)).join(' and ')}.`
        : votes.length
          ? `Includes a vote on ${votes.map((v) => lowerFirst(v.plainTitle)).join(' and ')}.`
          : 'Discussion and routine business only.',
      href: `${base}/meetings/${mt.id}`,
      lens: mt.agenda.find((a) => a.measureId)?.lens ?? mt.agenda[0].lens,
      neighborhoods: [],
      weight: 80 - d * 3
    })
  }

  return out.sort((a, b) => b.weight - a.weight)
}
