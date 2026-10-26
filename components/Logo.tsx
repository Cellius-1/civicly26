/*
 * The Civicly mark: a speech bubble with a town hall inside it.
 * Your voice, at the place where decisions get made.
 * Drawn on a 32 by 32 grid so it stays crisp from a 16px favicon up.
 * Server-safe (no hooks), so it also works inside next/og ImageResponse.
 */

export const LOGO_COLORS = {
  brand: '#0e3b43',
  brass: '#c8922f'
} as const

export const LOGO_PATHS = {
  bubble:
    'M8 5.5H24A3 3 0 0 1 27 8.5V19.5A3 3 0 0 1 24 22.5H14.2L8.6 26.8L9.7 22.5H8A3 3 0 0 1 5 19.5V8.5A3 3 0 0 1 8 5.5Z',
  roof: 'M16 8.1L23.6 12.4H8.4Z',
  columns: 'M10.1 13.5h2.4v5.4h-2.4zM14.8 13.5h2.4v5.4h-2.4zM19.5 13.5h2.4v5.4h-2.4z',
  base: 'M8.6 19.7h14.8v1.5H8.6z'
} as const

type Tone = 'brand' | 'brass'

export function LogoMark({
  size = 32,
  tone = 'brand',
  className,
  title
}: {
  size?: number
  tone?: Tone
  className?: string
  title?: string
}) {
  const ground = tone === 'brand' ? LOGO_COLORS.brand : LOGO_COLORS.brass
  const bubble = tone === 'brand' ? LOGO_COLORS.brass : LOGO_COLORS.brand
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <rect width="32" height="32" rx="7.5" fill={ground} />
      <path d={LOGO_PATHS.bubble} fill={bubble} />
      <path d={LOGO_PATHS.roof} fill={ground} />
      <path d={LOGO_PATHS.columns} fill={ground} />
      <path d={LOGO_PATHS.base} fill={ground} />
    </svg>
  )
}

/** Plain SVG markup for places that cannot render React (the RSS stylesheet). */
export function logoMarkup(size = 32, tone: Tone = 'brass'): string {
  const ground = tone === 'brand' ? LOGO_COLORS.brand : LOGO_COLORS.brass
  const bubble = tone === 'brand' ? LOGO_COLORS.brass : LOGO_COLORS.brand
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="${size}" height="${size}" aria-hidden="true"><rect width="32" height="32" rx="7.5" fill="${ground}"/><path d="${LOGO_PATHS.bubble}" fill="${bubble}"/><path d="${LOGO_PATHS.roof} ${LOGO_PATHS.columns} ${LOGO_PATHS.base}" fill="${ground}"/></svg>`
}
