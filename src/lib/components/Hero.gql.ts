import { graphql, type FragmentOf } from '../../graphql'
import { bookStackFragment } from './BookStack.gql'

export const heroFragment = graphql(
  `
    fragment HeroFragment on Metaobject @_unmask {
      pageTop: field(key: "page_top") {
        reference {
          ... on Metaobject {
            type
            slides: field(key: "slides") {
              references(first: 10) {
                nodes {
                  ... on Metaobject {
                    type
                    title: field(key: "title") {
                      value
                    }
                    text: field(key: "text") {
                      value
                    }
                    ...BookStackFragment
                  }
                }
              }
            }
          }
        }
      }
    }
  `,
  [bookStackFragment],
)
export type THeroFragment = FragmentOf<typeof heroFragment>
