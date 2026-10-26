import { BudgetExplorer, type BudgetRow } from '@/components/BudgetExplorer'
import { JsonLd } from '@/components/JsonLd'
import { bodyOf, measuresFor, requireBundle } from '@/lib/registry'
import { breadcrumbs, budgetGraph } from '@/lib/schema'
import { pageMeta } from '@/lib/site'
import { compactMoney } from '@/lib/format'

export async function generateMetadata({ params }: { params: Promise<{ placeId: string }> }) {
  const { placeId } = await params
  const bundle = requireBundle(placeId)
  const total = bundle.budget.reduce((s, l) => s + l.amount, 0)
  return pageMeta({
    title: `Money allocation in ${bundle.place.shortName}`,
    description: `${compactMoney(total)} of adopted ${bundle.place.fiscalYear} budgets from the township, Somerset County, the school district, fire districts, and the library, grouped by what the money does and compared with last year.`,
    path: `/place/${placeId}/budget`,
    image: `/place/${placeId}/opengraph-image`,
    keywords: ['municipal budget', 'school budget', 'county budget', bundle.place.shortName]
  })
}

export default async function BudgetPage({ params }: { params: Promise<{ placeId: string }> }) {
  const { placeId } = await params
  const bundle = requireBundle(placeId)
  const { place } = bundle

  const rows: BudgetRow[] = bundle.budget.map((line) => {
    const body = bodyOf(bundle, line.bodyId)
    return {
      line,
      bodyShort: body.shortName,
      bodyKind: body.kind,
      clerkEmail: body.clerkEmail,
      snapshots: bundle.snapshots.filter((s) => s.lineId === line.id).sort((a, b) => a.capturedOn.localeCompare(b.capturedOn)),
      related: measuresFor(bundle, line.id).map((m) => ({ id: m.id, title: m.plainTitle, href: `/place/${place.id}/measures/${m.id}` }))
    }
  })

  return (
    <>
      <JsonLd
        data={[
          budgetGraph(bundle, bundle.budget),
          breadcrumbs([
            { name: 'Civicly', path: '/' },
            { name: place.name, path: `/place/${place.id}` },
            { name: 'Budget', path: `/place/${place.id}/budget` }
          ])
        ]}
      />
      <div className="screen__head">
        <p className="screen__eyebrow">Fiscal year {place.fiscalYear}</p>
        <h1 className="screen__title">Money allocation</h1>
        <p className="screen__sub">
          Sorted by where it goes.
        </p>
      </div>
      <BudgetExplorer placeName={place.shortName} rows={rows} bodies={bundle.bodies.map((b) => ({ id: b.id, shortName: b.shortName }))} />
    </>
  )
}
