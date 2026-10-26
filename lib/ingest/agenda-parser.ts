import type { AgendaAction, LensId } from '../types'
import { decode } from '../glossary'

export interface ParsedItem {
  order: number
  raw: string
  reference: string | null
  action: AgendaAction
  lens: LensId
  commentAllowed: boolean
  jargon: string[]
}

const ITEM_START = /^\s*(?:(\d{1,2}|[A-Z]|[IVX]{1,4})[.)]|•|-)\s+(.+)$/

const REFERENCE = /\b(?:Ord(?:inance)?\.?|Res(?:olution)?\.?|Policy)\s*(?:No\.?\s*)?([A-Z]?\d{2,4}[-‑]?\d{0,4}(?:\.\d+)?)/i

const ACTION_RULES: [RegExp, AgendaAction][] = [
  [/public hearing|second reading|final adoption/i, 'public-hearing'],
  [/first reading|introduction/i, 'first-reading'],
  [/consent/i, 'consent'],
  [/report|presentation|discussion|update|work session/i, 'briefing'],
  [/resolution|motion|approv|award|authoriz/i, 'vote']
]

const LENS_RULES: [RegExp, LensId][] = [
  [/road|paving|street|sidewalk|traffic|bus|transport|bridge|snow/i, 'getting-around'],
  [/zoning|redevelop|housing|land use|variance|planning board|affordable/i, 'where-i-live'],
  [/police|fire|sheriff|jail|inmate|emergency|court|prosecutor/i, 'staying-safe'],
  [/sewer|water|storm|trash|recycl|leaf|solid waste|drain/i, 'water-and-waste'],
  [/school|library|recreation|senior center|curriculum|student/i, 'learning'],
  [/park|trail|open space|field|pool|tree/i, 'parks'],
  [/health|clinic|shelter|human services|aging|food/i, 'health'],
  [/budget|tax|bond|debt|audit|bill list|salary|insurance/i, 'money']
]

export function classifyAction(text: string): AgendaAction {
  return ACTION_RULES.find(([re]) => re.test(text))?.[1] ?? 'briefing'
}

export function classifyLens(text: string): LensId {
  return LENS_RULES.find(([re]) => re.test(text))?.[1] ?? 'money'
}

export function parseAgendaText(input: string): ParsedItem[] {
  const lines = input.replace(/\r/g, '').split('\n')
  const blocks: string[] = []

  for (const line of lines) {
    const hit = ITEM_START.exec(line)
    if (hit) blocks.push(hit[2].trim())
    else if (blocks.length && line.trim()) blocks[blocks.length - 1] += ` ${line.trim()}`
  }

  return blocks.map((raw, i) => {
    const action = classifyAction(raw)
    return {
      order: i + 1,
      raw,
      reference: REFERENCE.exec(raw)?.[0] ?? null,
      action,
      lens: classifyLens(raw),
      commentAllowed: action === 'public-hearing' || /public comment/i.test(raw),
      jargon: decode(raw).filter((p) => p.term).map((p) => p.term!.key)
    }
  })
}
