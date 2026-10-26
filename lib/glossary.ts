export interface Term {
  key: string
  match: RegExp
  plain: string
}

export const GLOSSARY: Term[] = [
  { key: 'bond ordinance', match: /bond ordinance/i, plain: 'A law that lets the government borrow money and pay it back with interest over many years, like a mortgage.' },
  { key: 'bonds or notes', match: /bonds or notes/i, plain: 'The two ways a town borrows. Notes are short-term loans, usually one year. Bonds are paid back over 10 to 30 years.' },
  { key: 'appropriating', match: /appropriat\w+/i, plain: 'Setting aside money for a specific purpose. Once appropriated, it cannot be spent on something else without another vote.' },
  { key: 'redevelopment plan', match: /redevelopment plan/i, plain: 'A special set of zoning rules for one area that replaces the normal rules and can come with tax breaks for builders.' },
  { key: 'local redevelopment and housing law', match: /local redevelopment and housing law/i, plain: 'The New Jersey law that lets towns label an area as needing redevelopment, which unlocks tax deals and in some cases eminent domain.' },
  { key: 'n.j.s.a.', match: /N\.J\.S\.A\.[^,.;]*/, plain: 'New Jersey Statutes Annotated. A citation pointing to the state law this action relies on.' },
  { key: 'pilot', match: /\bPILOT\b|payment in lieu of taxes/i, plain: 'A deal where a developer pays the town a set yearly fee instead of normal property taxes. The county and schools often get a smaller share than they would from regular taxes.' },
  { key: 'change order', match: /change order/i, plain: 'An official change to a signed contract, usually to adjust the price or the work to be done.' },
  { key: 'shared services agreement', match: /shared services agreement/i, plain: 'A contract where one government pays another to provide a service instead of doing it itself.' },
  { key: 'first reading', match: /first reading/i, plain: 'The formal introduction of an ordinance. No final decision is made yet. New Jersey requires a gap of at least 10 days before the final vote.' },
  { key: 'second reading', match: /second reading/i, plain: 'The meeting where the public hearing happens and the final vote is taken.' },
  { key: 'consent agenda', match: /consent agenda|consent resolutions/i, plain: 'A bundle of routine items approved with one vote and no discussion. Any member can pull an item out for separate debate.' },
  { key: 'table of organization', match: /table of organization/i, plain: 'The official list of how many jobs of each type a department is allowed to have.' },
  { key: 'special item of revenue', match: /special item of revenue|chapter 159/i, plain: 'Adding grant money to the budget after it has already been adopted. New Jersey allows this only for money from outside sources like grants.' },
  { key: 'stormwater utility', match: /stormwater utility/i, plain: 'A separate account funded by a fee on paved surfaces. The money can only be spent on drains and flood control.' },
  { key: 'ms4 permit', match: /MS4 Permit/i, plain: 'A state water permit requiring the town to keep storm drains clean and limit pollution flowing into streams.' },
  { key: 'debt service', match: /debt service/i, plain: 'Yearly payments on money the government borrowed in the past, including interest.' },
  { key: 'capital improvement', match: /capital improvement/i, plain: 'Spending on things that last many years, like roads, buildings, and trucks, as opposed to day-to-day costs.' },
  { key: 'other expenses', match: /other expenses/i, plain: 'New Jersey budget language for everything except salaries: supplies, contracts, fuel, and equipment.' },
  { key: 'unallocated benefits', match: /unallocated benefits/i, plain: 'Health insurance, pensions, and payroll taxes for school employees, grouped together instead of listed by school.' },
  { key: 'tuition to private schools for the disabled', match: /tuition to private schools for the disabled/i, plain: 'What the district pays when a student with a disability is placed in a specialized school outside the district.' },
  { key: 'contracted', match: /contracted and district-owned/i, plain: 'Some buses are owned and run by the district. Others are hired from private bus companies.' },
  { key: 'transportation alternatives program', match: /NJDOT TAP|transportation alternatives program/i, plain: 'A state and federal grant for sidewalks, bike paths, and trails.' },
  { key: 'area in need of redevelopment', match: /area in need of redevelopment/i, plain: 'A legal label under state law. It lets the town write special zoning and offer long tax deals for that area.' },
  { key: 'statutory expenditures', match: /statutory expenditures/i, plain: 'Costs the state requires every government to pay, mostly pensions and Social Security.' },
  { key: 'operation and maintenance of plant', match: /operation and maintenance of plant/i, plain: 'School budget language for custodians, utilities, repairs, and grounds.' }
]

export type Piece = { text: string; term: Term | null }

export function decode(text: string): Piece[] {
  const pieces: Piece[] = []
  let rest = text
  const used = new Set<string>()

  while (rest.length) {
    let best: { index: number; length: number; term: Term } | null = null
    for (const term of GLOSSARY) {
      if (used.has(term.key)) continue
      const m = term.match.exec(rest)
      if (m && (best === null || m.index < best.index || (m.index === best.index && m[0].length > best.length))) {
        best = { index: m.index, length: m[0].length, term }
      }
    }
    if (!best) {
      pieces.push({ text: rest, term: null })
      break
    }
    if (best.index > 0) pieces.push({ text: rest.slice(0, best.index), term: null })
    pieces.push({ text: rest.slice(best.index, best.index + best.length), term: best.term })
    used.add(best.term.key)
    rest = rest.slice(best.index + best.length)
  }

  return pieces
}
