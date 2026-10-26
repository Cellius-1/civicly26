import { listPlaceIds, requireBundle } from '@/lib/registry'
import { SITE, absolute } from '@/lib/site'
import { fullDate } from '@/lib/format'

export const dynamic = 'force-static'

export function GET() {
  const places = listPlaceIds().map(requireBundle)

  const sections = places.map((bundle) => {
    const { place } = bundle
    const base = `/place/${place.id}`
    const measures = bundle.measures
      .map((m) => `- [${m.fileNumber}: ${m.plainTitle}](${absolute(`${base}/measures/${m.id}`)}): decided by ${bundle.bodies.find((b) => b.id === m.bodyId)?.name}. Status: ${m.stage}.`)
      .join('\n')
    const meetings = bundle.meetings
      .filter((m) => m.status === 'upcoming')
      .map((m) => `- [${m.title}, ${fullDate(m.startsAt)}](${absolute(`${base}/meetings/${m.id}`)}): agenda in plain English with estimated times.`)
      .join('\n')

    return `## ${place.name}, ${place.county}, ${place.state}

ZIP codes ${place.zips.join(' and ')}. Records as of ${fullDate(place.asOf)}. Fiscal year ${place.fiscalYear}.
Taxing bodies covered: ${bundle.bodies.map((b) => b.name).join('; ')}.

- [This week](${absolute(base)}): deadlines, meetings, and budget changes in the last two weeks.
- [Proposals and votes](${absolute(`${base}/measures`)}): every ordinance, resolution, and policy with plain summaries and vote records.
- [Meetings](${absolute(`${base}/meetings`)}): agendas with estimated item times and how to speak.
- [Budget](${absolute(`${base}/budget`)}): adopted budget lines grouped by what the money does.
- [Tax receipt](${absolute(`${base}/receipt`)}): splits one property tax bill across every local government and converts it into units of service.
- [Who decides?](${absolute(`${base}/officials`)}): members, terms, and recorded votes.
- [Document sources](${absolute(`${base}/sources`)}): source documents and when each was last checked.
- [RSS feed](${absolute(`/api/feed/${place.id}`)}): filter with ?topics=lens-ids&neighborhood=name.
- [Calendar files](${absolute(`/api/calendar/${place.id}/<meeting-id>`)}): iCalendar for any meeting.

### Proposals on record
${measures}

### Upcoming meetings
${meetings}`
  })

  const body = `# ${SITE.name}

> ${SITE.description}

${SITE.name} reads public agendas, minutes, budget filings, and tax tables from local governments, then rewrites them at an eighth grade reading level. Information is organized by daily life (getting around, where I live, staying safe, water and waste, learning, parks, health, money) rather than by department. Every page links the plain summary to the official wording, the meeting where a decision happens, and a way to write to the people voting.

Important: the records published today are demonstration data for ${places.map((p) => p.place.name).join(', ')}. Names, votes, and dollar figures are realistic samples, contact addresses end in .example, and nothing here should be cited as an official record.

${sections.join('\n\n')}

## Site information

- [How we read the records](${absolute('/about')}): collection, translation, and known limits.
- [Sitemap](${absolute('/sitemap.xml')})
- Licensing: summaries are free to quote with a link to the source document.
- Contact: towns@civicly.example
`

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
  })
}
