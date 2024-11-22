import { graphql, type FragmentOf } from '../../graphql'

export const seoFragment = graphql(`
  fragment SeoFragment on Metaobject @_unmask {
    seo {
      title {
        value
      }
      description {
        value
      }
    }
  }
`)

export type TSeoFragment = FragmentOf<typeof seoFragment>
