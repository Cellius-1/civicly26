import Link from 'next/link'
import { LookupForm } from '@/components/LookupForm'
import { TopBar } from '@/components/TopBar'
import { absolute } from '@/lib/site'

export const metadata = {
  title: 'Page not found',
  description: 'That record is not on file. Search for your town to start again.',
  robots: { index: false, follow: true },
  alternates: { canonical: absolute('/') }
}

export default function NotFound() {
  return (
    <>
      <TopBar title="Not found" />
      <div className="plain">
      <div className="narrow">
        <p className="screen__eyebrow">Page not found</p>
        <h1 className="screen__title">That record is not on file</h1>
        <p className="lede">It may have been renumbered or withdrawn. Search for your town to start again.</p>
        <LookupForm size="small" />
        <ul className="choice">
          <li>
            <Link href="/place/bridgewater-nj" className="choice__link">
              Open Bridgewater
            </Link>
          </li>
          <li>
            <Link href="/place/bridgewater-nj/measures" className="choice__link">
              All proposals and votes
            </Link>
          </li>
          <li>
            <Link href="/place/bridgewater-nj/meetings" className="choice__link">
              Upcoming meetings
            </Link>
          </li>
          <li>
            <Link href="/" className="choice__link">
              Return to the front page
            </Link>
          </li>
        </ul>
      </div>
      </div>
    </>
  )
}
