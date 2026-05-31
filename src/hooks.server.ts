import { redirect } from '@sveltejs/kit'
import type { Handle } from '@sveltejs/kit'

// Old Joomla category URLs → new SvelteKit paths
const CATEGORY_REDIRECTS: Record<string, string> = {
  '/boecker': '/bocker',
  '/boecker/laettlaest': '/bocker',
  '/boecker/kapitelboecker': '/bocker/barnbocker',
  '/boecker/boerja-laesa': '/bocker/barnbocker',
  '/boecker/grafiska-romaner': '/bocker/ungdomsbocker/grafiska-romaner',
  '/boecker/grafiska-romaner/klassiska-seriealbum': '/bocker/ungdomsbocker/grafiska-romaner',
  '/boecker/faktaboecker': '/bocker/faktabocker',
  '/boecker/faktaboecker/foerfaerliga-fakta': '/bocker/faktabocker/forfarliga-fakta',
  '/boecker/ljudboecker': '/bocker/e-bocker/e-bocker-ljud',
  '/boecker/e-boecker': '/bocker/e-bocker',
  '/boecker/kommande-utgivning': '/bocker',
  '/borja-lasa': '/bocker/barnbocker',
  '/information/om-argasso': '/om-argasso',
  '/information/om-argasso/foerlaget': '/om-argasso',
  '/information/kontakta-oss': '/kontakta-oss',
  '/information/kontakta-oss/distribution': '/kontakta-oss',
  '/information/kontakta-oss/vi-pa-argasso': '/om-argasso',
  '/information/kontakta-oss/foersaeljning': '/kontakta-oss',
  '/information/var-katalog': '/var-katalog',
  '/information/press': '/press',
  '/information/press/foerfattare': '/forfattare',
  '/information/press/recensionsexemplar': '/press',
  '/information/studiematerial': '/studiematerial',
}

// Old Joomla book slugs that differ from the new Shopify handle
const BOOK_SLUG_REMAPS: Record<string, string> = {
  'röda-dödens-mask': 'roda-dodens-mask-och-andra-noveller',
  'välkommen-till-camp-killer': 'vaelkommen-till-camp-killer',
  'fotbollsakademin': 'fotbollsakademin-avspark',
  'roda-dodens-mask': 'roda-dodens-mask-och-andra-noveller',
}

// Old manufacturer slugs with adapter names baked in → actual author handle
const AUTHOR_SLUG_OVERRIDES: Record<string, string> = {
  'am-stoker-manusbearbetning-jason-cobley': 'bram-stoker',
  'william-shakespeare-manusbearbetning-john-mcdonald': 'william-shakespeare',
  'emily-bronte-manusbearbetning-sean-m-wilson': 'emily-bronte',
  'nike-bengtzelius-christian-axelsson': 'nike-bengtzelius-christian-axelsson',
}

function getLegacyRedirect(rawPath: string): string | null {
  let path: string
  try {
    path = decodeURIComponent(rawPath)
  } catch {
    path = rawPath
  }
  const p = path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path

  // 1. Exact category / information page matches
  if (CATEGORY_REDIRECTS[p]) return CATEGORY_REDIRECTS[p]

  // 2. Old book pages with .html extension: /boecker/{category}/{slug}.html
  const htmlBookMatch = p.match(/^\/boecker\/[^/]+\/(.+)\.html$/)
  if (htmlBookMatch) {
    const slug = BOOK_SLUG_REMAPS[htmlBookMatch[1]] ?? htmlBookMatch[1]
    return `/bok/${slug}`
  }

  // 3. Old book pages without .html: /boecker/{category}/{slug}
  const plainBookMatch = p.match(/^\/boecker\/[^/]+\/([^/]+)$/)
  if (plainBookMatch) {
    const slug = BOOK_SLUG_REMAPS[plainBookMatch[1]] ?? plainBookMatch[1]
    return `/bok/${slug}`
  }

  // 4. Old author press pages: /information/press/foerfattare/manufacturer(s)/{slug}
  const manufacturerMatch = p.match(/^\/information\/press\/foerfattare\/manufacturers?\/([^/?]+)/)
  if (manufacturerMatch) {
    const slug = AUTHOR_SLUG_OVERRIDES[manufacturerMatch[1]] ?? manufacturerMatch[1]
    return `/forfattare/${slug}`
  }

  // 5. Any other /information/* or /boecker/* falls back to safe defaults
  if (p.startsWith('/information/')) return '/om-argasso'
  if (p.startsWith('/boecker/')) return '/bocker'

  return null
}

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.cartId = event.cookies.get('cartId')

  const dest = getLegacyRedirect(event.url.pathname)
  if (dest) redirect(301, dest)

  const response = await resolve(event)

  return response
}
