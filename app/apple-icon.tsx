import { ImageResponse } from 'next/og'
import { LogoMark } from '@/components/Logo'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  // iOS rounds the corners itself, so fill the square edge to edge.
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#0e3b43' }}>
        <LogoMark size={180} />
      </div>
    ),
    size
  )
}
