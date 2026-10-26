'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Icon } from './Icon'

export function TopBar({ title, fallback = '/', action }: { title: string; fallback?: string; action?: { href: string; label: string } }) {
  const router = useRouter()

  return (
    <header className="topbar">
      <button
        type="button"
        className="topbar__back"
        aria-label="Back"
        onClick={() => (window.history.length > 1 ? router.back() : router.push(fallback))}
      >
        <Icon name="back" />
      </button>
      <span className="topbar__title">{title}</span>
      {action ? (
        <Link href={action.href} className="topbar__action">
          {action.label}
        </Link>
      ) : null}
    </header>
  )
}
