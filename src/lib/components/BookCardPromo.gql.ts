import { graphql, type FragmentOf } from '../../graphql'
import { authorsFragment } from './Authors.graphql'
import { priceFragment } from './Price.graphql'

export const bookPromo = graphql(
  `
    fragment BookPromo on ProductVariant @_unmask {
      id
      title
      sku
      product {
        title
        handle
        description(truncateAt: 160)
        descriptionHtml
        images(first: 1) {
          nodes {
            url
            altText
            height
            width
          }
        }
        ...AuthorsFragment
      }
      image {
        url
        altText
        height
        width
      }
      price {
        ...PriceFragment
      }
      binding: metafield(namespace: "book", key: "binding") {
        value
      }
      publishMonth: metafield(namespace: "book", key: "publish_month") {
        value
      }
      categories: metafield(namespace: "book", key: "category") {
        references(first: 5) {
          nodes {
            ... on Metaobject {
              id
            }
          }
        }
      }
    }
  `,
  [authorsFragment, priceFragment],
)

export type TBookPromo = FragmentOf<typeof bookPromo>
