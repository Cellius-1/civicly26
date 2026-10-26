import type { AgendaItem, Meeting } from './types'

export interface TimedItem {
  item: AgendaItem
  startsAt: Date
  endsAt: Date
}

export function timeline(meeting: Meeting): TimedItem[] {
  const opening = 10
  let cursor = new Date(meeting.startsAt).getTime() + opening * 60000
  return [...meeting.agenda]
    .sort((a, b) => a.order - b.order)
    .map((item) => {
      const startsAt = new Date(cursor)
      cursor += item.minutes * 60000
      return { item, startsAt, endsAt: new Date(cursor) }
    })
}

export function roundToQuarter(d: Date): Date {
  const q = 15 * 60000
  return new Date(Math.round(d.getTime() / q) * q)
}

export function runtimeMinutes(meeting: Meeting): number {
  return 10 + meeting.agenda.reduce((s, a) => s + a.minutes, 0)
}

const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')

const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

export function toIcs(meeting: Meeting, bodyName: string, url: string): string {
  const start = new Date(meeting.startsAt)
  const end = new Date(start.getTime() + runtimeMinutes(meeting) * 60000)
  const description = [
    ...timeline(meeting).map((t) => `${t.item.order}. ${t.item.plainTitle}${t.item.commentAllowed ? ' (public comment)' : ''}`),
    '',
    meeting.commentInstructions,
    url
  ].join('\n')

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Civicly//Local Record//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${meeting.id}@civicly`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${esc(`${bodyName}: ${meeting.title}`)}`,
    `LOCATION:${esc(meeting.location)}`,
    `DESCRIPTION:${esc(description)}`,
    `URL:${url}`,
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    `DESCRIPTION:${esc(`Tomorrow: ${meeting.title}`)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n')
}
