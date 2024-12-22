import { graphql, type FragmentOf } from '../../graphql'

export const productSeoFragment = graphql(`
  fragment ProductSeoFragment on Product @_unmask {
    seo {
      title
      description
    }
  }
`)

export type TProductSeoFragment = FragmentOf<typeof productSeoFragment>

export const metaobjecSeoFragment = graphql(`
  fragment MetaobjectSeoFragment on Metaobject @_unmask {
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

export type TMetaobjectSeoFragment = FragmentOf<typeof metaobjecSeoFragment>
