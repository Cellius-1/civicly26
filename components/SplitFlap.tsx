'use client'

import { useEffect, useState } from 'react'

const GLYPHS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export function SplitFlap({ value, label }: { value: string; label?: string }) {
  const target = value.toUpperCase()
  const [shown, setShown] = useState(target)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(target)
      return
    }
    let frame = 0
    const settleAt = target.split('').map((_, i) => 6 + i * 3)
    const id = window.setInterval(() => {
      frame++
      const next = target
        .split('')
        .map((ch, i) => {
          if (ch === ' ' || frame >= settleAt[i] || !GLYPHS.includes(ch)) return ch
          return GLYPHS[(GLYPHS.indexOf(ch) + GLYPHS.length - (settleAt[i] - frame)) % GLYPHS.length] ?? ch
        })
        .join('')
      setShown(next)
      if (frame >= settleAt[settleAt.length - 1]) window.clearInterval(id)
    }, 55)
    return () => window.clearInterval(id)
  }, [target])

  return (
    <span className="flap" aria-label={label ?? value} role="img">
      {shown.split('').map((ch, i) =>
        ch === ' ' ? (
          <span key={i} className="flap__gap" aria-hidden="true" />
        ) : (
          <span key={`${i}-${ch}`} className="flap__cell" aria-hidden="true">
            {ch}
          </span>
        )
      )}
    </span>
  )
}
