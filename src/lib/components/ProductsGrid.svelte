<script lang="ts" context="module">
  import { graphql } from '../../graphql'
  import { authorsFragment } from './Authors.svelte'
  import { priceFragment } from './Price.svelte'

  export type TProductsQuery = typeof productsQuery
  export const productsQuery = graphql(
    `
      query Products(
        $sortKey: ProductCollectionSortKeys = TITLE
        $reverse: Boolean = false
        $filters: [ProductFilter!]
        $first: Int
      ) @_unmask {
        collection(handle: "frontpage") {
          products(sortKey: $sortKey, reverse: $reverse, filters: $filters, first: $first) {
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
          }
        }
      }
    `,
    [priceFragment, authorsFragment],
  )
</script>

<script lang="ts">
</script>

TODO move grid to here
