import { graphql, type FragmentOf } from '../../../graphql'

export const sectionComponentFragment = graphql(`
  fragment SectionComponentFragment on Metaobject @_unmask {
    id
    name: field(key: "name") {
      value
    }
    description: field(key: "description") {
      value
    }
    component: field(key: "component") {
      value
    }
  }
`)
export type TSectionComponent = FragmentOf<typeof sectionComponentFragment>
