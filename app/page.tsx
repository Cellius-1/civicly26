import Link from 'next/link'
import { ContinueCard } from '@/components/ContinueCard'
import { LookupForm } from '@/components/LookupForm'
import { LogoMark } from '@/components/Logo'
import { COUNTIES } from '@/lib/data/counties'
import { requireBundle } from '@/lib/registry'

export default function Home() {
  const bundle = requireBundle('bridgewater-nj')
  const { place } = bundle
  const somerset = COUNTIES[0]

  return (
    <div className="welcome">
      <LogoMark className="welcome__mark" size={68} />
      <p className="welcome__name">Civicly</p>

      <h1 className="welcome__promise">Know what your town is deciding.</h1>
      <p className="welcome__sub">
        Stay in the know with the decisions that affect <strong>you</strong>.
      </p>

      <ContinueCard fallback={{ id: place.id, name: place.name }} />

      <LookupForm />

      <div className="chips">
        <Link href={`/place/${place.id}`} className="chip">
          Open {place.shortName}
        </Link>
        <Link href="/lookup?q=Martinsville" className="chip">
          Martinsville
        </Link>
        <Link href="/lookup?q=Somerset%20County" className="chip">
          {somerset.name}
        </Link>
      </div>

      <p className="welcome__trust">
        Independent public record. No major information leaves your device. <Link href="/about">How the records are read</Link>
      </p>

      <div className="welcome__more">
        <h2 className="h2">Locations</h2>
        <p className="body-text body-text--small">
          {place.name} available, the rest of {somerset.name} in progress.
        </p>
        <ul className="coverage">
          {somerset.municipalities.map((m) => (
            <li key={m.name} className={m.placeId ? 'is-live' : ''}>
              {m.placeId ? <Link href={`/place/${m.placeId}`}>{m.name}</Link> : <span>{m.name}</span>}
              <span className="coverage__status">{m.placeId ? 'Available' : 'In progress'}</span>
            </li>
          ))}
        </ul>

        <p className="note">
          <strong>Demonstration records.</strong> Names, votes, and dollar figures for {place.name} are realistic samples built to show how the app works. Contact addresses end in .example and will not deliver.
        </p>
      </div>
    </div>
  )
}
