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
import { findMenuItem, makeMenu } from '$lib/menu.js'
import { error, redirect } from '@sveltejs/kit'
import { pageQuery } from '../../+page.svelte'
import { client } from '../../../client'
import { cartAdd } from '$lib/cartService'
import { mainMenuQuery } from '$lib/components/NavMenu.svelte'
import { filtersQuery } from '$lib/components/filter/Filters.svelte'

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

  const size = url.searchParams.get('size')
  const sort = url.searchParams.get('sort')

  // Reset
  if (url.searchParams.get('reset') === 'filters') {
    const location = new URL(url.pathname, url.origin)
    if (size) {
      location.searchParams.append('size', size)
    }
    if (sort) {
      location.searchParams.append('sort', sort)
    }
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
  const { initialFilters, menu } = await parent()
  const filtersOn = url.searchParams.get('filters')?.toString() === 'on'
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
    getCategoryFilterAsTree(f, menu?.children ?? [], category?.id),
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
    filtersOn,
  }
}

export const actions = {
  reset: async (event) => {
    console.log('url', event.url)

    redirect(303, 'bocker')
  },
  filter: async (event) => {
    const filterResponse = await client.query(filtersQuery, {}, { fetch })
    if (filterResponse.error) {
      console.error('FiltersQuery failed', filterResponse.error)
      error(500, 'Oj, någonting gick snett när vi försökte ladda sidan')
    }

    const mainMenuResponse = await client.query(mainMenuQuery, {}, { fetch })
    if (mainMenuResponse.error) {
      console.error('MainMenuQuery failed', mainMenuResponse.error)
      error(500, 'Oj, någonting gick snett när vi försökte ladda sidan')
    }

    const menu = makeMenu(mainMenuResponse.data?.menu)
    const initialFilters = filterResponse.data?.collection?.products.filters ?? []

    // Paging
    const formData = await event.request.formData()
    const after = formData.get('after')?.toString()
    const before = formData.get('before')?.toString()
    const size = formData.get('size')?.toString()
    const pageSize = size ? parseInt(size) : DEFAULT_PAGE_SIZE
    const navigation = before ? { before, last: pageSize } : { after, first: pageSize }

    // Sorting
    const pageSort = formData.get('sort') ?? defaultSortKey.value
    const { sortKey, reverse } = sortOptions.find((s) => s.value === pageSort) ?? defaultSortKey

    // Filtering

    const searchParams = new URLSearchParams()
    formData.forEach((value, key) => {
      searchParams.set(key, value.toString())
    })
    const category = findMenuItem(menu, event.url.pathname)
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
      getEnhancedFilter(f, searchParams, initialFilters),
    )
    const currentFilters = enhancedFilters.map((f) =>
      getCategoryFilterAsTree(f, menu?.children ?? []),
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
  },
}
