import { authorsFragment } from '$lib/components/Authors.graphql'
import { priceFragment } from '$lib/components/Price.graphql'
import { productSeoFragment } from '$lib/components/Seo.graphql'
import { graphql } from '../../../graphql'

export const productQuery = graphql(
  `
    query Product($handle: String!, $metafieldIds: [HasMetafieldsIdentifier!]!) {
      product(handle: $handle) {
        id
        title
        handle
        description
        descriptionHtml
        options {
          id
          name
          values
        }
        priceRange {
          maxVariantPrice {
            amount
            currencyCode
          }
          minVariantPrice {
            amount
            currencyCode
          }
        }
        ...AuthorsFragment
        images(first: 1) {
          nodes {
            url
            altText
            height
            width
          }
        }
        variants(first: 3) {
          nodes {
            id
            sku
            title
            barcode
            price {
              ...PriceFragment
            }
            selectedOptions {
              name
              value
            }
            image {
              url
              altText
              height
              width
            }
            discontinued: metafield(namespace: "book", key: "discontinued") {
              value
            }
            metafields(identifiers: $metafieldIds) {
              key
              value
              type
              references(first: 3) {
                nodes {
                  ... on Metaobject {
                    handle
                    title: field(key: "title") {
                      value
                    }
                  }
                }
              }
            }
          }
        }
        ...ProductSeoFragment
      }
    }
  `,
  [authorsFragment, priceFragment, productSeoFragment],
)
