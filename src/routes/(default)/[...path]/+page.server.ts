import { PageStore, ProductsStore } from '$houdini'
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
import { findMenuItem } from '$lib/menu.js'
import { error } from '@sveltejs/kit'

export const load = async (event) => {
  const { url, parent } = event
  const { initialFilters, menu } = await parent()

  const handle = url.pathname.split('/').at(-1) ?? ''
  const searchParams = new URLSearchParams(url.searchParams)

  // const menu = makeMenu(get(MainMenu).data?.menu)
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

  const pageStore = new PageStore()
  const pageResponse = await pageStore.fetch({ event, variables: { handle } })
  if (pageResponse.errors) {
    console.error('PageStore fetch failed', pageResponse.errors.map((e) => e.message).join(', '))
    error(500, 'Oj, någonting gick snett när vi försökte ladda sidan')
  }

  const productsStore = new ProductsStore()
  const productsResponse = await productsStore.fetch({
    event,
    variables: { filters, first, sortKey, reverse },
  })
  if (productsResponse.errors) {
    console.error(
      'ProductsStore fetch failed',
      productsResponse.errors.map((e) => e.message).join(', '),
    )
    error(500, 'Oj, någonting gick snett när vi försökte ladda sidan')
  }

  // const { Page } = await load_Page({ event, variables: { handle } })
  // const page = get(Page)

  // if (page.errors) {
  //   error(400, page.errors.join(', '))
  // }
  // else if (!page.data) {
  //   console.log('hmm', page )
  //   error(404, 'Oj, vi hittar inte det du söker')
  // }
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
