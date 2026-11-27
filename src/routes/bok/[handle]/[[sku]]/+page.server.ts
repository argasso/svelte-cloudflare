import { error } from '@sveltejs/kit'
import { client } from '../../../../client'
import { productQuery, relatedBooksQuery } from '../page.gql'
import { productsQuery } from '$lib/components/ProductsGrid.gql'
import { isType, isNonNil } from '$lib'

const metafields = [
  book('category', 'Kategori'),
  book('binding', 'Format'),
  book('edited_by', 'Redigering'),
  book('illustrations_by', 'Illustrationer'),
  book('age', 'Rekommenderad ålder'),
  book('number_of_pages', 'Antal sidor'),
  book('publish_month', 'Utgivningsmånad'),
  translated('original_title', 'Orginaltitel'),
  translated('translated_by', 'Översättning'),
  audio('narrated_by', 'Uppläsare'),
  audio('duration', 'Speltid'),
  audio('contains', 'Innehåller'),
  book('reading_level', 'Lättlästnivå'),
]

const metafieldLabels = new Map(metafields.map((m) => [m.key, m.label]))

function book(key: string, label: string) {
  return { namespace: 'book', key, label }
}

function translated(key: string, label: string) {
  return { namespace: 'translated_book', key, label }
}

function audio(key: string, label: string) {
  return { namespace: 'audio_book', key, label }
}

const metafieldIds = metafields.map(({ key, namespace }) => ({ key, namespace }))

function orQuery(terms: string[]) {
  return terms.map((term) => `(${term})`).join(' OR ')
}

// Searches the whole catalog, not just the "frontpage" collection, since a
// series can include books that aren't in it yet (e.g. unreleased titles).
async function booksBySeriesTags(fetch: typeof globalThis.fetch, tags: string[]) {
  if (tags.length === 0) return []
  const response = await client.query(
    relatedBooksQuery,
    { query: orQuery(tags.map((tag) => `tag:"${tag}"`)), first: 30 },
    { fetch },
  )
  if (response.error) {
    console.error('RelatedBooks fetch failed', response.error)
    error(500, 'Oj, någonting gick snett när vi försökte ladda sidan')
  }
  return response.data?.products.nodes ?? []
}

// The Storefront API's search `query` syntax can't filter on
// metaobject-reference metafields, so author matching uses the collection
// filter API instead (scoped to "frontpage", same as elsewhere on the site).
// Each author is queried separately since Shopify ANDs entries within a
// single `filters` array.
async function booksByAuthor(fetch: typeof globalThis.fetch, authorId: string) {
  const response = await client.query(
    productsQuery,
    {
      filters: [{ productMetafield: { namespace: 'custom', key: 'authors', value: authorId } }],
      first: 30,
    },
    { fetch },
  )
  if (response.error) {
    console.error('ProductsStore fetch failed', response.error)
    error(500, 'Oj, någonting gick snett när vi försökte ladda sidan')
  }
  return response.data?.collection?.products.nodes ?? []
}

export async function load({ fetch, url, params }) {
  const { handle, sku } = params
  const variables = {
    handle,
    metafieldIds,
  }
  const response = await client.query(productQuery, variables, { fetch })
  if (response.error) {
    console.error('MainMenuQuery failed', response.error)
    error(500, 'Oj, någonting gick snett när vi försökte ladda sidan')
  }

  if (!response.data?.product) {
    error(404, 'Hittar inte boken')
  }

  const recommendedBooks = response.data.productRecommendations ?? []

  const authorIds =
    response.data.product.authors?.references?.nodes
      .filter(isType('Metaobject'))
      .filter(isNonNil)
      .map((a) => a.id) ?? []

  const seriesTags = response.data.product.tags.filter((tag) => tag.startsWith('series:'))

  const [seriesBooks, authorBookLists] = await Promise.all([
    booksBySeriesTags(fetch, seriesTags),
    Promise.all(authorIds.map((id) => booksByAuthor(fetch, id))),
  ])
  const authorBooks = authorBookLists.flat()

  const seen = new Set([handle])
  const dedupe = (book: { handle: string }) => {
    if (seen.has(book.handle)) return false
    seen.add(book.handle)
    return true
  }

  const primaryBooks = [...recommendedBooks, ...seriesBooks].filter(dedupe)
  const authorMatches = authorBooks.filter(dedupe).slice(0, 6)

  const recommendations = [...primaryBooks, ...authorMatches]

  const { variants, ...product } = response.data.product
  const variant = sku ? variants?.nodes.find((v) => v.sku == sku) : variants?.nodes.at(0)
  const otherVariants = variants?.nodes.filter((v) => v.sku != variant?.sku) ?? []

  if (!variant) {
    error(404, 'Hittar inte boken')
  }

  return {
    maxage: 3600,
    product,
    variant,
    otherVariants,
    metafieldLabels,
    recommendations,
  }
}
