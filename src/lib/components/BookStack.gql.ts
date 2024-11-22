import { graphql, type FragmentOf } from '../../graphql'

export const bookStackFragment = graphql(`
  fragment BookStackFragment on Metaobject @_unmask {
    books: field(key: "books") {
      references(first: 10) {
        nodes {
          ... on Product {
            title
            images(first: 1) {
              nodes {
                url
                altText
                height
                width
              }
            }
          }
        }
      }
    }
  }
`)

export type TBookStackFragment = FragmentOf<typeof bookStackFragment>
