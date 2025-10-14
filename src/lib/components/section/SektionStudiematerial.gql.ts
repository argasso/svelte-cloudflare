import { graphql, type FragmentOf } from '../../../graphql'
import { authorsFragment } from '../Authors.graphql'
import { bookPromo } from '../BookCardPromo.gql'
import { genericFileFragment } from '../DownloadButton.gql'
import { priceFragment } from '../Price.graphql'

export const sektionStudiematerial = graphql(
  `
    fragment SektionStudiematerial on Metaobject @_unmask {
      id
      title: field(key: "title") {
        value
      }
      content: field(key: "content") {
        value
      }
      elevmaterial: field(key: "elevmaterial") {
        reference {
          ...GenericFileFragment
        }
      }
      lararmaterial: field(key: "lararmaterial") {
        reference {
          ...GenericFileFragment
        }
      }
      bok: field(key: "bok") {
        reference {
          ... on Product {
            title
            handle
            description(truncateAt: 160)
            descriptionHtml
            images(first: 1) {
              nodes {
                url
                altText
                height
                width
              }
            }
            ...AuthorsFragment
            variants(first: 1) {
              nodes {
                id
                title
                sku
                image {
                  url
                  altText
                  height
                  width
                }
                price {
                  ...PriceFragment
                }
                binding: metafield(namespace: "book", key: "binding") {
                  value
                }
                discontinued: metafield(namespace: "book", key: "discontinued") {
                  value
                }
                bokfynd: metafield(namespace: "book", key: "bokfynd") {
                  value
                }
                publishMonth: metafield(namespace: "book", key: "publish_month") {
                  value
                }
                category: metafield(namespace: "book", key: "category") {
                  value
                }
                categories: metafield(namespace: "book", key: "category") {
                  references(first: 5) {
                    nodes {
                      ... on Metaobject {
                        id
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `,
  [genericFileFragment, authorsFragment, priceFragment],
)

let className = ''
export { className as class }
export type TSektionStudiematerial = FragmentOf<typeof sektionStudiematerial>
