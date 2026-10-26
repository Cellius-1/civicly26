import { JsonLd } from '@/components/JsonLd'
import { ReceiptBuilder } from '@/components/ReceiptBuilder'
import { requireBundle } from '@/lib/registry'
import { buildReceipt } from '@/lib/receipt'
import { breadcrumbs } from '@/lib/schema'
import { pageMeta } from '@/lib/site'
import { money } from '@/lib/format'

export async function generateMetadata({ params }: { params: Promise<{ placeId: string }> }) {
  const { placeId } = await params
  const bundle = requireBundle(placeId)
  const receipt = buildReceipt(bundle, bundle.place.medianAssessedValue)
  return pageMeta({
    title: `Your ${bundle.place.shortName} tax receipt`,
    description: `A home assessed at ${money(bundle.place.medianAssessedValue)} pays about ${money(receipt.total)} a year across ${bundle.bodies.length} governments. See your own split, down to feet of repaved road and hours the library stays open.`,
    path: `/place/${placeId}/receipt`,
    image: `/place/${placeId}/opengraph-image`,
    keywords: ['property tax', 'tax receipt', 'where my taxes go', bundle.place.shortName]
  })
}

export default async function ReceiptPage({ params }: { params: Promise<{ placeId: string }> }) {
  const { placeId } = await params
  const bundle = requireBundle(placeId)

  return (
    <>
      <JsonLd
        data={breadcrumbs([
          { name: 'Civicly', path: '/' },
          { name: bundle.place.name, path: `/place/${bundle.place.id}` },
          { name: 'Tax receipt', path: `/place/${bundle.place.id}/receipt` }
        ])}
      />
      <div className="screen__head">
        <p className="screen__eyebrow">{bundle.place.shortName}, tax year {bundle.place.fiscalYear}</p>
        <h1 className="screen__title">Your tax receipt</h1>
        <p className="screen__sub">
          Enter your assessed value below to see your share.
        </p>
      </div>
      <ReceiptBuilder bundle={bundle} />
    </>
  )
}
