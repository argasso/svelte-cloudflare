import { getByType, isType } from '$lib'
import { filtersQuery } from '$lib/components/filter/Filters.gql.js'
import {
  DEFAULT_PAGE_SIZE,
  defaultSortKey,
  getActiveShopifyFilters,
  getCategoryFilterAsTree,
  getEnhancedFilter,
  shortGID,
  sortOptions,
} from '$lib/components/filter/shopifyFilters.js'
import { productsQuery, type TProductsQuery } from '$lib/components/ProductsGrid.gql'
import type { sectionDownloadFragment } from '$lib/components/section/SectionDownload.gql'
import { categoryProductsQuery, imageFragment, pageQuery } from '$lib/gql/page.gql.js'
import { findMenuItem, getPathToItem, type MenuItem } from '$lib/menu'
import { error, type ServerLoadEvent } from '@sveltejs/kit'
import { client } from '../../client'
import type { FragmentOf, VariablesOf } from '../../graphql'
import type { FileInfoType } from '../api/files/[handle]/info/+server'

export const load = async (event) => {
  const { parent, url, fetch } = event
  const { menu } = await parent()
  // const path = url.pathname.split('/').slice(0, -1).join('/')
  const menuItem = findMenuItem(menu, url.pathname)
  const crumbs = getPathToItem(menuItem)

  // Page
  const handle = url.pathname.split('/').at(-1) ?? ''
  const pageResponse = await client.query(pageQuery, { handle }, { fetch })
  if (pageResponse.error) {
    console.error('Page query failed', pageResponse.error)
    error(500, 'Oj, någonting gick snett när vi försökte ladda sidan')
  }
  const pageData = pageResponse.data?.page

  // Links
  const links = (await decorateCategoryImages(menuItem?.children))?.filter(
    (i) => !url.pathname.startsWith('/bocker') || (i.images?.length ?? 0) > 0,
  )

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
          queryParams: {
            after,
            before,
            size,
            sort,
          },
          pageSize,
          pageSort,
          totalCount,
          filters: currentFilters,
        }
      : undefined

  const decoratedSections = pageData?.sections?.references?.nodes.map(async (node) => {
    if (isType('Metaobject')(node) && node.type === 'section_download') {
      return decorateDownload(node, event)
    }
    return node
  })

  const nodes = decoratedSections ? await Promise.all(decoratedSections) : []

  const page = pageData
    ? {
        ...pageData,
        sections: {
          references: { nodes },
        },
      }
    : undefined

  return {
    crumbs,
    page,
    links,
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

type TSectionDownload = FragmentOf<typeof sectionDownloadFragment>
async function decorateDownload(
  node: TSectionDownload,
  event: ServerLoadEvent,
): Promise<TSectionDownload> {
  const { fetch } = event
  const filename = node.filename?.value
  if (filename) {
    const rsp = await fetch(`/api/files/${filename}/info`)
    if (rsp.ok) {
      const info = (await rsp.json()) as FileInfoType
      return {
        ...node,
        file: {
          reference: {
            __typename: 'GenericFile',
            id: info.key,
            alt: 'Cloudflare file',
            originalFileSize: info.size,
            mimeType: info.httpMetadata?.contentType ?? null,
            url: `/api/files/${filename}`,
            previewImage: {
              url: '',
              height: null,
              width: null,
            },
          },
        },
      }
    } else {
      console.warn('Failed to fetch file for section download. ', rsp.statusText)
    }
  }

  const value = node.file?.reference
    ? (getByType('GenericFile', node.file.reference)?.url?.split('/').at(-1) ?? null)
    : (node.filename?.value ?? null)
  return {
    ...node,
    filename: {
      value,
    },
  }
}

type DecoratedMenuItem = MenuItem & {
  images?: (FragmentOf<typeof imageFragment> | null)[]
}
async function decorateCategoryImages(
  links?: MenuItem[],
): Promise<DecoratedMenuItem[] | undefined> {
  if (links && links.length > 0) {
    const variables = Object.fromEntries(
      links.map(({ id }, i) => [`c${i}`, id]) ?? [],
    ) satisfies VariablesOf<typeof categoryProductsQuery>

    const response = await client.query(categoryProductsQuery, variables, { fetch })

    const imageMap = new Map(
      Object.entries(response.data?.collection ?? {})
        .filter(([k, v]) => k.startsWith('c') && v.nodes.length > 0)
        .map(([k, v]) => {
          const key = variables[k]
          const val = v.nodes.map((v) => v.image)
          return [key, val]
        }),
    )
    return links.map((link) => ({
      ...link,
      images: imageMap.get(link.id),
    }))
  }
  return links
}
