export type IconName =
  | 'today'
  | 'records'
  | 'meetings'
  | 'receipt'
  | 'alerts'
  | 'budget'
  | 'who'
  | 'sources'
  | 'search'
  | 'bookmark'
  | 'back'
  | 'next'
  | 'close'
  | 'filter'

const PATHS: Record<IconName, React.ReactNode> = {
  today: (
    <>
      <path d="M4 6.5h9M4 12h16M4 17.5h11" />
      <circle cx="18.5" cy="6.5" r="2.2" />
    </>
  ),
  records: (
    <>
      <path d="M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5h-10A.5.5 0 0 1 7 20z" />
      <path d="M14 3.5V8h4M10 12.5h6M10 16h4" />
    </>
  ),
  meetings: (
    <>
      <rect x="3.5" y="5.5" width="17" height="15" rx="2" />
      <path d="M3.5 10h17M8.5 3.5v4M15.5 3.5v4" />
    </>
  ),
  receipt: (
    <>
      <path d="M6 3.5h12v17l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4-2 1.4z" />
      <path d="M9.5 8.5h5M9.5 12.5h5" />
    </>
  ),
  alerts: (
    <>
      <path d="M6.5 10a5.5 5.5 0 0 1 11 0c0 4.5 1.8 5.6 1.8 5.6H4.7S6.5 14.5 6.5 10z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </>
  ),
  budget: (
    <>
      <path d="M4 20h16" />
      <path d="M7 20v-6M12 20V6M17 20v-9" />
    </>
  ),
  who: (
    <>
      <circle cx="12" cy="8.5" r="3.4" />
      <path d="M5 20c1.2-3.4 3.8-5 7-5s5.8 1.6 7 5" />
    </>
  ),
  sources: (
    <>
      <path d="M4 5.5h9v15H4zM13 8.5h7v12h-7z" />
      <path d="M6.5 9.5h4M6.5 13h4" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.2" />
      <path d="m15.6 15.6 4.4 4.4" />
    </>
  ),
  bookmark: <path d="M7 4h10v16.5l-5-3.8-5 3.8z" />,
  back: <path d="M14.5 5.5 8 12l6.5 6.5" />,
  next: <path d="M9.5 5.5 16 12l-6.5 6.5" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  filter: (
    <>
      <path d="M4 7.5h16M7 12h10M10 16.5h4" />
    </>
  )
}

export function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  )
}
