import type { PlaceBundle } from '../types'

export const bridgewater: PlaceBundle = {
  place: {
    id: 'bridgewater-nj',
    name: 'Bridgewater Township',
    shortName: 'Bridgewater',
    kind: 'township',
    county: 'Somerset County',
    state: 'New Jersey',
    stateCode: 'NJ',
    population: 45977,
    households: 16240,
    zips: ['08807', '08836'],
    partialZips: ['08805', '08876'],
    neighborhoods: ['Martinsville', 'Bradley Gardens', 'Finderne', 'Green Knoll', 'Chimney Rock', 'Van Horne', 'Sunset Lake'],
    fiscalYear: '2026',
    asOf: '2026-09-16',
    medianAssessedValue: 548000,
    equalizationRatio: 0.912,
    sampleData: true
  },
  bodies: [
    {
      id: 'twp',
      name: 'Bridgewater Township Council',
      shortName: 'Township',
        kind: 'municipal',
      governs: 'Local roads, police, parks, zoning, trash contracts, and township buildings.',
      meetsWhere: 'Municipal Courtroom, 100 Commons Way',
      cadence: 'First and third Monday, 7:00 PM',
      clerkName: 'Office of the Township Clerk',
      clerkEmail: 'clerk@bridgewater-twp.example',
      clerkPhone: '(908) 725-6300',
      website: 'https://www.bridgewaternj.gov',
      ratePer100: 0.312,
      placeShare: 1
    },
    {
      id: 'county',
      name: 'Somerset County Board of Commissioners',
      shortName: 'County',
      kind: 'county',
      governs: 'County roads and bridges, the county jail, parks commission, health department, and the county college share.',
      meetsWhere: 'County Administration Building, 20 Grove Street, Somerville',
      cadence: 'Second and fourth Tuesday, 7:00 PM',
      clerkName: 'Clerk of the Board',
      clerkEmail: 'board-clerk@somerset-county.example',
      clerkPhone: '(908) 231-7000',
      website: 'https://www.co.somerset.nj.us',
      ratePer100: 0.348,
      placeShare: 0.168
    },
    {
      id: 'brrsd',
      name: 'Bridgewater-Raritan Regional Board of Education',
      shortName: 'Schools',
      kind: 'school',
      governs: 'Eleven public schools serving Bridgewater and Raritan Borough, from kindergarten through twelfth grade.',
      meetsWhere: 'Board Office, 836 Newmans Lane',
      cadence: 'Most Tuesdays, twice a month, 7:30 PM',
      clerkName: 'Board Secretary',
      clerkEmail: 'board-secretary@brrsd.example',
      clerkPhone: '(908) 685-2777',
      website: 'https://www.brrsd.org',
      ratePer100: 1.187,
      placeShare: 0.872
    },
    {
      id: 'fire',
      name: 'Bridgewater Fire Districts 1 through 4',
      shortName: 'Fire',
      kind: 'fire',
      governs: 'Volunteer fire companies, their trucks, firehouses, and gear.',
      meetsWhere: 'Each district firehouse',
      cadence: 'Monthly, dates vary by district',
      clerkName: 'District Secretaries',
      clerkEmail: 'fire-commissioners@bridgewater-fire.example',
      clerkPhone: '(908) 725-6300',
      website: 'https://www.bridgewaternj.gov',
      ratePer100: 0.041,
      placeShare: 1
    },
    {
      id: 'library',
      name: 'Somerset County Library System',
      shortName: 'Library',
      kind: 'library',
      governs: 'The Bridgewater branch on Vogt Drive and the rest of the county library network.',
      meetsWhere: 'Bridgewater Library, 1 Vogt Drive',
      cadence: 'Third Wednesday, 6:30 PM',
      clerkName: 'Library Commission Secretary',
      clerkEmail: 'commission@sclsnj.example',
      clerkPhone: '(908) 526-4016',
      website: 'https://www.sclsnj.org',
      ratePer100: 0.029,
      placeShare: 0.142
    }
  ],
  officials: [
    { id: 'o-hale', bodyId: 'twp', name: 'Dana Hale', role: 'Mayor', seat: 'Elected townshipwide', email: 'mayor@bridgewater-twp.example', phone: '(908) 725-6300', termEnds: '2027-12-31' },
    { id: 'o-ortiz', bodyId: 'twp', name: 'Luis Ortiz', role: 'Council President', seat: 'At-large', email: 'l.ortiz@bridgewater-twp.example', phone: '(908) 725-6300', termEnds: '2026-12-31' },
    { id: 'o-brennan', bodyId: 'twp', name: 'Kathleen Brennan', role: 'Council Vice President', seat: 'At-large', email: 'k.brennan@bridgewater-twp.example', phone: '(908) 725-6300', termEnds: '2027-12-31' },
    { id: 'o-shah', bodyId: 'twp', name: 'Priya Shah', role: 'Council Member', seat: 'At-large', email: 'p.shah@bridgewater-twp.example', phone: '(908) 725-6300', termEnds: '2027-12-31' },
    { id: 'o-kowalski', bodyId: 'twp', name: 'Mark Kowalski', role: 'Council Member', seat: 'At-large', email: 'm.kowalski@bridgewater-twp.example', phone: '(908) 725-6300', termEnds: '2026-12-31' },
    { id: 'o-greene', bodyId: 'twp', name: 'Theo Greene', role: 'Council Member', seat: 'At-large', email: 't.greene@bridgewater-twp.example', phone: '(908) 725-6300', termEnds: '2028-12-31' },
    { id: 'o-adeyemi', bodyId: 'county', name: 'Grace Adeyemi', role: 'Commissioner Director', seat: 'Countywide', email: 'g.adeyemi@somerset-county.example', phone: '(908) 231-7000', termEnds: '2027-12-31' },
    { id: 'o-russo', bodyId: 'county', name: 'Anthony Russo', role: 'Commissioner Deputy Director', seat: 'Countywide', email: 'a.russo@somerset-county.example', phone: '(908) 231-7000', termEnds: '2026-12-31' },
    { id: 'o-lindqvist', bodyId: 'county', name: 'Erik Lindqvist', role: 'Commissioner', seat: 'Countywide', email: 'e.lindqvist@somerset-county.example', phone: '(908) 231-7000', termEnds: '2028-12-31' },
    { id: 'o-park', bodyId: 'brrsd', name: 'Hannah Park', role: 'Board President', seat: 'Bridgewater seat', email: 'h.park@brrsd.example', phone: '(908) 685-2777', termEnds: '2027-12-31' },
    { id: 'o-mensah', bodyId: 'brrsd', name: 'Kwame Mensah', role: 'Board Vice President', seat: 'Raritan seat', email: 'k.mensah@brrsd.example', phone: '(908) 685-2777', termEnds: '2026-12-31' }
  ],
  measures: [
    {
      id: 'm-route22-redevelopment',
      bodyId: 'twp',
      fileNumber: 'Ord. 26-14',
      officialTitle: 'An Ordinance Adopting the Route 22 East Corridor Redevelopment Plan Pursuant to the Local Redevelopment and Housing Law, N.J.S.A. 40A:12A-1 et seq.',
      plainTitle: 'Rezone the old office parks along Route 22 East for apartments and shops',
      plainSummary: 'Three mostly empty office campuses between Chimney Rock Road and Foothill Road would be allowed to become up to 640 apartments, ground floor retail, and a public walking path along the Raritan River tributary. Developers would pay the township a yearly fee instead of regular property taxes for 25 years.',
      whatChanges: [
        'Office-only zoning on roughly 71 acres ends',
        'Buildings up to five stories are allowed where three are allowed today',
        '20 percent of new apartments must be priced as affordable housing',
        'A 30-year payment in lieu of taxes agreement becomes possible for each site'
      ],
      whoNotices: 'Drivers on Route 22 and Chimney Rock Road, families in Bridgewater-Raritan schools, and neighbors in Green Knoll and Chimney Rock.',
      lens: 'where-i-live',
      alsoTouches: ['getting-around', 'learning', 'money'],
      stage: 'comment',
      history: [
        { stage: 'filed', date: '2026-07-20', note: 'Planning Board found the sites to be an area in need of redevelopment.' },
        { stage: 'committee', date: '2026-08-17', note: 'Introduced on first reading, 4 to 1.' },
        { stage: 'comment', date: '2026-08-25', note: 'Published in the Courier News. Public hearing set.' }
      ],
      nextActionOn: '2026-09-21',
      nextActionLabel: 'Public hearing and final vote',
      commentClosesOn: '2026-09-21',
      sponsorIds: ['o-ortiz', 'o-shah'],
      fiscal: { amount: 2850000, direction: 'revenue', recurring: true, note: 'Estimated yearly PILOT payments at full build-out. Schools receive none of a PILOT unless negotiated separately.' },
      budgetLineIds: [],
      scope: 'neighborhood',
      neighborhoods: ['Chimney Rock', 'Green Knoll'],
      documents: [
        { label: 'Redevelopment plan', kind: 'ordinance', pages: 84 },
        { label: 'Traffic impact study', kind: 'staff-report', pages: 41 },
        { label: 'Fiscal impact analysis', kind: 'fiscal-note', pages: 12 },
        { label: 'Parcel map', kind: 'map', pages: 2 }
      ],
      vote: null,
      tension: 'Supporters point to empty offices and the state affordable housing obligation. Opponents worry about traffic on Chimney Rock Road and new students arriving with no added school tax revenue under a PILOT.'
    },
    {
      id: 'm-road-program',
      bodyId: 'twp',
      fileNumber: 'Ord. 26-11',
      officialTitle: 'Bond Ordinance Providing for the 2026 Road Improvement Program and Appropriating $6,300,000 Therefor and Authorizing the Issuance of $5,985,000 Bonds or Notes',
      plainTitle: 'Borrow $6 million to repave 14 miles of township roads',
      plainSummary: 'The township would borrow most of the money to mill and repave about 14 miles of streets this fall and next spring. The street list prioritizes roads scored worst in the 2025 pavement survey, with Finderne and Bradley Gardens carrying the largest share.',
      whatChanges: [
        '43 streets repaved, full list in the attached schedule',
        'ADA curb ramps rebuilt at 118 corners',
        'Repayment spread over 10 years',
        '$315,000 paid in cash up front, the rest borrowed'
      ],
      whoNotices: 'Anyone driving in Finderne, Bradley Gardens, or Martinsville. Expect lane closures October through November.',
      lens: 'getting-around',
      alsoTouches: ['money'],
      stage: 'adopted',
      history: [
        { stage: 'filed', date: '2026-05-18', note: 'Engineering department released the pavement ratings.' },
        { stage: 'committee', date: '2026-06-01', note: 'Introduced on first reading.' },
        { stage: 'comment', date: '2026-06-08', note: 'Published. Four residents spoke at the hearing.' },
        { stage: 'vote', date: '2026-06-15', note: 'Final vote held.' },
        { stage: 'adopted', date: '2026-06-15', note: 'Adopted 5 to 0. Takes effect 20 days after publication.' }
      ],
      nextActionOn: '2026-10-05',
      nextActionLabel: 'Contract award for paving work',
      commentClosesOn: null,
      sponsorIds: ['o-brennan'],
      fiscal: { amount: 6300000, direction: 'borrow', recurring: false, note: 'Debt service begins in 2027, about $690,000 a year for 10 years.' },
      budgetLineIds: ['b-roads'],
      scope: 'neighborhood',
      neighborhoods: ['Finderne', 'Bradley Gardens', 'Martinsville'],
      documents: [
        { label: 'Bond ordinance', kind: 'ordinance', pages: 6 },
        { label: 'Street schedule', kind: 'staff-report', pages: 9 },
        { label: 'Hearing minutes', kind: 'minutes', pages: 14 }
      ],
      vote: {
        date: '2026-06-15',
        ballots: [
          { officialId: 'o-ortiz', vote: 'yes' },
          { officialId: 'o-brennan', vote: 'yes' },
          { officialId: 'o-shah', vote: 'yes' },
          { officialId: 'o-kowalski', vote: 'yes' },
          { officialId: 'o-greene', vote: 'yes' }
        ]
      },
      tension: null
    },
    {
      id: 'm-leaf-collection',
      bodyId: 'twp',
      fileNumber: 'Res. 26-203',
      officialTitle: 'Resolution Amending the Municipal Leaf Collection Program and Authorizing Change Order No. 2 to Contract 24-07',
      plainTitle: 'Cut curbside leaf pickup from three rounds to two',
      plainSummary: 'Loose leaf collection would drop from three passes to two this fall, with a third pass only for streets where the township receives requests. The change saves money after the contractor raised its price.',
      whatChanges: [
        'Two scheduled pickups per street instead of three',
        'A request form opens for a third pickup in December',
        'Bagged leaves still collected weekly through December 15'
      ],
      whoNotices: 'Every household with trees along the curb.',
      lens: 'water-and-waste',
      alsoTouches: ['money'],
      stage: 'vote',
      history: [
        { stage: 'filed', date: '2026-08-28', note: 'Contractor submitted a price increase.' },
        { stage: 'vote', date: '2026-09-10', note: 'Placed on the next council agenda.' }
      ],
      nextActionOn: '2026-09-21',
      nextActionLabel: 'Council vote',
      commentClosesOn: '2026-09-21',
      sponsorIds: ['o-kowalski'],
      fiscal: { amount: -184000, direction: 'spend', recurring: true, note: 'Savings compared with keeping three passes at the new contract price.' },
      budgetLineIds: ['b-trash'],
      scope: 'jurisdiction',
      neighborhoods: [],
      documents: [
        { label: 'Resolution', kind: 'resolution', pages: 2 },
        { label: 'Contractor change order', kind: 'staff-report', pages: 4 }
      ],
      vote: null,
      tension: 'Saves about $11 per household a year, but streets with heavy tree cover may see leaf piles sit longer in the road, which clogs storm drains.'
    },
    {
      id: 'm-duke-farms-trail',
      bodyId: 'county',
      fileNumber: 'Res. R26-1188',
      officialTitle: 'Resolution Authorizing Application to the NJDOT Transportation Alternatives Program for the Raritan Valley Greenway Connector, Phase II',
      plainTitle: 'Apply for a state grant to connect Bridgewater trails to the Raritan River Greenway',
      plainSummary: 'The county would ask the state for $1.9 million to build a paved walking and biking path linking Duke Island Park to the Finderne neighborhood, crossing under Route 287 in an existing culvert.',
      whatChanges: [
        '2.3 miles of new off-road path',
        'Lighting and a new crossing at Finderne Avenue',
        'County pays a 20 percent match if the grant is awarded'
      ],
      whoNotices: 'Walkers and cyclists in Finderne and people who use Duke Island Park.',
      lens: 'parks',
      alsoTouches: ['getting-around'],
      stage: 'committee',
      history: [
        { stage: 'filed', date: '2026-08-11', note: 'Parks Commission recommended the application.' },
        { stage: 'committee', date: '2026-09-08', note: 'Discussed at work session.' }
      ],
      nextActionOn: '2026-09-22',
      nextActionLabel: 'Commissioners vote on applying',
      commentClosesOn: '2026-09-22',
      sponsorIds: ['o-lindqvist'],
      fiscal: { amount: 475000, direction: 'spend', recurring: false, note: 'County match, only if the state awards the grant.' },
      budgetLineIds: ['b-county-parks'],
      scope: 'neighborhood',
      neighborhoods: ['Finderne'],
      documents: [
        { label: 'Grant application draft', kind: 'resolution', pages: 22 },
        { label: 'Route map', kind: 'map', pages: 1 }
      ],
      vote: null,
      tension: null
    },
    {
      id: 'm-county-jail',
      bodyId: 'county',
      fileNumber: 'Res. R26-1102',
      officialTitle: 'Resolution Authorizing a Shared Services Agreement with the County of Middlesex for the Housing of Inmates',
      plainTitle: 'Keep sending Somerset County inmates to Middlesex County for five more years',
      plainSummary: 'Somerset County closed most of its own jail housing and pays Middlesex County to hold people instead. This renews that deal with a 3.5 percent yearly price increase.',
      whatChanges: [
        'Daily rate per person rises from $196 to $203',
        'Agreement runs through 2031',
        'Family visits continue to take place in North Brunswick'
      ],
      whoNotices: 'Families of people held in jail, and the county budget.',
      lens: 'staying-safe',
      alsoTouches: ['money'],
      stage: 'adopted',
      history: [
        { stage: 'filed', date: '2026-07-14', note: 'Presented at work session.' },
        { stage: 'vote', date: '2026-07-28', note: 'Final vote.' },
        { stage: 'adopted', date: '2026-07-28', note: 'Adopted 3 to 0.' }
      ],
      nextActionOn: null,
      nextActionLabel: null,
      commentClosesOn: null,
      sponsorIds: ['o-russo'],
      fiscal: { amount: 7400000, direction: 'spend', recurring: true, note: 'Estimated first-year cost at current population.' },
      budgetLineIds: ['b-county-safety'],
      scope: 'jurisdiction',
      neighborhoods: [],
      documents: [
        { label: 'Shared services agreement', kind: 'resolution', pages: 31 },
        { label: 'Work session minutes', kind: 'minutes', pages: 18 }
      ],
      vote: {
        date: '2026-07-28',
        ballots: [
          { officialId: 'o-adeyemi', vote: 'yes' },
          { officialId: 'o-russo', vote: 'yes' },
          { officialId: 'o-lindqvist', vote: 'yes' }
        ]
      },
      tension: null
    },
    {
      id: 'm-school-start-times',
      bodyId: 'brrsd',
      fileNumber: 'Policy 5512.3',
      officialTitle: 'First Reading of Revised Policy 5512.3, Instructional Day Schedule, and Transportation Tier Realignment',
      plainTitle: 'Start the high school 40 minutes later beginning next September',
      plainSummary: 'Bridgewater-Raritan High School would start at 8:05 AM instead of 7:25 AM. Elementary schools would shift 15 minutes earlier so the same buses can cover all routes.',
      whatChanges: [
        'High school day runs 8:05 AM to 2:50 PM',
        'Elementary day moves to 8:30 AM start',
        'After-school sports practice ends later in the fall'
      ],
      whoNotices: 'Every family with a student in the district, plus drivers on Garretson Road at drop-off.',
      lens: 'learning',
      alsoTouches: ['getting-around'],
      stage: 'comment',
      history: [
        { stage: 'filed', date: '2026-06-09', note: 'Start time committee report released.' },
        { stage: 'committee', date: '2026-08-25', note: 'First reading.' },
        { stage: 'comment', date: '2026-08-26', note: 'Parent survey opened.' }
      ],
      nextActionOn: '2026-09-29',
      nextActionLabel: 'Second reading and board vote',
      commentClosesOn: '2026-09-25',
      sponsorIds: ['o-park'],
      fiscal: { amount: 0, direction: 'shift', recurring: true, note: 'No new buses needed under the realigned tiers.' },
      budgetLineIds: ['b-school-transport'],
      scope: 'jurisdiction',
      neighborhoods: [],
      documents: [
        { label: 'Revised policy', kind: 'ordinance', pages: 5 },
        { label: 'Start time committee report', kind: 'staff-report', pages: 37 }
      ],
      vote: null,
      tension: 'Sleep research favors later high school starts. Some parents of younger students say an 8:30 AM elementary start still works, while others with before-care arrangements object.'
    },
    {
      id: 'm-stormwater-fee',
      bodyId: 'twp',
      fileNumber: 'Ord. 26-17',
      officialTitle: 'An Ordinance Establishing a Stormwater Utility Pursuant to the Clean Stormwater and Flood Reduction Act, P.L. 2019, c. 42',
      plainTitle: 'Create a stormwater fee based on how much pavement is on each lot',
      plainSummary: 'Instead of paying for storm drains through property taxes, each lot would pay a fee based on its roofs and paved area. Large parking lots at shopping centers would pay far more than most homes. The township says a typical house would pay about $72 a year.',
      whatChanges: [
        'New yearly fee on every lot with pavement or roofs',
        'Credits for rain gardens and permeable driveways',
        'Money can only be spent on drains, culverts, and flood work',
        'Municipal tax levy reduced by the amount now spent on storm drains'
      ],
      whoNotices: 'All property owners, with the greatest impact on owners of large commercial parcels. Flood mitigation projects in Sunset Lake and Martinsville would receive higher priority.',
      lens: 'water-and-waste',
      alsoTouches: ['money'],
      stage: 'filed',
      history: [
        { stage: 'filed', date: '2026-09-08', note: 'Feasibility study presented to council.' }
      ],
      nextActionOn: '2026-10-05',
      nextActionLabel: 'Introduction on first reading',
      commentClosesOn: null,
      sponsorIds: ['o-greene'],
      fiscal: { amount: 3100000, direction: 'revenue', recurring: true, note: 'Estimated yearly fee revenue. About $1.4 million would move off the property tax levy.' },
      budgetLineIds: ['b-storm'],
      scope: 'jurisdiction',
      neighborhoods: ['Sunset Lake', 'Martinsville'],
      documents: [
        { label: 'Stormwater utility feasibility study', kind: 'staff-report', pages: 58 }
      ],
      vote: null,
      tension: 'A fee is not deductible like property tax, and critics call it a tax increase with a different name. Supporters note that large parking lots create most runoff and pay little toward drains today.'
    },
    {
      id: 'm-police-officers',
      bodyId: 'twp',
      fileNumber: 'Res. 26-188',
      officialTitle: 'Resolution Amending the Table of Organization of the Bridgewater Township Police Department',
      plainTitle: 'Add three police officers focused on traffic enforcement',
      plainSummary: 'The police department grows from 82 to 85 sworn officers. The new positions form a traffic unit working school zones and the Route 202-206 corridor.',
      whatChanges: [
        'Three new officer positions',
        'A dedicated traffic unit on weekday mornings and afternoons',
        'Speed enforcement near all eleven school zones'
      ],
      whoNotices: 'Drivers near schools, and residents who filed speeding complaints on Country Club Road and Milltown Road.',
      lens: 'staying-safe',
      alsoTouches: ['getting-around'],
      stage: 'in-effect',
      history: [
        { stage: 'filed', date: '2026-02-02', note: 'Requested in the 2026 budget.' },
        { stage: 'vote', date: '2026-03-16', note: 'Voted with the budget.' },
        { stage: 'adopted', date: '2026-03-16', note: 'Adopted 4 to 1.' },
        { stage: 'in-effect', date: '2026-08-01', note: 'Officers sworn in and assigned.' }
      ],
      nextActionOn: null,
      nextActionLabel: null,
      commentClosesOn: null,
      sponsorIds: ['o-kowalski'],
      fiscal: { amount: 412000, direction: 'spend', recurring: true, note: 'Salary and benefits for three officers in their first year.' },
      budgetLineIds: ['b-police'],
      scope: 'jurisdiction',
      neighborhoods: [],
      documents: [
        { label: 'Resolution', kind: 'resolution', pages: 2 },
        { label: 'Traffic complaint summary', kind: 'staff-report', pages: 6 }
      ],
      vote: {
        date: '2026-03-16',
        ballots: [
          { officialId: 'o-ortiz', vote: 'yes' },
          { officialId: 'o-brennan', vote: 'yes' },
          { officialId: 'o-shah', vote: 'no' },
          { officialId: 'o-kowalski', vote: 'yes' },
          { officialId: 'o-greene', vote: 'yes' }
        ]
      },
      tension: null
    },
    {
      id: 'm-library-hours',
      bodyId: 'library',
      fileNumber: 'Motion LC-26-09',
      officialTitle: 'Motion to Amend Branch Service Hours, Bridgewater Headquarters Branch, Effective January 1, 2027',
      plainTitle: 'Open the Bridgewater library on Sunday afternoons year-round',
      plainSummary: 'The Vogt Drive branch is closed Sundays in summer. This would keep it open 1:00 PM to 5:00 PM every Sunday of the year, paid for by closing an hour earlier on Friday nights, when visits are lowest.',
      whatChanges: [
        'Sunday hours all year',
        'Friday closing moves from 9:00 PM to 8:00 PM',
        'No change to total weekly hours'
      ],
      whoNotices: 'Students, families, and anyone who uses the library on weekends.',
      lens: 'learning',
      alsoTouches: [],
      stage: 'vote',
      history: [
        { stage: 'filed', date: '2026-08-19', note: 'Visit count report presented.' },
        { stage: 'vote', date: '2026-09-02', note: 'Placed on September agenda.' }
      ],
      nextActionOn: '2026-09-16',
      nextActionLabel: 'Library Commission vote tonight',
      commentClosesOn: '2026-09-16',
      sponsorIds: [],
      fiscal: null,
      budgetLineIds: ['b-library'],
      scope: 'jurisdiction',
      neighborhoods: [],
      documents: [
        { label: 'Branch visit counts by hour', kind: 'staff-report', pages: 3 }
      ],
      vote: null,
      tension: null
    },
    {
      id: 'm-sidewalk-milltown',
      bodyId: 'twp',
      fileNumber: 'Res. 26-161',
      officialTitle: 'Resolution Authorizing Award of Contract for Milltown Road Pedestrian Improvements, Contract 26-03',
      plainTitle: 'Build a sidewalk on Milltown Road between Vanderveer Road and the middle school',
      plainSummary: 'Adds a continuous sidewalk and two marked crosswalks where students currently walk on the shoulder. Most of the cost comes from a state Safe Routes to School grant.',
      whatChanges: [
        '0.8 miles of new sidewalk',
        'Two crosswalks with flashing beacons',
        'Construction during summer 2027 while school is out'
      ],
      whoNotices: 'Middle school students and parents on Milltown Road.',
      lens: 'getting-around',
      alsoTouches: ['staying-safe'],
      stage: 'stalled',
      history: [
        { stage: 'filed', date: '2026-01-12', note: 'Grant awarded.' },
        { stage: 'committee', date: '2026-04-06', note: 'Bids opened, all over budget.' },
        { stage: 'stalled', date: '2026-05-04', note: 'Bids rejected. Engineering to redesign and rebid.' }
      ],
      nextActionOn: null,
      nextActionLabel: 'Rebid, no date set',
      commentClosesOn: null,
      sponsorIds: ['o-greene'],
      fiscal: { amount: 1240000, direction: 'spend', recurring: false, note: '$980,000 from the state grant, the rest from township capital funds.' },
      budgetLineIds: ['b-roads'],
      scope: 'neighborhood',
      neighborhoods: ['Van Horne'],
      documents: [
        { label: 'Bid tabulation', kind: 'staff-report', pages: 2 },
        { label: 'Project map', kind: 'map', pages: 1 }
      ],
      vote: null,
      tension: null
    },
    {
      id: 'm-plastic-bags',
      bodyId: 'twp',
      fileNumber: 'Ord. 26-09',
      officialTitle: 'An Ordinance to Amend Chapter 256, Littering, to Regulate Polystyrene Containers at Township Events',
      plainTitle: 'Ban foam food containers at township-run events',
      plainSummary: 'Vendors at township events like Bridgewater Day would have to use paper or compostable containers. Private businesses are not affected.',
      whatChanges: [
        'Applies only to events on township property',
        'Warning first, then a $100 fine for vendors'
      ],
      whoNotices: 'Food vendors at township events.',
      lens: 'water-and-waste',
      alsoTouches: [],
      stage: 'failed',
      history: [
        { stage: 'committee', date: '2026-04-20', note: 'Introduced on first reading, 3 to 2.' },
        { stage: 'vote', date: '2026-05-18', note: 'Final vote.' },
        { stage: 'failed', date: '2026-05-18', note: 'Failed 2 to 3.' }
      ],
      nextActionOn: null,
      nextActionLabel: null,
      commentClosesOn: null,
      sponsorIds: ['o-shah'],
      fiscal: null,
      budgetLineIds: [],
      scope: 'jurisdiction',
      neighborhoods: [],
      documents: [
        { label: 'Ordinance', kind: 'ordinance', pages: 3 },
        { label: 'Meeting minutes', kind: 'minutes', pages: 11 }
      ],
      vote: {
        date: '2026-05-18',
        ballots: [
          { officialId: 'o-ortiz', vote: 'no' },
          { officialId: 'o-brennan', vote: 'no' },
          { officialId: 'o-shah', vote: 'yes' },
          { officialId: 'o-kowalski', vote: 'no' },
          { officialId: 'o-greene', vote: 'yes' }
        ]
      },
      tension: null
    },
    {
      id: 'm-senior-bus',
      bodyId: 'county',
      fileNumber: 'Res. R26-1210',
      officialTitle: 'Resolution Amending the 2026 County Budget to Insert a Special Item of Revenue, Section 5307 Rural and Small Urban Transit Operating Assistance',
      plainTitle: 'Use new federal money to add Saturday rides on the county senior bus',
      plainSummary: 'Somerset County Area Transportation would run door-to-door rides for seniors and people with disabilities on Saturdays for the first time, using a federal transit grant that does not require county tax dollars.',
      whatChanges: [
        'Saturday service 8:00 AM to 4:00 PM',
        'Rides booked 48 hours ahead, same as weekdays',
        'Grocery and pharmacy trips prioritized'
      ],
      whoNotices: 'Seniors and residents with disabilities who do not drive.',
      lens: 'health',
      alsoTouches: ['getting-around'],
      stage: 'vote',
      history: [
        { stage: 'filed', date: '2026-08-25', note: 'Federal award letter received.' },
        { stage: 'vote', date: '2026-09-08', note: 'Scheduled for vote.' }
      ],
      nextActionOn: '2026-09-22',
      nextActionLabel: 'Commissioners vote',
      commentClosesOn: '2026-09-22',
      sponsorIds: ['o-adeyemi'],
      fiscal: { amount: 318000, direction: 'spend', recurring: false, note: 'Fully covered by the federal grant for one year.' },
      budgetLineIds: ['b-county-health'],
      scope: 'jurisdiction',
      neighborhoods: [],
      documents: [
        { label: 'Budget insertion resolution', kind: 'resolution', pages: 2 },
        { label: 'Federal award letter', kind: 'fiscal-note', pages: 3 }
      ],
      vote: null,
      tension: null
    }
  ],
  budget: [
    { id: 'b-roads', bodyId: 'twp', lensId: 'getting-around', plainLabel: 'Repaving and fixing township streets', officialLabel: 'Capital Improvement Fund, Road Program and Streets and Roads Other Expenses', amount: 7120000, priorAmount: 6340000, oneTime: false, note: 'Includes the 2026 bond-funded paving program.', unitRate: { noun: 'foot of repaved road', pluralNoun: 'feet of repaved road', dollarsPerUnit: 48, basis: 'Mill and overlay of a 30-foot residential street, 2025 bid average' }, neighborhoods: ['Finderne', 'Bradley Gardens', 'Martinsville'] },
    { id: 'b-snow', bodyId: 'twp', lensId: 'getting-around', plainLabel: 'Plowing and salting after storms', officialLabel: 'Snow Removal Other Expenses and Overtime', amount: 1180000, priorAmount: 1410000, oneTime: false, note: 'Lower after a mild winter left salt in storage.', unitRate: { noun: 'mile of plowed lane', pluralNoun: 'miles of plowed lane', dollarsPerUnit: 165, basis: 'One plow and salt pass per lane mile, average storm' }, neighborhoods: [] },
    { id: 'b-police', bodyId: 'twp', lensId: 'staying-safe', plainLabel: 'Police patrols and response', officialLabel: 'Police Salaries and Wages, Police Other Expenses', amount: 14860000, priorAmount: 14120000, oneTime: false, note: 'Three new traffic officers added this year.', unitRate: { noun: 'hour of patrol', pluralNoun: 'hours of patrol', dollarsPerUnit: 128, basis: 'One officer and vehicle on the road, fully loaded cost' }, neighborhoods: [] },
    { id: 'b-trash', bodyId: 'twp', lensId: 'water-and-waste', plainLabel: 'Trash, recycling, and leaf pickup', officialLabel: 'Solid Waste Collection Contract and Recycling Tonnage Fees', amount: 5240000, priorAmount: 4910000, oneTime: false, note: 'Hauler contract rose 6.7 percent.', unitRate: { noun: 'week of curbside pickup for a home', pluralNoun: 'weeks of curbside pickup for a home', dollarsPerUnit: 6.2, basis: 'Contract cost per household per week' }, neighborhoods: [] },
    { id: 'b-storm', bodyId: 'twp', lensId: 'water-and-waste', plainLabel: 'Storm drains and flood prevention', officialLabel: 'Stormwater Management, MS4 Permit Compliance, and Drainage Improvements', amount: 1420000, priorAmount: 1290000, oneTime: false, note: 'May move to a separate fee under Ord. 26-17.', unitRate: { noun: 'storm drain cleaned', pluralNoun: 'storm drains cleaned', dollarsPerUnit: 95, basis: 'Vacuum truck cleaning per catch basin' }, neighborhoods: ['Sunset Lake', 'Martinsville'] },
    { id: 'b-parks', bodyId: 'twp', lensId: 'parks', plainLabel: 'Township parks, fields, and the pool', officialLabel: 'Parks and Recreation Salaries, Other Expenses, and Open Space Trust Fund Appropriation', amount: 3960000, priorAmount: 3710000, oneTime: false, note: 'New turf at Bridgewater Sports Arena fields.', unitRate: { noun: 'day of park upkeep', pluralNoun: 'days of park upkeep', dollarsPerUnit: 1650, basis: 'All 40 township parks, mowing and maintenance per day in season' }, neighborhoods: [] },
    { id: 'b-rec', bodyId: 'twp', lensId: 'learning', plainLabel: 'Recreation classes and the senior center', officialLabel: 'Recreation Programs and Office of Senior Services', amount: 1310000, priorAmount: 1290000, oneTime: false, note: '', unitRate: null, neighborhoods: [] },
    { id: 'b-townhall', bodyId: 'twp', lensId: 'money', plainLabel: 'Running township government', officialLabel: 'General Administration, Finance, Tax Collection, Assessment, Legal, and Insurance', amount: 6240000, priorAmount: 6180000, oneTime: false, note: 'Includes health insurance for all township employees.', unitRate: null, neighborhoods: [] },
    { id: 'b-debt', bodyId: 'twp', lensId: 'money', plainLabel: 'Paying back past borrowing', officialLabel: 'Municipal Debt Service, Payment of Bond Principal and Interest on Bonds', amount: 5480000, priorAmount: 5620000, oneTime: false, note: 'Older bonds from 2011 retired this year.', unitRate: null, neighborhoods: [] },
    { id: 'b-school-classroom', bodyId: 'brrsd', lensId: 'learning', plainLabel: 'Teachers and classrooms', officialLabel: 'Regular Programs, Instruction, Salaries of Teachers and General Supplies', amount: 98400000, priorAmount: 95100000, oneTime: false, note: 'Contract raises and 14 new special education aides.', unitRate: { noun: 'school day for one student', pluralNoun: 'school days for one student', dollarsPerUnit: 104, basis: 'Classroom cost per pupil divided by 180 school days' }, neighborhoods: [] },
    { id: 'b-school-special', bodyId: 'brrsd', lensId: 'learning', plainLabel: 'Special education services', officialLabel: 'Special Education Instruction, Related Services, and Tuition to Private Schools for the Disabled', amount: 41200000, priorAmount: 38700000, oneTime: false, note: 'Out-of-district tuition rose 9 percent.', unitRate: null, neighborhoods: [] },
    { id: 'b-school-transport', bodyId: 'brrsd', lensId: 'getting-around', plainLabel: 'School buses', officialLabel: 'Student Transportation Services, Contracted and District-Owned', amount: 14700000, priorAmount: 14200000, oneTime: false, note: '', unitRate: { noun: 'day of a bus route', pluralNoun: 'days of a bus route', dollarsPerUnit: 612, basis: 'One contracted route, morning and afternoon' }, neighborhoods: [] },
    { id: 'b-school-buildings', bodyId: 'brrsd', lensId: 'learning', plainLabel: 'Keeping school buildings running', officialLabel: 'Operation and Maintenance of Plant Services and Capital Reserve Withdrawal', amount: 22600000, priorAmount: 21900000, oneTime: false, note: 'HVAC replacement at Hillside Intermediate.', unitRate: null, neighborhoods: [] },
    { id: 'b-school-admin', bodyId: 'brrsd', lensId: 'money', plainLabel: 'School district administration and benefits', officialLabel: 'General Administration, School Administration, Central Services, and Unallocated Benefits', amount: 49800000, priorAmount: 47300000, oneTime: false, note: 'Health benefit premiums rose 8.1 percent.', unitRate: null, neighborhoods: [] },
    { id: 'b-county-roads', bodyId: 'county', lensId: 'getting-around', plainLabel: 'County roads and bridges', officialLabel: 'Engineering, Roads and Bridges Division, and County Capital Improvement Program', amount: 28300000, priorAmount: 30100000, oneTime: false, note: 'Fewer bridge replacements scheduled.', unitRate: null, neighborhoods: [] },
    { id: 'b-county-safety', bodyId: 'county', lensId: 'staying-safe', plainLabel: 'Sheriff, jail contract, and prosecutor', officialLabel: 'Sheriff, Corrections, Prosecutor, and Public Safety Communications', amount: 61200000, priorAmount: 58800000, oneTime: false, note: 'Middlesex inmate housing contract renewed.', unitRate: null, neighborhoods: [] },
    { id: 'b-county-parks', bodyId: 'county', lensId: 'parks', plainLabel: 'County parks like Duke Island and Washington Valley', officialLabel: 'Park Commission Operations and Open Space Trust Fund', amount: 24900000, priorAmount: 23600000, oneTime: false, note: '', unitRate: null, neighborhoods: ['Finderne'] },
    { id: 'b-county-health', bodyId: 'county', lensId: 'health', plainLabel: 'Health department, senior bus, and social services', officialLabel: 'Human Services, Office on Aging, SCAT Paratransit, and Department of Health', amount: 38600000, priorAmount: 37100000, oneTime: false, note: '', unitRate: { noun: 'senior bus ride', pluralNoun: 'senior bus rides', dollarsPerUnit: 41, basis: 'Average door-to-door paratransit trip' }, neighborhoods: [] },
    { id: 'b-county-college', bodyId: 'county', lensId: 'learning', plainLabel: 'Raritan Valley Community College share', officialLabel: 'County Contribution to Raritan Valley Community College', amount: 14200000, priorAmount: 13900000, oneTime: false, note: '', unitRate: null, neighborhoods: [] },
    { id: 'b-county-admin', bodyId: 'county', lensId: 'money', plainLabel: 'Running county government and paying its debt', officialLabel: 'General Government, Debt Service, and Statutory Expenditures', amount: 71400000, priorAmount: 70200000, oneTime: false, note: '', unitRate: null, neighborhoods: [] },
    { id: 'b-fire', bodyId: 'fire', lensId: 'staying-safe', plainLabel: 'Volunteer firehouses and trucks', officialLabel: 'Fire District Operating Appropriations, Districts 1 to 4', amount: 2980000, priorAmount: 2870000, oneTime: false, note: '', unitRate: { noun: 'hour of a fire engine in service', pluralNoun: 'hours of a fire engine in service', dollarsPerUnit: 210, basis: 'Apparatus, fuel, insurance, and gear per staffed hour' }, neighborhoods: [] },
    { id: 'b-library', bodyId: 'library', lensId: 'learning', plainLabel: 'Library branches, books, and programs', officialLabel: 'County Library Tax, Operating Appropriation', amount: 2140000, priorAmount: 2090000, oneTime: false, note: 'Bridgewater share of the county library system.', unitRate: { noun: 'hour the library stays open', pluralNoun: 'hours the library stays open', dollarsPerUnit: 780, basis: 'Staffing, utilities, and materials per open hour at Vogt Drive' }, neighborhoods: [] }
  ],
  meetings: [
    {
      id: 'mt-lib-0916',
      bodyId: 'library',
      title: 'Library Commission Regular Meeting',
      startsAt: '2026-09-16T18:30:00-04:00',
      location: 'Bridgewater Library, 1 Vogt Drive, Meeting Room B',
      watch: 'In person only',
      commentSignupClosesAt: null,
      commentInstructions: 'Public comment is taken at the start of the meeting. No signup needed.',
      agenda: [
        { id: 'a-l1', order: 1, measureId: null, plainTitle: 'Public comment', officialTitle: 'Public Comment', lens: 'learning', action: 'briefing', commentAllowed: true, minutes: 15 },
        { id: 'a-l2', order: 2, measureId: 'm-library-hours', plainTitle: 'Open on Sundays year-round', officialTitle: 'Motion LC-26-09, Branch Service Hours', lens: 'learning', action: 'vote', commentAllowed: false, minutes: 20 },
        { id: 'a-l3', order: 3, measureId: null, plainTitle: 'Director report on the fall reading program', officialTitle: 'Director Report', lens: 'learning', action: 'briefing', commentAllowed: false, minutes: 15 }
      ],
      status: 'upcoming',
      outcome: null
    },
    {
      id: 'mt-twp-0921',
      bodyId: 'twp',
      title: 'Township Council Regular Meeting',
      startsAt: '2026-09-21T19:00:00-04:00',
      location: 'Municipal Courtroom, 100 Commons Way, Bridgewater',
      watch: 'Live on Bridgewater TV, Verizon channel 35 and Optimum channel 22, and the township YouTube channel',
      commentSignupClosesAt: '2026-09-21T18:55:00-04:00',
      commentInstructions: 'Sign up at the podium before the meeting starts. You will be allotted 5 minutes.',
      agenda: [
        { id: 'a-t1', order: 1, measureId: null, plainTitle: 'Routine approvals voted together', officialTitle: 'Consent Agenda, Resolutions 26-210 through 26-224', lens: 'money', action: 'consent', commentAllowed: false, minutes: 10 },
        { id: 'a-t2', order: 2, measureId: 'm-route22-redevelopment', plainTitle: 'Apartments and shops on the Route 22 office parks', officialTitle: 'Public Hearing and Second Reading, Ordinance 26-14', lens: 'where-i-live', action: 'public-hearing', commentAllowed: true, minutes: 90 },
        { id: 'a-t3', order: 3, measureId: 'm-leaf-collection', plainTitle: 'Fewer leaf pickup rounds this fall', officialTitle: 'Resolution 26-203, Change Order No. 2, Contract 24-07', lens: 'water-and-waste', action: 'vote', commentAllowed: true, minutes: 20 },
        { id: 'a-t4', order: 4, measureId: null, plainTitle: 'Update on the Milltown Road sidewalk rebid', officialTitle: 'Engineering Report', lens: 'getting-around', action: 'briefing', commentAllowed: false, minutes: 10 },
        { id: 'a-t5', order: 5, measureId: null, plainTitle: 'Open floor for any topic', officialTitle: 'Public Comment, Non-Agenda Items', lens: 'money', action: 'briefing', commentAllowed: true, minutes: 30 }
      ],
      status: 'upcoming',
      outcome: null
    },
    {
      id: 'mt-county-0922',
      bodyId: 'county',
      title: 'Board of Commissioners Regular Meeting',
      startsAt: '2026-09-22T19:00:00-04:00',
      location: 'County Administration Building, 20 Grove Street, Somerville, 2nd Floor Freeholders Meeting Room',
      watch: 'Streamed on the county website',
      commentSignupClosesAt: null,
      commentInstructions: 'Public comment on agenda items opens after the consent agenda. Comments are limited to 3 minutes.',
      agenda: [
        { id: 'a-c1', order: 1, measureId: null, plainTitle: 'Routine approvals voted together', officialTitle: 'Consent Agenda', lens: 'money', action: 'consent', commentAllowed: false, minutes: 10 },
        { id: 'a-c2', order: 2, measureId: 'm-senior-bus', plainTitle: 'Saturday senior bus service', officialTitle: 'Resolution R26-1210, Chapter 159 Budget Insertion', lens: 'health', action: 'vote', commentAllowed: true, minutes: 10 },
        { id: 'a-c3', order: 3, measureId: 'm-duke-farms-trail', plainTitle: 'Trail from Duke Island Park to Finderne', officialTitle: 'Resolution R26-1188, NJDOT TAP Application', lens: 'parks', action: 'vote', commentAllowed: true, minutes: 15 },
        { id: 'a-c4', order: 4, measureId: null, plainTitle: 'County budget progress through August', officialTitle: 'Treasurer Report, Statement of Revenues and Appropriations', lens: 'money', action: 'briefing', commentAllowed: false, minutes: 15 }
      ],
      status: 'upcoming',
      outcome: null
    },
    {
      id: 'mt-boe-0929',
      bodyId: 'brrsd',
      title: 'Board of Education Business Meeting',
      startsAt: '2026-09-29T19:30:00-04:00',
      location: 'Bridgewater-Raritan High School Auditorium, 600 Garretson Road',
      watch: 'Streamed on the district YouTube channel',
      commentSignupClosesAt: '2026-09-29T19:25:00-04:00',
      commentInstructions: 'Complete a speaker card at the auditorium entrance. The board takes comment on agenda items before any vote. Each speaker gets 3 minutes.',
      agenda: [
        { id: 'a-b1', order: 1, measureId: null, plainTitle: 'Superintendent update on the first month of school', officialTitle: 'Superintendent Report', lens: 'learning', action: 'briefing', commentAllowed: false, minutes: 20 },
        { id: 'a-b2', order: 2, measureId: null, plainTitle: 'Comment on agenda items', officialTitle: 'Public Comment, Agenda Items Only', lens: 'learning', action: 'briefing', commentAllowed: true, minutes: 30 },
        { id: 'a-b3', order: 3, measureId: 'm-school-start-times', plainTitle: 'Later high school start time', officialTitle: 'Second Reading, Policy 5512.3', lens: 'learning', action: 'vote', commentAllowed: true, minutes: 45 },
        { id: 'a-b4', order: 4, measureId: null, plainTitle: 'Staff hires and bill payments', officialTitle: 'Personnel, Finance, and Facilities Consent Resolutions', lens: 'money', action: 'consent', commentAllowed: false, minutes: 10 }
      ],
      status: 'upcoming',
      outcome: null
    },
    {
      id: 'mt-twp-0908',
      bodyId: 'twp',
      title: 'Township Council Work Session',
      startsAt: '2026-09-08T19:00:00-04:00',
      location: 'Municipal Courtroom, 100 Commons Way, Bridgewater',
      watch: 'Recording on the township YouTube channel',
      commentSignupClosesAt: null,
      commentInstructions: 'Work sessions take public comment at the end.',
      agenda: [
        { id: 'a-w1', order: 1, measureId: 'm-stormwater-fee', plainTitle: 'Study on a stormwater fee', officialTitle: 'Presentation, Stormwater Utility Feasibility Study', lens: 'water-and-waste', action: 'briefing', commentAllowed: false, minutes: 60 },
        { id: 'a-w2', order: 2, measureId: null, plainTitle: 'Open floor for any topic', officialTitle: 'Public Comment', lens: 'money', action: 'briefing', commentAllowed: true, minutes: 20 }
      ],
      status: 'held',
      outcome: 'Council asked the engineer to model credits for homes with rain barrels before introducing the fee ordinance in October. Eleven residents spoke, eight about flooding on Sunset Lake Road.'
    }
  ],
  snapshots: [
    { bodyId: 'twp', lineId: 'b-roads', label: 'Adopted 2025 budget', amount: 6340000, capturedOn: '2025-03-17' },
    { bodyId: 'twp', lineId: 'b-roads', label: 'Introduced 2026 budget', amount: 6480000, capturedOn: '2026-02-02' },
    { bodyId: 'twp', lineId: 'b-roads', label: 'Adopted 2026 budget with bond program', amount: 7120000, capturedOn: '2026-06-15' },
    { bodyId: 'twp', lineId: 'b-snow', label: 'Adopted 2025 budget', amount: 1410000, capturedOn: '2025-03-17' },
    { bodyId: 'twp', lineId: 'b-snow', label: 'Adopted 2026 budget', amount: 1180000, capturedOn: '2026-03-16' },
    { bodyId: 'brrsd', lineId: 'b-school-special', label: 'Adopted 2025-26 budget', amount: 38700000, capturedOn: '2025-05-01' },
    { bodyId: 'brrsd', lineId: 'b-school-special', label: 'Adopted 2026-27 budget', amount: 41200000, capturedOn: '2026-09-01' },
    { bodyId: 'county', lineId: 'b-county-roads', label: 'Adopted 2025 budget', amount: 30100000, capturedOn: '2025-04-08' },
    { bodyId: 'county', lineId: 'b-county-roads', label: 'Adopted 2026 budget', amount: 28300000, capturedOn: '2026-09-09' }
  ],
  sources: [
    { id: 's-twp-agenda', bodyId: 'twp', label: 'Council agendas and packets', kind: 'agenda-pdf', url: 'https://www.bridgewaternj.gov/agendas', cadence: 'Checked every 6 hours', lastRead: '2026-09-16T06:00:00-04:00', recordsFound: 214 },
    { id: 's-twp-ord', bodyId: 'twp', label: 'Ordinance index', kind: 'ordinance-index', url: 'https://www.bridgewaternj.gov/ordinances', cadence: 'Checked daily', lastRead: '2026-09-16T02:00:00-04:00', recordsFound: 96 },
    { id: 's-twp-budget', bodyId: 'twp', label: 'Adopted municipal budget', kind: 'budget-pdf', url: 'https://www.bridgewaternj.gov/finance', cadence: 'Checked weekly', lastRead: '2026-09-14T02:00:00-04:00', recordsFound: 1 },
    { id: 's-county-agenda', bodyId: 'county', label: 'Commissioner meeting agendas', kind: 'agenda-pdf', url: 'https://www.co.somerset.nj.us/government/commissioners', cadence: 'Checked every 6 hours', lastRead: '2026-09-16T06:00:00-04:00', recordsFound: 188 },
    { id: 's-county-budget', bodyId: 'county', label: 'County budget and user-friendly budget filing', kind: 'budget-pdf', url: 'https://www.co.somerset.nj.us/government/finance', cadence: 'Checked weekly', lastRead: '2026-09-14T02:00:00-04:00', recordsFound: 2 },
    { id: 's-boe-agenda', bodyId: 'brrsd', label: 'Board of Education agendas', kind: 'agenda-pdf', url: 'https://www.brrsd.org/board', cadence: 'Checked every 6 hours', lastRead: '2026-09-16T06:00:00-04:00', recordsFound: 142 },
    { id: 's-tax', bodyId: 'twp', label: 'Somerset County Board of Taxation rate table', kind: 'tax-table', url: 'https://www.co.somerset.nj.us/government/taxation', cadence: 'Checked monthly', lastRead: '2026-09-01T02:00:00-04:00', recordsFound: 21 },
    { id: 's-njdata', bodyId: 'county', label: 'NJ Division of Local Government Services data', kind: 'open-data', url: 'https://www.nj.gov/dca/divisions/dlgs', cadence: 'Checked monthly', lastRead: '2026-09-01T02:00:00-04:00', recordsFound: 36 }
  ]
}
