import Link from 'next/link'
import { redirect } from 'next/navigation'
import { LookupForm } from '@/components/LookupForm'
import { TopBar } from '@/components/TopBar'
import { getBundle, lookup } from '@/lib/registry'
import { absolute } from '@/lib/site'

export const metadata = {
  title: 'Find your local government',
  description: 'Enter a ZIP code, town, or county to open the public record for the governments that serve that address.',
  robots: { index: false, follow: true },
  alternates: { canonical: absolute('/lookup') }
}

export default async function LookupPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams
  const result = lookup(q)

  if (result.kind === 'place' && result.matchedBy !== 'partial-zip') redirect(`/place/${result.placeId}`)

  return (
    <>
      <TopBar title="Find your local government" />
      <div className="plain">
      <div className="narrow">
        {result.kind === 'place' ? (
          <>
            <h1 className="h1">ZIP {q.trim().slice(0, 5)} crosses town lines</h1>
            <p className="lede">
              Part of this ZIP code is in {getBundle(result.placeId)?.place.name}. Your tax bill or voter registration card lists your municipality if you are not sure.
            </p>
            <ul className="choice">
              <li>
                <Link href={`/place/${result.placeId}`} className="choice__link">
                  I live in {getBundle(result.placeId)?.place.name}
                </Link>
              </li>
              <li>
                <Link href="/lookup?q=Somerset%20County" className="choice__link">
                  Show me the other towns in Somerset County
                </Link>
              </li>
            </ul>
          </>
        ) : result.kind === 'county' ? (
          <>
            <h1 className="h1">{result.county.name}, {result.county.state}</h1>
            <p className="lede">Choose your town. Local decisions like zoning, police, and trash pickup are made at the town level, so that is where your record starts.</p>
            <ul className="choice">
              {result.county.municipalities.map((m) => (
                <li key={m.name}>
                  {m.placeId ? (
                    <Link href={`/place/${m.placeId}`} className="choice__link">
                      {m.name}
                    </Link>
                  ) : (
                    <span className="choice__link is-queued">
                      {m.name}
                      <span className="choice__note">Not yet translated</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </>
        ) : result.kind === 'uncovered' ? (
          <>
            <h1 className="h1">{result.label} is not translated yet</h1>
            <p className="lede">
              We found your town{result.county ? ` in ${result.county.name}` : ''}, but have not finished reading its records. County decisions that affect you are already covered through a neighboring town.
            </p>
            <ul className="choice">
              <li>
                <Link href="/place/bridgewater-nj/measures?body=county" className="choice__link">
                  See {result.county?.name ?? 'county'} decisions
                </Link>
              </li>
              <li>
                <Link href="/about#request" className="choice__link">
                  Ask for {result.label} to be added next
                </Link>
              </li>
            </ul>
          </>
        ) : (
          <>
            <h1 className="h1">{q ? `No match for "${q}"` : 'Find your local government'}</h1>
            <p className="lede">Try a five digit ZIP code, a town name, or a county name.</p>
            <LookupForm initial={q} size="small" />
          </>
        )}
      </div>
      </div>
    </>
  )
}
