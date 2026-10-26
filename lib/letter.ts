import type { Body, Measure, Meeting, Official } from './types'
import { longDate } from './format'

export type Stance = 'support' | 'oppose' | 'question'

export interface LetterInput {
  measure: Measure
  body: Body
  meeting: Meeting | null
  recipients: Official[]
  stance: Stance
  reason: string
  name: string
  street: string
}

const OPENERS: Record<Stance, string> = {
  support: 'I am writing in support of',
  oppose: 'I am writing to ask you to vote no on',
  question: 'I have questions I would like answered before you vote on'
}

export function composeLetter(input: LetterInput) {
  const { measure, body, meeting, recipients, stance, reason, name, street } = input
  const subject = `${measure.fileNumber}: ${stance === 'support' ? 'Support' : stance === 'oppose' ? 'Opposition' : 'Questions'} from a resident`
  const salutation = recipients.length === 1 ? `Dear ${recipients[0].role} ${recipients[0].name.split(' ').slice(-1)[0]},` : `Dear members of the ${body.name},`

  const lines = [
    salutation,
    '',
    `${OPENERS[stance]} ${measure.fileNumber}, ${measure.officialTitle}`,
    '',
    reason.trim() || '[Say in your own words why this matters to you. One or two specific sentences carry more weight than a long letter.]',
    '',
    meeting
      ? `Please enter this letter into the public record for the ${longDate(meeting.startsAt)} meeting.`
      : 'Please enter this letter into the public record.',
    '',
    'Thank you,',
    name.trim() || '[Your name]',
    street.trim() || '[Your street, so they know you are a resident]'
  ]

  const to = recipients.length ? recipients.map((r) => r.email) : [body.clerkEmail]
  const cc = recipients.length ? [body.clerkEmail] : []
  const text = lines.join('\n')
  const params = new URLSearchParams()
  if (cc.length) params.set('cc', cc.join(','))
  params.set('subject', subject)
  params.set('body', text)

  return {
    subject,
    text,
    to,
    cc,
    href: `mailto:${to.join(',')}?${params.toString().replace(/\+/g, '%20')}`
  }
}
