import { graphql, type FragmentOf } from '../../../graphql'

export const sectionSharedFragment = graphql(`
  fragment SectionSharedFragment on Metaobject @_unmask {
    id
    handle
    rubrik: field(key: "rubrik") {
      value
    }
  }
`)
export type TSectionSharedFragment = FragmentOf<typeof sectionSharedFragment>
