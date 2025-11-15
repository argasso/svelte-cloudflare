import { graphql, type FragmentOf } from '../../../graphql'
import { sectionSharedFragment } from './SectionSharedFragment.gql'

export const sectionNewsFragment = graphql(
  `
    fragment SectionNewsFragment on Metaobject @_unmask {
      ...SectionSharedFragment
      text: field(key: "text") {
        value
      }
      image: field(key: "image") {
        reference {
          ... on MediaImage {
            image {
              altText
              url
              width
              height
            }
          }
        }
      }
    }
  `,
  [sectionSharedFragment],
)
export type TSectionNews = FragmentOf<typeof sectionNewsFragment>
