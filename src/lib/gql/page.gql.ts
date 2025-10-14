import { menuFragment } from '$lib/components/NavMenu.gql'
import { sectionsFragment } from '$lib/components/Sections.gql'
import { metaobjecSeoFragment } from '$lib/components/Seo.graphql'
import { graphql } from '../../graphql'

export const pageQuery = graphql(
  `
    query Page($handle: String!) {
      page: metaobject(handle: { handle: $handle, type: "page" }) {
        ...MenuFragment
        content: field(key: "content") {
          value
        }
        children: field(key: "sub_pages") {
          references(first: 10) {
            nodes {
              ... on Metaobject {
                ...MenuFragment
              }
            }
          }
        }
        ...SectionsFragment
        ...MetaobjectSeoFragment
      }
    }
  `,
  [menuFragment, sectionsFragment, metaobjecSeoFragment],
)

export const imageFragment = graphql(`
  fragment ImageFragment on Image @_unmask {
    altText
    height
    width
    url
  }
`)

export const categoryProductsQuery = graphql(
  `
    query CategoryProducts(
      $first: Int = 3
      $c0: String = ""
      $c1: String = ""
      $c2: String = ""
      $c3: String = ""
      $c4: String = ""
      $c5: String = ""
      $c6: String = ""
      $c7: String = ""
      $c8: String = ""
      $c9: String = ""
    ) {
      collection(handle: "frontpage") {
        c0: products(
          first: $first
          filters: [{ variantMetafield: { namespace: "book", key: "category", value: $c0 } }]
        ) {
          nodes {
            image: featuredImage {
              ...ImageFragment
            }
          }
        }
        c1: products(
          first: $first
          filters: [{ variantMetafield: { namespace: "book", key: "category", value: $c1 } }]
        ) {
          nodes {
            image: featuredImage {
              ...ImageFragment
            }
          }
        }
        c2: products(
          first: $first
          filters: [{ variantMetafield: { namespace: "book", key: "category", value: $c2 } }]
        ) {
          nodes {
            image: featuredImage {
              ...ImageFragment
            }
          }
        }
        c3: products(
          first: $first
          filters: [{ variantMetafield: { namespace: "book", key: "category", value: $c3 } }]
        ) {
          nodes {
            image: featuredImage {
              ...ImageFragment
            }
          }
        }
        c4: products(
          first: $first
          filters: [{ variantMetafield: { namespace: "book", key: "category", value: $c4 } }]
        ) {
          nodes {
            image: featuredImage {
              ...ImageFragment
            }
          }
        }
        c5: products(
          first: $first
          filters: [{ variantMetafield: { namespace: "book", key: "category", value: $c5 } }]
        ) {
          nodes {
            image: featuredImage {
              ...ImageFragment
            }
          }
        }
        c6: products(
          first: $first
          filters: [{ variantMetafield: { namespace: "book", key: "category", value: $c6 } }]
        ) {
          nodes {
            image: featuredImage {
              ...ImageFragment
            }
          }
        }
        c7: products(
          first: $first
          filters: [{ variantMetafield: { namespace: "book", key: "category", value: $c7 } }]
        ) {
          nodes {
            image: featuredImage {
              ...ImageFragment
            }
          }
        }
        c8: products(
          first: $first
          filters: [{ variantMetafield: { namespace: "book", key: "category", value: $c8 } }]
        ) {
          nodes {
            image: featuredImage {
              ...ImageFragment
            }
          }
        }
        c9: products(
          first: $first
          filters: [{ variantMetafield: { namespace: "book", key: "category", value: $c9 } }]
        ) {
          nodes {
            image: featuredImage {
              ...ImageFragment
            }
          }
        }
      }
    }
  `,
  [imageFragment],
)
