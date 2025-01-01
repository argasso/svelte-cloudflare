import { graphql, type ResultOf } from '../../graphql'
import { authorsFragment } from './Authors.graphql'
import type { EnhancedFilter } from './filter/shopifyFilters'
import { priceFragment } from './Price.graphql'

export const pageInfoFragment = graphql(`
  fragment PageInfo on ProductConnection @_unmask {
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
`)

export const productsQuery = graphql(
  `
    query Products(
      $sortKey: ProductCollectionSortKeys = TITLE
      $reverse: Boolean = false
      $filters: [ProductFilter!]
      $first: Int
      $after: String
      $last: Int
      $before: String
    ) @_unmask {
      collection(handle: "frontpage") {
        products(
          sortKey: $sortKey
          reverse: $reverse
          filters: $filters
          first: $first
          after: $after
          last: $last
          before: $before
        ) {
          nodes {
            id
            title
            handle
            images(first: 1) {
              nodes {
                url
                altText
                height
                width
              }
            }
            ...AuthorsFragment
            variants(first: 3) {
              nodes {
                id
                price {
                  ...PriceFragment
                }
                discontinued: metafield(namespace: "book", key: "discontinued") {
                  value
                }
              }
            }
          }
          filters {
            id
            label
            type
            values {
              count
              id
              input
              label
            }
          }
          ...PageInfo
        }
      }
    }
  `,
  [priceFragment, authorsFragment, pageInfoFragment],
)

export type TProductsQuery = typeof productsQuery

export type TProductsServerResult = NonNullable<ResultOf<TProductsQuery>['collection']>['products']

export type TProducts = Omit<TProductsServerResult, 'filters'> & {
  queryParams: {
    after?: string
    before?: string
    size?: string
    sort?: string
  }
  pageSort: string
  pageSize: number
  totalCount: number
  filters: EnhancedFilter[]
}

export type TPageInfo = ResultOf<typeof pageInfoFragment>['pageInfo']
