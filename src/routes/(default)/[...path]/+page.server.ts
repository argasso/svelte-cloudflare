import {
  DEFAULT_PAGE_SIZE,
  defaultSortKey,
  getActiveShopifyFilters,
  getCategoryFilterAsTree,
  getDecendants,
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
  const { initialFilters, menu } = await parent()

  const handle = url.pathname.split('/').at(-1) ?? ''
  const searchParams = new URLSearchParams(url.searchParams)

  const category = findMenuItem(menu, url.pathname)
  if (category) {
    searchParams.append('category', shortGID(category.id))
  }

  const filters = getActiveShopifyFilters(initialFilters, menu, searchParams)
  const sizeStr = url.searchParams.get('size')
  const first = sizeStr ? parseInt(sizeStr) : DEFAULT_PAGE_SIZE

  const sortStr = url.searchParams.get('sort')
  const { sortKey, reverse } = sortOptions.find((s) => s.value === sortStr) || defaultSortKey

  // const totalCount =
  //   initialFilters
  //     ?.find((f) => f.id === 'filter.v.availability')
  //     ?.values.reduce((prev, curr) => prev + curr.count, 0) ?? 0

  const pageResponse = await client.query(pageQuery, { handle }, { fetch })
  if (pageResponse.error) {
    console.error('PageStore fetch failed', pageResponse.error)
    error(500, 'Oj, någonting gick snett när vi försökte ladda sidan')
  }

  const productsResponse = await client.query(
    productsQuery,
    { filters, first, sortKey, reverse },
    { fetch },
  )
  if (productsResponse.error) {
    console.error('ProductsStore fetch failed', productsResponse.error)
    error(500, 'Oj, någonting gick snett när vi försökte ladda sidan')
  }

  const page = pageResponse.data?.page

  const products = productsResponse.data?.collection?.products
  const books = products?.nodes ?? []
  const productFilters = products?.filters ?? []

  const enhancedFilters = productFilters.map((f) =>
    getEnhancedFilter(f, url.searchParams, initialFilters),
  )
  const currentFilters = enhancedFilters.map((f) =>
    getCategoryFilterAsTree(f, menu?.children ?? []),
  )

  // currentFilters.forEach((f) => {
  //   console.log(f.id, f.values)
  // })

  const appliedFilters = currentFilters
    .flatMap(({ values }) => values.flatMap(getDecendants))
    .filter((v) => v.active)

  const links = findMenuItem(menu, url.pathname)?.children

  return {
    // menu,
    page,
    links,
    books,
    initialFilters,
    currentFilters,
    appliedFilters,
    pageInfo: {
      size: first,
      // totalCount,
    },
  }
}
