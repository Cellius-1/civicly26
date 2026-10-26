import { OG_SIZE, ogCard } from '@/lib/og'

export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = 'Civicly: know what your town is deciding'

export default function Image() {
  return ogCard({
    eyebrow: 'An independent public record',
    title: 'Know what your town is deciding',
    detail: 'Proposals, votes, meeting agendas, and budgets from the local governments that serve your address, in plain English.',
    facts: [
      { label: 'Covers', value: 'Township, county, schools' },
      { label: 'Start with', value: 'Your ZIP code' }
    ]
  })
}
