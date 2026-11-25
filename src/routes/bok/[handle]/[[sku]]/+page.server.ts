import { error } from '@sveltejs/kit'
import { client } from '../../../../client'
import { productQuery } from '../page.gql'
import { productsQuery, type TProductsServerResult } from '$lib/components/ProductsGrid.gql'
import { isType, isNonNil } from '$lib'
import { findMenuItemById, getPathToItem } from '$lib/menu'
import type { VariablesOf } from '../../../../graphql'

type ProductFilters = VariablesOf<typeof productsQuery>['filters']

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

async function booksByFilter(fetch: typeof globalThis.fetch, filters: ProductFilters) {
  const response = await client.query(productsQuery, { filters, first: 30 }, { fetch })
  if (response.error) {
    console.error('ProductsStore fetch failed', response.error)
    error(500, 'Oj, någonting gick snett när vi försökte ladda sidan')
  }
  return response.data?.collection?.products.nodes ?? []
}

export async function load({ fetch, url, params, parent }) {
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

  const seriesTag = response.data.product.tags.find((tag) => tag.startsWith('series:'))

  const defaultVariant = sku
    ? response.data.product.variants.nodes.find((v) => v.sku == sku)
    : response.data.product.variants.nodes.at(0)

  const { menu } = await parent()
  const categoryIds = defaultVariant?.category?.value
    ? (JSON.parse(defaultVariant.category.value) as string[])
    : []
  const leafCategoryId = categoryIds
    .map((id) => findMenuItemById(menu, id))
    .filter(isNonNil)
    .toSorted((a, b) => getPathToItem(b).length - getPathToItem(a).length)
    .at(0)?.id

  const [seriesBooks, authorBooks, categoryBooks] = await Promise.all([
    seriesTag ? booksByFilter(fetch, [{ tag: seriesTag }]) : ([] as TProductsServerResult['nodes']),
    authorIds.length > 0
      ? booksByFilter(
          fetch,
          authorIds.map((id) => ({
            productMetafield: { namespace: 'custom', key: 'authors', value: id },
          })),
        )
      : ([] as TProductsServerResult['nodes']),
    leafCategoryId
      ? booksByFilter(fetch, [
          { variantMetafield: { namespace: 'book', key: 'category', value: leafCategoryId } },
        ])
      : ([] as TProductsServerResult['nodes']),
  ])

  const seen = new Set([handle])
  const recommendations = [...recommendedBooks, ...seriesBooks, ...authorBooks, ...categoryBooks]
    .filter((book) => {
      if (seen.has(book.handle)) return false
      seen.add(book.handle)
      return true
    })
    .slice(0, 6)

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
