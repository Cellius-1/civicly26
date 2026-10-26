import { ImageResponse } from 'next/og'
import { LogoMark } from '@/components/Logo'

export const OG_SIZE = { width: 1200, height: 630 }

interface CardInput {
  eyebrow: string
  title: string
  detail: string
  facts?: { label: string; value: string }[]
}

export function ogCard({ eyebrow, title, detail, facts = [] }: CardInput) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#efece4',
          color: '#12161c',
          padding: '64px 72px',
          fontFamily: 'Georgia, serif'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <LogoMark size={64} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 30, fontWeight: 700, color: '#0e3b43' }}>Civicly</span>
            <span style={{ fontSize: 19, color: '#6d7580', fontFamily: 'sans-serif' }}>{eyebrow}</span>
          </div>
        </div>

        <div style={{ height: 3, background: '#0e3b43', margin: '36px 0 40px' }} />

        <div style={{ display: 'flex', fontSize: title.length > 70 ? 52 : 62, fontWeight: 700, lineHeight: 1.12, letterSpacing: '-0.02em' }}>
          {title.length > 120 ? `${title.slice(0, 118)}...` : title}
        </div>

        <div style={{ display: 'flex', marginTop: 28, fontSize: 26, lineHeight: 1.4, color: '#434a54', fontFamily: 'sans-serif' }}>
          {detail.length > 170 ? `${detail.slice(0, 168)}...` : detail}
        </div>

        <div style={{ display: 'flex', marginTop: 'auto', gap: 48, alignItems: 'flex-end' }}>
          {facts.map((f) => (
            <div key={f.label} style={{ display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>
              <span style={{ fontSize: 17, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6d7580' }}>{f.label}</span>
              <span style={{ fontSize: 30, fontWeight: 700, color: '#0e3b43' }}>{f.value}</span>
            </div>
          ))}
          <div style={{ display: 'flex', marginLeft: 'auto', background: '#a8761f', color: '#ffffff', padding: '10px 22px', fontSize: 22, fontFamily: 'sans-serif', fontWeight: 700 }}>
            Read it in plain English
          </div>
        </div>
      </div>
    ),
    OG_SIZE
  )
}
