export interface ToastDetail {
  message: string
  tone?: 'plain' | 'saved' | 'removed'
}

export const TOAST_EVENT = 'civicly:toast'

export function toast(message: string, tone: ToastDetail['tone'] = 'plain') {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent<ToastDetail>(TOAST_EVENT, { detail: { message, tone } }))
}
