import { OG_SIZE, ogCard } from '@/lib/og'
import { listPlaceIds, requireBundle } from '@/lib/registry'
import { count, fullDate } from '@/lib/format'

export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = 'A plain English record of local government decisions'

export function generateStaticParams() {
  return listPlaceIds().map((placeId) => ({ placeId }))
}

export default async function Image({ params }: { params: Promise<{ placeId: string }> }) {
  const { placeId } = await params
  const bundle = requireBundle(placeId)
  const { place } = bundle
  const open = bundle.measures.filter((m) => m.commentClosesOn && m.commentClosesOn >= place.asOf).length

  return ogCard({
    eyebrow: `${place.county}, ${place.state}`,
    title: `What ${place.shortName} is deciding right now`,
    detail: `Every proposal, vote, meeting agenda, and budget line from the ${bundle.bodies.length} public bodies that serve ${place.zips.join(' and ')}.`,
    facts: [
      { label: 'Open for comment', value: `${open} decisions` },
      { label: 'Records as of', value: fullDate(place.asOf) },
      { label: 'Residents', value: count(place.population) }
    ]
  })
}
