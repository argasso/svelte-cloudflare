import { graphql, type FragmentOf } from '../../graphql'
import { authorsFragment } from './Authors.graphql'
import { priceFragment } from './Price.graphql'

export const bookPromo = graphql(
  `
    fragment BookPromo on Product @_unmask {
      id
      title
      handle
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
      variants(first: 1) {
        nodes {
          price {
            ...PriceFragment
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
      }
    }
  `,
  [authorsFragment, priceFragment],
)

export type TBookPromo = FragmentOf<typeof bookPromo>
