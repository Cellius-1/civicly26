import { ImageResponse } from 'next/og'
import { LOGO_COLORS, LogoMark } from '@/components/Logo'

export const dynamic = 'force-static'

// 192 and 512 are what Android and Chrome need to offer "Install".
// The maskable versions leave a safe margin so launchers can crop them to any shape.
const SIZES = ['192', '512', 'maskable-192', 'maskable-512'] as const

export function generateStaticParams() {
  return SIZES.map((size) => ({ size }))
}

export async function GET(_req: Request, { params }: { params: Promise<{ size: string }> }) {
  const { size } = await params
  if (!(SIZES as readonly string[]).includes(size)) return new Response('Not found', { status: 404 })

  const maskable = size.startsWith('maskable-')
  const px = Number(size.replace('maskable-', ''))
  const mark = maskable ? Math.round(px * 0.72) : px

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: LOGO_COLORS.brand }}>
        <LogoMark size={mark} />
      </div>
    ),
    { width: px, height: px }
  )
}
