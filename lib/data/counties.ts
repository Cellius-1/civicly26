import type { CountyEntry } from '../types'

export const COUNTIES: CountyEntry[] = [
  {
    slug: 'somerset-nj',
    name: 'Somerset County',
    state: 'NJ',
    municipalities: [
      { name: 'Bridgewater Township', zips: ['08807', '08836'], placeId: 'bridgewater-nj' },
      { name: 'Bedminster Township', zips: ['07921'], placeId: null },
      { name: 'Bernards Township', zips: ['07920', '07939'], placeId: null },
      { name: 'Bernardsville Borough', zips: ['07924'], placeId: null },
      { name: 'Bound Brook Borough', zips: ['08805'], placeId: null },
      { name: 'Branchburg Township', zips: ['08853', '08876'], placeId: null },
      { name: 'Far Hills Borough', zips: ['07931'], placeId: null },
      { name: 'Franklin Township', zips: ['08873', '08823', '08875'], placeId: null },
      { name: 'Green Brook Township', zips: ['08812'], placeId: null },
      { name: 'Hillsborough Township', zips: ['08844'], placeId: null },
      { name: 'Manville Borough', zips: ['08835'], placeId: null },
      { name: 'Millstone Borough', zips: ['08844'], placeId: null },
      { name: 'Montgomery Township', zips: ['08558', '08502'], placeId: null },
      { name: 'North Plainfield Borough', zips: ['07060', '07063'], placeId: null },
      { name: 'Peapack and Gladstone Borough', zips: ['07977', '07934'], placeId: null },
      { name: 'Raritan Borough', zips: ['08869'], placeId: null },
      { name: 'Rocky Hill Borough', zips: ['08553'], placeId: null },
      { name: 'Somerville Borough', zips: ['08876'], placeId: null },
      { name: 'South Bound Brook Borough', zips: ['08880'], placeId: null },
      { name: 'Warren Township', zips: ['07059'], placeId: null },
      { name: 'Watchung Borough', zips: ['07069'], placeId: null }
    ]
  }
]
