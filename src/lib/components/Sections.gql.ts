import { graphql, type FragmentOf } from '../../graphql'
import { sectionNewsFragment } from './section/SectionNews.gql'
import { sektionBokgalleri } from './section/SektionBokgalleri.gql'

export const sectionsFragment = graphql(
  `
    fragment SectionsFragment on Metaobject @_unmask {
      sections: field(key: "sektioner") {
        references(first: 10) {
          nodes {
            ... on Metaobject {
              type
            }
            ...SektionBokgalleri
            ...SectionNewsFragment
          }
        }
      }
    }
  `,
  [sektionBokgalleri, sectionNewsFragment],
)

export type TSectionsFragment = FragmentOf<typeof sectionsFragment>