import type { Body, BudgetLine, LensId, Measure, PlaceBundle } from './types'
import { cents } from './format'

export interface ReceiptLine {
  line: BudgetLine
  dollars: number
  units: number | null
}

export interface ReceiptSection {
  body: Body
  dollars: number
  share: number
  lines: ReceiptLine[]
}

export interface Receipt {
  assessed: number
  total: number
  sections: ReceiptSection[]
  byLens: { lensId: LensId; dollars: number }[]
  perDay: number
}

export function billFor(assessed: number, body: Body): number {
  return (assessed / 100) * body.ratePer100
}

export function totalRate(bundle: PlaceBundle): number {
  return bundle.bodies.reduce((sum, b) => sum + b.ratePer100, 0)
}

export function buildReceipt(bundle: PlaceBundle, assessed: number): Receipt {
  const safe = Math.max(0, Math.round(assessed))
  const total = (safe / 100) * totalRate(bundle)
  const lensTotals = new Map<LensId, number>()

  const sections = bundle.bodies
    .map((body): ReceiptSection => {
      const dollars = billFor(safe, body)
      const lines = bundle.budget.filter((l) => l.bodyId === body.id)
      const bodyBudget = lines.reduce((s, l) => s + l.amount, 0)
      const receiptLines = lines
        .map((line): ReceiptLine => {
          const share = bodyBudget ? dollars * (line.amount / bodyBudget) : 0
          lensTotals.set(line.lensId, (lensTotals.get(line.lensId) ?? 0) + share)
          return { line, dollars: share, units: line.unitRate ? share / line.unitRate.dollarsPerUnit : null }
        })
        .sort((a, b) => b.dollars - a.dollars)
      return { body, dollars, share: total ? dollars / total : 0, lines: receiptLines }
    })
    .sort((a, b) => b.dollars - a.dollars)

  const byLens = [...lensTotals.entries()].map(([lensId, dollars]) => ({ lensId, dollars })).sort((a, b) => b.dollars - a.dollars)

  return { assessed: safe, total, sections, byLens, perDay: total / 365 }
}

export function householdCost(bundle: PlaceBundle, bodyId: string, amount: number): number {
  const body = bundle.bodies.find((b) => b.id === bodyId)
  if (!body) return 0
  const localShare = amount * body.placeShare
  return localShare / bundle.place.households
}

export function unitPhrase(line: BudgetLine, units: number): string | null {
  if (!line.unitRate) return null
  const rounded = units >= 10 ? Math.round(units) : Math.round(units * 10) / 10
  const noun = rounded === 1 ? line.unitRate.noun : line.unitRate.pluralNoun
  return `${rounded.toLocaleString('en-US')} ${noun}`
}

export function costLabel(bundle: PlaceBundle, measure: Measure): string {
  const f = measure.fiscal
  if (!f) return 'Not estimated'
  if (f.direction === 'shift' || f.amount === 0) return 'Cost neutral'
  const each = cents(Math.abs(householdCost(bundle, measure.bodyId, f.amount)))
  const per = f.recurring ? ' a year' : ' once'
  if (f.direction === 'revenue') return `${each} raised${per}`
  if (f.amount < 0) return `Saves ${each}${per}`
  return `${each}${per}`
}
