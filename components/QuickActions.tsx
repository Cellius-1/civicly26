'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { runSearch, type SearchDoc } from '@/lib/search'
import { toast } from '@/lib/toast'
import { Icon } from './Icon'
import { usePrefs } from './usePrefs'

const KIND_LABEL: Record<SearchDoc['kind'], string> = {
  measure: 'Proposal',
  meeting: 'Meeting',
  budget: 'Budget line',
  official: 'Official',
  topic: 'Topic',
  page: 'Screen'
}

const SUGGESTIONS = ['Route 22', 'leaf pickup', 'school start time', 'stormwater', 'repaving', 'library hours']

export function QuickActions({ placeId, placeName, docs }: { placeId: string; placeName: string; docs: SearchDoc[] }) {
  const router = useRouter()
  const searchRef = useRef<HTMLDialogElement>(null)
  const listRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const { prefs, toggleSaved, ready } = usePrefs(placeId)

  const results = query.trim() ? runSearch(docs, query) : []

  const openSearch = useCallback(() => {
    const dialog = searchRef.current
    if (!dialog || dialog.open) return
    dialog.showModal()
    window.requestAnimationFrame(() => inputRef.current?.focus())
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const typing = target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        openSearch()
      } else if (e.key === '/' && !typing && !document.querySelector('dialog[open]')) {
        e.preventDefault()
        openSearch()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openSearch])

  const go = (href: string) => {
    searchRef.current?.close()
    listRef.current?.close()
    setQuery('')
    router.push(href)
  }

  const onSearchKeys = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!results.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => (a + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => (a - 1 + results.length) % results.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      go(results[active].href)
    }
  }

  return (
    <>
      <button type="button" className="appbar__action" onClick={openSearch} aria-label={`Search ${placeName} records`}>
        <Icon name="search" />
      </button>
      <button type="button" className="appbar__action" onClick={() => listRef.current?.showModal()} aria-label={`My list, ${prefs.saved.length} saved`}>
        <Icon name="bookmark" />
        {ready && prefs.saved.length ? <span className="appbar__badge">{prefs.saved.length}</span> : null}
      </button>

      <dialog ref={searchRef} className="sheet" aria-label="Search the record" onClose={() => setActive(0)}>
        <div className="sheet__inner" onKeyDown={onSearchKeys}>
          <span className="sheet__grip" aria-hidden="true" />
          <div className="sheet__head">
            <label className="sr-only" htmlFor="palette-input">
              Search proposals, meetings, budget lines, and officials
            </label>
            <Icon name="search" size={20} />
            <input
              id="palette-input"
              ref={inputRef}
              className="sheet__input"
              type="search"
              placeholder={`Search ${placeName}`}
              value={query}
              autoComplete="off"
              role="combobox"
              aria-expanded={results.length > 0}
              aria-controls="palette-results"
              onChange={(e) => {
                setQuery(e.target.value)
                setActive(0)
              }}
            />
            <button type="button" className="sheet__close" onClick={() => searchRef.current?.close()}>
              Close
            </button>
          </div>

          {query.trim() ? (
            results.length ? (
              <ul id="palette-results" className="palette" role="listbox" aria-label="Results">
                {results.map((doc, i) => (
                  <li key={doc.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={i === active}
                      className={`palette__row${i === active ? ' is-active' : ''}`}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => go(doc.href)}
                    >
                      <span className="palette__kind">{KIND_LABEL[doc.kind]}</span>
                      <span className="palette__title">{doc.title}</span>
                      <span className="palette__detail">{doc.detail}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="sheet__empty">Nothing matches that yet. Try a street name, a topic, or a file number like Ord. 26-14.</p>
            )
          ) : (
            <div className="sheet__body">
              <p className="sheet__hint">Jump straight to anything on record</p>
              <ul className="chips">
                {SUGGESTIONS.map((s) => (
                  <li key={s}>
                    <button type="button" className="chip" onClick={() => { setQuery(s); inputRef.current?.focus() }}>
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
              <p className="sheet__keys">
                <kbd>Up</kbd> <kbd>Down</kbd> to move, <kbd>Enter</kbd> to open, <kbd>Esc</kbd> to close
              </p>
            </div>
          )}
        </div>
      </dialog>

      <dialog ref={listRef} className="sheet" aria-label="My list">
        <div className="sheet__inner">
          <span className="sheet__grip" aria-hidden="true" />
          <div className="sheet__head">
            <h2 className="sheet__title">My list</h2>
            <button type="button" className="sheet__close" onClick={() => listRef.current?.close()}>
              Close
            </button>
          </div>
          {prefs.saved.length ? (
            <ul className="saved">
              {prefs.saved.map((item) => (
                <li key={item.id}>
                  <div>
                    <Link href={item.href} className="saved__title" onClick={() => listRef.current?.close()}>
                      {item.title}
                    </Link>
                    <p className="saved__note">{item.note}</p>
                  </div>
                  <button
                    type="button"
                    className="linkish"
                    onClick={() => {
                      toggleSaved(item)
                      toast(`Removed: ${item.title}`, 'removed')
                    }}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="sheet__empty">
              Nothing saved yet. Add a proposal or meeting to your list.
            </p>
          )}
        </div>
      </dialog>
    </>
  )
}
