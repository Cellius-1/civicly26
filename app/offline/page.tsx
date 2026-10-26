import Link from 'next/link'
import type { Metadata } from 'next'
import { LogoMark } from '@/components/Logo'

export const metadata: Metadata = {
  title: 'You are offline',
  robots: { index: false, follow: false }
}

export default function Offline() {
  return (
    <div className="welcome">
      <LogoMark className="welcome__mark" size={68} />
      <h1 className="welcome__promise">You are offline.</h1>
      <p className="welcome__sub">
        This page has not been saved on this device yet. Pages you have already opened still work without a connection. Reconnect to see the latest records.
      </p>
      <div className="chips">
        <Link href="/" className="chip">
          Back to start
        </Link>
      </div>
    </div>
  )
}
