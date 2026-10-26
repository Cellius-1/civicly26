import { FeedPanel } from '@/components/FeedPanel'
import { JsonLd } from '@/components/JsonLd'
import { bodyOf, requireBundle } from '@/lib/registry'
import { signalsFor } from '@/lib/signals'
import { breadcrumbs } from '@/lib/schema'
import { pageMeta } from '@/lib/site'
import { shortDate } from '@/lib/format'

export async function generateMetadata({ params }: { params: Promise<{ placeId: string }> }) {
  const { placeId } = await params
  const bundle = requireBundle(placeId)
  return pageMeta({
    title: `Your ${bundle.place.shortName} feed`,
    description: `Subscribe to ${bundle.place.name} deadlines, meetings, decisions, and budget changes in any news reader. No account, no email address, filtered by the topics and neighborhood you choose.`,
    path: `/place/${placeId}/feed`,
    image: `/place/${placeId}/opengraph-image`,
    keywords: ['rss', 'feed', 'subscribe', bundle.place.shortName]
  })
}

export default async function FeedScreen({ params }: { params: Promise<{ placeId: string }> }) {
  const { placeId } = await params
  const bundle = requireBundle(placeId)
  const { place } = bundle

  const meetings = bundle.meetings
    .filter((m) => m.status === 'upcoming')
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .map((m) => ({ id: m.id, label: `${bodyOf(bundle, m.bodyId).shortName} meeting, ${shortDate(m.startsAt)}` }))

  return (
    <>
      <JsonLd
        data={breadcrumbs([
          { name: 'Civicly', path: '/' },
          { name: place.name, path: `/place/${place.id}` },
          { name: 'Alerts', path: `/place/${place.id}/follow` },
          { name: 'Your feed', path: `/place/${place.id}/feed` }
        ])}
      />
      <div className="screen__head">
        <p className="screen__eyebrow">Subscription</p>
        <h1 className="screen__title">Your feed</h1>
        <p className="screen__sub">
          One address you paste into a news reader. It watches {place.shortName} for you and shows new entries the day they appear.
        </p>
      </div>
      <FeedPanel placeId={place.id} placeName={place.shortName} signals={signalsFor(bundle)} meetings={meetings} />
    </>
  )
}
