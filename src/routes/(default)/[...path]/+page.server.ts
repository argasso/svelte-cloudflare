import {
  DEFAULT_PAGE_SIZE,
  defaultSortKey,
  getActiveShopifyFilters,
  getCategoryFilterAsTree,
  getEnhancedFilter,
  shortGID,
  sortOptions,
} from '$lib/components/filter/shopifyFilters.js'
import { productsQuery } from '$lib/components/ProductsGrid.svelte'
import { findMenuItem } from '$lib/menu.js'
import { error } from '@sveltejs/kit'
import { pageQuery } from '../../+page.svelte'
import { client } from '../../../client'

export const load = async (event) => {
  const { url, parent } = event

  // Page
  const handle = url.pathname.split('/').at(-1) ?? ''
  const pageResponse = await client.query(pageQuery, { handle }, { fetch })
  if (pageResponse.error) {
    console.error('Page query failed', pageResponse.error)
    error(500, 'Oj, någonting gick snett när vi försökte ladda sidan')
  }
  const page = pageResponse.data?.page
  if (!page) {
    error(404, 'Kan inte hitta sidan')
  }

  // Paging
  const after = url.searchParams.get('after')
  const before = url.searchParams.get('before')
  const pageSize = url.searchParams.get('size')
  const size = pageSize ? parseInt(pageSize) : DEFAULT_PAGE_SIZE
  const navigation = before ? { before, last: size } : { after, first: size }

  // Sorting
  const pageSort = url.searchParams.get('sort')
  const { sortKey, reverse } = sortOptions.find((s) => s.value === pageSort) || defaultSortKey

  // Filtering
  const { initialFilters, menu } = await parent()
  const searchParams = new URLSearchParams(url.searchParams)
  const category = findMenuItem(menu, url.pathname)
  if (category) {
    searchParams.append('category', shortGID(category.id))
  }
  const filters = getActiveShopifyFilters(initialFilters, menu, searchParams)

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
    getCategoryFilterAsTree(f, menu?.children ?? []),
  )
  const totalCount =
    currentFilters
      ?.find((f) => f.id === 'filter.v.availability')
      ?.values.reduce((prev, curr) => prev + curr.count, 0) ?? 0

  const { nodes, pageInfo } = products

  // Links
  const links = findMenuItem(menu, url.pathname)?.children

  return {
    page,
    links,
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
