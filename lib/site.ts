import type { Metadata } from 'next'

export const SITE = {
  name: 'Civicly',
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://civicly.example').replace(/\/$/, ''),
  tagline: 'Your local government, in plain English',
  description:
    'Enter a ZIP code or county and read every proposal, vote, meeting agenda, and budget line from the local governments that serve that address, rewritten in plain English with deadlines and a way to write back.',
  locale: 'en_US',
  twitter: '@civicly'
}

export function absolute(path: string): string {
  return `${SITE.url}${path.startsWith('/') ? path : `/${path}`}`
}

interface MetaInput {
  title: string
  description: string
  path: string
  keywords?: string[]
  published?: string
  modified?: string
  image?: string
}

export function pageMeta({ title, description, path, keywords, published, modified, image }: MetaInput): Metadata {
  const url = absolute(path)
  const images = image ? [{ url: absolute(image), width: 1200, height: 630, alt: title }] : undefined
  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      siteName: SITE.name,
      title,
      description,
      locale: SITE.locale,
      publishedTime: published,
      modifiedTime: modified,
      ...(images ? { images } : {})
    },
    twitter: { card: 'summary_large_image', title, description, ...(images ? { images: images.map((i) => i.url) } : {}) }
  }
}
