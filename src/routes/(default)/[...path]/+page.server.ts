import {
  DEFAULT_PAGE_SIZE,
  defaultSortKey,
  getActiveShopifyFilters,
  getCategoryFilterAsTree,
  getEnhancedFilter,
  shortGID,
  sortOptions,
} from '$lib/components/filter/shopifyFilters.js'
import { productsQuery } from '$lib/components/ProductsGrid.gql'
import { findMenuItem } from '$lib/menu.js'
import { error, redirect } from '@sveltejs/kit'
import { client } from '../../../client'

export const load = async (event) => {
  const { url, parent } = event
  const { initialFilters, menu } = await parent()

  // Sorting
  const size = url.searchParams.get('size')
  const sort = url.searchParams.get('sort')

  // Reset
  const reset = url.searchParams.get('reset')
  if (reset === 'filters') {
    const location = new URL(url.pathname, url.origin)
    if (size) {
      location.searchParams.append('size', size)
    }
    if (sort) {
      location.searchParams.append('sort', sort)
    }
    redirect(303, location.href)
  } else if (reset) {
    const location = new URL(url)
    location.searchParams.delete('reset')
    initialFilters
      .map((f) => getEnhancedFilter(f, url.searchParams, initialFilters))
      .flatMap((f) => f.values)
      .filter((f) => f.id === reset)
      .forEach((f) => {
        location.searchParams.delete(f.key, f.value)
      })
    redirect(303, location.href)
  }

  // Paging
  const after = url.searchParams.get('after')
  const before = url.searchParams.get('before')
  const pageSize = size ? parseInt(size) : DEFAULT_PAGE_SIZE
  const navigation = before ? { before, last: pageSize } : { after, first: pageSize }

  // Sorting
  const pageSort = sort ?? defaultSortKey.value
  const { sortKey, reverse } = sortOptions.find((s) => s.value === pageSort) ?? defaultSortKey

  // Filtering
  const searchParams = new URLSearchParams(url.searchParams)
  const category = findMenuItem(menu, url.pathname)
  if (category) {
    searchParams.append('category', shortGID(category.id))
  }

  const filters = getActiveShopifyFilters(initialFilters, menu, searchParams)

  if (filters.length == 0) {
    return {
      products: undefined,
    }
  }

  // Products
  const productsResponse = await client.query(
    productsQuery,
    { ...navigation, sortKey, reverse, filters },
    { fetch },
  )
  if (productsResponse.error) {
    console.error('ProductsStore fetch failed', productsResponse.error)
    error(500, 'Oj, någonting gick snett när vi försökte ladda sidan')
  }
  const products = productsResponse.data?.collection?.products
  if (!products) {
    error(404, 'Kan inte hitta produkter')
  }

  const enhancedFilters = products.filters.map((f) =>
    getEnhancedFilter(f, url.searchParams, initialFilters),
  )
  const currentFilters = enhancedFilters.map((f) =>
    getCategoryFilterAsTree(f, menu?.children ?? [], category?.id),
  )
  const totalCount =
    currentFilters
      ?.find((f) => f.id === 'filter.v.availability')
      ?.values.reduce((prev, curr) => prev + curr.count, 0) ?? 0

  const { nodes, pageInfo } = products

  return {
    products: {
      nodes,
      pageInfo: {
        ...pageInfo,
        pageSize,
        pageSort,
        totalCount,
      },
    },
    filters: currentFilters,
  }
}
