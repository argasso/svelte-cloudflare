import { graphql, type FragmentOf } from '../../../graphql'

export const sectionDownloadFragment = graphql(`
  fragment SectionDownloadFragment on Metaobject @_unmask {
    id
    name: field(key: "name") {
      value
    }
    description: field(key: "description") {
      value
    }
    file: field(key: "file") {
      reference {
        ... on GenericFile {
          id
          alt
          url
          mimeType
          originalFileSize
          previewImage {
            height
            width
            url
          }
        }
      }
    }
    filename: field(key: "filename") {
      value
    }
  }
`)
export type TSectionDownload = FragmentOf<typeof sectionDownloadFragment>
