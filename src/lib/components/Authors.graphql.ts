import { graphql, type FragmentOf } from '../../graphql'

export const authorsFragment = graphql(`
  fragment AuthorsFragment on Product @_unmask {
    authors: metafield(namespace: "custom", key: "authors") {
      references(first: 3) {
        nodes {
          ... on Metaobject {
            id
            handle
            name: field(key: "name") {
              value
            }
          }
        }
      }
    }
  }
`)

export type TAuthors = FragmentOf<typeof authorsFragment>
