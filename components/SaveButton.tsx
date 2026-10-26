'use client'

import { usePrefs, type SavedItem } from './usePrefs'
import { toast } from '@/lib/toast'

export function SaveButton({ placeId, item, size = 'small', labels }: { placeId: string; item: SavedItem; size?: 'small' | 'full'; labels?: [string, string] }) {
  const { prefs, toggleSaved, ready } = usePrefs(placeId)
  const saved = prefs.saved.some((s) => s.id === item.id)

  return (
    <button
      type="button"
      className={`save save--${size}${saved ? ' is-saved' : ''}`}
      aria-pressed={saved}
      disabled={!ready}
      onClick={() => {
        const added = toggleSaved(item)
        toast(added ? `Saved: ${item.title}` : `Removed: ${item.title}`, added ? 'saved' : 'removed')
      }}
    >
      <span className="save__mark" aria-hidden="true" />
      <span>{saved ? (labels ? labels[1] : 'On my list') : labels ? labels[0] : 'Add to my list'}</span>
    </button>
  )
}
