import { mainMenuQuery } from '$lib/components/NavMenu.gql'
import { flatten, makeMenu } from '$lib/menu'
import type { OperationResult } from '@urql/core'
import { client } from '../../client'
import { graphql, type ResultOf } from '../../graphql'
import type { RequestHandler } from './$types'

const sitemapProductsQuery = graphql(`
  query SitemapProducts($after: String) {
    products(first: 250, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        handle
        updatedAt
        variants(first: 10) {
          nodes {
            sku
          }
        }
      }
    }
  }
`)

type SitemapUrl = {
  url: string
  lastmod?: string
  changefreq: string
  priority: string
}

export const GET: RequestHandler = async ({ url, fetch }) => {
  const origin = url.origin

  // Paginate through all products
  const products: Array<{
    handle: string
    updatedAt: string
    variants: { nodes: Array<{ sku: string | null }> }
  }> = []

  let after: string | undefined = undefined
  let hasNextPage = true

  while (hasNextPage) {
    const result: OperationResult<ResultOf<typeof sitemapProductsQuery>> = await client.query(
      sitemapProductsQuery,
      { after },
      { fetch },
    )
    if (result.error || !result.data?.products) break

    products.push(...result.data.products.nodes)
    hasNextPage = result.data.products.pageInfo.hasNextPage
    after = result.data.products.pageInfo.endCursor ?? undefined
  }

  // Fetch navigation menus for category page URLs
  const menuResponse = await client.query(mainMenuQuery, {}, { fetch })
  const mainMenu = makeMenu(menuResponse.data?.menu)
  const infoMenu = makeMenu(menuResponse.data?.informationMenu)
  const allMenuItems = [
    ...(mainMenu ? flatten(mainMenu) : []),
    ...(infoMenu ? flatten(infoMenu) : []),
  ]

  const staticUrls: SitemapUrl[] = [
    { url: origin, changefreq: 'weekly', priority: '1.0' },
    { url: `${origin}/forfattare`, changefreq: 'weekly', priority: '0.8' },
  ]

  const categoryUrls: SitemapUrl[] = allMenuItems
    .filter((item) => item.href !== '/')
    .map((item) => ({
      url: `${origin}${item.href}`,
      changefreq: 'weekly',
      priority: '0.7',
    }))

  const bookUrls: SitemapUrl[] = products.flatMap((product) =>
    product.variants.nodes.flatMap((variant) =>
      variant.sku
        ? [
            {
              url: `${origin}/bok/${product.handle}/${variant.sku}`,
              lastmod: product.updatedAt.split('T')[0],
              changefreq: 'monthly',
              priority: '0.9',
            },
          ]
        : [],
    ),
  )

  const allUrls = [...staticUrls, ...categoryUrls, ...bookUrls]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    ({ url, lastmod, changefreq, priority }) => `  <url>
    <loc>${escapeXml(url)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=3600',
    },
  })
}

function escapeXml(str: string) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
