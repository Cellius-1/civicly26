import Link from 'next/link'
import { JsonLd } from '@/components/JsonLd'
import { InstallButton } from '@/components/InstallButton'
import { TopBar } from '@/components/TopBar'
import { GLOSSARY } from '@/lib/glossary'
import { breadcrumbs, faqGraph } from '@/lib/schema'
import { pageMeta } from '@/lib/site'

export const metadata = pageMeta({
  title: 'How we read the records',
  description:
    'How Civicly collects public agendas, minutes, budgets, and tax tables, files them under daily life instead of departments, rewrites them in plain English, and what the limits of that translation are.',
  path: '/about',
  image: '/opengraph-image',
  keywords: ['open government data', 'plain language', 'civic technology', 'public records']
})

const FAQ = [
  {
    question: 'Where does this information come from?',
    answer: 'Agenda packets, minutes, ordinance listings, adopted budgets, and the county tax rate table, downloaded on a schedule from the websites where governments already post them. No town has to sign up or buy anything.'
  },
  {
    question: 'How is a tax receipt calculated?',
    answer: 'Your assessed value is multiplied by each taxing body rate per one hundred dollars. Each body share of your bill is then split across its budget lines in proportion to the adopted budget, and converted into units of service such as feet of repaved road.'
  },
  {
    question: 'Can I speak at a meeting if I cannot attend in person?',
    answer: 'Most bodies read written comments into the record if the clerk receives them before a deadline on the meeting day. Every meeting page lists that deadline and the clerk address.'
  },
  {
    question: 'Is the Bridgewater data real?',
    answer: 'Not yet. The records shown today are realistic demonstration samples that show the format and features. Contact addresses end in .example and nothing here should be cited as an official record.'
  }
]

const STEPS = [
  {
    title: 'Collect',
    text: 'Agenda packets, minutes, ordinance listings, adopted budgets, and the county tax rate table are downloaded on a schedule from the websites where governments already post them. Nothing depends on a town signing up.'
  },
  {
    title: 'Split and file',
    text: 'Each document is broken into individual items. Every item is matched to the public body that controls it and filed under a part of daily life, like getting around or staying safe, rather than a department name.'
  },
  {
    title: 'Rewrite',
    text: 'Titles and summaries are rewritten at an eighth grade reading level. The official wording stays on every page, with government terms explained in place, so you can check the translation against the source.'
  },
  {
    title: 'Connect',
    text: 'Proposals are linked to the budget lines they change, the meeting where they will be decided, and the people voting on them. A new link or date becomes an alert for anyone following that topic or neighborhood.'
  }
]

export default function AboutPage() {
  return (
    <>
      <TopBar title="How we read the records" />
      <div className="plain">
      <JsonLd data={[faqGraph(FAQ), breadcrumbs([{ name: 'Civicly', path: '/' }, { name: 'How we read the records', path: '/about' }])]} />
      <div className="narrow">
        <p className="screen__eyebrow">Methods</p>
        <h1 className="screen__title">How we read the records</h1>
        <p className="lede">
          Local governments publish almost everything this app shows. The problem is that it arrives as scanned PDFs, sorted by department, written for lawyers, and posted a few days before the vote. We do the reading so you can do the deciding.
        </p>

        <ol className="method">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <span className="method__n">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h2 className="h3">{s.title}</h2>
                <p className="body-text">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <section className="block" aria-labelledby="limits-title">
          <h2 id="limits-title" className="h2">What to keep in mind</h2>
          <ul className="plain-list">
            <li>Plain English summaries leave details out. If a decision matters to you, open the original document linked on each proposal.</li>
            <li>Tax receipt line amounts assume your share of each government&apos;s bill is spent in the same proportions as its whole budget. Grants and state aid are not counted against your bill.</li>
            <li>Meeting times for individual agenda items are estimates. Arrive at the start if you plan to speak.</li>
            <li>The Bridgewater records shown today are demonstration data. They show the format and features and should not be cited.</li>
          </ul>
        </section>

        <section className="block" id="request" aria-labelledby="request-title">
          <h2 id="request-title" className="h2">Bring your town next</h2>
          <p className="body-text">
            Towns are added in the order residents ask. The fastest way to move yours up is to send the link to where your town posts agendas and budgets.
          </p>
          <a className="btn btn--primary" href="mailto:towns@civicly.example?subject=Please%20add%20my%20town">
            Request my town
          </a>
        </section>

        <section className="block" aria-labelledby="faq-title">
          <h2 id="faq-title" className="h2">Common questions</h2>
          <dl className="glossary">
            {FAQ.map((f) => (
              <div key={f.question}>
                <dt>{f.question}</dt>
                <dd>{f.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="block" aria-labelledby="glossary-title">
          <h2 id="glossary-title" className="h2">Terms we translate</h2>
          <dl className="glossary">
            {GLOSSARY.map((g) => (
              <div key={g.key}>
                <dt>{g.key.charAt(0).toUpperCase() + g.key.slice(1)}</dt>
                <dd>{g.plain}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="block" aria-labelledby="app-title">
          <h2 id="app-title" className="h2">Use it like an app</h2>
          <p className="body-text">
            Civicly runs in the browser, so there is no store download and no account. Adding it to your home screen gives it an icon and opens it full screen.
          </p>
          <InstallButton />
        </section>

        <section className="block" aria-labelledby="machine-title">
          <h2 id="machine-title" className="h2">For developers and researchers</h2>
          <ul className="list">
            <li>
              <Link href="/place/bridgewater-nj/sources" className="row">
                <span className="row__main">
                  <span className="row__title">Document sources</span>
                  <span className="row__meta">Every source document and when it was last checked</span>
                </span>
              </Link>
            </li>
            <li>
              <Link href="/place/bridgewater-nj/feed" className="row">
                <span className="row__main">
                  <span className="row__title">Bridgewater feed</span>
                  <span className="row__meta">An RSS address for news readers, filterable by topic and neighborhood</span>
                </span>
              </Link>
            </li>
            <li>
              <a href="/llms.txt" className="row">
                <span className="row__main">
                  <span className="row__title">Machine readable summary</span>
                  <span className="row__meta">llms.txt with every record and endpoint</span>
                </span>
              </a>
            </li>
          </ul>
        </section>
      </div>
      </div>
    </>
  )
}
