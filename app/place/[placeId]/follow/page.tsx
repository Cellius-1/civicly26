import { FollowBuilder } from '@/components/FollowBuilder'
import { bodyOf, requireBundle } from '@/lib/registry'
import { pageMeta } from '@/lib/site'
import { shortDate } from '@/lib/format'

export async function generateMetadata({ params }: { params: Promise<{ placeId: string }> }) {
  const { placeId } = await params
  const bundle = requireBundle(placeId)
  return pageMeta({
    title: `Get ${bundle.place.shortName} alerts`,
    description: `Follow the topics and neighborhood you care about in ${bundle.place.name} and get deadlines, new proposals, and budget changes as a private feed or calendar file. No email address required.`,
    path: `/place/${placeId}/follow`,
    image: `/place/${placeId}/opengraph-image`,
    keywords: ['alerts', 'rss', 'meeting reminders', bundle.place.shortName]
  })
}

export default async function FollowPage({ params }: { params: Promise<{ placeId: string }> }) {
  const { placeId } = await params
  const bundle = requireBundle(placeId)
  const { place } = bundle

  const meetings = bundle.meetings
    .filter((m) => m.status === 'upcoming')
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .map((m) => ({ id: m.id, label: `${bodyOf(bundle, m.bodyId).shortName}, ${shortDate(m.startsAt)}` }))

  return (
    <>
      <div className="screen__head">
        <p className="screen__eyebrow">Saved on this device only</p>
        <h1 className="screen__title">Hear about it before the vote</h1>
        <p className="screen__sub">
          Choose the issues that matter to you and get notifications for them.
        </p>
      </div>
      <FollowBuilder placeId={place.id} placeName={place.shortName} neighborhoods={place.neighborhoods} meetings={meetings} />
    </>
  )
}
