import { OG_SIZE, ogCard } from '@/lib/og'
import { bodyOf, listPlaceIds, measureOf, requireBundle } from '@/lib/registry'
import { STAGES } from '@/lib/stages'
import { costLabel } from '@/lib/receipt'
import { shortDate } from '@/lib/format'

export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = 'A local government proposal explained in plain English'

export function generateStaticParams() {
  return listPlaceIds().flatMap((placeId) => requireBundle(placeId).measures.map((m) => ({ placeId, measureId: m.id })))
}

export default async function Image({ params }: { params: Promise<{ placeId: string; measureId: string }> }) {
  const { placeId, measureId } = await params
  const bundle = requireBundle(placeId)
  const measure = measureOf(bundle, measureId)
  if (!measure) return ogCard({ eyebrow: 'Civicly', title: 'Proposal not found', detail: 'This record may have been renumbered or withdrawn.' })

  const body = bodyOf(bundle, measure.bodyId)
  const facts = [
    { label: 'Status', value: STAGES[measure.stage].label },
    { label: 'Per household', value: costLabel(bundle, measure) }
  ]
  if (measure.commentClosesOn) facts.push({ label: 'Comment by', value: shortDate(measure.commentClosesOn) })

  return ogCard({
    eyebrow: `${body.name} ${String.fromCharCode(183)} ${measure.fileNumber}`,
    title: measure.plainTitle,
    detail: measure.plainSummary,
    facts
  })
}
