'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { SearchDoc } from '@/lib/search'
import { LAST_PLACE_KEY } from './ContinueCard'
import { Icon, type IconName } from './Icon'
import { LogoMark } from './Logo'
import { QuickActions } from './QuickActions'

interface ShellPlace {
  id: string
  name: string
  shortName: string
  county: string
  asOf: string
}

const TABS: { href: string; label: string; icon: IconName }[] = [
  { href: '', label: 'Today', icon: 'today' },
  { href: '/measures', label: 'Proposals', icon: 'records' },
  { href: '/meetings', label: 'Meetings', icon: 'meetings' },
  { href: '/receipt', label: 'Receipt', icon: 'receipt' },
  { href: '/follow', label: 'Alerts', icon: 'alerts' }
]

const MORE: { href: string; label: string; icon: IconName }[] = [
  { href: '/budget', label: 'Budget', icon: 'budget' },
  { href: '/officials', label: 'Who decides?', icon: 'who' },
  { href: '/sources', label: 'Document sources', icon: 'sources' }
]

export function AppShell({
  place,
  titles,
  docs,
  children
}: {
  place: ShellPlace
  titles: Record<string, string>
  docs: SearchDoc[]
  children: React.ReactNode
}) {
  const path = usePathname()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const base = `/place/${place.id}`

  useEffect(() => {
    try {
      window.localStorage.setItem(LAST_PLACE_KEY, JSON.stringify({ id: place.id, name: place.name, at: new Date().toISOString() }))
    } catch {}
  }, [place.id, place.name])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 72)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [path])

  const isTab = [...TABS].some((t) => `${base}${t.href}` === path)
  const parent = path.replace(/\/[^/]+$/, '')
  const title = titles[path] ?? place.shortName

  return (
    <div className="app">
      <nav className="sidenav" aria-label="Sections">
        <Link href="/" className="sidenav__brand">
          <LogoMark className="wordmark__seal" tone="brass" />
          <span className="wordmark__name">Civicly</span>
        </Link>
        <div className="sidenav__place">
          <span className="sidenav__place-name">{place.name}</span>
          <span className="sidenav__place-meta">{place.county}</span>
        </div>
        {[...TABS, ...MORE].map((item) => {
          const href = `${base}${item.href}`
          const active = item.href === '' ? path === base : path.startsWith(href)
          return (
            <Link key={item.href} href={href} className={`sidenav__link${active ? ' is-active' : ''}`} aria-current={active ? 'page' : undefined}>
              <Icon name={item.icon} size={20} />
              {item.label}
            </Link>
          )
        })}
        <div className="sidenav__foot">
          <Link href="/lookup">Change location</Link>
          <Link href="/about">How we read the records</Link>
        </div>
      </nav>

      <div className="app__main">
        <header className={`appbar${scrolled ? ' is-scrolled' : ''}`}>
          {isTab ? (
            <Link href="/" className="appbar__back" aria-label="Civicly home">
              <LogoMark className="wordmark__seal" />
            </Link>
          ) : (
            <button type="button" className="appbar__back" onClick={() => (window.history.length > 1 ? router.back() : router.push(parent))} aria-label="Back">
              <Icon name="back" />
            </button>
          )}
          <div className="appbar__slot">
            <span className="appbar__title">{title}</span>
          </div>
          <div className="appbar__actions">
            <QuickActions placeId={place.id} placeName={place.shortName} docs={docs} />
          </div>
        </header>

        <div className="screen" key={path}>
          <div className="screen__inner">{children}</div>
        </div>
      </div>

      <nav className="tabbar" aria-label="Main">
        {TABS.map((tab) => {
          const href = `${base}${tab.href}`
          const active = tab.href === '' ? path === base : path.startsWith(href)
          return (
            <Link key={tab.href} href={href} className={`tabbar__tab${active ? ' is-active' : ''}`} aria-current={active ? 'page' : undefined}>
              <span className="tabbar__glyph">
                <Icon name={tab.icon} size={21} />
              </span>
              {tab.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
