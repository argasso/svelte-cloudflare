import { graphql, type FragmentOf } from '../../../graphql'
import { bookPromo } from '../BookCardPromo.gql'

export const sektionBokgalleri = graphql(
  `
    fragment SektionBokgalleri on Metaobject @_unmask {
      id
      rubrik: field(key: "rubrik") {
        value
      }
      visa: field(key: "visa_antal") {
        value
      }
      varianter: field(key: "variant") {
        references(first: 10) {
          nodes {
            ...BookPromo
          }
        }
      }
    }
  `,
  [bookPromo],
)

let className = ''
export { className as class }
export type TSektionBokgalleri = FragmentOf<typeof sektionBokgalleri>
