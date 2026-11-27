import { authorsFragment } from '$lib/components/Authors.graphql'
import { priceFragment } from '$lib/components/Price.graphql'
import { productSeoFragment } from '$lib/components/Seo.graphql'
import { graphql } from '../../../graphql'

// Searches the whole catalog (not just the "frontpage" collection), since
// recommendation matches (series/author) may include products that aren't
// in that collection, e.g. upcoming unreleased books.
export const relatedBooksQuery = graphql(
  `
    query RelatedBooks($query: String!, $first: Int!) {
      products(first: $first, query: $query) {
        nodes {
          id
          title
          handle
          images(first: 1) {
            nodes {
              url
              altText
              height
              width
            }
          }
          ...AuthorsFragment
          variants(first: 3) {
            nodes {
              id
              price {
                ...PriceFragment
              }
              discontinued: metafield(namespace: "book", key: "discontinued") {
                value
              }
              binding: metafield(namespace: "book", key: "binding") {
                value
              }
            }
          }
        }
      }
    }
  `,
  [authorsFragment, priceFragment],
)

export type TRelatedBooksQuery = typeof relatedBooksQuery

export const productQuery = graphql(
  `
    query Product($handle: String!, $metafieldIds: [HasMetafieldsIdentifier!]!) {
      productRecommendations(productHandle: $handle, intent: COMPLEMENTARY) {
        id
        title
        handle
        images(first: 1) {
          nodes {
            url
            altText
            height
            width
          }
        }
        ...AuthorsFragment
        variants(first: 3) {
          nodes {
            id
            price {
              ...PriceFragment
            }
            discontinued: metafield(namespace: "book", key: "discontinued") {
              value
            }
            binding: metafield(namespace: "book", key: "binding") {
              value
            }
          }
        }
      }
      product(handle: $handle) {
        id
        title
        handle
        tags
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
            bokfynd: metafield(namespace: "book", key: "bokfynd") {
              value
            }
            category: metafield(namespace: "book", key: "category") {
              value
            }
            binding: metafield(namespace: "book", key: "binding") {
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
                    name: field(key: "name") {
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
