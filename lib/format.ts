const TZ = 'America/New_York'

const usd0 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const usd2 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })
const num = new Intl.NumberFormat('en-US')

export function money(n: number): string {
  return usd0.format(n)
}

export function cents(n: number): string {
  return usd2.format(n)
}

export function count(n: number): string {
  return num.format(Math.round(n))
}

export function compactMoney(n: number): string {
  const abs = Math.abs(n)
  const sign = n < 0 ? '-' : ''
  if (abs >= 1e9) return `${sign}$${trim(abs / 1e9)} billion`
  if (abs >= 1e6) return `${sign}$${trim(abs / 1e6)} million`
  if (abs >= 1e4) return `${sign}$${trim(abs / 1e3)}K`
  return `${sign}${usd0.format(abs)}`
}

function trim(n: number): string {
  return n >= 100 ? n.toFixed(0) : n.toFixed(1).replace(/\.0$/, '')
}

export function percentChange(current: number, prior: number): number {
  if (prior === 0) return 0
  return ((current - prior) / prior) * 100
}

export function signedPercent(p: number): string {
  const r = Math.round(p * 10) / 10
  if (r === 0) return 'No change'
  return `${r > 0 ? 'Up' : 'Down'} ${Math.abs(r).toFixed(1).replace(/\.0$/, '')}%`
}

function parts(iso: string) {
  return iso.length === 10 ? new Date(`${iso}T12:00:00-04:00`) : new Date(iso)
}

export function longDate(iso: string): string {
  return parts(iso).toLocaleDateString('en-US', { timeZone: TZ, weekday: 'long', month: 'long', day: 'numeric' })
}

export function shortDate(iso: string): string {
  return parts(iso).toLocaleDateString('en-US', { timeZone: TZ, month: 'short', day: 'numeric' })
}

export function fullDate(iso: string): string {
  return parts(iso).toLocaleDateString('en-US', { timeZone: TZ, month: 'long', day: 'numeric', year: 'numeric' })
}

export function clock(iso: string): string {
  return parts(iso).toLocaleTimeString('en-US', { timeZone: TZ, hour: 'numeric', minute: '2-digit' })
}

export function dayKey(iso: string): string {
  return parts(iso).toLocaleDateString('en-CA', { timeZone: TZ })
}

export function daysBetween(fromIso: string, toIso: string): number {
  const a = Date.parse(`${dayKey(fromIso)}T00:00:00Z`)
  const b = Date.parse(`${dayKey(toIso)}T00:00:00Z`)
  return Math.round((b - a) / 86400000)
}

export function relativeDay(fromIso: string, toIso: string): string {
  const d = daysBetween(fromIso, toIso)
  if (d === 0) return 'Today'
  if (d === 1) return 'Tomorrow'
  if (d === -1) return 'Yesterday'
  if (d > 1 && d < 7) return `In ${d} days`
  if (d < -1 && d > -7) return `${-d} days ago`
  if (d >= 7 && d < 14) return 'Next week'
  return shortDate(toIso)
}

export function plural(n: number, one: string, many: string): string {
  return `${count(n)} ${n === 1 ? one : many}`
}
