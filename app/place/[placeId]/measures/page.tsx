import { Suspense } from 'react'
import { MeasureBrowser, type MeasureRow } from '@/components/MeasureBrowser'
import { JsonLd } from '@/components/JsonLd'
import { bodyOf, meetingFor, requireBundle } from '@/lib/registry'
import { costLabel } from '@/lib/receipt'
import { roundToQuarter, timeline } from '@/lib/agenda'
import { breadcrumbs } from '@/lib/schema'
import { pageMeta } from '@/lib/site'
import { clock, shortDate } from '@/lib/format'

export async function generateMetadata({ params }: { params: Promise<{ placeId: string }> }) {
  const { placeId } = await params
  const bundle = requireBundle(placeId)
  const open = bundle.measures.filter((m) => m.commentClosesOn && m.commentClosesOn >= bundle.place.asOf).length
  return pageMeta({
    title: `Proposals and votes in ${bundle.place.shortName}`,
    description: `All ${bundle.measures.length} ordinances, resolutions, and policies before the ${bundle.place.shortName} township council, Somerset County commissioners, school board, fire districts, and library, with ${open} still open for public comment.`,
    path: `/place/${placeId}/measures`,
    image: `/place/${placeId}/opengraph-image`,
    keywords: ['ordinances', 'resolutions', 'council votes', bundle.place.shortName]
  })
}

export default async function MeasuresPage({ params }: { params: Promise<{ placeId: string }> }) {
  const { placeId } = await params
  const bundle = requireBundle(placeId)

  const rows: MeasureRow[] = bundle.measures.map((m) => {
    const meeting = meetingFor(bundle, m.id)
    const slot = meeting ? timeline(meeting).find((t) => t.item.measureId === m.id) : null
    return {
      measure: m,
      bodyShort: bodyOf(bundle, m.bodyId).shortName,
      costLabel: costLabel(bundle, m),
      meeting: meeting
        ? {
            id: meeting.id,
            label: `${bodyOf(bundle, meeting.bodyId).shortName} meeting on ${shortDate(meeting.startsAt)}`,
            itemTime: slot ? clock(roundToQuarter(slot.startsAt).toISOString()) : null
          }
        : null
    }
  })

  return (
    <>
      <JsonLd
        data={breadcrumbs([
          { name: 'Civicly', path: '/' },
          { name: bundle.place.name, path: `/place/${placeId}` },
          { name: 'Proposals and votes', path: `/place/${placeId}/measures` }
        ])}
      />
      <div className="screen__head">
        <p className="screen__eyebrow">{bundle.place.shortName}</p>
        <h1 className="screen__title">Proposals and votes</h1>
        <p className="screen__sub">
          All major proposals and votes.
        </p>
      </div>
      <Suspense fallback={<p className="browser__count">Loading proposals</p>}>
        <MeasureBrowser
          placeId={placeId}
          rows={rows}
          bodies={bundle.bodies.map((b) => ({ id: b.id, shortName: b.shortName }))}
          neighborhoods={bundle.place.neighborhoods}
          asOf={bundle.place.asOf}
        />
      </Suspense>
    </>
  )
}
