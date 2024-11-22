import { graphql, type FragmentOf } from '../../../graphql'

export const sectionNewsFragment = graphql(`
  fragment SectionNewsFragment on Metaobject @_unmask {
    id
    title: field(key: "title") {
      value
    }
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
`)
export type TSectionNews = FragmentOf<typeof sectionNewsFragment>
