import { SITE, absolute } from './site'
import { bodyOf } from './registry'
import { runtimeMinutes } from './agenda'
import { STAGES } from './stages'
import type { Body, BudgetLine, Measure, Meeting, PlaceBundle } from './types'

export function siteGraph() {
  return [
    {
      '@type': 'WebSite',
      '@id': `${SITE.url}#website`,
      url: SITE.url,
      name: SITE.name,
      description: SITE.description,
      inLanguage: 'en-US',
      publisher: { '@id': `${SITE.url}#publisher` },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${SITE.url}/lookup?q={search_term_string}` },
        'query-input': 'required name=search_term_string'
      }
    },
    {
      '@type': 'Organization',
      '@id': `${SITE.url}#publisher`,
      name: SITE.name,
      url: SITE.url,
      description: 'An independent public record of local government decisions, written for residents.'
    }
  ]
}

export function placeGraph(bundle: PlaceBundle) {
  const { place } = bundle
  const path = `/place/${place.id}`
  return [
    {
      '@type': 'AdministrativeArea',
      '@id': absolute(`${path}#place`),
      name: place.name,
      url: absolute(path),
      address: { '@type': 'PostalAddress', addressLocality: place.shortName, addressRegion: place.stateCode, addressCountry: 'US', postalCode: place.zips[0] },
      containedInPlace: { '@type': 'AdministrativeArea', name: place.county },
      additionalProperty: [
        { '@type': 'PropertyValue', name: 'Population', value: place.population },
        { '@type': 'PropertyValue', name: 'Households', value: place.households }
      ]
    },
    ...bundle.bodies.map((body) => governmentBody(body, place.id))
  ]
}

function governmentBody(body: Body, placeId: string) {
  return {
    '@type': 'GovernmentOrganization',
    '@id': absolute(`/place/${placeId}#${body.id}`),
    name: body.name,
    description: body.governs,
    url: body.website,
    email: body.clerkEmail,
    telephone: body.clerkPhone,
    location: { '@type': 'Place', name: body.meetsWhere }
  }
}

export function breadcrumbs(trail: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, item: absolute(t.path) }))
  }
}

export function measureGraph(bundle: PlaceBundle, measure: Measure) {
  const body = bodyOf(bundle, measure.bodyId)
  const path = `/place/${bundle.place.id}/measures/${measure.id}`
  const filed = measure.history[0]?.date
  const last = measure.history[measure.history.length - 1]?.date

  return {
    '@type': 'Legislation',
    '@id': absolute(`${path}#legislation`),
    name: measure.plainTitle,
    alternateName: measure.officialTitle,
    legislationIdentifier: measure.fileNumber,
    legislationType: measure.fileNumber.startsWith('Ord') ? 'Ordinance' : measure.fileNumber.startsWith('Res') ? 'Resolution' : 'Policy',
    legislationDate: filed,
    dateModified: last,
    legislationPassedBy: { '@type': 'GovernmentOrganization', name: body.name },
    legislationJurisdiction: { '@type': 'AdministrativeArea', name: bundle.place.name },
    legislationLegalForce: measure.stage === 'in-effect' ? 'https://schema.org/InForce' : 'https://schema.org/NotInForce',
    description: measure.plainSummary,
    url: absolute(path),
    inLanguage: 'en-US',
    creativeWorkStatus: STAGES[measure.stage].label
  }
}

export function meetingGraph(bundle: PlaceBundle, meeting: Meeting) {
  const body = bodyOf(bundle, meeting.bodyId)
  const path = `/place/${bundle.place.id}/meetings/${meeting.id}`
  const end = new Date(new Date(meeting.startsAt).getTime() + runtimeMinutes(meeting) * 60000).toISOString()

  return {
    '@type': 'Event',
    '@id': absolute(`${path}#event`),
    name: `${body.name}: ${meeting.title}`,
    startDate: meeting.startsAt,
    endDate: end,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
    isAccessibleForFree: true,
    location: { '@type': 'Place', name: meeting.location, address: { '@type': 'PostalAddress', addressLocality: bundle.place.shortName, addressRegion: bundle.place.stateCode, addressCountry: 'US' } },
    organizer: { '@type': 'GovernmentOrganization', name: body.name, url: body.website },
    url: absolute(path),
    description: meeting.agenda.map((a) => a.plainTitle).join('. ')
  }
}

export function budgetGraph(bundle: PlaceBundle, lines: BudgetLine[]) {
  const path = `/place/${bundle.place.id}/budget`
  return {
    '@type': 'Dataset',
    '@id': absolute(`${path}#dataset`),
    name: `${bundle.place.name} area public budgets, fiscal year ${bundle.place.fiscalYear}`,
    description: `Adopted budget lines for the ${bundle.bodies.length} public bodies that tax property in ${bundle.place.name}, grouped by what the money does.`,
    url: absolute(path),
    license: 'https://creativecommons.org/publicdomain/zero/1.0/',
    isAccessibleForFree: true,
    creator: { '@id': `${SITE.url}#publisher` },
    variableMeasured: lines.map((l) => ({ '@type': 'PropertyValue', name: l.plainLabel, alternateName: l.officialLabel, value: l.amount, unitCode: 'USD' }))
  }
}

export function faqGraph(items: { question: string; answer: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({ '@type': 'Question', name: i.question, acceptedAnswer: { '@type': 'Answer', text: i.answer } }))
  }
}
