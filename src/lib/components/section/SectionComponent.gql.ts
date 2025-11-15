import { graphql, type FragmentOf } from '../../../graphql'
import { sectionSharedFragment } from './SectionSharedFragment.gql'

export const sectionComponentFragment = graphql(
  `
    fragment SectionComponentFragment on Metaobject @_unmask {
      ...SectionSharedFragment
      description: field(key: "description") {
        value
      }
      component: field(key: "component") {
        value
      }
    }
  `,
  [sectionSharedFragment],
)
export type TSectionComponent = FragmentOf<typeof sectionComponentFragment>
