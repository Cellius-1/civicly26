import type { Body, Measure, Meeting, Official, PlaceBundle } from './types'
import { longDate } from './format'

/*
 * Works out who is in charge of whatever the resident is looking at,
 * and who is the best person to reach for what they want to do.
 *
 * Ranking is done on the server (it needs the full bundle). The result is
 * plain data, so the client panel can switch between needs instantly and
 * draft the email without another round trip.
 */

export type ContactNeed = 'question' | 'view' | 'agenda' | 'attend'

export const NEEDS: { id: ContactNeed; label: string; hint: string }[] = [
  { id: 'view', label: 'Share my view', hint: 'Reach the people who vote on it' },
  { id: 'question', label: 'Ask a question', hint: 'Get a straight answer about what it does' },
  { id: 'agenda', label: 'Change the agenda', hint: 'Get an item added, pulled, or discussed on its own' },
  { id: 'attend', label: 'Speak or attend', hint: 'Sign up, join remotely, or send a comment for the record' }
]

export interface Contact {
  key: string
  officialId: string | null
  name: string
  /** Official role as written, used in the email greeting. Null for the clerk. */
  role: string | null
  title: string
  email: string
  phone: string
  tags: string[]
  reason: string
}

/** What the message drafter needs to know, kept small so it can cross to the client. */
export interface ContactSubject {
  bodyName: string
  bodyShortName: string
  clerkEmail: string
  measure: { fileNumber: string; plainTitle: string } | null
  meeting: { title: string; date: string } | null
  voteDone: boolean
}

export interface ContactPlan {
  subject: ContactSubject
  byNeed: Record<ContactNeed, Contact[]>
}

const PRESIDING = /(president|director|chair)/i
const DEPUTY = /(vice|deputy)/i

function isPresiding(o: Official) {
  return PRESIDING.test(o.role) && !DEPUTY.test(o.role)
}

function lastName(name: string) {
  return name.split(' ').slice(-1)[0]
}

function termLine(o: Official): string {
  const role = o.role.charAt(0) + o.role.slice(1).toLowerCase()
  const ends = new Date(`${o.termEnds}T12:00:00`).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  return `${role}, term ends ${ends}`
}

export function planContacts(bundle: PlaceBundle, body: Body, opts: { measure?: Measure | null; meeting?: Meeting | null }): ContactPlan {
  const measure = opts.measure ?? null
  const meeting = opts.meeting ?? null
  const members = bundle.officials.filter((o) => o.bodyId === body.id)
  const presiding = members.find(isPresiding) ?? null
  const executive = body.kind === 'municipal' ? members.find((o) => /^mayor$/i.test(o.role)) ?? null : null
  const voters = members.filter((o) => o !== executive)
  const sponsors = new Set(measure?.sponsorIds ?? [])
  const ballots = new Map((measure?.vote?.ballots ?? []).map((b) => [b.officialId, b.vote]))
  const voteDone = Boolean(measure?.vote)
  const upcomingVote = measure && !voteDone && meeting ? longDate(meeting.startsAt) : null
  const boardWord = body.kind === 'school' ? 'board' : body.kind === 'county' ? 'commissioners' : 'council'

  const tagsFor = (o: Official) => {
    const tags: string[] = []
    if (o === presiding) tags.push(meeting ? 'Runs this meeting' : 'Presides')
    if (o === executive) tags.push('Runs day-to-day operations')
    if (sponsors.has(o.id)) tags.push('Sponsor')
    const v = ballots.get(o.id)
    if (v) tags.push(v === 'absent' ? 'Was absent for the vote' : `Voted ${v}`)
    return tags
  }

  const person = (o: Official, reason: string): Contact => ({
    key: o.id,
    officialId: o.id,
    name: o.name,
    role: o.role,
    title: termLine(o),
    email: o.email,
    phone: o.phone,
    tags: tagsFor(o),
    reason
  })

  const clerk = (reason: string): Contact => ({
    key: `clerk-${body.id}`,
    officialId: null,
    name: body.clerkName,
    role: null,
    title: body.name,
    email: body.clerkEmail,
    phone: body.clerkPhone,
    tags: [],
    reason
  })

  const presidingReason = (need: ContactNeed) => {
    if (!presiding) return ''
    switch (need) {
      case 'agenda':
        return `Sets the agenda and runs the meeting, so they decide what comes up, in what order, and whether a consent item gets pulled for its own vote.`
      case 'view':
        return upcomingVote
          ? `Chairs the ${upcomingVote} meeting and casts a vote. Members often look to the chair on how an item is framed.`
          : `Leads the ${boardWord} and can put the item back on the agenda.`
      case 'question':
        return `Runs the ${boardWord}'s meetings and can ask staff to answer your question on the record.`
      case 'attend':
        return `Calls on public speakers and enforces the time limits.`
    }
  }

  const sponsorReason = (_o: Official) =>
    `Put this forward, so they know why it is written the way it is and can propose changes.`

  const voterReason = (o: Official) => {
    const v = ballots.get(o.id)
    if (v === 'yes') return `Voted yes. Ask what would change their mind, or thank them if you agree.`
    if (v === 'no') return `Voted no. A likely ally if you want this revisited.`
    if (v === 'absent') return `Missed the vote, so has not taken a public position yet.`
    if (upcomingVote) return `Has a vote on this at the ${upcomingVote} meeting.`
    return `A voting member of the ${boardWord}.`
  }

  const executiveReason = (need: ContactNeed) =>
    executive
      ? need === 'agenda'
        ? `Their administration prepares many of the items the ${boardWord} votes on.`
        : `Does not vote on ${boardWord} items but carries out what passes.`
      : ''

  const byNeed: Record<ContactNeed, Contact[]> = { question: [], view: [], agenda: [], attend: [] }

  // Share my view: everyone with a vote, sponsors and the chair first, the clerk last so it lands in the record.
  {
    const score = (o: Official) => (o === presiding ? 4 : 0) + (sponsors.has(o.id) ? 3 : 0) + (ballots.get(o.id) === 'no' ? 1 : 0)
    const ordered = [...voters].sort((a, b) => score(b) - score(a))
    byNeed.view = ordered.map((o) => person(o, o === presiding ? presidingReason('view') : sponsors.has(o.id) ? sponsorReason(o) : voterReason(o)))
    if (executive) byNeed.view.push(person(executive, executiveReason('view')))
    byNeed.view.push(clerk(`Send a copy here and ask for it to be entered into the public record${meeting ? ` for ${longDate(meeting.startsAt)}` : ''}. Every member receives it.`))
  }

  // Ask a question: whoever wrote it, then the clerk, who can send the documents.
  {
    const list: Contact[] = []
    for (const o of voters.filter((x) => sponsors.has(x.id))) list.push(person(o, sponsorReason(o)))
    list.push(clerk(`Can send you the full packet, staff reports, and minutes, and tell you who on staff prepared the item.`))
    if (presiding && !sponsors.has(presiding.id)) list.push(person(presiding, presidingReason('question')))
    if (executive) list.push(person(executive, executiveReason('question')))
    byNeed.question = list
  }

  // Change the agenda: the chair decides, the clerk builds it.
  {
    const list: Contact[] = []
    if (presiding) list.push(person(presiding, presidingReason('agenda')))
    list.push(clerk(`Assembles the agenda and knows the deadline for adding items. Ask how far ahead requests need to be in.`))
    for (const o of voters.filter((x) => sponsors.has(x.id) && x !== presiding)) list.push(person(o, sponsorReason(o)))
    if (executive) list.push(person(executive, executiveReason('agenda')))
    byNeed.agenda = list
  }

  // Speak or attend: the clerk handles sign-ups and written comments.
  {
    const list: Contact[] = [
      clerk(
        meeting?.commentSignupClosesAt
          ? `Takes speaker sign-ups until ${longDate(meeting.commentSignupClosesAt)}. Can also read your written comment into the record if you cannot come.`
          : `Takes speaker sign-ups, sets up remote access, and can read your written comment into the record if you cannot come.`
      )
    ]
    if (presiding) list.push(person(presiding, presidingReason('attend')))
    byNeed.attend = list
  }

  return {
    byNeed,
    subject: {
      bodyName: body.name,
      bodyShortName: body.shortName,
      clerkEmail: body.clerkEmail,
      measure: measure ? { fileNumber: measure.fileNumber, plainTitle: measure.plainTitle } : null,
      meeting: meeting ? { title: meeting.title, date: meeting.startsAt } : null,
      voteDone
    }
  }
}

/* ---------- drafting, safe to run in the browser ---------- */

function topicOf(s: ContactSubject) {
  if (s.measure) return `${s.measure.fileNumber} (${s.measure.plainTitle})`
  if (s.meeting) return `the ${longDate(s.meeting.date)} ${s.meeting.title}`
  return `the ${s.bodyName}`
}

function greeting(c: Contact) {
  if (!c.role) return 'Hello,'
  return `Dear ${c.role} ${lastName(c.name)},`
}

export function draftMessage(s: ContactSubject, c: Contact, need: ContactNeed, input: { name: string; note: string }) {
  const topic = topicOf(s)
  const note = input.note.trim()
  const yours = note || '[Add a sentence or two in your own words. Specific and local beats long.]'
  const sign = input.name.trim() || '[Your name and street]'

  const subjects: Record<ContactNeed, string> = {
    view: `Resident comment on ${s.measure?.fileNumber ?? topic}`,
    question: `Question about ${s.measure?.fileNumber ?? topic}`,
    agenda: `Agenda request: ${s.measure?.fileNumber ?? topic}`,
    attend: s.meeting ? `Public comment, ${longDate(s.meeting.date)} meeting` : `Public comment for ${s.bodyShortName}`
  }

  const bodies: Record<ContactNeed, string[]> = {
    view: [
      `I live in town and am writing about ${topic}.`,
      '',
      yours,
      '',
      s.voteDone ? 'I would appreciate knowing how you see this now that it has been voted on.' : 'I hope you will weigh this before you vote.',
      'Please include this message in the public record.'
    ],
    question: [
      `I am trying to understand ${topic} and have a question:`,
      '',
      yours,
      '',
      'A short written reply, or a pointer to the right document, would help a lot.'
    ],
    agenda: [
      `I am writing about ${topic}.`,
      '',
      yours,
      '',
      'Could you tell me whether this can be placed on, or pulled out for separate discussion on, an upcoming agenda, and what the deadline is?'
    ],
    attend: [
      s.meeting ? `I would like to take part in public comment at the ${longDate(s.meeting.date)} ${s.meeting.title}.` : `I would like to take part in public comment at your next meeting.`,
      '',
      yours,
      '',
      'If I am unable to attend, please read this into the record. Please also let me know if remote participation is available.'
    ]
  }

  const text = [greeting(c), '', ...bodies[need], '', 'Thank you,', sign].join('\n')
  const subject = subjects[need]
  const params = new URLSearchParams()
  // Copy the clerk on messages to elected members so they land in the record.
  if (c.officialId && need !== 'question') params.set('cc', s.clerkEmail)
  params.set('subject', subject)
  params.set('body', text)
  return { subject, text, href: `mailto:${c.email}?${params.toString().replace(/\+/g, '%20')}` }
}
