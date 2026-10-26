'use client'

import { useEffect, useState } from 'react'
import { TOAST_EVENT, type ToastDetail } from '@/lib/toast'

interface Item extends ToastDetail {
  id: number
}

export function ToastHost() {
  const [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    let counter = 0
    const timers: number[] = []
    const onToast = (event: Event) => {
      const detail = (event as CustomEvent<ToastDetail>).detail
      const id = ++counter
      setItems((current) => [...current.slice(-2), { ...detail, id }])
      timers.push(window.setTimeout(() => setItems((current) => current.filter((i) => i.id !== id)), 3600))
    }
    window.addEventListener(TOAST_EVENT, onToast)
    return () => {
      window.removeEventListener(TOAST_EVENT, onToast)
      timers.forEach((t) => window.clearTimeout(t))
    }
  }, [])

  return (
    <div className="toasts" role="status" aria-live="polite">
      {items.map((i) => (
        <p key={i.id} className={`toast toast--${i.tone ?? 'plain'}`}>
          {i.message}
        </p>
      ))}
    </div>
  )
}
