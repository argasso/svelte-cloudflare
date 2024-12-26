import {
  DEFAULT_PAGE_SIZE,
  defaultSortKey,
  getActiveShopifyFilters,
  getCategoryFilterAsTree,
  getEnhancedFilter,
  shortGID,
  sortOptions,
  type ProductFilter,
} from '$lib/components/filter/shopifyFilters.js'
import { productsQuery, type TProductsQuery } from '$lib/components/ProductsGrid.gql'
import { error, redirect } from '@sveltejs/kit'
import { pageQuery } from '$lib/gql/page.gql.js'
import { findMenuItem, getPathToItem } from '$lib/menu'
import { client } from '../../client'
import { filtersQuery } from '$lib/components/filter/Filters.gql.js'
import type { ResultOf, VariablesOf } from '../../graphql'
import { isType } from '$lib'
import type { FileInfoType } from '../api/files/[handle]/info/+server'
// import type { ResultOf, VariablesOf } from '../../../graphql'
// import type { TProductsQuery } from '../../ProductsGrid.gql'

export const load = async (event) => {
  const { parent, url, fetch } = event
  const { menu } = await parent()
  // const path = url.pathname.split('/').slice(0, -1).join('/')
  const crumbs = getPathToItem(findMenuItem(menu, url.pathname))

  // Page
  const handle = url.pathname.split('/').at(-1) ?? ''
  const pageResponse = await client.query(pageQuery, { handle }, { fetch })
  if (pageResponse.error) {
    console.error('Page query failed', pageResponse.error)
    error(500, 'Oj, någonting gick snett när vi försökte ladda sidan')
  }
  const page = pageResponse.data?.page

  const sections = page?.sections?.references?.nodes.map(async (node) => {
    if (isType('Metaobject')(node)) {
      if (node.type === 'section_download') {
        const filename = node.filename?.value
        if (filename) {
          const rsp = await fetch(`/api/files/${filename}/info`)
          if (rsp.ok) {
            const info = (await rsp.json()) as FileInfoType
            return {
              ...node,
              ...info,
            }
          }
        }
      }
    }
    return node
  })

  // Links
  const links = findMenuItem(menu, url.pathname)?.children

  // Filter
  const filterResponse = await client.query(filtersQuery, {}, { fetch })
  if (filterResponse.error) {
    console.error('FiltersQuery failed', filterResponse.error)
    error(500, 'Oj, någonting gick snett när vi försökte ladda sidan')
  }
  const initialFilters = filterResponse.data?.collection?.products.filters ?? []
  const searchParams = new URLSearchParams(url.searchParams)

  // Sorting
  const size = searchParams.get('size')
  const sort = searchParams.get('sort')

  // Reset
  const reset = searchParams.get('reset')
  if (reset) {
    searchParams.delete('reset')
    initialFilters
      .map((f) => getEnhancedFilter(f, url.searchParams, initialFilters))
      .flatMap((f) => f.values)
      .filter((v) => v.id === reset || 'filters' === reset)
      .forEach((v) => {
        if (v.filterType === 'PRICE_RANGE') {
          const values = v.value.split(' ')
          searchParams.delete(v.key, values[0])
          searchParams.delete(v.key, values[1])
        } else {
          searchParams.delete(v.key, v.value)
        }
      })
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
  const shopifySearchParams = new URLSearchParams(searchParams)
  const category = findMenuItem(menu, url.pathname)
  if (category) {
    shopifySearchParams.append('category', shortGID(category.id))
  }
  const filters = getActiveShopifyFilters(initialFilters, menu, shopifySearchParams)

  // Products
  const productsData = await getProducts({ ...navigation, sortKey, reverse, filters })

  const enhancedFilters = productsData?.filters.map((f) =>
    getEnhancedFilter(f, searchParams, initialFilters),
  )
  const currentFilters = enhancedFilters?.map((f) =>
    getCategoryFilterAsTree(f, menu?.children ?? [], category?.id),
  )
  const totalCount =
    currentFilters
      ?.find((f) => f.id === 'filter.v.availability')
      ?.values.reduce((prev, curr) => prev + curr.count, 0) ?? 0

  const products =
    productsData && currentFilters
      ? {
          ...productsData,
          pageSize,
          pageSort,
          totalCount,
          filters: currentFilters,
        }
      : undefined

  return {
    crumbs,
    page,
    sections,
    links,
    initialFilters,
    products,
  }
}

async function getProducts(variables: NonNullable<VariablesOf<TProductsQuery>>) {
  if (variables.filters?.length === 0) {
    return
  }

  const productsResponse = await client.query(productsQuery, variables, { fetch })
  if (productsResponse.error) {
    console.error('ProductsStore fetch failed', productsResponse.error)
    error(500, 'Oj, någonting gick snett när vi försökte ladda sidan')
  }

  return productsResponse.data?.collection?.products
}
