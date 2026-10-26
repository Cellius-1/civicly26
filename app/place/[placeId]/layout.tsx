import { notFound } from 'next/navigation'
import { AppShell } from '@/components/AppShell'
import { JsonLd } from '@/components/JsonLd'
import { bodyOf, getBundle, listPlaceIds } from '@/lib/registry'
import { buildIndex } from '@/lib/search'
import { placeGraph } from '@/lib/schema'
import { longDate } from '@/lib/format'

export function generateStaticParams() {
  return listPlaceIds().map((placeId) => ({ placeId }))
}

export const dynamicParams = false

export default async function PlaceLayout({ children, params }: { children: React.ReactNode; params: Promise<{ placeId: string }> }) {
  const { placeId } = await params
  const bundle = getBundle(placeId)
  if (!bundle) notFound()

  const { place } = bundle
  const base = `/place/${place.id}`

  const titles: Record<string, string> = {
    [base]: place.shortName,
    [`${base}/measures`]: 'Proposals and votes',
    [`${base}/meetings`]: 'Meetings',
    [`${base}/budget`]: 'Money allocation',
    [`${base}/receipt`]: 'Your tax receipt',
    [`${base}/officials`]: 'Who decides?',
    [`${base}/follow`]: 'Alerts',
    [`${base}/sources`]: 'Document sources',
    [`${base}/feed`]: 'Your feed'
  }

  for (const m of bundle.measures) titles[`${base}/measures/${m.id}`] = m.plainTitle
  for (const mt of bundle.meetings) titles[`${base}/meetings/${mt.id}`] = `${bodyOf(bundle, mt.bodyId).shortName}, ${longDate(mt.startsAt)}`

  return (
    <>
      <JsonLd data={placeGraph(bundle)} />
      <AppShell
        place={{ id: place.id, name: place.name, shortName: place.shortName, county: place.county, asOf: place.asOf }}
        titles={titles}
        docs={buildIndex(bundle)}
      >
        {children}
      </AppShell>
    </>
  )
}
