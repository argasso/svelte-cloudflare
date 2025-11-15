import { graphql, type FragmentOf } from '../../../graphql'
import { sectionSharedFragment } from './SectionSharedFragment.gql'

export const sectionDownloadFragment = graphql(
  `
    fragment SectionDownloadFragment on Metaobject @_unmask {
      ...SectionSharedFragment
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
  `,
  [sectionSharedFragment],
)
export type TSectionDownload = FragmentOf<typeof sectionDownloadFragment>
