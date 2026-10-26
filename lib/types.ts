export type LensId =
  | 'getting-around'
  | 'where-i-live'
  | 'staying-safe'
  | 'water-and-waste'
  | 'learning'
  | 'parks'
  | 'health'
  | 'money'

export type Stage =
  | 'filed'
  | 'committee'
  | 'comment'
  | 'vote'
  | 'adopted'
  | 'in-effect'
  | 'stalled'
  | 'failed'

export type Scope = 'jurisdiction' | 'district' | 'neighborhood'

export type BodyKind = 'municipal' | 'county' | 'school' | 'fire' | 'library'

export interface Lens {
  id: LensId
  label: string
  verb: string
  covers: string
  officialEquivalent: string
}

export interface Body {
  id: string
  name: string
  shortName: string
  kind: BodyKind
  governs: string
  meetsWhere: string
  cadence: string
  clerkName: string
  clerkEmail: string
  clerkPhone: string
  website: string
  ratePer100: number
  placeShare: number
}

export interface Place {
  id: string
  name: string
  shortName: string
  kind: 'county' | 'township' | 'city'
  county: string
  state: string
  stateCode: string
  population: number
  households: number
  zips: string[]
  partialZips: string[]
  neighborhoods: string[]
  fiscalYear: string
  asOf: string
  medianAssessedValue: number
  equalizationRatio: number
  sampleData: boolean
}

export interface Official {
  id: string
  bodyId: string
  name: string
  role: string
  seat: string
  email: string
  phone: string
  termEnds: string
}

export interface StageEvent {
  stage: Stage
  date: string
  note: string
}

export interface FiscalImpact {
  amount: number
  direction: 'spend' | 'revenue' | 'shift' | 'borrow'
  recurring: boolean
  note: string
}

export interface Ballot {
  officialId: string
  vote: 'yes' | 'no' | 'abstain' | 'absent'
}

export interface VoteRecord {
  date: string
  ballots: Ballot[]
}

export interface MeasureDocument {
  label: string
  kind: 'ordinance' | 'resolution' | 'staff-report' | 'fiscal-note' | 'map' | 'minutes'
  pages: number
}

export interface Measure {
  id: string
  bodyId: string
  fileNumber: string
  officialTitle: string
  plainTitle: string
  plainSummary: string
  whatChanges: string[]
  whoNotices: string
  lens: LensId
  alsoTouches: LensId[]
  stage: Stage
  history: StageEvent[]
  nextActionOn: string | null
  nextActionLabel: string | null
  commentClosesOn: string | null
  sponsorIds: string[]
  fiscal: FiscalImpact | null
  budgetLineIds: string[]
  scope: Scope
  neighborhoods: string[]
  documents: MeasureDocument[]
  vote: VoteRecord | null
  tension: string | null
}

export interface UnitRate {
  noun: string
  pluralNoun: string
  dollarsPerUnit: number
  basis: string
}

export interface BudgetLine {
  id: string
  bodyId: string
  lensId: LensId
  plainLabel: string
  officialLabel: string
  amount: number
  priorAmount: number
  oneTime: boolean
  note: string
  unitRate: UnitRate | null
  neighborhoods: string[]
}

export type AgendaAction = 'vote' | 'first-reading' | 'public-hearing' | 'briefing' | 'consent'

export interface AgendaItem {
  id: string
  order: number
  measureId: string | null
  plainTitle: string
  officialTitle: string
  lens: LensId
  action: AgendaAction
  commentAllowed: boolean
  minutes: number
}

export interface Meeting {
  id: string
  bodyId: string
  title: string
  startsAt: string
  location: string
  watch: string
  commentSignupClosesAt: string | null
  commentInstructions: string
  agenda: AgendaItem[]
  status: 'upcoming' | 'held'
  outcome: string | null
}

export interface Snapshot {
  bodyId: string
  lineId: string
  label: string
  amount: number
  capturedOn: string
}

export interface PlaceBundle {
  place: Place
  bodies: Body[]
  officials: Official[]
  measures: Measure[]
  budget: BudgetLine[]
  meetings: Meeting[]
  snapshots: Snapshot[]
  sources: Source[]
}

export interface Source {
  id: string
  bodyId: string
  label: string
  kind: 'agenda-pdf' | 'minutes-pdf' | 'budget-pdf' | 'ordinance-index' | 'open-data' | 'tax-table'
  url: string
  cadence: string
  lastRead: string
  recordsFound: number
}

export type SignalKind = 'budget-change' | 'comment-closing' | 'meeting-soon' | 'newly-filed' | 'adopted' | 'vote-scheduled'

export interface Signal {
  id: string
  kind: SignalKind
  date: string
  headline: string
  detail: string
  href: string
  lens: LensId
  neighborhoods: string[]
  weight: number
}

export interface CountyEntry {
  slug: string
  name: string
  state: string
  municipalities: { name: string; zips: string[]; placeId: string | null }[]
}
